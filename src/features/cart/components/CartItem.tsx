import { useTranslation } from 'react-i18next';
import { ProductPh } from '@/components/ProductPh/ProductPh';
import type { Category, Product } from '@/types/domain';
import type { Locale } from '@/lib/rtl';
import { formatMoney } from '@/lib/money';
import { useCartActions } from '../hooks';
import { QtyStepper } from './QtyStepper';
import styles from './CartItem.module.css';

interface CartItemProps {
  product: Product;
  category: Category | undefined;
  qty: number;
  lineTotal: number; // piastres
}

export function CartItem({ product, category, qty, lineTotal }: CartItemProps) {
  const { i18n } = useTranslation('common');
  const locale = i18n.language as Locale;
  const { increment, decrement } = useCartActions();
  const name = locale === 'en' ? product.nameEn : product.nameAr;

  return (
    <div className={styles.row}>
      <div className={styles.thumb}>
        <ProductPh
          gradientA={category?.gradientA ?? '#d5cdb8'}
          gradientB={category?.gradientB ?? '#b8a98a'}
          glyph={product.glyph ?? category?.glyph}
          glyphSize={36}
          imageUrl={product.images[0]}
          alt={name}
        />
      </div>
      <div className={styles.body}>
        <span className={`eyebrow ${styles.subtitle}`}>{product.subtitle}</span>
        <span className={styles.title}>{name}</span>
        <span className={styles.weight}>{product.weight}</span>
        <div className={styles.footer}>
          <span className={`num ${styles.linePrice}`}>{formatMoney(lineTotal, locale)}</span>
          <QtyStepper
            qty={qty}
            max={product.stock}
            onDecrement={() => decrement(product.id)}
            onIncrement={() => increment(product.id)}
          />
        </div>
      </div>
    </div>
  );
}
