// One-time seed: inserts the mock campaigns, settings sections and contact
// messages into Supabase. Orders/customers are NOT seeded — they are created
// by real checkouts.
// Run with:  node --env-file=.env scripts/seed-rest.mjs
// Each section skips itself if its table already has rows.
// Writes require the admin credentials in .env (see scripts/_client.mjs).
import { adminClient, rlsHint } from "./_client.mjs";
import { CAMPAIGNS_MOCK } from "../src/mocks/campaigns.mock.js";
import { SETTINGS_MOCK } from "../src/mocks/settings.mock.js";
import { CONTACT_MESSAGES_MOCK } from "../src/mocks/contactMessages.mock.js";

const supabase = await adminClient();

function fail(msg, error) {
  console.error(`✗ ${msg}: ${error.message}`);
  rlsHint(error);
  process.exit(1);
}

async function isEmpty(table) {
  const { count, error } = await supabase.from(table).select("id", { count: "exact", head: true });
  if (error) fail(`${table} oxunmadı`, error);
  if (count > 0) console.log(`${table} cədvəlində artıq ${count} sətir var — seed ötürüldü.`);
  return count === 0;
}

if (await isEmpty("campaigns")) {
  const { data, error } = await supabase
    .from("campaigns")
    .insert(
      CAMPAIGNS_MOCK.map((c) => ({
        title: c.title,
        description: c.description || null,
        banner_image_url: c.bannerImage || null,
        discount_percent: c.discountPercent || null,
        start_date: c.startDate || null,
        end_date: c.endDate || null,
        active: c.active,
        created_at: c.createdAt,
      }))
    )
    .select("id");
  if (error) fail("Kampaniyalar əlavə olunmadı", error);
  console.log(`✓ ${data.length} kampaniya əlavə edildi.`);
}

// settings: insert only the sections that don't exist yet (never overwrite)
{
  const { data: existing, error } = await supabase.from("settings").select("section");
  if (error) fail("settings oxunmadı", error);
  const present = new Set(existing.map((r) => r.section));
  const rows = Object.entries(SETTINGS_MOCK)
    .filter(([section]) => !present.has(section))
    .map(([section, data]) => ({ section, data }));
  if (rows.length === 0) {
    console.log("settings cədvəlində bütün bölmələr var — seed ötürüldü.");
  } else {
    const { data, error: insError } = await supabase.from("settings").insert(rows).select("section");
    if (insError) fail("Parametrlər əlavə olunmadı", insError);
    console.log(`✓ ${data.length} parametr bölməsi əlavə edildi (${data.map((r) => r.section).join(", ")}).`);
  }
}

if (await isEmpty("contact_messages")) {
  const { data, error } = await supabase
    .from("contact_messages")
    .insert(
      CONTACT_MESSAGES_MOCK.map((m) => ({
        name: m.name,
        email: m.email || null,
        phone: m.phone || null,
        subject: m.subject || null,
        message: m.message,
        read: m.read,
        created_at: m.createdAt,
      }))
    )
    .select("id");
  if (error) fail("Mesajlar əlavə olunmadı", error);
  console.log(`✓ ${data.length} mesaj əlavə edildi.`);
}
