/**
 * Typed mock data — port of design/data.js.
 *
 * Money values in design/data.js are EGP; here they are converted to
 * piastres (the canonical unit) at module load. Category CSS gradient
 * classes (cat-olive, cat-tahini, …) are resolved to their hex pairs
 * straight from design/styles/app.css.
 *
 * Replaced by Supabase reads in the backend phase — keep the shape
 * stable so feature `api.ts` files don't need to change.
 */

import { toPiastres } from '@/lib/money';
import type {
  Campaign,
  Category,
  IsoDateTime,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  ProductBadge,
  Uuid,
} from '@/types/domain';

// Demo tenant. Matches the seeded merchant we'll insert in Slice 1 (backend).
export const DEMO_MERCHANT_ID: Uuid = '00000000-0000-4000-8000-000000000001';
export const DEMO_MERCHANT_SLUG = 'sufra';

// ── Categories ──────────────────────────────────────────────────────
// Gradient hexes mirror .cat-* classes in src/styles/sufra.css.
const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  olive:   ['#7a8a4d', '#4a5a2f'],
  tahini:  ['#e9d9b8', '#b8a06c'],
  spices:  ['#c25a2c', '#8a3b1a'],
  pickles: ['#9a8a6c', '#5a4a2c'],
  sweets:  ['#d4a8a0', '#9a4a4a'],
  bakery:  ['#dcc59a', '#9a7a4a'],
  grains:  ['#d8c4a0', '#8a6a3a'],
  coffee:  ['#6a4a32', '#2a1a14'],
};

const RAW_CATEGORIES: ReadonlyArray<{
  id: string;
  ar: string;
  en: string;
  glyph: string;
}> = [
  { id: 'olive',   ar: 'زيت وزيتون',    en: 'Olive Oils', glyph: '🫒' },
  { id: 'tahini',  ar: 'طحينة ودبس',    en: 'Tahini',     glyph: '🥣' },
  { id: 'spices',  ar: 'توابل وأعشاب',  en: 'Spices',     glyph: '🌶️' },
  { id: 'pickles', ar: 'مخللات',         en: 'Pickles',    glyph: '🥒' },
  { id: 'sweets',  ar: 'حلويات شامية',  en: 'Sweets',     glyph: '🍯' },
  { id: 'bakery',  ar: 'مخبوزات',        en: 'Bakery',     glyph: '🥖' },
  { id: 'grains',  ar: 'حبوب وبقول',    en: 'Grains',     glyph: '🌾' },
  { id: 'coffee',  ar: 'قهوة شامية',    en: 'Coffee',     glyph: '☕' },
];

export const MOCK_CATEGORIES: ReadonlyArray<Category> = RAW_CATEGORIES.map((c, i) => {
  const grad = CATEGORY_GRADIENTS[c.id] ?? ['#cccccc', '#888888'];
  return {
    id: c.id,
    merchantId: DEMO_MERCHANT_ID,
    nameAr: c.ar,
    nameEn: c.en,
    glyph: c.glyph,
    gradientA: grad[0],
    gradientB: grad[1],
    sort: i,
  };
});

// ── Products ────────────────────────────────────────────────────────
const BADGE_MAP: Record<string, ProductBadge> = {
  'الأكثر مبيعاً': 'bestseller',
  'يدوي': 'handmade',
  'موسم محدود': 'limited',
  'عضوي': 'organic',
  'جديد': 'new',
};

