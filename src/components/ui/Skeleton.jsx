export default function Skeleton({ variant = "text", count = 1, className = "" }) {
  const base = "animate-pulse bg-surface-2 rounded-md";
  const variantClass = {
    text: "h-4 w-full",
    row: "h-12 w-full",
    card: "h-28 w-full rounded-2xl",
    circle: "h-9 w-9 rounded-full",
  }[variant];

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${base} ${variantClass} ${className}`} />
      ))}
    </div>
  );
}
