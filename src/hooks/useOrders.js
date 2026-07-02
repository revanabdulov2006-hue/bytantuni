import { useCallback, useEffect, useState } from "react";
import * as ordersService from "../services/orders.js";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersService.getOrders();
      setOrders(data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError(err.message || "Sifarişlər yüklənmədi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function updateStatus(id, status) {
    await ordersService.updateOrderStatus(id, status);
    await refresh();
  }

  async function addOrder(data) {
    const order = await ordersService.createOrder(data);
    await refresh();
    return order;
  }

  return { orders, isLoading, error, updateStatus, addOrder, refresh };
}
