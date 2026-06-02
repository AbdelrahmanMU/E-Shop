import { describe, expect, it } from 'vitest';
import {
  getCategory,
  getProduct,
  listCategories,
  listFeatured,
  listProducts,
} from '@/features/catalog/api';
import { DEMO_MERCHANT_ID } from '@/lib/mock/data';

const OTHER_MERCHANT = '00000000-0000-4000-8000-ffffffffffff';

describe('catalog/api', () => {
  it('listCategories returns rows for the demo merchant only, sorted', async () => {
    const rows = await listCategories(DEMO_MERCHANT_ID);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((c) => c.merchantId === DEMO_MERCHANT_ID)).toBe(true);
    // sort property is monotonically increasing
    expect(rows.map((c) => c.sort)).toEqual([...rows.map((c) => c.sort)].sort((a, b) => a - b));
  });

  it('listCategories returns [] for an unknown merchant', async () => {
    expect(await listCategories(OTHER_MERCHANT)).toEqual([]);
  });

  it('listProducts filters by categoryId', async () => {
    const olive = await listProducts(DEMO_MERCHANT_ID, { sort: 'newest', categoryId: 'olive' });
    expect(olive.length).toBeGreaterThan(0);
    expect(olive.every((p) => p.categoryId === 'olive')).toBe(true);
  });

  it('listProducts filters by badge', async () => {
    const handmade = await listProducts(DEMO_MERCHANT_ID, { sort: 'newest', badge: 'handmade' });
    expect(handmade.every((p) => p.badge === 'handmade')).toBe(true);
    expect(handmade.length).toBeGreaterThanOrEqual(1);
  });

  it('listProducts query matches Arabic or English text in name/subtitle', async () => {
    const arHits = await listProducts(DEMO_MERCHANT_ID, { sort: 'newest', query: 'طحينة' });
    expect(arHits.length).toBeGreaterThan(0);
    const enHits = await listProducts(DEMO_MERCHANT_ID, { sort: 'newest', query: 'tahini' });
    expect(enHits.length).toBeGreaterThan(0);
  });

  it('listProducts sorts ascending by price', async () => {
    const rows = await listProducts(DEMO_MERCHANT_ID, { sort: 'price_asc' });
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i]!.price).toBeGreaterThanOrEqual(rows[i - 1]!.price);
    }
  });

  it('listProducts sorts descending by rating', async () => {
    const rows = await listProducts(DEMO_MERCHANT_ID, { sort: 'rating' });
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i]!.rating).toBeLessThanOrEqual(rows[i - 1]!.rating);
    }
  });

  it('getProduct returns the product by id, null when missing', async () => {
    const p = await getProduct(DEMO_MERCHANT_ID, 'p1');
    expect(p?.id).toBe('p1');
    expect(p?.nameAr).toMatch(/زيت زيتون/);
    const missing = await getProduct(DEMO_MERCHANT_ID, 'nope');
    expect(missing).toBeNull();
  });

  it('getCategory returns null for an unknown id', async () => {
    expect(await getCategory(DEMO_MERCHANT_ID, 'nope')).toBeNull();
  });

  it('listFeatured returns at most `limit` rows in the curated order', async () => {
    const rows = await listFeatured(DEMO_MERCHANT_ID, 4);
    expect(rows).toHaveLength(4);
    expect(rows.map((p) => p.id)).toEqual(['p1', 'p8', 'p5', 'p3']);
  });
});
