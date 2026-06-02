# Handoff: Sufra — Levantine Premium Food E-Commerce SaaS

## Overview
**Sufra (سفرة)** is a premium e-commerce platform for Levantine/Syrian food products
(olive oils, tahini, pickles, sweets, spices, etc.). The MVP scope covers four roles:

1. **Display** — premium storefront browsing
2. **Buy / Sell** — cart, checkout, scheduled delivery
3. **Track** — live order tracking with map and timeline
4. **Analyze** — admin dashboard with sales / inventory / campaign analytics

The product is designed from day one as a **multi-tenant SaaS template** — every
visual constant lives in a CSS token, so a new merchant can re-skin the storefront
without touching component code.

**Primary market:** Egypt (EGP) with multi-currency readiness.
**Primary language:** Arabic (RTL) with English secondary (wordmarks + eyebrows).
**Devices:** Mobile-first for customers, desktop-first for admin.

---

## About the Design Files

The files in `design/` are **design references created in HTML/React**.
They are prototypes showing the intended look, structure, and behavior —
**not production code to copy verbatim.**

Your task is to **recreate these designs in the target codebase using its
established patterns and libraries**. If no codebase exists yet, choose an
appropriate framework — recommendations below.

The HTML prototype uses inline-JSX + Babel to keep the design self-contained
and editable in the browser. Production should use a proper build system.

### Recommended production stack (if starting fresh)

- **Customer storefront:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
  + RTL support via `tailwindcss-rtl` or logical properties
  + Mobile PWA via `next-pwa`
- **Admin dashboard:** Same Next.js app under `/admin` OR separate React-Vite
  app — either way share the design tokens
- **Backend:** PostgreSQL + Prisma + tRPC (or REST), Auth via Clerk/Auth.js
- **Payments:** Stripe + Fawry (Egypt) + InstaPay/Vodafone Cash integration
- **Maps for tracking:** Mapbox GL or Google Maps Platform
- **Charts:** Recharts or Tremor
- **i18n:** `next-intl` (Arabic + English)
- **Hosting:** Vercel + Supabase / Neon

---

## Fidelity

**High-fidelity (hifi).** Pixel-perfect mockups with final colors, typography,
spacing, and interactions. The developer should recreate the UI pixel-perfectly,
preserving the premium Levantine aesthetic.

Product images in the prototype are **gradient + emoji placeholders**, since real
product photography is not yet available. In production these become real photos —
the layouts, aspect ratios, and treatments must stay identical.

---

## Screens

### 🛒 Customer Storefront — Mobile (390–402px)

#### 1 · Home (Storefront)
**Purpose:** Hero landing showcasing the brand, categories, featured products.
**Layout (top → bottom):**
- Header strip: location pin ("توصيل إلى المعادي، القاهرة") + bell icon (with red dot)
- Hero card (220px tall, 18px radius, charcoal `#1A1614` bg with subtle radial highlights):
  - Eyebrow "HERITAGE · مصنوع بيدوياً" in gold
  - Title "نكهات الشام" + serif italic gold subtitle "—— to your door"
  - CTA pill: white bg, charcoal text, "اكتشف المجموعة"
- Search input (placeholder only): `bg-0`, 12px radius, search icon
- Categories section: eyebrow "CATEGORIES" + title "تسوق بالفئة" + "عرض الكل" link
- Horizontal scroll of 6 categories, each 84×84 gradient tile with emoji + ar label + count
- Featured grid (2 columns, 12px gap, 4 products)
- Heritage banner: ivory-2 bg, large faded emoji top-right, serif italic pull-quote
- Bottom nav (sticky): 4 tabs (home / categories / cart with badge / account)

#### 2 · Catalog
**Purpose:** Browse a single category with filter chips and product grid.
**Layout:**
- Sticky header: back button + eyebrow "CATEGORY" + title + search icon
- Sub-banner: 88px tall olive→dark-olive gradient with large emoji, "HARVEST 2025" eyebrow
- Horizontal scrollable filter chips ("الكل · يدوي · عضوي · موسم محدود · الأكثر مبيعاً")
- Count + sort dropdown row
- 2-column product grid with the full 12-product list (includes a sold-out card)

