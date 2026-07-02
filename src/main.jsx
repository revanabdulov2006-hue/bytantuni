import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import ToastViewport from "./components/ui/ToastViewport.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <AdminAuthProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
            <ToastViewport />
          </AdminAuthProvider>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);
