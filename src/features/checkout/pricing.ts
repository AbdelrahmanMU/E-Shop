/**
 * Pricing rules — kept here so cart + checkout + confirmation share them.
 * When the backend phase arrives, the same math runs inside an edge function
 * (totals are NEVER trusted from the client).
 */

import type { CartLine } from '@/features/cart/store';
import { toPiastres, type Piastres } from '@/lib/money';

export const FLAT_DELIVERY_PIASTRES: Piastres = toPiastres(45);
export const PREMIUM_DISCOUNT_PIASTRES: Piastres = toPiastres(25);

export interface OrderTotals {
  subtotal: Piastres;
  deliveryFee: Piastres;
  discount: Piastres;
  total: Piastres;
}

export function computeTotals(items: CartLine[], opts: { premium: boolean }): OrderTotals {
  const subtotal = items.reduce((sum, l) => sum + l.priceAtAdd * l.qty, 0);
  const deliveryFee = items.length > 0 ? FLAT_DELIVERY_PIASTRES : 0;
  const discount = opts.premium && items.length > 0 ? PREMIUM_DISCOUNT_PIASTRES : 0;
  const total = Math.max(0, subtotal + deliveryFee - discount);
  return { subtotal, deliveryFee, discount, total };
}
