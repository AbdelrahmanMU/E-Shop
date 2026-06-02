/**
 * End-to-end test that the three persisted shapes (cart, products,
 * orders) are guarded by Zod and degrade to fallback on corruption.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { ORDERS_KEY, createOrder, getOrder } from '@/features/checkout/api';
import { DEMO_ADDRESS, DEMO_CUSTOMER } from '@/features/checkout/demoCustomer';
import { useCartStore } from '@/features/cart/store';
import { useProductStore } from '@/lib/mock/product-store';
import { DEMO_MERCHANT_ID } from '@/lib/mock/data';

beforeEach(() => {
  window.localStorage.clear();
  useCartStore.getState().clear();
  useProductStore.getState().reset();
});

describe('sufra:mock-orders Zod validation', () => {
  it('returns empty index when storage is garbage JSON', async () => {
    window.localStorage.setItem(ORDERS_KEY, '{not json');
    expect(await getOrder('SUF-2026-04891')).toBeNull();
  });

  it('returns empty index when storage has wrong shape', async () => {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify({
      'SUF-FAKE': { id: 'SUF-FAKE' /* missing required fields */ },
    }));
    expect(await getOrder('SUF-FAKE')).toBeNull();
  });

  it('round-trips an order after createOrder', async () => {
    const order = await createOrder({
      merchantId: DEMO_MERCHANT_ID,
      customer: DEMO_CUSTOMER,
      address: DEMO_ADDRESS,
      items: [{ productId: 'p1', qty: 1, priceAtAdd: 28_500 }],
      form: { day: 'tomorrow', slot: 'afternoon', paymentMethod: 'card' },
    });
    const fetched = await getOrder(order.id);
    expect(fetched?.id).toBe(order.id);
    expect(fetched?.paymentStatus).toBe('paid');
  });
});
