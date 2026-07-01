import { createContext, useEffect, useState } from "react";
import { fetchMeals as apiFetchMeals, addMeal, deleteMeal, updateMeal } from "../services/mealService";
import { useUser } from "../hooks/useUser";

export const MealContext = createContext(null);

export function MealProvider({ children }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [meals, setMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getLocalYMD = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleFetchMeals = async (dateObj) => {
    try {
      setLoading(true);
      const dateStr = dateObj ? getLocalYMD(dateObj) : undefined;
      const fetchedMeals = await apiFetchMeals(dateStr);
      setMeals(fetchedMeals);
    } catch (error) {
      console.error("Failed to fetch meals", error);
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
    try {
      setUpdating(true);
      const mealWithDate = { ...meal, date: meal.date || getLocalYMD(selectedDate) };
      const newMeal = await addMeal(mealWithDate);
      setMeals((prev) => [...prev, newMeal]);
    } catch (error) {
      console.error("Failed to add meal", error);
      setError(error.message || "Failed to add meal");
      throw error; // Re-throw to let components handle it if needed
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      setUpdating(true);
      await deleteMeal(id);
      setMeals((prev) => prev.filter((meal) => meal.id !== id));
    } catch (error) {
      console.error("Failed to delete meal", error);
      setError(error.message || "Failed to delete meal");
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateMeal = async (id, updates) => {
    try {
      setUpdating(true);
      const newMeal = await updateMeal(id, updates);
      setMeals((prev) => prev.map((m) => (m.id === id ? newMeal : m)));
    } catch (error) {
      console.error("Failed to edit meal", error);
      setError(error.message || "Failed to edit meal");
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
