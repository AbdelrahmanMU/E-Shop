import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import { Panel } from '@/features/admin/components/Panel';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { formatMoney } from '@/lib/money';
import type { Locale } from '@/lib/rtl';
import type { OrderStatus } from '@/types/domain';
import type { RecentOrder } from '../api';
import styles from './RecentOrdersList.module.css';

interface RecentOrdersListProps {
  orders: RecentOrder[];
  isLoading: boolean;
}

const STATUS_TO_TONE: Record<OrderStatus, string> = {
  new:        styles.dot ?? '',
  preparing:  `${styles.dot ?? ''} ${styles.dotOrange ?? ''}`,
  shipping:   `${styles.dot ?? ''} ${styles.dotBlue ?? ''}`,
  delivered:  `${styles.dot ?? ''} ${styles.dotGreen ?? ''}`,
  cancelled:  `${styles.dot ?? ''} ${styles.dotOrange ?? ''}`,
};

export function RecentOrdersList({ orders, isLoading }: RecentOrdersListProps) {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as Locale;

  return (
    <Panel
      title={t('admin.panel_recent_orders')}
      rightSlot={
        <a className={styles.viewAll} href="/admin/orders">
          {t('admin.panel_view_all')}
          <Icon name="arrowL" size={11} className="icon-dir" />
        </a>
      }
    >
      <ul className={styles.list}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className={styles.skeletonRow}>
                <Skeleton width={10} height={10} radius={9999} />
                <Skeleton width="60%" height={12} />
              </li>
            ))
          : orders.map((o) => (
              <li key={o.id} className={styles.row}>
                <span className={STATUS_TO_TONE[o.status]} aria-hidden />
                <div className={styles.body}>
                  <span className={styles.title}>
                    {o.customerName} · {t('admin.items_count', { count: o.itemCount })}
                  </span>
                  <span className={`num ltr ${styles.meta}`}>
                    {o.id} ·{' '}
                    <span className={styles.metaTotal}>{formatMoney(o.total, locale)}</span>
                  </span>
                </div>
                <span className={`num ${styles.time}`}>{o.timeAgo}</span>
              </li>
            ))}
      </ul>
    </Panel>
  );
}
