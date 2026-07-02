import { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ExternalLink, LogOut } from "lucide-react";
import { NAV_ROUTES } from "../../../routes/adminRoutes.jsx";
import { ICON_MAP } from "../../../utils/icons.js";
import { useContactMessages } from "../../../hooks/useContactMessages.js";
import { useAdminAuth } from "../../../context/AdminAuthContext.jsx";

export default function Sidebar({ open, onClose }) {
  const { unreadCount, refresh } = useContactMessages();
  const { logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-hair bg-surface transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2.5 px-6 py-6">
          <img src="/favicon.png" alt="BY TANTUNI" className="h-9 w-9 rounded-full object-cover" />
          <div>
            <div className="font-(--font-display) text-lg font-semibold tracking-tight text-text">
              BY TANTUNI
            </div>
            <div className="text-xs text-text-dim">İdarəetmə Paneli</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {NAV_ROUTES.map((route) => {
            const Icon = ICON_MAP[route.icon];
            const showBadge = route.path === "messages" && unreadCount > 0;
            return (
              <NavLink
                key={route.path}
                to={`/admin/${route.path}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent/12 text-accent"
                      : "text-text-dim hover:bg-surface-2 hover:text-text"
                  }`
                }
              >
                {Icon && <Icon size={18} />}
                <span className="flex-1">{route.label}</span>
                {showBadge && (
                  <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-hair px-4 py-4">
          <Link
            to="/"
            className="mb-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text-dim hover:bg-surface-2 hover:text-text"
          >
            <ExternalLink size={16} />
            Saytı gör
          </Link>
          <button
            onClick={handleLogout}
            className="mb-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text-dim hover:bg-surface-2 hover:text-text"
          >
            <LogOut size={16} />
            Çıxış
          </button>
          <div className="flex items-center gap-3 rounded-lg bg-surface-2 px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-lg">
              👨‍🍳
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-text">Behruz Chef</div>
              <div className="text-xs text-text-dim">Baş İdarəçi</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
