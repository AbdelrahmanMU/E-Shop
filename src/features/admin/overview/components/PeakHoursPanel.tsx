import { useTranslation } from 'react-i18next';
import { Panel } from '@/features/admin/components/Panel';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { formatNumber } from '@/lib/money';
import type { PeakHourPoint, PeakHoursResult } from '../api';
import styles from './PeakHoursPanel.module.css';

interface PeakHoursPanelProps {
  data: PeakHoursResult | undefined;
  isLoading: boolean;
}

function toneClass(value: number, max: number): string {
  const ratio = max > 0 ? value / max : 0;
  if (ratio > 0.65) return styles.barHot ?? '';
  if (ratio > 0.45) return styles.barWarm ?? '';
  return styles.barCool ?? '';
}

export function PeakHoursPanel({ data, isLoading }: PeakHoursPanelProps) {
  const { t } = useTranslation('common');

  if (isLoading || !data) {
    return (
      <Panel title={t('admin.panel_peak_hours')} sub={t('admin.panel_peak_today')}>
        <Skeleton width="100%" height={120} radius={8} />
      </Panel>
    );
  }

  const max = Math.max(...data.points.map((p) => p.value));

  return (
    <Panel
      title={t('admin.panel_peak_hours')}
      rightSlot={<span className={styles.todayTag}>{t('admin.panel_peak_today')}</span>}
    >
      <div className={styles.barsRow}>
        {data.points.map((h: PeakHourPoint) => (
          <div key={h.hour} className={styles.col}>
            <div
              className={[styles.bar, toneClass(h.value, max)].join(' ')}
              style={{ height: `${(h.value / max) * 100}%` }}
              title={`${h.hour}:00 · ${h.value}`}
              aria-label={`${h.hour}:00`}
            />
            <span className={`num ${styles.hour}`}>{h.hour}</span>
          </div>
        ))}
      </div>
      <div className={styles.peakRow}>
        <span className={styles.peakLabel}>{t('admin.peak_label')}</span>
        <span className={`num ${styles.peakValue}`}>
          {t('admin.peak_value', {
            hour: `${data.peak.hour}:00`,
            orders: formatNumber(data.peak.value),
          })}
        </span>
      </div>
    </Panel>
  );
}
