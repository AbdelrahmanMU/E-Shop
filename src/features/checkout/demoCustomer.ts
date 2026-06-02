import type { Address, Customer, Uuid } from '@/types/domain';
import { DEMO_MERCHANT_ID } from '@/lib/mock/data';

/**
 * Stand-in customer + address while auth is deferred.
 * Mirrors "أحمد المصري" — the persona the prototype's Account screen uses.
 * Replaced by `useAuth().customer` in the backend phase.
 */
export const DEMO_CUSTOMER_ID: Uuid = '00000000-0000-4000-8000-000000000010';
export const DEMO_ADDRESS_ID: Uuid = '00000000-0000-4000-8000-000000000020';

export const DEMO_CUSTOMER: Customer = {
  id: DEMO_CUSTOMER_ID,
  merchantId: DEMO_MERCHANT_ID,
  phone: '+201001234567',
  name: 'أحمد المصري',
  initials: 'أم',
  email: 'ahmed@example.com',
  tier: 'premium',
  loyaltyPoints: 480,
  createdAt: '2025-09-01T00:00:00Z',
};

export const DEMO_ADDRESS: Address = {
  id: DEMO_ADDRESS_ID,
  customerId: DEMO_CUSTOMER_ID,
  label: 'المنزل',
  line1: 'شارع 9، المعادي الجديدة',
  line2: 'الدور الثالث، شقة 7',
  city: 'القاهرة',
  district: 'المعادي',
  phone: '+201001234567',
};
