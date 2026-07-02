const VARIANTS = {
  primary: "bg-accent text-white hover:bg-accent-light",
  secondary: "bg-surface-2 text-text hover:bg-hair",
  danger: "bg-red-600 text-white hover:bg-red-700",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
  ghost: "bg-transparent text-text-dim hover:bg-surface-2 hover:text-text",
};

export default function Button({ variant = "primary", className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