#### 3 · Product Detail
**Purpose:** Single product with variants, description tabs, sticky add-to-cart.
**Layout:**
- 380px image hero (gradient + glyph) with floating back/share/heart buttons (rgba(255,255,255,0.92) + backdrop-blur)
- Indicator dots bottom-center
- Body card with `border-radius: 24px 24px 0 0`, overlapping hero by -20px
- Eyebrow + title (22px, 800) + rating row (stars + reviews + stock)
- Size selector (4 segmented buttons, selected = charcoal bg, white text)
- Tab bar (الوصف / المكونات / القيمة الغذائية) with red underline on active
- 3 quick badge tiles (organic / artisan / cold-delivery)
- **Sticky bottom bar:** weight + price (large, charcoal) + strike-through old price + full-width charcoal "أضف إلى السلة" button (14px padding, 12px radius, with bag icon)

#### 4 · Cart
**Purpose:** Review items, edit quantities, apply promo, see total.
**Layout:**
- Header: back + "سلة المشتريات" + items count + "إفراغ" link
- Item cards: 72×72 thumb, eyebrow + title + weight + price + quantity stepper (− and +)
- Quantity stepper: outline pill, `−` icon button has soft bg, `+` icon button is charcoal-filled
- Dashed-border promo input row with ticket emoji
- Summary card: subtotal / delivery / membership discount (green) → divider → total (20px, 900 weight)
- Sticky "متابعة إلى الدفع" button (charcoal)

#### 5 · Checkout
**Purpose:** Address + scheduled delivery + payment.
**Layout:**
- Step indicator (3 segments, 2 filled)
- Address card: red-soft pin icon + name "المنزل · المعادي" + multiline address + phone (LTR)
- Schedule card: 3 day-buttons (today / tomorrow / Saturday) with active state on tomorrow, then 3 time-slot buttons (morning / afternoon / evening) active on afternoon
- Payment card: 3 radio rows (Vodafone Cash with masked number / Add card / Cash on delivery), selected has charcoal border + ivory bg + filled circle with check
- Sticky red CTA "تأكيد الطلب · 945 ج.م"

#### 6 · Order Tracking
**Purpose:** Live tracking of an in-flight delivery.
**Layout:**
- Header: back + "متابعة الطلب" + order ID `SUF-2026-04891` + "تفاصيل" link
- 220px map with dashed red path (SVG), driver marker (truck icon in red-bordered white circle), destination pin (charcoal), origin dot (green)
- Charcoal ETA card: gold truck icon in gold-bordered circle + "ARRIVING SOON" eyebrow + "طلبك في الطريق" + ETA time
- Driver card: initials avatar + name + 4.9★ rating + chat button (green) + call button (charcoal)
- Timeline card: 4 steps with vertical line, dots (green=done, red=current with red-soft halo, gray=pending) + timestamps

#### 7 · Account
**Purpose:** Profile hub with stats, menu links, sign out.
**Layout:**
- Hero: charcoal bg with subtle dotted overlay, gold eyebrow "ACCOUNT"
- 64px avatar with gold gradient + name + phone + "SUFRA PREMIUM" gold pill
- Stats card overlapping hero by -34px: 3 stats (orders / favorites / loyalty points) separated by vertical dividers
- Menu list (single card): 6 rows each with emoji icon tile (36×36, ivory bg, 10px radius) + title + meta + optional badge ("جديد") + chevron
- Standalone sign-out card with red icon

---

### 🖥️ Admin Dashboard — Desktop (1280×820)

> All admin screens use the `.sufra-admin` CSS scope which overrides the base
> tokens with the Sufra identity (charcoal + gold + olive + ivory). The original
> Homify red tokens (`--red`) are remapped to charcoal (`#1A1614`) so any inline
> styles referencing `var(--red)` cascade correctly.

#### 1 · Overview
**Layout (left → right, top → bottom):**
- **Sidebar (264px wide, charcoal `#1A1614` bg):**
  - Logo block (top): brand mark + "SUFRA" wordmark with "RA" in gold + "ADMIN" gold badge
  - User block: gold-gradient avatar + name + role
  - Nav sections: "إدارة" (5 items) + "التسويق" (2 items) + "النظام" (1 item)
  - Active item: gold text + gold-tinted bg + 3px gold accent bar on the right edge
  - Sign-out at bottom
- **Topbar (64px):** page title (Playfair) + sub + search input + bell with gold dot + charcoal "إضافة سريعة" button
- **KPI row (4 cards):**
  1. مبيعات اليوم — 124,580 ج.م — +18.2%
  2. طلبات جديدة — 47 — +12 منذ الصباح
  3. متوسط قيمة الطلب — 385 ج.م — +2.4%
  4. عملاء جدد — 23 — −4.1% (down delta)
