import Skeleton from "../ui/Skeleton.jsx";
import EmptyState from "../ui/EmptyState.jsx";

export default function BestSellersList({ items, isLoading }) {
  const max = items[0]?.qty || 1;

  return (
    <div className="rounded-2xl border border-hair bg-surface p-4">
      <div className="mb-3 text-sm font-semibold text-text">Ən Çox Satılanlar</div>
      {isLoading ? (
        <Skeleton variant="row" count={4} />
      ) : items.length === 0 ? (
        <EmptyState icon="📦" title="Hələ satış yoxdur" />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-text">{item.name}</span>
                <span className="text-text-dim">{item.qty} ədəd</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-surface-2">
                <div
                  className="h-1.5 rounded-full bg-accent"
                  style={{ width: `${(item.qty / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
