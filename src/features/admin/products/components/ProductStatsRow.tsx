import { useTranslation } from 'react-i18next';
import { StatCard } from '@/features/admin/components/StatCard';
import { formatNumber } from '@/lib/money';
import { useProductsStats } from '../hooks';
import styles from './ProductStatsRow.module.css';

export function ProductStatsRow() {
  const { t } = useTranslation('common');
  const { data, isLoading } = useProductsStats();

  const cells = [
    { key: 'admin.products.stat_total',         value: data?.total,  tone: 'default' as const, icon: 'products' as const },
    { key: 'admin.products.stat_active',        value: data?.active, tone: 'green'   as const, icon: 'products' as const },
    { key: 'admin.products.stat_low_stock',     value: data?.low,    tone: 'orange'  as const, icon: 'alert'    as const },
    { key: 'admin.products.stat_out_of_stock',  value: data?.out,    tone: 'default' as const, icon: 'alert'    as const },
  ];

  return (
    <div className={styles.row}>
      {cells.map((c) => (
        <StatCard
          key={c.key}
          icon={c.icon}
          iconTone={c.tone}
          value={isLoading || c.value === undefined ? '—' : formatNumber(c.value)}
          label={t(c.key)}
        />
      ))}
    </div>
  );
}
