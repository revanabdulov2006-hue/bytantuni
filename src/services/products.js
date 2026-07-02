import { supabase } from "../lib/supabase.js";

// The UI identifies a product's category by NAME (filtering, form select,
// display), while the DB stores a category_id FK — this service translates
// between the two so components stay unchanged.

const SELECT = "*, categories(name)";

function fromRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.categories?.name || "",
    price: row.price,
    oldPrice: row.old_price,
    description: row.description || "",
    longDescription: row.long_description || "",
    ingredients: row.ingredients || [],
    image: row.image_url || "",
    bestseller: row.bestseller,
    active: row.active,
    rating: row.rating ?? 0,
    reviewCount: row.review_count,
    prepTime: row.prep_time || "",
    spicyLevel: row.spicy_level,
    sizes: row.sizes || [],
    extras: row.extras || [],
    createdAt: row.created_at,
  };
}

async function resolveCategoryId(name) {
  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("name", name)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Kateqoriya tapılmadı");
  return data.id;
}

// Maps app-shape fields to DB columns, ignoring unknown keys (id, createdAt…).
// `category` (a name) is resolved to category_id separately by the caller.
function toRow(patch) {
  const row = {};
  if ("name" in patch) row.name = patch.name;
  if ("price" in patch) row.price = patch.price;
  if ("oldPrice" in patch) row.old_price = patch.oldPrice || null;
  if ("description" in patch) row.description = patch.description || null;
  if ("longDescription" in patch) row.long_description = patch.longDescription || null;
  if ("ingredients" in patch) row.ingredients = patch.ingredients || [];
  if ("image" in patch) row.image_url = patch.image || null;
  if ("bestseller" in patch) row.bestseller = patch.bestseller;
  if ("active" in patch) row.active = patch.active;
  if ("rating" in patch) row.rating = patch.rating ?? null;
  if ("reviewCount" in patch) row.review_count = patch.reviewCount || 0;
  if ("prepTime" in patch) row.prep_time = patch.prepTime || null;
  if ("spicyLevel" in patch) row.spicy_level = patch.spicyLevel || null;
  if ("sizes" in patch) row.sizes = patch.sizes || [];
  if ("extras" in patch) row.extras = patch.extras || [];
  return row;
}

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data.map(fromRow);
}

export async function createProduct(data) {
  const row = toRow(data);
  row.category_id = await resolveCategoryId(data.category);
  const { data: created, error } = await supabase
    .from("products")
    .insert(row)
    .select(SELECT)
    .single();
  if (error) throw new Error(error.message);
  return fromRow(created);
}

export async function updateProduct(id, patch) {
  const row = toRow(patch);
  if ("category" in patch) {
    row.category_id = await resolveCategoryId(patch.category);
  }
  const { data: updated, error } = await supabase
    .from("products")
    .update(row)
    .eq("id", id)
    .select(SELECT)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!updated) throw new Error("Məhsul tapılmadı");
  return fromRow(updated);
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
