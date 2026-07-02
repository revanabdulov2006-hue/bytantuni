-- ============================================================================
-- BY TANTUNI — Supabase PostgreSQL Schema
-- ============================================================================
-- Paste this file into the Supabase SQL Editor and run it once on a fresh
-- project. It creates all tables, constraints, indexes, triggers, a derived
-- customer-stats view, and Row Level Security policies.
--
-- Access model:
--   * anon (public storefront):
--       - SELECT on categories, products, campaigns
--       - SELECT on settings EXCEPT the 'security' section (admin code)
--       - INSERT on orders, order_items (checkout) and contact_messages
--   * authenticated: full access on every table. NOTE: the React app does not
--     use Supabase Auth yet, so until it does, perform admin operations with
--     the service-role key (server-side only — it bypasses RLS). These
--     policies are ready for when Supabase Auth is added.
--
-- No seed data is inserted — tables start empty.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Sequence for human-readable order numbers ("BT-1000", "BT-1001", ...)
-- ----------------------------------------------------------------------------
create sequence if not exists order_number_seq start with 1000;

-- ----------------------------------------------------------------------------
-- Shared trigger function: keep updated_at current on every UPDATE
-- ----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- categories
-- ----------------------------------------------------------------------------
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  icon        text,                                -- emoji or icon identifier
  active      boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- products
