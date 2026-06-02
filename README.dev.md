# Sufra — developer notes

Run-local quickstart for the frontend-first phase.

```bash
nvm use                 # Node 20.20+
npm install
npm run dev             # http://localhost:5173
```

Quality gates (matches CI):
```bash
npm run typecheck
npm run lint
npm test                # vitest
npm run e2e:install     # once, installs chromium
npm run e2e             # builds + previews + runs playwright
npm run build           # production build
```

## Routes
- `/` — Home / storefront
- `/catalog` — All products
- `/catalog/:categoryId` — Filtered by category
- `/product/:id` — Product detail
- `/cart` — Cart (Zustand persisted)
- `/checkout` — Checkout form (RHF + Zod) — redirects to `/cart` when empty
- `/checkout/success/:orderId` — Order confirmation
- `/tracking/:orderId` — Order tracking (map + ETA + driver + timeline)
- `/tracking/SUF-DEMO-SHIP` — Visual-QA fixture, renders the *shipping* state
- `/tracking/SUF-DEMO-DONE` — Visual-QA fixture, renders the *delivered* state
- `/account` — Account hub (hero, stats, menu, sign-out)
- `/account/:section` — Per-menu-item placeholders (orders/favorites/addresses/payment/coupons/notifications)
- `/admin` — Admin overview (KPIs · weekly revenue chart · recent orders · top sellers · peak hours · cities)
- `/admin/orders` — Orders table (search · filter chips · pagination · row→tracking)
- `/admin/products` — Products CRUD (low-stock banner · stats · create/edit drawer · delete confirm)
- `/admin/:section` — Placeholders for the remaining sidebar items (campaigns lands in F7)

## Slice F0 — what shipped
- Vite + React 18 + TypeScript (strict).
- Three-layer token CSS: `src/styles/tokens.css` (Homify base), `sufra.css`
  (customer brand layer + helpers + dark theme), `sufra-admin.css`
  (`.sufra-admin` scope). Fonts self-hosted via `@fontsource`.
- i18n (i18next + react-i18next), `ar` default, `en` secondary. `<html dir>`
  and `<html lang>` flip on language change.
- `lib/money.ts` (piastres), `lib/dates.ts`, `lib/rtl.ts`, `lib/queryClient.ts`.
- `lib/mock/data.ts` — typed port of `design/data.js`, used by every feature's
  `api.ts` until the Supabase swap.
- `MerchantProvider` resolves the demo tenant (`sufra`).
- CI: typecheck → lint → vitest → playwright (chromium).

## Slice F1 — what shipped
- **Shared components**: `Icon` (named SVG paths, lucide-style 1.75 stroke),
  `ProductPh` (gradient + glyph placeholder with image-URL override),
  `MobileShell` (480px-cap phone-width column, ambient backdrop on desktop),
  `BottomNav` (4 tabs, RTL-aware badge), `Skeleton` (token-driven shimmer).
- **Catalog feature** (`src/features/catalog/`):
  - `api.ts` — `listCategories`, `getCategory`, `listProducts(filter)`,
    `getProduct`, `listFeatured`. Reads from `src/lib/mock/data.ts`; signatures
    are stable for the Supabase swap.
  - `hooks.ts` — TanStack Query wrappers.
  - `schemas.ts` — `CatalogFilterSchema` (Zod).
  - `components/` — `HomePage`, `CatalogPage`, `ProductDetailPage`,
    `ProductCard`, `CategoryTile`, `FilterChips`, `StorefrontHeader`.
- **i18n**: per-screen string namespaces (`home.*`, `catalog.*`, `product.*`)
  in `src/locales/{ar,en}/common.json` with i18next plural keys
  (`_one`/`_other`) for product counts and reviews.
- **Tests**:
  - Unit (23): `money.spec.ts` (8), `catalog-api.spec.ts` (10),
    `ProductCard.spec.tsx` (5 — uses `@testing-library/react` +
    `MemoryRouter` + `I18nextProvider`).
  - E2E (4): `smoke.spec.ts` (Home renders RTL + nav routing),
    `catalog.spec.ts` (Home → category tile → filtered catalog → product
    detail, and badge-chip filter narrowing).

