import { createPortal } from "react-dom";
import { X, Trash2 } from "lucide-react";
import QuantityStepper from "./QuantityStepper.jsx";
import IconButton from "./IconButton.jsx";
import { formatPrice } from "../../utils/format.js";
import { useCart } from "../../context/CartContext.jsx";

export default function CartDrawer({ onCheckout }) {
  const { items, total, isOpen, closeCart, updateQty, removeItem } = useCart();

  if (!isOpen) return null;

  return createPortal(
    <div className="dark fixed inset-0 z-50 flex justify-end bg-black/50">
      <div className="flex h-full w-full max-w-[420px] flex-col bg-surface text-text shadow-2xl animate-[drawer-in_0.35s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="flex items-center justify-between border-b border-hair px-5 py-4">
          <h3 className="font-(--font-display) text-lg font-semibold">Səbətiniz</h3>
          <IconButton onClick={closeCart} size="sm" aria-label="Bağla">
            <X size={16} />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-text-dim">
              <span className="text-4xl">🛒</span>
              <p className="text-sm">Səbətiniz boşdur</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-hair pb-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-2xl">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full rounded-xl object-cover" />
                    ) : (
                      "🍽️"
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-text">{item.name}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-text-dim hover:text-red-500"
                        aria-label="Sil"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    {item.variant && <span className="text-xs text-text-dim">{item.variant}</span>}
                    <div className="mt-1 flex items-center justify-between">
                      <QuantityStepper qty={item.qty} onChange={(q) => updateQty(item.id, q)} />
                      <span className="text-sm font-semibold text-text">
                        {formatPrice(item.unitPrice * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-hair px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-text-dim">Toplam</span>
              <span className="text-lg font-bold text-text">{formatPrice(total)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="h-14 w-full rounded-2xl bg-accent text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(242,121,10,.55)] transition-all duration-200 hover:bg-accent-light active:scale-[0.98]"
            >
              Sifarişi tamamla
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
