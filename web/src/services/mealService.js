import { supabase } from "./supabase";
import { getTodayDateString } from "../lib/dateUtils";

export const fetchMeals = async (userId, date = getTodayDateString()) => {
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
  const sanitizedUpdates = { ...updates };
  if (sanitizedUpdates.calories != null) sanitizedUpdates.calories = Math.round(Number(sanitizedUpdates.calories));
  if (sanitizedUpdates.protein != null) sanitizedUpdates.protein = Math.round(Number(sanitizedUpdates.protein));
  if (sanitizedUpdates.carbs != null) sanitizedUpdates.carbs = Math.round(Number(sanitizedUpdates.carbs));
  if (sanitizedUpdates.fat != null) sanitizedUpdates.fat = Math.round(Number(sanitizedUpdates.fat));
  if (sanitizedUpdates.amount != null) sanitizedUpdates.amount = Math.round(Number(sanitizedUpdates.amount));

  const { data, error } = await supabase
    .from("meals")
    .update(sanitizedUpdates)
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
      calories: meal.calories != null ? Math.round(Number(meal.calories)) : null,
      protein: meal.protein != null ? Math.round(Number(meal.protein)) : null,
      carbs: meal.carbs != null ? Math.round(Number(meal.carbs)) : null,
      fat: meal.fat != null ? Math.round(Number(meal.fat)) : null,
      type: meal.type, // "breakfast" | "lunch" | "dinner" | "snacks"
      date: meal.date || getTodayDateString(),
      amount: meal.amount != null ? Math.round(Number(meal.amount)) : null,
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
