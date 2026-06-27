import { createContext, useEffect, useState } from "react";
import {
  fetchMeals,
  addMeal,
  deleteMeal,
  updateMeal,
  fetchMealsByRange,
} from "../services/mealService";

export const MealContext = createContext(null);

export function MealProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [meals, setMeals] = useState([
    {
      name: "rice",
      calories: 200,
      protein: 5,
      carbs: 45,
      fat: 1,
      type: "lunch",
    },
    {
      name: "chicken",
      calories: 300,
      protein: 30,
      carbs: 0,
      fat: 1500,
      type: "breakfast",
    },
    {
      name: "big rice",
      calories: 400,
      protein: 5,
      carbs: 45,
      fat: 1,
      type: "breakfast",
    },
    { name: "water", amount: 250 },
  ]);
  const [rangeMeals, setRangeMeals] = useState([]);
  const [rangeLoading, setRangeLoading] = useState(false);

  // useEffect(() => {
  //   const loadMeals = async () => {
  //     try {
  //       setLoading(true);
  //       const meals = await fetchMeals();
  //       setMeals(meals);
  //     } catch (error) {
  //       console.error("Failed to fetch meals");
  //       setError(error.message || "Failed to fetch meals");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   loadMeals();
  // }, []);
  const handleAddMeal = async (meal) => {
    // try {
    //   setUpdating(true);
    //   const newMeal = await addMeal(meal);
    //   setMeals((prev) => [...prev, newMeal]);
    //   if (rangeMeals.length > 0) {
    //     setRangeMeals((prev) => [...prev, newMeal]);
    //   }
    // } catch (error) {
    //   console.error("Failed to add meal");
    //   setError(error.message || "Failed to add meal");
    // } finally {
    //   setUpdating(false);
    // }
    const newMeal = { ...meal, id: Date.now() };
    setMeals((prev) => [...prev, newMeal]);
  };
  const handleDeleteMeal = async (id) => {
    // try {
    //   setUpdating(true);
    //   await deleteMeal(id);
    //   setMeals((prev) => prev.filter((meal) => meal.id !== id));
    //   if (rangeMeals.length > 0) {
    //     setRangeMeals((prev) => prev.filter((m) => m.id !== id));
    //   }
    // } catch (error) {
    //   console.error("Failed to delete meal");
    //   setError(error.message || "Failed to delete meal");
    // } finally {
    //   setUpdating(false);
    // }
    setMeals((prev) => prev.filter((meal) => meal.name !== id));
  };
  const handleUpdateMeal = async (id, updates) => {
    // try {
    //   setUpdating(true);
    //   const newMeal = await updateMeal(id, updates);
    //   setMeals((prev) => prev.map((m) => (m.id === id ? newMeal : m)));
    //   if (rangeMeals.length > 0) {
    //     setRangeMeals((prev) => prev.map((m) => (m.id === id ? newMeal : m)));
    //   }
    // } catch (error) {
    //   console.error("Failed to edit meal");
    //   setError(error.message || "Failed to edit meal");
    // } finally {
    //   setUpdating(false);
    // }
    console.log("Updating meal:", id, updates); // Debugging line to check the update parameters
    setMeals((prev) =>
      prev.map((meal) => (meal.name === id ? { ...meal, ...updates } : meal)),
    );
  };

  const handleFetchMealsByRange = async (/* startDate, endDate*/ period) => {
    // try {
    //   setRangeLoading(true);
    //   const data = await fetchMealsByRange(startDate, endDate);
    //   setRangeMeals(data);
    // } catch (err) {
    //   console.error("Failed to fetch meals by range");
    //   setError(err.message || "Failed to fetch meals by range");
    // } finally {
    //   setRangeLoading(false);
    // }
    if (period === "W") {
      setRangeMeals([
        {
          name: "W 1",
          calories: 900,
          protein: 50,
          carbs: 425,
          fat: 111,
          type: "lunch",
        },
        {
          name: "W 2",
          calories: 300,
          protein: 30,
          carbs: 0,
          fat: 10,
          type: "dinner",
        },
        {
          name: "W 3",
          calories: 340,
          protein: 50,
          carbs: 45,
          fat: 11,
          type: "breakfast",
        },
        { name: "water", amount: 250 },
      ]);
    } else if (period === "M") {
      setRangeMeals([
        {
          name: "1 st",
          calories: 900,
          protein: 50,
          carbs: 425,
          fat: 111,
          type: "lunch",
        },
        {
          name: "2nd",
          calories: 300,
          protein: 30,
          carbs: 0,
          fat: 10,
          type: "dinner",
        },
        {
          name: "big 3 rd",
          calories: 340,
          protein: 50,
          carbs: 45,
          fat: 11,
          type: "breakfast",
        },
        { name: "water", amount: 250 },
      ]);
    } else if (period === "3M") {
      setRangeMeals([
        {
          name: "12222 st",
          calories: 90,
          protein: 1,
          carbs: 1,
          fat: 2,
          type: "snacks",
        },
        {
          name: "em 2222",
          calories: 700,
          protein: 320,
          carbs: 0,
          fat: 10,
          type: "dinner",
        },
        {
          name: "3m",
          calories: 440,
          protein: 150,
          carbs: 4,
          fat: 11,
          type: "lunch",
        },
        { name: "water", amount: 2250 },
      ]);
    }
  };
  useEffect(() => {
    handleFetchMealsByRange("W");
  }, []);
  return (
    <MealContext.Provider
      value={{
        meals,
        setMeals,
        error,
        loading,
        updating,
        rangeMeals,
        rangeLoading,
        addMeal: handleAddMeal,
        deleteMeal: handleDeleteMeal,
        updateMeal: handleUpdateMeal,
        fetchMealsByRange: handleFetchMealsByRange,
      }}
    >
      {children}
    </MealContext.Provider>
  );
}
