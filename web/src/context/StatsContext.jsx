import { createContext, useMemo, useCallback, useState, useEffect } from "react";
import { useMeals } from "../hooks/useMeals";
import { useUser } from "../hooks/useUser";
import { fetchMealsByRange } from "../services/mealService";
import { fetchWeightLogsByRange } from "../services/weightService";
import { getLocalYMD } from "../lib/dateUtils";

export const StatsContext = createContext(null);

export function StatsProvider({ children }) {
  const { meals } = useMeals(); // Today's meals
  const { user } = useUser();
  const [historicalMeals, setHistoricalMeals] = useState([]);
  const [historicalWeights, setHistoricalWeights] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);

  const loadHistoricalData = useCallback(async () => {
    if (!user?.id) {
      setHistoricalMeals([]);
      setHistoricalWeights([]);
      return;
    }
    try {
      setLoadingStats(true);
      const today = new Date();
      const ninetyDaysAgo = new Date(today);
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 89);

      const endDate = getLocalYMD(today);
      const startDate = getLocalYMD(ninetyDaysAgo);

      const [mealData, weightData] = await Promise.all([
        fetchMealsByRange(user.id, startDate, endDate),
        fetchWeightLogsByRange(user.id, startDate, endDate),
      ]);
      setHistoricalMeals(mealData || []);
      setHistoricalWeights(weightData || []);
    } catch (err) {
    } finally {
      setLoadingStats(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.userAuth) {
      loadHistoricalData();
    }
  }, [user?.userAuth, loadHistoricalData]);

  const dailyData = useMemo(() => {
    const dataMap = new Map();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Initialize the last 90 days with 0s
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = getLocalYMD(d);
      dataMap.set(dateStr, { date: dateStr, calories: 0, protein: 0, carbs: 0, fat: 0, water: 0, weight: 0 });
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
    const todayStr = getLocalYMD(today);
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

    // Process historical weights & linear interpolation across gaps
    const daysList = Array.from(dataMap.values());
    historicalWeights.forEach((w) => {
      if (w.date && dataMap.has(w.date)) {
        dataMap.get(w.date).weight = Number(w.weight) || 0;
      }
    });

    const recordedIndices = [];
    daysList.forEach((day, idx) => {
      if (day.weight > 0) recordedIndices.push(idx);
    });

    if (recordedIndices.length === 0) {
      const fallback = user?.settings?.weight ? Number(user.settings.weight) : 0;
      daysList.forEach((day) => {
        day.weight = fallback;
      });
    } else if (recordedIndices.length === 1) {
      const singleWeight = daysList[recordedIndices[0]].weight;
      daysList.forEach((day) => {
        day.weight = singleWeight;
      });
    } else {
      // Backfill before first recorded point
      const firstIdx = recordedIndices[0];
      const firstWeight = daysList[firstIdx].weight;
      for (let i = 0; i < firstIdx; i++) {
        daysList[i].weight = firstWeight;
      }

      // Linearly interpolate between each consecutive pair of recorded points
      for (let k = 0; k < recordedIndices.length - 1; k++) {
        const startIdx = recordedIndices[k];
        const endIdx = recordedIndices[k + 1];
        const startWeight = daysList[startIdx].weight;
        const endWeight = daysList[endIdx].weight;
        const steps = endIdx - startIdx;

        for (let i = startIdx + 1; i < endIdx; i++) {
          const progress = (i - startIdx) / steps;
          daysList[i].weight = Math.round((startWeight + (endWeight - startWeight) * progress) * 10) / 10;
        }
      }

      // Forward-fill after last recorded point
      const lastIdx = recordedIndices[recordedIndices.length - 1];
      const lastWeight = daysList[lastIdx].weight;
      for (let i = lastIdx + 1; i < daysList.length; i++) {
        daysList[i].weight = lastWeight;
      }
    }

    return daysList;
  }, [historicalMeals, historicalWeights, meals, user?.settings?.weight]);

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
      const validWeights = chunk.filter((d) => d.weight > 0).map((d) => d.weight);
      const avgWeight = validWeights.length
        ? Math.round((validWeights.reduce((s, w) => s + w, 0) / validWeights.length) * 10) / 10
        : 0;

      weeks.push({
        date: chunk[midIndex].date,
        calories: Math.round(chunk.reduce((s, d) => s + d.calories, 0) / chunk.length),
        protein: Math.round(chunk.reduce((s, d) => s + d.protein, 0) / chunk.length),
        carbs: Math.round(chunk.reduce((s, d) => s + d.carbs, 0) / chunk.length),
        fat: Math.round(chunk.reduce((s, d) => s + d.fat, 0) / chunk.length),
        water: Math.round(chunk.reduce((s, d) => s + d.water, 0) / chunk.length),
        weight: avgWeight,
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
      refreshStats: loadHistoricalData,
    }),
    [dailyData, loadingStats, getWeekData, getMonthData, get3MonthData, get3MonthWeeklyAverages, loadHistoricalData],
  );

  return <StatsContext.Provider value={contextValue}>{children}</StatsContext.Provider>;
}
