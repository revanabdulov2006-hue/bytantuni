import { supabase } from "../lib/supabase.js";
import { SETTINGS_MOCK } from "../mocks/settings.mock.js";

// general/social/seo live in the settings table (one jsonb row per section);
// missing rows fall back to the defaults. RLS hides nothing from these three
// sections, so the storefront (anon) can read them.
//
// The security section is Supabase Auth: adminEmail is the signed-in user's
// e-mail, adminCode is the account password (never readable — always shown
// blank). Saving it calls auth.updateUser instead of writing to the table.

const TABLE_SECTIONS = ["general", "social", "seo"];
const DEFAULTS = SETTINGS_MOCK;

export async function getSettings() {
  const [{ data, error }, { data: auth }] = await Promise.all([
    supabase.from("settings").select("section, data"),
    supabase.auth.getSession(),
  ]);
  if (error) throw new Error(error.message);

  const byName = Object.fromEntries((data || []).map((r) => [r.section, r.data]));
  const settings = {};
  for (const section of TABLE_SECTIONS) {
    settings[section] = { ...DEFAULTS[section], ...(byName[section] || {}) };
  }
  settings.security = {
    adminEmail: auth.session?.user?.email || "",
    adminCode: "",
  };
  return settings;
}

export async function updateSettingsSection(section, values) {
  if (section === "security") {
    await updateAdminCredentials(values);
    return getSettings();
  }

  const { data: existing, error: readError } = await supabase
    .from("settings")
    .select("data")
    .eq("section", section)
    .maybeSingle();
  if (readError) throw new Error(readError.message);

  const merged = { ...DEFAULTS[section], ...(existing?.data || {}), ...values };
  const { error } = await supabase
    .from("settings")
    .upsert({ section, data: merged }, { onConflict: "section" });
  if (error) throw new Error(error.message);

  return getSettings();
}

async function updateAdminCredentials(values) {
  const { data: auth } = await supabase.auth.getSession();
  const currentEmail = auth.session?.user?.email || "";

  const patch = {};
  const email = (values.adminEmail || "").trim();
  const password = (values.adminCode || "").trim();
  if (email && email.toLowerCase() !== currentEmail.toLowerCase()) patch.email = email;
  if (password) patch.password = password;
  if (Object.keys(patch).length === 0) return;

  const { error } = await supabase.auth.updateUser(patch);
  if (error) throw new Error(error.message);
}