const RAW_PRODUCTS: ReadonlyArray<{
  id: string;
  ar: string;
  en: string;
  subtitle: string;
  cat: string;
  price: number;
  oldPrice?: number;
  weight: string;
  rating: number;
  reviews: number;
  badge?: string;
  stock: number;
  glyph: string;
}> = [
  { id: 'p1',  ar: 'زيت زيتون بكر ممتاز',  en: 'Extra Virgin Olive Oil', subtitle: 'سيوة · عصرة باردة',     cat: 'olive',   price: 285, oldPrice: 320, weight: '750 مل', rating: 4.9, reviews: 142, badge: 'الأكثر مبيعاً', stock: 28, glyph: '🫒' },
  { id: 'p2',  ar: 'طحينة بيضاء فاخرة',    en: 'Premium Tahini',         subtitle: 'الإسكندرية · سمسم محمص', cat: 'tahini',  price: 95,                  weight: '400 جم', rating: 4.8, reviews: 89,  badge: 'يدوي',        stock: 42, glyph: '🥣' },
  { id: 'p3',  ar: 'ثوم مخلل بالخل',        en: 'Pickled Garlic',         subtitle: 'الفيوم · حرفي',          cat: 'pickles', price: 75,                  weight: '500 جم', rating: 4.7, reviews: 56,  badge: 'موسم محدود',  stock: 18, glyph: '🧄' },
  { id: 'p4',  ar: 'زعتر بري مع سمسم',      en: 'Wild Thyme Blend',       subtitle: 'سيناء · حصاد 2025',     cat: 'spices',  price: 65,                  weight: '250 جم', rating: 4.9, reviews: 203,                       stock: 64, glyph: '🌿' },
  { id: 'p5',  ar: 'دبس رمان طبيعي',        en: 'Pomegranate Molasses',   subtitle: 'أسيوط · بدون سكر',       cat: 'tahini',  price: 115,                 weight: '500 مل', rating: 4.6, reviews: 41,  badge: 'عضوي',        stock: 31, glyph: '🍷' },
  { id: 'p6',  ar: 'مكدوس باذنجان',          en: 'Stuffed Eggplant',       subtitle: 'الإسكندرية · يدوي',     cat: 'pickles', price: 145,                 weight: '1 كجم',  rating: 4.8, reviews: 67,                        stock: 12, glyph: '🍆' },
  { id: 'p7',  ar: 'بهارات سبع نجوم',        en: 'Seven Spice Blend',      subtitle: 'وصفة العائلة',           cat: 'spices',  price: 48,                  weight: '150 جم', rating: 4.7, reviews: 92,                        stock: 88, glyph: '✨' },
  { id: 'p8',  ar: 'معمول بالفستق',          en: 'Pistachio Maamoul',      subtitle: 'مخبوز يومياً',           cat: 'sweets',  price: 220,                 weight: '500 جم', rating: 4.9, reviews: 178, badge: 'جديد',        stock: 24, glyph: '🍯' },
  { id: 'p9',  ar: 'قهوة عربية بالهال',      en: 'Cardamom Coffee',        subtitle: 'تحميص متوسط',            cat: 'coffee',  price: 135,                 weight: '250 جم', rating: 4.8, reviews: 64,                        stock: 39, glyph: '☕' },
  { id: 'p10', ar: 'برغل خشن أصلي',          en: 'Coarse Bulgur',          subtitle: 'سوهاج',                  cat: 'grains',  price: 55,                  weight: '1 كجم',  rating: 4.6, reviews: 33,                        stock: 71, glyph: '🌾' },
  { id: 'p11', ar: 'كعك بالسمسم',            en: 'Sesame Kaak',            subtitle: 'خبز يومي',               cat: 'bakery',  price: 38,                  weight: '300 جم', rating: 4.7, reviews: 27,                        stock: 9,  glyph: '🥯' },
  { id: 'p12', ar: 'زيتون أخضر بالليمون',    en: 'Lemon Green Olives',     subtitle: 'مرسى مطروح',             cat: 'olive',   price: 85,                  weight: '500 جم', rating: 4.5, reviews: 48,                        stock: 0,  glyph: '🫒' },
];

export const MOCK_PRODUCTS: ReadonlyArray<Product> = RAW_PRODUCTS.map((p) => {
  const badge = p.badge ? BADGE_MAP[p.badge] : undefined;
  return {
    id: p.id,
    merchantId: DEMO_MERCHANT_ID,
    categoryId: p.cat,
    nameAr: p.ar,
    nameEn: p.en,
    subtitle: p.subtitle,
    price: toPiastres(p.price),
    ...(p.oldPrice !== undefined ? { oldPrice: toPiastres(p.oldPrice) } : {}),
    weight: p.weight,
    rating: p.rating,
    reviewCount: p.reviews,
    ...(badge ? { badge } : {}),
    stock: p.stock,
    images: [],
    glyph: p.glyph,
  };
});

