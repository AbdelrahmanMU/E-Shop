import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductPh } from '@/components/ProductPh/ProductPh';
import type { Category } from '@/types/domain';
import type { Locale } from '@/lib/rtl';
import styles from './CategoryTile.module.css';

interface CategoryTileProps {
  category: Category;
  productCount: number;
}

export function CategoryTile({ category, productCount }: CategoryTileProps) {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as Locale;

  const label = locale === 'en' ? category.nameEn : category.nameAr;

  return (
    <Link to={`/catalog/${category.id}`} className={styles.tile} aria-label={label}>
      <div className={styles.thumb}>
        <ProductPh
          gradientA={category.gradientA}
          gradientB={category.gradientB}
          glyph={category.glyph}
          glyphSize={32}
        />
      </div>
      <span className={styles.label}>{label}</span>
      <span className={`num ${styles.count}`}>
        {t('common.products_count', { count: productCount })}
      </span>
    </Link>
  );
}
