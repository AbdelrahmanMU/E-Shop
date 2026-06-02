import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import { useLowStockAlert } from '../hooks';
import styles from './LowStockBanner.module.css';

interface LowStockBannerProps {
  /** Called when the admin clicks the "see details" action. */
  onShowDetails?: () => void;
}

export function LowStockBanner({ onShowDetails }: LowStockBannerProps) {
  const { t } = useTranslation('common');
  const { data } = useLowStockAlert();

  if (!data || data.count === 0) return null;

  return (
    <div className={styles.banner} role="status">
      <span className={styles.icon} aria-hidden>
        <Icon name="alert" size={18} />
      </span>
      <div className={styles.body}>
        <span className={styles.title}>
          {t('admin.products.alert_title', { count: data.count })}
        </span>
        <span className={styles.list}>{data.productNames.join(' · ')}</span>
      </div>
      {onShowDetails && (
        <button type="button" className={styles.cta} onClick={onShowDetails}>
          {t('admin.products.alert_action')}
        </button>
      )}
    </div>
  );
}
