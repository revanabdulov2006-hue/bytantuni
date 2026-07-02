import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import SearchBar from "../../components/ui/SearchBar.jsx";
import Dropdown from "../../components/ui/Dropdown.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import Toggle from "../../components/ui/Toggle.jsx";
import Badge from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal.jsx";
import ProductFormModal from "../../components/products/ProductFormModal.jsx";
import { useProducts } from "../../hooks/useProducts.js";
import { useCategories } from "../../hooks/useCategories.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { usePagination } from "../../hooks/usePagination.js";
import { useToast } from "../../context/ToastContext.jsx";
import { formatPrice } from "../../utils/format.js";

export default function ProductsPage() {
  const { products, isLoading, error, addProduct, editProduct, removeProduct } = useProducts();
  const { categories } = useCategories();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, debouncedSearch, categoryFilter]);

  const { page, totalPages, pageItems, goToPage } = usePagination(filtered, 8);

  const categoryOptions = [
    { value: "all", label: "Bütün kateqoriyalar" },
    ...categories.map((c) => ({ value: c.name, label: c.name })),
  ];

  async function handleSubmit(data) {
    try {
      if (editingProduct) {
        await editProduct(editingProduct.id, data);
        showToast("Məhsul yeniləndi");
      } else {
        await addProduct(data);
        showToast("Məhsul əlavə edildi");
      }
    } catch (err) {
      showToast(err.message, "error");
      throw err; // keeps the form modal open
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await removeProduct(deletingProduct.id);
      showToast("Məhsul silindi");
      setDeletingProduct(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  function handleToggleActive(id, active) {
    editProduct(id, { active }).catch((err) => showToast(err.message, "error"));
  }

  const columns = [
    {
      key: "image",
      label: "",
      render: (row) =>
        row.image ? (
          <img src={row.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-lg">🍽️</div>
        ),
    },
    {
      key: "name",
      label: "Ad",
      render: (row) => (
        <div>
          <div className="font-medium text-text">{row.name}</div>
          {row.bestseller && (
            <Badge className="mt-1 bg-accent/12 text-accent">Bestseller</Badge>
          )}
        </div>
      ),
    },
    { key: "category", label: "Kateqoriya" },
    { key: "price", label: "Qiymət", render: (row) => formatPrice(row.price) },
    {
      key: "active",
      label: "Aktiv",
      render: (row) => (
        <Toggle checked={row.active} onChange={(v) => handleToggleActive(row.id, v)} />
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingProduct(row);
              setFormOpen(true);
            }}
            className="rounded-lg p-1.5 text-text-dim hover:bg-surface-2 hover:text-text"
            aria-label="Redaktə et"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setDeletingProduct(row)}
            className="rounded-lg p-1.5 text-text-dim hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
            aria-label="Sil"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-(--font-display) text-xl font-semibold text-text">Məhsullar</h2>
          <p className="text-sm text-text-dim">Menyu məhsullarını idarə edin</p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setFormOpen(true);
          }}
        >
          <Plus size={16} /> Yeni məhsul
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Məhsul axtar..." />
        <Dropdown value={categoryFilter} options={categoryOptions} onChange={setCategoryFilter} />
      </div>

      <div className="rounded-2xl border border-hair bg-surface">
        {error ? (
          <EmptyState icon="⚠️" title="Xəta baş verdi" description={error} />
        ) : (
          <>
            <DataTable columns={columns} data={pageItems} isLoading={isLoading} />
            <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </div>

      <ProductFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        categories={categories}
        product={editingProduct}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
        entityName={deletingProduct?.name}
        isDeleting={deleting}
      />
    </div>
  );
}
