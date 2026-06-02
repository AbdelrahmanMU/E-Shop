import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import type { StockFilter } from '../schemas';
import styles from './ProductsToolbar.module.css';

interface ProductsToolbarProps {
  search: string;
  stock: StockFilter;
  totalCount: number;
  onSearchChange: (v: string) => void;
  onStockChange: (s: StockFilter) => void;
}

const FILTERS: ReadonlyArray<{ id: StockFilter; key: string }> = [
  { id: 'all',     key: 'admin.products.filter_all' },
  { id: 'active',  key: 'admin.products.filter_active' },
  { id: 'low',     key: 'admin.products.filter_low' },
  { id: 'out',     key: 'admin.products.filter_out' },
];

export function ProductsToolbar({
  search,
  stock,
  totalCount,
  onSearchChange,
  onStockChange,
}: ProductsToolbarProps) {
  const { t } = useTranslation('common');

  return (
    <div className={styles.toolbar}>
      <label className={styles.searchWrap}>
        <Icon name="search" size={14} className={styles.searchIcon} />
        <input
          type="search"
          className={styles.search}
          value={search}
          placeholder={t('admin.products.search_placeholder')}
          aria-label={t('admin.products.search_placeholder')}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>
      <div className={styles.chips} role="tablist">
        {FILTERS.map((f) => {
          const active = stock === f.id;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`${styles.chip} ${active ? styles.chipActive : ''}`}
              onClick={() => onStockChange(f.id)}
            >
              {t(f.key)}
            </button>
          );
        })}
      </div>
      <span className={styles.countPill}>
        <strong className="num">{totalCount}</strong>{' '}
        {t('admin.products.count_pill', { count: totalCount })}
      </span>
    </div>
  );
}
