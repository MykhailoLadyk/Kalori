import { supabase } from "./supabase";

export default async function analyzeFoodImage(description) {
  const getLocalYMD = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const { data, error } = await supabase.functions.invoke("analyze-food-desc", {
    body: {
      description: description,
      localDate: getLocalYMD(new Date()),
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  
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
