import { useMemo, useState } from "react";

export function usePagination(items, pageSize = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  function goToPage(next) {
    setPage(Math.min(Math.max(1, next), totalPages));
  }

  return { page: safePage, totalPages, pageItems, goToPage, setPage: goToPage };
}
