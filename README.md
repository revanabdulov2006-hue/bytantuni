# BY TANTUNI — Project Documentation

A restaurant ordering web app for **BY TANTUNI** (tantuni / döner / burger / köfte restaurant with branches in Xırdalan and Masazır, Azerbaijan). The UI is entirely in Azerbaijani. The app has two halves sharing one React codebase:

- **Customer storefront** (`/`) — browse the menu, customize items, build a cart, and place an order via WhatsApp.
- **Admin dashboard** (`/admin/*`) — manage products, categories, campaigns, orders, customers, contact messages, and site settings.

There is **no real backend**. All data (products, categories, orders, campaigns, customers, messages, settings) is seeded from mock files and persisted client-side in `localStorage`. Order placement doesn't hit a payment/checkout API — it builds a formatted message and opens a WhatsApp deep link to the restaurant's number.

---

## 1. Tech Stack & Scripts

- **React** 19, **React Router** 7 (`react-router-dom`), **Vite** 8, **Tailwind CSS** 4 (via `@tailwindcss/vite`), **lucide-react** for icons.
- Linting via **oxlint** (`.oxlintrc.json`).

`package.json` scripts:
| Script | Command | Purpose |
|---|---|---|
| `dev` | `vite` | Start local dev server with HMR |
| `build` | `vite build` | Production build to `dist/` |
| `lint` | `oxlint` | Run linter |
| `preview` | `vite preview` | Preview the production build locally |

`vite.config.js` registers two plugins: `@vitejs/plugin-react` and `@tailwindcss/vite`.

---

## 2. Project Structure

```
src/
├── App.jsx                # Route table
├── main.jsx                # Entry point, wraps App in context providers
├── index.css                # Tailwind theme tokens (colors, fonts) — no logic
├── components/
│   ├── admin/               # AdminAuthGuard, Sidebar, Topbar
│   ├── campaigns/            # CampaignCard, CampaignFormModal
│   ├── categories/            # CategoryFormModal
│   ├── contact/               # MessageDetailModal
│   ├── customer/               # Storefront UI: TopNav, Hero, ProductCard, CartDrawer,
│   │                            # CheckoutModal, SearchOverlay, FavoritesPanel, ProfilePanel,
│   │                            # BottomTabBar, CampaignStrip, CategoryPills, etc.
│   ├── customers/               # CustomerDetailModal
│   ├── dashboard/                # ActivityFeed, BestSellersList, RecentOrdersTable
│   ├── orders/                    # OrderDetailModal, OrderStatusDropdown
│   ├── products/                   # ProductFormModal
│   └── ui/                          # Generic building blocks: Modal, Button, DataTable,
│                                      # Pagination, Toast, StatCard, Dropdown, etc.
├── context/                # ThemeContext, ToastContext, CartContext, AdminAuthContext
├── hooks/                   # Data hooks (useProducts, useOrders, ...) + utility hooks
├── layouts/                  # PublicLayout (storefront), DashboardLayout (admin)
├── pages/
│   ├── customer/HomePage.jsx    # The entire storefront experience
│   └── admin/                    # One page per admin section (see Routing)
├── routes/adminRoutes.jsx   # Admin nav/route config consumed by App.jsx
├── services/                # CRUD functions per entity, backed by localStorage
├── mocks/                   # Seed data for every entity
└── utils/                   # constants.js, format.js, id.js, whatsapp.js, validators.js, icons.js
```

`public/` holds static assets (`favicon.png`, `hero.jpg`).

`legacy-static/` is an **old, unused** pre-React static HTML/CSS/JS version of the site kept for historical reference only — it is not built, served, or linked from the current app.

---

## 3. Routing

Defined in `src/App.jsx`, admin sub-routes come from `NAV_ROUTES` in `src/routes/adminRoutes.jsx`.

| Path | Component | Notes |
|---|---|---|
| `/` | `HomePage` (inside `PublicLayout`) | Storefront |
| `/admin/login` | `AdminLoginPage` | Public, no guard |
| `/admin` | redirects to `/admin/dashboard` | — |
| `/admin/dashboard` | `DashboardPage` | Behind `AdminAuthGuard` + `DashboardLayout` |
| `/admin/products` | `ProductsPage` | " |
| `/admin/categories` | `CategoriesPage` | " |
| `/admin/campaigns` | `CampaignsPage` | " |
| `/admin/orders` | `OrdersPage` | " |
| `/admin/customers` | `CustomersPage` | " |
| `/admin/settings` | `SettingsPage` | " |
| `/admin/messages` | `ContactMessagesPage` | " |
| `/admin/*` (unmatched) | `NotFoundPage` | Admin 404 |
| `*` (unmatched, outside `/admin`) | redirects to `/` | — |

All `/admin/*` routes except `/admin/login` are wrapped by `AdminAuthGuard`, which redirects to `/admin/login` if there's no active session.

---

## 4. Customer Storefront (`HomePage.jsx`)

