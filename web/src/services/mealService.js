import { supabase } from "./supabase";
import { getTodayDateString } from "../lib/dateUtils";

function sanitizeNum(val, max = 20000) {
  if (val == null) return null;
  const n = Math.round(Number(val));
  return isNaN(n) || n < 0 || n > max ? null : n;
}

function sanitizeStr(val, maxLen = 100) {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, maxLen);
}

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
  if (sanitizedUpdates.name !== undefined) sanitizedUpdates.name = sanitizeStr(sanitizedUpdates.name);
  if (sanitizedUpdates.calories !== undefined) sanitizedUpdates.calories = sanitizeNum(sanitizedUpdates.calories, 20000);
  if (sanitizedUpdates.protein !== undefined) sanitizedUpdates.protein = sanitizeNum(sanitizedUpdates.protein, 5000);
  if (sanitizedUpdates.carbs !== undefined) sanitizedUpdates.carbs = sanitizeNum(sanitizedUpdates.carbs, 5000);
  if (sanitizedUpdates.fat !== undefined) sanitizedUpdates.fat = sanitizeNum(sanitizedUpdates.fat, 5000);
  if (sanitizedUpdates.amount !== undefined) sanitizedUpdates.amount = sanitizeNum(sanitizedUpdates.amount, 10000);

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
      name: sanitizeStr(meal.name) || "Meal",
      calories: sanitizeNum(meal.calories, 20000),
      protein: sanitizeNum(meal.protein, 5000),
      carbs: sanitizeNum(meal.carbs, 5000),
      fat: sanitizeNum(meal.fat, 5000),
      type: meal.type, // "breakfast" | "lunch" | "dinner" | "snacks"
      date: meal.date || getTodayDateString(),
      amount: sanitizeNum(meal.amount, 10000),
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

export async function fetchRecentUniqueMeals(userId, limit = 5) {
  if (!userId) throw new Error("No authenticated user ID provided");

  // Fetch more than needed to deduplicate client-side
  const { data, error } = await supabase
    .from("meals")
    .select("name, calories, protein, carbs, fat, type, created_at")
    .eq("user_id", userId)
    .not("name", "eq", "water")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);

  // Deduplicate by name (case-insensitive), keep the most recent
  const seen = new Set();
  const unique = [];
  for (const meal of data) {
    const key = meal.name.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(meal);
      if (unique.length >= limit) break;
    }
  }

  return unique;
}
