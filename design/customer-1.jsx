// Sufra — Customer mobile screens (storefront, catalog, product, cart, checkout, tracking, account)
// All screens designed for 390-402px wide iOS device frame.
// Premium Levantine aesthetic: ivory surfaces, charcoal hero, deep crimson actions, serif accents.

const { useState, useMemo, useEffect } = React;
const SD = window.SUFRA_DATA;

// ─── Shared mobile components ──────────────────────────────────────────────
function Ico({ d, size = 18, fill, stroke = 'currentColor', sw = 1.75, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || 'none'} stroke={fill ? 'none' : stroke}
         strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={d} />
    </svg>
  );
}
const I = {
  search:   <Ico d="M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.35-4.35" />,
  cart:     <Ico d="M3 4h2l2.5 13h12L22 7H6m1 14a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm12 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />,
  heart:    <Ico d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />,
  user:     <Ico d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />,
  bell:     <Ico d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />,
  filter:   <Ico d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  pin:      <Ico d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0116 0zM12 13a3 3 0 100-6 3 3 0 000 6z" />,
  back:     <Ico d="M9 18l6-6-6-6" />,           // pointing left in RTL terms — visual back arrow
  forward:  <Ico d="M15 18l-6-6 6-6" />,
  close:    <Ico d="M18 6L6 18M6 6l12 12" />,
  star:     <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />,
  plus:     <Ico d="M12 5v14M5 12h14" sw={2} />,
  minus:    <Ico d="M5 12h14" sw={2} />,
  check:    <Ico d="M20 6L9 17l-5-5" />,
  clock:    <Ico d="M12 8v4l3 2M12 22a10 10 0 100-20 10 10 0 000 20z" />,
  bag:      <Ico d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 11-8 0" />,
  truck:    <Ico d="M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm12 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />,
  chevron:  <Ico d="M9 6l-6 6 6 6" />,           // RTL "more" pointing left
  wallet:   <Ico d="M21 12V7H5a2 2 0 010-4h14v4M3 5v14a2 2 0 002 2h16v-5M16 12a2 2 0 100 4h5v-4z" />,
  card:     <Ico d="M2 5h20v14H2zM2 10h20M6 15h4" />,
  cash:     <Ico d="M2 6h20v12H2zM12 8a4 4 0 100 8 4 4 0 000-8zM6 8h.01M18 16h.01" />,
  share:    <Ico d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />,
  leaf:     <Ico d="M2 12c0-5.5 4.5-10 10-10 0 5.5-4.5 10-10 10zm0 0c5.5 0 10 4.5 10 10 0-5.5-4.5-10-10-10z" />,
};

const fmt = n => n.toLocaleString('en-US');

function ProductPh({ cls, glyph, label }) {
  return (
    <div className={`product-ph ${cls}`}>
      <div className="ph-glyph">{glyph}</div>
      {label && <div className="ph-label">{label}</div>}
    </div>
  );
}

