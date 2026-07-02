import DataTable from "../ui/DataTable.jsx";
import StatusBadge from "../ui/StatusBadge.jsx";
import { formatPrice, formatRelativeTime } from "../../utils/format.js";

export default function RecentOrdersTable({ orders, isLoading, onRowClick }) {
  const columns = [
    { key: "orderNumber", label: "Sifariş #" },
    { key: "customerName", label: "Müştəri" },
    { key: "total", label: "Məbləğ", render: (row) => formatPrice(row.total) },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", label: "Vaxt", render: (row) => formatRelativeTime(row.createdAt) },
  ];

  return (
    <div className="rounded-2xl border border-hair bg-surface">
      <div className="border-b border-hair px-4 py-3 text-sm font-semibold text-text">
        Son Sifarişlər
      </div>
      <DataTable columns={columns} data={orders} isLoading={isLoading} onRowClick={onRowClick} />
    </div>
  );
}