## Slice F2 — what shipped
- **Cart store** (`src/features/cart/store.ts`): Zustand + `persist` middleware,
  localStorage key `sufra:cart`. Lines `{ productId, qty, priceAtAdd }`. Actions
  `add/increment/decrement/setQty/remove/clear`, all stock-capped. Selectors
  `useCartItems`/`useCartItemCount`/`useCartLineCount`/`useCartSubtotal`.
- **Cart page** (`/cart`): item list with thumb/title/weight/line-price + qty
  stepper (− disabled at 1, + disabled at stock), display-only promo card,
  summary card (subtotal/delivery/membership discount), sticky charcoal
  "متابعة إلى الدفع" CTA. Empty-cart state with browse CTA.
- **Checkout feature** (`src/features/checkout/`):
  - `pricing.ts` — `computeTotals(items, { premium })` (flat 45 EGP delivery,
    25 EGP premium discount). Same math runs server-side in the backend phase.
  - `api.ts` — `createOrder` builds the `Order`, generates `SUF-YYYY-NNNNN`,
    derives `scheduledFor` from `{day, slot}`, persists to localStorage
    (`sufra:mock-orders`) for F3 tracking to read. `getOrder` reads back by ID.
  - `hooks.ts` — `useCreateOrder` (clears cart + caches the order), `useOrder`.
  - `demoCustomer.ts` — stub `أحمد المصري` + Maadi address until auth.
- **Checkout page** (`/checkout`): step indicator (3 bars, 2 filled), address
  card, schedule selector (today/tomorrow/day-after with live formatted dates,
  morning/afternoon/evening slots), payment selector (Vodafone Cash / card /
  cash) — all RHF-controlled with Zod resolver. Sticky red "تأكيد الطلب · {total}".
- **Order Confirmation** (`/checkout/success/:orderId`): olive-ring check,
  order ID, scheduled delivery, total, track + back-home CTAs.
- **Scroll-shadow polish**: `MobileShell` tracks scroll position and sets
  `data-scrolled` on its root. Global CSS targets `[data-sticky='top'|'bottom']`
  for the soft upward/downward shadow. F1's ProductDetail bottom bar and
  Catalog sticky header retrofitted.
- **BottomNav** badge now reads live from `useCartItemCount`.
- **Tests added**:
  - Unit: `cart-store` (9), `checkout-api` (9 — createOrder/Zod schema).
    Totals now: 41 unit (money 8 · catalog-api 10 · ProductCard 5 ·
    cart-store 9 · checkout-api 9).
  - E2E (now 6): `checkout.spec.ts` adds (1) full product→cart→checkout→
    confirmation flow and (2) empty-cart redirect from `/checkout`.

## Slice F3 — what shipped
- **Tracking feature** (`src/features/tracking/`):
  - `api.ts` — `getTrackingState(orderId, now)` reads the live order
    (from `sufra:mock-orders` or the demo fixtures), derives the live
    `status` from elapsed minutes since `createdAt`
    (new ≤5 / preparing ≤15 / shipping ≤50 / delivered after), builds
    the timeline, computes driver progress 0..1 along the path, and
    returns an ETA window. Pure helpers (`deriveStatusAt`,
    `buildTimeline`, `deriveDriverProgress`, `deriveEtaWindow`) are
    individually unit-tested. Backend phase replaces this with a
    Supabase Realtime channel on `driver_positions`.
  - `hooks.ts` — `useTrackingState` polls at 15 s (TanStack Query
    `refetchInterval`), matching the README spec.
  - `driver.ts` — stub `DEMO_DRIVER` ("محمد عبد الله", 4.9★).
