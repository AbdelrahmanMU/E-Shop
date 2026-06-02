import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import styles from './PromoInput.module.css';

/**
 * Display-only in F2 — matches the prototype's static promo card.
 * Real promo logic ships in a later slice once we have a coupons table.
 */
export function PromoInput() {
  const { t } = useTranslation('common');
  return (
    <button type="button" className={styles.box} disabled>
      <span className={styles.glyph} aria-hidden>🎟️</span>
      <div className={styles.text}>
        <span className={styles.title}>{t('cart.promo_title')}</span>
        <span className={styles.subtitle}>{t('cart.promo_subtitle')}</span>
      </div>
      <Icon name="chevron" size={14} className="icon-dir" style={{ color: 'var(--text-3)' }} />
    </button>
  );
}