- **Product browsing** — products are grouped by category and rendered as `ProductCard` grids. `CategoryPills` filter by category ("all" included); an `IntersectionObserver` keeps the active pill in sync as the user scrolls past each category section.
- **Product detail & customization** — `ProductDetailModal` lets the user pick a **size** (each size has a price `delta`), toggle **extras** (each with its own price), choose a **spicy level** (`SpicyLevelControl`: mild/medium/hot), and set quantity (`QuantityStepper`) before adding to cart.
- **Cart** — managed by `CartContext`/`CartDrawer`. Supports add, quantity update (qty ≤ 0 removes the item), remove, and clear. Persisted to `localStorage`. Unit price is computed as `basePrice + sizeDelta + sum(extraPrices)`; line total is `unitPrice × qty`.
- **Favorites** — `useFavorites` toggles a product in/out of a favorites list (`FavoritesPanel`), persisted to `localStorage`.
- **Search** — `SearchOverlay` is a full-screen overlay searching product names in real time (debounced via `useDebounce`).
- **Checkout & order placement** — `CheckoutModal` collects name, phone, optional address, optional note, and optionally the user's GPS location (`navigator.geolocation.getCurrentPosition`). On submit:
  1. A WhatsApp message is built (`utils/whatsapp.js` → `buildWhatsAppMessage`) listing each item, quantities, prices, total, address, and a Google Maps link if location was granted.
  2. `buildWhatsAppUrl(phone, message)` opens `https://wa.me/{phone}?text=...` in a new tab (the restaurant's WhatsApp number, from Settings).
  3. The order is saved to `localStorage` with `status: "new"`.
  4. A success toast is shown.
- **Campaigns strip** — `CampaignStrip` shows active campaigns as a horizontally scrollable promo banner. **Display-only**: `discountPercent` is not applied to cart pricing anywhere.
- Also present: theme toggle (light/dark), toast notifications, a mobile-only bottom tab bar (Home / Favorites / Cart / Profile), and a `ProfilePanel`.

---

## 5. Admin Dashboard

### Authentication
`AdminLoginPage` takes an **email + numeric security code**, checked against `settings.security.adminEmail` / `settings.security.adminCode` (`AdminAuthContext.login`). On success, `sessionStorage["bt-admin-session"] = "1"` is set (cleared on browser/tab close — not a persistent login). `AdminAuthGuard` reads this to gate all `/admin/*` routes except the login page itself.

### Dashboard (`DashboardPage`)
Computed by `useDashboardStats`, which aggregates over products/categories/orders/campaigns:
- Today's order count and today's revenue (sum of totals for orders created today, **excluding cancelled**).
- Active campaign count, total product count, total category count.
- Recent orders table (latest 6), best-sellers list (top 5 products by summed quantity across non-cancelled orders), and an activity feed of recent orders.

### Products (`ProductsPage`)
Full CRUD via `ProductFormModal`. List view supports search, category filter, and pagination (8/page).

### Categories (`CategoriesPage`)
Full CRUD via `CategoryFormModal`, plus reordering (up/down, adjusts `sortOrder`) and an active/inactive toggle. Shows product count per category.

### Orders (`OrdersPage`)
Search by customer name / phone / order number, filter by status, view details in `OrderDetailModal`, and change status via `OrderStatusDropdown`. Status changes are constrained by a state machine (see [Business Logic](#7-business-logic-notes)).

### Campaigns (`CampaignsPage`)
Full CRUD via `CampaignFormModal`: title, description, banner image, discount percent, start/end date, active toggle.

### Customers (`CustomersPage`)
Read-only directory (no create/edit) with search by name/phone and pagination. Shows total order count and last order date per customer.

### Contact Messages (`ContactMessagesPage`)
Lists inbound contact-form submissions with an unread badge; supports search by name/subject, marking as read, viewing full message (`MessageDetailModal`), and deleting.

### Settings (`SettingsPage`)
Four independently-saved sections:
- **General** — restaurant name, logo URL, phone, address, working hours, two WhatsApp numbers.
- **Social** — Facebook, Instagram, TikTok links.
- **SEO** — meta title, meta description, favicon URL.
- **Security** — admin login email and admin code (used by `AdminLoginPage`).

---

## 6. Data Models

Shapes as used across `mocks/` and `services/` (plain JS objects, not TypeScript):

**Product**
```js
{
  id, name, category, price, oldPrice,           // oldPrice unused in calculations today
  description, longDescription, ingredients: [],
  image, bestseller, active, rating, reviewCount,
  prepTime, spicyLevel: "mild" | "medium" | "hot" | null,
  sizes: [{ name, delta }],
  extras: [{ name, price }],
  createdAt,
}
```

**Category**
```js
{ id, name, icon, active, sortOrder }
```

**Order**
```js
{
  id, orderNumber,           // e.g. "BT-1042"
  customerName, phone,
  items: [{ name, variant, qty, price }],
  total,
  status: "new" | "preparing" | "ready" | "delivered" | "cancelled",
  createdAt,
}
```

**Cart Item**
```js
{
  id, productId, name, image, qty,
  sizeName, sizeDelta,
  selectedExtras: [{ name, price }],
  spicyLevel,
  unitPrice,   // price + sizeDelta + sum(extras)
  variant,     // display label, e.g. size name
  price,
}
```

**Customer**
```js
{ id, fullName, phone, totalOrders, lastOrderDate }
```

**Campaign**
```js
{ id, title, description, bannerImage, discountPercent, startDate, endDate, active, createdAt }
```

**Contact Message**
```js
{ id, name, email, phone, subject, message, createdAt, read }
```

**Settings**
```js
{
  general: { restaurantName, logoUrl, phone, address, workingHours, whatsapp1, whatsapp2 },
  social: { facebook, instagram, tiktok },
  seo: { metaTitle, metaDescription, faviconUrl },
  security: { adminEmail, adminCode },
}
```

---

## 7. State Management

### Context providers (mounted in `main.jsx`)
| Context | Holds | Persistence |
|---|---|---|
| `ThemeContext` | `theme` ("light"/"dark"), `toggleTheme()` | `localStorage["bt-admin-theme"]` |
| `ToastContext` | `toasts[]`, `showToast(message, type)`, `dismissToast(id)`; auto-dismiss after 3.2s | in-memory |
| `CartContext` | `items[]`, `isOpen`, `count`, `total`, `addItem/updateQty/removeItem/clearCart/openCart/closeCart` | `localStorage["bt-admin-cart"]` |
| `AdminAuthContext` | `isAuthenticated`, `login(email, code)`, `logout()` | `sessionStorage["bt-admin-session"]` |

### Data hooks (`src/hooks/`)
CRUD + loading/error state wrappers around the corresponding `services/*` module: `useProducts`, `useCategories` (includes reorder), `useOrders` (includes status update, sorted by `createdAt` desc), `useCampaigns`, `useSettings` (per-section save), `useCustomers` (read-only), `useContactMessages` (read/delete, sorted desc), `useFavorites` (sync, no async), and `useDashboardStats` (derived/computed, not its own service).

### Utility hooks
- `useDebounce(value, delayMs)` — debounces search inputs.
- `usePagination(items, pageSize)` — page state, `pageItems`, `totalPages`, `goToPage`.
- `useDragScroll(ref)` — mouse-drag horizontal scrolling for strips like `CampaignStrip`.

---

## 8. Services & Persistence Layer

`src/services/storage.js` is the localStorage wrapper every other service builds on:
- `PREFIX = "bt-admin-"`, `DELAY_MS = 220` — every service call is artificially delayed ~220ms to simulate network latency.
- `readCollection(key, fallback)` — reads `localStorage[PREFIX+key]`; if missing, seeds it with `fallback` (from `mocks/`) and returns a clone.
- `writeCollection(key, value)` — writes back as JSON; silently no-ops if storage is unavailable.

Per-entity service files (`products.js`, `categories.js`, `orders.js`, `campaigns.js`, `customers.js`, `contactMessages.js`, `settings.js`) implement CRUD on top of these two functions. `cart.js` and `favorites.js` handle their own client-only state, also localStorage-backed.

All `localStorage` keys in use: `products`, `categories`, `orders`, `campaigns`, `customers`, `settings`, `messages` (all prefixed `bt-admin-`), plus `bt-admin-cart`, `bt-admin-theme`. `bt-admin-session` lives in `sessionStorage`, not `localStorage`.

---

## 9. External Integrations

- **WhatsApp** (`src/utils/whatsapp.js`) — `buildWhatsAppMessage(...)` formats the order (customer name, phone, itemized list with quantities/prices, total, address, Google Maps link if location was shared, note); `buildWhatsAppUrl(phone, message)` produces `https://wa.me/{phone}?text={encoded}`. This is the entire "checkout" flow — there is no payment gateway.
- **Geolocation API** — used only in `CheckoutModal` to optionally attach a `{lat, lng}` Google Maps link to the WhatsApp order message.
- **No real backend, payment processor, email, or SMS service** — everything else is mock data and `localStorage`.

---

## 10. Business Logic Notes

- **Unit price formula**: `unitPrice = product.price + selectedSize.delta + sum(selectedExtras.price)`; cart line total = `unitPrice × qty`.
- **Order status state machine** (`src/utils/constants.js` → `ORDER_STATUS_TRANSITIONS`):
  - `new` → `preparing` or `cancelled`
  - `preparing` → `ready` or `cancelled`
  - `ready` → `delivered` or `cancelled`
  - `delivered` and `cancelled` are terminal.
- **Best sellers**: sums order-item quantities by product name across all non-cancelled orders, ranks descending, takes top 5.
- **Today's revenue**: sums `total` for orders whose `createdAt` falls on the current calendar day, excluding `cancelled`.
- **Unused discount fields**: `Product.oldPrice` and `Campaign.discountPercent` exist in the data model and are shown in the UI, but neither is applied to any price calculation — campaigns are promotional/display-only today.
- **Currency**: Manat (`₼`), formatted via `src/utils/format.js`.

---

## 11. Legacy

`legacy-static/` contains an older, pre-React static implementation (`index.html`, `css/style.css`, `js/script.js`). It is **not built or served** by the current app and exists only for historical reference — all active development happens under `src/`.
#   b y t a n t u n i  
 