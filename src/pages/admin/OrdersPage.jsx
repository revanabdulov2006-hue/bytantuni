import { useMemo, useState } from "react";
import DataTable from "../../components/ui/DataTable.jsx";
import SearchBar from "../../components/ui/SearchBar.jsx";
import Dropdown from "../../components/ui/Dropdown.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import OrderStatusDropdown from "../../components/orders/OrderStatusDropdown.jsx";
import OrderDetailModal from "../../components/orders/OrderDetailModal.jsx";
import { useOrders } from "../../hooks/useOrders.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { usePagination } from "../../hooks/usePagination.js";
import { ORDER_STATUS_LABELS } from "../../utils/constants.js";
import { formatDateTime, formatPrice } from "../../utils/format.js";

export default function OrdersPage() {
  const { orders, isLoading, error, updateStatus } = useOrders();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusOptions = [
    { value: "all", label: "Bütün statuslar" },
    ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label })),
  ];

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return orders.filter((o) => {
      const matchesSearch =
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.orderNumber.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, debouncedSearch, statusFilter]);

  const { page, totalPages, pageItems, goToPage } = usePagination(filtered, 8);

  const columns = [
    { key: "orderNumber", label: "Sifariş #" },
    { key: "customerName", label: "Müştəri" },
    { key: "phone", label: "Telefon" },
    {
      key: "items",
      label: "Məhsullar",
      render: (row) => (
        <span className="text-text-dim">
          {row.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
        </span>
      ),
    },
    { key: "total", label: "Məbləğ", render: (row) => formatPrice(row.total) },
    {
      key: "status",
      label: "Status",
      render: (row) => <OrderStatusDropdown order={row} onChangeStatus={updateStatus} />,
    },
    { key: "createdAt", label: "Tarix", render: (row) => formatDateTime(row.createdAt) },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-(--font-display) text-xl font-semibold text-text">Sifarişlər</h2>
        <p className="text-sm text-text-dim">Bütün sifarişləri izləyin və statuslarını yeniləyin</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Müştəri, telefon və ya sifariş #..." />
        <Dropdown value={statusFilter} options={statusOptions} onChange={setStatusFilter} />
      </div>

      <div className="rounded-2xl border border-hair bg-surface">
        {error ? (
          <EmptyState icon="⚠️" title="Xəta baş verdi" description={error} />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={pageItems}
              isLoading={isLoading}
              onRowClick={setSelectedOrder}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </div>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onChangeStatus={updateStatus}
      />
    </div>
  );
}
