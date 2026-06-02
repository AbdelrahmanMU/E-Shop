import { beforeEach, describe, expect, it } from 'vitest';
import { getCustomerProfile } from '@/features/account/api';
import { DEMO_CUSTOMER } from '@/features/checkout/demoCustomer';
import type { Order } from '@/types/domain';

function seedOrder(id: string, status: Order['status'], customerId = DEMO_CUSTOMER.id): Order {
  return {
    id,
    merchantId: '00000000-0000-4000-8000-000000000001',
    customerId,
    customerName: 'أحمد المصري',
    addressId: '00000000-0000-4000-8000-000000000020',
    city: 'القاهرة · المعادي',
    items: [{ productId: 'p1', qty: 1, priceAtTime: 28_500 }],
    itemCount: 1,
    subtotal: 28_500,
    deliveryFee: 4_500,
    discount: 0,
    total: 33_000,
    status,
    paymentMethod: 'card',
    paymentStatus: 'pending',
    createdAt: '2026-05-25T14:00:00.000Z',
    timeline: [{ status: 'new', at: '2026-05-25T14:00:00.000Z' }],
  };
}

function writeOrders(orders: Order[]): void {
  const index = Object.fromEntries(orders.map((o) => [o.id, o]));
  window.localStorage.setItem('sufra:mock-orders', JSON.stringify(index));
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('getCustomerProfile', () => {
  it('returns the demo customer and zero counts when no orders are stored', async () => {
    const profile = await getCustomerProfile();
    expect(profile.customer.id).toBe(DEMO_CUSTOMER.id);
    expect(profile.stats.ordersCount).toBe(0);
    expect(profile.stats.activeOrdersCount).toBe(0);
    expect(profile.stats.loyaltyPoints).toBe(DEMO_CUSTOMER.loyaltyPoints);
    expect(profile.stats.favoritesCount).toBeGreaterThanOrEqual(0);
  });

  it('counts only orders that belong to the demo customer', async () => {
    writeOrders([
      seedOrder('SUF-2026-00001', 'new'),
      seedOrder('SUF-2026-00002', 'delivered'),
      seedOrder('SUF-2026-00003', 'preparing', '00000000-0000-4000-8000-999999999999'), // other customer
    ]);
    const profile = await getCustomerProfile();
    expect(profile.stats.ordersCount).toBe(2);
  });

  it('treats new/preparing/shipping as active; delivered + cancelled as inactive', async () => {
    writeOrders([
      seedOrder('a', 'new'),
      seedOrder('b', 'preparing'),
      seedOrder('c', 'shipping'),
      seedOrder('d', 'delivered'),
      seedOrder('e', 'cancelled'),
    ]);
    const profile = await getCustomerProfile();
    expect(profile.stats.ordersCount).toBe(5);
    expect(profile.stats.activeOrdersCount).toBe(3);
  });
});
