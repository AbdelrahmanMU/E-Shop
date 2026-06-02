/**
 * Account — customer profile + derived stats.
 *
 * Mock phase: reads the demo customer (`DEMO_CUSTOMER`) and walks
 * `sufra:mock-orders` from localStorage (Zod-validated via shared
 * storage helper) to count this customer's orders. Favorites count
 * is a placeholder until a wishlist store lands.
 *
 * Backend phase: same signature, replaced by a Supabase query joining
 * `customers` + a `customer_order_stats` materialized view.
 */

import { DEMO_CUSTOMER } from '@/features/checkout/demoCustomer';
import { ORDERS_KEY } from '@/features/checkout/api';
import { delay } from '@/lib/mock/delay';
import { readJson } from '@/lib/storage';
import { StoredOrdersIndexSchema, type StoredOrdersIndex } from '@/types/storage-schemas';
import type { Customer, Order, Uuid } from '@/types/domain';

const FAVORITES_PLACEHOLDER = 24;
const EMPTY_INDEX: StoredOrdersIndex = {};

export interface CustomerStats {
  ordersCount: number;
  activeOrdersCount: number;
  favoritesCount: number;
  loyaltyPoints: number;
}

export interface CustomerProfile {
  customer: Customer;
  stats: CustomerStats;
}

const ACTIVE_STATUSES = new Set<Order['status']>(['new', 'preparing', 'shipping']);

export async function getCustomerProfile(customerId: Uuid = DEMO_CUSTOMER.id): Promise<CustomerProfile> {
  const index = readJson(ORDERS_KEY, StoredOrdersIndexSchema, EMPTY_INDEX) as Record<string, Order>;
  const orders = Object.values(index).filter((o) => o.customerId === customerId);
  const activeOrdersCount = orders.filter((o) => ACTIVE_STATUSES.has(o.status)).length;

  return delay({
    customer: DEMO_CUSTOMER,
    stats: {
      ordersCount: orders.length,
      activeOrdersCount,
      favoritesCount: FAVORITES_PLACEHOLDER,
      loyaltyPoints: DEMO_CUSTOMER.loyaltyPoints,
    },
  });
}
