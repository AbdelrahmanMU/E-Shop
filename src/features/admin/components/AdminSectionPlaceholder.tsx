import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminShell } from './AdminShell';
import { PageHeader } from './PageHeader';
import styles from './AdminSectionPlaceholder.module.css';

/**
 * Stand-in for admin sections that haven't shipped yet (orders/products
 * land in F6, campaigns in F7, reports/customers/settings later). Keeps
 * the sidebar fully navigable while preserving the admin chrome.
 */
const SECTION_TITLE_KEYS: Record<string, string> = {
  orders:    'admin.nav_orders',
  products:  'admin.nav_products',
  inventory: 'admin.nav_inventory',
  customers: 'admin.nav_customers',
  campaigns: 'admin.nav_campaigns',
  reports:   'admin.nav_reports',
  settings:  'admin.nav_settings',
};

export function AdminSectionPlaceholder() {
  const { section = '' } = useParams<{ section: string }>();
  const { t } = useTranslation('common');

  const titleKey = SECTION_TITLE_KEYS[section] ?? 'admin.nav_overview';

  return (
    <AdminShell title={t(titleKey)} sub={t('admin.section_coming_soon')}>
      <PageHeader title={t(titleKey)} sub={t('admin.section_coming_soon')} />
      <div className={styles.empty}>
        <h2 className={styles.title}>{t('admin.section_coming_soon')}</h2>
        <Link to="/admin" className={styles.cta}>
          {t('admin.section_back_to_overview')}
        </Link>
      </div>
    </AdminShell>
  );
}
