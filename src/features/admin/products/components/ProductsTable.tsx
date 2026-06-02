import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import { ProductPh } from '@/components/ProductPh/ProductPh';
import { StatusChip } from '@/features/admin/components/StatusChip';
import { useCategories } from '@/features/catalog/hooks';
import { formatMoney, formatNumber } from '@/lib/money';
import type { Locale } from '@/lib/rtl';
import type { Product } from '@/types/domain';
import { deriveStockLevel } from '../api';
import styles from './ProductsTable.module.css';

interface ProductsTableProps {
  rows: Product[];
  isLoading: boolean;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductsTable({
  rows,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as Locale;
  const { data: categories } = useCategories();
  const catById = new Map((categories ?? []).map((c) => [c.id, c]));

  const renderStockBar = (stock: number, level: ReturnType<typeof deriveStockLevel>) => {
    const pct = stock === 0 ? 100 : Math.min(stock, 100);
    const colorVar =
      level === 'out' ? 'var(--red)' : level === 'low' ? 'var(--orange)' : 'var(--green)';
    return (
      <div className={styles.stockCell}>
        <span
          className={`num ${styles.stockNum}`}
          style={{ color: level === 'out' ? 'var(--red)' : 'var(--text)' }}
        >
          {formatNumber(stock)}
        </span>
        <span className={styles.stockTrack}>
          <span
            className={styles.stockFill}
            style={{ width: `${pct}%`, background: colorVar }}
          />
        </span>
      </div>
    );
  };

  return (
    <div className={styles.panel}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thStart}>{t('admin.products.col_product')}</th>
              <th>{t('admin.products.col_category')}</th>
              <th>{t('admin.products.col_price')}</th>
              <th>{t('admin.products.col_stock')}</th>
              <th>{t('admin.products.col_sold')}</th>
              <th>{t('admin.products.col_rating')}</th>
              <th>{t('admin.products.col_status')}</th>
              <th aria-hidden />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}><td colSpan={8} className={styles.skeleton}>—</td></tr>
              ))
            ) : rows.length === 0 ? (
              <tr><td colSpan={8} className={styles.empty}>{t('admin.products.empty_title')}</td></tr>
            ) : (
              rows.map((p) => {
                const cat = catById.get(p.categoryId);
                const catLabel = cat ? (locale === 'en' ? cat.nameEn : cat.nameAr) : '—';
                const level = deriveStockLevel(p.stock);
                const name = locale === 'en' ? p.nameEn : p.nameAr;
                return (
                  <tr key={p.id} className={styles.row}>
                    <td>
                      <div className={styles.productCell}>
                        <div className={styles.thumb}>
                          <ProductPh
                            gradientA={cat?.gradientA ?? '#d5cdb8'}
                            gradientB={cat?.gradientB ?? '#b8a98a'}
                            glyph={p.glyph ?? cat?.glyph}
                            glyphSize={24}
                          />
                        </div>
                        <div className={styles.productText}>
                          <span className={styles.productName}>{name}</span>
                          <span className={`num ltr ${styles.productCode}`}>
                            #{p.id.toUpperCase()} · {p.weight}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td><span className={styles.catChip}>{catLabel}</span></td>
                    <td className={`num ${styles.priceCell}`}>{formatMoney(p.price, locale)}</td>
                    <td>{renderStockBar(p.stock, level)}</td>
                    <td className={`num ${styles.numericCell}`}>{formatNumber(p.reviewCount * 2)}</td>
                    <td>
                      <span className={styles.ratingCell}>
                        <Icon name="star" size={11} style={{ color: 'var(--saffron)' }} />
                        <span className="num">{p.rating.toFixed(1)}</span>
                      </span>
                    </td>
                    <td><StatusChip kind="product" level={level} /></td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${styles.viewBtn}`}
                          aria-label={t('admin.products.row_view')}
                          onClick={() => onView?.(p)}
                        >
                          <Icon name="eye" size={14} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${styles.editBtn}`}
                          aria-label={t('admin.products.row_edit')}
                          onClick={() => onEdit?.(p)}
                        >
                          <Icon name="edit" size={14} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          aria-label={t('admin.products.row_delete')}
                          onClick={() => onDelete?.(p)}
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
