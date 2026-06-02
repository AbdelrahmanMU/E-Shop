import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import { MobileShell } from '@/components/MobileShell/MobileShell';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { useTrackingState } from '../hooks';
import { DEMO_DRIVER } from '../driver';
import { DriverCard } from './DriverCard';
import { EtaCard } from './EtaCard';
import { MapView } from './MapView';
import { Timeline } from './Timeline';
import styles from './TrackingPage.module.css';

export function TrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const trackingQ = useTrackingState(orderId);

  if (trackingQ.isLoading) {
    return (
      <MobileShell>
        <div className={styles.skeletonWrap}>
          <Skeleton width="100%" height={220} radius={16} />
          <Skeleton width="100%" height={84} radius={14} style={{ marginTop: 14 }} />
          <Skeleton width="100%" height={72} radius={14} style={{ marginTop: 14 }} />
        </div>
      </MobileShell>
    );
  }

  const state = trackingQ.data;
  if (!state) {
    return (
      <MobileShell>
        <div className={styles.notFound}>
          <span className={styles.notFoundGlyph} aria-hidden>📦</span>
          <h1 className={styles.notFoundTitle}>{t('tracking.not_found_title')}</h1>
          <p className={styles.notFoundBody}>{t('tracking.not_found_body')}</p>
          <Link to="/" className={styles.notFoundCta}>
            {t('nav.home')}
          </Link>
        </div>
      </MobileShell>
    );
  }

  const { order, derivedStatus, timeline, driver, etaWindow } = state;
  const driverVisible = derivedStatus === 'shipping' || derivedStatus === 'delivered';

  return (
    <MobileShell>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label={t('actions.back')}
          onClick={() => navigate(-1)}
        >
          <Icon name="back" size={18} className="icon-dir" />
        </button>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{t('tracking.title')}</h1>
          <span className={`num ltr ${styles.orderId}`}>{order.id}</span>
        </div>
        <button type="button" className={styles.detailsLink}>
          {t('tracking.details_link')}
        </button>
      </header>

      <section className={styles.mapWrap}>
        <MapView driverProgress={driver.progress} driverVisible={driverVisible} />
      </section>

      <section className={styles.cardWrap}>
        <EtaCard status={derivedStatus} etaWindow={etaWindow} />
      </section>

      <section className={styles.cardWrap}>
        <DriverCard driver={DEMO_DRIVER} />
      </section>

      <section className={styles.cardWrap}>
        <Timeline timeline={timeline} derivedStatus={derivedStatus} etaWindow={etaWindow} />
      </section>

      <div className={styles.spacer} />
    </MobileShell>
  );
}
