import { useContext } from "react";
import { MealContext } from "../context/MealContext";
export function useMeals() {
  return useContext(MealContext);
}
