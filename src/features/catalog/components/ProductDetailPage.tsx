import { useState, type CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import { MobileShell } from '@/components/MobileShell/MobileShell';
import { ProductPh } from '@/components/ProductPh/ProductPh';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { formatMoney } from '@/lib/money';
import type { Locale } from '@/lib/rtl';
import { useCartActions } from '@/features/cart/hooks';
import { useCategory, useProduct } from '../hooks';
import styles from './ProductDetailPage.module.css';

type Tab = 'description' | 'ingredients' | 'nutrition';

const TABS: ReadonlyArray<{ id: Tab; key: string }> = [
  { id: 'description', key: 'product.tab_description' },
  { id: 'ingredients', key: 'product.tab_ingredients' },
  { id: 'nutrition',   key: 'product.tab_nutrition' },
];

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as Locale;

  const productQ = useProduct(id);
  const product = productQ.data;
  const categoryQ = useCategory(product?.categoryId);
  const category = categoryQ.data;

  const [tab, setTab] = useState<Tab>('description');
  const [favorited, setFavorited] = useState(false);
  const { add } = useCartActions();

  if (productQ.isLoading) {
    return (
      <MobileShell>
        <Skeleton width="100%" height={380} radius={0} />
        <div className={styles.body}>
          <Skeleton width="40%" height={12} />
          <Skeleton width="80%" height={24} style={{ marginTop: 8 }} />
        </div>
      </MobileShell>
    );
  }

  if (!product || productQ.isError) {
    return (
      <MobileShell>
        <div className={styles.notFound}>
          <span className={styles.notFoundGlyph}>🫥</span>
          <h1 className={styles.notFoundTitle}>{t('product.not_found_title')}</h1>
          <p className={styles.notFoundBody}>{t('product.not_found_body')}</p>
        </div>
      </MobileShell>
    );
  }

  const name = locale === 'en' ? product.nameEn : product.nameAr;
  const heroStyle: CSSProperties = {
    '--ph-a': category?.gradientA ?? '#d5cdb8',
    '--ph-b': category?.gradientB ?? '#b8a98a',
  } as CSSProperties;

  return (
    <MobileShell>
      <article className={styles.article}>
        {/* Hero */}
        <header className={styles.hero} style={heroStyle}>
          <ProductPh
            gradientA={category?.gradientA ?? '#d5cdb8'}
            gradientB={category?.gradientB ?? '#b8a98a'}
            glyph={product.glyph ?? category?.glyph}
            glyphSize={120}
            imageUrl={product.images[0]}
            alt={name}
          />
          <div className={styles.heroBar}>
            <button
              type="button"
              className={styles.glassBtn}
              aria-label={t('actions.back')}
              onClick={() => navigate(-1)}
            >
              <Icon name="back" size={18} className="icon-dir" />
            </button>
            <div className={styles.heroBarRight}>
              <button type="button" className={styles.glassBtn} aria-label={t('actions.share')}>
                <Icon name="share" size={18} />
              </button>
              <button
                type="button"
                className={`${styles.glassBtn} ${favorited ? styles.glassBtnHeart : ''}`}
                aria-label={t('actions.favorite')}
                aria-pressed={favorited}
                onClick={() => setFavorited((v) => !v)}
              >
                <Icon name="heart" size={18} />
              </button>
            </div>
          </div>
          <div className={styles.dots} aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === 0 ? styles.dotActive : ''}`}
              />
            ))}
          </div>
        </header>

        {/* Body card */}
        <div className={styles.body}>
          <span className={`eyebrow ${styles.subtitle}`}>{product.subtitle}</span>
          <h1 className={styles.title}>{name}</h1>

          <div className={styles.metaRow}>
            <Icon name="star" size={12} style={{ color: 'var(--saffron)' }} />
            <span className="num">
              <strong>{product.rating.toFixed(1)}</strong>{' '}
              <span className={styles.metaMuted}>
                ({t('common.review_count', { count: product.reviewCount })})
              </span>
            </span>
            <span className={styles.dotSep} />
            <span className={styles.metaMuted}>
              {t('common.in_stock', { count: product.stock })}
            </span>
          </div>

          {/* Size — single chip reflecting the actual product weight */}
          <section className={styles.section}>
            <span className={styles.sectionLabel}>{t('product.size_label')}</span>
            <div className={styles.sizes}>
              <span className={`${styles.sizeChip} ${styles.sizeChipActive}`}>{product.weight}</span>
            </div>
          </section>

          {/* Tabs */}
          <section className={styles.section}>
            <div className={styles.tabBar} role="tablist">
              {TABS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === d.id}
                  className={`${styles.tab} ${tab === d.id ? styles.tabActive : ''}`}
                  onClick={() => setTab(d.id)}
                >
                  {t(d.key)}
                </button>
              ))}
            </div>
            <div className={styles.tabBody}>
              {tab === 'description' ? (
                <p>{t('product.auto_description', { name, subtitle: product.subtitle })}</p>
              ) : (
                <p className={styles.tabEmpty}>{t('product.content_soon')}</p>
              )}
            </div>
          </section>

          {/* Quick badges */}
          <section className={styles.quickRow}>
            {[
              { icon: '🌱', key: 'product.badge_organic' },
              { icon: '✋', key: 'product.badge_artisan' },
              { icon: '🚚', key: 'product.badge_cold_delivery' },
            ].map((b) => (
              <div key={b.key} className={styles.quickTile}>
                <span className={styles.quickIcon} aria-hidden>{b.icon}</span>
                <span className={styles.quickLabel}>{t(b.key)}</span>
              </div>
            ))}
          </section>
        </div>
      </article>

      {/* Sticky add to cart */}
      <div className={styles.stickyBar} data-sticky="bottom">
        <div className={styles.priceBlock}>
          <span className="eyebrow" style={{ color: 'var(--text-3)' }}>{product.weight}</span>
          <div className={styles.priceLine}>
            <span className={`num ${styles.price}`}>{formatMoney(product.price, locale)}</span>
            {product.oldPrice !== undefined && (
              <span className={`num ${styles.oldPrice}`}>{formatMoney(product.oldPrice, locale)}</span>
            )}
          </div>
        </div>
        <button
          type="button"
          className={styles.addBtn}
          disabled={product.stock === 0}
          onClick={() => {
            add({ id: product.id, price: product.price, stock: product.stock });
            navigate('/cart');
          }}
        >
          <Icon name="bag" size={16} />
          {t('actions.add_to_cart')}
        </button>
      </div>
    </MobileShell>
  );
}
