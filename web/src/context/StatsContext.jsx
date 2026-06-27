import { createContext, useMemo, useCallback } from "react";
import { useMeals } from "../hooks/useMeals";
import { useUser } from "../hooks/useUser";

export const StatsContext = createContext(null);

// Deterministic LCG pseudo-random generator
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateMockData(targets) {
  const data = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Initialize PRNG outside the loop to ensure progressive variance across days
  const baseSeed = 10;
  const rand = seededRandom(baseSeed);

  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    // Variance helper yielding a continuous deterministic stream within [0.7, 1.3]
    const vary = (target) => {
      const factor = 0.9 + rand() * 0.6;
      return Math.round(target * factor);
    };

    data.push({
      date: d.toISOString().slice(0, 10),
      calories: vary(targets.calories),
      protein: vary(targets.protein),
      carbs: vary(targets.carbs),
      fat: vary(targets.fat),
      water: vary(targets.water),
    });
  }
  return data;
}

export function StatsProvider({ children }) {
  const { meals } = useMeals();
  const { user } = useUser();

  const targets = useMemo(
    () =>
      user?.targets || {
        calories: 2000,
        protein: 150,
        carbs: 250,
        fat: 70,
        water: 3000,
      },
    [user?.targets],
  );

  const dailyData = useMemo(() => {
    const mock = generateMockData(targets);
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayIndex = mock.findIndex((d) => d.date === todayStr);

    if (todayIndex !== -1) {
      const foodMeals = meals.filter((m) => !m.amount && m.calories);
      const waterEntries = meals.filter((m) => m.amount);

      mock[todayIndex] = {
        date: todayStr,
        calories: foodMeals.reduce((s, m) => s + (m.calories || 0), 0),
        protein: foodMeals.reduce((s, m) => s + (m.protein || 0), 0),
        carbs: foodMeals.reduce((s, m) => s + (m.carbs || 0), 0),
        fat: foodMeals.reduce((s, m) => s + (m.fat || 0), 0),
        water: waterEntries.reduce((s, m) => s + (m.amount || 0), 0),
      };
    }
    return mock;
  }, [meals, targets]);

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
      getWeekData,
      getMonthData,
      get3MonthData,
      get3MonthWeeklyAverages,
    }),
    [
      dailyData,
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
