import { supabase } from "./supabase";
export const fetchGameData = async () => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw new Error(authError.message);
  if (!user) throw new Error("No authenticated user");
  const { data, error } = await supabase
    .from("user_game_stats")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};
export const syncGameProgress = async (localDate, isMealLog = false) => {
  const { data, error } = await supabase.rpc("sync_game_progress", {
    p_local_date: localDate,
    p_is_meal_log: isMealLog,
  });
  if (error) throw new Error(error.message);
  return data;
};

export const applyStreakDecay = async (localToday) => {
  const { data, error } = await supabase.rpc("apply_streak_decay", {
    p_local_today: localToday,
  });
  if (error) throw new Error(error.message);
  return data;
};

