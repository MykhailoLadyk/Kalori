import { createContext, useMemo, useCallback, useState, useEffect } from "react";
import { useMeals } from "../hooks/useMeals";
import { useUser } from "../hooks/useUser";
import { fetchMealsByRange } from "../services/mealService";

export const StatsContext = createContext(null);

export function StatsProvider({ children }) {
  const { meals } = useMeals(); // Today's meals
  const { user } = useUser();
  const [historicalMeals, setHistoricalMeals] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (!user?.userAuth) {
      setHistoricalMeals([]);
      return;
    }

    const loadHistoricalData = async () => {
      try {
        setLoadingStats(true);
        const today = new Date();
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 89);

        const endDate = today.toISOString().split("T")[0];
        const startDate = ninetyDaysAgo.toISOString().split("T")[0];

        const data = await fetchMealsByRange(startDate, endDate);
        setHistoricalMeals(data);
      } catch (err) {
        console.error("Failed to load historical stats", err);
      } finally {
        setLoadingStats(false);
      }
    };

    loadHistoricalData();
  }, [user?.userAuth]);

  const dailyData = useMemo(() => {
    const dataMap = new Map();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Initialize the last 90 days with 0s
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      dataMap.set(dateStr, {
        date: dateStr,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        water: 0,
      });
    }

    // Process historical meals
    historicalMeals.forEach((meal) => {
      if (meal.date && dataMap.has(meal.date)) {
        const day = dataMap.get(meal.date);
        if (meal.name === "water" || meal.amount) {
          day.water += meal.amount || 0;
        } else {
          day.calories += meal.calories || 0;
          day.protein += meal.protein || 0;
          day.carbs += meal.carbs || 0;
          day.fat += meal.fat || 0;
        }
      }
    });

    // Override today's data with the live 'meals' state to ensure it's up to date
    const todayStr = today.toISOString().slice(0, 10);
    if (dataMap.has(todayStr)) {
      const day = dataMap.get(todayStr);
      day.calories = 0;
      day.protein = 0;
      day.carbs = 0;
      day.fat = 0;
      day.water = 0;

      meals.forEach((m) => {
        if (m.name === "water" || m.amount) {
          day.water += m.amount || 0;
        } else {
          day.calories += m.calories || 0;
          day.protein += m.protein || 0;
          day.carbs += m.carbs || 0;
          day.fat += m.fat || 0;
        }
      });
    }

    return Array.from(dataMap.values());
  }, [historicalMeals, meals]);

  // Memoize functions to prevent downstream consumers from re-rendering unexpectedly
  const getWeekData = useCallback(() => dailyData.slice(-7), [dailyData]);
  const getMonthData = useCallback(() => dailyData.slice(-30), [dailyData]);
  const get3MonthData = useCallback(() => dailyData, [dailyData]);

  const get3MonthWeeklyAverages = useCallback(() => {
    const weeks = [];
    for (let i = 0; i < dailyData.length; i += 7) {
      const chunk = dailyData.slice(i, i + 7);
      if (chunk.length === 0) continue;

      const midIndex = Math.floor(chunk.length / 2);
      weeks.push({
        date: chunk[midIndex].date,
        calories: Math.round(
          chunk.reduce((s, d) => s + d.calories, 0) / chunk.length,
        ),
        protein: Math.round(
          chunk.reduce((s, d) => s + d.protein, 0) / chunk.length,
        ),
        carbs: Math.round(
          chunk.reduce((s, d) => s + d.carbs, 0) / chunk.length,
        ),
        fat: Math.round(chunk.reduce((s, d) => s + d.fat, 0) / chunk.length),
        water: Math.round(
          chunk.reduce((s, d) => s + d.water, 0) / chunk.length,
        ),
      });
    }
    return weeks;
  }, [dailyData]);

  const contextValue = useMemo(
    () => ({
      dailyData,
      loadingStats,
      getWeekData,
      getMonthData,
      get3MonthData,
      get3MonthWeeklyAverages,
    }),
    [
      dailyData,
      loadingStats,
      getWeekData,
      getMonthData,
      get3MonthData,
      get3MonthWeeklyAverages,
    ],
  );

  return (
    <StatsContext.Provider value={contextValue}>
      {children}
    </StatsContext.Provider>
  );
}
