import styles from './StepIndicator.module.css';

interface StepIndicatorProps {
  total: number;
  current: number;
}

export function StepIndicator({ total, current }: StepIndicatorProps) {
  return (
    <div className={styles.row} aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`${styles.bar} ${i < current ? styles.barActive : ''}`}
        />
      ))}
    </div>
  );
}
