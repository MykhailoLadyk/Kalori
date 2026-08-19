import { createContext, useState, useEffect, useRef } from "react";
import { useNotifications } from "./NotificationContext";
import { fetchGameData, syncGameProgress, applyStreakDecay } from "../services/gameService";
import { achievements as achievementDefinitions, quests as questDefinitions } from "../lib/constants";
import { useUser } from "../hooks/useUser";
import { supabase } from "../services/supabase";
import { getTodayDateString, getDaysBetweenDates } from "../lib/dateUtils";

export const GameContext = createContext(null);

const defaultAchievements = [
  { id: 1, progress: 0 },
  { id: 2, progress: 0 },
  { id: 3, progress: 0 },
  { id: 4, progress: 0 },
  { id: 5, progress: 0 },
  { id: 6, progress: 0 },
  { id: 7, progress: 0 },
  { id: 8, progress: 0 },
  { id: 9, progress: 0 },
  { id: 10, progress: 0 },
  { id: 12, progress: 0 },
  { id: 13, progress: 0 },
  { id: 14, progress: 0 },
  { id: 15, progress: 0 },
  { id: 16, progress: 0 },
  { id: 17, progress: 0 },
  { id: 18, progress: 0 },
  { id: 19, progress: 0 },
  { id: 20, progress: 0 },
];

const defaultQuests = [
  { id: 2, progress: 0 },
  { id: 8, progress: 0 },
  { id: 20, progress: 0 },
];

