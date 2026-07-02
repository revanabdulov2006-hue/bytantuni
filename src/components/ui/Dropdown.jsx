import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({ value, options, onChange, renderTrigger, placeholder = "Seç" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5"
      >
        {renderTrigger ? (
          renderTrigger(selected)
        ) : (
          <span className="flex items-center gap-1 rounded-lg border border-hair bg-surface px-3 py-1.5 text-sm text-text">
            {selected ? selected.label : placeholder}
            <ChevronDown size={14} />
          </span>
        )}
      </button>
      {open && (
        <div className="absolute z-20 mt-1 min-w-[160px] rounded-lg border border-hair bg-surface py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-surface-2 ${
                opt.value === value ? "text-accent font-medium" : "text-text"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
