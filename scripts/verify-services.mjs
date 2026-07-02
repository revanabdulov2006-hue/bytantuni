// Live verification of the migrated data services under the secure RLS model:
// admin suites run with a signed-in Supabase Auth user, checkout runs as an
// anonymous guest through the place_order() function, and the security suite
// proves anon writes are blocked.
// Run with:  node --env-file=.env scripts/verify-services.mjs [service...]
// Services: campaigns settings messages customers orders security (default: all).
// Creates temporary test rows and removes them afterwards.
import { adminClient, anonClient, rlsHint } from "./_client.mjs";

const admin = await adminClient();
const anon = anonClient();

function step(name, error) {
  if (error) {
    console.error(`✗ ${name}: ${error.message}`);
    rlsHint(error);
    process.exit(1);
  }
  console.log(`✓ ${name}`);
}

function check(name, ok, detail = "") {
  if (!ok) {
    console.error(`✗ ${name}${detail ? `: ${detail}` : ""}`);
    process.exit(1);
  }
  console.log(`✓ ${name}`);
}

async function verifyCampaigns() {
  console.log("\n— campaigns —");
  const read = await admin.from("campaigns").select("*").order("created_at", { ascending: false });
  step(`Kampaniyalar oxundu (${read.data?.length ?? 0} sətir)`, read.error);

  const ins = await admin
    .from("campaigns")
    .insert({ title: `__TEST_${Date.now()}`, description: "test", discount_percent: 15, start_date: "2026-07-01", end_date: "2026-07-31", active: true })
    .select()
    .single();
  step("Test kampaniyası yaradıldı", ins.error);

  const upd = await admin.from("campaigns").update({ active: false, discount_percent: null }).eq("id", ins.data.id).select().single();
  step("Kampaniya yeniləndi", upd.error);

  const badDates = await admin.from("campaigns").insert({ title: "__TEST bad", start_date: "2026-08-01", end_date: "2026-07-01" });
  check("Yanlış tarix aralığı bloklandı (gözlənilən davranış)", !!badDates.error);

  const del = await admin.from("campaigns").delete().eq("id", ins.data.id);
  step("Test kampaniyası silindi", del.error);
}

async function verifySettings() {
  console.log("\n— settings —");
  const read = await admin.from("settings").select("section, data");
  step(`Parametrlər oxundu (${read.data?.length ?? 0} bölmə)`, read.error);

  const marker = `test-${Date.now()}`;
  const existing = read.data.find((r) => r.section === "seo")?.data ?? {};
  const up = await admin
    .from("settings")
    .upsert({ section: "seo", data: { ...existing, __test: marker } }, { onConflict: "section" })
    .select()
    .single();
  step("seo bölməsi upsert edildi", up.error);

  const back = await admin.from("settings").select("data").eq("section", "seo").single();
  step("seo bölməsi geri oxundu", back.error);
  check("Yazılan dəyər geri oxunur (merge işləyir)", back.data.data.__test === marker);

  const restore = await admin.from("settings").update({ data: existing }).eq("section", "seo");
  step("seo bölməsi bərpa edildi", restore.error);
}

async function verifyMessages() {
  console.log("\n— contact_messages —");
  const read = await admin.from("contact_messages").select("*").order("created_at", { ascending: false });
  step(`Mesajlar oxundu (${read.data?.length ?? 0} sətir)`, read.error);

  // the public contact form path: anon may insert but not read back
  const ins = await anon
    .from("contact_messages")
    .insert({ name: "__TEST", email: "test@test.az", subject: "test", message: "test mesajı" });
  step("Anon mesaj göndərə bilir (əlaqə forması)", ins.error);

  const { data: rows, error: findError } = await admin
    .from("contact_messages")
    .select("*")
    .eq("name", "__TEST");
  step("Mesaj admin tərəfindən tapıldı", findError);
  check("Mesaj oxunmamış kimi yaranır", rows.every((r) => r.read === false));

  const upd = await admin.from("contact_messages").update({ read: true }).eq("id", rows[0].id).select().single();
  step("Mesaj oxunmuş kimi işarələndi", upd.error);

  const del = await admin.from("contact_messages").delete().eq("name", "__TEST");
  step("Test mesajları silindi", del.error);
}

async function verifyCustomers() {
  console.log("\n— customers (customer_stats view) —");
  const read = await admin.from("customer_stats").select("*").order("last_order_date", { ascending: false, nullsFirst: false });
  step(`Müştəri statistikası oxundu (${read.data?.length ?? 0} sətir)`, read.error);
}

