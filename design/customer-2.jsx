// Sufra — Customer mobile screens (cart, checkout, tracking, account)

const SD2 = window.SUFRA_DATA;
const { useState: useState2 } = React;

// ─── 4. Cart ───────────────────────────────────────────────────────────────
function CartScreen() {
  const items = [
    { p: SD2.products[0], qty: 1 },
    { p: SD2.products[3], qty: 2 },
    { p: SD2.products[7], qty: 1 },
  ];
  const sub = items.reduce((s, it) => s + it.p.price * it.qty, 0);
  const delivery = 45;
  const total = sub + delivery;
  return (
    <div className="surface" style={{ background: 'var(--ivory)', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ width: 36, height: 36, borderRadius: 9999, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>{window.I.back}</span>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>سلة المشتريات</div>
          <div className="num" style={{ fontSize: 11, color: 'var(--text-3)' }}>{items.length} منتجات · 4 قطع</div>
        </div>
        <button style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)' }}>إفراغ</button>
      </div>

      {/* Items */}
      <div style={{ padding: '6px 18px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(it => {
          const cat = SD2.categories.find(c => c.id === it.p.cat);
          return (
            <div key={it.p.id} style={{
              background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14,
              padding: 12, display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <div style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                <window.ProductPh cls={cat?.cls} glyph={it.p.glyph} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="eyebrow" style={{ color: 'var(--text-3)', marginBottom: 2 }}>{it.p.subtitle}</div>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>{it.p.ar}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{it.p.weight}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <div className="num" style={{ fontWeight: 800, fontSize: 14, color: 'var(--red)' }}>{it.p.price * it.qty} <span style={{ fontSize: 9, color: 'var(--text-3)', fontWeight: 700 }}>ج.م</span></div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    border: '1px solid var(--border)', borderRadius: 9999, padding: '2px 4px',
                  }}>
                    <button style={{ width: 24, height: 24, borderRadius: 9999, background: 'var(--bg-2)', color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{window.I.minus}</button>
                    <span className="num" style={{ fontSize: 13, fontWeight: 800, minWidth: 16, textAlign: 'center' }}>{it.qty}</span>
                    <button style={{ width: 24, height: 24, borderRadius: 9999, background: 'var(--charcoal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{window.I.plus}</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Promo */}
        <div style={{
          background: 'var(--bg)', border: '1px dashed var(--border)', borderRadius: 12,
          padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ color: 'var(--red)', fontSize: 20 }}>🎟️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>أدخل كود الخصم</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)' }}>كود مرحباً للعملاء الجدد</div>
          </div>
          <span style={{ color: 'var(--text-3)' }}>{window.I.chevron}</span>
        </div>

        {/* Summary */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, marginTop: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { l: 'الإجمالي الفرعي', v: sub },
              { l: 'التوصيل', v: delivery },
              { l: 'خصم العضوية', v: -25, color: 'var(--green)' },
            ].map(r => (
              <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-3)' }}>{r.l}</span>
                <span className="num" style={{ fontWeight: 700, color: r.color || 'var(--text)' }}>{r.v < 0 ? '−' : ''}{Math.abs(r.v)} ج.م</span>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>الإجمالي</span>
            <div className="num" style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>{total - 25}</span>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>ج.م</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 110 }}></div>

      {/* Sticky checkout */}
      <div style={{
        position: 'absolute', insetInline: 0, bottom: 0,
        background: 'var(--bg)', borderTop: '1px solid var(--border)',
        padding: '14px 18px 26px',
      }}>
        <button style={{
          width: '100%', background: 'var(--charcoal)', color: '#fff',
          padding: '14px', borderRadius: 12,
          fontSize: 13, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          متابعة إلى الدفع
          <span style={{ display: 'inline-flex' }}>{window.I.back}</span>
        </button>
      </div>
    </div>
  );
}

// ─── 5. Checkout ───────────────────────────────────────────────────────────
function CheckoutScreen() {
  return (
    <div className="surface" style={{ background: 'var(--ivory-2)', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px 12px', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--ivory-2)' }}>
        <button style={{ width: 36, height: 36, borderRadius: 9999, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>{window.I.back}</span>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>الدفع</div>
          <div className="num" style={{ fontSize: 11, color: 'var(--text-3)' }}>خطوة 2 من 3</div>
        </div>
        <div className="num" style={{ fontSize: 12, fontWeight: 800, color: 'var(--red)' }}>945 ج.م</div>
      </div>

      {/* Steps */}
      <div style={{ padding: '0 18px 16px', display: 'flex', gap: 6 }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 9999, background: i <= 2 ? 'var(--charcoal)' : 'var(--border)' }}></div>
        ))}
      </div>

      <div style={{ padding: '0 18px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Delivery address */}
        <div style={{ background: 'var(--bg)', borderRadius: 14, padding: 16, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div className="eyebrow" style={{ color: 'var(--red)' }}>عنوان التوصيل</div>
            <button style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)' }}>تغيير</button>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9999, background: 'var(--red-soft)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{window.I.pin}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>المنزل · المعادي</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.6, marginTop: 2 }}>شارع 9، المعادي الجديدة، القاهرة. الدور الثالث، شقة 7.</div>
              <div className="num" style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, direction: 'ltr', textAlign: 'right' }}>+20 100 123 4567</div>
            </div>
          </div>
        </div>

        {/* Scheduled time */}
        <div style={{ background: 'var(--bg)', borderRadius: 14, padding: 16, border: '1px solid var(--border)' }}>
          <div className="eyebrow" style={{ color: 'var(--red)', marginBottom: 12 }}>وقت التوصيل</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 10 }}>
            {[
              { d: 'اليوم', date: '16 مايو' },
              { d: 'غداً',  date: '17 مايو', active: true },
              { d: 'سبت',   date: '18 مايو' },
            ].map(d => (
              <div key={d.date} style={{
                padding: '10px 4px', textAlign: 'center',
                border: '1.5px solid ' + (d.active ? 'var(--charcoal)' : 'var(--border)'),
                background: d.active ? 'var(--charcoal)' : 'var(--bg)',
                color: d.active ? '#fff' : 'var(--text-2)',
                borderRadius: 10,
              }}>
                <div style={{ fontSize: 11, fontWeight: 800 }}>{d.d}</div>
                <div className="num" style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>{d.date}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {[
              { t: '9 - 12',  l: 'صباحاً' },
              { t: '12 - 4',  l: 'ظهراً', active: true },
              { t: '4 - 9',   l: 'مساءً' },
            ].map(s => (
              <div key={s.t} style={{
                padding: '10px 4px', textAlign: 'center',
                border: '1.5px solid ' + (s.active ? 'var(--red)' : 'var(--border)'),
                background: s.active ? 'var(--red-soft)' : 'var(--bg)',
                color: s.active ? 'var(--red)' : 'var(--text-2)',
                borderRadius: 10,
              }}>
                <div className="num" style={{ fontSize: 12, fontWeight: 800 }}>{s.t}</div>
                <div style={{ fontSize: 10, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div style={{ background: 'var(--bg)', borderRadius: 14, padding: 16, border: '1px solid var(--border)' }}>
          <div className="eyebrow" style={{ color: 'var(--red)', marginBottom: 12 }}>طريقة الدفع</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { ic: window.I.wallet, t: 'فودافون كاش', m: '****  5678', active: true },
              { ic: window.I.card,   t: 'بطاقة ائتمان', m: 'إضافة بطاقة جديدة' },
              { ic: window.I.cash,   t: 'كاش عند الاستلام', m: 'ادفع للمندوب' },
            ].map(opt => (
              <div key={opt.t} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 10,
                border: '1.5px solid ' + (opt.active ? 'var(--charcoal)' : 'var(--border)'),
                background: opt.active ? 'var(--ivory)' : 'var(--bg)',
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 9999, background: opt.active ? 'var(--charcoal)' : 'var(--bg-3)', color: opt.active ? '#fff' : 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{opt.ic}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 800 }}>{opt.t}</div>
                  <div className="num" style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{opt.m}</div>
                </div>
                <div style={{
                  width: 18, height: 18, borderRadius: 9999,
                  border: '1.5px solid ' + (opt.active ? 'var(--charcoal)' : 'var(--border)'),
                  background: opt.active ? 'var(--charcoal)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {opt.active && <span style={{ color: '#fff', display: 'inline-flex' }}>{window.I.check}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: 100 }}></div>

      <div style={{
        position: 'absolute', insetInline: 0, bottom: 0,
        background: 'var(--bg)', borderTop: '1px solid var(--border)',
        padding: '14px 18px 26px',
      }}>
        <button style={{
          width: '100%', background: 'var(--red)', color: '#fff',
          padding: '14px', borderRadius: 12,
          fontSize: 13, fontWeight: 800, display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          تأكيد الطلب · 945 ج.م
        </button>
      </div>
    </div>
  );
}

// ─── 6. Order Tracking ─────────────────────────────────────────────────────
function TrackingScreen() {
  const steps = [
    { t: 'تم استلام الطلب',   ts: '14:20', done: true },
    { t: 'قيد التحضير',         ts: '14:35', done: true },
    { t: 'مع المندوب',         ts: 'الآن',   current: true },
    { t: 'تم التسليم',          ts: '~ 16:00', done: false },
  ];
  return (
    <div className="surface" style={{ background: 'var(--ivory)', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ width: 36, height: 36, borderRadius: 9999, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>{window.I.back}</span>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>متابعة الطلب</div>
          <div className="num" style={{ fontSize: 10, color: 'var(--text-3)' }}>SUF-2026-04891</div>
        </div>
        <button style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)' }}>تفاصيل</button>
      </div>

      {/* Map */}
      <div style={{ padding: '0 18px 14px' }}>
        <div className="map-ph" style={{ height: 220, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
          {/* path */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }} viewBox="0 0 358 220" preserveAspectRatio="none">
            <path d="M40 180 Q 130 160, 180 130 T 320 50" fill="none" stroke="var(--red)" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" opacity="0.85" />
          </svg>
          {/* driver */}
          <div style={{ position: 'absolute', top: '38%', insetInlineStart: '46%', zIndex: 3 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9999, background: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--red)',
              border: '3px solid var(--red)',
            }}>{window.I.truck}</div>
          </div>
          {/* destination pin */}
          <div style={{ position: 'absolute', top: '15%', insetInlineStart: '78%', zIndex: 3 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 9999, background: 'var(--charcoal)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}>📍</div>
          </div>
          {/* origin */}
          <div style={{ position: 'absolute', top: '78%', insetInlineStart: '8%', zIndex: 3 }}>
            <div style={{
              width: 20, height: 20, borderRadius: 9999, background: 'var(--green)',
              border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}></div>
          </div>
        </div>
      </div>

      {/* ETA & status */}
      <div style={{ padding: '0 18px 14px' }}>
        <div style={{
          background: 'var(--charcoal)', borderRadius: 14, padding: 16,
          color: '#fff', display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 9999, background: 'rgba(201,164,92,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)',
            border: '2px solid var(--gold)', flexShrink: 0,
          }}>{window.I.truck}</div>
          <div style={{ flex: 1 }}>
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>ARRIVING SOON</div>
            <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>طلبك في الطريق</div>
            <div className="num" style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>الوصول المتوقع · 15:45 - 16:00</div>
          </div>
        </div>
      </div>

      {/* Driver card */}
      <div style={{ padding: '0 18px 14px' }}>
        <div style={{ background: 'var(--bg)', borderRadius: 14, padding: 14, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 9999, background: 'var(--ivory-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--charcoal)' }}>م.ع</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800 }}>محمد عبد الله</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <span style={{ color: 'var(--saffron)' }}>{window.I.star}</span>
              <span className="num">4.9 · مندوب التوصيل</span>
            </div>
          </div>
          <button style={{ width: 38, height: 38, borderRadius: 9999, background: 'var(--green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>💬</button>
          <button style={{ width: 38, height: 38, borderRadius: 9999, background: 'var(--charcoal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📞</button>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding: '0 18px 24px' }}>
        <div style={{ background: 'var(--bg)', borderRadius: 14, padding: 16, border: '1px solid var(--border)' }}>
          <div className="eyebrow" style={{ color: 'var(--red)', marginBottom: 14 }}>مراحل الطلب</div>
          <div style={{ position: 'relative' }}>
            {/* vertical line */}
            <div style={{ position: 'absolute', insetInlineStart: 9, top: 8, bottom: 8, width: 2, background: 'var(--border)' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {steps.map((s, i) => (
                <div key={s.t} style={{ display: 'flex', gap: 14, alignItems: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 9999,
                    background: s.done ? 'var(--green)' : (s.current ? 'var(--red)' : 'var(--bg-3)'),
                    border: '3px solid var(--bg)',
                    boxShadow: s.current ? '0 0 0 4px var(--red-soft)' : 'none',
                    flexShrink: 0, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {s.done && <span style={{ display: 'inline-flex', fontSize: 10 }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>}
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: s.current ? 800 : 700, color: s.done || s.current ? 'var(--text)' : 'var(--text-3)' }}>{s.t}</span>
                    <span className="num" style={{ fontSize: 11, color: s.current ? 'var(--red)' : 'var(--text-3)', fontWeight: s.current ? 800 : 600 }}>{s.ts}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 7. Account / Profile ─────────────────────────────────────────────────
function AccountScreen() {
  const items = [
    { ic: '📦', t: 'طلباتي',         m: '12 طلب', cnt: '3 نشط' },
    { ic: '❤️', t: 'المفضلة',        m: '24 منتج' },
    { ic: '📍', t: 'العناوين',       m: '2 عناوين محفوظة' },
    { ic: '💳', t: 'طرق الدفع',      m: 'فودافون كاش + 1' },
    { ic: '🎟️', t: 'الكوبونات',       m: '3 متاحة', cnt: 'جديد' },
    { ic: '🔔', t: 'الإشعارات',      m: 'تفعيل التنبيهات' },
  ];
  return (
    <div className="surface" style={{ background: 'var(--ivory)', position: 'relative' }}>
      {/* Hero */}
      <div style={{ background: 'var(--charcoal)', color: '#fff', padding: '20px 18px 50px', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-ph" style={{ opacity: 0.3 }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>ACCOUNT</div>
            <button style={{ color: 'rgba(255,255,255,0.7)' }}>⚙️</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 9999,
              background: 'linear-gradient(135deg, var(--gold), var(--saffron))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: '#fff',
              border: '3px solid rgba(255,255,255,0.15)',
            }}>أم</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>أحمد المصري</div>
              <div className="num" style={{ fontSize: 11, opacity: 0.7, direction: 'ltr', textAlign: 'right' }}>+20 100 123 4567</div>
              <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 9999, background: 'rgba(201,164,92,0.18)', color: 'var(--gold)', fontSize: 10, fontWeight: 800, letterSpacing: '0.06em' }}>
                <span>⭐</span> SUFRA PREMIUM
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats card overlap */}
      <div style={{ padding: '0 18px', marginTop: -34, position: 'relative', zIndex: 3 }}>
        <div style={{
          background: 'var(--bg)', borderRadius: 16, padding: 16,
          border: '1px solid var(--border)', boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
        }}>
          {[
            { v: '12', l: 'الطلبات' },
            { v: '24', l: 'المفضلة' },
            { v: '480', l: 'نقاط الولاء' },
          ].map((s, i) => (
            <div key={s.l} style={{
              textAlign: 'center',
              borderInlineEnd: i < 2 ? '1px solid var(--border)' : 'none',
              padding: '4px 0',
            }}>
              <div className="num" style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>{s.v}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div style={{ padding: '20px 18px 16px' }}>
        <div style={{ background: 'var(--bg)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {items.map((it, i) => (
            <div key={it.t} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              borderBottom: i < items.length - 1 ? '1px solid var(--border-gray)' : 'none',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--ivory-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{it.ic}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{it.t}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{it.m}</div>
              </div>
              {it.cnt && (
                <div style={{ padding: '3px 8px', borderRadius: 9999, background: 'var(--red-soft)', color: 'var(--red)', fontSize: 10, fontWeight: 800 }}>{it.cnt}</div>
              )}
              <span style={{ color: 'var(--text-3)', transform: 'rotate(180deg)', display: 'inline-flex' }}>{window.I.chevron}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, background: 'var(--bg)', borderRadius: 14, border: '1px solid var(--border)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--status-danger-bg)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>↪</div>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: 'var(--red)' }}>تسجيل الخروج</div>
        </div>
      </div>

      <div style={{ height: 80 }}></div>
      <window.MobileNav active="account" />
    </div>
  );
}

Object.assign(window, { CartScreen, CheckoutScreen, TrackingScreen, AccountScreen });
