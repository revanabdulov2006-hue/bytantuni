import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

export default function AdminAuthGuard() {
  const { isAuthenticated, isReady } = useAdminAuth();

  // session restore from storage is async — don't redirect before it finishes
  if (!isReady) return null;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
