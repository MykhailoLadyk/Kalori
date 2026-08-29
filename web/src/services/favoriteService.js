import { supabase } from "./supabase";

export async function fetchFavorites(userId) {
  if (!userId) throw new Error("No authenticated user ID provided");

  const { data, error } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function addFavorite(userId, meal) {
  if (!userId) throw new Error("No authenticated user ID provided");

  const sanitizeNum = (val, max = 20000) => {
    if (val == null) return null;
    const num = Math.round(Number(val));
    return isNaN(num) || num < 0 || num > max ? null : num;
  };

  const { data, error } = await supabase
    .from("user_favorites")
    .insert({
      user_id: userId,
      name: typeof meal.name === "string" ? meal.name.trim().slice(0, 100) : "Favorite",
      calories: sanitizeNum(meal.calories, 20000),
      protein: sanitizeNum(meal.protein, 5000),
      carbs: sanitizeNum(meal.carbs, 5000),
      fat: sanitizeNum(meal.fat, 5000),
      type: meal.type || "breakfast",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function removeFavorite(userId, favoriteId) {
  if (!userId) throw new Error("No authenticated user ID provided");

  const { error } = await supabase
    .from("user_favorites")
    .delete()
    .eq("id", favoriteId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return true;
}
