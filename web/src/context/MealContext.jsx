import { createContext, useEffect, useState, useMemo, useCallback } from "react";
import { fetchMeals as apiFetchMeals, addMeal, deleteMeal, updateMeal } from "../services/mealService";
import { useUser } from "../hooks/useUser";
import { getLocalYMD } from "../lib/dateUtils";
import { useNotifications } from "./NotificationContext";

export const MealContext = createContext(null);

export function MealProvider({ children }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { addNotification } = useNotifications();

  const handleFetchMeals = useCallback(async (dateObj) => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const dateStr = dateObj ? getLocalYMD(dateObj) : undefined;
      const fetchedMeals = await apiFetchMeals(user.id, dateStr);
      setMeals(fetchedMeals);
    } catch {
      /* fetch failure keeps last meals list */
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    // Only fetch meals if we have an authenticated user
    if (!user?.userAuth) {
      setMeals([]);
      return;
    }
    handleFetchMeals(selectedDate);
  }, [user?.userAuth, selectedDate, handleFetchMeals]);

  const handleAddMeal = useCallback(async (meal) => {
    if (!user?.id) throw new Error("No authenticated user");
    try {
      const mealWithDate = { ...meal, date: meal.date || getLocalYMD(selectedDate) };
      const newMeal = await addMeal(user.id, mealWithDate);
      setMeals((prev) => [...prev, newMeal]);
    } catch (error) {
      const msg = error.message || "Failed to add meal";
      addNotification({ type: "error", name: msg });
      throw error; // Re-throw to let components handle it if needed
    }
  }, [user?.id, selectedDate, addNotification]);

  const handleDeleteMeal = useCallback(async (id) => {
    if (!user?.id) throw new Error("No authenticated user");
    try {
      await deleteMeal(user.id, id);
      setMeals((prev) => prev.filter((meal) => meal.id !== id));
    } catch (error) {
      const msg = error.message || "Failed to delete meal";
      addNotification({ type: "error", name: msg });
      throw error;
    }
  }, [user?.id, addNotification]);

  const handleUpdateMeal = useCallback(async (id, updates) => {
    if (!user?.id) throw new Error("No authenticated user");
    try {
      const newMeal = await updateMeal(user.id, id, updates);
      setMeals((prev) => prev.map((m) => (m.id === id ? newMeal : m)));
    } catch (error) {
      const msg = error.message || "Failed to edit meal";
      addNotification({ type: "error", name: msg });
      throw error;
    }
  }, [user?.id, addNotification]);

  const value = useMemo(
    () => ({
      meals,
      fetchMeals: handleFetchMeals,
      selectedDate,
      setSelectedDate,
      loading,
      addMeal: handleAddMeal,
      deleteMeal: handleDeleteMeal,
      updateMeal: handleUpdateMeal,
    }),
    [meals, selectedDate, loading, handleFetchMeals, handleAddMeal, handleDeleteMeal, handleUpdateMeal],
  );

  return (
    <MealContext.Provider
      value={value}
    >
      {children}
    </MealContext.Provider>
  );
}
