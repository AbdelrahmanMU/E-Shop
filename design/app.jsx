// Sufra — Main app: design canvas with all artboards + Tweaks panel

const { useState: useS } = React;

// ─── Requirements analysis card ───────────────────────────────────────────
function RequirementsCard() {
  return (
    <div className="notes-card" style={{ width: 760, height: 1000, overflow: 'auto' }}>
      <span className="tag">MVP · مرحلة العرض والبيع</span>
      <h2 style={{ marginTop: 10 }}>تحليل متطلبات المتجر</h2>
      <p style={{ color: 'var(--text-3)', marginTop: 6 }}>
        منصة <strong>سفرة (SUFRA)</strong> — متجر إلكتروني SaaS لمنتجات غذائية شامية فاخرة.
        النطاق الحالي محدّد ليؤدي 4 أدوار جوهرية: <strong>العرض</strong>،
        <strong> البيع والشراء</strong>، <strong>المتابعة</strong>، <strong>التحليل</strong>.
        بدون تعقيد. كل ما هو خارج هذه الأدوار مؤجّل لمراحل لاحقة.
      </p>

      <h3>1 · الأدوار (Actors)</h3>
      <ul>
        <li><strong>العميل</strong> — يتصفح، يضيف للسلة، يدفع، ويتابع طلبه.</li>
        <li><strong>الأدمن</strong> — يدير المنتجات والطلبات ويرصد التحليلات.</li>
        <li><strong>مندوب التوصيل</strong> — مرحلة مستقبلية (تطبيق منفصل).</li>
      </ul>

      <h3>2 · ما هو ضِمن النطاق الآن</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
        <div>
          <p style={{ fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>متجر العميل (موبايل أولاً)</p>
          <ul>
            <li>الصفحة الرئيسية + بنر الموسم</li>
            <li>تصفح بالفئة + فلترة بسيطة</li>
            <li>صفحة منتج مع خيار الحجم</li>
            <li>سلة + كود خصم</li>
            <li>دفع بـ 3 طرق (محفظة، بطاقة، كاش)</li>
            <li>جدولة وقت التوصيل</li>
            <li>متابعة لحظية على خريطة</li>
            <li>حساب العميل وبرنامج ولاء بسيط</li>
          </ul>
        </div>
        <div>
          <p style={{ fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>لوحة الأدمن (ديسكتوب)</p>
          <ul>
            <li>نظرة عامة بـ 4 KPIs أساسية</li>
            <li>مخطط مبيعات أسبوعي + ذروة الساعات</li>
            <li>الأكثر مبيعاً + تفصيل المدن</li>
            <li>إدارة الطلبات بجدول مفلتر</li>
            <li>إدارة المنتجات + تنبيه نفاد المخزون</li>
            <li>تحليلات الحملات: ROAS، CTR، funnel</li>
          </ul>
        </div>
      </div>

      <h3>3 · ما هو خارج النطاق الآن (مؤجّل)</h3>
      <p style={{ color: 'var(--text-3)' }}>
        مراجعات العملاء، دردشة دعم، اشتراكات دورية، تكامل ERP، إدارة كوبونات متقدمة،
        تطبيق المندوب، multi-vendor، نظام مرتجعات، تطبيق native iOS/Android.
        كلها قابلة للإضافة كوحدات منفصلة بعد التحقق من المرحلة الأولى.
      </p>

      <h3>4 · بنية البيانات الأساسية (Domain)</h3>
      <ul>
        <li><strong>Product</strong> — id, ar/en, cat, price, weight, stock, rating, badge</li>
        <li><strong>Order</strong> — id, customer, items[], total, status, payment, schedule</li>
        <li><strong>Customer</strong> — phone (مفتاح أساسي)، addresses[]، payments[]، loyalty</li>
        <li><strong>Campaign</strong> — channel, spend, revenue, ctr, conv</li>
      </ul>

      <h3>5 · أوضاع الطلب (Order states)</h3>
      <p>
        <code style={{ background: 'var(--bg-3)', padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--font-numbers)', fontSize: 11 }}>
          new → preparing → shipping → delivered
        </code>
        &nbsp;مع مسار جانبي
        <code style={{ background: 'var(--bg-3)', padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--font-numbers)', fontSize: 11, marginInlineStart: 6 }}>
          → cancelled
        </code>
        من أي مرحلة قبل التسليم.
      </p>

      <h3>6 · مبادئ التصميم</h3>
      <ul>
        <li>عربي RTL أساسي · إنجليزي ثانوي (الـ wordmark والـ eyebrows فقط)</li>
        <li>موبايل أولاً للعميل · ديسكتوب أولاً للأدمن</li>
        <li>سطح كريمي دافئ (Ivory) · لمسات فحمية فاخرة · أحمر للأفعال فقط</li>
        <li>طباعة مزدوجة: Playfair للإنجليزي، Cairo للعربي، Inter للأرقام</li>
        <li>كل بطاقة منتج يدوية الحس عبر gradient + رمز فئة (placeholder للصورة الحقيقية)</li>
      </ul>

      <h3>7 · جاهز للـ SaaS لاحقاً</h3>
      <p style={{ color: 'var(--text-3)' }}>
        نظام التصميم مبني على tokens (متغيرات CSS). كل تاجر جديد سيكون قادراً على
        تخصيص <strong>اللون الأساسي</strong>، <strong>الخط</strong>، <strong>كثافة العرض</strong>،
        و<strong>وضع الإضاءة</strong> دون تعديل الكود — وهو ما تراه في زر "Tweaks" أعلى الصفحة.
      </p>

      <div style={{ marginTop: 16, padding: 14, background: 'var(--bg-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
        <p style={{ fontSize: 11, color: 'var(--text-3)', margin: 0 }}>
          <strong style={{ color: 'var(--red)' }}>الخطوة التالية:</strong> راجع البطاقات على اليسار.
          7 شاشات لمتجر العميل (موبايل) و4 لوحات للأدمن (ديسكتوب). يمكنك فتح أي بطاقة
          بحجم كامل، وإعادة ترتيبها، وحذف ما لا تحتاج. استخدم <strong>Tweaks</strong> أعلى الصفحة
          لتجربة الثيم والخط والكثافة.
        </p>
      </div>
    </div>
  );
}

// ─── Tweaks panel ─────────────────────────────────────────────────────────
const TweakDefaults = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "font": "cairo",
  "density": "default"
}/*EDITMODE-END*/;

function TweaksUI({ t, setT }) {
  return (
    <window.TweaksPanel title="Tweaks">
      <window.TweakSection label="المظهر">
        <window.TweakRadio
          label="الوضع"
          value={t.theme}
          options={[{ value: 'light', label: 'فاتح' }, { value: 'dark', label: 'داكن' }]}
          onChange={v => setT('theme', v)}
        />
      </window.TweakSection>
      <window.TweakSection label="الطباعة">
        <window.TweakSelect
          label="الخط العربي"
          value={t.font}
          options={[
            { value: 'cairo',   label: 'Cairo (افتراضي)' },
            { value: 'tajawal', label: 'Tajawal' },
            { value: 'readex',  label: 'Readex Pro' },
            { value: 'ibm',     label: 'IBM Plex Sans Arabic' },
          ]}
          onChange={v => setT('font', v)}
        />
      </window.TweakSection>
      <window.TweakSection label="التخطيط">
        <window.TweakSelect
          label="كثافة العرض"
          value={t.density}
          options={[
            { value: 'comfortable', label: 'مريحة' },
            { value: 'default',     label: 'افتراضي' },
            { value: 'compact',     label: 'كثيفة' },
          ]}
          onChange={v => setT('density', v)}
        />
      </window.TweakSection>
    </window.TweaksPanel>
  );
}

// ─── Main app ────────────────────────────────────────────────────────────
function App() {
  const [t, setT] = window.useTweaks(TweakDefaults);

  // Apply theme & font classes on body
  React.useEffect(() => {
    const body = document.body;
    body.classList.toggle('theme-dark', t.theme === 'dark');
    body.classList.remove('font-cairo','font-tajawal','font-readex','font-ibm');
    body.classList.add('font-' + t.font);
    body.classList.remove('density-comfortable','density-default','density-compact');
    body.classList.add('density-' + t.density);
  }, [t.theme, t.font, t.density]);

  // Load extra fonts on demand
  React.useEffect(() => {
    if (document.getElementById('extra-fonts')) return;
    const l = document.createElement('link');
    l.id = 'extra-fonts';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=Readex+Pro:wght@400;500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap';
    document.head.appendChild(l);
  }, []);

  // Customer mobile screens
  const customerScreens = [
    { id: 'home',       label: '01 · الصفحة الرئيسية',     C: window.StorefrontScreen },
    { id: 'catalog',    label: '02 · الكتالوج',           C: window.CatalogScreen },
    { id: 'product',    label: '03 · صفحة المنتج',         C: window.ProductDetailScreen },
    { id: 'cart',       label: '04 · السلة',               C: window.CartScreen },
    { id: 'checkout',   label: '05 · الدفع',                C: window.CheckoutScreen },
    { id: 'tracking',   label: '06 · متابعة الطلب',        C: window.TrackingScreen },
    { id: 'account',    label: '07 · الحساب',              C: window.AccountScreen },
  ];

  // Admin screens
  const adminScreens = [
    { id: 'overview',  label: '01 · نظرة عامة',           title: 'نظرة عامة',           sub: 'مرحباً كريم · 16 مايو 2026', action: 'إضافة سريعة', C: window.AdminOverview },
    { id: 'orders',    label: '02 · إدارة الطلبات',       title: 'الطلبات',             sub: '12 طلب يحتاج اهتماماً',     C: window.AdminOrders },
    { id: 'products',  label: '03 · إدارة المنتجات',      title: 'المنتجات',            sub: 'الكتالوج كله من مكان واحد', C: window.AdminProducts },
    { id: 'campaigns', label: '04 · تحليلات الإعلانات',    title: 'الحملات الإعلانية',   sub: 'متابعة الأداء عبر القنوات', C: window.AdminCampaigns },
  ];

  return (
    <React.Fragment>
      <TweaksUI t={t} setT={setT} />

      <window.DesignCanvas>
        <window.DCSection id="intro" title="تحليل المتطلبات" subtitle="نطاق MVP — العرض، البيع، المتابعة، التحليل">
          <window.DCArtboard id="req" label="Requirements brief" width={760} height={1000}>
            <RequirementsCard />
          </window.DCArtboard>
        </window.DCSection>

        <window.DCSection
          id="customer"
          title="متجر العميل · Mobile"
          subtitle="7 شاشات — تجربة فاخرة، حديثة، سريعة الطلب"
        >
          {customerScreens.map(s => (
            <window.DCArtboard key={s.id} id={s.id} label={s.label} width={402} height={874}>
              <window.IOSDevice width={402} height={874} dark={t.theme === 'dark'}>
                <div data-screen-label={s.label} style={{ height: '100%', position: 'relative' }}>
                  <s.C />
                </div>
              </window.IOSDevice>
            </window.DCArtboard>
          ))}
        </window.DCSection>

        <window.DCSection
          id="admin"
          title="لوحة الأدمن · Desktop"
          subtitle="4 لوحات — تحكم كامل + تحليلات لرفع الإنتاجية"
        >
          {adminScreens.map(s => (
            <window.DCArtboard key={s.id} id={s.id} label={s.label} width={1280} height={820}>
              <div data-screen-label={s.label} style={{ height: '100%' }}>
                <window.AdminShell active={s.id} title={s.title} sub={s.sub} action={s.action}>
                  <s.C />
                </window.AdminShell>
              </div>
            </window.DCArtboard>
          ))}
        </window.DCSection>
      </window.DesignCanvas>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
