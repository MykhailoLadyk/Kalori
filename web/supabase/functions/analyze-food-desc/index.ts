import "@supabase/functions-js/edge-runtime.d.ts";
import { handleCors } from "../_shared/cors.ts";
import { ErrorCode, jsonError, jsonSuccess } from "../_shared/errors.ts";
import { authenticateRequest } from "../_shared/auth.ts";
import { checkRateLimit, rateLimitHeaders } from "../_shared/rateLimiter.ts";
import { callVertexAI, parseVertexResponse } from "../_shared/vertexAI.ts";

const MAX_DESCRIPTION_LENGTH = 2000;

const SYSTEM_INSTRUCTION = `You are a nutrition estimator. Analyze the provided meal description.

Rules:
1. Extract ONLY the specific food items explicitly mentioned.
2. Do NOT invent, assume, or append any extra ingredients, sides, condiments, or cooking oils if not explicitly written.
3. If the input contains only one food item, output exactly one object.
4. If the text is too short (1-2 letters), meaningless gibberish, or does not contain recognizable food, return {"error": "No food detected"}.
5. Set the top-level "name" field to a highly descriptive title listing the main components (e.g., "Eggs, Bacon & Toast", "Grilled Chicken with Broccoli"). DO NOT use generic categorical names like "Breakfast", "Hearty Breakfast", "Lunch", or "Breakfast Plate".`;

Deno.serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse and validate input
    const body = await req.json();
    const { description } = body;

    if (!description || typeof description !== "string") {
      return jsonError("Missing or invalid description", ErrorCode.INVALID_INPUT, 400);
    }

    const trimmed = description.trim();
    if (trimmed.length === 0) {
      return jsonError("Description cannot be empty", ErrorCode.INVALID_INPUT, 400);
    }

    if (trimmed.length > MAX_DESCRIPTION_LENGTH) {
      return jsonError(
        `Description too long (max ${MAX_DESCRIPTION_LENGTH} characters)`,
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
        parts: [{ text: trimmed }],
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
    console.error("analyze-food-desc error:", error);
    return jsonError(
      "An unexpected error occurred while analyzing the description",
      ErrorCode.INTERNAL_ERROR,
      500,
    );
  }
});
