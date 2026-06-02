import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import styles from './QtyStepper.module.css';

interface QtyStepperProps {
  qty: number;
  min?: number;
  max?: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

export function QtyStepper({ qty, min = 1, max, onDecrement, onIncrement }: QtyStepperProps) {
  const { t } = useTranslation('common');
  const decDisabled = qty <= min;
  const incDisabled = max !== undefined && qty >= max;

  return (
    <div className={styles.stepper}>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnMinus}`}
        aria-label={t('cart.qty_decrease')}
        disabled={decDisabled}
        onClick={onDecrement}
      >
        <Icon name="minus" size={14} />
      </button>
      <span className={`num ${styles.qty}`}>{qty}</span>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnPlus}`}
        aria-label={t('cart.qty_increase')}
        disabled={incDisabled}
        onClick={onIncrement}
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}
