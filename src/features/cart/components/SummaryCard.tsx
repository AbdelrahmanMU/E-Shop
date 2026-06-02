import { useTranslation } from 'react-i18next';
import { formatMoney } from '@/lib/money';
import type { Locale } from '@/lib/rtl';
import type { OrderTotals } from '@/features/checkout/pricing';
import styles from './SummaryCard.module.css';

interface SummaryCardProps {
  totals: OrderTotals;
}

export function SummaryCard({ totals }: SummaryCardProps) {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as Locale;

  const rows = [
    { label: t('cart.summary_subtotal'), value: totals.subtotal, color: 'var(--text)' },
    { label: t('cart.summary_delivery'), value: totals.deliveryFee, color: 'var(--text)' },
    ...(totals.discount > 0
      ? [{
          label: t('cart.summary_membership_discount'),
          value: -totals.discount,
          color: 'var(--green)',
        }]
      : []),
  ];

  const fmtSigned = (v: number) => {
    const abs = Math.abs(v);
    const sign = v < 0 ? '−' : '';
    return `${sign}${formatMoney(abs, locale)}`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.lines}>
        {rows.map((r) => (
          <div key={r.label} className={styles.line}>
            <span className={styles.lineLabel}>{r.label}</span>
            <span className={`num ${styles.lineValue}`} style={{ color: r.color }}>
              {fmtSigned(r.value)}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.divider} />
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>{t('cart.summary_total')}</span>
        <span className={`num ${styles.totalValue}`}>{formatMoney(totals.total, locale)}</span>
      </div>
    </div>
  );
}
