import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BottomNav } from '@/components/BottomNav/BottomNav';
import { Icon } from '@/components/Icon/Icon';
import { MobileShell } from '@/components/MobileShell/MobileShell';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { useCategories, useFeaturedProducts, useProducts } from '../hooks';
import { CategoryTile } from './CategoryTile';
import { ProductCard } from './ProductCard';
import { StorefrontHeader } from './StorefrontHeader';
import styles from './HomePage.module.css';

const CATEGORY_PREVIEW_COUNT = 6;

export function HomePage() {
  const { t } = useTranslation('common');

  const categoriesQ = useCategories();
  const featuredQ = useFeaturedProducts(4);
  const allProductsQ = useProducts({ sort: 'newest' });

  const categories = categoriesQ.data ?? [];
  const featured = featuredQ.data ?? [];
  const allProducts = allProductsQ.data ?? [];

  const countByCategory = new Map<string, number>();
  for (const p of allProducts) {
    countByCategory.set(p.categoryId, (countByCategory.get(p.categoryId) ?? 0) + 1);
  }
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  return (
    <MobileShell bottomNav={<BottomNav active="home" />}>
      <StorefrontHeader />

      {/* Hero card */}
      <section className={styles.heroWrap}>
        <div className={styles.hero}>
          <div className="hero-ph" />
          <div className="hero-gradient" />
          <div className={styles.heroContent}>
            <span className={`eyebrow ${styles.heroEyebrow}`}>{t('home.hero_eyebrow')}</span>
            <div>
              <h1 className={styles.heroTitle}>
                <span className={styles.heroTitleAr}>{t('home.hero_title')}</span>
                <span className={styles.heroTitleEn}>{t('home.hero_subtitle')}</span>
              </h1>
              <p className={styles.heroCaption}>{t('home.hero_caption')}</p>
              <Link to="/catalog" className={styles.heroCta}>
                {t('actions.discover')}
                <Icon name="forward" size={14} className="icon-dir" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className={styles.searchWrap}>
        <Link to="/catalog" className={styles.search}>
          <Icon name="search" size={16} style={{ color: 'var(--text-3)' }} />
          <span>{t('home.search_placeholder')}</span>
        </Link>
      </section>

      {/* Categories */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <div>
            <span className={`eyebrow ${styles.sectionEyebrow}`}>{t('home.categories_eyebrow')}</span>
            <h2 className={styles.sectionTitle}>{t('home.categories_title')}</h2>
          </div>
          <Link to="/catalog" className={styles.sectionLink}>
            {t('actions.view_all')}
          </Link>
        </header>

        {categoriesQ.isLoading ? (
          <div className={`scroll-x ${styles.categoriesRow}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} width={84} height={108} radius={14} />
            ))}
          </div>
        ) : (
          <div className={`scroll-x ${styles.categoriesRow}`}>
            {categories.slice(0, CATEGORY_PREVIEW_COUNT).map((c) => (
              <CategoryTile
                key={c.id}
                category={c}
                productCount={countByCategory.get(c.id) ?? 0}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <div>
            <span className={`eyebrow ${styles.sectionEyebrow}`}>{t('home.featured_eyebrow')}</span>
            <h2 className={styles.sectionTitle}>{t('home.featured_title')}</h2>
          </div>
          <Link to="/catalog" className={styles.sectionLink}>
            {t('actions.see_all')}
          </Link>
        </header>

        <div className={styles.featuredGrid}>
          {featuredQ.isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} height={220} radius={14} />
              ))
            : featured.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  category={categoryById.get(p.categoryId)}
                />
              ))}
        </div>
      </section>

      {/* Heritage banner */}
      <section className={styles.bannerWrap}>
        <div className={styles.banner}>
          <span className={styles.bannerGlyph} aria-hidden>🫒</span>
          <span className={`eyebrow ${styles.bannerEyebrow}`}>{t('home.story_eyebrow')}</span>
          <p className={styles.bannerQuote}>&ldquo;{t('home.story_quote')}&rdquo;</p>
          <p className={styles.bannerBody}>{t('home.story_body')}</p>
        </div>
      </section>

      <div className={styles.spacer} />
    </MobileShell>
  );
}
