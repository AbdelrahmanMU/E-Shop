import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import type { IconName } from '@/components/Icon/icons';
import type { PaymentMethod } from '@/types/domain';
import styles from './PaymentSelector.module.css';

interface PaymentSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

interface MethodDef {
  id: PaymentMethod;
  icon: IconName;
  labelKey: string;
  metaKey: string;
}

const METHODS: ReadonlyArray<MethodDef> = [
  { id: 'wallet', icon: 'wallet', labelKey: 'checkout.payment_wallet', metaKey: 'checkout.payment_wallet_meta' },
  { id: 'card',   icon: 'card',   labelKey: 'checkout.payment_card',   metaKey: 'checkout.payment_card_meta' },
  { id: 'cash',   icon: 'cash',   labelKey: 'checkout.payment_cash',   metaKey: 'checkout.payment_cash_meta' },
];

export function PaymentSelector({ value, onChange }: PaymentSelectorProps) {
  const { t } = useTranslation('common');

  return (
    <div className={styles.card}>
      <span className={`eyebrow ${styles.eyebrow}`}>{t('checkout.payment_eyebrow')}</span>
      <div className={styles.list} role="radiogroup" aria-label={t('checkout.payment_eyebrow')}>
        {METHODS.map((m) => {
          const active = value === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={active}
              className={`${styles.row} ${active ? styles.rowActive : ''}`}
              onClick={() => onChange(m.id)}
            >
              <div className={`${styles.iconWrap} ${active ? styles.iconWrapActive : ''}`}>
                <Icon name={m.icon} size={18} />
              </div>
              <div className={styles.body}>
                <span className={styles.label}>{t(m.labelKey)}</span>
                <span className={`num ${styles.meta}`}>{t(m.metaKey)}</span>
              </div>
              <div className={`${styles.radio} ${active ? styles.radioActive : ''}`} aria-hidden>
                {active && <Icon name="check" size={12} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
