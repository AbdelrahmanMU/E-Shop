// Sufra — Admin desktop screens (overview, orders, products, campaigns)
// Built atop the Homify admin shell (sidebar + topbar + panels).

const SDA = window.SUFRA_DATA;

// ─── Shared admin chrome ──────────────────────────────────────────────────
function AdminIcon({ d, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
const AI = {
  home:     <AdminIcon d="M3 12l9-9 9 9M5 10v10h14V10" />,
  orders:   <AdminIcon d="M3 4h2l2.5 13h12L22 7H6m1 14a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm12 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />,
  products: <AdminIcon d="M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7" />,
  customers:<AdminIcon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />,
  campaigns:<AdminIcon d="M3 11l18-7-3 18-6-5-3 5-2-7-4-4z" />,
  reports:  <AdminIcon d="M21 21H4V3M7 14l3-3 4 4 6-6" />,
  inv:      <AdminIcon d="M20 7l-8-4-8 4v10l8 4 8-4V7zM4 7l8 4 8-4M12 11v10" />,
  settings: <AdminIcon d="M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1.3l2-1.5-2-3.5-2.4.8a7 7 0 00-2.3-1.3L13.6 3h-3.2l-.6 2.2a7 7 0 00-2.3 1.3l-2.4-.8-2 3.5 2 1.5a7 7 0 000 2.6l-2 1.5 2 3.5 2.4-.8a7 7 0 002.3 1.3l.6 2.2h3.2l.6-2.2a7 7 0 002.3-1.3l2.4.8 2-3.5-2-1.5c.07-.4.1-.85.1-1.3z" />,
  search:   <AdminIcon d="M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.35-4.35" />,
  bell:     <AdminIcon d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />,
  plus:     <AdminIcon d="M12 5v14M5 12h14" />,
  pin:      <AdminIcon d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0116 0zM12 13a3 3 0 100-6 3 3 0 000 6z" />,
  up:       <AdminIcon d="M12 19V5M5 12l7-7 7 7" />,
  down:     <AdminIcon d="M12 5v14M19 12l-7 7-7-7" />,
  arrowR:   <AdminIcon d="M5 12h14M12 5l7 7-7 7" />,
  arrowL:   <AdminIcon d="M19 12H5M12 19l-7-7 7-7" />,
  eye:      <AdminIcon d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z" />,
  edit:     <AdminIcon d="M17 3a2.83 2.83 0 014 4L7.5 20.5 2 22l1.5-5.5L17 3z" />,
  trash:    <AdminIcon d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />,
  filter:   <AdminIcon d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  alert:    <AdminIcon d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />,
};

function Sidebar({ active = 'overview' }) {
  const items = [
    { id: 'overview',  l: 'نظرة عامة',   ic: AI.home },
    { id: 'orders',    l: 'الطلبات',      ic: AI.orders, badge: '12', cls: 'warning' },
    { id: 'products',  l: 'المنتجات',     ic: AI.products },
    { id: 'inventory', l: 'المخزون',      ic: AI.inv, badge: '3', cls: 'warning' },
    { id: 'customers', l: 'العملاء',      ic: AI.customers },
    { id: 'campaigns', l: 'الحملات الإعلانية',  ic: AI.campaigns },
    { id: 'reports',   l: 'التقارير',     ic: AI.reports },
  ];
  return (
    <div className="admin-sidebar" style={{ position: 'static', height: 'auto', minHeight: '100%' }}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-link">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 3h6M3 3v6M21 3h-6M21 3v6M3 21h6M3 21v-6M21 21h-6M21 21v-6" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span>SUF<span className="logo-accent">RA</span></span>
        </div>
        <span className="sidebar-badge">ADMIN</span>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">ك.م</div>
        <div style={{ flex: 1 }}>
          <div className="user-name">كريم منصور</div>
          <div className="user-role">مدير عام</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">إدارة</div>
        {items.slice(0, 5).map(it => (
          <a key={it.id} className={'nav-item ' + (active === it.id ? 'active' : '')}>
            <span className="nav-icon">{it.ic}</span>
            <span className="nav-label">{it.l}</span>
            {it.badge && <span className={'nav-badge ' + (it.cls || '')}>{it.badge}</span>}
          </a>
        ))}
        <div className="nav-section-label">التسويق</div>
        {items.slice(5).map(it => (
          <a key={it.id} className={'nav-item ' + (active === it.id ? 'active' : '')}>
            <span className="nav-icon">{it.ic}</span>
            <span className="nav-label">{it.l}</span>
          </a>
        ))}
        <div className="nav-section-label">النظام</div>
        <a className="nav-item nav-item-muted">
          <span className="nav-icon">{AI.settings}</span>
          <span className="nav-label">الإعدادات</span>
        </a>
      </nav>

      <div className="sidebar-bottom">
        <button className="logout-btn">↪ تسجيل الخروج</button>
      </div>
    </div>
  );
}

function Topbar({ title, sub, action }) {
  return (
    <div className="admin-topbar" style={{ position: 'static' }}>
      <div>
        <div className="page-title-bar">{title}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{sub}</div>}
      </div>
      <div className="top-bar-right">
        <div className="search-wrapper">
          <input className="top-search" placeholder="بحث في كل شيء..." />
          <span className="search-icon">{AI.search}</span>
        </div>
        <button className="notif-btn">{AI.bell}<span className="notif-dot"></span></button>
        {action && <button className="btn-add">{AI.plus} {action}</button>}
      </div>
    </div>
  );
}

// ─── 1. Overview / Analytics ──────────────────────────────────────────────
function AdminOverview() {
  const kpis = [
    { l: 'مبيعات اليوم',     v: '124,580', cur: 'ج.م', d: '+18.2%', up: true,  ic: AI.up,        bg: 'red' },
    { l: 'طلبات جديدة',     v: '47',      d: '+12 منذ الصباح', up: true, ic: AI.orders,    bg: 'blue' },
    { l: 'متوسط قيمة الطلب', v: '385',     cur: 'ج.م', d: '+2.4%', up: true,  ic: AI.products,  bg: 'green' },
    { l: 'عملاء جدد',        v: '23',      d: '−4.1%', up: false, ic: AI.customers, bg: 'orange' },
  ];
  const maxRev = Math.max(...SDA.revenueByDay.map(d => d.value));
  return (
    <div className="admin-main">
      {/* KPIs */}
      <div className="stats-grid">
        {kpis.map(k => (
          <div key={k.l} className="stat-card">
            <div className="stat-header">
              <div className={'stat-icon ' + (k.bg !== 'red' ? k.bg : '')}>{k.ic}</div>
              <div className={'stat-delta ' + (k.up ? 'up' : 'down')}>
                <span style={{ display: 'inline-flex' }}>{k.up ? AI.up : AI.down}</span>
                {k.d}
              </div>
            </div>
            <div className="stat-value">{k.v} {k.cur && <span style={{ fontSize: 14, color: 'var(--text-3)', fontWeight: 600 }}>{k.cur}</span>}</div>
            <div className="stat-label">{k.l}</div>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="dashboard-grid">
        {/* Revenue chart */}
        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="section-title">المبيعات الأسبوعية</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>إجمالي · 374,500 ج.م</div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['اليوم', 'أسبوع', 'شهر', 'سنة'].map((t, i) => (
                <div key={t} className={'f-chip ' + (i === 1 ? 'active' : '')} style={{ padding: '5px 10px', fontSize: 10 }}>{t}</div>
              ))}
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-grid-lines">
              {[80,60,40,20,0].map(v => (
                <div key={v} className="grid-line"><span className="num">{v}K</span></div>
              ))}
            </div>
            <div className="chart-bars">
              {SDA.revenueByDay.map((d, i) => (
                <div key={d.day} className="chart-col">
                  <div className="chart-track">
                    <div className="chart-bar" style={{ height: `${(d.value / maxRev) * 100}%` }}>
                      <div className="bar-tooltip num">{(d.value/1000).toFixed(1)}K</div>
                    </div>
                  </div>
                  <div className="chart-label">{d.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="panel">
          <div className="panel-head">
            <div className="section-title">آخر الطلبات</div>
            <a className="panel-link">عرض الكل <span style={{ display: 'inline-flex' }}>{AI.arrowL}</span></a>
          </div>
          <div className="activity-list">
            {SDA.orders.slice(0, 6).map(o => {
              const dotCls = o.status === 'delivered' ? 'green' : o.status === 'cancelled' ? 'orange' : o.status === 'shipping' ? 'blue' : '';
              return (
                <div key={o.id} className="activity-item">
                  <div className={'activity-dot ' + dotCls}></div>
                  <div className="activity-content">
                    <div className="activity-title">{o.customer} · {o.items} منتجات</div>
                    <div className="activity-meta num">{o.id} · <span style={{ color: 'var(--red)', fontWeight: 700 }}>{o.total.toLocaleString()} ج.م</span></div>
                  </div>
                  <div className="activity-time">{o.time}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom grid: top products + peak hours + cities */}
      <div className="dashboard-grid bottom-grid">
        {/* Top products */}
        <div className="panel">
          <div className="panel-head">
            <div className="section-title">الأكثر مبيعاً</div>
            <a className="panel-link">هذا الأسبوع</a>
          </div>
          <div className="table-wrap">
            <table className="data-table compact">
              <thead>
                <tr>
                  <th style={{ textAlign: 'right' }}>المنتج</th>
                  <th>الفئة</th>
                  <th>الوحدات</th>
                  <th>الإيراد</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {SDA.topProducts.map((tp, i) => {
                  const cat = SDA.categories.find(c => c.id === tp.p.cat);
                  return (
                    <tr key={tp.p.id}>
                      <td>
                        <div className="property-cell">
                          <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                            <window.ProductPh cls={cat?.cls} glyph={tp.p.glyph} />
                          </div>
                          <div>
                            <div className="property-name">{tp.p.ar}</div>
                            <div className="property-code num">#{tp.p.id.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="status-chip new">{cat?.ar}</span></td>
                      <td className="num" style={{ fontWeight: 700, color: 'var(--text)' }}>{tp.sold}</td>
                      <td className="price-cell">{tp.revenue.toLocaleString()}</td>
                      <td>
                        <svg className="spark" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <path d={`M0,${30 - i*2} Q20,${20+i*3} 40,${22-i} T80,${10+i*2} L100,${8+i*3}`} />
                        </svg>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side: peak hours + cities */}
        <div className="side-stack">
          {/* Peak hours */}
          <div className="panel">
            <div className="panel-head">
              <div className="section-title">أوقات الذروة</div>
              <span style={{ fontSize: 10, color: 'var(--text-3)' }}>اليوم</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
              {SDA.peakHours.map((h, i) => (
                <div key={h.h} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: '100%',
                    height: `${(h.v / 89) * 100}%`,
                    background: h.v > 60 ? 'var(--red)' : h.v > 40 ? 'var(--orange)' : 'var(--gray-300)',
                    borderRadius: '3px 3px 0 0',
                  }}></div>
                  <span className="num" style={{ fontSize: 9, color: 'var(--text-3)' }}>{h.h}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>الذروة</span>
              <span className="num" style={{ fontSize: 12, fontWeight: 800, color: 'var(--red)' }}>20:00 · 89 طلب</span>
            </div>
          </div>

          {/* Cities */}
          <div className="panel">
            <div className="panel-head">
              <div className="section-title">حسب المدينة</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SDA.cities.map(c => (
                <div key={c.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)' }}>{c.name}</span>
                    <span className="num" style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.orders} · <strong style={{ color: 'var(--red)' }}>{c.pct}%</strong></span>
                  </div>
                  <div style={{ height: 5, background: 'var(--bg-3)', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${c.pct * 2}%`, background: 'linear-gradient(90deg, var(--red-dark), var(--red))', borderRadius: 9999 }}></div>
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

// ─── 2. Orders Management ─────────────────────────────────────────────────
function AdminOrders() {
  return (
    <div className="admin-main">
      <div className="page-header">
        <div>
          <h1>إدارة الطلبات</h1>
          <p className="page-sub">عرض ومتابعة جميع طلبات المتجر</p>
        </div>
        <div className="page-actions">
          <button className="f-chip">تصدير CSV</button>
          <button className="btn-add">{AI.plus} طلب يدوي</button>
        </div>
      </div>

      {/* Mini stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 16 }}>
        {[
          { l: 'إجمالي الطلبات', v: '4,892', cur: '', bg: 'red' },
          { l: 'جديدة',          v: '47',    bg: 'blue' },
          { l: 'قيد التحضير',     v: '38',    bg: 'orange' },
          { l: 'في الطريق',       v: '24',    bg: 'blue' },
          { l: 'مكتملة اليوم',    v: '156',   bg: 'green' },
        ].map(k => (
          <div key={k.l} className="stat-card">
            <div className="stat-value" style={{ fontSize: 22 }}>{k.v}</div>
            <div className="stat-label">{k.l}</div>
          </div>
        ))}
      </div>

      <div className="list-toolbar">
        <div className="toolbar-search">
          <input placeholder="بحث برقم الطلب، اسم العميل، أو الجوال..." />
          {AI.search}
        </div>
        <div className="filter-chips">
          {['الكل', 'جديد', 'قيد التحضير', 'في الطريق', 'مكتمل', 'ملغي'].map((f, i) => (
            <div key={f} className={'f-chip ' + (i === 0 ? 'active' : '')}>{f}</div>
          ))}
        </div>
        <div className="count-pill"><strong>{SDA.orders.length}</strong> طلب</div>
      </div>

      <div className="panel" style={{ padding: '4px 16px 12px' }}>
        <div className="table-wrap">
          <table className="data-table full">
            <thead>
              <tr>
                <th style={{ textAlign: 'right' }}>رقم الطلب</th>
                <th style={{ textAlign: 'right' }}>العميل</th>
                <th style={{ textAlign: 'right' }}>المدينة</th>
                <th>منتجات</th>
                <th>الإجمالي</th>
                <th>الدفع</th>
                <th>الحالة</th>
                <th>الوقت</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {SDA.orders.map(o => {
                const s = SDA.statusMap[o.status];
                const payIcon = o.payment === 'cash' ? '💵' : o.payment === 'card' ? '💳' : '📱';
                const payText = o.payment === 'cash' ? 'كاش' : o.payment === 'card' ? 'بطاقة' : 'محفظة';
                return (
                  <tr key={o.id}>
                    <td><div className="num" style={{ fontWeight: 700, color: 'var(--text)' }}>{o.id}</div></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 9999, background: 'var(--red-soft)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                          {o.customer.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--text)' }}>{o.customer}</span>
                      </div>
                    </td>
                    <td><span style={{ color: 'var(--text-3)' }}>{o.city}</span></td>
                    <td className="num" style={{ fontWeight: 700 }}>{o.items}</td>
                    <td className="price-cell">{o.total.toLocaleString()}</td>
                    <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11 }}>{payIcon} {payText}</span></td>
                    <td><span className={'status-chip ' + s.cls}>{s.label}</span></td>
                    <td className="mono-cell">{o.time}</td>
                    <td>
                      <div className="property-actions">
                        <button className="table-action view">{AI.eye}</button>
                        <button className="table-action edit">{AI.edit}</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="pager">
          <span>عرض <strong className="num">8</strong> من <strong className="num">4,892</strong></span>
          <div className="pager-right">
            <button className="pg-btn">{AI.arrowR}</button>
            <button className="pg-btn active">1</button>
            <button className="pg-btn">2</button>
            <button className="pg-btn">3</button>
            <button className="pg-btn">…</button>
            <button className="pg-btn">612</button>
            <button className="pg-btn">{AI.arrowL}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 3. Products Management ───────────────────────────────────────────────
function AdminProducts() {
  return (
    <div className="admin-main">
      <div className="page-header">
        <div>
          <h1>إدارة المنتجات</h1>
          <p className="page-sub">جميع منتجات المتجر مع حالة المخزون</p>
        </div>
        <div className="page-actions">
          <button className="f-chip">استيراد Excel</button>
          <button className="btn-add">{AI.plus} منتج جديد</button>
        </div>
      </div>

      {/* Stock alerts */}
      <div style={{
        background: 'var(--status-warning-bg)', border: '1px solid #fbbf24',
        borderRadius: 12, padding: '12px 16px', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ color: 'var(--status-warning-text)' }}>{AI.alert}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--status-warning-text)' }}>3 منتجات تحتاج إعادة تخزين</div>
          <div style={{ fontSize: 11, color: 'var(--status-warning-text)', opacity: 0.85, marginTop: 2 }}>كعك بالسمسم · مكدوس باذنجان · ثوم مخلل بالخل</div>
        </div>
        <button style={{ fontSize: 11, fontWeight: 800, color: 'var(--status-warning-text)', textDecoration: 'underline' }}>عرض التفاصيل ←</button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { l: 'إجمالي المنتجات', v: '156', d: '+8 هذا الشهر', up: true, bg: 'red' },
          { l: 'نشط',             v: '142', d: '91.0%', up: true, bg: 'green' },
          { l: 'مخزون منخفض',     v: '11',  d: 'تنبيه',  up: false, bg: 'orange' },
          { l: 'نفد المخزون',     v: '3',   d: 'حرج',     up: false, bg: 'red' },
        ].map(k => (
          <div key={k.l} className="stat-card">
            <div className="stat-header">
              <div className={'stat-icon ' + (k.bg !== 'red' ? k.bg : '')}>{AI.products}</div>
              <div className={'stat-delta ' + (k.up ? 'up' : 'down')}>{k.d}</div>
            </div>
            <div className="stat-value">{k.v}</div>
            <div className="stat-label">{k.l}</div>
          </div>
        ))}
      </div>

      <div className="list-toolbar">
        <div className="toolbar-search">
          <input placeholder="بحث في المنتجات..." />
          {AI.search}
        </div>
        <div className="filter-chips">
          {['الكل', 'نشط', 'مخزون منخفض', 'نفد'].map((f, i) => (
            <div key={f} className={'f-chip ' + (i === 0 ? 'active' : '')}>{f}</div>
          ))}
        </div>
        <div className="count-pill"><strong>{SDA.products.length}</strong> منتج</div>
      </div>

      <div className="panel" style={{ padding: '4px 16px 12px' }}>
        <div className="table-wrap">
          <table className="data-table full">
            <thead>
              <tr>
                <th style={{ textAlign: 'right' }}>المنتج</th>
                <th>الفئة</th>
                <th>السعر</th>
                <th>المخزون</th>
                <th>المباع</th>
                <th>التقييم</th>
                <th>الحالة</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {SDA.products.slice(0, 8).map(p => {
                const cat = SDA.categories.find(c => c.id === p.cat);
                const stockLevel = p.stock === 0 ? 'rejected' : p.stock < 15 ? 'pending' : 'active';
                const stockText  = p.stock === 0 ? 'نفد' : p.stock < 15 ? 'منخفض' : 'متوفر';
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="property-cell">
                        <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                          <window.ProductPh cls={cat?.cls} glyph={p.glyph} />
                        </div>
                        <div>
                          <div className="property-name">{p.ar}</div>
                          <div className="property-code num">#{p.id.toUpperCase()} · {p.weight}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="status-chip new">{cat?.ar}</span></td>
                    <td className="price-cell">{p.price} ج.م</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <span className="num" style={{ fontWeight: 700, color: p.stock === 0 ? 'var(--red)' : 'var(--text)' }}>{p.stock}</span>
                        <div style={{ width: 60, height: 3, background: 'var(--bg-3)', borderRadius: 9999, overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(p.stock, 100)}%`, height: '100%', background: p.stock === 0 ? 'var(--red)' : p.stock < 15 ? 'var(--orange)' : 'var(--green)' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="num" style={{ fontWeight: 700 }}>{p.reviews * 2}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11 }}>
                        <span style={{ color: 'var(--saffron)' }}>★</span>
                        <span className="num" style={{ fontWeight: 700 }}>{p.rating}</span>
                      </span>
                    </td>
                    <td><span className={'status-chip ' + stockLevel}>{stockText}</span></td>
                    <td>
                      <div className="property-actions">
                        <button className="table-action view">{AI.eye}</button>
                        <button className="table-action edit">{AI.edit}</button>
                        <button className="table-action delete">{AI.trash}</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── 4. Campaign Analytics ────────────────────────────────────────────────
function AdminCampaigns() {
  const channelColors = {
    Instagram: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af)',
    Facebook:  '#1877F2',
    TikTok:    'linear-gradient(135deg, #25F4EE, #000000, #FE2C55)',
    Google:    '#4285F4',
  };
  return (
    <div className="admin-main">
      <div className="page-header">
        <div>
          <h1>تحليلات الحملات الإعلانية</h1>
          <p className="page-sub">أداء جميع الحملات النشطة عبر القنوات</p>
        </div>
        <div className="page-actions">
          <button className="f-chip">آخر 30 يوم</button>
          <button className="btn-add">{AI.plus} حملة جديدة</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="stats-grid">
        {[
          { l: 'إجمالي الإنفاق',   v: '36,300', cur: 'ج.م', d: '+12%', up: true,  bg: 'red' },
          { l: 'الإيراد المُحقق',  v: '196,400', cur: 'ج.م', d: '+34%', up: true,  bg: 'green' },
          { l: 'ROAS',           v: '5.41', cur: 'x',    d: '+0.8x', up: true,  bg: 'blue' },
          { l: 'تكلفة الاكتساب',  v: '92',  cur: 'ج.م', d: '−5%',   up: true,  bg: 'orange' },
        ].map(k => (
          <div key={k.l} className="stat-card">
            <div className="stat-header">
              <div className={'stat-icon ' + (k.bg !== 'red' ? k.bg : '')}>{AI.campaigns}</div>
              <div className={'stat-delta ' + (k.up ? 'up' : 'down')}>
                <span style={{ display: 'inline-flex' }}>{k.up ? AI.up : AI.down}</span>
                {k.d}
              </div>
            </div>
            <div className="stat-value">{k.v} <span style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 600 }}>{k.cur}</span></div>
            <div className="stat-label">{k.l}</div>
          </div>
        ))}
      </div>

      {/* Channels + Funnel */}
      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-head">
            <div className="section-title">الأداء حسب القناة</div>
            <a className="panel-link">آخر 30 يوم</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {[
              { n: 'Instagram', spend: 16500, rev: 96500, conv: 170, ctr: 3.2 },
              { n: 'Facebook',  spend: 10800, rev: 46300, conv: 101, ctr: 2.1 },
              { n: 'TikTok',    spend:  5200, rev: 31500, conv:  74, ctr: 4.8 },
              { n: 'Google',    spend:  3800, rev: 22100, conv:  48, ctr: 1.9 },
            ].map(c => (
              <div key={c.n} style={{
                border: '1px solid var(--border)', borderRadius: 10, padding: 12,
                background: 'var(--bg)', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, insetInline: 0, height: 3,
                  background: channelColors[c.n],
                }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14 }}>{c.n}</div>
                  <div className="num" style={{ fontSize: 11, fontWeight: 800, color: 'var(--green)', background: 'var(--status-success-bg)', padding: '2px 7px', borderRadius: 9999 }}>{(c.rev/c.spend).toFixed(2)}x</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  <div>
                    <div className="num" style={{ fontSize: 14, fontWeight: 800 }}>{(c.spend/1000).toFixed(1)}K</div>
                    <div style={{ fontSize: 9, color: 'var(--text-3)' }}>الإنفاق ج.م</div>
                  </div>
                  <div>
                    <div className="num" style={{ fontSize: 14, fontWeight: 800, color: 'var(--green)' }}>{(c.rev/1000).toFixed(1)}K</div>
                    <div style={{ fontSize: 9, color: 'var(--text-3)' }}>الإيراد</div>
                  </div>
                  <div>
                    <div className="num" style={{ fontSize: 14, fontWeight: 800 }}>{c.conv}</div>
                    <div style={{ fontSize: 9, color: 'var(--text-3)' }}>تحويل</div>
                  </div>
                  <div>
                    <div className="num" style={{ fontSize: 14, fontWeight: 800 }}>{c.ctr}%</div>
                    <div style={{ fontSize: 9, color: 'var(--text-3)' }}>CTR</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel */}
        <div className="panel">
          <div className="panel-head">
            <div className="section-title">مسار التحويل</div>
            <a className="panel-link">آخر 7 أيام</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { l: 'الانطباعات',    v: 482400, pct: 100, color: '#dbeafe' },
              { l: 'النقرات',       v:  12860, pct: 78,  color: '#bfdbfe' },
              { l: 'زيارة صفحة',    v:  10240, pct: 62,  color: '#93c5fd' },
              { l: 'أضاف للسلة',    v:   3180, pct: 38,  color: '#60a5fa' },
              { l: 'بدء الدفع',     v:   1240, pct: 24,  color: '#3b82f6' },
              { l: 'تم الشراء',     v:    393, pct: 14,  color: 'var(--red)' },
            ].map((f, i) => (
              <div key={f.l}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{f.l}</span>
                  <span className="num" style={{ fontSize: 11, color: 'var(--text-3)' }}>{f.v.toLocaleString()}</span>
                </div>
                <div style={{ height: 22, background: 'var(--bg-3)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                  <div style={{
                    height: '100%', width: `${f.pct}%`,
                    background: f.color,
                    borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                    paddingInline: 8,
                  }}>
                    <span className="num" style={{ fontSize: 10, fontWeight: 800, color: i >= 4 ? '#fff' : '#1e3a8a' }}>{f.pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaigns table */}
      <div className="panel" style={{ marginTop: 16, padding: '14px 16px 12px' }}>
        <div className="panel-head">
          <div className="section-title">الحملات النشطة</div>
          <a className="panel-link">عرض الكل</a>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'right' }}>الحملة</th>
                <th>القناة</th>
                <th>الإنفاق</th>
                <th>الإيراد</th>
                <th>ROAS</th>
                <th>CTR</th>
                <th>التحويلات</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {SDA.campaigns.map(c => (
                <tr key={c.id}>
                  <td><div style={{ fontWeight: 700, color: 'var(--text)' }}>{c.name}</div></td>
                  <td>
                    <span style={{
                      display: 'inline-block', padding: '3px 9px', borderRadius: 9999,
                      fontSize: 10, fontWeight: 700,
                      background: 'var(--bg-3)', color: 'var(--text-2)',
                    }}>{c.channel}</span>
                  </td>
                  <td className="num" style={{ fontWeight: 700 }}>{c.spend.toLocaleString()}</td>
                  <td className="num" style={{ fontWeight: 700, color: 'var(--green)' }}>{c.revenue.toLocaleString()}</td>
                  <td><span className="num" style={{ fontWeight: 800, color: c.roas >= 4 ? 'var(--green)' : c.roas >= 2.5 ? 'var(--orange)' : 'var(--red)' }}>{c.roas.toFixed(2)}x</span></td>
                  <td className="num">{c.ctr}%</td>
                  <td className="num" style={{ fontWeight: 700 }}>{c.conv}</td>
                  <td>
                    <span className={'status-chip ' + (c.status === 'active' ? 'active' : c.status === 'paused' ? 'pending' : 'inprog')}>
                      {c.status === 'active' ? 'نشطة' : c.status === 'paused' ? 'متوقفة' : 'مراجعة'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Admin shell wrapper ──────────────────────────────────────────────────
function AdminShell({ active, title, sub, action, children }) {
  return (
    <div className="win-frame sufra-admin" style={{ background: 'var(--bg-2)', fontFamily: 'var(--font-arabic)', direction: 'rtl', color: 'var(--text)' }}>
      <div className="win-bar">
        <div className="win-dot r"></div>
        <div className="win-dot y"></div>
        <div className="win-dot g"></div>
        <div className="win-url">
          <span style={{ color: 'var(--gray-400)' }}>🔒</span>
          <span>admin.sufra.com/{active}</span>
        </div>
      </div>
      <div className="win-content">
        <div className="admin-wrapper" style={{ minHeight: 'auto' }}>
          <Sidebar active={active} />
          <div className="admin-content">
            <Topbar title={title} sub={sub} action={action} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminOverview, AdminOrders, AdminProducts, AdminCampaigns, AdminShell });
