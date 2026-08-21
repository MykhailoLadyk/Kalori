import { supabase } from "./supabase";

/**
 * Analyzes a food description using the analyze-food-desc edge function.
 * Accepts a plain-text description of a meal.
 *
 * Returns the parsed nutrition data object directly.
 * Throws an error with a `code` property for structured error handling.
 */
export default async function analyzeFoodDesc(description, clarifications) {
  const { data, error } = await supabase.functions.invoke("analyze-food-desc", {
    body: { description, clarifications },
  });

  if (error) {
    const structured = extractStructuredError(error, data);
    throw structured;
  }

  if (!data) throw new Error("Empty response from analyze-food-desc function");

  // The edge function now returns a properly serialized JSON object
  return typeof data === "string" ? JSON.parse(data) : data;
}

/**
 * Extracts a structured error with `code` and `message` from the edge function
 * response, falling back to a generic error if parsing fails.
 */
function extractStructuredError(error, data) {
  if (data && typeof data === "object" && data.code) {
    const err = new Error(data.error || error.message);
    err.code = data.code;
    return err;
  }

  try {
    if (error.context?.body) {
      const body =
        typeof error.context.body === "string"
          ? JSON.parse(error.context.body)
          : error.context.body;
      if (body.code) {
        const err = new Error(body.error || error.message);
        err.code = body.code;
        return err;
      }
    }
  } catch {
    // ignore parse errors
  }

  return error;
}
