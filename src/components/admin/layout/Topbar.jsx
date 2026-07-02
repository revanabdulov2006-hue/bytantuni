import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { NAV_ROUTES } from "../../../routes/adminRoutes.jsx";
import ThemeToggle from "../../ui/ThemeToggle.jsx";

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const current = NAV_ROUTES.find((r) => `/admin/${r.path}` === location.pathname);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-hair bg-surface/80 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-text-dim hover:bg-surface-2 md:hidden"
          aria-label="Menyunu aç"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-(--font-display) text-lg font-semibold text-text">
          {current?.label || "İdarə Paneli"}
        </h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
