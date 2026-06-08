import { createContext } from 'react';
import type { Merchant } from '@/types/domain';

export type MerchantSource = 'supabase' | 'mock';

export interface MerchantContextValue {
  merchant: Merchant;
  /** Where the merchant record came from this session. */
  source: MerchantSource;
}

export const MerchantContext = createContext<MerchantContextValue | null>(null);
