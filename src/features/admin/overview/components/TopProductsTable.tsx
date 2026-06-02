import { useTranslation } from 'react-i18next';
import { Panel } from '@/features/admin/components/Panel';
import { ProductPh } from '@/components/ProductPh/ProductPh';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { formatMoney, formatNumber } from '@/lib/money';
import type { Locale } from '@/lib/rtl';
import type { TopProductRow } from '../api';
import styles from './TopProductsTable.module.css';

interface TopProductsTableProps {
  rows: TopProductRow[];
  isLoading: boolean;
}

/** Synthetic sparkline path — deterministic per row index, mock-only. */
function sparkPath(i: number): string {
  return `M0,${30 - i * 2} Q20,${20 + i * 3} 40,${22 - i} T80,${10 + i * 2} L100,${8 + i * 3}`;
}

export function TopProductsTable({ rows, isLoading }: TopProductsTableProps) {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as Locale;

  return (
    <Panel
      title={t('admin.panel_top_selling')}
      rightSlot={<a className={styles.link} href="/admin/products">{t('admin.panel_top_period')}</a>}
    >
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thStart}>{t('admin.table_product')}</th>
              <th>{t('admin.table_category')}</th>
              <th>{t('admin.table_units')}</th>
              <th>{t('admin.table_revenue')}</th>
              <th aria-hidden />
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5}><Skeleton width="100%" height={32} radius={6} /></td>
                  </tr>
                ))
              : rows.map((r, i) => {
                  const name = locale === 'en' ? r.product.nameEn : r.product.nameAr;
                  const catLabel = r.category
                    ? (locale === 'en' ? r.category.nameEn : r.category.nameAr)
                    : '—';
                  return (
                    <tr key={r.product.id}>
                      <td>
                        <div className={styles.productCell}>
                          <div className={styles.thumb}>
                            <ProductPh
                              gradientA={r.category?.gradientA ?? '#d5cdb8'}
                              gradientB={r.category?.gradientB ?? '#b8a98a'}
                              glyph={r.product.glyph ?? r.category?.glyph}
                              glyphSize={20}
                            />
                          </div>
                          <div className={styles.productText}>
                            <span className={styles.productName}>{name}</span>
                            <span className={`num ltr ${styles.productCode}`}>#{r.product.id.toUpperCase()}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.catChip}>{catLabel}</span>
                      </td>
                      <td className={`num ${styles.units}`}>{formatNumber(r.sold)}</td>
                      <td className={`num ${styles.revenue}`}>{formatMoney(r.revenue, locale)}</td>
                      <td>
                        <svg className={styles.spark} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
                          <path d={sparkPath(i)} />
                        </svg>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
