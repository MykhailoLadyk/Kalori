import { supabase } from "./supabase";
import { getTodayDateString } from "../lib/dateUtils";

export async function fetchWeightLogsByRange(userId, startDate, endDate) {
  if (!userId) throw new Error("No authenticated user ID provided");
  const { data, error } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchLatestWeight(userId) {
  if (!userId) throw new Error("No authenticated user ID provided");
  const { data, error } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function logWeight(userId, { weight, unit = "kg", date = getTodayDateString() }) {
  if (!userId) throw new Error("No authenticated user ID provided");
  const numWeight = Number(weight);
  if (isNaN(numWeight) || numWeight <= 0) throw new Error("Invalid weight value");

  const { data, error } = await supabase
    .from("weight_logs")
    .upsert(
      {
        user_id: userId,
        weight: numWeight,
        unit,
        date,
      },
      { onConflict: "user_id,date" }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteWeightLog(userId, id) {
  if (!userId) throw new Error("No authenticated user ID provided");
  const { error } = await supabase
    .from("weight_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return true;
}
