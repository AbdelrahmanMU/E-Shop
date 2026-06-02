import { beforeEach, describe, expect, it } from 'vitest';
import {
  applyFilter,
  computeMiniStats,
  listOrders,
  mergeOrders,
} from '@/features/admin/orders/api';
import { MOCK_ORDERS } from '@/lib/mock/data';
import type { Order } from '@/types/domain';

beforeEach(() => {
  window.localStorage.clear();
});

describe('mergeOrders', () => {
  it('returns the seed when no live orders exist', () => {
    const merged = mergeOrders();
    expect(merged.length).toBe(MOCK_ORDERS.length);
  });

  it('merges live orders from localStorage (live wins on id collision)', () => {
    const override: Order = {
      ...MOCK_ORDERS[0]!,
      total: 99_999,
      status: 'delivered',
    };
    window.localStorage.setItem(
      'sufra:mock-orders',
      JSON.stringify({ [override.id]: override }),
    );
    const merged = mergeOrders();
    const hit = merged.find((o) => o.id === override.id);
    expect(hit?.total).toBe(99_999);
    expect(hit?.status).toBe('delivered');
  });

  it('sorts newest-first by createdAt', () => {
    const merged = mergeOrders();
    for (let i = 1; i < merged.length; i += 1) {
      expect(new Date(merged[i - 1]!.createdAt).getTime())
        .toBeGreaterThanOrEqual(new Date(merged[i]!.createdAt).getTime());
    }
  });
});

describe('applyFilter', () => {
  it('returns all when status=all and no search', () => {
    const rows = applyFilter(mergeOrders(), { status: 'all', search: '' });
    expect(rows.length).toBe(MOCK_ORDERS.length);
  });

  it('narrows by status', () => {
    const newOnly = applyFilter(mergeOrders(), { status: 'new', search: '' });
    expect(newOnly.every((o) => o.status === 'new')).toBe(true);
  });

  it('search matches id / customer / city', () => {
    const byId = applyFilter(mergeOrders(), { status: 'all', search: 'SUF-2026-04891' });
    expect(byId.length).toBe(1);
    const byCustomer = applyFilter(mergeOrders(), { status: 'all', search: 'أحمد' });
    expect(byCustomer.length).toBeGreaterThan(0);
    const byCity = applyFilter(mergeOrders(), { status: 'all', search: 'الشيخ زايد' });
    expect(byCity.length).toBeGreaterThan(0);
  });
});

describe('listOrders pagination', () => {
  it('respects pageSize + page', async () => {
    const page1 = await listOrders({ search: '', status: 'all', page: 1, pageSize: 3 });
    expect(page1.rows).toHaveLength(3);
    expect(page1.totalMatching).toBe(MOCK_ORDERS.length);
    const page2 = await listOrders({ search: '', status: 'all', page: 2, pageSize: 3 });
    expect(page2.rows[0]!.id).not.toBe(page1.rows[0]!.id);
  });

  it('returns zero rows for an out-of-range page', async () => {
    const result = await listOrders({ search: '', status: 'all', page: 100, pageSize: 3 });
    expect(result.rows).toHaveLength(0);
  });
});

describe('computeMiniStats', () => {
  it('matches the seed status distribution', () => {
    const stats = computeMiniStats(MOCK_ORDERS);
    expect(stats.total).toBe(MOCK_ORDERS.length);
    expect(stats.newOrders).toBe(MOCK_ORDERS.filter((o) => o.status === 'new').length);
    expect(stats.preparing).toBe(MOCK_ORDERS.filter((o) => o.status === 'preparing').length);
    expect(stats.shipping).toBe(MOCK_ORDERS.filter((o) => o.status === 'shipping').length);
    expect(stats.completedToday).toBe(MOCK_ORDERS.filter((o) => o.status === 'delivered').length);
  });
});
