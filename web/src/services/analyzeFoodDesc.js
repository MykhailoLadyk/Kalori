import { supabase } from "./supabase";

export default async function analyzeFoodImage(description) {
  const { data, error } = await supabase.functions.invoke("analyze-food-desc", {
    body: {
      description: description,
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  
  const normalized = typeof data === "object" && data?.body ? data.body : data;
  
  if (typeof normalized === "string") {
    return normalized.replace(/```json/gi, "").replace(/```/g, "").trim();
  }

  return normalized;
}
