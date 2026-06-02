import { useTranslation } from 'react-i18next';
import type { Customer } from '@/types/domain';
import styles from './AccountHero.module.css';

interface AccountHeroProps {
  customer: Customer;
}

export function AccountHero({ customer }: AccountHeroProps) {
  const { t } = useTranslation('common');

  return (
    <header className={styles.hero}>
      <div className={`hero-ph ${styles.heroPh}`} />
      <div className={styles.content}>
        <div className={styles.topRow}>
          <span className={`eyebrow ${styles.eyebrow}`}>{t('account.eyebrow')}</span>
          <button type="button" className={styles.settingsBtn} aria-label={t('account.settings_aria')}>
            ⚙️
          </button>
        </div>
        <div className={styles.userRow}>
          <div className={styles.avatar} aria-hidden>{customer.initials}</div>
          <div className={styles.userInfo}>
            <span className={styles.name}>{customer.name}</span>
            <span className={`num ltr ${styles.phone}`}>{customer.phone}</span>
            {customer.tier === 'premium' && (
              <span className={styles.pill}>
                <span aria-hidden>⭐</span> {t('account.tier_premium')}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
