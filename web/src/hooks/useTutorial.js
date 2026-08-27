import { useContext } from "react";
import { TutorialContext } from "../context/TutorialContext";
export function useTutorial() {
  return useContext(TutorialContext);
}
