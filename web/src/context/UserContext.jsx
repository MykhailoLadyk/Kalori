import { createContext, useContext, useState, useEffect } from "react";
import { fetchUser, updateUser } from "../services/userService";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: "Maria",
    email: "maria@example.com",
    age: 28,
    userAuth: true,
    completedOnboarding: true,
    targets: {
      calories: 2800,
      protein: 150,
      carbs: 250,
      fat: 110,
      water: 3000,
    },
    settings: {
      timezone: "UTC+1",
      language: "pl",
      theme: 1,
      measurement_system: "metric",
      weight_goal: "maintain",
      activity_level: "moderate",
      weight: 70,
      height: 175,
    },
  });
  const [loading, setLoading] = useState(false); // change to true later
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       const userData = await fetchUser();
  //       setUser(userData);
  //     } catch (error) {
  //       setError(error.message || "Failed to fetch user");
  //       console.error("Failed to fetch user");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadUser();
  // }, []);

  const handleUpdateUser = async (updates) => {
    try {
      setUpdating(true);
      setError(null);
      // For nested settings updates
      const updatedUser = {
        ...user,
        ...updates,
        settings: {
          ...user.settings,
          ...updates.settings,
        },
        targets: {
          ...user.targets,
          ...updates.targets,
        },
      };

      setUser(updatedUser);
      // In production, await updateUser(updates);
    } catch (error) {
      setError(error.message || "Failed to update user");
      console.error("Failed to update user", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        updating,
        error,
        updateUser: handleUpdateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
