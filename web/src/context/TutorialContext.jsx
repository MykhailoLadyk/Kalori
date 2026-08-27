import { createContext, useState, useEffect, useCallback } from "react";
import { useUser } from "../hooks/useUser";
import { useLocation } from "react-router-dom";

export const TutorialContext = createContext(null);

export function TutorialProvider({ children }) {
  const { user, updateUser } = useUser();
  const location = useLocation();
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [tutorialKey, setTutorialKey] = useState(0);

  // Auto-start the tutorial for first-time users on the Home page
  useEffect(() => {
    if (
      user?.userAuth &&
      user?.completedOnboarding &&
      user?.settings?.hasSeenTutorial !== true &&
      location.pathname === "/"
    ) {
      const timer = setTimeout(() => {
        setTutorialKey((k) => k + 1);
        setIsTutorialActive(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [user?.userAuth, user?.completedOnboarding, user?.settings?.hasSeenTutorial, location.pathname]);

  const startTutorial = useCallback(() => {
    setTutorialKey((k) => k + 1);
    setIsTutorialActive(true);
  }, []);

  const endTutorial = useCallback(async () => {
    setIsTutorialActive(false);
    try {
      await updateUser({ settings: { hasSeenTutorial: true } });
    } catch (e) {
      console.error("Failed to persist tutorial completion", e);
    }
  }, [updateUser]);

  return (
    <TutorialContext.Provider value={{ isTutorialActive, tutorialKey, startTutorial, endTutorial }}>
      {children}
    </TutorialContext.Provider>
  );
}
