import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BottomNav } from '@/components/BottomNav/BottomNav';
import { Icon } from '@/components/Icon/Icon';
import { MobileShell } from '@/components/MobileShell/MobileShell';
import styles from './AccountSectionPlaceholder.module.css';

/**
 * Stand-in for the 6 account menu sub-routes (orders / favorites /
 * addresses / payment / coupons / notifications). The menu items in
 * the prototype are clearly navigable, so we wire real routes — but
 * the underlying screens belong to later slices (admin sync, real
 * favorites store, addresses CRUD, etc.).
 */
const SECTION_TITLE_KEYS: Record<string, string> = {
  orders:        'account.menu_orders',
  favorites:     'account.menu_favorites',
  addresses:     'account.menu_addresses',
  payment:       'account.menu_payment',
  coupons:       'account.menu_coupons',
  notifications: 'account.menu_notifications',
};

const SECTION_EMOJI: Record<string, string> = {
  orders:        '📦',
  favorites:     '❤️',
  addresses:     '📍',
  payment:       '💳',
  coupons:       '🎟️',
  notifications: '🔔',
};

export function AccountSectionPlaceholder() {
  const { section = '' } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const titleKey = SECTION_TITLE_KEYS[section] ?? 'nav.account';
  const emoji = SECTION_EMOJI[section] ?? '✨';

  return (
    <MobileShell bottomNav={<BottomNav active="account" />}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label={t('actions.back')}
          onClick={() => navigate('/account')}
        >
          <Icon name="back" size={18} className="icon-dir" />
        </button>
        <h1 className={styles.title}>{t(titleKey)}</h1>
      </header>

      <section className={styles.empty}>
        <span className={styles.glyph} aria-hidden>{emoji}</span>
        <h2 className={styles.emptyTitle}>{t('account.section_coming_soon')}</h2>
        <Link to="/account" className={styles.cta}>
          {t('nav.account')}
        </Link>
      </section>
    </MobileShell>
  );
}
