// Verifies the categories + products data layer end-to-end against Supabase,
// mirroring exactly what src/services/{categories,products}.js do.
// Run with:  node --env-file=.env scripts/verify-menu-crud.mjs
// Creates temporary test rows and removes them afterwards.
import { adminClient, rlsHint } from "./_client.mjs";

const supabase = await adminClient();
const SELECT = "*, categories(name)";

function step(name, error) {
  if (error) {
    console.error(`✗ ${name}: ${error.message}`);
    rlsHint(error);
    process.exit(1);
  }
  console.log(`✓ ${name}`);
}

// 1. read categories (storefront path)
const read = await supabase.from("categories").select("*").order("sort_order");
step(`Kateqoriyalar oxundu (${read.data?.length ?? 0} sətir)`, read.error);

// 2. create category (admin path)
const catIns = await supabase
  .from("categories")
  .insert({ name: `__TEST_${Date.now()}`, icon: "🧪", active: true, sort_order: 999 })
  .select()
  .single();
step("Test kateqoriyası yaradıldı", catIns.error);
const catId = catIns.data.id;

// 3. update category
const catUpd = await supabase.from("categories").update({ active: false }).eq("id", catId).select().single();
step("Kateqoriya yeniləndi", catUpd.error);

// 4. create product with join read-back (admin + storefront path)
const prodIns = await supabase
  .from("products")
  .insert({
    category_id: catId,
    name: "__TEST məhsul",
    price: 5.5,
    ingredients: ["test"],
    sizes: [{ name: "Orta", delta: 0 }],
    extras: [{ name: "Sous", price: 0.5 }],
    spicy_level: "mild",
  })
  .select(SELECT)
  .single();
step(`Test məhsulu yaradıldı (kateqoriya adı join ilə: "${prodIns.data?.categories?.name ?? "?"}")`, prodIns.error);
const prodId = prodIns.data.id;

// 5. category delete must be blocked while it has products (FK restrict)
const blocked = await supabase.from("categories").delete().eq("id", catId);
if (blocked.error?.code === "23503") {
  console.log("✓ Məhsulu olan kateqoriyanın silinməsi bloklandı (gözlənilən davranış)");
} else {
  console.error("✗ FK qoruması işləmədi — kateqoriya məhsulu ola-ola silindi!");
  process.exit(1);
}

// 6. update product
const prodUpd = await supabase.from("products").update({ price: 6.0, bestseller: true }).eq("id", prodId).select(SELECT).single();
step("Məhsul yeniləndi", prodUpd.error);

// 7. cleanup: delete product, then category
const prodDel = await supabase.from("products").delete().eq("id", prodId);
step("Test məhsulu silindi", prodDel.error);
const catDel = await supabase.from("categories").delete().eq("id", catId);
step("Test kateqoriyası silindi", catDel.error);

console.log("\n✓ Bütün yoxlamalar keçdi — categories və products data qatı Supabase ilə işləyir.");
