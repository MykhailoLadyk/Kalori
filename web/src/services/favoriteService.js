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

  const { data, error } = await supabase
    .from("user_favorites")
    .insert({
      user_id: userId,
      name: meal.name,
      calories: meal.calories != null ? Math.round(Number(meal.calories)) : null,
      protein: meal.protein != null ? Math.round(Number(meal.protein)) : null,
      carbs: meal.carbs != null ? Math.round(Number(meal.carbs)) : null,
      fat: meal.fat != null ? Math.round(Number(meal.fat)) : null,
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
