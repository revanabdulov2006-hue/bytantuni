const TYPE_STYLES = {
  success: "bg-emerald-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-neutral-800 text-white dark:bg-white dark:text-neutral-900",
};

export default function Toast({ message, type, onClose }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg shadow-black/10 animate-[toast-in_0.2s_ease-out] ${TYPE_STYLES[type] || TYPE_STYLES.info}`}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-xs opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Bağla"
      >
        ✕
      </button>
    </div>
  );
}