- **Two-column grid:**
  - Left (2fr): weekly revenue bar chart with dashed grid lines, charcoal bars, gold hover tooltip, time-range chips
  - Right (1fr): recent orders activity list with status dots (green/orange/blue/charcoal)
- **Bottom two-column grid:**
  - Left: top-selling products table (5 rows) with thumbnail, category chip, units, revenue, mini sparkline
  - Right (stacked): peak hours bar chart (charcoal/saffron/gray bars by intensity) + cities progress bars

#### 2 · Orders Management
**Layout:**
- Page header with h1 + sub + "تصدير CSV" + "+ طلب يدوي" buttons
- 5-column mini-stats row (total / new / preparing / shipping / completed)
- Toolbar: search input + filter chips (الكل / جديد / قيد التحضير / في الطريق / مكتمل / ملغي) + count pill
- Data table with columns: order ID, customer (with avatar circle), city, items, total, payment method (emoji + label), status chip, time, row actions (view / edit)
- Pagination: ← + page numbers + 612 + →

#### 3 · Products Management
**Layout:**
- Page header + "استيراد Excel" + "+ منتج جديد"
- Yellow alert banner: "3 منتجات تحتاج إعادة تخزين"
- 4 stat cards: total / active / low-stock / out-of-stock
- Toolbar with filter chips
- Data table: product (44px thumb + title + ID + weight) / category chip / price / stock (number + colored progress bar) / sold / rating (★ + value) / status chip / actions (view / edit / delete)

#### 4 · Campaign Analytics
**Layout:**
- Page header + "آخر 30 يوم" + "+ حملة جديدة"
- 4 KPI cards: total spend / total revenue / ROAS / CPA
- Two-column:
  - Channels grid (2×2 of Instagram / Facebook / TikTok / Google cards), each with a top accent bar in the channel's brand gradient + 4 metric blocks (spend / revenue / conversions / CTR) + ROAS pill
  - Funnel visualization (6 horizontal bars from impressions → purchase, fading blue → red)
- Active campaigns table with columns including ROAS color-coded (green ≥4x, orange ≥2.5x, red below)

---

## Interactions & Behavior

### Customer
- **Bottom nav** persistent on Home, Catalog, Cart, Account screens
- **Category tile** → Catalog screen filtered to that category
- **Product card** → Product Detail
- **Quantity stepper** in cart: `−` disabled at 1, `+` disabled at stock limit
- **Schedule** in checkout: clicking a day filters the time slots accordingly
- **Payment options** behave as radio group — only one selected at a time
- **Map** on tracking screen: in production poll driver location every 15s
- **Heart icon** on product card → optimistic add/remove from favorites

### Admin
- **Sidebar** nav items navigate between screens; active state is persisted
- **Tables**: row click → drawer or detail page; per-row actions (view / edit / delete) on hover
- **Filter chips**: client-side filtering for already-loaded rows, server-side query for paginated lists
- **KPI cards**: hover lifts the card 2px and reveals a 3px gold→charcoal accent bar at the bottom
- **Charts**: bars get a gold tooltip on hover showing exact value

### Animations
- **Transitions:** `150ms cubic-bezier(0.4, 0, 0.2, 1)` for hover/focus
- **Sticky bars** (checkout, product detail): no shadow at rest, soft shadow on scroll
- **Drawer**: 280ms slide-in from right with `cubic-bezier(.2,.8,.2,1)`

---

## State Management

| State | Where | Notes |
|---|---|---|
| `cart` | global (zustand / Redux Toolkit) | persisted to localStorage |
| `favorites` | global | persisted to user account in DB |
| `addresses[]` | user profile | server source of truth |
| `selectedAddressId` | global | defaults to last-used |
| `theme` (light/dark) | localStorage + DB pref | applied via `<body class="theme-dark">` |
| `font` family | localStorage + DB pref | applied via `<body class="font-cairo \| font-tajawal \| font-readex \| font-ibm">` |
| `density` | localStorage + DB pref | applied via `<body class="density-default \| density-comfortable \| density-compact">` |
| Order tracking position | polling endpoint every 15s while order is `shipping` | use SSE or websockets if scaling |
| Admin filters (status / query / pagination) | URL search params | so refresh preserves state |

---

## Design Tokens

All tokens live in `design/styles/tokens.css` and are overridden for the admin
in `design/styles/admin-sufra.css`. **Copy these tokens to a single source of
truth in your codebase** (e.g. `tailwind.config.ts` + a `tokens.css`).

### Colors — Customer storefront

