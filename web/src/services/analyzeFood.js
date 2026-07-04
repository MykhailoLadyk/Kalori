import { supabase } from "./supabase";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result;
      const parts = String(dataUrl).split(",");
      const base64 = parts[1];
      resolve({ base64, mimeType: file.type || "image/jpeg" });
    };

    reader.onerror = () => reject(new Error("Failed to read image file"));

    reader.readAsDataURL(file);
  });
}

function dataUrlToBase64(dataUrl) {
  const match = String(dataUrl).match(/^data:(.+);base64,(.*)$/);
  if (!match) throw new Error("Invalid data URL");
  return { base64: match[2], mimeType: match[1] };
}

/**
 * Analyzes a food image using the analyze-food edge function.
 * Accepts either a File object or a data URL string.
 *
 * Returns the parsed nutrition data object directly.
 * Throws an error with a `code` property for structured error handling.
 */
export default async function analyzeFood(imageInput) {
  let imageBase64;
  let mimeType;

  if (typeof imageInput === "string" && imageInput.startsWith("data:")) {
    const res = dataUrlToBase64(imageInput);
    imageBase64 = res.base64;
    mimeType = res.mimeType;
  } else if (imageInput instanceof File) {
    const res = await fileToBase64(imageInput);
    imageBase64 = res.base64;
    mimeType = res.mimeType;
  } else {
    throw new Error("analyzeFood expects a File or a data URL string");
  }

  const { data, error } = await supabase.functions.invoke("analyze-food", {
    body: { imageBase64, mimeType },
  });

  if (error) {
    // Supabase SDK wraps non-2xx responses as FunctionsHttpError
    // Try to extract the structured error from the response body
    const structured = extractStructuredError(error, data);
    throw structured;
  }

  if (!data) throw new Error("Empty response from analyze-food function");

  // The edge function now returns a properly serialized JSON object,
  // so `data` should already be parsed by the SDK.
  return typeof data === "string" ? JSON.parse(data) : data;
}

/**
 * Extracts a structured error with `code` and `message` from the edge function
 * response, falling back to a generic error if parsing fails.
 */
function extractStructuredError(error, data) {
  // If data contains our structured error, use it
  if (data && typeof data === "object" && data.code) {
    const err = new Error(data.error || error.message);
    err.code = data.code;
    return err;
  }

  // Try parsing the error context (FunctionsHttpError stores body in context)
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
