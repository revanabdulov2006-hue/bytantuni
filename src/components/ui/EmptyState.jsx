export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hair px-6 py-14 text-center">
      {icon && <div className="text-4xl">{icon}</div>}
      <div className="text-base font-semibold text-text">{title}</div>
      {description && <p className="max-w-sm text-sm text-text-dim">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
