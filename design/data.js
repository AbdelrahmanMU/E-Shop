// Sufra — Shared data for product catalog, orders, analytics.
// Levantine premium food SaaS template.

window.SUFRA_DATA = (function () {
  const categories = [
    { id: 'olive',   ar: 'زيت وزيتون',  en: 'Olive Oils',  glyph: '🫒', cls: 'cat-olive',   count: 24 },
    { id: 'tahini',  ar: 'طحينة ودبس',  en: 'Tahini',      glyph: '🥣', cls: 'cat-tahini',  count: 18 },
    { id: 'spices',  ar: 'توابل وأعشاب',en: 'Spices',      glyph: '🌶️', cls: 'cat-spices',  count: 32 },
    { id: 'pickles', ar: 'مخللات',      en: 'Pickles',     glyph: '🥒', cls: 'cat-pickles', count: 16 },
    { id: 'sweets',  ar: 'حلويات شامية',en: 'Sweets',      glyph: '🍯', cls: 'cat-sweets',  count: 22 },
    { id: 'bakery',  ar: 'مخبوزات',     en: 'Bakery',      glyph: '🥖', cls: 'cat-bakery',  count: 14 },
    { id: 'grains',  ar: 'حبوب وبقول',  en: 'Grains',      glyph: '🌾', cls: 'cat-grains',  count: 19 },
    { id: 'coffee',  ar: 'قهوة شامية',  en: 'Coffee',      glyph: '☕', cls: 'cat-coffee',  count: 11 },
  ];

  const products = [
    { id: 'p1',  ar: 'زيت زيتون بكر ممتاز', en: 'Extra Virgin Olive Oil', subtitle: 'إدلب · عصرة باردة', cat: 'olive',   price: 285, oldPrice: 320, weight: '750 مل', rating: 4.9, reviews: 142, badge: 'الأكثر مبيعاً', stock: 28, glyph: '🫒' },
    { id: 'p2',  ar: 'طحينة بيضاء فاخرة',  en: 'Premium Tahini',         subtitle: 'حلب · سمسم محمص', cat: 'tahini',  price: 95,  weight: '400 جم', rating: 4.8, reviews: 89,  badge: 'يدوي',      stock: 42, glyph: '🥣' },
    { id: 'p3',  ar: 'ثوم مخلل بالخل',      en: 'Pickled Garlic',         subtitle: 'دمشق · حرفي',     cat: 'pickles', price: 75,  weight: '500 جم', rating: 4.7, reviews: 56,  badge: 'موسم محدود', stock: 18, glyph: '🧄' },
    { id: 'p4',  ar: 'زعتر بري مع سمسم',    en: 'Wild Thyme Blend',       subtitle: 'الساحل · 2025',   cat: 'spices',  price: 65,  weight: '250 جم', rating: 4.9, reviews: 203, badge: null,         stock: 64, glyph: '🌿' },
    { id: 'p5',  ar: 'دبس رمان طبيعي',      en: 'Pomegranate Molasses',   subtitle: 'حماة · بدون سكر', cat: 'tahini',  price: 115, weight: '500 مل', rating: 4.6, reviews: 41,  badge: 'عضوي',       stock: 31, glyph: '🍷' },
    { id: 'p6',  ar: 'مكدوس باذنجان',        en: 'Stuffed Eggplant',       subtitle: 'حلب · يدوي',     cat: 'pickles', price: 145, weight: '1 كجم',  rating: 4.8, reviews: 67,  badge: null,         stock: 12, glyph: '🍆' },
    { id: 'p7',  ar: 'بهارات سبع نجوم',      en: 'Seven Spice Blend',      subtitle: 'وصفة العائلة',    cat: 'spices',  price: 48,  weight: '150 جم', rating: 4.7, reviews: 92,  badge: null,         stock: 88, glyph: '✨' },
    { id: 'p8',  ar: 'معمول بالفستق',        en: 'Pistachio Maamoul',      subtitle: 'مخبوز يومياً',    cat: 'sweets',  price: 220, weight: '500 جم', rating: 4.9, reviews: 178, badge: 'جديد',       stock: 24, glyph: '🍯' },
    { id: 'p9',  ar: 'قهوة عربية بالهال',    en: 'Cardamom Coffee',        subtitle: 'تحميص متوسط',     cat: 'coffee',  price: 135, weight: '250 جم', rating: 4.8, reviews: 64,  badge: null,         stock: 39, glyph: '☕' },
    { id: 'p10', ar: 'برغل خشن أصلي',        en: 'Coarse Bulgur',          subtitle: 'حوران',           cat: 'grains',  price: 55,  weight: '1 كجم',  rating: 4.6, reviews: 33,  badge: null,         stock: 71, glyph: '🌾' },
    { id: 'p11', ar: 'كعك بالسمسم',          en: 'Sesame Kaak',            subtitle: 'خبز يومي',        cat: 'bakery',  price: 38,  weight: '300 جم', rating: 4.7, reviews: 27,  badge: null,         stock: 9,  glyph: '🥯' },
    { id: 'p12', ar: 'زيتون أخضر بالليمون',  en: 'Lemon Green Olives',     subtitle: 'الساحل',           cat: 'olive',   price: 85,  weight: '500 جم', rating: 4.5, reviews: 48,  badge: null,         stock: 0,  glyph: '🫒' },
  ];

  const orders = [
    { id: 'SUF-2026-04891', customer: 'أحمد المصري',  city: 'القاهرة · المعادي',     items: 4, total: 1245, status: 'preparing', payment: 'cash',     time: 'منذ 8 د',   date: '2026-05-16 14:20' },
    { id: 'SUF-2026-04890', customer: 'منى عبد الله', city: 'الجيزة · الشيخ زايد',    items: 7, total: 2380, status: 'shipping',  payment: 'card',     time: 'منذ 22 د',  date: '2026-05-16 14:06' },
    { id: 'SUF-2026-04889', customer: 'يوسف حسن',     city: 'القاهرة · مدينة نصر',    items: 2, total: 530,  status: 'delivered', payment: 'wallet',   time: 'منذ ساعة',  date: '2026-05-16 13:12' },
    { id: 'SUF-2026-04888', customer: 'سارة كمال',    city: 'الإسكندرية · سموحة',     items: 5, total: 1820, status: 'new',       payment: 'wallet',   time: 'منذ ساعتين',date: '2026-05-16 12:30' },
    { id: 'SUF-2026-04887', customer: 'كريم فؤاد',    city: 'القاهرة · التجمع الخامس',items: 3, total: 985,  status: 'delivered', payment: 'card',     time: 'منذ 3 س',   date: '2026-05-16 11:45' },
    { id: 'SUF-2026-04886', customer: 'هدى نبيل',     city: 'القاهرة · مصر الجديدة',  items: 6, total: 1640, status: 'cancelled', payment: 'cash',     time: 'منذ 4 س',   date: '2026-05-16 10:18' },
    { id: 'SUF-2026-04885', customer: 'محمد رضا',    city: '6 أكتوبر · الحصري',     items: 8, total: 2950, status: 'preparing', payment: 'card',     time: 'منذ 5 س',   date: '2026-05-16 09:35' },
    { id: 'SUF-2026-04884', customer: 'ليلى السيد',  city: 'القاهرة · الزمالك',     items: 2, total: 680,  status: 'delivered', payment: 'wallet',   time: 'أمس',       date: '2026-05-15 18:50' },
  ];

  const statusMap = {
    new:        { label: 'جديد',       cls: 'new' },
    preparing:  { label: 'قيد التحضير', cls: 'inprog' },
    shipping:   { label: 'في الطريق',   cls: 'contacted' },
    delivered:  { label: 'تم التسليم',  cls: 'active' },
    cancelled:  { label: 'ملغي',        cls: 'rejected' },
  };

  // KPI series for charts
  const revenueByDay = [
    { day: 'سبت',    value: 42500 },
    { day: 'أحد',    value: 38900 },
    { day: 'اثنين',  value: 51200 },
    { day: 'ثلاثاء', value: 47800 },
    { day: 'أربعاء', value: 62400 },
    { day: 'خميس',   value: 58100 },
    { day: 'جمعة',   value: 73600 },
  ];

  const peakHours = [
    { h: '08', v: 12 }, { h: '10', v: 28 }, { h: '12', v: 48 }, { h: '14', v: 62 },
    { h: '16', v: 41 }, { h: '18', v: 71 }, { h: '20', v: 89 }, { h: '22', v: 54 },
  ];

  const topProducts = [
    { p: products[0], sold: 412, revenue: 117420 },
    { p: products[3], sold: 358, revenue: 23270 },
    { p: products[1], sold: 287, revenue: 27265 },
    { p: products[7], sold: 196, revenue: 43120 },
    { p: products[6], sold: 178, revenue: 8544 },
  ];

  const campaigns = [
    { id: 'c1', name: 'حملة رمضان · بريميم',   channel: 'Instagram', spend: 12400, revenue: 84200, roas: 6.79, ctr: 3.2, conv: 142, status: 'active'  },
    { id: 'c2', name: 'الزيتون الجديد',         channel: 'Facebook',  spend:  8600, revenue: 41800, roas: 4.86, ctr: 2.1, conv:  89, status: 'active'  },
    { id: 'c3', name: 'باقة المعمول',           channel: 'TikTok',    spend:  5200, revenue: 31500, roas: 6.06, ctr: 4.8, conv:  74, status: 'active'  },
    { id: 'c4', name: 'إعادة استهداف · سلة',   channel: 'Google',    spend:  3800, revenue: 22100, roas: 5.82, ctr: 1.9, conv:  48, status: 'active'  },
    { id: 'c5', name: 'حملة التوابل',           channel: 'Instagram', spend:  4100, revenue: 12300, roas: 3.00, ctr: 2.4, conv:  28, status: 'paused'  },
    { id: 'c6', name: 'البرغل الحوراني',        channel: 'Facebook',  spend:  2200, revenue:  4500, roas: 2.05, ctr: 1.2, conv:  12, status: 'review'  },
  ];

  const cities = [
    { name: 'القاهرة',     orders: 1842, pct: 48 },
    { name: 'الجيزة',      orders: 924,  pct: 24 },
    { name: '6 أكتوبر',    orders: 412,  pct: 11 },
    { name: 'الإسكندرية',  orders: 386,  pct: 10 },
    { name: 'الشيخ زايد',  orders: 268,  pct:  7 },
  ];

  return { categories, products, orders, statusMap, revenueByDay, peakHours, topProducts, campaigns, cities };
})();
