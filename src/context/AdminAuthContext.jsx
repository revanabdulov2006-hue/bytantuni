import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  // false until the persisted session (if any) has been restored, so the
  // route guard doesn't bounce a logged-in admin to /admin/login on refresh
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsReady(true);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  // Kept the (email, code) signature: the login form's "Giriş kodu" is the
  // Supabase Auth password. Returns false for wrong credentials, throws on
  // network/server errors (the login page distinguishes the two).
  async function login(email, code) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: code.trim(),
    });
    if (error) {
      if (error.code === "invalid_credentials" || error.status === 400) return false;
      throw new Error(error.message);
    }
    return !!data.session;
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated: !!session, isReady, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
