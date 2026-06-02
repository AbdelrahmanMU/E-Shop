import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import styles from './StorefrontHeader.module.css';

export function StorefrontHeader() {
  const { t } = useTranslation('common');

  return (
    <header className={styles.header}>
      <div className={styles.location}>
        <span className={styles.locationEyebrow}>
          <span className={styles.pin}>
            <Icon name="pin" size={13} />
          </span>
          {t('home.delivery_to')}
        </span>
        <span className={styles.locationValue}>
          {t('home.delivery_location')}
          <Icon name="chevron" size={13} className="icon-dir" style={{ color: 'var(--text-3)' }} />
        </span>
      </div>
      <button type="button" className={styles.bellBtn} aria-label="notifications">
        <Icon name="bell" size={18} />
        <span className={styles.bellDot} aria-hidden />
      </button>
    </header>
  );
}
