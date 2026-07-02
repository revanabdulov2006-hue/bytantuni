import { Heart, Plus } from "lucide-react";
import RatingStars from "./RatingStars.jsx";
import QuantityStepper from "./QuantityStepper.jsx";
import { formatPrice } from "../../utils/format.js";
import { useCart } from "../../context/CartContext.jsx";

export default function ProductCard({ product, isFavorite, onToggleFavorite, onOpen, onQuickAdd }) {
  const hasOptions = (product.sizes?.length || 0) > 0 || (product.extras?.length || 0) > 0;
  const { items, updateQty } = useCart();

  const plainLine = !hasOptions
    ? items.find(
        (i) => i.productId === product.id && !i.sizeName && (i.selectedExtras?.length || 0) === 0
      )
    : null;

  function handleAddClick(e) {
    e.stopPropagation();
    if (hasOptions) {
      onOpen(product);
      return;
    }
    onQuickAdd(product);
  }

  return (
    <div
      onClick={() => onOpen(product)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[20px] border border-hair bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-2">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">🍽️</div>
        )}
        {product.bestseller && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-white">
            Bestseller
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-bg/70 shadow-sm backdrop-blur transition-transform active:scale-90"
          aria-label="Sevimlilər"
        >
          <Heart size={16} className={isFavorite ? "fill-accent text-accent" : "text-text"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-text">{product.name}</h3>
        <p className="line-clamp-1 text-xs text-text-dim">{(product.ingredients || []).join(", ")}</p>
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} prepTime={product.prepTime} />

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-text">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-text-dim line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          {plainLine ? (
            <div onClick={(e) => e.stopPropagation()}>
              <QuantityStepper qty={plainLine.qty} onChange={(q) => updateQty(plainLine.id, q)} />
            </div>
          ) : (
            <button
              onClick={handleAddClick}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-sm transition-transform active:scale-90"
              aria-label="Səbətə əlavə et"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
