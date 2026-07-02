import { useCallback, useState } from "react";
import * as favoritesService from "../services/favorites.js";

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => favoritesService.getFavorites());

  const toggle = useCallback((productId) => {
    setFavorites(favoritesService.toggleFavorite(productId));
  }, []);

  const isFavorite = useCallback((productId) => favorites.includes(productId), [favorites]);

  return { favorites, toggle, isFavorite };
}
