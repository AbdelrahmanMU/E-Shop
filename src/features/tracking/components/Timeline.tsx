import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import type { Locale } from '@/lib/rtl';
import type { OrderStatus, OrderTimelineEntry } from '@/types/domain';
import type { EtaWindow } from '../api';
import styles from './Timeline.module.css';

interface TimelineProps {
  timeline: OrderTimelineEntry[];
  derivedStatus: OrderStatus;
  etaWindow: EtaWindow | null;
}

interface StepDef {
  status: Exclude<OrderStatus, 'cancelled'>;
  labelKey: string;
}

const STEPS: ReadonlyArray<StepDef> = [
  { status: 'new',        labelKey: 'tracking.step_received' },
  { status: 'preparing',  labelKey: 'tracking.step_preparing' },
  { status: 'shipping',   labelKey: 'tracking.step_shipping' },
  { status: 'delivered',  labelKey: 'tracking.step_delivered' },
];

const formatTime = (iso: string, locale: Locale): string =>
  new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));

export function Timeline({ timeline, derivedStatus, etaWindow }: TimelineProps) {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as Locale;

  const reachedAt = new Map(timeline.map((entry) => [entry.status, entry.at]));
  const reachedIdx = STEPS.findIndex((s) => s.status === derivedStatus);

  return (
    <div className={styles.card}>
      <span className={`eyebrow ${styles.eyebrow}`}>{t('tracking.timeline_eyebrow')}</span>
      <div className={styles.list}>
        <span className={styles.spine} aria-hidden />
        {STEPS.map((step, i) => {
          const done = i < reachedIdx;
          const current = i === reachedIdx && derivedStatus !== 'delivered';
          const finished = i <= reachedIdx && derivedStatus === 'delivered';
          const at = reachedAt.get(step.status);

          let timestamp: string;
          if (done || finished) {
            timestamp = at ? formatTime(at, locale) : '';
          } else if (current) {
            timestamp = t('tracking.step_now');
          } else if (etaWindow && step.status === 'delivered') {
            timestamp = t('tracking.step_pending_eta', {
              time: formatTime(etaWindow.latest, locale),
            });
          } else {
            timestamp = '';
          }

          return (
            <div key={step.status} className={styles.row}>
              <span
                className={[
                  styles.dot,
                  done || finished ? styles.dotDone : '',
                  current ? styles.dotCurrent : '',
                  !done && !finished && !current ? styles.dotPending : '',
                ].join(' ')}
                aria-hidden
              >
                {(done || finished) && <Icon name="check" size={10} style={{ color: '#fff' }} />}
              </span>
              <div className={styles.text}>
                <span
                  className={[
                    styles.label,
                    current ? styles.labelCurrent : '',
                    done || finished ? styles.labelDone : styles.labelPending,
                  ].join(' ')}
                >
                  {t(step.labelKey)}
                </span>
                <span
                  className={[
                    `num ${styles.ts}`,
                    current ? styles.tsCurrent : '',
                  ].join(' ')}
                >
                  {timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