// ── Orders ──────────────────────────────────────────────────────────
const RAW_ORDERS: ReadonlyArray<{
  id: string;
  customer: string;
  city: string;
  items: number;
  total: number;
  status: OrderStatus;
  payment: PaymentMethod;
  date: string; // "YYYY-MM-DD HH:mm"
}> = [
  { id: 'SUF-2026-04891', customer: 'أحمد المصري',  city: 'القاهرة · المعادي',     items: 4, total: 1245, status: 'preparing', payment: 'cash',   date: '2026-05-16 14:20' },
  { id: 'SUF-2026-04890', customer: 'منى عبد الله', city: 'الجيزة · الشيخ زايد',    items: 7, total: 2380, status: 'shipping',  payment: 'card',   date: '2026-05-16 14:06' },
  { id: 'SUF-2026-04889', customer: 'يوسف حسن',     city: 'القاهرة · مدينة نصر',    items: 2, total: 530,  status: 'delivered', payment: 'wallet', date: '2026-05-16 13:12' },
  { id: 'SUF-2026-04888', customer: 'سارة كمال',    city: 'الإسكندرية · سموحة',     items: 5, total: 1820, status: 'new',       payment: 'wallet', date: '2026-05-16 12:30' },
  { id: 'SUF-2026-04887', customer: 'كريم فؤاد',    city: 'القاهرة · التجمع الخامس',items: 3, total: 985,  status: 'delivered', payment: 'card',   date: '2026-05-16 11:45' },
  { id: 'SUF-2026-04886', customer: 'هدى نبيل',     city: 'القاهرة · مصر الجديدة',  items: 6, total: 1640, status: 'cancelled', payment: 'cash',   date: '2026-05-16 10:18' },
  { id: 'SUF-2026-04885', customer: 'محمد رضا',     city: '6 أكتوبر · الحصري',     items: 8, total: 2950, status: 'preparing', payment: 'card',   date: '2026-05-16 09:35' },
  { id: 'SUF-2026-04884', customer: 'ليلى السيد',   city: 'القاهرة · الزمالك',     items: 2, total: 680,  status: 'delivered', payment: 'wallet', date: '2026-05-15 18:50' },
];

const isoFromDateString = (s: string): IsoDateTime =>
  new Date(s.replace(' ', 'T') + ':00+02:00').toISOString();

// Deterministic UUIDv4-shaped synthetic IDs (mock-only — Supabase will issue real ones).
const synthUuid = (seed: number): Uuid => {
  const hex = seed.toString(16).padStart(12, '0');
  return `00000000-0000-4000-8000-${hex}`;
};

const customerIdByName = new Map<string, Uuid>();
RAW_ORDERS.forEach((o, i) => {
  if (!customerIdByName.has(o.customer)) {
    customerIdByName.set(o.customer, synthUuid(i + 100));
  }
});

export const MOCK_ORDERS: ReadonlyArray<Order> = RAW_ORDERS.map((o) => {
  const createdAt = isoFromDateString(o.date);
  return {
    id: o.id,
    merchantId: DEMO_MERCHANT_ID,
    customerId: customerIdByName.get(o.customer) as Uuid,
    customerName: o.customer,
    city: o.city,
    items: [],                                    // line items not modeled in the mock summary
    itemCount: o.items,
    subtotal: toPiastres(o.total),
    deliveryFee: 0,
    discount: 0,
    total: toPiastres(o.total),
    status: o.status,
    paymentMethod: o.payment,
    paymentStatus: o.status === 'delivered' ? 'paid' : 'pending',
    createdAt,
    timeline: [{ status: 'new', at: createdAt }],
  };
});

