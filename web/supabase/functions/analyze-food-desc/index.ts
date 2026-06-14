import "@supabase/functions-js/edge-runtime.d.ts";
import { importPKCS8, SignJWT } from "npm:jose@5.9.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function getAccessToken(): Promise<string> {
  const sa = JSON.parse(Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS")!);
  const now = Math.floor(Date.now() / 1000);
  const privateKey = await importPKCS8(sa.private_key, "RS256");

  const jwt = await new SignJWT({
    scope: "https://www.googleapis.com/auth/cloud-platform",
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(sa.client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey);

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
    const { description } = await req.json();

    const projectId = Deno.env.get("GOOGLE_CLOUD_PROJECT_ID")!;
    const accessToken = await getAccessToken();

    const response = await fetch(
      `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-2.5-flash-lite:generateContent`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text:
`
You are a nutrition expert. Analyze the provided text description of a meal(${description})
Respond ONLY with a valid, raw JSON object. Do not include any conversational text, no markdown formatting, and absolutely no code fences or backticks 

Use exactly this structure:
{
  "foods": [
    {
      "name": "food item name",
      "portion": "estimated portion e.g. 150g or 1 cup",
      "calories": 000,
      "protein_g": 00,
      "carbs_g": 00,
      "fat_g": 00,
      "fiber_g": 00
    }
  ],
  "meal_total": {
    "calories": 000,
    "protein_g": 00,
    "carbs_g": 00,
    "fat_g": 00,
    "fiber_g": 00
  },
  "confidence": "high | medium | low",
  "notes": "any caveats about the estimate or missing portion details"
}

Strict Extraction Rules:
1. EXCLUSIVITY: Extract ONLY the specific food items explicitly mentioned in the user's text description. Do NOT invent, assume, or append any extra ingredients, sides, condiments, or cooking oils (such as chicken, broccoli, or olive oil) if they are not explicitly written.
2. MINIMAL INPUT HANDLING: If the user input contains only one food item (e.g., "rice"), the "foods" array must contain exactly one object for that specific item. 
3. MACRONUTRIENT ACCURACY: Calculate nutritional values based strictly on the items provided. All numbers must be integers (round to the nearest whole number).
4. NO FOOD RULE: If the text description does not contain legible food items, or if no food can be identified, return exactly this object: { "error": "No food detected" }
5. VALIDATION: Output must begin with '{' and end with '}'. Never return any content outside the single JSON object. Do not use training examples as fallback data.
 `,
            }],
          }],
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Vertex API error: ${JSON.stringify(result)}`);
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

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
