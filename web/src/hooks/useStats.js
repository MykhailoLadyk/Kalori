import { useContext } from "react";
import { StatsContext } from "../context/StatsContext";
export function useStats() {
  return useContext(StatsContext);
}
