import Skeleton from "./Skeleton.jsx";

export default function StatCard({ icon: Icon, label, value, trend, loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="flex flex-col gap-3 rounded-2xl border border-hair bg-surface p-5 text-left shadow-sm shadow-black/[0.02] transition-shadow hover:shadow-md disabled:cursor-default"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-dim">{label}</span>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/12 text-accent">
            <Icon size={16} />
          </div>
        )}
      </div>
      {loading ? (
        <Skeleton variant="text" className="h-7 w-24" />
      ) : (
        <div className="text-2xl font-semibold text-text">{value}</div>
      )}
      {trend && <span className="text-xs text-emerald-600">{trend}</span>}
    </button>
  );
}
