import { useTranslation } from 'react-i18next';
import { AdminShell } from '@/features/admin/components/AdminShell';
import {
  useAdminKpis,
  useCitiesBreakdown,
  usePeakHours,
  useRecentOrders,
  useRevenueByDay,
  useTopProducts,
} from '../hooks';
import { CitiesPanel } from './CitiesPanel';
import { KpiRow } from './KpiRow';
import { PeakHoursPanel } from './PeakHoursPanel';
import { RecentOrdersList } from './RecentOrdersList';
import { RevenueChart } from './RevenueChart';
import { TopProductsTable } from './TopProductsTable';
import styles from './OverviewPage.module.css';

export function OverviewPage() {
  const { t } = useTranslation('common');

  const kpisQ = useAdminKpis();
  const revenueQ = useRevenueByDay();
  const recentQ = useRecentOrders(6);
  const topQ = useTopProducts();
  const peakQ = usePeakHours();
  const citiesQ = useCitiesBreakdown();

  return (
    <AdminShell
      title={t('admin.overview_title')}
      sub={t('admin.overview_sub')}
      actionLabel={t('admin.quick_add')}
    >
      {/* Accessible page heading — the Topbar shows it visually but is chrome. */}
      <h1 className="sr-only">{t('admin.overview_title')}</h1>
      <KpiRow kpis={kpisQ.data} isLoading={kpisQ.isLoading} />

      <div className={styles.gridA}>
        <RevenueChart
          points={revenueQ.data?.points ?? []}
          totalEgp={revenueQ.data?.totalEgp ?? 0}
          isLoading={revenueQ.isLoading}
        />
        <RecentOrdersList orders={recentQ.data ?? []} isLoading={recentQ.isLoading} />
      </div>

      <div className={styles.gridB}>
        <TopProductsTable rows={topQ.data ?? []} isLoading={topQ.isLoading} />
        <div className={styles.sideStack}>
          <PeakHoursPanel data={peakQ.data} isLoading={peakQ.isLoading} />
          <CitiesPanel rows={citiesQ.data ?? []} isLoading={citiesQ.isLoading} />
        </div>
      </div>
    </AdminShell>
  );
}
