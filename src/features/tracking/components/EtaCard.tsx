import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import type { Locale } from '@/lib/rtl';
import type { OrderStatus } from '@/types/domain';
import type { EtaWindow } from '../api';
import styles from './EtaCard.module.css';

interface EtaCardProps {
  status: OrderStatus;
  etaWindow: EtaWindow | null;
}

const STATUS_TO_HEADLINE: Partial<Record<OrderStatus, string>> = {
  new:        'tracking.new_msg',
  preparing:  'tracking.preparing_msg',
  shipping:   'tracking.in_transit',
  delivered:  'tracking.delivered_msg',
  cancelled:  'tracking.cancelled_msg',
};

/**
 * Eyebrow copy adapts to the state — "ARRIVING SOON" is a lie once the
 * order is delivered or cancelled. Showing the literal terminal status
 * as eyebrow there reads better than dropping the line entirely (keeps
 * the card layout balanced).
 */
const STATUS_TO_EYEBROW: Partial<Record<OrderStatus, string>> = {
  new:        'tracking.eta_eyebrow',
  preparing:  'tracking.eta_eyebrow',
  shipping:   'tracking.eta_eyebrow',
  delivered:  'tracking.step_delivered',
  cancelled:  'tracking.cancelled_msg',
};

function formatRange(window: EtaWindow, locale: Locale): string {
  const fmt = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${fmt.format(new Date(window.earliest))} - ${fmt.format(new Date(window.latest))}`;
}

export function EtaCard({ status, etaWindow }: EtaCardProps) {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as Locale;

  const headlineKey = STATUS_TO_HEADLINE[status] ?? 'tracking.in_transit';
  const eyebrowKey = STATUS_TO_EYEBROW[status] ?? 'tracking.eta_eyebrow';
  const headline = t(headlineKey);
  const showEta = etaWindow !== null && status !== 'delivered' && status !== 'cancelled';

  return (
    <div className={styles.card}>
      <div className={styles.iconRing} aria-hidden>
        <Icon name="truck" size={22} />
      </div>
      <div className={styles.body}>
        <span className={`eyebrow ${styles.eyebrow}`}>{t(eyebrowKey)}</span>
        <span className={styles.headline}>{headline}</span>
        {showEta && (
          <span className={`num ${styles.eta}`}>
            {t('tracking.eta_label')} · {formatRange(etaWindow, locale)}
          </span>
        )}
      </div>
    </div>
  );
}
