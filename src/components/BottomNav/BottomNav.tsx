import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import type { IconName } from '@/components/Icon/icons';
import { useCartItemCount } from '@/features/cart/hooks';
import styles from './BottomNav.module.css';

export type BottomNavTab = 'home' | 'catalog' | 'cart' | 'account';

interface BottomNavProps {
  active: BottomNavTab;
  /** Optional override; defaults to the live cart store count. */
  cartCount?: number;
}

interface TabDef {
  id: BottomNavTab;
  to: string;
  icon: IconName;
}

const TABS: ReadonlyArray<TabDef> = [
  { id: 'home',    to: '/',        icon: 'bag' },
  { id: 'catalog', to: '/catalog', icon: 'filter' },
  { id: 'cart',    to: '/cart',    icon: 'cart' },
  { id: 'account', to: '/account', icon: 'user' },
];

export function BottomNav({ active, cartCount: cartCountProp }: BottomNavProps) {
  const { t } = useTranslation('common');
  const storeCount = useCartItemCount();
  const cartCount = cartCountProp ?? storeCount;

  return (
    <nav className={styles.nav} aria-label={t('nav.aria_label')}>
      {TABS.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.to}
          end={tab.to === '/'}
          className={[styles.tab, active === tab.id ? styles.active : ''].join(' ')}
          aria-current={active === tab.id ? 'page' : undefined}
        >
          <span className={styles.iconWrap}>
            <Icon name={tab.icon} size={20} />
            {tab.id === 'cart' && cartCount > 0 && (
              <span className={`${styles.badge} num`} aria-label={t('nav.cart_count', { count: cartCount })}>
                {cartCount}
              </span>
            )}
          </span>
          <span className={styles.label}>{t(`nav.${tab.id}`)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