| Token | Value | Use |
|---|---|---|
| `--charcoal` | `#1A1614` | Hero bgs, primary action buttons, headings |
| `--charcoal-2` | `#2A211D` | Hover state on charcoal |
| `--ivory` | `#F8F3EA` | Surface canvas |
| `--ivory-2` | `#F1E9DA` | Section bgs |
| `--gold` | `#C9A45C` | Premium accent, dark-bg highlights |
| `--saffron` | `#B8731A` | Warm accent, star ratings |
| `--olive` | `#4A5A2F` | Secondary brand (category banners) |
| `--red` | `#C8102E` | Brand red — used **only** for: notification dots, "تأكيد الطلب" CTA, badges |
| `--green` | `#059669` | Success states, discount text |

### Colors — Admin (override via `.sufra-admin`)

| Token | Value | Use |
|---|---|---|
| `--red` (remapped) | `#1A1614` | Primary admin action color |
| Sidebar bg | `#1A1614` | Premium dark sidebar |
| Sidebar accent | `#C9A45C` (gold) | Active nav, badges |
| Canvas bg | `#F4EFE6` | Warm ivory page bg |
| Border | `#E4DCC8` | Hairline dividers |
| Success | `#5A7A2F` (olive) | Success chips |
| Warning | `#B8731A` (saffron) | Warning chips |
| Info | `#4A6580` | Info chips |
| Danger | `#8A3B1A` (terracotta) | Destructive |

### Typography

| Token | Family | Use |
|---|---|---|
| `--font-arabic` | Cairo (default), Tajawal / Readex Pro / IBM Plex Sans Arabic (tweakable) | All Arabic body and UI |
| `--font-display` | Playfair Display | Wordmark, eyebrows, h1, section titles in admin |
| `--font-numbers` | Inter | All LTR numerals, currency, IDs |

**Scale:** `--text-xs: 11px`, `--text-sm: 12px`, `--text-base: 13px`,
`--text-md: 14px`, `--text-lg: 16px`, `--text-xl: 18px`, `--text-2xl: 24px`,
`--text-3xl: 28px`. Mobile body never goes below 12px.

### Spacing — 8pt grid
`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 px` (tokens `--space-1` to `--space-12`)

### Border radius
`6 · 8 · 12 · 14 · 16 · 20 · 24 · 9999 px`

### Shadows
`--shadow-xs` to `--shadow-xl` — neutral, no color tint.
Premium charcoal hover on KPI cards: `0 4px 14px rgba(26,22,20,0.18)`.

### Transitions
`--transition-fast: 150ms`, `--transition-normal: 200ms`, `--transition-slow: 300ms`,
all with `cubic-bezier(0.4, 0, 0.2, 1)`.

---

## Domain Model

```ts
// Minimum entities to ship the MVP

type Product = {
  id: string;
  name: { ar: string; en: string };
  subtitle: string;           // origin / heritage tag
  categoryId: string;
  price: number;              // EGP minor units in DB
  oldPrice?: number;
  weight: string;              // display string ("750 مل")
  rating: number;
  reviewCount: number;
  badge?: 'bestseller' | 'handmade' | 'limited' | 'organic' | 'new';
  stock: number;
  images: string[];
};

type Category = {
  id: string;
  name: { ar: string; en: string };
  glyph: string;               // emoji or icon key
  gradient: [string, string];  // ph-a, ph-b
  count: number;               // computed
};

type Order = {
  id: string;                  // "SUF-2026-04891"
  customerId: string;
  items: { productId: string; qty: number; priceAtTime: number }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'new' | 'preparing' | 'shipping' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  deliveryAddress: Address;
  scheduledFor: ISODateTime;
  createdAt: ISODateTime;
  timeline: { status: Order['status']; at: ISODateTime }[];
};

type Customer = {
  id: string;
  phone: string;               // primary identifier
  name: string;
  email?: string;
  addresses: Address[];
  loyaltyPoints: number;
  tier: 'standard' | 'premium';
};

type Campaign = {
  id: string;
  name: string;
  channel: 'Instagram' | 'Facebook' | 'TikTok' | 'Google';
  spend: number;
  revenue: number;
  conversions: number;
  ctr: number;                 // 0–100
  status: 'active' | 'paused' | 'review';
};
```

---

## RTL & Internationalization

- All layouts use **logical properties** (`inline-start`, `inline-end`, `padding-inline`, `margin-inline`) — never `left`/`right` directly.
- Icons that have directional meaning (arrows, chevrons) flip in RTL by either using `transform: scaleX(-1)` or providing a mirrored asset.
- Numerals always render LTR — wrap currency strings in `<span dir="ltr">…</span>` or use the `font-variant-numeric: tabular-nums` class (`.num` in the prototype).
- Use Tailwind's `rtl:` / `ltr:` variants or `@dir` queries.

