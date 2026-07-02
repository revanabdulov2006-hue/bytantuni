import { supabase } from "../lib/supabase.js";

// Maps a DB row (snake_case) to the app's category shape (camelCase).
function fromRow(row) {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon || "",
    active: row.active,
    sortOrder: row.sort_order,
  };
}

// Maps app-shape fields to DB columns, ignoring unknown keys (id, createdAt…).
function toRow(patch) {
  const row = {};
  if ("name" in patch) row.name = patch.name;
  if ("icon" in patch) row.icon = patch.icon || null;
  if ("active" in patch) row.active = patch.active;
  if ("sortOrder" in patch) row.sort_order = patch.sortOrder;
  return row;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data.map(fromRow);
}

export async function createCategory(data) {
  const { data: maxRow, error: maxError } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (maxError) throw new Error(maxError.message);

  const row = { active: true, ...toRow(data), sort_order: (maxRow?.sort_order || 0) + 1 };
  const { data: created, error } = await supabase
    .from("categories")
    .insert(row)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return fromRow(created);
}

export async function updateCategory(id, patch) {
  const { data: updated, error } = await supabase
    .from("categories")
    .update(toRow(patch))
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!updated) throw new Error("Kateqoriya tapılmadı");
  return fromRow(updated);
}

export async function deleteCategory(id) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    if (error.code === "23503") {
      throw new Error("Bu kateqoriyada məhsullar var. Əvvəlcə məhsulları silin və ya başqa kateqoriyaya köçürün.");
    }
    throw new Error(error.message);
  }
  return true;
}

export async function reorderCategory(id, direction) {
  const list = await getCategories();
  const idx = list.findIndex((c) => c.id === id);
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (idx === -1 || swapWith < 0 || swapWith >= list.length) return list;

  const a = list[idx];
  const b = list[swapWith];
  const [resA, resB] = await Promise.all([
    supabase.from("categories").update({ sort_order: b.sortOrder }).eq("id", a.id),
    supabase.from("categories").update({ sort_order: a.sortOrder }).eq("id", b.id),
  ]);
  if (resA.error) throw new Error(resA.error.message);
  if (resB.error) throw new Error(resB.error.message);
  return getCategories();
}
