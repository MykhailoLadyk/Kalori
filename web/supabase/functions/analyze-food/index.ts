import "@supabase/functions-js/edge-runtime.d.ts";
import { importPKCS8, SignJWT } from "jose";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function getAccessToken(): Promise<string> {
  const serviceAccountJson = Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS")!;
  const sa = JSON.parse(serviceAccountJson);

  const now = Math.floor(Date.now() / 1000);

  // Import the private key using jose
  const privateKey = await importPKCS8(sa.private_key, "RS256");

  // Sign the JWT
  const jwt = await new SignJWT({
    scope: "https://www.googleapis.com/auth/cloud-platform",
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(sa.client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey);

  // Exchange JWT for Google access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:
      `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    throw new Error(`Failed to get access token: ${JSON.stringify(tokenData)}`);
  }

  return tokenData.access_token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageBase64, mimeType, localDate } = await req.json();

    if (!imageBase64 || !mimeType) {
      return new Response(
        JSON.stringify({ error: "Missing imageBase64 or mimeType" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use client localDate to prevent timezone mismatch blocking users prematurely
    const today = localDate || new Date().toISOString().slice(0, 10);
    const { data: usage } = await supabase
      .from("ai_usage")
      .select("request_count")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    if (usage && usage.request_count >= 20) {
      return new Response(
        JSON.stringify({ error: "Daily AI limit reached (20 requests per day)" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Increment usage securely via RPC
    const { error: rpcError } = await supabase.rpc("increment_ai_usage");

    if (rpcError) {
      console.error("RPC Error:", rpcError);
      return new Response(
        JSON.stringify({ error: "Failed to track AI usage", details: rpcError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const projectId = Deno.env.get("GOOGLE_CLOUD_PROJECT_ID")!;
    const accessToken = await getAccessToken();

    const systemInstruction = `You are a nutrition estimator. Analyze the image and identify ONLY visibly present foods.

Rules:
1. Identify ONLY foods clearly visible. Do not infer hidden ingredients (oils, sauces, seasonings) unless visible.
2. Estimate portions from visible size (e.g. "100g", "1 cup").
3. Do not guess recipes, preparation methods, or unseen side dishes.
4. If no food is clearly visible, or if the image is blurry, unreadable, or not primarily focused on food, return {"error": "No food detected"}.`;

    const responseSchema = {
      type: "OBJECT",
      properties: {
        error: { type: "STRING" },
        name: { type: "STRING" },
        confidence: { type: "STRING" },
        notes: { type: "STRING" },
        foods: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              portion: { type: "STRING" },
              calories: { type: "INTEGER" },
              protein_g: { type: "INTEGER" },
              carbs_g: { type: "INTEGER" },
              fat_g: { type: "INTEGER" },
              fiber_g: { type: "INTEGER" }
            }
          }
        },
        meal_total: {
          type: "OBJECT",
          properties: {
            calories: { type: "INTEGER" },
            protein_g: { type: "INTEGER" },
            carbs_g: { type: "INTEGER" },
            fat_g: { type: "INTEGER" },
            fiber_g: { type: "INTEGER" }
          }
        }
      }
    };

    const response = await fetch(
      `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-2.5-flash-lite:generateContent`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: [{
            role: "user",
            parts: [
              { inlineData: { mimeType, data: imageBase64 } }
            ],
          }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          },
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Vertex API error: ${JSON.stringify(result)}`);
    }

    let text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    try {
      if (text) {
        const parsed = JSON.parse(text);
        if (parsed.foods && Array.isArray(parsed.foods)) {
          parsed.meal_total = {
            calories: parsed.foods.reduce((acc: number, f: any) => acc + (f.calories || 0), 0),
            protein_g: parsed.foods.reduce((acc: number, f: any) => acc + (f.protein_g || 0), 0),
            carbs_g: parsed.foods.reduce((acc: number, f: any) => acc + (f.carbs_g || 0), 0),
            fat_g: parsed.foods.reduce((acc: number, f: any) => acc + (f.fat_g || 0), 0),
            fiber_g: parsed.foods.reduce((acc: number, f: any) => acc + (f.fiber_g || 0), 0),
          };
          text = JSON.stringify(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse and calculate totals programmatically:", e);
    }

    return new Response(JSON.stringify(text), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
