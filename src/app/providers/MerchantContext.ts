import { createContext } from 'react';
import type { Merchant } from '@/types/domain';

export interface MerchantContextValue {
  merchant: Merchant;
}

export const MerchantContext = createContext<MerchantContextValue | null>(null);
