import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({ qty, onChange, min = 1 }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-hair bg-surface-2 px-2 py-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, qty - 1))}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-text transition-transform active:scale-90"
        aria-label="Azalt"
      >
        <Minus size={14} />
      </button>
      <span className="w-5 text-center text-sm font-semibold text-text">{qty}</span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white transition-transform active:scale-90"
        aria-label="Artır"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
