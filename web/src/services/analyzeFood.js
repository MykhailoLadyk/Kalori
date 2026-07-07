import { supabase } from "./supabase";

function resizeImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const MAX_SIZE = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_SIZE) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
      const parts = String(resizedDataUrl).split(",");
      resolve({ base64: parts[1], mimeType: "image/jpeg" });
    };
    img.onerror = () => reject(new Error("Failed to load image for resizing"));
    img.src = dataUrl;
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Analyzes a food image using the analyze-food edge function.
 * Accepts either a File object or a data URL string.
 *
 * Returns the parsed nutrition data object directly.
 * Throws an error with a `code` property for structured error handling.
 */
export default async function analyzeFood(imageInput) {
  let dataUrl;

  if (typeof imageInput === "string" && imageInput.startsWith("data:")) {
    dataUrl = imageInput;
  } else if (imageInput instanceof File) {
    dataUrl = await fileToDataUrl(imageInput);
  } else {
    throw new Error("analyzeFood expects a File or a data URL string");
  }

  // Resize and compress the image before uploading to reduce latency
  const { base64: imageBase64, mimeType } = await resizeImage(dataUrl);

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
