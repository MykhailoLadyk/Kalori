import { supabase } from "./supabase";
export const fetchGameData = async () => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw new Error(authError.message);
  if (!user) throw new Error("No authenticated user");
  const { data, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};
export const awardXp = async (amount) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw new Error(authError.message);
  if (!user) throw new Error("No authenticated user");
  const { fetch_data, fetch_error } = await supabase
    .from("user_stats")
    .select("xp_total", "level")
    .eq("user_id", user.id)
    .single();
  if (fetch_error) throw new Error(fetch_error.message);
  //// Add check to see if user has reached new level based on xp thresholds
  const newXp = fetch_data.xp_total + amount;
  const { data, error } = await supabase
    .from("user_stats")
    .update({ xp_total: newXp })
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};
