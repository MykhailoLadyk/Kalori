import "@supabase/functions-js/edge-runtime.d.ts";
import { importPKCS8, SignJWT } from "npm:jose@5.9.6";

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
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return new Response(
        JSON.stringify({ error: "Missing imageBase64 or mimeType" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const projectId = Deno.env.get("GOOGLE_CLOUD_PROJECT_ID")!;
    const accessToken = await getAccessToken();

    const prompt = `
    You are a food recognition and nutrition estimation engine.



TASK:

Analyze the provided image and identify ONLY foods that are visibly present.



OUTPUT REQUIREMENT:

Return ONLY a single valid JSON object.

Do not return markdown.

Do not return explanations.

Do not return code fences.

Do not return any text before or after the JSON.



JSON SCHEMA (must match exactly):



{

"foods": [

{

"name": "string",

"portion": "string",

"calories": 0,

"protein_g": 0,

"carbs_g": 0,

"fat_g": 0,

"fiber_g": 0

}

],

"meal_total": {

"calories": 0,

"protein_g": 0,

"carbs_g": 0,

"fat_g": 0,

"fiber_g": 0

},

"confidence": "high",

"notes": "string"

}



MANDATORY RULES:



JSON ONLY

Output must begin with "{"

Output must end with "}"

No markdown

No code fences

No comments

No extra keys

No omitted keys

FOOD DETECTION

Identify only foods that are clearly visible.

Never infer hidden ingredients.

Never infer cooking oils, butter, sauces, seasonings, dressings, toppings, fillings, or side dishes unless visibly present.

Never add foods that are not visible.

PORTION ESTIMATION

Estimate portion from visible size only.

Use units such as:

"100g"

"250g"

"1 cup"

"2 slices"

"1 piece"

If uncertain, provide best estimate and mention uncertainty in notes.

NUTRITION VALUES

All nutrition values must be integers.

Round to nearest whole number.

No decimals.

No strings for numeric fields.

MULTIPLE FOODS

Each visible food must appear as exactly one item in the foods array.

Do not split a single visible food into ingredients unless visually distinguishable.

TOTALS

meal_total values must equal the sum of all food items after rounding.

CONFIDENCE

high = food clearly visible and recognizable

medium = food recognizable but portion uncertain

low = food partially visible, blurry, distant, obstructed, or ambiguous

NO FOOD DETECTED

If no identifiable food is visible, return EXACTLY:



{"error":"No food detected"}



INVALID IMAGE

If the image is missing, unreadable, corrupted, contains only text, contains only people, contains only objects, or contains no food, return EXACTLY:



{"error":"No food detected"}



HALLUCINATION PREVENTION

Never guess ingredients.

Never guess recipes.

Never guess preparation methods.

Never guess oils.

Never guess condiments.

Never guess beverages unless visible.

Never guess side dishes outside the image.

STRICT VALIDATION

Before responding, verify:

JSON is valid.

All required fields exist.

All numbers are integers.

meal_total equals sum of foods.

confidence is one of: high, medium, low.

Output contains nothing except the JSON object.
`
;

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
            parts: [
              { inlineData: { mimeType, data: imageBase64 } },
              { text: prompt },
            ],
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
