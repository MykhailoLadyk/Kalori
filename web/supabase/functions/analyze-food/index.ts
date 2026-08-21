import "@supabase/functions-js/edge-runtime.d.ts";
import { handleCors } from "../_shared/cors.ts";
import { ErrorCode, jsonError, jsonSuccess } from "../_shared/errors.ts";
import { authenticateRequest } from "../_shared/auth.ts";
import { checkRateLimit, rateLimitHeaders } from "../_shared/rateLimiter.ts";
import { callVertexAI, parseVertexResponse } from "../_shared/vertexAI.ts";

const MAX_BASE64_SIZE = 10 * 1024 * 1024; // ~10MB base64 ≈ ~7.5MB image
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

const SYSTEM_INSTRUCTION = `You are a nutrition estimator. Analyze the image and identify ONLY visibly present foods.

Rules:
1. Identify ONLY foods clearly visible. Do not infer hidden ingredients (oils, sauces, seasonings) unless visible or clarified by user.
2. Estimate portions from visible size (e.g. "100g", "1 cup").
3. Do not guess recipes, preparation methods, or unseen side dishes unless clarified.
4. If no food is clearly visible, or if the image is blurry, unreadable, or not primarily focused on food, return {"error": "No food detected"}.
5. Set the top-level "name" field to a highly descriptive title listing the main components (e.g., "Eggs, Bacon & Toast", "Grilled Chicken with Broccoli"). DO NOT use generic categorical names like "Breakfast", "Hearty Breakfast", "Lunch", or "Breakfast Plate".
6. Set "confidence" to "high", "medium", or "low" based on visual clarity and portion visibility.
7. Set "notes" to a concise summary explaining portion and ingredient assumptions (e.g., "Assumed 6oz grilled chicken breast and 1 cup steamed broccoli without butter").
8. Provide 1 to 3 targeted "questions" in the questions array with 2 to 4 short, mutually exclusive options each to help the user clarify any ambiguous aspects (e.g., cooking oils, portion size, sauces, dressings). If confidence is high or clarifications were fully provided, questions can be empty.

EXAMPLES OF CORRECT BEHAVIOR:

Example 1: A photo of a grilled chicken breast and a side of broccoli.
{
  "name": "Grilled Chicken & Broccoli",
  "confidence": "high",
  "notes": "Estimated 6oz chicken breast and 1 cup of steamed broccoli.",
  "questions": [
    {
      "question": "Was any cooking oil or butter used?",
      "options": ["No oil", "1 tbsp Olive Oil", "Butter"]
    }
  ],
  "foods": [
    {
      "name": "Grilled Chicken Breast",
      "portion": "6 oz",
      "calories": 280,
      "protein_g": 52,
      "carbs_g": 0,
      "fat_g": 6,
      "fiber_g": 0
    },
    {
      "name": "Broccoli",
      "portion": "1 cup",
      "calories": 30,
      "protein_g": 2,
      "carbs_g": 6,
      "fat_g": 0,
      "fiber_g": 2
    }
  ],
  "meal_total": {
    "calories": 310,
    "protein_g": 54,
    "carbs_g": 6,
    "fat_g": 6,
    "fiber_g": 2
  }
}

Example 2: A photo of a steering wheel (no food).
{
  "error": "No food detected"
}
`;

Deno.serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse and validate input
    const body = await req.json();
    const { imageBase64, mimeType, clarifications } = body;

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return jsonError("Missing or invalid imageBase64", ErrorCode.INVALID_INPUT, 400);
    }

    if (!mimeType || typeof mimeType !== "string") {
      return jsonError("Missing or invalid mimeType", ErrorCode.INVALID_INPUT, 400);
    }

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return jsonError(
        `Unsupported image type: ${mimeType}. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
        ErrorCode.INVALID_INPUT,
        400,
      );
    }

    if (imageBase64.length > MAX_BASE64_SIZE) {
      return jsonError(
        "Image too large (max ~7.5MB)",
        ErrorCode.INVALID_INPUT,
        400,
      );
    }

    // Authenticate user
    const authResult = await authenticateRequest(req);
    if (authResult instanceof Response) return authResult;
    const { supabase } = authResult;

    // Atomic rate-limit check + increment
    const rlResult = await checkRateLimit(supabase);
    if (rlResult instanceof Response) return rlResult;

    // Call Vertex AI
    const parts: Array<Record<string, unknown>> = [
      { inlineData: { mimeType, data: imageBase64 } },
    ];
    if (clarifications && typeof clarifications === "string" && clarifications.trim()) {
      parts.push({
        text: `User clarifications and additional details: "${clarifications.trim()}". Please recalculate nutrition and update estimates based on these details.`,
      });
    }

    const aiResult = await callVertexAI(
      [{ role: "user", parts }],
      SYSTEM_INSTRUCTION,
    );

    // Parse and normalize response
    const parsed = parseVertexResponse(aiResult);

    // Check if AI detected no food
    if (parsed.error) {
      return jsonError(parsed.error, ErrorCode.NO_FOOD_DETECTED, 422, rateLimitHeaders(rlResult));
    }

    return jsonSuccess(parsed, rateLimitHeaders(rlResult));
  } catch (error) {
    console.error("analyze-food error:", error);
    return jsonError(
      "An unexpected error occurred while analyzing the image",
      ErrorCode.INTERNAL_ERROR,
      500,
    );
  }
});
