/**
 * Admin overview — derived KPIs + chart series.
 *
 * Mock phase: reads the seed (MOCK_ORDERS, MOCK_TOP_PRODUCTS, etc.).
 * Backend phase: replaced by Postgres views (refreshed nightly via
 * pg_cron); live numbers via Realtime where cheap.
 */

import {
  MOCK_CATEGORIES,
  MOCK_CITIES,
  MOCK_ORDERS,
  MOCK_PEAK_HOURS,
  MOCK_PRODUCTS,
  MOCK_REVENUE_BY_DAY,
  MOCK_TOP_PRODUCTS,
} from '@/lib/mock/data';
import { delay } from '@/lib/mock/delay';
import { toPiastres, type Piastres } from '@/lib/money';
import type { Category, Order, Product } from '@/types/domain';

// ── KPIs ─────────────────────────────────────────────────────────────

export interface AdminKpis {
  /** Sum of today's order totals, in piastres. */
  salesToday: Piastres;
  /** Number of orders with status === 'new'. */
  newOrders: number;
  /** Average order value across today's orders, in piastres. */
  aov: Piastres;
  /** Stub for new-customers count today (real value lands when we track signups). */
  newCustomers: number;
  /** Δ vs. yesterday for the 4 cards — stubs until we have a real comparison window. */
  deltas: {
    salesToday: string;
    newCustomers: string;
    aov: string;
    morningOrders: number;
  };
}

export function computeKpis(orders: ReadonlyArray<Order>): AdminKpis {
  const total = orders.reduce((sum, o) => sum + o.total, 0);
  const count = orders.length;
  return {
    salesToday: total,
    newOrders: orders.filter((o) => o.status === 'new').length,
    aov: count > 0 ? Math.round(total / count) : 0,
    newCustomers: 23,
    deltas: {
      salesToday: '+18.2%',
      newCustomers: '−4.1%',
      aov: '+2.4%',
      morningOrders: 12,
    },
  };
}

export async function getKpis(): Promise<AdminKpis> {
  return delay(computeKpis(MOCK_ORDERS));
}

// ── Revenue ─────────────────────────────────────────────────────────

export interface RevenuePoint {
  day: string;
  /** EGP-major units (matches the chart's K-suffix scale). */
  value: number;
}

export async function getRevenueByDay(): Promise<{
  points: RevenuePoint[];
  totalEgp: number;
}> {
  const points = MOCK_REVENUE_BY_DAY.map((d) => ({ day: d.day, value: d.value }));
  const totalEgp = points.reduce((sum, p) => sum + p.value, 0);
  return delay({ points, totalEgp });
}

// ── Recent orders ───────────────────────────────────────────────────

export interface RecentOrder {
  id: Order['id'];
  customerName: string;
  itemCount: number;
  total: Piastres;
  status: Order['status'];
  /** Display-formatted "since" string. Backend recomputes from createdAt. */
  timeAgo: string;
}

const TIME_AGO_AR: Record<string, string> = {
  '2026-05-16 14:20': 'منذ 8 د',
  '2026-05-16 14:06': 'منذ 22 د',
  '2026-05-16 13:12': 'منذ ساعة',
  '2026-05-16 12:30': 'منذ ساعتين',
  '2026-05-16 11:45': 'منذ 3 س',
  '2026-05-16 10:18': 'منذ 4 س',
  '2026-05-16 09:35': 'منذ 5 س',
  '2026-05-15 18:50': 'أمس',
};

export async function listRecentOrders(limit = 6): Promise<RecentOrder[]> {
  const rows = MOCK_ORDERS.slice(0, limit).map((o) => {
    const stamp = o.createdAt.replace('T', ' ').slice(0, 16);
    return {
      id: o.id,
      customerName: o.customerName,
      itemCount: o.itemCount,
      total: o.total,
      status: o.status,
      timeAgo: TIME_AGO_AR[stamp] ?? 'حديث',
    };
  });
  return delay(rows);
}

// ── Top products ────────────────────────────────────────────────────

export interface TopProductRow {
  product: Product;
  category: Category | undefined;
  sold: number;
  /** Revenue in piastres (converted from the EGP-major seed). */
  revenue: Piastres;
}

export async function listTopProducts(): Promise<TopProductRow[]> {
  const byId = new Map(MOCK_PRODUCTS.map((p) => [p.id, p]));
  const catById = new Map(MOCK_CATEGORIES.map((c) => [c.id, c]));
  const rows = MOCK_TOP_PRODUCTS
    .map((t) => {
      const product = byId.get(t.productId);
      if (!product) return null;
      return {
        product,
        category: catById.get(product.categoryId),
        sold: t.sold,
        revenue: toPiastres(t.revenue),
      };
    })
    .filter((r): r is TopProductRow => r !== null);
  return delay(rows);
}

// ── Peak hours ──────────────────────────────────────────────────────

export interface PeakHourPoint {
  hour: string;
  value: number;
}

export interface PeakHoursResult {
  points: PeakHourPoint[];
  peak: PeakHourPoint;
}

export async function getPeakHours(): Promise<PeakHoursResult> {
  const points = MOCK_PEAK_HOURS.map((h) => ({ hour: h.h, value: h.v }));
  const peak = points.reduce((acc, p) => (p.value > acc.value ? p : acc), points[0]!);
  return delay({ points, peak });
}

// ── Cities ──────────────────────────────────────────────────────────

export interface CityRow {
  name: string;
  orders: number;
  /** 0..100 share-of-orders. */
  pct: number;
}

export async function listCities(): Promise<CityRow[]> {
  return delay(MOCK_CITIES.map((c) => ({ name: c.name, orders: c.orders, pct: c.pct })));
}
