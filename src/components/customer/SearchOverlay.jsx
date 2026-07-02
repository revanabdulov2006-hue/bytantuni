import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";

export default function SearchOverlay({ isOpen, products, onClose, onSelect }) {
  const [term, setTerm] = useState("");

  const results = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 18);
  }, [term, products]);

  if (!isOpen) return null;

  return createPortal(
    <div className="dark fixed inset-0 z-50 flex justify-center bg-black/60 px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 rounded-2xl border border-hair bg-surface px-4 py-3">
          <Search size={18} className="text-text-dim" />
          <input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Məhsul axtar..."
            className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-dim"
          />
          <button onClick={onClose} className="text-text-dim hover:text-text" aria-label="Bağla">
            <X size={18} />
          </button>
        </div>
        <div className="mt-3 max-h-[60vh] overflow-y-auto rounded-2xl bg-surface">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="flex w-full items-center gap-3 border-b border-hair px-4 py-3 text-left last:border-0 hover:bg-surface-2"
            >
              <span className="text-2xl">🍽️</span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-text">{p.name}</span>
                <span className="block text-xs text-text-dim">{p.category}</span>
              </span>
            </button>
          ))}
          {term && results.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-text-dim">Nəticə tapılmadı</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
