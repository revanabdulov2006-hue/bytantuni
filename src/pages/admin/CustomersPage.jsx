import { useMemo, useState } from "react";
import DataTable from "../../components/ui/DataTable.jsx";
import SearchBar from "../../components/ui/SearchBar.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import CustomerDetailModal from "../../components/customers/CustomerDetailModal.jsx";
import { useCustomers } from "../../hooks/useCustomers.js";
import { useOrders } from "../../hooks/useOrders.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { usePagination } from "../../hooks/usePagination.js";
import { formatRelativeTime } from "../../utils/format.js";

export default function CustomersPage() {
  const { customers, isLoading, error } = useCustomers();
  const { orders } = useOrders();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return customers.filter(
      (c) => c.fullName.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [customers, debouncedSearch]);

  const { page, totalPages, pageItems, goToPage } = usePagination(filtered, 8);

  const columns = [
    { key: "fullName", label: "Ad Soyad" },
    { key: "phone", label: "Telefon" },
    { key: "totalOrders", label: "Sifariş sayı" },
    { key: "lastOrderDate", label: "Son sifariş", render: (row) => formatRelativeTime(row.lastOrderDate) },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-(--font-display) text-xl font-semibold text-text">Müştərilər</h2>
        <p className="text-sm text-text-dim">Sifariş vermiş müştəriləri görüntüləyin</p>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Ad və ya telefon axtar..." />

      <div className="rounded-2xl border border-hair bg-surface">
        {error ? (
          <EmptyState icon="⚠️" title="Xəta baş verdi" description={error} />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={pageItems}
              isLoading={isLoading}
              onRowClick={setSelectedCustomer}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </div>

      <CustomerDetailModal
        customer={selectedCustomer}
        orders={orders}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}
