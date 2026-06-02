import { describe, expect, it } from 'vitest';
import {
  computeKpis,
  getKpis,
  getPeakHours,
  getRevenueByDay,
  listCities,
  listRecentOrders,
  listTopProducts,
} from '@/features/admin/overview/api';
import { MOCK_ORDERS } from '@/lib/mock/data';
import type { Order } from '@/types/domain';

const baseOrder: Order = {
  id: 'SUF-2026-00001',
  merchantId: '00000000-0000-4000-8000-000000000001',
  customerId: '00000000-0000-4000-8000-000000000010',
  customerName: 'demo',
  city: 'cairo',
  items: [],
  itemCount: 1,
  subtotal: 10_000,
  deliveryFee: 4_500,
  discount: 0,
  total: 14_500,
  status: 'new',
  paymentMethod: 'card',
  paymentStatus: 'pending',
  createdAt: '2026-05-25T10:00:00.000Z',
  timeline: [{ status: 'new', at: '2026-05-25T10:00:00.000Z' }],
};

describe('computeKpis', () => {
  it('returns zero sums for an empty set', () => {
    const k = computeKpis([]);
    expect(k.salesToday).toBe(0);
    expect(k.newOrders).toBe(0);
    expect(k.aov).toBe(0);
  });

  it('sums total, counts new orders, and averages correctly', () => {
    const orders: Order[] = [
      { ...baseOrder, id: 'a', total: 10_000, status: 'new' },
      { ...baseOrder, id: 'b', total: 20_000, status: 'new' },
      { ...baseOrder, id: 'c', total: 30_000, status: 'delivered' },
    ];
    const k = computeKpis(orders);
    expect(k.salesToday).toBe(60_000);
    expect(k.newOrders).toBe(2);
    expect(k.aov).toBe(20_000);
  });

  it('matches the live MOCK_ORDERS sum on getKpis', async () => {
    const k = await getKpis();
    const expected = MOCK_ORDERS.reduce((s, o) => s + o.total, 0);
    expect(k.salesToday).toBe(expected);
  });
});

describe('getRevenueByDay', () => {
  it('returns 7 points and a positive total', async () => {
    const r = await getRevenueByDay();
    expect(r.points).toHaveLength(7);
    expect(r.totalEgp).toBe(r.points.reduce((s, p) => s + p.value, 0));
    expect(r.totalEgp).toBeGreaterThan(0);
  });
});

describe('listRecentOrders', () => {
  it('caps at the requested limit', async () => {
    const rows = await listRecentOrders(3);
    expect(rows).toHaveLength(3);
  });

  it('preserves order id + total + status', async () => {
    const rows = await listRecentOrders(8);
    rows.forEach((r, i) => {
      const src = MOCK_ORDERS[i]!;
      expect(r.id).toBe(src.id);
      expect(r.total).toBe(src.total);
      expect(r.status).toBe(src.status);
    });
  });
});

describe('listTopProducts', () => {
  it('returns 5 rows joined to products + categories', async () => {
    const rows = await listTopProducts();
    expect(rows).toHaveLength(5);
    rows.forEach((r) => {
      expect(r.product).toBeDefined();
      expect(r.revenue).toBeGreaterThan(0);
      expect(r.sold).toBeGreaterThan(0);
    });
  });

  it('first row revenue is in piastres (×100 of EGP)', async () => {
    const rows = await listTopProducts();
    // top1 in seed: revenue 117_420 EGP → 11_742_000 piastres
    expect(rows[0]!.revenue).toBe(11_742_000);
  });
});

describe('getPeakHours', () => {
  it('reports the maximum-value hour as peak', async () => {
    const r = await getPeakHours();
    expect(r.peak.value).toBe(Math.max(...r.points.map((p) => p.value)));
  });
});

describe('listCities', () => {
  it('returns rows whose pct sums to 100', async () => {
    const rows = await listCities();
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.reduce((s, c) => s + c.pct, 0)).toBe(100);
  });
});