- **Tracking page** (`/tracking/:orderId`):
  - Header with back · "متابعة الطلب" · LTR order ID · "تفاصيل" link.
  - `MapView` — `.map-ph` gradient (replaced by Mapbox in backend phase),
    SVG dashed red path, RTL-safe absolute-positioned origin (green
    dot), destination (charcoal pin), driver (truck in red-bordered
    white circle). Driver position interpolates along a 5-anchor
    quadratic-ish curve sampled from the API's `progress`. Driver
    marker hidden until the shipping stage starts.
  - `EtaCard` — charcoal bg, gold-bordered truck ring. Eyebrow + headline
    **both adapt** to state: "ARRIVING SOON" for new/preparing/shipping,
    swap to "DELIVERED"/"CANCELLED" for terminal states (avoids the
    "ARRIVING SOON · DELIVERED" contradiction). ETA time window hidden
    in terminal states.
  - `DriverCard` — initials avatar, name + 4.9★, chat (green) + call
    (charcoal, `tel:` link).
  - `Timeline` — 4-step vertical line, green/red-halo/gray dots, live
    timestamps for completed steps, "الآن" for current, `~ {{eta}}`
    placeholder for the still-pending delivered step.
- **Visual-QA fixtures**: `SUF-DEMO-SHIP` (25 min in → shipping with
  driver marker visible) and `SUF-DEMO-DONE` (90 min in → delivered).
  Generated on-demand by `getOrder`, not persisted to localStorage.
  Use these to spot-check states the live happy path can't reach
  immediately after checkout (which lands on `new` until 5 min elapse).
- **Tests added**:
  - Unit: `tracking-api.spec.ts` (14 — `deriveStatusAt` boundaries at
    5/15/50 min, timeline growth, driver progress interpolation, ETA
    window, full `getTrackingState` integration).
    Totals now: **55 unit** (money 8 · catalog-api 10 · ProductCard 5 ·
    cart-store 9 · checkout-api 9 · tracking-api 14).
  - E2E (now 8): `tracking.spec.ts` adds (1) full happy-path → tracking
    renders order ID, map, ETA card, timeline, driver and (2) not-found
    state for unknown order IDs.

## Slice F4 — what shipped
- **Account feature** (`src/features/account/`):
  - `api.ts` — `getCustomerProfile(customerId)` returns `{ customer, stats }`.
    Stats are derived live from `sufra:mock-orders` (orders count + active
    count where `status ∈ {new, preparing, shipping}`); loyalty points from
    the customer record; favorites count is a placeholder until a wishlist
    store lands. Backend phase: replaced by a Supabase query joining
    `customers` + a `customer_order_stats` view.
  - `hooks.ts` — `useCustomerProfile` (TanStack Query, keyed
    `['customer-profile']`).
  - `components/` — `AccountPage`, `AccountHero` (charcoal hero with
    hero-ph overlay + gold-gradient initials avatar + SUFRA PREMIUM pill),
    `StatsCard` (-34 px overlap, 3-column with `border-inline-end`
    dividers), `MenuList` (6 nav rows + sign-out), `AccountSectionPlaceholder`
    (per-section coming-soon screen for the 6 menu sub-routes).
- **`Customer.initials`** added to the domain model. Stored, not derived —
  Arabic names with definite articles (e.g. "أحمد المصري" → "أم") don't
  survive a generic first-letter algorithm. Backend stores it on the
  customers row.
- **Cache invalidation across the checkout/account boundary**: `useCreateOrder`
  now `invalidateQueries({ queryKey: ['customer-profile'] })` after writing
  the order. Without this, the stats card would show stale counts for up
  to 60 s after checkout. Covered by a dedicated E2E.
- **Sign-out**: no-op in the mock phase (warns in console). Real
  `supabase.auth.signOut()` lands in the backend phase.
- **Cleanup**: removed the now-unused `Placeholder` component (replaced
  per-feature: `CartPage` for `/cart`, real `TrackingPage` for `/tracking`,
  `AccountSectionPlaceholder` for `/account/:section`).
- **Tests added**:
  - Unit (3 new): `account-api.spec.ts` — filters by customerId, counts
    active vs terminal statuses, empty-store baseline. Totals now:
    **58 unit** (money 8 · catalog-api 10 · ProductCard 5 · cart-store 9 ·
    checkout-api 9 · tracking-api 14 · account-api 3).
  - E2E (now 12): `account.spec.ts` — (1) hero + stats + 6 menu rows
    + sign-out render, (2) menu-item routes to section placeholder + back
    returns to /account, (3) bottom nav reaches /account, (4) **order
    stats refresh on return after checkout** (regression guard for the
    cache bug).

