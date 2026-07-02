-- ============================================================================
-- ⚠ DEPRECATED — do not run on new projects.
-- Superseded by supabase/auth-rls-migration.sql, which drops these policies
-- and switches the admin panel to Supabase Auth. Kept for history only.
-- ============================================================================
-- TEMPORARY admin policies — run once in the Supabase SQL Editor
-- ============================================================================
-- The React admin panel runs in the browser with the ANON key and the app
-- does not use Supabase Auth yet (admin login is a local email+code check).
-- Without these policies RLS blocks every admin write.
--
-- ⚠ SECURITY NOTE: this grants full read/write on all tables to anyone
-- holding the anon key (which ships in the JS bundle) — the same security
-- level as the current localStorage app, i.e. none. Replace with Supabase
-- Auth as soon as possible, then remove these policies with the DROP
-- statements at the bottom.
-- ============================================================================

create policy "TEMP anon full access categories"       on categories       for all to anon using (true) with check (true);
create policy "TEMP anon full access products"         on products         for all to anon using (true) with check (true);
create policy "TEMP anon full access customers"        on customers        for all to anon using (true) with check (true);
create policy "TEMP anon full access orders"           on orders           for all to anon using (true) with check (true);
create policy "TEMP anon full access order_items"      on order_items      for all to anon using (true) with check (true);
create policy "TEMP anon full access campaigns"        on campaigns        for all to anon using (true) with check (true);
create policy "TEMP anon full access settings"         on settings         for all to anon using (true) with check (true);
create policy "TEMP anon full access contact_messages" on contact_messages for all to anon using (true) with check (true);

-- ============================================================================
-- CLEANUP (run after Supabase Auth is wired into the admin panel):
--
-- drop policy "TEMP anon full access categories"       on categories;
-- drop policy "TEMP anon full access products"         on products;
-- drop policy "TEMP anon full access customers"        on customers;
-- drop policy "TEMP anon full access orders"           on orders;
-- drop policy "TEMP anon full access order_items"      on order_items;
-- drop policy "TEMP anon full access campaigns"        on campaigns;
-- drop policy "TEMP anon full access settings"         on settings;
-- drop policy "TEMP anon full access contact_messages" on contact_messages;
-- ============================================================================
