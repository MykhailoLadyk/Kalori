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

export default async function analyzeFood(imageInput) {
  let imageBase64;
  let mimeType;

  if (typeof imageInput === "string" && imageInput.startsWith("data:")) {
    // data URL passed (from file reader or canvas.toDataURL)
    const res = dataUrlToBase64(imageInput);
    imageBase64 = res.base64;
    mimeType = res.mimeType;
  } else if (imageInput instanceof File) {
    // File object passed
    const res = await fileToBase64(imageInput);
    imageBase64 = res.base64;
    mimeType = res.mimeType;
  } else {
    throw new Error("analyzeFood expects a File or a data URL string");
  }

  const getLocalYMD = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const payload = { imageBase64, mimeType, localDate: getLocalYMD(new Date()) };

  const { data, error } = await supabase.functions.invoke("analyze-food", {
    // ensure body is a JSON string and content-type header is set
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  if (error) throw error;
  if (!data) throw new Error("Empty response from analyze-food function");

  // supabase may return the function response directly or wrapped;
  // try to normalize: if data.body exists use it, otherwise return data itself.
  const normalized = typeof data === "object" && data?.body ? data.body : data;

  if (typeof normalized === "string") {
    const start = normalized.indexOf("{");
    const end = normalized.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      return normalized.substring(start, end + 1);
    }
    return normalized.trim();
  }

  return normalized;
}