## Slice F5 — what shipped
- **Admin chrome** (`src/features/admin/components/`):
  - `AdminShell` — wraps the page in `.sufra-admin` so the token overrides
    (charcoal sidebar, gold accents, ivory canvas, olive success, saffron
    warning, terracotta danger) actually apply; 264 px sidebar + sticky
    topbar + main grid.
  - `Sidebar` — SUFRA wordmark with gold `RA` accent + ADMIN gold pill,
    user block ("كريم منصور · مدير عام"), 3 nav sections (إدارة · التسويق
    · النظام) via NavLink. Active item shows gold text + tinted bg + 3 px
    gold accent bar via `::before` at `inset-inline-end: -12px`. RTL-safe.
  - `Topbar` — Playfair title + sub + 280 px search input + bell with gold
    dot + charcoal "إضافة سريعة" action button.
  - `StatCard`, `Panel` primitives shared across all admin screens.
- **Overview** (`src/features/admin/overview/`):
  - `api.ts` — `getKpis` (derived live from `MOCK_ORDERS`: sum / new count
    / AOV; new-customers + delta strings stubbed until we have a real
    comparison window), `getRevenueByDay`, `listRecentOrders`,
    `listTopProducts` (joined to products + categories), `getPeakHours`,
    `listCities`. Backend phase: replaced by Postgres views refreshed
    nightly via pg_cron, with Realtime where cheap (README spec).
  - `hooks.ts` — TanStack Query wrappers keyed under `['admin', ...]`.
  - `components/` — `OverviewPage`, `KpiRow` (4 stat cards), `RevenueChart`
    (Recharts BarChart with charcoal bars + dashed grid + gold tooltip on
    hover + 4-chip range selector), `RecentOrdersList` (status-dot
    activity items), `TopProductsTable` (thumb + category chip + raw-SVG
    gold sparkline per row), `PeakHoursPanel` (hour-bar intensity tones +
    peak callout), `CitiesPanel` (charcoal→gold progress gradient).
- **Lazy-loaded admin chunk**: `OverviewPage` + `AdminSectionPlaceholder`
  load on demand. Without this, recharts + d3-* ship to every customer
  route. Customer bundle stayed at **481 kB** (~152 kB gzip); admin pulls
  its own **385 kB** (~108 kB gzip) only when /admin is visited.
- **`Customer.initials` re-used pattern** — `DEMO_CUSTOMER.initials` and
  the new `DEMO_DRIVER.initials` (F3) both follow the "stored, not
  derived" rule from F4.
- **Icon set** extended with admin-side glyphs (`orders`, `home`, `inv`,
  `customers`, `campaigns`, `reports`, `settings`, `products`, `arrowR`,
  `arrowL`, `up`, `down`, `eye`, `edit`, `trash`, `alert`).
- **Tests added**:
  - Unit (10 new): `admin-overview-api.spec.ts` — `computeKpis` math
    (empty, totals, AOV), `getKpis` against live mock, `getRevenueByDay`
    point count + total, `listRecentOrders` limit + fidelity to source,
    `listTopProducts` row count + piastres conversion, `getPeakHours`
    peak detection, `listCities` pct-sums-to-100. Totals now:
    **68 unit** (… + admin-overview-api 10).
  - E2E (now 14): `admin-overview.spec.ts` — (1) shell + 6 panels render,
    (2) sidebar nav flips the **`aria-current="page"`** on the active
    NavLink (regression guard for the gold accent bar visual).

## Slice F6 — what shipped
- **Product store** (`src/lib/mock/product-store.ts`): Zustand+persist
  `Map<id, Product>` seeded from `MOCK_PRODUCTS`. **Single source of truth**
  for both customer Catalog (read) and admin Products CRUD (write) — admin
  edits surface immediately on the storefront. Backend phase: drops out;
  every read/write becomes a Supabase query.
