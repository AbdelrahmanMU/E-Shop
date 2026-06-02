import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import { StatusChip } from '@/features/admin/components/StatusChip';
import { formatMoney } from '@/lib/money';
import { timeAgo } from '@/lib/dates';
import type { Locale } from '@/lib/rtl';
import type { Order, PaymentMethod } from '@/types/domain';
import styles from './OrdersTable.module.css';

interface OrdersTableProps {
  rows: Order[];
  isLoading: boolean;
}

const PAY_ICON: Record<PaymentMethod, string> = {
  cash:   '💵',
  card:   '💳',
  wallet: '📱',
};

const PAY_LABEL: Record<PaymentMethod, string> = {
  cash:   'admin.orders.pay_cash',
  card:   'admin.orders.pay_card',
  wallet: 'admin.orders.pay_wallet',
};

function avatarOf(name: string): string {
  const tokens = name.trim().split(/\s+/);
  const initials = tokens.slice(0, 2).map((t) => t[0] ?? '').join('');
  return initials || '?';
}

export function OrdersTable({ rows, isLoading }: OrdersTableProps) {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as Locale;
  const navigate = useNavigate();

  return (
    <div className={styles.panel}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thStart}>{t('admin.orders.col_id')}</th>
              <th className={styles.thStart}>{t('admin.orders.col_customer')}</th>
              <th className={styles.thStart}>{t('admin.orders.col_city')}</th>
              <th>{t('admin.orders.col_items')}</th>
              <th>{t('admin.orders.col_total')}</th>
              <th>{t('admin.orders.col_payment')}</th>
              <th>{t('admin.orders.col_status')}</th>
              <th>{t('admin.orders.col_time')}</th>
              <th aria-hidden />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={9} className={styles.skeleton}>—</td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.empty}>
                  {t('admin.orders.empty_title')}
                </td>
              </tr>
            ) : (
              rows.map((o) => (
                <tr key={o.id} className={styles.row}>
                  <td className={`num ltr ${styles.idCell}`}>{o.id}</td>
                  <td>
                    <div className={styles.customerCell}>
                      <span className={styles.avatar} aria-hidden>{avatarOf(o.customerName)}</span>
                      <span className={styles.customerName}>{o.customerName}</span>
                    </div>
                  </td>
                  <td className={styles.cityCell}>{o.city}</td>
                  <td className={`num ${styles.numericCell}`}>{o.itemCount}</td>
                  <td className={`num ${styles.totalCell}`}>{formatMoney(o.total, locale)}</td>
                  <td>
                    <span className={styles.payCell}>
                      <span aria-hidden>{PAY_ICON[o.paymentMethod]}</span>{' '}
                      {t(PAY_LABEL[o.paymentMethod])}
                    </span>
                  </td>
                  <td><StatusChip kind="order" status={o.status} /></td>
                  <td className={`num ${styles.timeCell}`}>{timeAgo(o.createdAt, locale)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.viewBtn}`}
                        aria-label={t('admin.orders.row_view')}
                        onClick={() => navigate(`/tracking/${o.id}`)}
                      >
                        <Icon name="eye" size={14} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        aria-label={t('admin.orders.row_edit')}
                      >
                        <Icon name="edit" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
