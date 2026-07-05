import { createContext, useState, useEffect, useRef } from "react";
import { useNotifications } from "./NotificationContext";
import { fetchGameData, updateGameData } from "../services/gameService";
import { achievements as achievementDefinitions, quests as questDefinitions, levels } from "../lib/constants";
import { useUser } from "../hooks/useUser";
import { supabase } from "../services/supabase";
import { getTodayDateString, getDaysBetweenDates } from "../lib/dateUtils";
import { processProgress } from "../lib/progressEngine";

export const GameContext = createContext(null);

const defaultAchievements = [
  { id: 1, progress: 0 }, { id: 2, progress: 0 }, { id: 3, progress: 0 },
  { id: 4, progress: 0 }, { id: 5, progress: 0 }, { id: 6, progress: 0 },
  { id: 7, progress: 0 }, { id: 8, progress: 0 }, { id: 9, progress: 0 },
  { id: 10, progress: 0 }, { id: 12, progress: 0 },
  { id: 13, progress: 0 }, { id: 14, progress: 0 }, { id: 15, progress: 0 },
  { id: 16, progress: 0 }, { id: 17, progress: 0 }, { id: 18, progress: 0 },
  { id: 19, progress: 0 }, { id: 20, progress: 0 },
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
        if (data.themesOwned) setShopItems(prev => ({ ...prev, themesOwned: data.themesOwned }));
        if (data.streak_shields !== undefined) setShopItems(prev => ({ ...prev, streak_shields: data.streak_shields }));

        // --- Quest Lazy Loading Logic ---
        let currentQuests = data.quests || defaultQuests;
        const today = getTodayDateString();
        
        let needsDaily = false;
        let needsWeekly = false;
        
        if (data.last_daily_refresh !== today) needsDaily = true;
        
        const daysSinceWeekly = getDaysBetweenDates(data.last_weekly_refresh, today);
        if (!data.last_weekly_refresh || daysSinceWeekly >= 7) needsWeekly = true;
        
        if (needsDaily || needsWeekly) {
            const dailyPool = questDefinitions.filter(q => q.type === "Daily");
            const weeklyPool = questDefinitions.filter(q => q.type === "Weekly");
            
            let newDailyQuests = currentQuests.filter(q => questDefinitions.find(d => d.id === q.id)?.type === "Daily");
            let newWeeklyQuests = currentQuests.filter(q => questDefinitions.find(d => d.id === q.id)?.type === "Weekly");
            
            if (needsDaily) {
                const shuffled = [...dailyPool].sort(() => 0.5 - Math.random());
                newDailyQuests = shuffled.slice(0, 2).map(q => ({ id: q.id, progress: 0 }));
            }
            if (needsWeekly) {
                const shuffled = [...weeklyPool].sort(() => 0.5 - Math.random());
                newWeeklyQuests = shuffled.slice(0, 1).map(q => ({ id: q.id, progress: 0 }));
            }
            
            currentQuests = [...newDailyQuests, ...newWeeklyQuests];
            setQuests(currentQuests);
            questsRef.current = currentQuests;
            
            // Fire RPC to securely update db
            await supabase.rpc('refresh_quests', {
                new_quests: currentQuests,
                is_daily_refresh: needsDaily,
                is_weekly_refresh: needsWeekly
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

  const handleUpdateGameData = async (updates) => {
    try {
      setUpdating(true);
      
      const prev = gameDataRef.current;
      const newGameData = { ...prev, ...updates };
      gameDataRef.current = newGameData;
      setGameData(newGameData);

      // We still update the database
      await updateGameData(updates);

      // Notifications: xp, coins, level
      try {
        const prevXP = prev.xp_total ?? 0;
        const newXP = newGameData.xp_total ?? prevXP;
        const xpDelta = newXP - prevXP;
        if (xpDelta > 0) {
          addNotification({ type: "xp", amount: xpDelta });
          
          let prevLevel = 1;
          let newLevel = 1;
          for (let [lvl, xp] of Object.entries(levels)) {
            if (prevXP >= xp) prevLevel = parseInt(lvl);
            if (newXP >= xp) newLevel = parseInt(lvl);
          }

          if (newLevel > prevLevel) {
            addNotification({ type: "levelup", level: newLevel });
          }
          
          const { updatedAchievements } = processProgress("EARN_XP", { xp: xpDelta }, {
            gameData: newGameData,
            level: newLevel,
            userQuests: questsRef.current,
            userAchievements: achievementsRef.current
          });
          if (updatedAchievements && updatedAchievements.length > 0) {
            handleUpdateAchievements(updatedAchievements);
          }
        }

        const prevCoins = prev.coins ?? 0;
        const newCoins = newGameData.coins ?? prevCoins;
        const coinsDelta = newCoins - prevCoins;
        if (coinsDelta > 0) addNotification({ type: "coins", amount: coinsDelta });

        if (updates.level !== undefined && updates.level !== prev.level) {
          addNotification({ type: "levelup", level: updates.level });
        }
      } catch (e) {
      }
    } catch (error) {
      setError(error.message || "Failed to update game data");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateAchievements = async (updates) => {
    if (!updates || !updates.length) return;

    const achDefMap = new Map(achievementDefinitions.map((a) => [a.id, a]));
    const currentAchievements = achievementsRef.current;

    let xpEarned = 0;

    updates.forEach((update) => {
      const a = currentAchievements.find((ach) => ach.id === update.id);
      const def = achDefMap.get(update.id);
      if (a) {
        const wasCompleted = a.completedAt != null;
        const isNowCompleted = update.progress >= (def?.max ?? 1);
        if (isNowCompleted && !wasCompleted) {
          xpEarned += def?.xp || 0;
          try {
            addNotification({ ...def, ...a, ...update, type: "achievement" });
          } catch (e) {
          }
        }
      } else {
        if (update.progress >= (def?.max ?? 1)) {
          xpEarned += def?.xp || 0;
          try {
            addNotification({ ...def, ...update, type: "achievement" });
          } catch (e) {
          }
        }
      }
    });

    // Compute merged array
    const merged = currentAchievements.map((a) => {
      const update = updates.find((u) => u.id === a.id);
      if (!update) return a;

      const def = achDefMap.get(a.id);
      const result = { ...a, ...update };
      if (update.progress >= (def?.max ?? 1) && !a.completedAt) {
        result.completedAt = new Date().toISOString();
      }
      return result;
    });

    const newOnes = updates.filter((u) => !currentAchievements.some((p) => p.id === u.id));
    newOnes.forEach((update) => {
      const def = achDefMap.get(update.id);
      if (update.progress >= (def?.max ?? 1)) {
        update.completedAt = new Date().toISOString();
      }
      merged.unshift(update);
    });

    achievementsRef.current = merged;
    setAchievements(merged);
    
    let dbUpdates = { achievements: merged };

    if (xpEarned > 0) {
      const prev = gameDataRef.current;
      const prevXP = prev.xp_total || 0;
      const newXpTotal = prevXP + xpEarned;
      dbUpdates.xp_total = newXpTotal;
      const nextData = { ...prev, xp_total: newXpTotal };
      gameDataRef.current = nextData;
      setGameData(nextData);

      try {
        let prevLevel = 1;
        let newLevel = 1;
        for (let [lvl, xp] of Object.entries(levels)) {
          if (prevXP >= xp) prevLevel = parseInt(lvl);
          if (newXpTotal >= xp) newLevel = parseInt(lvl);
        }

        if (newLevel > prevLevel) {
          addNotification({ type: "levelup", level: newLevel });
        }
      } catch (e) {}
    }

    // Persist to Supabase
    try {
      setUpdating(true);
      await updateGameData(dbUpdates);
    } catch (e) {
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateQuests = async (updates) => {
    if (!updates || !updates.length) return;

    const questDefMap = new Map(questDefinitions.map((q) => [q.id, q]));
    const currentQuests = questsRef.current;

    let coinsEarned = 0;
    let questsCompleted = 0;

    updates.forEach((update) => {
      const q = currentQuests.find((quest) => quest.id === update.id);
      const def = questDefMap.get(update.id);
      if (q) {
        const wasCompleted = q.completedAt != null;
        const isNowCompleted = update.progress >= (def?.max ?? 1);
        if (isNowCompleted && !wasCompleted) {
          coinsEarned += def?.reward || 0;
          questsCompleted++;
          try {
            addNotification({
              ...def,
              ...q,
              ...update,
              type: "quest",
              coins: def.reward,
            });
          } catch (e) {
          }
        }
      }
    });

    // Compute merged quests
    const mergedQuests = currentQuests.map((q) => {
      const update = updates.find((u) => u.id === q.id);
      if (!update) return q;

      const def = questDefMap.get(q.id);
      const result = { ...q, ...update };
      if (update.progress >= (def?.max ?? 1) && !q.completedAt) {
        result.completedAt = new Date().toISOString();
      }
      return result;
    });

    questsRef.current = mergedQuests;
    setQuests(mergedQuests);

    let dbUpdates = { quests: mergedQuests };

    if (coinsEarned > 0) {
      const prev = gameDataRef.current;
      const newCoins = (prev.coins || 0) + coinsEarned;
      dbUpdates.coins = newCoins;
      const nextData = { ...prev, coins: newCoins };
      gameDataRef.current = nextData;
      setGameData(nextData);
    }

    if (questsCompleted > 0) {
      const { updatedAchievements } = processProgress("COMPLETE_QUEST", { count: questsCompleted }, {
        gameData: gameDataRef.current,
        level: gameDataRef.current.level || 1,
        userQuests: mergedQuests,
        userAchievements: achievementsRef.current
      });
      if (updatedAchievements && updatedAchievements.length > 0) {
        handleUpdateAchievements(updatedAchievements);
      }
    }

    // Persist to Supabase
    try {
      setUpdating(true);
      await updateGameData(dbUpdates);
    } catch (e) {
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateShopItems = async (updates) => {
    const newThemesOwned = updates.themesOwned 
      ? [...shopItems.themesOwned, ...updates.themesOwned] 
      : shopItems.themesOwned;
      
    const newItems = {
      ...shopItems,
      ...updates,
      themesOwned: newThemesOwned
    };

    setShopItems(newItems);

    try {
      setUpdating(true);
      await updateGameData(newItems);
    } catch (error) {
      setError(error.message || "Failed to update shop items");
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
        updateGameData: handleUpdateGameData,
        updateAchievements: handleUpdateAchievements,
        updateQuests: handleUpdateQuests,
        updateShopItems: handleUpdateShopItems,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
