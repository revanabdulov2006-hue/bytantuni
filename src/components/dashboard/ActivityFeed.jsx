import Skeleton from "../ui/Skeleton.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import { formatRelativeTime } from "../../utils/format.js";

export default function ActivityFeed({ items, isLoading }) {
  return (
    <div className="rounded-2xl border border-hair bg-surface p-4">
      <div className="mb-3 text-sm font-semibold text-text">Son Müştəri Fəaliyyəti</div>
      {isLoading ? (
        <Skeleton variant="row" count={4} />
      ) : items.length === 0 ? (
        <EmptyState icon="🕐" title="Fəaliyyət yoxdur" />
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
              <span className="flex-1 text-text">{item.label}</span>
              <span className="text-xs text-text-dim">{formatRelativeTime(item.ts)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