- **Shared admin primitives** (`src/features/admin/components/`):
  - `PageHeader` — per-screen h1 + sub + right-side actions row.
  - `StatusChip` — typed (kind: 'order' | 'product') with full tone map.
  - `Drawer` — inline-end slide-in, 280 ms cubic-bezier(.2,.8,.2,.1),
    backdrop click + Esc to close, body scroll lock, role=dialog,
    focus-on-open.
  - `Pagination` — prev / numbers / next with first+last+window truncation.
  - **Topbar h1 demoted to `<div>`** — the topbar is chrome; the real `<h1>`
    lives in `PageHeader`. Overview keeps its h1 as an `sr-only` element.
- **Admin Orders** (`src/features/admin/orders/`):
  - `api.ts` — `mergeOrders()` (seed + live `sufra:mock-orders`, dedup by
    id, newest-first), `applyFilter()`, `listOrders(filter)` with
    pagination, `computeMiniStats()`.
  - `hooks.ts` — TanStack wrappers keyed under `['admin', 'orders', …]`.
  - Page: PageHeader + 5-card mini stats + OrdersToolbar (search + chips +
    count pill) + OrdersTable (avatar customer cell · payment emoji · status
    chip · view → /tracking/:id · edit stub) + Pagination.
  - **URL search params drive filters** (`?q=…&status=…&page=…`) per the
    kickoff spec.
- **Admin Products** (`src/features/admin/products/`):
  - `schemas.ts` — `ProductFormSchema` (Zod, coerces price/stock).
  - `api.ts` — `listAdminProducts(filter)`, `createProduct`, `updateProduct`,
    `deleteProduct`, `getProductsStats`, `getLowStockAlert`,
    `deriveStockLevel(stock)` (0 → out; 1–15 → low; >15 → active). Threshold
    becomes a `reorder_threshold` column on the backend.
  - `hooks.ts` — Mutations call `useProductMutationSideEffects()` which
    invalidates both admin and customer query keys, so the catalogue
    refetches automatically.
  - **Cart sync on delete** — `deleteProduct` also calls
    `useCartStore.getState().remove(id)` so a deleted product doesn't
    silently inflate a customer's subtotal. Covered by
    `admin-products-cart-sync.spec.ts`.
  - Page: LowStockBanner (yellow alert with first 3 product names) +
    ProductStatsRow + ProductsToolbar + ProductsTable (44 px thumb · ID ·
    weight · colored stock progress bar · view→/product/:id · edit→drawer
    · delete→confirm) + ProductFormDrawer (RHF + Zod) + DeleteConfirm.
- **Lazy-loaded admin chunks**: Orders → 9.7 kB · Products → 18 kB ·
  Overview → 385 kB (recharts). Customer chunk stayed at **488 kB**
  (~154 kB gzip) — no bloat from F6.
- **Tests added**:
  - Unit (29 new): `product-store` (5), `admin-orders-api` (10),
    `admin-products-api` (13), `admin-products-cart-sync` (2). Totals now:
    **97 unit** (… + product-store 5 + admin-orders-api 10 +
    admin-products-api 13 + admin-products-cart-sync 2 — net +29).
  - E2E (now 21, +7): admin-orders shell/filter/row-view (3),
    admin-products shell/filter/create-flow/edit-drawer (4).

## Hardening pass — priority 1-4 from the audit
A targeted audit between F6 and F7 surfaced four risk classes; all four
landed before F7 begins.

- **#1 — Global error recovery** (`src/components/ErrorBoundary/`):
  Custom class boundary with `override`-marked lifecycle, custom fallback
  callbacks, and reset support. Wired in `App.tsx` as **two nested
  boundaries**: an outer one above `<I18nextProvider>` renders a
  no-i18n `<BareFallback>` if i18n itself fails to init; an inner one
  under the provider renders the translated `<ErrorFallback>` for
  component-render errors. Per-widget callers can supply their own
  `fallback` prop (used by future admin chart slices).
