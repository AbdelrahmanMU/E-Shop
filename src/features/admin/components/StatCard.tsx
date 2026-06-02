import { type ReactNode } from 'react';
import { Icon } from '@/components/Icon/Icon';
import type { IconName } from '@/components/Icon/icons';
import styles from './StatCard.module.css';

export type StatTone = 'default' | 'green' | 'blue' | 'orange';

interface StatCardProps {
  icon: IconName;
  iconTone?: StatTone;
  /** Δ string e.g. "+18.2%" or "-4.1%". */
  delta?: string;
  deltaUp?: boolean;
  value: string;
  /** Currency / unit suffix rendered smaller after the value. */
  unit?: string;
  label: string;
  children?: ReactNode;
}

export function StatCard({
  icon, iconTone = 'default', delta, deltaUp, value, unit, label,
}: StatCardProps) {
  return (
    <div className={`stat-card ${styles.card}`}>
      <div className={styles.header}>
        <div
          className={[styles.iconWrap, iconTone !== 'default' ? styles[`tone${iconTone[0]!.toUpperCase()}${iconTone.slice(1)}`] : '']
            .filter(Boolean)
            .join(' ')}
        >
          <Icon name={icon} size={16} />
        </div>
        {delta && (
          <span
            className={[
              styles.delta,
              deltaUp === false ? styles.deltaDown : styles.deltaUp,
            ].join(' ')}
          >
            <Icon name={deltaUp === false ? 'down' : 'up'} size={11} />
            <span className="num">{delta}</span>
          </span>
        )}
      </div>
      <div className={`num ${styles.value}`}>
        {value}
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
