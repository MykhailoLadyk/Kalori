import { createContext, useState, useEffect } from "react";
import { fetchUser, updateUser } from "../services/userService";
import { supabase } from "../services/supabase";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const userData = await fetchUser();
          if (mounted) {
            setUser({ 
              ...userData, 
              userAuth: true,
              email: session.user.email 
            });
          }
        } else {
          if (mounted) setUser(null);
        }
      } catch (error) {
        if (mounted) {
          setError(error.message || "Failed to fetch user");
          console.error("Failed to fetch user", error);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUserProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          loadUserProfile();
        } else if (event === "SIGNED_OUT") {
          if (mounted) setUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleUpdateUser = async (updates) => {
    try {
      setUpdating(true);
      setError(null);
      
      const newSettings = updates.settings ? { ...user.settings, ...updates.settings } : user.settings;
      const newTargets = updates.targets ? { ...user.targets, ...updates.targets } : user.targets;

      const fullUpdates = {
        ...updates,
        settings: newSettings,
        targets: newTargets,
      };
      
      // Update local state optimistically
      setUser(prev => ({
        ...prev,
        ...fullUpdates,
      }));

      // Remove frontend-only properties before sending to db
      const dbUpdates = { ...fullUpdates };
      delete dbUpdates.userAuth;
      delete dbUpdates.email;
      
      await updateUser(dbUpdates);
    } catch (error) {
      setError(error.message || "Failed to update user");
      console.error("Failed to update user", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, updating, error, updateUser: handleUpdateUser }}>
      {children}
    </UserContext.Provider>
  );
}