async function verifyOrders() {
  console.log("\n— checkout (anon place_order) + admin orders —");
  const phone = `+9945500${String(Date.now()).slice(-5)}`;

  // guest checkout through the RPC — exactly what the storefront does
  const placed = await anon.rpc("place_order", {
    p_customer_name: "__TEST müştəri",
    p_phone: phone,
    p_address: "test ünvan",
    p_note: "test qeyd",
    p_total: 21.0,
    p_items: [
      { name: "Klassik Tantuni", variant: "Cift lavaş", qty: 2, price: 9.0 },
      { name: "Ayran 0.3L", variant: null, qty: 2, price: 1.5 },
    ],
  });
  step(`Anon sifariş verdi (nömrə: ${placed.data?.order_number}, status: ${placed.data?.status})`, placed.error);
  check("order_number BT- formatındadır", /^BT-\d+$/.test(placed.data.order_number));
  check('status defolt olaraq "new"', placed.data.status === "new");
  check(`Sifariş ${placed.data.order_items?.length ?? 0} məhsulla qayıtdı`, placed.data.order_items?.length === 2);

  const orderId = placed.data.id;

  // rejected payloads
  const badItems = await anon.rpc("place_order", {
    p_customer_name: "x", p_phone: "+994", p_total: 1, p_items: [],
  });
  check("Boş məhsul siyahısı rədd edildi", !!badItems.error);

  // admin side: read with join, change status
  const back = await admin
    .from("orders")
    .select("*, order_items(name, variant, qty, unit_price)")
    .eq("id", orderId)
    .single();
  step(`Sifariş admin tərəfindən join ilə oxundu (${back.data?.order_items?.length ?? 0} məhsul)`, back.error);

  const upd = await admin.from("orders").update({ status: "preparing" }).eq("id", orderId).select().single();
  step(`Sifariş statusu dəyişdirildi (${upd.data?.status})`, upd.error);

  const stats = await admin.from("customer_stats").select("*").eq("phone", phone).single();
  step("Müştəri statistikası görünür", stats.error);
  check(`total_orders = 1 (gələn: ${stats.data.total_orders})`, Number(stats.data.total_orders) === 1);

  // cleanup
  const delOrd = await admin.from("orders").delete().eq("id", orderId);
  step("Test sifarişi silindi (sətirlər cascade)", delOrd.error);
  const delCust = await admin.from("customers").delete().eq("phone", phone);
  step("Test müştərisi silindi", delCust.error);
}

async function verifySecurity() {
  console.log("\n— security (anon icazələri) —");

  const menuRead = await anon.from("products").select("id").limit(1);
  step("Anon menyunu oxuya bilir", menuRead.error);

  const catIns = await anon.from("categories").insert({ name: `__HACK_${Date.now()}` });
  check("Anon kateqoriya yarada bilmir", !!catIns.error, "anon INSERT keçdi!");

  const prodUpd = await anon.from("products").update({ price: 0.01 }).neq("id", "00000000-0000-0000-0000-000000000000");
  check("Anon məhsul dəyişə bilmir", !!prodUpd.error || (prodUpd.data ?? []).length === 0);

  const ordersRead = await anon.from("orders").select("id").limit(1);
  check("Anon sifarişləri oxuya bilmir", !!ordersRead.error || (ordersRead.data ?? []).length === 0);

  const customersRead = await anon.from("customers").select("*").limit(1);
  check("Anon müştəriləri oxuya bilmir", !!customersRead.error || (customersRead.data ?? []).length === 0);

  const secRead = await anon.from("settings").select("*").eq("section", "security");
  check("Anon security bölməsini görə bilmir", (secRead.data ?? []).length === 0);

  const directOrder = await anon.from("orders").insert({ customer_name: "x", phone: "+994", total: 1 });
  check("Anon orders cədvəlinə birbaşa yaza bilmir (yalnız place_order)", !!directOrder.error);
}

const SUITES = {
  campaigns: verifyCampaigns,
  settings: verifySettings,
  messages: verifyMessages,
  customers: verifyCustomers,
  orders: verifyOrders,
  security: verifySecurity,
};

const requested = process.argv.slice(2);
const toRun = requested.length ? requested : Object.keys(SUITES);
for (const name of toRun) {
  if (!SUITES[name]) {
    console.error(`Naməlum servis: ${name}. Mövcud: ${Object.keys(SUITES).join(", ")}`);
    process.exit(1);
  }
  await SUITES[name]();
}
console.log("\n✓ Seçilmiş yoxlamalar keçdi.");
