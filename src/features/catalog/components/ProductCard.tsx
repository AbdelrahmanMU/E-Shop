import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import { ProductPh } from '@/components/ProductPh/ProductPh';
import { formatMoney } from '@/lib/money';
import type { Category, Product } from '@/types/domain';
import type { Locale } from '@/lib/rtl';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  category: Category | undefined;
  compact?: boolean;
}

export function ProductCard({ product, category, compact = false }: ProductCardProps) {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as Locale;

  const name = locale === 'en' ? product.nameEn : product.nameAr;
  const badgeLabel = product.badge ? t(`badge.${product.badge}`) : null;
  const soldOut = product.stock === 0;

  return (
    <Link to={`/product/${product.id}`} className={styles.card} aria-label={name}>
      <div className={[styles.media, compact ? styles.mediaCompact : ''].join(' ')}>
        <ProductPh
          gradientA={category?.gradientA ?? '#d5cdb8'}
          gradientB={category?.gradientB ?? '#b8a98a'}
          glyph={product.glyph ?? category?.glyph}
          glyphSize={compact ? 44 : 52}
          imageUrl={product.images[0]}
          alt={name}
        />
        {badgeLabel && <span className={styles.badge}>{badgeLabel}</span>}
        <button
          type="button"
          className={styles.fav}
          aria-label={t('actions.favorite')}
          onClick={(e) => e.preventDefault()}
        >
          <Icon name="heart" size={16} />
        </button>
        {soldOut && <span className={styles.soldOut}>{t('common.out_of_stock')}</span>}
      </div>
      <div className={styles.body}>
        <span className={`eyebrow ${styles.subtitle}`}>{product.subtitle}</span>
        <span className={styles.title}>{name}</span>
        <div className={styles.footer}>
          <span className={`num ${styles.price}`}>{formatMoney(product.price, locale)}</span>
          <span className={styles.rating}>
            <Icon name="star" size={11} style={{ color: 'var(--saffron)' }} />
            <span className="num">{product.rating.toFixed(1)}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
