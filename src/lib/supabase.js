import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase konfiqurasiyası tapılmadı. .env faylında VITE_SUPABASE_URL və VITE_SUPABASE_ANON_KEY dəyərlərini təyin edin."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Lightweight connection check: runs a HEAD count query against the
 * categories table (readable by anon via RLS). Returns { ok, error }.
 */
export async function testSupabaseConnection() {
  const { error } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true });
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, error: null };
}
