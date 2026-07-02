// Shared Supabase clients for the seed/verify scripts.
// Admin writes require SUPABASE_ADMIN_EMAIL / SUPABASE_ADMIN_PASSWORD in .env
// (the Supabase Auth user created for the admin panel).
import { createClient } from "@supabase/supabase-js";

const URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!URL || !ANON_KEY) {
  console.error("✗ VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY .env faylında tapılmadı.");
  process.exit(1);
}

// what an anonymous storefront visitor gets
export function anonClient() {
  return createClient(URL, ANON_KEY, { auth: { persistSession: false } });
}

// what a signed-in admin gets
export async function adminClient() {
  const email = process.env.SUPABASE_ADMIN_EMAIL;
  const password = process.env.SUPABASE_ADMIN_PASSWORD;
  if (!email || !password) {
    console.error("✗ SUPABASE_ADMIN_EMAIL / SUPABASE_ADMIN_PASSWORD .env faylında yoxdur.");
    console.error("  → Supabase Dashboard → Authentication → Users bölməsində yaratdığınız admin istifadəçinin məlumatlarını .env-ə əlavə edin.");
    process.exit(1);
  }
  const client = createClient(URL, ANON_KEY, { auth: { persistSession: false } });
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    console.error(`✗ Admin girişi alınmadı: ${error.message}`);
    process.exit(1);
  }
  return client;
}

export function rlsHint(error) {
  if (error?.code === "42501") {
    console.error("  → RLS icazəsi yoxdur. supabase/auth-rls-migration.sql işə salınıb və admin girişi düzgündürmü?");
  }
}