export function GameProvider({ children }) {
  const { user } = useUser();
  const [gameData, setGameData] = useState({ xp_total: 0, streak: 0, coins: 0, level: 1, last_log_date: null });
  const gameDataRef = useRef({ xp_total: 0, streak: 0, coins: 0, level: 1, last_log_date: null });
  const [achievements, setAchievements] = useState(defaultAchievements);
  const achievementsRef = useRef(defaultAchievements);
  const [quests, setQuests] = useState(defaultQuests);
  const questsRef = useRef(defaultQuests);
  const [shopItems, setShopItems] = useState({ streak_shields: 0, themesOwned: [1] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!user?.userAuth) return;

    const loadGameData = async () => {
      try {
        setLoading(true);
        const data = await fetchGameData();

        if (data.achievements) {
          setAchievements(data.achievements);
          achievementsRef.current = data.achievements;
        }
        if (data.themesOwned) setShopItems((prev) => ({ ...prev, themesOwned: data.themesOwned }));
        if (data.streak_shields !== undefined)
          setShopItems((prev) => ({ ...prev, streak_shields: data.streak_shields }));

        // --- Server-Authoritative Streak Decay Logic ---
        const today = getTodayDateString();
        const decayResult = await applyStreakDecay(today);
        if (decayResult.changed) {
          data.streak = decayResult.streak;
          data.streak_shields = decayResult.streak_shields;
          data.last_log_date = decayResult.last_log_date;
          setShopItems((prev) => ({ ...prev, streak_shields: decayResult.streak_shields }));
        }

        // --- Quest Lazy Loading Logic ---
        let currentQuests = data.quests || defaultQuests;

        let needsDaily = false;
        let needsWeekly = false;

        if (data.last_daily_refresh !== today) needsDaily = true;

        const daysSinceWeekly = getDaysBetweenDates(data.last_weekly_refresh, today);
        if (!data.last_weekly_refresh || daysSinceWeekly >= 7) needsWeekly = true;

        if (needsDaily || needsWeekly) {
          const dailyPool = questDefinitions.filter((q) => q.type === "Daily");
          const weeklyPool = questDefinitions.filter((q) => q.type === "Weekly");

          let newDailyQuests = currentQuests.filter(
            (q) => questDefinitions.find((d) => d.id === q.id)?.type === "Daily",
          );
          let newWeeklyQuests = currentQuests.filter(
            (q) => questDefinitions.find((d) => d.id === q.id)?.type === "Weekly",
          );

          if (needsDaily) {
            const shuffled = [...dailyPool].sort(() => 0.5 - Math.random());
            newDailyQuests = shuffled.slice(0, 2).map((q) => ({ id: q.id, progress: 0 }));
          }
          if (needsWeekly) {
            const shuffled = [...weeklyPool].sort(() => 0.5 - Math.random());
            newWeeklyQuests = shuffled.slice(0, 1).map((q) => ({ id: q.id, progress: 0 }));
          }

          currentQuests = [...newDailyQuests, ...newWeeklyQuests];
          setQuests(currentQuests);
          questsRef.current = currentQuests;

          // Fire RPC to securely update db
          await supabase.rpc("refresh_quests", {
            new_quests: currentQuests,
            is_daily_refresh: needsDaily,
            is_weekly_refresh: needsWeekly,
          });
        } else {
          setQuests(currentQuests);
          questsRef.current = currentQuests;
        }

        // Remove array fields from base gameData state so it's clean
        const baseData = { ...data };
        delete baseData.achievements;
        delete baseData.quests;
        delete baseData.themesOwned;
        delete baseData.streak_shields;
        delete baseData.last_daily_refresh;
        delete baseData.last_weekly_refresh;

        setGameData(baseData);
        gameDataRef.current = baseData;
      } catch (error) {
        setError("Failed to fetch game data");
      } finally {
        setLoading(false);
      }
    };
    loadGameData();
  }, [user?.userAuth]);

  const refreshGameData = async () => {
    try {
      const data = await fetchGameData();
      if (data.achievements) {
        setAchievements(data.achievements);
        achievementsRef.current = data.achievements;
      }
      if (data.quests) {
        setQuests(data.quests);
        questsRef.current = data.quests;
      }
      if (data.themesOwned) setShopItems((prev) => ({ ...prev, themesOwned: data.themesOwned }));
      if (data.streak_shields !== undefined)
        setShopItems((prev) => ({ ...prev, streak_shields: data.streak_shields }));

      const baseData = { ...data };
      delete baseData.achievements;
      delete baseData.quests;
      delete baseData.themesOwned;
      delete baseData.streak_shields;
      delete baseData.last_daily_refresh;
      delete baseData.last_weekly_refresh;

      setGameData(baseData);
      gameDataRef.current = baseData;
    } catch (e) {
      setError("Failed to refresh game data");
    }
  };

  const handleSyncProgress = async (localDate, isMealLog = false) => {
    try {
      setUpdating(true);
      const result = await syncGameProgress(localDate, isMealLog);

      const newGameData = {
        ...gameDataRef.current,
        xp_total: result.xp_total,
        coins: result.coins,
        streak: result.streak,
        level: result.level,
        last_log_date: result.last_log_date,
      };
      gameDataRef.current = newGameData;
      setGameData(newGameData);

      if (result.quests) {
        setQuests(result.quests);
        questsRef.current = result.quests;
      }
      if (result.achievements) {
        setAchievements(result.achievements);
        achievementsRef.current = result.achievements;
      }

      // Notifications
      try {
        if (result.xp_awarded > 0) {
          addNotification({ type: "xp", amount: result.xp_awarded });
        }
        if (result.coins_awarded > 0) {
          addNotification({ type: "coins", amount: result.coins_awarded });
        }
        (result.notifications || []).forEach((notif) => {
          if (notif.type === "quest") {
            const def = questDefinitions.find((q) => q.id === notif.id);
            addNotification({ ...def, type: "quest", coins: notif.reward });
          } else if (notif.type === "achievement") {
            const def = achievementDefinitions.find((a) => a.id === notif.id);
            addNotification({ ...def, type: "achievement", xp: notif.xp });
          }
        });
      } catch (e) {}

      return result;
    } catch (error) {
      setError(error.message || "Failed to sync game progress");
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameData,
        error,
        loading,
        updating,
        achievements,
        quests,
        shopItems,
        syncProgress: handleSyncProgress,
        refreshGameData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

