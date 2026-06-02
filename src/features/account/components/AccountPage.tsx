import { BottomNav } from '@/components/BottomNav/BottomNav';
import { MobileShell } from '@/components/MobileShell/MobileShell';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { useCustomerProfile } from '../hooks';
import { AccountHero } from './AccountHero';
import { MenuList } from './MenuList';
import { StatsCard } from './StatsCard';
import styles from './AccountPage.module.css';

export function AccountPage() {
  const profileQ = useCustomerProfile();

  // Sign-out is a no-op in the mock phase; auth + Supabase signOut land
  // in the backend phase. Left here so the button has a real handler.
  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      console.warn('[sufra] sign-out is a no-op until auth ships (backend phase)');
    }
  };

  if (profileQ.isLoading || !profileQ.data) {
    return (
      <MobileShell bottomNav={<BottomNav active="account" />}>
        <div className={styles.skeletonWrap}>
          <Skeleton width="100%" height={160} radius={0} />
          <div className={styles.skeletonStats}>
            <Skeleton width="100%" height={80} radius={16} />
          </div>
          <div className={styles.skeletonMenu}>
            <Skeleton width="100%" height={320} radius={14} />
          </div>
        </div>
      </MobileShell>
    );
  }

  const { customer, stats } = profileQ.data;

  return (
    <MobileShell bottomNav={<BottomNav active="account" />}>
      <AccountHero customer={customer} />
      <StatsCard stats={stats} />
      <MenuList stats={stats} onSignOut={handleSignOut} />
      <div className={styles.spacer} />
    </MobileShell>
  );
}
