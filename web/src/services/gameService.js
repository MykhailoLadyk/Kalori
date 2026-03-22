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
export const updateGameData = async (updates) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw new Error(authError.message);
  if (!user) throw new Error("No authenticated user");
  const { data, error } = await supabase
    .from("user_game_stats")
    .update(updates)
    .eq("user_id", user.id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
};