function MobileNav({ active }) {
  const items = [
    { id: 'home',    label: 'الرئيسية', icon: I.bag },
    { id: 'cat',     label: 'الفئات',  icon: I.filter },
    { id: 'cart',    label: 'السلة',   icon: I.cart, badge: 3 },
    { id: 'account', label: 'حسابي',   icon: I.user },
  ];
  return (
    <div style={{
      position: 'absolute', insetInline: 0, bottom: 0,
      background: 'var(--bg)', borderTop: '1px solid var(--border)',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      padding: '8px 6px 22px', zIndex: 4,
    }}>
      {items.map(it => (
        <div key={it.id} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          color: active === it.id ? 'var(--red)' : 'var(--text-3)',
          fontSize: 10, fontWeight: 700, position: 'relative',
        }}>
          <div style={{ position: 'relative' }}>
            {it.icon}
            {it.badge && (
              <div style={{
                position: 'absolute', top: -5, insetInlineEnd: -8,
                background: 'var(--red)', color: '#fff', borderRadius: 9999,
                width: 16, height: 16, fontSize: 9, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }} className="num">{it.badge}</div>
            )}
          </div>
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function ProductCard({ p, compact = false }) {
  const cat = SD.categories.find(c => c.id === p.cat);
  return (
    <div style={{
      background: 'var(--bg)', borderRadius: 14, overflow: 'hidden',
      border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ position: 'relative', height: compact ? 110 : 138, overflow: 'hidden' }}>
        <ProductPh cls={cat?.cls} glyph={p.glyph} />
        {p.badge && (
          <div style={{
            position: 'absolute', top: 8, insetInlineStart: 8,
            background: 'var(--charcoal)', color: '#fff',
            padding: '3px 8px', borderRadius: 6,
            fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
          }}>{p.badge}</div>
        )}
        <button style={{
          position: 'absolute', top: 8, insetInlineEnd: 8,
          width: 28, height: 28, borderRadius: 9999,
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-3)',
        }}>{I.heart}</button>
        {p.stock === 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(20,17,15,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 12, letterSpacing: '0.04em',
          }}>نفد المخزون</div>
        )}
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div className="eyebrow" style={{ color: 'var(--text-3)', marginBottom: 4 }}>{p.subtitle}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, marginBottom: 6, minHeight: 34 }}>{p.ar}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span className="num" style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)' }}>{p.price}</span>
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>ج.م</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 10, color: 'var(--text-3)' }}>
            <span style={{ color: 'var(--saffron)' }}>{I.star}</span>
            <span className="num">{p.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 1. Storefront ─────────────────────────────────────────────────────────
function StorefrontScreen() {
  return (
    <div className="surface" style={{ background: 'var(--ivory)', position: 'relative' }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: 'var(--red)' }}>{I.pin}</span>
            توصيل إلى
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
            المعادي، القاهرة
            <span style={{ color: 'var(--text-3)' }}>{I.chevron}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ width: 38, height: 38, borderRadius: 9999, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)', position: 'relative' }}>
            {I.bell}
            <span style={{ position: 'absolute', top: 9, insetInlineEnd: 11, width: 7, height: 7, borderRadius: 9999, background: 'var(--red)', border: '2px solid var(--bg)' }}></span>
          </button>
        </div>
      </div>

      {/* Hero card */}
      <div style={{ padding: '0 18px 18px' }}>
        <div style={{
          position: 'relative', height: 220, borderRadius: 18, overflow: 'hidden',
          background: 'var(--charcoal)',
        }}>
          <div className="hero-ph"></div>
          <div className="hero-gradient"></div>
          <div style={{ position: 'absolute', inset: 0, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', zIndex: 2 }}>
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>HERITAGE · مصنوع بيدوياً</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, lineHeight: 1.05, marginBottom: 4 }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-arabic)', fontWeight: 800, color: '#fff' }}>نكهات الشام</span>
                <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>—— to your door</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 14 }}>منتجات حلب ودمشق والساحل، مختارة بعناية</div>
              <button style={{
                background: '#fff', color: 'var(--charcoal)', padding: '9px 18px', borderRadius: 9999,
                fontSize: 12, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                اكتشف المجموعة
                <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>{I.forward}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '0 18px 16px' }}>
        <div style={{
          background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ color: 'var(--text-3)' }}>{I.search}</span>
          <span style={{ fontSize: 13, color: 'var(--text-3)' }}>ابحث عن زيت، طحينة، توابل...</span>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '0 0 6px' }}>
        <div style={{ padding: '0 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--red)' }}>CATEGORIES</div>
            <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>تسوق بالفئة</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)' }}>عرض الكل</div>
        </div>
        <div className="scroll-x" style={{ display: 'flex', gap: 10, padding: '4px 18px 14px' }}>
          {SD.categories.slice(0, 6).map(c => (
            <div key={c.id} style={{ flex: '0 0 84px', textAlign: 'center' }}>
              <div className={`product-ph ${c.cls}`} style={{ width: 84, height: 84, borderRadius: 14 }}>
                <div className="ph-glyph" style={{ fontSize: 32 }}>{c.glyph}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6, color: 'var(--text-2)' }}>{c.ar}</div>
              <div className="num" style={{ fontSize: 9, color: 'var(--text-4)' }}>{c.count} منتج</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div style={{ padding: '6px 18px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--red)' }}>FEATURED</div>
            <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>مختارات الموسم</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)' }}>الكل</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ProductCard p={SD.products[0]} />
          <ProductCard p={SD.products[7]} />
          <ProductCard p={SD.products[4]} />
          <ProductCard p={SD.products[2]} />
        </div>
      </div>

      {/* Heritage banner */}
      <div style={{ padding: '0 18px 16px' }}>
        <div style={{
          background: 'var(--ivory-2)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 18, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', insetInlineEnd: -8, top: -8, fontSize: 72, opacity: 0.18 }}>🫒</div>
          <div className="eyebrow" style={{ color: 'var(--olive)', marginBottom: 8 }}>OUR STORY</div>
          <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6, lineHeight: 1.3 }}>"من حقول الشام، إلى مائدتك"</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.6 }}>كل منتج لدينا له حكاية. نختار مع مزارعين وحرفيين من إدلب وحلب ودمشق، ونوصلها إليك طازجة.</div>
        </div>
      </div>

      <div style={{ height: 80 }}></div>
      <MobileNav active="home" />
    </div>
  );
}

