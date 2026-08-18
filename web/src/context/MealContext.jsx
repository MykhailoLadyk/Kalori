import { createContext, useEffect, useState } from "react";
import { fetchMeals as apiFetchMeals, addMeal, deleteMeal, updateMeal } from "../services/mealService";
import { useUser } from "../hooks/useUser";
import { getLocalYMD } from "../lib/dateUtils";
import { useNotifications } from "./NotificationContext";

export const MealContext = createContext(null);

export function MealProvider({ children }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [meals, setMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { addNotification } = useNotifications();

  const handleFetchMeals = async (dateObj) => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const dateStr = dateObj ? getLocalYMD(dateObj) : undefined;
      const fetchedMeals = await apiFetchMeals(user.id, dateStr);
      setMeals(fetchedMeals);
    } catch (error) {
      setError(error.message || "Failed to fetch meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch meals if we have an authenticated user
    if (!user?.userAuth) {
      setMeals([]);
      return;
    }
    handleFetchMeals(selectedDate);
  }, [user?.userAuth, selectedDate]);

  const handleAddMeal = async (meal) => {
    if (!user?.id) throw new Error("No authenticated user");
    try {
      setUpdating(true);
      const mealWithDate = { ...meal, date: meal.date || getLocalYMD(selectedDate) };
      const newMeal = await addMeal(user.id, mealWithDate);
      setMeals((prev) => [...prev, newMeal]);
    } catch (error) {
      const msg = error.message || "Failed to add meal";
      setError(msg);
      addNotification({ type: "error", name: msg });
      throw error; // Re-throw to let components handle it if needed
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteMeal = async (id) => {
    if (!user?.id) throw new Error("No authenticated user");
    try {
      setUpdating(true);
      await deleteMeal(user.id, id);
      setMeals((prev) => prev.filter((meal) => meal.id !== id));
    } catch (error) {
      const msg = error.message || "Failed to delete meal";
      setError(msg);
      addNotification({ type: "error", name: msg });
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateMeal = async (id, updates) => {
    if (!user?.id) throw new Error("No authenticated user");
    try {
      setUpdating(true);
      const newMeal = await updateMeal(user.id, id, updates);
      setMeals((prev) => prev.map((m) => (m.id === id ? newMeal : m)));
    } catch (error) {
      const msg = error.message || "Failed to edit meal";
      setError(msg);
      addNotification({ type: "error", name: msg });
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  return (
    <MealContext.Provider
      value={{
        meals,
        fetchMeals: handleFetchMeals,
        selectedDate,
        setSelectedDate,
        error,
        loading,
        updating,
        addMeal: handleAddMeal,
        deleteMeal: handleDeleteMeal,
        updateMeal: handleUpdateMeal,
      }}
    >
      {children}
    </MealContext.Provider>
  );
}
