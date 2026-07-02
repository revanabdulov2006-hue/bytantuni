import { useDragScroll } from "../../hooks/useDragScroll.js";

export default function CategoryPills({ categories, active, onChange }) {
  const drag = useDragScroll();

  return (
    <div className="sticky top-[60px] z-10 -mx-4 border-b border-hair bg-bg/90 py-3 backdrop-blur">
      <div className="relative">
        <div
          ref={drag.ref}
          onPointerDown={drag.onPointerDown}
          onPointerMove={drag.onPointerMove}
          onPointerUp={drag.onPointerUp}
          onPointerLeave={drag.onPointerLeave}
          className="scrollbar-none cursor-grab overflow-x-auto px-4 active:cursor-grabbing"
        >
          <div className="flex gap-2.5">
            <button
              onClick={() => onChange("all")}
              className={`h-10 shrink-0 rounded-full px-5 text-sm font-medium transition-colors duration-200 ${
                active === "all"
                  ? "bg-accent text-white shadow-[0_10px_30px_-8px_rgba(242,121,10,.55)]"
                  : "bg-surface-2 text-text-dim hover:bg-hair hover:text-text"
              }`}
            >
              Hamısı
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onChange(cat.name)}
                className={`h-10 shrink-0 rounded-full px-5 text-sm font-medium transition-colors duration-200 ${
                  active === cat.name
                    ? "bg-accent text-white shadow-[0_10px_30px_-8px_rgba(242,121,10,.55)]"
                    : "bg-surface-2 text-text-dim hover:bg-hair hover:text-text"
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-bg to-transparent" />
      </div>
    </div>
  );
}
