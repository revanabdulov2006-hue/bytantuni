import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, Heart } from "lucide-react";
import RatingStars from "./RatingStars.jsx";
import QuantityStepper from "./QuantityStepper.jsx";
import SpicyLevelControl from "./SpicyLevelControl.jsx";
import { formatPrice } from "../../utils/format.js";

export default function ProductDetailModal({ product, isFavorite, onToggleFavorite, onClose, onAddToCart }) {
  const [sizeName, setSizeName] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [spicyLevel, setSpicyLevel] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!product) return;
    setSizeName(product.sizes?.[0]?.name ?? null);
    setSelectedExtras([]);
    setSpicyLevel(product.spicyLevel || null);
    setQty(1);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [product, onClose]);

  const sizeDelta = useMemo(() => {
    if (!product || !sizeName) return 0;
    return product.sizes?.find((s) => s.name === sizeName)?.delta || 0;
  }, [product, sizeName]);

  const extrasTotal = useMemo(
    () => selectedExtras.reduce((sum, e) => sum + e.price, 0),
    [selectedExtras]
  );

  if (!product) return null;

  const unitPrice = product.price + sizeDelta + extrasTotal;
  const total = unitPrice * qty;

  function toggleExtra(extra) {
    setSelectedExtras((prev) =>
      prev.some((e) => e.name === extra.name)
        ? prev.filter((e) => e.name !== extra.name)
        : [...prev, extra]
    );
  }

  function handleAdd() {
    onAddToCart({
      productId: product.id,
      qty,
      sizeName,
      sizeDelta,
      selectedExtras,
      spicyLevel,
      unitPrice,
      name: product.name,
      image: product.image,
      variant: sizeName,
      price: unitPrice,
    });
    onClose();
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
      <div className="dark flex max-h-[92svh] w-full flex-col overflow-y-auto rounded-t-3xl bg-surface text-text shadow-2xl animate-[sheet-in_0.35s_cubic-bezier(0.16,1,0.3,1)] sm:max-w-lg sm:rounded-2xl">
        <div className="relative aspect-[4/3] w-full shrink-0 bg-surface-2">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl">🍽️</div>
          )}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-bg/70 shadow-sm backdrop-blur transition-transform active:scale-90"
            aria-label="Bağla"
          >
            <X size={18} />
          </button>
          <button
            onClick={() => onToggleFavorite(product.id)}
            className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-bg/70 shadow-sm backdrop-blur transition-transform active:scale-90"
            aria-label="Sevimlilər"
          >
            <Heart size={18} className={isFavorite ? "fill-accent text-accent" : "text-text"} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-5">
          <div>
            <div className="text-xs font-medium text-accent">{product.category}</div>
            <h2 className="font-(--font-display) text-xl font-semibold text-text">{product.name}</h2>
            <div className="mt-1">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} prepTime={product.prepTime} />
            </div>
          </div>

          <p className="text-sm text-text-dim">{product.description}</p>
          {product.longDescription && (
            <p className="text-sm leading-relaxed text-text-dim">{product.longDescription}</p>
          )}

          {product.ingredients?.length > 0 && (
            <div>
              <div className="mb-1.5 text-sm font-semibold text-text">İnqrediyentlər</div>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((ing) => (
                  <span key={ing} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-text-dim">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div>
              <div className="mb-1.5 text-sm font-semibold text-text">Ölçü seçin</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSizeName(size.name)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      sizeName === size.name
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-hair text-text-dim hover:text-text"
                    }`}
                  >
                    {size.name} {size.delta > 0 && `+${formatPrice(size.delta)}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.extras?.length > 0 && (
            <div>
              <div className="mb-1.5 text-sm font-semibold text-text">Əlavələr</div>
              <div className="flex flex-col gap-2">
                {product.extras.map((extra) => (
                  <label
                    key={extra.name}
                    className="flex items-center justify-between rounded-xl border border-hair px-3 py-2.5 text-sm"
                  >
                    <span className="flex items-center gap-2 text-text">
                      <input
                        type="checkbox"
                        checked={selectedExtras.some((e) => e.name === extra.name)}
                        onChange={() => toggleExtra(extra)}
                        className="h-4 w-4 accent-[var(--color-accent)]"
                      />
                      {extra.name}
                    </span>
                    <span className="text-text-dim">+{formatPrice(extra.price)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {product.spicyLevel && (
            <div>
              <div className="mb-1.5 text-sm font-semibold text-text">Ədviyyat səviyyəsi</div>
              <SpicyLevelControl value={spicyLevel} onChange={setSpicyLevel} />
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-text">Miqdar</span>
            <QuantityStepper qty={qty} onChange={setQty} />
          </div>

          <div className="flex items-center justify-between border-t border-hair pt-4">
            <div>
              {product.oldPrice && (
                <div className="text-xs text-text-dim line-through">{formatPrice(product.oldPrice)}</div>
              )}
              <div className="text-xl font-bold text-text">{formatPrice(total)}</div>
            </div>
            <button
              onClick={handleAdd}
              className="h-14 max-w-[220px] flex-1 rounded-2xl bg-accent px-6 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(242,121,10,.55)] transition-all duration-200 hover:bg-accent-light active:scale-[0.98]"
            >
              Səbətə əlavə et
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
