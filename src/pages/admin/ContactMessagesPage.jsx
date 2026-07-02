import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import DataTable from "../../components/ui/DataTable.jsx";
import SearchBar from "../../components/ui/SearchBar.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal.jsx";
import MessageDetailModal from "../../components/contact/MessageDetailModal.jsx";
import { useContactMessages } from "../../hooks/useContactMessages.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { useToast } from "../../context/ToastContext.jsx";
import { formatDateTime } from "../../utils/format.js";

export default function ContactMessagesPage() {
  const { messages, isLoading, error, markAsRead, removeMessage } = useContactMessages();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deletingMessage, setDeletingMessage] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return messages.filter(
      (m) => m.name.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q)
    );
  }, [messages, debouncedSearch]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await removeMessage(deletingMessage.id);
      showToast("Mesaj silindi");
      setDeletingMessage(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    {
      key: "name",
      label: "Ad",
      render: (row) => <span className={row.read ? "" : "font-semibold text-text"}>{row.name}</span>,
    },
    { key: "subject", label: "Mövzu" },
    { key: "createdAt", label: "Tarix", render: (row) => formatDateTime(row.createdAt) },
    { key: "read", label: "Status", render: (row) => <StatusBadge status={row.read ? "read" : "unread"} /> },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDeletingMessage(row);
          }}
          className="rounded-lg p-1.5 text-text-dim hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
          aria-label="Sil"
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-(--font-display) text-xl font-semibold text-text">Mesajlar</h2>
        <p className="text-sm text-text-dim">Vebsaytdan göndərilən əlaqə mesajları</p>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Ad və ya mövzu axtar..." />

      <div className="rounded-2xl border border-hair bg-surface">
        {error ? (
          <EmptyState icon="⚠️" title="Xəta baş verdi" description={error} />
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            isLoading={isLoading}
            onRowClick={setSelectedMessage}
          />
        )}
      </div>

      <MessageDetailModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onMarkAsRead={(id) => markAsRead(id).catch(() => {})}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingMessage}
        onClose={() => setDeletingMessage(null)}
        onConfirm={handleDelete}
        entityName={deletingMessage?.subject}
        isDeleting={deleting}
      />
    </div>
  );
}
