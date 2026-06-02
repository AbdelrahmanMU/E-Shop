import { useMemo, useState, type CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BottomNav } from '@/components/BottomNav/BottomNav';
import { Icon } from '@/components/Icon/Icon';
import { MobileShell } from '@/components/MobileShell/MobileShell';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import type { Locale } from '@/lib/rtl';
import type { ProductBadge } from '@/types/domain';
import { useCategories, useCategory, useProducts } from '../hooks';
import type { CatalogFilter } from '../schemas';
import { FilterChips } from './FilterChips';
import { ProductCard } from './ProductCard';
import styles from './CatalogPage.module.css';

export function CatalogPage() {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as Locale;

  const [activeBadge, setActiveBadge] = useState<ProductBadge | null>(null);

  const categoriesQ = useCategories();
  const categoryQ = useCategory(categoryId);
  const filter = useMemo<CatalogFilter>(
    () => ({
      sort: 'newest',
      ...(categoryId ? { categoryId } : {}),
      ...(activeBadge ? { badge: activeBadge } : {}),
    }),
    [categoryId, activeBadge],
  );
  const productsQ = useProducts(filter);

  const category = categoryQ.data;
  const categoryById = new Map((categoriesQ.data ?? []).map((c) => [c.id, c]));
  const products = productsQ.data ?? [];

  const title = category
    ? locale === 'en' ? category.nameEn : category.nameAr
    : t('catalog.all_title');

  const subBannerStyle: CSSProperties = category
    ? { background: `linear-gradient(135deg, ${category.gradientA}, ${category.gradientB})` }
    : { background: 'linear-gradient(135deg, var(--charcoal-2), var(--charcoal))' };

  return (
    <MobileShell bottomNav={<BottomNav active="catalog" />}>
      {/* Sticky header */}
      <header className={styles.header} data-sticky="top">
        <button
          type="button"
          className={styles.iconBtn}
          aria-label={t('actions.back')}
          onClick={() => navigate(-1)}
        >
          <Icon name="back" size={18} className="icon-dir" />
        </button>
        <div className={styles.titleBlock}>
          <span className={`eyebrow ${styles.eyebrow}`}>{t('catalog.eyebrow')}</span>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <button type="button" className={styles.iconBtn} aria-label={t('home.search_placeholder')}>
          <Icon name="search" size={18} />
        </button>
      </header>

      {/* Sub-banner */}
      <section className={styles.bannerWrap}>
        <div className={styles.banner} style={subBannerStyle}>
          <span className={styles.bannerGlyph} aria-hidden>
            {category?.glyph ?? '🛒'}
          </span>
          <div className={styles.bannerContent}>
            <span className={`eyebrow ${styles.bannerEyebrow}`}>{t('catalog.harvest_eyebrow')}</span>
            <span className={styles.bannerTitle}>{t('catalog.harvest_title')}</span>
            <span className={`num ${styles.bannerCount}`}>
              {productsQ.isLoading
                ? '— —'
                : t('common.products_count', { count: products.length })}
            </span>
          </div>
        </div>
      </section>

      <FilterChips active={activeBadge} onChange={setActiveBadge} />

      {/* Count + sort */}
      <div className={styles.toolbar}>
        <span className={`num ${styles.count}`}>
          <strong>{products.length}</strong> {t('common.product_unit', { count: products.length })}
        </span>
        <button type="button" className={styles.sortBtn}>
          {t('catalog.sort_newest')}
          <Icon name="chevron" size={12} className="icon-dir" style={{ color: 'var(--text-3)', transform: 'rotate(-90deg)' }} />
        </button>
      </div>

      {/* Grid */}
      <section className={styles.grid}>
        {productsQ.isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height={220} radius={14} />)
          : products.length === 0
            ? (
              <div className={styles.empty}>
                <span className={styles.emptyGlyph}>🫥</span>
                <span className={styles.emptyTitle}>{t('catalog.empty_title')}</span>
                <span className={styles.emptyBody}>{t('catalog.empty_body')}</span>
              </div>
            )
            : products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  category={categoryById.get(p.categoryId)}
                />
              ))}
      </section>

      <div className={styles.spacer} />
    </MobileShell>
  );
}
