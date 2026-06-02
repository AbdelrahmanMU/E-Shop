import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import type { Address } from '@/types/domain';
import styles from './AddressCard.module.css';

interface AddressCardProps {
  address: Address;
  /** No-op in F2 (single demo address); becomes real in F4 (Account). */
  onChange?: () => void;
}

export function AddressCard({ address, onChange }: AddressCardProps) {
  const { t } = useTranslation('common');
  const formattedAddress = [address.line1, address.line2].filter(Boolean).join('. ');

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={`eyebrow ${styles.eyebrow}`}>{t('checkout.address_eyebrow')}</span>
        <button type="button" className={styles.changeBtn} onClick={onChange} disabled={!onChange}>
          {t('checkout.address_change')}
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.pinWrap} aria-hidden>
          <Icon name="pin" size={18} />
        </div>
        <div className={styles.text}>
          <span className={styles.label}>{address.label} · {address.district}</span>
          <span className={styles.line}>{formattedAddress}</span>
          <span className={`num ltr ${styles.phone}`}>{address.phone}</span>
        </div>
      </div>
    </div>
  );
}
