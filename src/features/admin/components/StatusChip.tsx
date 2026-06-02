import { useTranslation } from 'react-i18next';
import type { OrderStatus } from '@/types/domain';
import styles from './StatusChip.module.css';

export type ProductStockLevel = 'active' | 'low' | 'out';

interface OrderStatusChipProps {
  kind: 'order';
  status: OrderStatus;
}

interface ProductStockChipProps {
  kind: 'product';
  level: ProductStockLevel;
}

type StatusChipProps = OrderStatusChipProps | ProductStockChipProps;

const ORDER_TONE: Record<OrderStatus, string> = {
  new:        styles.toneNew ?? '',
  preparing:  styles.toneInprog ?? '',
  shipping:   styles.toneContacted ?? '',
  delivered:  styles.toneActive ?? '',
  cancelled:  styles.toneRejected ?? '',
};

const ORDER_LABEL: Record<OrderStatus, string> = {
  new:        'admin.orders.status_new',
  preparing:  'admin.orders.status_preparing',
  shipping:   'admin.orders.status_shipping',
  delivered:  'admin.orders.status_delivered',
  cancelled:  'admin.orders.status_cancelled',
};

const PRODUCT_TONE: Record<ProductStockLevel, string> = {
  active: styles.toneActive ?? '',
  low:    styles.tonePending ?? '',
  out:    styles.toneRejected ?? '',
};

const PRODUCT_LABEL: Record<ProductStockLevel, string> = {
  active: 'admin.products.stock_active',
  low:    'admin.products.stock_low',
  out:    'admin.products.stock_out',
};

export function StatusChip(props: StatusChipProps) {
  const { t } = useTranslation('common');
  if (props.kind === 'order') {
    return (
      <span className={`${styles.chip} ${ORDER_TONE[props.status]}`}>
        {t(ORDER_LABEL[props.status])}
      </span>
    );
  }
  return (
    <span className={`${styles.chip} ${PRODUCT_TONE[props.level]}`}>
      {t(PRODUCT_LABEL[props.level])}
    </span>
  );
}
