import { useMemo, type ReactNode } from 'react';
import { MOCK_MERCHANT } from '@/lib/mock/data';
import type { Merchant } from '@/types/domain';
import { MerchantContext, type MerchantContextValue } from './MerchantContext';

interface MerchantProviderProps {
  children: ReactNode;
}

/**
 * Resolves the active tenant.
 *
 * Mock phase: always returns the seeded "sufra" demo merchant.
 * Backend phase: will read the subdomain (or VITE_DEFAULT_MERCHANT_SLUG
 * in dev), call merchants.select().eq('slug', ...) on Supabase, and
 * inject merchant.themeJson as CSS vars on :root.
 */
export function MerchantProvider({ children }: MerchantProviderProps) {
  const value = useMemo<MerchantContextValue>(
    () => ({ merchant: MOCK_MERCHANT as Merchant }),
    [],
  );

  return <MerchantContext.Provider value={value}>{children}</MerchantContext.Provider>;
}
