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
1. Identify ONLY foods clearly visible. Do not infer hidden ingredients (oils, sauces, seasonings) unless visible.
2. Estimate portions from visible size (e.g. "100g", "1 cup").
3. Do not guess recipes, preparation methods, or unseen side dishes.
4. If no food is clearly visible, or if the image is blurry, unreadable, or not primarily focused on food, return {"error": "No food detected"}.
5. Set the top-level "name" field to a descriptive title for the ENTIRE meal (e.g., "Chicken, Rice & Vegetables").`;

Deno.serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse and validate input
    const body = await req.json();
    const { imageBase64, mimeType } = body;

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
    const aiResult = await callVertexAI(
      [{
        role: "user",
        parts: [{ inlineData: { mimeType, data: imageBase64 } }],
      }],
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
