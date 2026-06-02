import { beforeEach, describe, expect, it } from 'vitest';
import { useProductStore } from '@/lib/mock/product-store';
import { MOCK_PRODUCTS } from '@/lib/mock/data';
import type { Product } from '@/types/domain';

beforeEach(() => {
  useProductStore.getState().reset();
  window.localStorage.removeItem('sufra:products');
});

const sample = (id: string): Product => ({
  id,
  merchantId: '00000000-0000-4000-8000-000000000001',
  categoryId: 'olive',
  nameAr: 'منتج تجربة',
  nameEn: 'Test product',
  subtitle: 'subtitle',
  price: 10_000,
  weight: '500 جم',
  rating: 0,
  reviewCount: 0,
  stock: 5,
  images: [],
});

describe('useProductStore', () => {
  it('initializes with all seeded products', () => {
    const ids = Object.keys(useProductStore.getState().byId);
    expect(ids.length).toBe(MOCK_PRODUCTS.length);
    expect(ids).toContain('p1');
  });

  it('upsert adds a new product', () => {
    useProductStore.getState().upsert(sample('test-1'));
    expect(useProductStore.getState().byId['test-1']?.nameAr).toBe('منتج تجربة');
  });

  it('upsert overwrites the existing record for an id', () => {
    useProductStore.getState().upsert({ ...sample('p1'), stock: 999 });
    expect(useProductStore.getState().byId['p1']?.stock).toBe(999);
  });

  it('remove drops the row', () => {
    useProductStore.getState().remove('p1');
    expect(useProductStore.getState().byId['p1']).toBeUndefined();
  });

  it('reset re-seeds from the constant', () => {
    useProductStore.getState().remove('p1');
    expect(useProductStore.getState().byId['p1']).toBeUndefined();
    useProductStore.getState().reset();
    expect(useProductStore.getState().byId['p1']).toBeDefined();
  });
});