// ─── 2. Catalog ────────────────────────────────────────────────────────────
function CatalogScreen() {
  const filters = ['الكل', 'يدوي', 'عضوي', 'موسم محدود', 'الأكثر مبيعاً'];
  return (
    <div className="surface" style={{ background: 'var(--ivory)', position: 'relative' }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px 12px', display: 'flex', alignItems: 'center', gap: 12,
        background: 'var(--ivory)', position: 'sticky', top: 0, zIndex: 3,
      }}>
        <button style={{ width: 36, height: 36, borderRadius: 9999, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>{I.back}</span>
        </button>
        <div style={{ flex: 1 }}>
          <div className="eyebrow" style={{ color: 'var(--red)' }}>CATEGORY</div>
          <div style={{ fontSize: 15, fontWeight: 800 }}>مخللات وزيتون</div>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: 9999, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>{I.search}</button>
      </div>

      {/* Sub-banner */}
      <div style={{ padding: '0 18px 14px' }}>
        <div style={{
          position: 'relative', height: 88, borderRadius: 14, overflow: 'hidden',
          background: 'linear-gradient(135deg, #4a5a2f, #2a3a1a)',
          display: 'flex', alignItems: 'center', padding: '0 18px', color: '#fff',
        }}>
          <div style={{ position: 'absolute', insetInlineEnd: -10, top: -20, fontSize: 110, opacity: 0.22 }}>🫒</div>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>HARVEST 2025</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>الموسم الجديد متوفر</div>
            <div className="num" style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>{SD.categories[3].count + SD.categories[0].count} منتج</div>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="scroll-x" style={{ display: 'flex', gap: 6, padding: '0 18px 12px' }}>
        {filters.map((f, i) => (
          <div key={f} className={`pill ${i === 0 ? 'active' : 'outline'}`}>{f}</div>
        ))}
      </div>

      {/* Sort + count */}
      <div style={{ padding: '0 18px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="num" style={{ fontSize: 11, color: 'var(--text-3)' }}><strong style={{ color: 'var(--text)' }}>40</strong> منتج</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
          الأحدث
          <span style={{ color: 'var(--text-3)' }}>{I.chevron}</span>
        </div>
      </div>

      {/* Product grid */}
      <div style={{ padding: '0 18px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {SD.products.map(p => <ProductCard key={p.id} p={p} />)}
      </div>

      <div style={{ height: 80 }}></div>
      <MobileNav active="cat" />
    </div>
  );
}

// ─── 3. Product Detail ─────────────────────────────────────────────────────
function ProductDetailScreen() {
  const p = SD.products[0]; // Olive oil
  const cat = SD.categories.find(c => c.id === p.cat);
  return (
    <div className="surface" style={{ background: 'var(--ivory)', position: 'relative' }}>
      {/* Image hero */}
      <div style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
        <ProductPh cls={cat.cls} glyph="🫒" />
        <div style={{
          position: 'absolute', top: 14, insetInline: 14,
          display: 'flex', justifyContent: 'space-between', zIndex: 3,
        }}>
          <button style={{ width: 38, height: 38, borderRadius: 9999, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--charcoal)' }}>
            <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>{I.back}</span>
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ width: 38, height: 38, borderRadius: 9999, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--charcoal)' }}>{I.share}</button>
            <button style={{ width: 38, height: 38, borderRadius: 9999, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)' }}>{I.heart}</button>
          </div>
        </div>
        {/* dots */}
        <div style={{ position: 'absolute', insetInline: 0, bottom: 16, display: 'flex', justifyContent: 'center', gap: 6, zIndex: 3 }}>
          {[0,1,2,3].map(i => <div key={i} style={{ width: i === 0 ? 18 : 6, height: 6, borderRadius: 9999, background: i === 0 ? 'var(--charcoal)' : 'rgba(255,255,255,0.6)' }}></div>)}
        </div>
      </div>

      {/* Body card */}
      <div style={{
        background: 'var(--bg)', borderRadius: '24px 24px 0 0',
        marginTop: -20, position: 'relative', padding: '22px 18px 100px', zIndex: 2,
      }}>
        <div className="eyebrow" style={{ color: 'var(--olive)' }}>{p.subtitle.toUpperCase()}</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, lineHeight: 1.25 }}>{p.ar}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 11, color: 'var(--text-3)' }}>
          <span style={{ color: 'var(--saffron)', display: 'inline-flex' }}>{I.star}</span>
          <span className="num"><strong style={{ color: 'var(--text)' }}>{p.rating}</strong> ({p.reviews} تقييم)</span>
          <span style={{ width: 3, height: 3, borderRadius: 9999, background: 'var(--text-4)' }}></span>
          <span>متوفر · {p.stock} قطعة</span>
        </div>

        {/* Weight options */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--text-2)' }}>الحجم</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['250 مل', '500 مل', '750 مل', '1 لتر'].map((w, i) => (
              <div key={w} style={{
                flex: 1, padding: '10px 0', textAlign: 'center',
                border: '1.5px solid ' + (i === 2 ? 'var(--charcoal)' : 'var(--border)'),
                background: i === 2 ? 'var(--charcoal)' : 'var(--bg)',
                color: i === 2 ? '#fff' : 'var(--text-2)',
                borderRadius: 10, fontSize: 11, fontWeight: 700,
              }}>{w}</div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', gap: 22, borderBottom: '1px solid var(--border)' }}>
            {['الوصف', 'المكونات', 'القيمة الغذائية'].map((t, i) => (
              <div key={t} style={{
                paddingBottom: 10, fontSize: 12, fontWeight: 700,
                color: i === 0 ? 'var(--text)' : 'var(--text-3)',
                borderBottom: i === 0 ? '2px solid var(--red)' : '2px solid transparent',
                marginBottom: -1,
              }}>{t}</div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.8, marginTop: 12 }}>
            زيت زيتون بكر ممتاز من حقول إدلب، حصاد 2025. عصرة باردة خلال 24 ساعة من القطف للحفاظ على الطعم الطبيعي والقيمة الغذائية. حموضة أقل من 0.4%.
          </div>
        </div>

        {/* Quick badges */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {[
            { ic: '🌱', t: 'عضوي' },
            { ic: '✋', t: 'حرفي' },
            { ic: '🚚', t: 'توصيل بارد' },
          ].map(b => (
            <div key={b.t} style={{
              flex: 1, background: 'var(--ivory-2)', borderRadius: 10,
              padding: '12px 8px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22 }}>{b.ic}</div>
              <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4, color: 'var(--text-2)' }}>{b.t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky add to cart */}
      <div style={{
        position: 'absolute', insetInline: 0, bottom: 0,
        background: 'var(--bg)', borderTop: '1px solid var(--border)',
        padding: '12px 18px 26px',
        display: 'flex', alignItems: 'center', gap: 10, zIndex: 5,
      }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--text-3)' }}>{p.weight}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span className="num" style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{p.price}</span>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>ج.م</span>
            <span className="num" style={{ fontSize: 11, color: 'var(--text-4)', textDecoration: 'line-through' }}>{p.oldPrice}</span>
          </div>
        </div>
        <button style={{
          flex: 1, background: 'var(--charcoal)', color: '#fff',
          padding: '14px 16px', borderRadius: 12,
          fontSize: 13, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {I.bag}
          أضف إلى السلة
        </button>
      </div>
    </div>
  );
}

// Export to window so other scripts can pick them up
Object.assign(window, { StorefrontScreen, CatalogScreen, ProductDetailScreen, ProductCard, ProductPh, MobileNav, I });
