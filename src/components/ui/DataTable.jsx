import Skeleton from "./Skeleton.jsx";
import EmptyState from "./EmptyState.jsx";

export default function DataTable({ columns, data, keyField = "id", onRowClick, isLoading, emptyState }) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        <Skeleton variant="row" count={5} />
      </div>
    );
  }

  if (!data.length) {
    return (
      emptyState || <EmptyState icon="📭" title="Nəticə tapılmadı" description="Hələ heç bir məlumat yoxdur." />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-hair text-left text-xs uppercase tracking-wide text-text-dim">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row[keyField]}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-hair last:border-0 ${
                onRowClick ? "cursor-pointer hover:bg-surface-2" : ""
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-text">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