- **#2 — Mutation error surfacing** (`src/components/FormError/`):
  Inline `<FormError>` strip + `try/catch` around all four `mutateAsync`
  call sites (Checkout, ProductFormDrawer create, ProductFormDrawer edit,
  DeleteConfirm). Errors render below the form with a fallback message
  pulled from `errors.*` i18n keys. The form stays mounted so the user
  can retry; previously a thrown mutation silently rejected the promise.
- **#3 — Validated localStorage** (`src/lib/storage.ts` +
  `src/types/storage-schemas.ts`): Generic `readJson<T>(key, schema, fallback)`
  helper that runs Zod's `safeParse` and **clears storage on shape
  mismatch** so subsequent reads short-circuit. Three persisted shapes
  covered: `sufra:mock-orders` (orders index), `sufra:cart` (Zustand
  cart, via persist `merge`), `sufra:products` (Zustand product store,
  via persist `merge`). Stale/garbage/devtools-pollution all degrade
  gracefully.
- **#4 — `paymentStatus` ternary fixed** (`features/checkout/api.ts`):
  Was `cash ? 'pending' : 'pending'` (constant). Now `cash → pending`
  (COD), `card | wallet → paid` (mock captures immediately). Backend
  phase will swap card/wallet back to `pending` until Stripe webhook —
  comment in code names that handoff.
- **Tests added**: storage helper (6), ErrorBoundary (4), storage
  validation round-trip (3), paymentStatus by method (1). Totals now:
  **111 unit** (+14 from F6).

## Known follow-ups
- **Promo input** is display-only — real promo logic + a `coupons` table land
  in a later slice once we have the admin to manage them.
- **Address picker / change**: `AddressCard` accepts an `onChange` but the
  Checkout page doesn't supply one (single demo address until F4 Account
  ships address management).
- **Back button fallback**: `navigate(-1)` on Catalog/ProductDetail/Cart/
  Checkout falls off the site if a user lands via a shared link. Will fix
  when we add deep-link entry analytics in F4/F5.
- **Static `HARVEST 2025` banner copy**: lifted verbatim from the prototype.
  No "current season" data source yet — becomes a tenant-configurable promo
  slot in F8 (multi-tenant theming).
- **Admin orders avatar initials** (`avatarOf` in `OrdersTable`): uses a
  generic first-letter algorithm and produces awkward initials for Arabic
  names with the definite article ("أحمد المصري" → "أم" is correct, but
  the algo can't get there). In the backend phase orders JOIN to customers
  and read `customers.initials` directly (the field landed in F4). Until
  the JOIN, accept the imperfection.
- **English `alert_title` plural lost** when fixing the Arabic plural-rule
  collision — now reads "1 products need restocking" for count=1. Re-add
  with ICU MessageFormat (`{{count, plural, one {…} other {…}}}`) when the
  banner copy stabilizes.
- **`Drawer` focus trap**: ships role=dialog, focus-on-open, Esc to close,
  body scroll lock. Tab can still escape into the topbar behind the
  backdrop — fix is one `inert` attribute or a small Tab/Shift+Tab loop.
  Accessibility polish, doesn't block CRUD.

## Visual fidelity — needs your eyes
E2E gates verify structure, routing, i18n strings, and data wiring — not
pixel fidelity. Before merging to a release branch, run `npm run dev` and
spot-check Home / Catalog / Product Detail against `design/customer-1.jsx`.
If anything looks off — spacing, font weight, hero gradient, sticky bar
proportions — file it; the tokens.css source-of-truth pattern means most
fixes are 1–3 lines.

## What is **not** here yet (deferred to later slices)
- Admin Campaign Analytics (F7 — replaces `/admin/campaigns`).
- Admin Customers / Inventory / Reports / Settings — these stay as
  placeholders unless explicitly promoted.
- Multi-tenant theming with theme_json injection (F8).
- Phone formatting (`+20 100 123 4567`) — still raw E.164.
- Real favorites store — `favoritesCount` is a placeholder.
- Real auth + sign-out — backend phase.
- Supabase, Stripe, Mapbox — backend phase.
