# Deployment Guide — BY TANTUNI (Vercel + Supabase)

This app is a Vite + React single-page application. All data lives in Supabase
(PostgreSQL); the frontend talks to it directly with the public **anon** key.
Deployment therefore has two halves: the Supabase project (database) and the
Vercel project (static frontend).

---

## 1. Prerequisites

- A [Supabase](https://supabase.com) account and project
- A [Vercel](https://vercel.com) account
- The project pushed to a Git repository (GitHub, GitLab, or Bitbucket) —
  Vercel deploys from Git
- Node.js 20.6+ locally (the `db:*` scripts use `node --env-file`)

---

## 2. Set up Supabase

If you are reusing the existing Supabase project, skip to step 2.3.

### 2.1 Create the schema

1. Open your Supabase project → **SQL Editor**.
2. Paste and run the whole of [`supabase/schema.sql`](supabase/schema.sql).
   This creates all 8 tables, indexes, the `customer_stats` view, triggers,
   and the base row-level-security (RLS) policies.

### 2.2 Create the admin user and apply the auth migration

Admin access uses **Supabase Auth** — only the authenticated admin can write
data; anonymous visitors can read the menu and place orders through a
validated database function.

1. **Authentication → Users → Add user**: create the admin account
   (e.g. `admin@bytantuni.az` + a strong password) with **Auto Confirm User**
   enabled. The password is what the admin panel's login form calls
   "Giriş kodu".
2. **Authentication → Sign In / Providers**: disable **"Allow new users to
   sign up"**. This is critical — the RLS policies grant write access to any
   authenticated user, so public sign-ups must be off.
3. In the SQL Editor, run [`supabase/auth-rls-migration.sql`](supabase/auth-rls-migration.sql).
   It removes the old temporary policies (if present), creates the
   `place_order()` checkout function, and deletes the obsolete stored admin
   code.

> `supabase/temp-admin-policies.sql` is deprecated — do not run it on new
> projects.

### 2.3 Get your API credentials

Supabase Dashboard → **Project Settings → API**:

- **Project URL** — e.g. `https://xxxx.supabase.co` (no trailing path!)
- **anon / public key**

Never use the `service_role` key in this project — it would be bundled into
public JavaScript.

### 2.4 Seed initial data (optional, from your machine)

```bash
cp .env.example .env        # fill in the URL, anon key, AND the admin
                            # credentials from step 2.2 (used only by these
                            # local scripts — they are not bundled)
npm install
npm run db:test             # checks the connection
npm run db:seed             # menu (categories + products), campaigns, settings, sample messages
npm run db:verify           # live CRUD + security test of every table, cleans up after itself
```

Seeding is idempotent — each part skips itself if the table already has rows.
The `db:verify` run includes a **security suite** that confirms anonymous
users cannot write to or read the admin tables.

---

## 3. Deploy to Vercel

### 3.1 Import the project

1. Vercel Dashboard → **Add New… → Project** → import your Git repository.
2. Vercel auto-detects **Vite**. The defaults are correct:
   - Build command: `vite build` (or `npm run build`)
   - Output directory: `dist`
   - Install command: `npm install`

The included [`vercel.json`](vercel.json) handles the two things a Vite SPA
needs:
- rewrites every route to `index.html` so react-router URLs like
  `/admin/orders` work on hard refresh;
- long-term caching for the hashed files in `/assets`.

### 3.2 Set environment variables

In the project's **Settings → Environment Variables**, add (for Production,
Preview, and Development):

| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | your anon/public key |

Notes:
- The values are read at **build time** (`import.meta.env`). If you change
  them later, you must **redeploy** for the change to take effect.
- `VITE_`-prefixed variables are embedded in the public bundle by design.
  That is fine for the URL and anon key; it is exactly why the service_role
  key must never appear here.

### 3.3 Deploy

Click **Deploy**. Every subsequent `git push` to the production branch
redeploys automatically; pushes to other branches create preview deployments.

---

## 4. Post-deploy checklist

1. **Storefront** — open the deployed URL: menu loads, campaign strip and
   footer (from settings) render.
2. **Checkout** — add a product to the cart, place a test order; the WhatsApp
   window opens and the order appears in the database.
3. **Admin** — visit `/admin/login`, sign in with the Supabase Auth user from
   step 2.2, and check:
   - **Sifarişlər**: your test order is listed (number format `BT-1000`, …);
     change its status.
   - **Müştərilər**: the test customer appears with 1 order.
   - **Ayarlar → Təhlükəsizlik**: changes the Supabase Auth account itself —
     a new "Giriş kodu" updates the password immediately; a new e-mail sends
     confirmation links (check both inboxes) before it takes effect.
4. **Hard refresh** a deep URL (e.g. `/admin/orders`) — it must not 404
   (verifies the SPA rewrite).

---

## 5. Local development

```bash
cp .env.example .env   # fill in Supabase credentials
npm install
npm run dev            # http://localhost:5173
npm run lint           # oxlint
npm run build          # production build into dist/
```

`.env` is gitignored; only `.env.example` (with placeholders) is committed.

---

## 6. Security model (summary)

| Actor | Can | Cannot |
| --- | --- | --- |
| Anonymous visitor | read menu, campaigns, public settings; place orders via `place_order()`; send contact messages | read orders/customers/security settings; write anything directly |
| Authenticated admin | everything | — |

Because **any** authenticated user has full access, public sign-ups must stay
disabled in Supabase Auth (step 2.2). If you ever need more roles, add a
`profiles`/claims check to the policies.

## 7. Known limitations / next steps

- **Cart and favorites** are stored in the browser's localStorage on purpose
  (guest cart, no user accounts). They survive refreshes on the same device
  but do not sync across devices.
- **Images** are stored as URLs. For uploaded images, add Supabase Storage
  later.
- The JS bundle is ~550 kB minified (~155 kB gzip). Fine for launch; if it
  grows, code-split the admin panel with `React.lazy`.
