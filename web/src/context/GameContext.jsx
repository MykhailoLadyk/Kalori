import { createContext, useState, useEffect } from "react";
import { useNotifications } from "./NotificationContext";
import { fetchGameData, updateGameData } from "../services/gameService";

export const GameContext = createContext(null);

const mockUserAchievements = [
  { id: 1, progress: 1, date: "2026-06-01" },
  { id: 2, progress: 2, date: "2026-06-02" },
  { id: 3, progress: 3, date: "2026-06-03" },
  { id: 4, progress: 4, date: "2026-06-04" },
  { id: 5, progress: 6, date: "2026-06-05" },
  { id: 6, progress: 8, date: "2026-06-06" },
  { id: 7, progress: 10, date: "2026-06-07" },
  { id: 8, progress: 12, date: "2026-06-08" },
  { id: 9, progress: 5, date: "2026-06-09" },
  { id: 10, progress: 7, date: "2026-06-10" },
  { id: 11, progress: 1, date: "2026-06-11" },
  { id: 12, progress: 6, date: "2026-06-12" },
];

const mockUserQuests = [
  { id: 2, progress: 3 },
  { id: 8, progress: 4 },
  { id: 20, progress: 1 },
];

export function GameProvider({ children }) {
  const [gameData, setGameData] = useState({ xp_total: 0, streak: 0, coins: 500 });
  const [achievements, setAchievements] = useState(mockUserAchievements);
  const [quests, setQuests] = useState(mockUserQuests);
  const [shopItems, setShopItems] = useState({ streak_shields: 2, themesOwned: [1, 2, 5] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // const loadGameData = async () => {
    //   try {
    //     setLoading(true);
    //     const data = await fetchGameData();
    //      // get achievements, quests, and shop items
    //     setGameData(data);
    //   } catch (error) {
    //     setError("Failed to fetch game data");
    //     console.error(error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // loadGameData();
  }, []);

  const handleUpdateGameData = async (updates) => {
    // try {
    //   setUpdating(true);
    //   const updatedGameData = await updateGameData(updates);
    //   setGameData(updatedGameData);
    // } catch (error) {
    //   setError(error.message || "Failed to update game data");
    //   console.error(error);
    // } finally {
    //   setUpdating(false);
    // }
    const prev = gameData;
    const newGameData = { ...gameData, ...updates };
    setGameData(newGameData);

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
  };
  const handleUpdateAchievements = async (updates) => {
    // try {
    //   setUpdating(true);
    //   const updatedGameData = await updateGameData(updates);
    //   setGameData(updatedGameData);
    // } catch (error) {
    //   setError(error.message || "Failed to update game data");
    //   console.error(error);
    // } finally {
    //   setUpdating(false);
    // }
    const prev = achievements;
    // support either array or single achievement
    if (Array.isArray(updates)) {
      const newOnes = updates.filter((u) => !prev.some((p) => p.id === u.id));
      setAchievements(updates);
      try {
        newOnes.forEach((ach) => addNotification({ type: "achievement", ...ach }));
      } catch (e) {
        console.error("addNotification failed", e);
      }
    } else if (updates && typeof updates === "object") {
      // single achievement
      if (!prev.some((p) => p.id === updates.id)) {
        setAchievements((p) => [updates, ...p]);
        try {
          addNotification({ type: "achievement", ...updates });
        } catch (e) {
          console.error("addNotification failed", e);
        }
      } else {
        setAchievements((p) => p.map((it) => (it.id === updates.id ? updates : it)));
      }
    }
  };
  const handleUpdateQuests = async (updates) => {
    // try {
    //   setUpdating(true);
    //   const updatedGameData = await updateGameData(updates);
    //   setGameData(updatedGameData);
    // } catch (error) {
    //   setError(error.message || "Failed to update game data");
    //   console.error(error);
    // } finally {
    //   setUpdating(false);
    // }
    const prev = quests;
    if (Array.isArray(updates)) {
      // completed quests are those present in prev but missing in updates
      const completed = prev.filter((p) => !updates.some((u) => u.id === p.id));
      setQuests(updates);
      try {
        completed.forEach((q) => addNotification({ type: "quest", ...q }));
      } catch (e) {
        console.error("addNotification failed", e);
      }
    } else if (updates && typeof updates === "object") {
      // single quest update: if progress indicates completion (e.g., completed flag or removed elsewhere)
      setQuests((prevQ) => prevQ.map((q) => (q.id === updates.id ? { ...q, ...updates } : q)));
    }
  };
  const handleUpdateShopItems = async (updates) => {
    // try {
    //   setUpdating(true);
    //   const updatedGameData = await updateGameData(updates);
    //   setGameData(updatedGameData);
    // } catch (error) {
    //   setError(error.message || "Failed to update game data");
    //   console.error(error);
    // } finally {
    //   setUpdating(false);
    // }

    setShopItems((prev) => ({
      ...prev,
      ...updates,
      ...(updates.themesOwned && { themesOwned: [...prev.themesOwned, ...updates.themesOwned] }),
    }));
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
