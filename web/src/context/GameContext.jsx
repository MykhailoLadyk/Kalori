import { createContext, useState, useEffect } from "react";
import { fetchGameData, updateGameData } from "../services/gameService";

export const GameContext = createContext(null);

const mockUserAchievements = [
  {
    id: 1,
    progress: 1,
    date: "2026-06-01",
  },
  {
    id: 2,
    progress: 2,
    date: "2026-06-02",
  },
  {
    id: 3,
    progress: 3,
    date: "2026-06-03",
  },
  {
    id: 4,
    progress: 4,
    date: "2026-06-04",
  },
  {
    id: 5,
    progress: 6,
    date: "2026-06-05",
  },
  {
    id: 6,
    progress: 8,
    date: "2026-06-06",
  },
  {
    id: 7,
    progress: 10,
    date: "2026-06-07",
  },
  {
    id: 8,
    progress: 12,
    date: "2026-06-08",
  },
  {
    id: 9,
    progress: 5,
    date: "2026-06-09",
  },
  {
    id: 10,
    progress: 7,
    date: "2026-06-10",
  },
  {
    id: 11,
    progress: 1,
    date: "2026-06-11",
  },
  {
    id: 12,
    progress: 6,
    date: "2026-06-12",
  },
];

const mockUserQuests = [
  {
    id: 2,
    progress: 3,
  },
  {
    id: 8,
    progress: 4,
  },
  {
    id: 20,
    progress: 1,
  },
];

export function GameProvider({ children }) {
  const [gameData, setGameData] = useState({
    xp_total: 494999,
    streak: 5,
    coins: 500,
  });
  const [achievements, setAchievements] = useState(mockUserAchievements);
  const [quests, setQuests] = useState(mockUserQuests);
  const [shopItems, setShopItems] = useState({
    streak_shields: 2,
    themesOwned: [1, 2, 5],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
    const newGameData = { ...gameData, ...updates };
    setGameData(newGameData);
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
    setAchievements(updates);
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
    setQuests(updates);
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
      ...(updates.themesOwned && {
        themesOwned: [...prev.themesOwned, ...updates.themesOwned],
      }),
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
