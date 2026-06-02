import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import type { OrderStatusFilter } from '../api';
import styles from './OrdersToolbar.module.css';

interface OrdersToolbarProps {
  search: string;
  status: OrderStatusFilter;
  totalCount: number;
  onSearchChange: (v: string) => void;
  onStatusChange: (s: OrderStatusFilter) => void;
}

const STATUS_FILTERS: ReadonlyArray<{ id: OrderStatusFilter; key: string }> = [
  { id: 'all',        key: 'admin.orders.filter_all' },
  { id: 'new',        key: 'admin.orders.filter_new' },
  { id: 'preparing',  key: 'admin.orders.filter_preparing' },
  { id: 'shipping',   key: 'admin.orders.filter_shipping' },
  { id: 'delivered',  key: 'admin.orders.filter_completed' },
  { id: 'cancelled',  key: 'admin.orders.filter_cancelled' },
];

export function OrdersToolbar({
  search,
  status,
  totalCount,
  onSearchChange,
  onStatusChange,
}: OrdersToolbarProps) {
  const { t } = useTranslation('common');

  return (
    <div className={styles.toolbar}>
      <label className={styles.searchWrap}>
        <Icon name="search" size={14} className={styles.searchIcon} />
        <input
          type="search"
          className={styles.search}
          value={search}
          placeholder={t('admin.orders.search_placeholder')}
          aria-label={t('admin.orders.search_placeholder')}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>
      <div className={styles.chips} role="tablist">
        {STATUS_FILTERS.map((f) => {
          const active = status === f.id;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`${styles.chip} ${active ? styles.chipActive : ''}`}
              onClick={() => onStatusChange(f.id)}
            >
              {t(f.key)}
            </button>
          );
        })}
      </div>
      <span className={styles.countPill}>
        <strong className="num">{totalCount}</strong>{' '}
        {t('admin.orders.count_pill', { count: totalCount })}
      </span>
    </div>
  );
}