// ── Admin analytics seeds ───────────────────────────────────────────
export const MOCK_REVENUE_BY_DAY: ReadonlyArray<{ day: string; value: number }> = [
  { day: 'سبت',    value: 42500 },
  { day: 'أحد',    value: 38900 },
  { day: 'اثنين',  value: 51200 },
  { day: 'ثلاثاء', value: 47800 },
  { day: 'أربعاء', value: 62400 },
  { day: 'خميس',   value: 58100 },
  { day: 'جمعة',   value: 73600 },
];

export const MOCK_PEAK_HOURS: ReadonlyArray<{ h: string; v: number }> = [
  { h: '08', v: 12 }, { h: '10', v: 28 }, { h: '12', v: 48 }, { h: '14', v: 62 },
  { h: '16', v: 41 }, { h: '18', v: 71 }, { h: '20', v: 89 }, { h: '22', v: 54 },
];

export const MOCK_TOP_PRODUCTS: ReadonlyArray<{
  productId: Product['id'];
  sold: number;
  revenue: number; // EGP units for chart display; convert at the UI edge.
}> = [
  { productId: 'p1', sold: 412, revenue: 117420 },
  { productId: 'p4', sold: 358, revenue: 23270 },
  { productId: 'p2', sold: 287, revenue: 27265 },
  { productId: 'p8', sold: 196, revenue: 43120 },
  { productId: 'p7', sold: 178, revenue: 8544 },
];

export const MOCK_CITIES: ReadonlyArray<{ name: string; orders: number; pct: number }> = [
  { name: 'القاهرة',     orders: 1842, pct: 48 },
  { name: 'الجيزة',      orders: 924,  pct: 24 },
  { name: '6 أكتوبر',    orders: 412,  pct: 11 },
  { name: 'الإسكندرية',  orders: 386,  pct: 10 },
  { name: 'الشيخ زايد',  orders: 268,  pct:  7 },
];

const RAW_CAMPAIGNS: ReadonlyArray<{
  id: string;
  name: string;
  channel: Campaign['channel'];
  spend: number;
  revenue: number;
  roas: number;
  ctr: number;
  conv: number;
  status: Campaign['status'];
}> = [
  { id: 'c1', name: 'حملة رمضان · بريميم', channel: 'Instagram', spend: 12400, revenue: 84200, roas: 6.79, ctr: 3.2, conv: 142, status: 'active' },
  { id: 'c2', name: 'الزيتون الجديد',       channel: 'Facebook',  spend:  8600, revenue: 41800, roas: 4.86, ctr: 2.1, conv:  89, status: 'active' },
  { id: 'c3', name: 'باقة المعمول',         channel: 'TikTok',    spend:  5200, revenue: 31500, roas: 6.06, ctr: 4.8, conv:  74, status: 'active' },
  { id: 'c4', name: 'إعادة استهداف · سلة',  channel: 'Google',    spend:  3800, revenue: 22100, roas: 5.82, ctr: 1.9, conv:  48, status: 'active' },
  { id: 'c5', name: 'حملة التوابل',         channel: 'Instagram', spend:  4100, revenue: 12300, roas: 3.00, ctr: 2.4, conv:  28, status: 'paused' },
  { id: 'c6', name: 'البرغل الحوراني',      channel: 'Facebook',  spend:  2200, revenue:  4500, roas: 2.05, ctr: 1.2, conv:  12, status: 'review' },
];

export const MOCK_CAMPAIGNS: ReadonlyArray<Campaign> = RAW_CAMPAIGNS.map((c) => ({
  id: c.id,
  merchantId: DEMO_MERCHANT_ID,
  name: c.name,
  channel: c.channel,
  spend: toPiastres(c.spend),
  revenue: toPiastres(c.revenue),
  conversions: c.conv,
  ctr: c.ctr,
  roas: c.roas,
  status: c.status,
}));

// ── Single demo merchant (mirrors the row we'll seed in Postgres) ──
export const MOCK_MERCHANT = {
  id: DEMO_MERCHANT_ID,
  slug: DEMO_MERCHANT_SLUG,
  name: 'Sufra',
  themeJson: {},
  createdAt: '2026-01-01T00:00:00Z',
} as const;
