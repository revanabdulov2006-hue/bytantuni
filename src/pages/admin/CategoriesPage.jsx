import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import SearchBar from "../../components/ui/SearchBar.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Toggle from "../../components/ui/Toggle.jsx";
import Badge from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal.jsx";
import CategoryFormModal from "../../components/categories/CategoryFormModal.jsx";
import { useCategories } from "../../hooks/useCategories.js";
import { useProducts } from "../../hooks/useProducts.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { useToast } from "../../context/ToastContext.jsx";

export default function CategoriesPage() {
  const { categories, isLoading, error, addCategory, editCategory, removeCategory, moveCategory } =
    useCategories();
  const { products } = useProducts();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const productCountByCategory = useMemo(() => {
    const counts = {};
    for (const p of products) counts[p.category] = (counts[p.category] || 0) + 1;
    return counts;
  }, [products]);

  const filtered = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(debouncedSearch.toLowerCase())),
    [categories, debouncedSearch]
  );

  async function handleSubmit(data) {
    try {
      if (editingCategory) {
        await editCategory(editingCategory.id, data);
        showToast("Kateqoriya yeniləndi");
      } else {
        await addCategory(data);
        showToast("Kateqoriya əlavə edildi");
      }
    } catch (err) {
      showToast(err.message, "error");
      throw err; // keeps the form modal open
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await removeCategory(deletingCategory.id);
      showToast("Kateqoriya silindi");
      setDeletingCategory(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  function handleToggleActive(id, active) {
    editCategory(id, { active }).catch((err) => showToast(err.message, "error"));
  }

  function handleMove(id, direction) {
    moveCategory(id, direction).catch((err) => showToast(err.message, "error"));
  }

  const columns = [
    {
      key: "name",
      label: "Ad",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">{row.icon || "🏷️"}</span>
          <span className="font-medium text-text">{row.name}</span>
        </div>
      ),
    },
    {
      key: "productCount",
      label: "Məhsul sayı",
      render: (row) => <Badge>{productCountByCategory[row.name] || 0} məhsul</Badge>,
    },
    {
      key: "active",
      label: "Aktiv",
      render: (row) => (
        <Toggle checked={row.active} onChange={(v) => handleToggleActive(row.id, v)} />
      ),
    },
    {
      key: "sort",
      label: "Sıra",
      render: (row) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleMove(row.id, "up")}
            className="rounded-lg p-1.5 text-text-dim hover:bg-surface-2 hover:text-text"
            aria-label="Yuxarı"
          >
            <ArrowUp size={14} />
          </button>
          <button
            onClick={() => handleMove(row.id, "down")}
            className="rounded-lg p-1.5 text-text-dim hover:bg-surface-2 hover:text-text"
            aria-label="Aşağı"
          >
            <ArrowDown size={14} />
          </button>
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingCategory(row);
              setFormOpen(true);
            }}
            className="rounded-lg p-1.5 text-text-dim hover:bg-surface-2 hover:text-text"
            aria-label="Redaktə et"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setDeletingCategory(row)}
            className="rounded-lg p-1.5 text-text-dim hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
            aria-label="Sil"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const productCountForDeleting = deletingCategory
    ? productCountByCategory[deletingCategory.name] || 0
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-(--font-display) text-xl font-semibold text-text">Kateqoriyalar</h2>
          <p className="text-sm text-text-dim">Menyu kateqoriyalarını idarə edin</p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setFormOpen(true);
          }}
        >
          <Plus size={16} /> Yeni kateqoriya
        </Button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Kateqoriya axtar..." />

      <div className="rounded-2xl border border-hair bg-surface">
        {error ? (
          <EmptyState icon="⚠️" title="Xəta baş verdi" description={error} />
        ) : (
          <DataTable columns={columns} data={filtered} isLoading={isLoading} />
        )}
      </div>

      <CategoryFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        category={editingCategory}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        entityName={
          productCountForDeleting > 0
            ? `${deletingCategory?.name} (${productCountForDeleting} məhsulu var)`
            : deletingCategory?.name
        }
        isDeleting={deleting}
      />
    </div>
  );
}
