import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import { MobileShell } from '@/components/MobileShell/MobileShell';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { formatDateTime } from '@/lib/dates';
import { formatMoney } from '@/lib/money';
import type { Locale } from '@/lib/rtl';
import { useOrder } from '../hooks';
import styles from './OrderConfirmationPage.module.css';

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as Locale;

  const orderQ = useOrder(orderId);

  if (!orderId) return <Navigate to="/" replace />;

  if (orderQ.isLoading) {
    return (
      <MobileShell>
        <div className={styles.root}>
          <Skeleton width={88} height={88} radius={9999} />
          <Skeleton width={220} height={20} style={{ marginTop: 18 }} />
        </div>
      </MobileShell>
    );
  }

  const order = orderQ.data;
  if (!order) return <Navigate to="/" replace />;

  return (
    <MobileShell>
      <div className={styles.root}>
        <div className={styles.ring} aria-hidden>
          <Icon name="check" size={36} />
        </div>
        <h1 className={styles.title}>{t('confirmation.title')}</h1>
        <p className={styles.subtitle}>{t('confirmation.subtitle')}</p>

        <div className={styles.meta}>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>{t('confirmation.order_id_label')}</span>
            <span className={`num ltr ${styles.metaValue}`}>{order.id}</span>
          </div>
          {order.scheduledFor && (
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>{t('confirmation.scheduled_label')}</span>
              <span className={`num ${styles.metaValue}`}>
                {formatDateTime(order.scheduledFor, locale)}
              </span>
            </div>
          )}
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>{t('cart.summary_total')}</span>
            <span className={`num ${styles.metaValue}`}>{formatMoney(order.total, locale)}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link to={`/tracking/${order.id}`} className={styles.primaryCta}>
            {t('confirmation.track_cta')}
          </Link>
          <Link to="/" className={styles.secondaryCta}>
            {t('confirmation.home_cta')}
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
