import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BottomNav } from '@/components/BottomNav/BottomNav';
import { Icon } from '@/components/Icon/Icon';
import { MobileShell } from '@/components/MobileShell/MobileShell';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { useCheckoutCustomer } from '@/features/checkout/hooks';
import { computeTotals } from '@/features/checkout/pricing';
import { useCategories, useProducts } from '@/features/catalog/hooks';
import { useCartActions, useCartItemCount, useCartItems, useCartLineCount } from '../hooks';
import { CartItem } from './CartItem';
import { PromoInput } from './PromoInput';
import { SummaryCard } from './SummaryCard';
import styles from './CartPage.module.css';

export function CartPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const items = useCartItems();
  const lineCount = useCartLineCount();
  const pieceCount = useCartItemCount();
  const { clear } = useCartActions();
  const { customer } = useCheckoutCustomer();

  const productsQ = useProducts({ sort: 'newest' });
  const categoriesQ = useCategories();
  const productById = useMemo(
    () => new Map((productsQ.data ?? []).map((p) => [p.id, p])),
    [productsQ.data],
  );
  const categoryById = useMemo(
    () => new Map((categoriesQ.data ?? []).map((c) => [c.id, c])),
    [categoriesQ.data],
  );

  const totals = useMemo(
    () => computeTotals(items, { premium: customer.tier === 'premium' }),
    [items, customer.tier],
  );

  const isEmpty = items.length === 0;

  return (
    <MobileShell bottomNav={<BottomNav active="cart" cartCount={pieceCount} />}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label={t('actions.back')}
          onClick={() => navigate(-1)}
        >
          <Icon name="back" size={18} className="icon-dir" />
        </button>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{t('cart.title')}</h1>
          {!isEmpty && (
            <span className={`num ${styles.subtitle}`}>
              {t('cart.summary_lines', { count: lineCount, lines: lineCount, pieces: pieceCount })}
            </span>
          )}
        </div>
        {!isEmpty && (
          <button type="button" className={styles.clearBtn} onClick={clear}>
            {t('cart.empty_action')}
          </button>
        )}
      </header>

      {isEmpty ? (
        <section className={styles.empty}>
          <span className={styles.emptyGlyph} aria-hidden>🛒</span>
          <h2 className={styles.emptyTitle}>{t('cart.empty_title')}</h2>
          <p className={styles.emptyBody}>{t('cart.empty_body')}</p>
          <Link to="/catalog" className={styles.emptyCta}>
            {t('cart.empty_browse')}
          </Link>
        </section>
      ) : (
        <>
          <section className={styles.itemsList}>
            {productsQ.isLoading ? (
              <>
                <Skeleton height={96} radius={14} />
                <Skeleton height={96} radius={14} />
              </>
            ) : (
              items.map((line) => {
                const product = productById.get(line.productId);
                if (!product) return null;
                return (
                  <CartItem
                    key={line.productId}
                    product={product}
                    category={categoryById.get(product.categoryId)}
                    qty={line.qty}
                    lineTotal={line.priceAtAdd * line.qty}
                  />
                );
              })
            )}
            <PromoInput />
            <SummaryCard totals={totals} />
          </section>

          <div className={styles.bottomSpacer} />

          <div className={styles.stickyBar} data-sticky="bottom">
            <button
              type="button"
              className={styles.checkoutBtn}
              onClick={() => navigate('/checkout')}
            >
              {t('cart.checkout_cta')}
              <Icon name="back" size={16} />
            </button>
          </div>
        </>
      )}
    </MobileShell>
  );
}
