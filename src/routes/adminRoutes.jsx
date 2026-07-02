import DashboardPage from "../pages/admin/DashboardPage.jsx";
import ProductsPage from "../pages/admin/ProductsPage.jsx";
import CategoriesPage from "../pages/admin/CategoriesPage.jsx";
import CampaignsPage from "../pages/admin/CampaignsPage.jsx";
import OrdersPage from "../pages/admin/OrdersPage.jsx";
import CustomersPage from "../pages/admin/CustomersPage.jsx";
import SettingsPage from "../pages/admin/SettingsPage.jsx";
import ContactMessagesPage from "../pages/admin/ContactMessagesPage.jsx";

export const NAV_ROUTES = [
  { path: "dashboard", label: "İdarə Paneli", icon: "layout-dashboard", element: <DashboardPage /> },
  { path: "products", label: "Məhsullar", icon: "package", element: <ProductsPage /> },
  { path: "categories", label: "Kateqoriyalar", icon: "layers", element: <CategoriesPage /> },
  { path: "campaigns", label: "Kampaniyalar", icon: "megaphone", element: <CampaignsPage /> },
  { path: "orders", label: "Sifarişlər", icon: "receipt", element: <OrdersPage /> },
  { path: "customers", label: "Müştərilər", icon: "users", element: <CustomersPage /> },
  { path: "settings", label: "Sayt Ayarları", icon: "settings", element: <SettingsPage /> },
  { path: "messages", label: "Mesajlar", icon: "mail", element: <ContactMessagesPage /> },
];
