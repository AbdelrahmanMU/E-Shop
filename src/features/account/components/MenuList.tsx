import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import type { CustomerStats } from '../api';
import styles from './MenuList.module.css';

interface MenuListProps {
  stats: CustomerStats;
  onSignOut: () => void;
}

interface MenuRowDef {
  id: string;
  to: string;
  emoji: string;
  titleKey: string;
  meta: string;
  badgeKey?: string;
}

export function MenuList({ stats, onSignOut }: MenuListProps) {
  const { t } = useTranslation('common');

  const orderMeta = t('account.menu_orders_meta', { count: stats.ordersCount });
  const activeMeta = stats.activeOrdersCount > 0
    ? ` · ${t('account.menu_orders_active', { count: stats.activeOrdersCount })}`
    : '';

  const rows: ReadonlyArray<MenuRowDef> = [
    {
      id: 'orders',
      to: '/account/orders',
      emoji: '📦',
      titleKey: 'account.menu_orders',
      meta: `${orderMeta}${activeMeta}`,
    },
    {
      id: 'favorites',
      to: '/account/favorites',
      emoji: '❤️',
      titleKey: 'account.menu_favorites',
      meta: t('account.menu_favorites_meta', { count: stats.favoritesCount }),
    },
    {
      id: 'addresses',
      to: '/account/addresses',
      emoji: '📍',
      titleKey: 'account.menu_addresses',
      meta: t('account.menu_addresses_meta', { count: 2 }),
    },
    {
      id: 'payment',
      to: '/account/payment',
      emoji: '💳',
      titleKey: 'account.menu_payment',
      meta: t('account.menu_payment_meta'),
    },
    {
      id: 'coupons',
      to: '/account/coupons',
      emoji: '🎟️',
      titleKey: 'account.menu_coupons',
      meta: t('account.menu_coupons_meta', { count: 3 }),
      badgeKey: 'account.menu_coupons_badge_new',
    },
    {
      id: 'notifications',
      to: '/account/notifications',
      emoji: '🔔',
      titleKey: 'account.menu_notifications',
      meta: t('account.menu_notifications_meta'),
    },
  ];

  return (
    <section className={styles.wrap}>
      <div className={styles.card}>
        {rows.map((row, i) => (
          <Link
            key={row.id}
            to={row.to}
            className={`${styles.row} ${i < rows.length - 1 ? styles.rowDivider : ''}`}
          >
            <div className={styles.iconTile} aria-hidden>{row.emoji}</div>
            <div className={styles.body}>
              <span className={styles.title}>{t(row.titleKey)}</span>
              <span className={`num ${styles.meta}`}>{row.meta}</span>
            </div>
            {row.badgeKey && <span className={styles.badge}>{t(row.badgeKey)}</span>}
            <Icon name="chevron" size={14} className={`icon-dir ${styles.chevron}`} />
          </Link>
        ))}
      </div>

      <button type="button" className={styles.signOut} onClick={onSignOut}>
        <span className={styles.signOutIcon} aria-hidden>↪</span>
        <span className={styles.signOutLabel}>{t('account.sign_out')}</span>
      </button>
    </section>
  );
}
