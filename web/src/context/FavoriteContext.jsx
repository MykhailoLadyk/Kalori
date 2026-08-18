import { createContext, useState, useEffect } from "react";
import { fetchFavorites, addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite } from "../services/favoriteService";
import { fetchRecentUniqueMeals } from "../services/mealService";
import { useUser } from "../hooks/useUser";

export const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
  const { user } = useUser();
  const [favorites, setFavorites] = useState([]);
  const [recentMeals, setRecentMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.userAuth || !user?.id) return;

    const load = async () => {
      try {
        setLoading(true);
        const [favs, recents] = await Promise.all([
          fetchFavorites(user.id),
          fetchRecentUniqueMeals(user.id, 5),
        ]);
        setFavorites(favs);
        setRecentMeals(recents);
      } catch (e) {
        // Silently fail — non-critical feature
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.userAuth, user?.id]);

  const handleAddFavorite = async (meal) => {
    if (!user?.id) return;
    try {
      const newFav = await apiAddFavorite(user.id, meal);
      setFavorites((prev) => [newFav, ...prev]);
    } catch (e) {
      throw e;
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    if (!user?.id) return;
    try {
      await apiRemoveFavorite(user.id, favoriteId);
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    } catch (e) {
      throw e;
    }
  };

  const isFavorite = (mealName) => {
    if (!mealName) return false;
    return favorites.some(
      (f) => f.name.toLowerCase().trim() === mealName.toLowerCase().trim()
    );
  };

  const getFavoriteByName = (mealName) => {
    if (!mealName) return null;
    return favorites.find(
      (f) => f.name.toLowerCase().trim() === mealName.toLowerCase().trim()
    ) || null;
  };

  const refreshRecents = async () => {
    if (!user?.id) return;
    try {
      const recents = await fetchRecentUniqueMeals(user.id, 5);
      setRecentMeals(recents);
    } catch (e) {
      // Silently fail
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        recentMeals,
        loading,
        addFavorite: handleAddFavorite,
        removeFavorite: handleRemoveFavorite,
        isFavorite,
        getFavoriteByName,
        refreshRecents,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}
