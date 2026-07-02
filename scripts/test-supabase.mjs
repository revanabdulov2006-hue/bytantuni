// Supabase connection test — run with:
//   node --env-file=.env scripts/test-supabase.mjs
// Verifies the URL/key in .env by running an anon-readable count query
// against the categories table.
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key || url.includes("YOUR-PROJECT-REF") || key.includes("YOUR-ANON")) {
  console.error("✗ .env hələ doldurulmayıb.");
  console.error("  Supabase Dashboard > Project Settings > API bölməsindən");
  console.error("  VITE_SUPABASE_URL və VITE_SUPABASE_ANON_KEY dəyərlərini .env faylına yazın.");
  process.exit(1);
}

const supabase = createClient(url, key);

const { count, error } = await supabase
  .from("categories")
  .select("id", { count: "exact", head: true });

if (error) {
  console.error("✗ Bağlantı alınmadı:", error.message);
  process.exit(1);
}

console.log(`✓ Supabase bağlantısı işləyir. categories cədvəlində ${count} sətir var.`);
