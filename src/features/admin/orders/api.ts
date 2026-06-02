/**
 * Admin orders — paginated list + mini stats.
 *
 * Mock phase: merges the seed `MOCK_ORDERS` with anything in
 * `sufra:mock-orders` (real orders placed via the checkout). Backend
 * phase: Supabase query against the `orders` table, paginated with
 * `range()` and filtered server-side.
 */

import { ORDERS_KEY } from '@/features/checkout/api';
import { delay } from '@/lib/mock/delay';
import { MOCK_ORDERS } from '@/lib/mock/data';
import { readJson } from '@/lib/storage';
import { StoredOrdersIndexSchema, type StoredOrdersIndex } from '@/types/storage-schemas';
import type { Order, OrderId, OrderStatus } from '@/types/domain';

const EMPTY_INDEX: StoredOrdersIndex = {};

export type OrderStatusFilter = OrderStatus | 'all';

export interface AdminOrdersFilter {
  search: string;
  status: OrderStatusFilter;
  page: number;
  pageSize: number;
}

export interface AdminOrdersResult {
  rows: Order[];
  totalCount: number;
  totalMatching: number;
}

export interface AdminOrderMiniStats {
  total: number;
  newOrders: number;
  preparing: number;
  shipping: number;
  completedToday: number;
}

function readLiveOrders(): Order[] {
  const index = readJson(ORDERS_KEY, StoredOrdersIndexSchema, EMPTY_INDEX) as Record<OrderId, Order>;
  return Object.values(index);
}

/**
 * Merge seed + live, dedup by id (live wins), and sort newest-first.
 * Exported for test usage.
 */
export function mergeOrders(): Order[] {
  const live = readLiveOrders();
  const byId = new Map<OrderId, Order>();
  for (const o of MOCK_ORDERS) byId.set(o.id, o);
  for (const o of live) byId.set(o.id, o);
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function applyFilter(
  orders: ReadonlyArray<Order>,
  filter: { search: string; status: OrderStatusFilter },
): Order[] {
  let rows: Order[] = [...orders];
  if (filter.status !== 'all') {
    rows = rows.filter((o) => o.status === filter.status);
  }
  if (filter.search.trim()) {
    const q = filter.search.trim().toLowerCase();
    rows = rows.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q),
    );
  }
  return rows;
}

export async function listOrders(filter: AdminOrdersFilter): Promise<AdminOrdersResult> {
  const all = mergeOrders();
  const matching = applyFilter(all, filter);
  const start = (filter.page - 1) * filter.pageSize;
  const rows = matching.slice(start, start + filter.pageSize);
  return delay({ rows, totalCount: all.length, totalMatching: matching.length });
}

export function computeMiniStats(orders: ReadonlyArray<Order>): AdminOrderMiniStats {
  return {
    total: orders.length,
    newOrders: orders.filter((o) => o.status === 'new').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    shipping: orders.filter((o) => o.status === 'shipping').length,
    completedToday: orders.filter((o) => o.status === 'delivered').length,
  };
}

export async function getOrderMiniStats(): Promise<AdminOrderMiniStats> {
  return delay(computeMiniStats(mergeOrders()));
}
