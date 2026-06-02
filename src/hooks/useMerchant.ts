import { useContext } from 'react';
import {
  MerchantContext,
  type MerchantContextValue,
} from '@/app/providers/MerchantContext';

export function useMerchant(): MerchantContextValue {
  const ctx = useContext(MerchantContext);
  if (!ctx) {
    throw new Error('useMerchant must be used inside <MerchantProvider>');
  }
  return ctx;
}
