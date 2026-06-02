import { useTranslation } from 'react-i18next';
import type { ProductBadge } from '@/types/domain';
import styles from './FilterChips.module.css';

interface FilterChipsProps {
  active: ProductBadge | null;
  onChange: (badge: ProductBadge | null) => void;
}

const BADGES: ReadonlyArray<{ id: ProductBadge | null; key: string }> = [
  { id: null,           key: 'catalog.filter_all' },
  { id: 'handmade',     key: 'catalog.filter_handmade' },
  { id: 'organic',      key: 'catalog.filter_organic' },
  { id: 'limited',      key: 'catalog.filter_limited' },
  { id: 'bestseller',   key: 'catalog.filter_bestseller' },
];

export function FilterChips({ active, onChange }: FilterChipsProps) {
  const { t } = useTranslation('common');

  return (
    <div className={`scroll-x ${styles.row}`} role="tablist" aria-label={t('catalog.eyebrow')}>
      {BADGES.map((b) => {
        const isActive = active === b.id;
        return (
          <button
            key={b.id ?? 'all'}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`pill ${isActive ? 'active' : 'outline'}`}
            onClick={() => onChange(b.id)}
          >
            {t(b.key)}
          </button>
        );
      })}
    </div>
  );
}
