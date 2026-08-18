import { useContext } from "react";
import { FavoriteContext } from "../context/FavoriteContext";
export function useFavorites() {
  return useContext(FavoriteContext);
}
