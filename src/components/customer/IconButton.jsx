const SIZES = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
};

export default function IconButton({ as: As = "button", size = "md", tone = "default", className = "", children, ...props }) {
  const toneClass =
    tone === "accent"
      ? "bg-accent/10 text-accent hover:bg-accent hover:text-white"
      : "bg-surface-2 text-text-dim hover:bg-hair hover:text-text";

  return (
    <As
      className={`inline-flex ${SIZES[size]} shrink-0 items-center justify-center rounded-full shadow-sm transition-all duration-200 active:scale-90 ${toneClass} ${className}`}
      {...props}
    >
      {children}
    </As>
  );
}
