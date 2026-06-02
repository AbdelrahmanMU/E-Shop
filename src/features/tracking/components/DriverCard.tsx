import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import type { DemoDriver } from '../driver';
import styles from './DriverCard.module.css';

interface DriverCardProps {
  driver: DemoDriver;
}

export function DriverCard({ driver }: DriverCardProps) {
  const { t } = useTranslation('common');

  return (
    <div className={styles.card}>
      <div className={styles.avatar} aria-hidden>{driver.initials}</div>
      <div className={styles.body}>
        <span className={styles.name}>{driver.name}</span>
        <span className={styles.meta}>
          <Icon name="star" size={11} style={{ color: 'var(--saffron)' }} />
          <span className="num">{driver.rating.toFixed(1)}</span>
          <span className={styles.dot} aria-hidden />
          <span>{t('tracking.driver_role')}</span>
        </span>
      </div>
      <button
        type="button"
        className={`${styles.actionBtn} ${styles.chatBtn}`}
        aria-label={t('tracking.driver_chat_aria')}
      >
        💬
      </button>
      <a
        href={`tel:${driver.phone}`}
        className={`${styles.actionBtn} ${styles.callBtn}`}
        aria-label={t('tracking.driver_call_aria')}
      >
        📞
      </a>
    </div>
  );
}
