import { supabase } from "./supabase";

const todayYmd = () => {
  return new Date().toISOString().split("T")[0];
};

export const fetchMeals = async (userId, date = todayYmd()) => {
  if (!userId) throw new Error("No authenticated user ID provided");
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};
export const updateMeal = async (userId, id, updates) => {
  if (!userId) throw new Error("No authenticated user ID provided");
  const { data, error } = await supabase
    .from("meals")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};
export async function deleteMeal(userId, id) {
  if (!userId) throw new Error("No authenticated user ID provided");

  const { error } = await supabase
    .from("meals")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return true;
}
export async function addMeal(userId, meal) {
  if (!userId) throw new Error("No authenticated user ID provided");

  const { data, error } = await supabase
    .from("meals")
    .insert({
      user_id: userId,
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      type: meal.type, // "breakfast" | "lunch" | "dinner" | "snacks"
      date: meal.date || todayYmd(),
      amount: meal.amount,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
export async function fetchMealsByRange(userId, startDate, endDate) {
  if (!userId) throw new Error("No authenticated user ID provided");

  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}
