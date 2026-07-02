import { useCallback, useEffect, useState } from "react";
import * as customersService from "../services/customers.js";

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await customersService.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.message || "Müştərilər yüklənmədi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { customers, isLoading, error, refresh };
}
