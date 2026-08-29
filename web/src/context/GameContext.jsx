import { createContext, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNotifications } from "./NotificationContext";
import { fetchGameData, syncGameProgress, applyStreakDecay, deductCoins as deductCoinsService } from "../services/gameService";
import { achievements as achievementDefinitions, quests as questDefinitions } from "../lib/constants";
import { useUser } from "../hooks/useUser";
import { supabase } from "../services/supabase";
import { getTodayDateString } from "../lib/dateUtils";

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

const defaultQuests = [];

export function GameProvider({ children }) {
  const { user } = useUser();
  const [gameData, setGameData] = useState({ xp_total: 0, streak: 0, coins: 0, level: 1, last_log_date: null });
  const gameDataRef = useRef({ xp_total: 0, streak: 0, coins: 0, level: 1, last_log_date: null });
  const [achievements, setAchievements] = useState(defaultAchievements);
  const achievementsRef = useRef(defaultAchievements);
  const [quests, setQuests] = useState(defaultQuests);
  const questsRef = useRef(defaultQuests);
  const [shopItems, setShopItems] = useState({
    streak_shields: 0,
    themesOwned: [1],
    avatarsOwned: ["initial"],
    flameColorsOwned: ["orange"],
    upgradesOwned: [],
  });
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!user?.userAuth) return;

    const loadGameData = async () => {
      try {
        const data = await fetchGameData();

        if (data.achievements) {
          setAchievements(data.achievements);
          achievementsRef.current = data.achievements;
        }
        setShopItems({
          streak_shields: data.streak_shields ?? 0,
          themesOwned: data.themesOwned || data.themes_owned || [1],
          avatarsOwned: data.avatars_owned || data.avatarsOwned || ["initial"],
          flameColorsOwned: data.flame_colors_owned || data.flameColorsOwned || ["orange"],
          upgradesOwned: data.upgrades || data.upgrades_owned || [],
        });

        // --- Server-Authoritative Streak Decay Logic ---
        const today = getTodayDateString();
        const decayResult = await applyStreakDecay(today);
        if (decayResult.changed) {
          data.streak = decayResult.streak;
          data.streak_shields = decayResult.streak_shields;
          data.last_log_date = decayResult.last_log_date;
          setShopItems((prev) => ({ ...prev, streak_shields: decayResult.streak_shields }));
        }

        // --- Server-Authoritative Quest Refresh Logic ---
        if ((data.level || 1) >= 2) {
          const { data: qData } = await supabase.rpc("check_and_refresh_quests", {
            p_local_date: today,
          });
          const activeQuests = qData?.quests || data.quests || defaultQuests;
          setQuests(activeQuests);
          questsRef.current = activeQuests;
        }

        setGameData(data);
        gameDataRef.current = data;
      } catch {
        /* game data load failure keeps last known state */
      }
    };
    loadGameData();
  }, [user?.userAuth]);

  const refreshGameData = useCallback(async () => {
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
      setShopItems({
        streak_shields: data.streak_shields ?? 0,
        themesOwned: data.themesOwned || data.themes_owned || [1],
        avatarsOwned: data.avatars_owned || data.avatarsOwned || ["initial"],
        flameColorsOwned: data.flame_colors_owned || data.flameColorsOwned || ["orange"],
        upgradesOwned: data.upgrades || data.upgrades_owned || [],
      });

      setGameData(data);
      gameDataRef.current = data;
    } catch {
      /* refresh failure keeps last known state */
    }
  }, []);

  const handleSyncProgress = useCallback(async (localDate, isMealLog = false) => {
    const prevLevel = gameDataRef.current?.level || 1;
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

    if (result.level >= 2 && prevLevel < 2) {
      const today = getTodayDateString();
      const { data: qData } = await supabase.rpc("check_and_refresh_quests", {
        p_local_date: today,
      });
      if (qData?.quests) {
        setQuests(qData.quests);
        questsRef.current = qData.quests;
      }
    } else if (result.quests) {
      setQuests(result.quests);
      questsRef.current = result.quests;
    }
    if (result.achievements) {
      setAchievements(result.achievements);
      achievementsRef.current = result.achievements;
    }

    // Notifications
    try {
      let extraCoins = 0;
      let extraXp = 0;
      (result.notifications || []).forEach((notif) => {
        if (notif.type === "quest") {
          extraCoins += notif.reward || notif.coins || 0;
          extraXp += notif.xp || 0;
        } else if (notif.type === "target") {
          extraCoins += notif.coins || 0;
          extraXp += notif.xp || 0;
        } else if (notif.type === "achievement") {
          extraCoins += notif.coins || 0;
          extraXp += notif.xp || 0;
        }
      });

      const baseXp = Math.max(0, (result.xp_awarded || 0) - extraXp);
      const baseCoins = Math.max(0, (result.coins_awarded || 0) - extraCoins);

      if (baseXp > 0) {
        addNotification({ type: "xp", amount: baseXp });
      }
      if (baseCoins > 0) {
        addNotification({ type: "coins", amount: baseCoins });
      }
      if (result.level > 1 && result.level > prevLevel) {
        addNotification({ type: "levelup", level: result.level });
      }
      (result.notifications || []).forEach((notif) => {
        if (notif.type === "quest") {
          const def = questDefinitions.find((q) => q.id === notif.id);
          addNotification({ ...def, type: "quest", coins: notif.reward });
        } else if (notif.type === "target") {
          addNotification({ type: "target", name: notif.name, xp: notif.xp, coins: notif.coins });
        } else if (notif.type === "achievement") {
          const def = achievementDefinitions.find((a) => a.id === notif.id);
          addNotification({ ...def, type: "achievement", xp: notif.xp });
        }
      });
    } catch (e) {}

    return result;
  }, [addNotification]);

  const rerollQuest = useCallback(async (questId, cost = 20) => {
    if (gameData.coins < cost) {
      addNotification({ type: "error", name: `Need ${cost} coins to reroll quest!` });
      return false;
    }

    try {
      const { data, error } = await supabase.rpc("reroll_quest", {
        p_quest_id: questId,
      });
      if (error) throw error;

      setQuests(data.quests);
      questsRef.current = data.quests;
      setGameData((prev) => ({ ...prev, coins: data.coins }));
      gameDataRef.current = { ...gameDataRef.current, coins: data.coins };
      const replacement = questDefinitions.find((q) => q.id === data.replacement_id);
      addNotification({ type: "success", name: `Rerolled: ${replacement?.name || "New Quest"} (-20 coins)` });
      return true;
    } catch (err) {
      addNotification({ type: "error", name: err.message || "Failed to reroll quest" });
      return false;
    }
  }, [gameData, addNotification]);

  const deductCoins = useCallback(async (amount = 50, reason = "AI Meal Scan") => {
    if ((gameData.coins || 0) < amount) {
      addNotification({ type: "error", name: `Need ${amount} coins for ${reason}!` });
      return false;
    }

    try {
      const remainingCoins = await deductCoinsService(amount);
      const updatedCoins = typeof remainingCoins === "number" ? remainingCoins : Math.max(0, (gameData.coins || 0) - amount);
      setGameData((prev) => ({ ...prev, coins: updatedCoins }));
      gameDataRef.current = { ...gameDataRef.current, coins: updatedCoins };
      addNotification({ type: "coins_deducted", amount: -amount, name: `-${amount} coins (${reason})` });
      return true;
    } catch (err) {
      addNotification({ type: "error", name: err.message || "Failed to deduct coins" });
      return false;
    }
  }, [gameData, addNotification]);

  const value = useMemo(
    () => ({
      gameData,
      achievements,
      quests,
      setQuests,
      shopItems,
      syncProgress: handleSyncProgress,
      refreshGameData,
      rerollQuest,
      deductCoins,
    }),
    [gameData, achievements, quests, setQuests, shopItems, handleSyncProgress, refreshGameData, rerollQuest, deductCoins],
  );

  return (
    <GameContext.Provider
      value={value}
    >
      {children}
    </GameContext.Provider>
  );
}

