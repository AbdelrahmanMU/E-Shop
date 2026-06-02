import { useTranslation } from 'react-i18next';
import { formatNumber } from '@/lib/money';
import type { CustomerStats } from '../api';
import styles from './StatsCard.module.css';

interface StatsCardProps {
  stats: CustomerStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const { t } = useTranslation('common');

  const cells = [
    { value: stats.ordersCount,     label: t('account.stats_orders') },
    { value: stats.favoritesCount,  label: t('account.stats_favorites') },
    { value: stats.loyaltyPoints,   label: t('account.stats_loyalty') },
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        {cells.map((c, i) => (
          <div
            key={c.label}
            className={`${styles.cell} ${i < cells.length - 1 ? styles.cellDivider : ''}`}
          >
            <span className={`num ${styles.value}`}>{formatNumber(c.value)}</span>
            <span className={styles.label}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
