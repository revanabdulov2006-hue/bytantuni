import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Wallet, Megaphone, Package, Layers } from "lucide-react";
import StatCard from "../../components/ui/StatCard.jsx";
import RecentOrdersTable from "../../components/dashboard/RecentOrdersTable.jsx";
import BestSellersList from "../../components/dashboard/BestSellersList.jsx";
import ActivityFeed from "../../components/dashboard/ActivityFeed.jsx";
import OrderDetailModal from "../../components/orders/OrderDetailModal.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { useDashboardStats } from "../../hooks/useDashboardStats.js";
import { useOrders } from "../../hooks/useOrders.js";
import { formatPrice } from "../../utils/format.js";

export default function DashboardPage() {
  const navigate = useNavigate();
  const stats = useDashboardStats();
  const { updateStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (stats.error) {
    return <EmptyState icon="⚠️" title="Xəta baş verdi" description={stats.error} />;
  }

  const statCards = [
    { icon: ShoppingBag, label: "Bugünkü Sifarişlər", value: stats.todayOrdersCount, path: "/admin/orders" },
    { icon: Wallet, label: "Bugünkü Gəlir", value: formatPrice(stats.todayRevenue), path: "/admin/orders" },
    { icon: Megaphone, label: "Aktiv Kampaniyalar", value: stats.activeCampaignsCount, path: "/admin/campaigns" },
    { icon: Package, label: "Toplam Məhsul", value: stats.totalProducts, path: "/admin/products" },
    { icon: Layers, label: "Toplam Kateqoriya", value: stats.totalCategories, path: "/admin/categories" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            icon={card.icon}
            label={card.label}
            value={card.value}
            loading={stats.isLoading}
            onClick={() => navigate(card.path)}
          />
        ))}
      </div>

      <RecentOrdersTable
        orders={stats.recentOrders}
        isLoading={stats.isLoading}
        onRowClick={setSelectedOrder}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BestSellersList items={stats.bestSellers} isLoading={stats.isLoading} />
        <ActivityFeed items={stats.recentActivity} isLoading={stats.isLoading} />
      </div>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onChangeStatus={updateStatus}
      />
    </div>
  );
}
