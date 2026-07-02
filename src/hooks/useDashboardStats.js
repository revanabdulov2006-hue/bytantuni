import { useMemo } from "react";
import { useProducts } from "./useProducts.js";
import { useCategories } from "./useCategories.js";
import { useOrders } from "./useOrders.js";
import { useCampaigns } from "./useCampaigns.js";
import { isSameDay } from "../utils/format.js";

export function useDashboardStats() {
  const { products, isLoading: productsLoading, error: productsError } = useProducts();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { orders, isLoading: ordersLoading, error: ordersError } = useOrders();
  const { campaigns, isLoading: campaignsLoading, error: campaignsError } = useCampaigns();

  const isLoading = productsLoading || categoriesLoading || ordersLoading || campaignsLoading;
  const error = productsError || categoriesError || ordersError || campaignsError || null;

  const stats = useMemo(() => {
    const today = new Date();
    const todayOrders = orders.filter((o) => isSameDay(o.createdAt, today));
    const todayRevenue = todayOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    const activeCampaignsCount = campaigns.filter((c) => c.active).length;

    const qtyByProduct = {};
    for (const order of orders) {
      if (order.status === "cancelled") continue;
      for (const item of order.items) {
        qtyByProduct[item.name] = (qtyByProduct[item.name] || 0) + item.qty;
      }
    }
    const bestSellers = Object.entries(qtyByProduct)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const recentOrders = orders.slice(0, 6);

    const recentActivity = orders.slice(0, 6).map((o) => ({
      type: "order",
      label: `${o.customerName} - ${o.orderNumber}`,
      ts: o.createdAt,
    }));

    return {
      todayOrdersCount: todayOrders.length,
      todayRevenue,
      activeCampaignsCount,
      totalProducts: products.length,
      totalCategories: categories.length,
      recentOrders,
      bestSellers,
      recentActivity,
    };
  }, [products, categories, orders, campaigns]);

  return { ...stats, isLoading, error };
}
