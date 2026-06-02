import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import { AdminShell } from '@/features/admin/components/AdminShell';
import { PageHeader } from '@/features/admin/components/PageHeader';
import { Pagination } from '@/features/admin/components/Pagination';
import { StatCard } from '@/features/admin/components/StatCard';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { formatNumber } from '@/lib/money';
import type { OrderStatus } from '@/types/domain';
import { useAdminOrderMiniStats, useAdminOrders } from '../hooks';
import type { AdminOrdersFilter, OrderStatusFilter } from '../api';
import { OrdersTable } from './OrdersTable';
import { OrdersToolbar } from './OrdersToolbar';
import styles from './OrdersPage.module.css';

const PAGE_SIZE = 8;

const VALID_STATUSES: ReadonlyArray<OrderStatusFilter> = [
  'all', 'new', 'preparing', 'shipping', 'delivered', 'cancelled',
];

function parseStatus(raw: string | null): OrderStatusFilter {
  if (!raw) return 'all';
  return (VALID_STATUSES as ReadonlyArray<string>).includes(raw)
    ? (raw as OrderStatusFilter)
    : 'all';
}

export function OrdersPage() {
  const { t } = useTranslation('common');
  const [params, setParams] = useSearchParams();

  const search = params.get('q') ?? '';
  const status = parseStatus(params.get('status'));
  const page = Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1);

  const filter = useMemo<AdminOrdersFilter>(
    () => ({ search, status, page, pageSize: PAGE_SIZE }),
    [search, status, page],
  );

  const ordersQ = useAdminOrders(filter);
  const statsQ = useAdminOrderMiniStats();

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value === null || value === '' || (key === 'status' && value === 'all') || (key === 'page' && value === '1')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    // Resetting filter or search returns to page 1.
    if (key !== 'page') next.delete('page');
    setParams(next, { replace: true });
  };

  const onSearchChange = (v: string) => updateParam('q', v);
  const onStatusChange = (s: OrderStatusFilter) => updateParam('status', s);
  const onPageChange = (p: number) => updateParam('page', String(p));

  const stats = statsQ.data;
  const STAT_DEFS: ReadonlyArray<{ key: string; value: number | undefined; status?: OrderStatus | null }> = [
    { key: 'admin.orders.stat_total',     value: stats?.total },
    { key: 'admin.orders.stat_new',       value: stats?.newOrders,     status: 'new' },
    { key: 'admin.orders.stat_preparing', value: stats?.preparing,     status: 'preparing' },
    { key: 'admin.orders.stat_shipping',  value: stats?.shipping,      status: 'shipping' },
    { key: 'admin.orders.stat_completed', value: stats?.completedToday, status: 'delivered' },
  ];

  return (
    <AdminShell title={t('admin.orders.title')} sub={t('admin.orders.sub')}>
      <PageHeader
        title={t('admin.orders.title')}
        sub={t('admin.orders.sub')}
        actions={
          <>
            <button type="button" className={styles.secondaryAction}>
              {t('admin.orders.export_csv')}
            </button>
            <button type="button" className={styles.primaryAction}>
              <Icon name="plus" size={14} />
              {t('admin.orders.new_manual')}
            </button>
          </>
        }
      />

      <div className={styles.statsRow}>
        {STAT_DEFS.map((s) => (
          <StatCard
            key={s.key}
            icon="orders"
            iconTone="default"
            value={statsQ.isLoading || s.value === undefined ? '—' : formatNumber(s.value)}
            label={t(s.key)}
          />
        ))}
      </div>

      <OrdersToolbar
        search={search}
        status={status}
        totalCount={ordersQ.data?.totalMatching ?? 0}
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
      />

      {ordersQ.isLoading && !ordersQ.data ? (
        <Skeleton width="100%" height={320} radius={14} />
      ) : (
        <OrdersTable rows={ordersQ.data?.rows ?? []} isLoading={false} />
      )}

      {ordersQ.data && ordersQ.data.totalMatching > PAGE_SIZE && (
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          totalCount={ordersQ.data.totalMatching}
          showingCount={ordersQ.data.rows.length}
          onPageChange={onPageChange}
        />
      )}
    </AdminShell>
  );
}
