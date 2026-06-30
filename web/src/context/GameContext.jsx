import { createContext, useState, useEffect } from "react";
import { useNotifications } from "./NotificationContext";
import { fetchGameData, updateGameData } from "../services/gameService";
import { achievements as achievementDefinitions, quests as questDefinitions } from "../lib/constans";
import { useUser } from "../hooks/useUser";

export const GameContext = createContext(null);

const defaultAchievements = [
  { id: 1, progress: 0 }, { id: 2, progress: 0 }, { id: 3, progress: 0 },
  { id: 4, progress: 0 }, { id: 5, progress: 0 }, { id: 6, progress: 0 },
  { id: 7, progress: 0 }, { id: 8, progress: 0 }, { id: 9, progress: 0 },
  { id: 10, progress: 0 }, { id: 11, progress: 0 }, { id: 12, progress: 0 },
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
  const [gameData, setGameData] = useState({ xp_total: 0, streak: 0, coins: 0, level: 1 });
  const [achievements, setAchievements] = useState(defaultAchievements);
  const [quests, setQuests] = useState(defaultQuests);
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
        
        if (data.achievements) setAchievements(data.achievements);
        if (data.quests) setQuests(data.quests);
        if (data.themesOwned) setShopItems(prev => ({ ...prev, themesOwned: data.themesOwned }));
        if (data.streak_shields !== undefined) setShopItems(prev => ({ ...prev, streak_shields: data.streak_shields }));

        // Remove array fields from base gameData state so it's clean
        const baseData = { ...data };
        delete baseData.achievements;
        delete baseData.quests;
        delete baseData.themesOwned;
        delete baseData.streak_shields;

        setGameData(baseData);
      } catch (error) {
        setError("Failed to fetch game data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadGameData();
  }, [user?.userAuth]);

  const handleUpdateGameData = async (updates) => {
    try {
      setUpdating(true);
      
      const prev = gameData;
      const newGameData = { ...gameData, ...updates };
      setGameData(newGameData);

      // We still update the database
      await updateGameData(updates);

      // Notifications: xp, coins, level
      try {
        const prevXP = prev.xp_total ?? 0;
        const newXP = newGameData.xp_total ?? prevXP;
        const xpDelta = newXP - prevXP;
        if (xpDelta > 0) addNotification({ type: "xp", amount: xpDelta });

        const prevCoins = prev.coins ?? 0;
        const newCoins = newGameData.coins ?? prevCoins;
        const coinsDelta = newCoins - prevCoins;
        if (coinsDelta > 0) addNotification({ type: "coins", amount: coinsDelta });

        if (updates.level !== undefined && updates.level !== prev.level) {
          addNotification({ type: "levelup", level: updates.level });
        }
      } catch (e) {
        console.error("addNotification failed", e);
      }
    } catch (error) {
      setError(error.message || "Failed to update game data");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateAchievements = async (updates) => {
    if (!updates || !updates.length) return;

    const achDefMap = new Map(achievementDefinitions.map((a) => [a.id, a]));

    updates.forEach((update) => {
      const a = achievements.find((ach) => ach.id === update.id);
      const def = achDefMap.get(update.id);
      if (a) {
        const wasCompleted = a.completedAt != null;
        const isNowCompleted = update.progress >= (def?.max ?? 1);
        if (isNowCompleted && !wasCompleted) {
          try {
            addNotification({ ...def, ...a, ...update, type: "achievement" });
          } catch (e) {
            console.error("addNotification failed", e);
          }
        }
      } else {
        if (update.progress >= (def?.max ?? 1)) {
          try {
            addNotification({ ...def, ...update, type: "achievement" });
          } catch (e) {
            console.error("addNotification failed", e);
          }
        }
      }
    });

    // Compute merged array
    const merged = achievements.map((a) => {
      const update = updates.find((u) => u.id === a.id);
      if (!update) return a;

      const def = achDefMap.get(a.id);
      const result = { ...a, ...update };
      if (update.progress >= (def?.max ?? 1) && !a.completedAt) {
        result.completedAt = new Date().toISOString();
      }
      return result;
    });

    const newOnes = updates.filter((u) => !achievements.some((p) => p.id === u.id));
    newOnes.forEach((update) => {
      const def = achDefMap.get(update.id);
      if (update.progress >= (def?.max ?? 1)) {
        update.completedAt = new Date().toISOString();
      }
      merged.unshift(update);
    });

    setAchievements(merged);
    
    // Persist to Supabase
    try {
      setUpdating(true);
      await updateGameData({ achievements: merged });
    } catch (e) {
      console.error("Failed to persist achievements", e);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateQuests = async (updates) => {
    if (!updates || !updates.length) return;

    const questDefMap = new Map(questDefinitions.map((q) => [q.id, q]));

    let coinsEarned = 0;

    updates.forEach((update) => {
      const q = quests.find((quest) => quest.id === update.id);
      const def = questDefMap.get(update.id);
      if (q) {
        const wasCompleted = q.completedAt != null;
        const isNowCompleted = update.progress >= (def?.max ?? 1);
        if (isNowCompleted && !wasCompleted) {
          coinsEarned += def?.reward || 0;
          try {
            addNotification({
              ...def,
              ...q,
              ...update,
              type: "quest",
              coins: def.reward,
            });
          } catch (e) {
            console.error("addNotification failed", e);
          }
        }
      }
    });

    // Compute merged quests
    const mergedQuests = quests.map((q) => {
      const update = updates.find((u) => u.id === q.id);
      if (!update) return q;

      const def = questDefMap.get(q.id);
      const result = { ...q, ...update };
      if (update.progress >= (def?.max ?? 1) && !q.completedAt) {
        result.completedAt = new Date().toISOString();
      }
      return result;
    });

    setQuests(mergedQuests);

    let dbUpdates = { quests: mergedQuests };

    if (coinsEarned > 0) {
      setGameData((prev) => {
        const newCoins = (prev.coins || 0) + coinsEarned;
        dbUpdates.coins = newCoins;
        return { ...prev, coins: newCoins };
      });
    }

    // Persist to Supabase
    try {
      setUpdating(true);
      await updateGameData(dbUpdates);
    } catch (e) {
      console.error("Failed to persist quests", e);
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
      console.error(error);
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
