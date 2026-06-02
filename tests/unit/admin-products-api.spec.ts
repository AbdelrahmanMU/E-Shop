import { beforeEach, describe, expect, it } from 'vitest';
import {
  computeProductsStats,
  createProduct,
  deleteProduct,
  deriveStockLevel,
  getLowStockAlert,
  listAdminProducts,
  updateProduct,
} from '@/features/admin/products/api';
import { useProductStore } from '@/lib/mock/product-store';
import type { ProductFormValues } from '@/features/admin/products/schemas';

const validForm: ProductFormValues = {
  nameAr: 'منتج اختبار',
  nameEn: 'Test product',
  subtitle: 'origin · note',
  categoryId: 'olive',
  priceEgp: 50,
  weight: '500 مل',
  stock: 10,
  glyph: '🫒',
};

beforeEach(() => {
  useProductStore.getState().reset();
  window.localStorage.removeItem('sufra:products');
});

describe('deriveStockLevel', () => {
  it('marks 0 stock as out, 1–15 as low, >15 as active', () => {
    expect(deriveStockLevel(0)).toBe('out');
    expect(deriveStockLevel(1)).toBe('low');
    expect(deriveStockLevel(15)).toBe('low');
    expect(deriveStockLevel(16)).toBe('active');
    expect(deriveStockLevel(100)).toBe('active');
  });
});

describe('createProduct', () => {
  it('persists a new product with EGP→piastres conversion', async () => {
    const created = await createProduct(validForm);
    expect(created.price).toBe(5000);
    expect(created.merchantId).toBeDefined();
    expect(useProductStore.getState().byId[created.id]?.nameAr).toBe('منتج اختبار');
  });

  it('omits oldPrice when not supplied', async () => {
    const created = await createProduct(validForm);
    expect(created.oldPrice).toBeUndefined();
  });

  it('sets oldPrice in piastres when supplied', async () => {
    const created = await createProduct({ ...validForm, oldPriceEgp: 80 });
    expect(created.oldPrice).toBe(8000);
  });
});

describe('updateProduct', () => {
  it('keeps the id and replaces editable fields', async () => {
    const updated = await updateProduct('p1', { ...validForm, priceEgp: 999 });
    expect(updated.id).toBe('p1');
    expect(updated.price).toBe(99900);
    // Preserves the live rating from the seed.
    expect(updated.rating).toBeGreaterThan(0);
  });
});

describe('deleteProduct', () => {
  it('removes the row from the store', async () => {
    await deleteProduct('p1');
    expect(useProductStore.getState().byId['p1']).toBeUndefined();
  });
});

describe('listAdminProducts', () => {
  it('returns all products with no filter', async () => {
    const result = await listAdminProducts({ search: '', stock: 'all' });
    expect(result.totalMatching).toBe(result.totalCount);
  });

  it('filters by stock=out (the seed has p12 with stock 0)', async () => {
    const result = await listAdminProducts({ search: '', stock: 'out' });
    expect(result.rows.every((p) => p.stock === 0)).toBe(true);
    expect(result.rows.length).toBeGreaterThan(0);
  });

  it('filters by stock=low', async () => {
    const result = await listAdminProducts({ search: '', stock: 'low' });
    expect(result.rows.every((p) => p.stock > 0 && p.stock <= 15)).toBe(true);
  });

  it('search matches name and id', async () => {
    const byId = await listAdminProducts({ search: 'P1', stock: 'all' });
    expect(byId.rows.some((p) => p.id === 'p1')).toBe(true);
    const byName = await listAdminProducts({ search: 'طحينة', stock: 'all' });
    expect(byName.rows.length).toBeGreaterThan(0);
  });
});

describe('computeProductsStats + getLowStockAlert', () => {
  it('counts active / low / out correctly', () => {
    const stats = computeProductsStats(Object.values(useProductStore.getState().byId));
    expect(stats.total).toBe(stats.active + stats.low + stats.out);
  });

  it('returns the first 3 flagged product names with the total count', async () => {
    const alert = await getLowStockAlert();
    expect(alert.count).toBeGreaterThan(0);
    expect(alert.productNames.length).toBeLessThanOrEqual(3);
  });
});

describe('CRUD round-trip', () => {
  it('create → list → update → delete reflects on every read', async () => {
    const created = await createProduct(validForm);
    let result = await listAdminProducts({ search: 'Test', stock: 'all' });
    expect(result.rows.some((p) => p.id === created.id)).toBe(true);

    await updateProduct(created.id, { ...validForm, stock: 0 });
    result = await listAdminProducts({ search: '', stock: 'out' });
    expect(result.rows.some((p) => p.id === created.id)).toBe(true);

    await deleteProduct(created.id);
    result = await listAdminProducts({ search: '', stock: 'all' });
    expect(result.rows.some((p) => p.id === created.id)).toBe(false);
  });
});
