import { importPKCS8, SignJWT } from "jose";

// --- In-memory token cache ---
let cachedToken: string | null = null;
let tokenExpiresAt = 0; // Unix seconds

const TOKEN_REFRESH_MARGIN_SEC = 300; // Refresh 5 min before expiry

/**
 * Returns a Google Cloud access token, using an in-memory cache.
 * Re-fetches only when the token is within 5 minutes of expiry.
 */
export async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  if (cachedToken && now < tokenExpiresAt - TOKEN_REFRESH_MARGIN_SEC) {
    return cachedToken;
  }

  const serviceAccountJson = Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS")!;
  const sa = JSON.parse(serviceAccountJson);

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

  cachedToken = tokenData.access_token;
  tokenExpiresAt = now + (tokenData.expires_in ?? 3600);

  return cachedToken!;
}

// --- Shared response schema for nutrition analysis ---

export const nutritionResponseSchema = {
  type: "OBJECT",
  required: ["name", "foods", "meal_total"],
  properties: {
    error: { type: "STRING" },
    name: { type: "STRING" },
    confidence: { type: "STRING" },
    notes: { type: "STRING" },
    foods: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        required: [
          "name",
          "portion",
          "calories",
          "protein_g",
          "carbs_g",
          "fat_g",
        ],
        properties: {
          name: { type: "STRING" },
          portion: { type: "STRING" },
          calories: { type: "INTEGER" },
          protein_g: { type: "INTEGER" },
          carbs_g: { type: "INTEGER" },
          fat_g: { type: "INTEGER" },
          fiber_g: { type: "INTEGER" },
        },
      },
    },
    meal_total: {
      type: "OBJECT",
      required: ["calories", "protein_g", "carbs_g", "fat_g"],
      properties: {
        calories: { type: "INTEGER" },
        protein_g: { type: "INTEGER" },
        carbs_g: { type: "INTEGER" },
        fat_g: { type: "INTEGER" },
        fiber_g: { type: "INTEGER" },
      },
    },
  },
};

// --- Vertex AI call ---

interface VertexAIContent {
  role: string;
  parts: Array<Record<string, unknown>>;
}

export async function callVertexAI(
  contents: VertexAIContent[],
  systemInstruction: string,
): Promise<Record<string, unknown>> {
  const projectId = Deno.env.get("GOOGLE_CLOUD_PROJECT_ID")!;
  const accessToken = await getAccessToken();

  const maxRetries = 3;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      // Use the global endpoint to dynamically route traffic and reduce 429s
      const response = await fetch(
        `https://aiplatform.googleapis.com/v1/projects/${projectId}/locations/global/publishers/google/models/gemini-2.5-flash-lite:generateContent`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
            contents,
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json",
              responseSchema: nutritionResponseSchema,
            },
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        // If we hit a 429 and haven't exceeded max retries, throw a specific error to trigger backoff
        if (response.status === 429 && attempt < maxRetries) {
          throw new Error("429");
        }
        throw new Error(
          `Vertex API error (${response.status}): ${JSON.stringify(result)}`,
        );
      }

      return result;
    } catch (error) {
      if (error instanceof Error && error.message === "429") {
        attempt++;
        // Exponential backoff with jitter: 2s, 4s, 8s + random ms
        const backoffTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        console.warn(`[Vertex AI] 429 Resource Exhausted. Retrying in ${Math.round(backoffTime)}ms... (Attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      } else {
        throw error;
      }
    }
  }

  throw new Error("Vertex AI: Max retries exceeded");
}

// --- Response parsing & normalization ---

interface NutritionData {
  error?: string;
  name?: string;
  confidence?: string;
  notes?: string;
  foods?: Array<{
    name: string;
    portion: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
  }>;
  meal_total?: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
  };
}



/**
 * Extracts the text response from Vertex AI, parses it as JSON,
 * and recalculates meal_total from the individual foods array
 * to ensure accuracy.
 */
export function parseVertexResponse(
  result: Record<string, unknown>,
): NutritionData {
  const candidates = result.candidates as
    | Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>
    | undefined;

  const text = candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!text) {
    return { error: "No response from AI model" };
  }

  const parsed: NutritionData = JSON.parse(text);

  // If the AI didn't provide meal_total or it's empty/zero, recalculate it from foods
  const hasValidTotal = parsed.meal_total &&
    (parsed.meal_total.calories > 0 || parsed.meal_total.protein_g > 0);

  if (
    !hasValidTotal && parsed.foods && Array.isArray(parsed.foods) &&
    parsed.foods.length > 0
  ) {
    parsed.meal_total = {
      calories: parsed.foods.reduce((acc, f) => acc + (f.calories || 0), 0),
      protein_g: parsed.foods.reduce((acc, f) => acc + (f.protein_g || 0), 0),
      carbs_g: parsed.foods.reduce((acc, f) => acc + (f.carbs_g || 0), 0),
      fat_g: parsed.foods.reduce((acc, f) => acc + (f.fat_g || 0), 0),
      fiber_g: parsed.foods.reduce((acc, f) => acc + (f.fiber_g || 0), 0),
    };
  }

  return parsed;
}