-- sizes / extras are per-product option lists edited as arrays in the admin
-- form and never referenced by other tables, so they live as JSONB.
-- Order items snapshot the chosen values at purchase time.
--   sizes  : [{ "name": "Tək lavaş", "delta": 0 }, ...]   (delta = price adjustment)
--   extras : [{ "name": "Əlavə pendir", "price": 1.0 }, ...]
-- ----------------------------------------------------------------------------
create table if not exists products (
  id                uuid primary key default gen_random_uuid(),
  category_id       uuid not null references categories(id) on delete restrict,
  name              text not null,
  price             numeric(10,2) not null check (price >= 0),
  old_price         numeric(10,2) check (old_price is null or old_price > 0),
  description       text,
  long_description  text,
  ingredients       text[] not null default '{}',
  image_url         text,
  bestseller        boolean not null default false,
  active            boolean not null default true,
  rating            numeric(2,1) check (rating is null or (rating >= 0 and rating <= 5)),
  review_count      integer not null default 0 check (review_count >= 0),
  prep_time         text,                          -- e.g. "15 dəq"
  spicy_level       text check (spicy_level is null or spicy_level in ('mild', 'medium', 'hot')),
  sizes             jsonb not null default '[]',
  extras            jsonb not null default '[]',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- customers
-- total_orders / last_order_date are intentionally NOT stored columns — they
-- are derived from orders via the customer_stats view to avoid duplicate data.
-- ----------------------------------------------------------------------------
create table if not exists customers (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  phone       text not null unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- orders
-- customer_name / phone are snapshots so order history survives customer
-- deletion (customer_id is nullable and set null on delete — guest checkout
-- also works without a customers row).
-- Status transitions (new → preparing → ready → delivered, cancellable until
-- delivered) are enforced in the application layer.
-- ----------------------------------------------------------------------------
create table if not exists orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text not null unique default ('BT-' || nextval('order_number_seq')),
  customer_id    uuid references customers(id) on delete set null,
  customer_name  text not null,
  phone          text not null,
  address        text,
  note           text,
  location_lat   double precision,
  location_lng   double precision,
  total          numeric(10,2) not null check (total >= 0),
  status         text not null default 'new'
                 check (status in ('new', 'preparing', 'ready', 'delivered', 'cancelled')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- order_items
-- Snapshots the product name, chosen size (variant), extras and unit price at
-- purchase time. unit_price = base price + size delta + sum of extras,
-- matching the app's pricing formula. product_id is kept as a soft link.
-- ----------------------------------------------------------------------------
create table if not exists order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders(id) on delete cascade,
  product_id   uuid references products(id) on delete set null,
  name         text not null,
  variant      text,                               -- chosen size label
  extras       jsonb not null default '[]',        -- chosen extras snapshot
  spicy_level  text check (spicy_level is null or spicy_level in ('mild', 'medium', 'hot')),
  qty          integer not null check (qty > 0),
  unit_price   numeric(10,2) not null check (unit_price >= 0),
  line_total   numeric(10,2) generated always as (unit_price * qty) stored,
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- campaigns
-- Display-only promotions today; discount_percent is stored for future use.
-- ----------------------------------------------------------------------------
create table if not exists campaigns (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  description       text,
  banner_image_url  text,
  discount_percent  integer check (discount_percent is null or (discount_percent >= 0 and discount_percent <= 100)),
  start_date        date,
  end_date          date,
  active            boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint campaigns_date_range check (
    end_date is null or start_date is null or end_date >= start_date
  )
);

-- ----------------------------------------------------------------------------
-- settings
-- One row per section, mirroring the app's per-section save model:
--   general  : { restaurantName, logoUrl, phone, address, workingHours, whatsapp1, whatsapp2 }
--   social   : { facebook, instagram, tiktok }
--   seo      : { metaTitle, metaDescription, faviconUrl }
--   security : { adminEmail, adminCode }   -- never exposed to anon (see RLS)
-- ----------------------------------------------------------------------------
create table if not exists settings (
  id          uuid primary key default gen_random_uuid(),
  section     text not null unique check (section in ('general', 'social', 'seo', 'security')),
  data        jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- contact_messages
-- ----------------------------------------------------------------------------
create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text,
  phone       text,
  subject     text,
  message     text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists idx_categories_sort_order      on categories (sort_order);

create index if not exists idx_products_category_id       on products (category_id);
create index if not exists idx_products_active            on products (active);
create index if not exists idx_products_bestseller        on products (bestseller) where bestseller;

create index if not exists idx_orders_status              on orders (status);
create index if not exists idx_orders_created_at          on orders (created_at desc);
create index if not exists idx_orders_customer_id         on orders (customer_id);
create index if not exists idx_orders_phone               on orders (phone);

create index if not exists idx_order_items_order_id       on order_items (order_id);
create index if not exists idx_order_items_product_id     on order_items (product_id);

create index if not exists idx_campaigns_active           on campaigns (active);

create index if not exists idx_contact_messages_read      on contact_messages (read);
create index if not exists idx_contact_messages_created   on contact_messages (created_at desc);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Derived customer statistics (replaces the stored totalOrders/lastOrderDate
-- fields from the old localStorage model). Cancelled orders are excluded.
create or replace view customer_stats as
select
  c.id,
  c.full_name,
  c.phone,
  c.created_at,
  count(o.id) filter (where o.status <> 'cancelled')            as total_orders,
  max(o.created_at) filter (where o.status <> 'cancelled')      as last_order_date
from customers c
left join orders o on o.customer_id = c.id
group by c.id;

-- ============================================================================
-- updated_at TRIGGERS
-- ============================================================================
create trigger trg_categories_updated_at        before update on categories        for each row execute function set_updated_at();
create trigger trg_products_updated_at          before update on products          for each row execute function set_updated_at();
create trigger trg_customers_updated_at         before update on customers         for each row execute function set_updated_at();
create trigger trg_orders_updated_at            before update on orders            for each row execute function set_updated_at();
create trigger trg_campaigns_updated_at         before update on campaigns         for each row execute function set_updated_at();
create trigger trg_settings_updated_at          before update on settings          for each row execute function set_updated_at();
create trigger trg_contact_messages_updated_at  before update on contact_messages  for each row execute function set_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table categories        enable row level security;
alter table products          enable row level security;
alter table customers         enable row level security;
alter table orders            enable row level security;
alter table order_items       enable row level security;
alter table campaigns         enable row level security;
alter table settings          enable row level security;
alter table contact_messages  enable row level security;

-- ---- Public storefront reads -----------------------------------------------
create policy "Public can read categories"
  on categories for select
  to anon, authenticated
  using (true);

create policy "Public can read products"
  on products for select
  to anon, authenticated
  using (true);

create policy "Public can read campaigns"
  on campaigns for select
  to anon, authenticated
  using (true);

-- Settings are public EXCEPT the security section (admin email + code).
create policy "Public can read non-security settings"
  on settings for select
  to anon
  using (section <> 'security');

-- ---- Public writes (checkout + contact form) --------------------------------
create policy "Public can place orders"
  on orders for insert
  to anon
  with check (true);

create policy "Public can add order items"
  on order_items for insert
  to anon
  with check (true);

create policy "Public can send contact messages"
  on contact_messages for insert
  to anon
  with check (true);

-- ---- Admin (authenticated) full access --------------------------------------
-- The app has no Supabase Auth yet; until it does, use the service-role key
-- (server-side only) for admin operations. These policies activate once
-- Supabase Auth is wired in.
create policy "Admins have full access to categories"
  on categories for all to authenticated using (true) with check (true);

create policy "Admins have full access to products"
  on products for all to authenticated using (true) with check (true);

create policy "Admins have full access to customers"
  on customers for all to authenticated using (true) with check (true);

create policy "Admins have full access to orders"
  on orders for all to authenticated using (true) with check (true);

create policy "Admins have full access to order_items"
  on order_items for all to authenticated using (true) with check (true);

create policy "Admins have full access to campaigns"
  on campaigns for all to authenticated using (true) with check (true);

create policy "Admins have full access to settings"
  on settings for all to authenticated using (true) with check (true);

create policy "Admins have full access to contact_messages"
  on contact_messages for all to authenticated using (true) with check (true);
