import { createPortal } from "react-dom";
import { X } from "lucide-react";
import IconButton from "./IconButton.jsx";
import { formatPrice } from "../../utils/format.js";

export default function FavoritesPanel({ isOpen, products, favorites, onClose, onSelect }) {
  if (!isOpen) return null;
  const favProducts = products.filter((p) => favorites.includes(p.id));

  return createPortal(
    <div className="dark fixed inset-0 z-50 flex justify-end bg-black/50">
      <div className="flex h-full w-full max-w-[380px] flex-col bg-surface text-text shadow-2xl animate-[drawer-in_0.35s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="flex items-center justify-between border-b border-hair px-5 py-4">
          <h3 className="font-(--font-display) text-lg font-semibold">Sevimlilər</h3>
          <IconButton onClick={onClose} size="sm" aria-label="Bağla">
            <X size={16} />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {favProducts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-text-dim">
              <span className="text-4xl">💛</span>
              <p className="text-sm">Hələ sevimli məhsul yoxdur</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {favProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p)}
                  className="flex items-center gap-3 rounded-xl border border-hair p-2.5 text-left hover:bg-surface-2"
                >
                  <span className="text-2xl">🍽️</span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-text">{p.name}</span>
                    <span className="block text-xs text-text-dim">{formatPrice(p.price)}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
