import { supabase } from "../lib/supabase.js";

// Maps a DB row (snake_case) to the app's message shape (camelCase).
function fromRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email || "",
    phone: row.phone || "",
    subject: row.subject || "",
    message: row.message,
    read: row.read,
    createdAt: row.created_at,
  };
}

export async function getContactMessages() {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data.map(fromRow);
}

export async function markMessageAsRead(id) {
  const { data: updated, error } = await supabase
    .from("contact_messages")
    .update({ read: true })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!updated) throw new Error("Mesaj tapılmadı");
  return fromRow(updated);
}

export async function deleteContactMessage(id) {
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
