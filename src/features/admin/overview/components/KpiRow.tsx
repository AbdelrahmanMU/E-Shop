import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { StatCard } from '@/features/admin/components/StatCard';
import { formatNumber, toEgp } from '@/lib/money';
import type { Locale } from '@/lib/rtl';
import type { AdminKpis } from '../api';
import styles from './KpiRow.module.css';

interface KpiRowProps {
  kpis: AdminKpis | undefined;
  isLoading: boolean;
}

export function KpiRow({ kpis, isLoading }: KpiRowProps) {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as Locale;

  if (isLoading || !kpis) {
    return (
      <div className={styles.row}>
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} height={108} radius={14} />
        ))}
      </div>
    );
  }

  const fmtCurrency = (piastres: number): string => {
    const egp = toEgp(piastres);
    return formatNumber(Math.round(egp));
  };

  return (
    <div className={styles.row}>
      <StatCard
        icon="up"
        iconTone="default"
        delta={kpis.deltas.salesToday}
        deltaUp
        value={fmtCurrency(kpis.salesToday)}
        unit={locale === 'en' ? 'EGP' : 'ج.م'}
        label={t('admin.kpi_sales_today')}
      />
      <StatCard
        icon="orders"
        iconTone="blue"
        delta={t('admin.kpi_delta_morning', { count: kpis.deltas.morningOrders })}
        deltaUp
        value={formatNumber(kpis.newOrders)}
        label={t('admin.kpi_new_orders')}
      />
      <StatCard
        icon="products"
        iconTone="green"
        delta={kpis.deltas.aov}
        deltaUp
        value={fmtCurrency(kpis.aov)}
        unit={locale === 'en' ? 'EGP' : 'ج.م'}
        label={t('admin.kpi_aov')}
      />
      <StatCard
        icon="customers"
        iconTone="orange"
        delta={kpis.deltas.newCustomers}
        deltaUp={false}
        value={formatNumber(kpis.newCustomers)}
        label={t('admin.kpi_new_customers')}
      />
    </div>
  );
}

