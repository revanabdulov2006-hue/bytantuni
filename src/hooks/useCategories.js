import { useCallback, useEffect, useState } from "react";
import * as categoriesService from "../services/categories.js";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoriesService.getCategories();
      setCategories(data.slice().sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (err) {
      setError(err.message || "Kateqoriyalar yüklənmədi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addCategory(data) {
    await categoriesService.createCategory(data);
    await refresh();
  }

  async function editCategory(id, patch) {
    await categoriesService.updateCategory(id, patch);
    await refresh();
  }

  async function removeCategory(id) {
    await categoriesService.deleteCategory(id);
    await refresh();
  }

  async function moveCategory(id, direction) {
    await categoriesService.reorderCategory(id, direction);
    await refresh();
  }

  return { categories, isLoading, error, addCategory, editCategory, removeCategory, moveCategory, refresh };
}
