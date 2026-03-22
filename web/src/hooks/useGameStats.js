import { useContext } from "react";
import { GameContext } from "../context/GameContext";
export function useGameStats() {
  return useContext(GameContext);
}
