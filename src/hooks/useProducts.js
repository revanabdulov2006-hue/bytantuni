import { useCallback, useEffect, useState } from "react";
import * as productsService from "../services/products.js";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productsService.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Məhsullar yüklənmədi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addProduct(data) {
    await productsService.createProduct(data);
    await refresh();
  }

  async function editProduct(id, patch) {
    await productsService.updateProduct(id, patch);
    await refresh();
  }

  async function removeProduct(id) {
    await productsService.deleteProduct(id);
    await refresh();
  }

  return { products, isLoading, error, addProduct, editProduct, removeProduct, refresh };
}
