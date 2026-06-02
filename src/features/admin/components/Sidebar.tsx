import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import type { IconName } from '@/components/Icon/icons';
import styles from './Sidebar.module.css';

interface NavDef {
  id: string;
  to: string;
  icon: IconName;
  labelKey: string;
  badge?: { value: string; tone?: 'warning' | 'default' };
}

const SECTION_MANAGEMENT: ReadonlyArray<NavDef> = [
  { id: 'overview',  to: '/admin',           icon: 'home',      labelKey: 'admin.nav_overview' },
  { id: 'orders',    to: '/admin/orders',    icon: 'orders',    labelKey: 'admin.nav_orders',    badge: { value: '12', tone: 'warning' } },
  { id: 'products',  to: '/admin/products',  icon: 'products',  labelKey: 'admin.nav_products' },
  { id: 'inventory', to: '/admin/inventory', icon: 'inv',       labelKey: 'admin.nav_inventory', badge: { value: '3',  tone: 'warning' } },
  { id: 'customers', to: '/admin/customers', icon: 'customers', labelKey: 'admin.nav_customers' },
];

const SECTION_MARKETING: ReadonlyArray<NavDef> = [
  { id: 'campaigns', to: '/admin/campaigns', icon: 'campaigns', labelKey: 'admin.nav_campaigns' },
  { id: 'reports',   to: '/admin/reports',   icon: 'reports',   labelKey: 'admin.nav_reports' },
];

const SECTION_SYSTEM: ReadonlyArray<NavDef> = [
  { id: 'settings',  to: '/admin/settings',  icon: 'settings',  labelKey: 'admin.nav_settings' },
];

function NavItem({ def }: { def: NavDef }) {
  const { t } = useTranslation('common');
  return (
    <NavLink
      to={def.to}
      end={def.to === '/admin'}
      className={({ isActive }) => [styles.item, isActive ? styles.itemActive : ''].join(' ')}
    >
      <span className={styles.icon}>
        <Icon name={def.icon} size={16} />
      </span>
      <span className={styles.label}>{t(def.labelKey)}</span>
      {def.badge && (
        <span className={[styles.badge, def.badge.tone === 'warning' ? styles.badgeWarning : ''].join(' ')}>
          <span className="num">{def.badge.value}</span>
        </span>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const { t } = useTranslation('common');

  return (
    <aside className={`admin-sidebar ${styles.sidebar}`} aria-label="admin navigation">
      <div className={styles.logo}>
        <div className={styles.logoLink}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M3 3h6M3 3v6M21 3h-6M21 3v6M3 21h6M3 21v-6M21 21h-6M21 21v-6"
              stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round"
            />
          </svg>
          <span className={styles.wordmark}>
            SUF<span className={styles.wordmarkAccent}>{t('admin.wordmark_accent')}</span>
          </span>
        </div>
        <span className={styles.adminPill}>{t('admin.badge')}</span>
      </div>

      <div className={styles.user}>
        <div className={styles.avatar} aria-hidden>ك.م</div>
        <div className={styles.userText}>
          <span className={styles.userName}>كريم منصور</span>
          <span className={styles.userRole}>{t('admin.user_role_owner')}</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <span className={styles.sectionLabel}>{t('admin.section_management')}</span>
        {SECTION_MANAGEMENT.map((d) => <NavItem key={d.id} def={d} />)}
        <span className={styles.sectionLabel}>{t('admin.section_marketing')}</span>
        {SECTION_MARKETING.map((d) => <NavItem key={d.id} def={d} />)}
        <span className={styles.sectionLabel}>{t('admin.section_system')}</span>
        {SECTION_SYSTEM.map((d) => <NavItem key={d.id} def={d} />)}
      </nav>

      <div className={styles.bottom}>
        <button type="button" className={styles.signOut}>
          <span aria-hidden>↪</span>
          <span>{t('admin.sign_out')}</span>
        </button>
      </div>
    </aside>
  );
}
