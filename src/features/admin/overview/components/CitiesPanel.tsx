import { useTranslation } from 'react-i18next';
import { Panel } from '@/features/admin/components/Panel';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { formatNumber } from '@/lib/money';
import type { CityRow } from '../api';
import styles from './CitiesPanel.module.css';

interface CitiesPanelProps {
  rows: CityRow[];
  isLoading: boolean;
}

export function CitiesPanel({ rows, isLoading }: CitiesPanelProps) {
  const { t } = useTranslation('common');

  if (isLoading) {
    return (
      <Panel title={t('admin.panel_cities')}>
        <Skeleton width="100%" height={140} radius={8} />
      </Panel>
    );
  }

  return (
    <Panel title={t('admin.panel_cities')}>
      <ul className={styles.list}>
        {rows.map((c) => (
          <li key={c.name}>
            <div className={styles.head}>
              <span className={styles.name}>{c.name}</span>
              <span className={`num ${styles.meta}`}>
                {formatNumber(c.orders)} · <strong className={styles.pct}>{c.pct}%</strong>
              </span>
            </div>
            <div className={styles.track}>
              <span className={styles.fill} style={{ width: `${Math.min(c.pct * 2, 100)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
