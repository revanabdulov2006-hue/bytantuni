import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const SIZE_CLASS = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({ isOpen, onClose, title, size = "md", children, footer }) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={`w-full ${SIZE_CLASS[size] || SIZE_CLASS.md} max-h-[90vh] overflow-y-auto rounded-2xl bg-surface shadow-2xl animate-[modal-in_0.18s_ease-out]`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-hair px-6 py-4">
          <h2 className="text-base font-semibold text-text">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-text-dim transition-colors hover:bg-surface-2 hover:text-text"
            aria-label="Bağla"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-hair px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
