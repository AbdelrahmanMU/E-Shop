import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import { AdminShell } from '@/features/admin/components/AdminShell';
import { PageHeader } from '@/features/admin/components/PageHeader';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import type { Product } from '@/types/domain';
import { useAdminProducts } from '../hooks';
import type { StockFilter } from '../schemas';
import { DeleteConfirm } from './DeleteConfirm';
import { LowStockBanner } from './LowStockBanner';
import { ProductFormDrawer } from './ProductFormDrawer';
import { ProductStatsRow } from './ProductStatsRow';
import { ProductsTable } from './ProductsTable';
import { ProductsToolbar } from './ProductsToolbar';
import styles from './ProductsPage.module.css';

const STOCK_FILTERS: ReadonlyArray<StockFilter> = ['all', 'active', 'low', 'out'];

function parseStock(raw: string | null): StockFilter {
  if (!raw) return 'all';
  return (STOCK_FILTERS as ReadonlyArray<string>).includes(raw)
    ? (raw as StockFilter)
    : 'all';
}

export function ProductsPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const search = params.get('q') ?? '';
  const stock = parseStock(params.get('stock'));

  const filter = useMemo(() => ({ search, stock }), [search, stock]);
  const productsQ = useAdminProducts(filter);

  const [formProduct, setFormProduct] = useState<Product | null | undefined>(undefined);
  // `undefined` = closed, `null` = create, `Product` = edit
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value === null || value === '' || (key === 'stock' && value === 'all')) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  return (
    <AdminShell title={t('admin.products.title')} sub={t('admin.products.sub')}>
      <PageHeader
        title={t('admin.products.title')}
        sub={t('admin.products.sub')}
        actions={
          <>
            <button type="button" className={styles.secondaryAction}>
              {t('admin.products.import_excel')}
            </button>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={() => setFormProduct(null)}
            >
              <Icon name="plus" size={14} />
              {t('admin.products.new_product')}
            </button>
          </>
        }
      />

      <LowStockBanner onShowDetails={() => updateParam('stock', 'low')} />
      <ProductStatsRow />
      <ProductsToolbar
        search={search}
        stock={stock}
        totalCount={productsQ.data?.totalMatching ?? 0}
        onSearchChange={(v) => updateParam('q', v)}
        onStockChange={(s) => updateParam('stock', s)}
      />

      {productsQ.isLoading && !productsQ.data ? (
        <Skeleton width="100%" height={400} radius={14} />
      ) : (
        <ProductsTable
          rows={productsQ.data?.rows ?? []}
          isLoading={false}
          onView={(p) => navigate(`/product/${p.id}`)}
          onEdit={(p) => setFormProduct(p)}
          onDelete={(p) => setDeleteTarget(p)}
        />
      )}

      <ProductFormDrawer
        open={formProduct !== undefined}
        product={formProduct ?? null}
        onClose={() => setFormProduct(undefined)}
      />
      <DeleteConfirm product={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </AdminShell>
  );
}
