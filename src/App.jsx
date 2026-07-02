import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import HomePage from "./pages/customer/HomePage.jsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminAuthGuard from "./components/admin/AdminAuthGuard.jsx";
import NotFoundPage from "./pages/admin/NotFoundPage.jsx";
import { NAV_ROUTES } from "./routes/adminRoutes.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminAuthGuard />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          {NAV_ROUTES.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
