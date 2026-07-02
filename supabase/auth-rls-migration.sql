-- ============================================================================
-- Supabase Auth migration — run once in the Supabase SQL Editor
-- ============================================================================
-- Replaces the temporary anon-full-access policies with the secure model:
--   • anon (storefront): read menu/campaigns/public settings, place orders
--     ONLY through the place_order() function, send contact messages
--   • authenticated (admin): full access (base policies from schema.sql)
--
-- BEFORE running this file, in the Supabase Dashboard:
--   1. Authentication → Users → "Add user" → create the admin
--      (e.g. admin@bytantuni.az with a strong password, "Auto Confirm User" on)
--   2. Authentication → Sign In / Providers → disable "Allow new users to
--      sign up" — otherwise anyone could self-register and gain admin access,
--      because the base policies grant full access to any authenticated user.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Drop the temporary policies
-- ----------------------------------------------------------------------------
drop policy if exists "TEMP anon full access categories"       on categories;
drop policy if exists "TEMP anon full access products"         on products;
drop policy if exists "TEMP anon full access customers"        on customers;
drop policy if exists "TEMP anon full access orders"           on orders;
drop policy if exists "TEMP anon full access order_items"      on order_items;
drop policy if exists "TEMP anon full access campaigns"        on campaigns;
drop policy if exists "TEMP anon full access settings"         on settings;
drop policy if exists "TEMP anon full access contact_messages" on contact_messages;

-- ----------------------------------------------------------------------------
-- 2. Tighten checkout: anon may no longer write orders tables directly.
--    All guest checkouts go through place_order() below, which validates the
--    payload and runs in a single transaction. (The base "Public can send
--    contact messages" insert policy stays for the contact form.)
-- ----------------------------------------------------------------------------
drop policy if exists "Public can place orders"    on orders;
drop policy if exists "Public can add order items" on order_items;

-- ----------------------------------------------------------------------------
-- 3. Guest checkout function (security definer = runs with owner privileges,
--    bypassing RLS in a controlled way). Upserts the customer by phone,
--    creates the order and its items atomically, returns the order as jsonb
--    in the same shape the app's SELECT uses.
-- ----------------------------------------------------------------------------
create or replace function public.place_order(
  p_customer_name text,
  p_phone         text,
  p_address       text default null,
  p_note          text default null,
  p_total         numeric default 0,
  p_items         jsonb default '[]'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_order       orders;
begin
  -- validation (mirrors the checkout form's required fields)
  if p_customer_name is null or length(trim(p_customer_name)) = 0 then
    raise exception 'Ad tələb olunur';
  end if;
  if p_phone is null or length(trim(p_phone)) = 0 then
    raise exception 'Telefon tələb olunur';
  end if;
  if p_total is null or p_total < 0 or p_total > 100000 then
    raise exception 'Yekun məbləğ yanlışdır';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 100 then
    raise exception 'Sifariş məhsulları yanlışdır';
  end if;

  insert into customers (full_name, phone)
  values (trim(p_customer_name), trim(p_phone))
  on conflict (phone) do update set full_name = excluded.full_name
  returning id into v_customer_id;

  insert into orders (customer_id, customer_name, phone, address, note, total)
  values (
    v_customer_id,
    trim(p_customer_name),
    trim(p_phone),
    nullif(trim(coalesce(p_address, '')), ''),
    nullif(trim(coalesce(p_note, '')), ''),
    p_total
  )
  returning * into v_order;

  insert into order_items (order_id, name, variant, qty, unit_price)
  select
    v_order.id,
    item->>'name',
    nullif(item->>'variant', ''),
    (item->>'qty')::integer,
    (item->>'price')::numeric
  from jsonb_array_elements(p_items) as item;

  return jsonb_build_object(
    'id',            v_order.id,
    'order_number',  v_order.order_number,
    'customer_name', v_order.customer_name,
    'phone',         v_order.phone,
    'address',       v_order.address,
    'note',          v_order.note,
    'total',         v_order.total,
    'status',        v_order.status,
    'created_at',    v_order.created_at,
    'order_items',   (
      select jsonb_agg(jsonb_build_object(
        'name', oi.name, 'variant', oi.variant,
        'qty', oi.qty, 'unit_price', oi.unit_price
      ))
      from order_items oi
      where oi.order_id = v_order.id
    )
  );
end;
$$;

revoke all on function public.place_order(text, text, text, text, numeric, jsonb) from public;
grant execute on function public.place_order(text, text, text, text, numeric, jsonb) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 4. Remove the obsolete stored admin credentials — login is Supabase Auth
--    now, so the plaintext code must not linger in the settings table.
-- ----------------------------------------------------------------------------
delete from settings where section = 'security';
