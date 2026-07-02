// One-time seed: inserts the app's mock categories and products into Supabase.
// Run with:  node --env-file=.env scripts/seed-menu.mjs
// Skips seeding if the categories table already has rows.
// Writes require the admin credentials in .env (see scripts/_client.mjs).
import { adminClient, rlsHint } from "./_client.mjs";
import { CATEGORIES_MOCK } from "../src/mocks/categories.mock.js";
import { PRODUCTS_MOCK } from "../src/mocks/products.mock.js";

const supabase = await adminClient();

const { count, error: countError } = await supabase
  .from("categories")
  .select("id", { count: "exact", head: true });
if (countError) fail("categories oxunmadı", countError);
if (count > 0) {
  console.log(`categories cədvəlində artıq ${count} sətir var — seed ötürüldü.`);
  process.exit(0);
}

const { data: cats, error: catError } = await supabase
  .from("categories")
  .insert(
    CATEGORIES_MOCK.map((c) => ({
      name: c.name,
      icon: c.icon,
      active: c.active,
      sort_order: c.sortOrder,
    }))
  )
  .select("id, name");
if (catError) fail("Kateqoriyalar əlavə olunmadı", catError);
console.log(`✓ ${cats.length} kateqoriya əlavə edildi.`);

const idByName = Object.fromEntries(cats.map((c) => [c.name, c.id]));

const { data: prods, error: prodError } = await supabase
  .from("products")
  .insert(
    PRODUCTS_MOCK.map((p) => ({
      category_id: idByName[p.category],
      name: p.name,
      price: p.price,
      old_price: p.oldPrice,
      description: p.description || null,
      long_description: p.longDescription || null,
      ingredients: p.ingredients || [],
      image_url: p.image || null,
      bestseller: p.bestseller,
      active: p.active,
      rating: p.rating ?? null,
      review_count: p.reviewCount || 0,
      prep_time: p.prepTime || null,
      spicy_level: p.spicyLevel || null,
      sizes: p.sizes || [],
      extras: p.extras || [],
      created_at: p.createdAt,
    }))
  )
  .select("id");
if (prodError) fail("Məhsullar əlavə olunmadı", prodError);
console.log(`✓ ${prods.length} məhsul əlavə edildi.`);

function fail(msg, error) {
  console.error(`✗ ${msg}: ${error.message}`);
  rlsHint(error);
  process.exit(1);
}
