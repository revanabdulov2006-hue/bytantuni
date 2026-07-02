import { supabase } from "../lib/supabase.js";

// Maps a DB row (snake_case) to the app's campaign shape (camelCase).
function fromRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    bannerImage: row.banner_image_url || "",
    discountPercent: row.discount_percent,
    startDate: row.start_date,
    endDate: row.end_date,
    active: row.active,
    createdAt: row.created_at,
  };
}

// Maps app-shape fields to DB columns, ignoring unknown keys (id, createdAt…).
function toRow(patch) {
  const row = {};
  if ("title" in patch) row.title = patch.title;
  if ("description" in patch) row.description = patch.description || null;
  if ("bannerImage" in patch) row.banner_image_url = patch.bannerImage || null;
  if ("discountPercent" in patch) row.discount_percent = patch.discountPercent || null;
  if ("startDate" in patch) row.start_date = patch.startDate || null;
  if ("endDate" in patch) row.end_date = patch.endDate || null;
  if ("active" in patch) row.active = patch.active;
  return row;
}

export async function getCampaigns() {
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data.map(fromRow);
}

export async function createCampaign(data) {
  const { data: created, error } = await supabase
    .from("campaigns")
    .insert({ active: true, ...toRow(data) })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return fromRow(created);
}

export async function updateCampaign(id, patch) {
  const { data: updated, error } = await supabase
    .from("campaigns")
    .update(toRow(patch))
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!updated) throw new Error("Kampaniya tapılmadı");
  return fromRow(updated);
}

export async function deleteCampaign(id) {
  const { error } = await supabase.from("campaigns").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
