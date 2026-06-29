import { createContext, useState, useEffect } from "react";
import { useNotifications } from "./NotificationContext";
import { fetchGameData, updateGameData } from "../services/gameService";

export const GameContext = createContext(null);

const mockUserAchievements = [
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
  { id: 11, progress: 0 },
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

const mockUserQuests = [
  { id: 2, progress: 0 },
  { id: 8, progress: 0 },
  { id: 20, progress: 0 },
];

export function GameProvider({ children }) {
  const [gameData, setGameData] = useState({ xp_total: 0, streak: 0, coins: 100 });
  const [achievements, setAchievements] = useState(mockUserAchievements);
  const [quests, setQuests] = useState(mockUserQuests);
  const [shopItems, setShopItems] = useState({ streak_shields: 0, themesOwned: [1] });
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
    if (!prev.some((p) => p.id === updates.id)) {
      setAchievements((p) => [updates, ...p]);
    } else {
      setAchievements((p) => p.map((it) => (it.id === updates.id ? updates : it)));
    }
    const newOnes = updates.filter((u) => !prev.some((p) => p.id === u.id));
    try {
      newOnes.forEach((ach) => addNotification({ type: "achievement", ...ach }));
    } catch (e) {
      console.error("addNotification failed", e);
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
    const completed = prev.filter((p) => !updates.some((u) => u.id === p.id));
    try {
      completed.forEach((q) => addNotification({ type: "quest", ...q }));
    } catch (e) {
      console.error("addNotification failed", e);
    }
    setQuests((prevQ) => prevQ.map((q) => (q.id === updates.id ? { ...q, ...updates } : q)));
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