---

## Multi-tenancy (SaaS readiness)

The Tweaks panel in the prototype previews what a tenant configuration should
control. In production, store these on the `Merchant` record and inject as CSS
variables at the root:

| Setting | Token affected |
|---|---|
| Theme (light/dark) | All `--bg-*`, `--text-*`, `--border` |
| Font | `--font-arabic` |
| Density | `--dens` (multiplier for `--space-*`) |
| Primary color | `--red` (used as accent — keep gold/olive constant for the Sufra demo, but expose for white-label tenants) |

---

## Assets

- **No real product imagery yet.** Every product/category tile in the prototype
  uses a CSS gradient (per-category `--ph-a` / `--ph-b`) + an emoji glyph.
  In production, replace the `<ProductPh>` component with an `<Image>` component
  pointing at real photography, keeping the same aspect ratios and rounded corners.
- **Icons:** All UI icons are inline SVG (Lucide-style strokes, 1.75px weight).
  In production import from `lucide-react` for consistency.
- **Fonts:** Loaded from Google Fonts in the prototype — in production,
  self-host with `next/font/google` for performance.

---

## Files

```
design/
├── Sufra E-Shop.html          ← entry; loads the React app
├── app.jsx                     ← main app + tweaks wiring + design canvas
├── customer-1.jsx              ← Storefront, Catalog, Product Detail + shared mobile UI
├── customer-2.jsx              ← Cart, Checkout, Tracking, Account
├── admin.jsx                   ← Sidebar, Topbar, 4 admin screens, AdminShell
├── data.js                     ← Product / order / campaign mock data
├── design-canvas.jsx           ← (scaffolding only — not for production)
├── ios-frame.jsx               ← (scaffolding only — iOS device frame)
├── tweaks-panel.jsx            ← (scaffolding only — design tweaks panel)
└── styles/
    ├── tokens.css              ← Base design tokens (colors, type, spacing, radii, shadows)
    ├── admin.css               ← Admin shell layout primitives (grid, sidebar, panel, table)
    ├── admin-sufra.css         ← Sufra-specific admin color identity overrides
    └── app.css                 ← Customer-side utilities + placeholder treatments + dark theme
```

**Ignore for production:** `design-canvas.jsx`, `ios-frame.jsx`, `tweaks-panel.jsx`,
and the design-canvas wrapper logic in `app.jsx`. These exist purely to display
the screens side-by-side in the design tool.

**Mine for production:** `tokens.css` (verbatim → your token system),
`customer-*.jsx` (componentization reference), `admin.jsx` (componentization
reference), `data.js` (seed data shape).

---

## Suggested Implementation Order

1. **Tokens + base layout** — port `tokens.css` to Tailwind config or a CSS-vars file. Set up RTL.
2. **Auth + Customer signup** — phone-based OTP (Egypt market norm).
3. **Catalog + Product Detail** — listing, filtering, single product. Pure read paths.
4. **Cart + Checkout** — local cart state, address/schedule selection, order creation.
5. **Payment integration** — Stripe (cards) + Fawry + InstaPay/Vodafone Cash gateway.
6. **Order Tracking** — driver location polling + timeline rendering.
7. **Admin: Orders + Products** — CRUD tables, inventory alerts.
8. **Admin: Overview analytics** — aggregations cached daily.
9. **Admin: Campaign analytics** — UTM ingestion + ad-spend integration (FB/IG/TikTok/Google APIs).
10. **Multi-tenant theming** — per-merchant config exposed via CSS vars.

---

## Open Questions for the Product Team

These were intentionally left out of the MVP but will need answers soon:

- **Reviews & ratings:** the UI displays `rating` and `reviewCount` — do we accept review writes from customers? If so, with photo upload?
- **Refunds / returns flow:** not designed yet. Likely needs an admin "refund" action on the order detail.
- **Inventory replenishment:** when admin clicks the "3 منتجات تحتاج إعادة تخزين" alert, what does the workflow look like? Auto-PO to supplier? Manual stock entry?
- **Driver app:** scoped out for now. The tracking screen assumes a backend service is providing driver coords — that service does not exist yet.
- **Multi-merchant marketplace vs. single-tenant:** the SaaS readiness assumes single-tenant-per-merchant. If you want a marketplace (multi-merchant in one storefront), the catalog needs a `merchantId` and the cart needs to support multi-merchant orders.
