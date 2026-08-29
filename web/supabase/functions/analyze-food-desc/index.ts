import "@supabase/functions-js/edge-runtime.d.ts";
import { handleCors, getCorsHeaders } from "../_shared/cors.ts";
import { ErrorCode, jsonError, jsonSuccess } from "../_shared/errors.ts";
import { authenticateRequest } from "../_shared/auth.ts";
import { checkRateLimit, rateLimitHeaders } from "../_shared/rateLimiter.ts";
import { callVertexAI, parseVertexResponse } from "../_shared/vertexAI.ts";

const MAX_DESCRIPTION_LENGTH = 2000;

const SYSTEM_INSTRUCTION = `You are a nutrition estimator. Analyze the provided meal description.

Rules:
1. Extract ONLY the specific food items explicitly mentioned or clarified.
2. Do NOT invent, assume, or append any extra ingredients, sides, condiments, or cooking oils if not explicitly written.
3. If the input contains only one food item, output exactly one object.
4. If the text is too short (1-2 letters), meaningless gibberish, or does not contain recognizable food, return {"error": "No food detected"}.
5. Set the top-level "name" field to a highly descriptive title listing the main components (e.g., "Eggs, Bacon & Toast", "Grilled Chicken with Broccoli"). DO NOT use generic categorical names like "Breakfast", "Hearty Breakfast", "Lunch", or "Breakfast Plate".
6. Set "confidence" to "high", "medium", or "low" based on the detail and clarity of the description.
7. Set "notes" to a concise summary explaining portion and ingredient assumptions (e.g., "Assumed standard single serving (150g) and no added cooking fat").
8. Provide 1 to 3 targeted "questions" in the questions array with 2 to 4 short, mutually exclusive options each to help the user clarify ambiguous aspects (e.g., portion size, cooking oil/sugar, preparation method). NEVER repeat questions that have already been answered or addressed in user clarifications. If clarifications were provided, confidence is high, or key ambiguities are resolved, set "questions": [].`;

Deno.serve(async (req) => {
  // Handle CORS preflight & validate origin
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const corsHeaders = getCorsHeaders(req);

  try {
    // Authenticate user
    const authResult = await authenticateRequest(req);
    if (authResult instanceof Response) return authResult;
    const { supabase } = authResult;

    // Parse and validate input
    const body = await req.json();
    const { description, clarifications } = body;

    if (!description || typeof description !== "string") {
      return jsonError("Missing or invalid description", ErrorCode.INVALID_INPUT, 400, corsHeaders);
    }

    const trimmed = description.trim();
    if (trimmed.length === 0) {
      return jsonError("Description cannot be empty", ErrorCode.INVALID_INPUT, 400, corsHeaders);
    }

    if (trimmed.length > MAX_DESCRIPTION_LENGTH) {
      return jsonError(
        `Description too long (max ${MAX_DESCRIPTION_LENGTH} characters)`,
        ErrorCode.INVALID_INPUT,
        400,
        corsHeaders,
      );
    }

    // Atomic rate-limit check + increment
    const rlResult = await checkRateLimit(supabase, corsHeaders);
    if (rlResult instanceof Response) return rlResult;

    // Call Vertex AI
    const parts: Array<Record<string, unknown>> = [
      { text: `Meal description: ${trimmed}` },
    ];
    if (clarifications && typeof clarifications === "string" && clarifications.trim()) {
      parts.push({
        text: `User clarifications and answered questions: "${clarifications.trim()}". Recalculate nutrition and update estimates based on these answers. CRITICAL: Do NOT re-ask or repeat any questions that were answered or addressed above. Set "questions": [] unless there is a completely new and critical ambiguity.`,
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
      return jsonError(parsed.error, ErrorCode.NO_FOOD_DETECTED, 422, { ...corsHeaders, ...rateLimitHeaders(rlResult) });
    }

    return jsonSuccess(parsed, { ...corsHeaders, ...rateLimitHeaders(rlResult) });
  } catch (error) {
    console.error("analyze-food-desc error:", error);
    return jsonError(
      "An unexpected error occurred while analyzing the description",
      ErrorCode.INTERNAL_ERROR,
      500,
      corsHeaders,
    );
  }
});

