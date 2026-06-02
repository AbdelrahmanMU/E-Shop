/**
 * Catalog data access.
 *
 * Mock phase: reads through `src/lib/mock/product-store.ts` (a
 * Zustand-persisted overlay over `MOCK_PRODUCTS`) so admin CRUD
 * surfaces immediately on the storefront.
 * Backend phase: same signatures, replaced with Supabase queries.
 */

import { MOCK_CATEGORIES } from '@/lib/mock/data';
import { delay } from '@/lib/mock/delay';
import { getAllProducts } from '@/lib/mock/product-store';
import type { Category, Product, Uuid } from '@/types/domain';
import type { CatalogFilter } from './schemas';

export async function listCategories(merchantId: Uuid): Promise<Category[]> {
  const rows = MOCK_CATEGORIES.filter((c) => c.merchantId === merchantId);
  return delay([...rows].sort((a, b) => a.sort - b.sort));
}

export async function getCategory(merchantId: Uuid, categoryId: string): Promise<Category | null> {
  const found = MOCK_CATEGORIES.find(
    (c) => c.merchantId === merchantId && c.id === categoryId,
  );
  return delay(found ?? null);
}

export async function listProducts(
  merchantId: Uuid,
  filter: CatalogFilter = { sort: 'newest' },
): Promise<Product[]> {
  let rows = getAllProducts().filter((p) => p.merchantId === merchantId);

  if (filter.categoryId) {
    rows = rows.filter((p) => p.categoryId === filter.categoryId);
  }
  if (filter.badge) {
    rows = rows.filter((p) => p.badge === filter.badge);
  }
  if (filter.query) {
    const q = filter.query.toLowerCase();
    rows = rows.filter(
      (p) =>
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q),
    );
  }

  const sorted = [...rows];
  switch (filter.sort) {
    case 'price_asc':  sorted.sort((a, b) => a.price - b.price); break;
    case 'price_desc': sorted.sort((a, b) => b.price - a.price); break;
    case 'rating':     sorted.sort((a, b) => b.rating - a.rating); break;
    case 'newest':     /* mock data is already in display order */ break;
  }

  return delay(sorted);
}

export async function getProduct(merchantId: Uuid, productId: string): Promise<Product | null> {
  const found = getAllProducts().find(
    (p) => p.merchantId === merchantId && p.id === productId,
  );
  return delay(found ?? null);
}

/**
 * "Featured" — a curated subset for the storefront. In the mock phase
 * it returns the same 4 products the prototype hardcoded (p1, p8, p5, p3).
 * Backend will store a `featured` flag (or use a dedicated table).
 */
export async function listFeatured(merchantId: Uuid, limit = 4): Promise<Product[]> {
  const featuredIds = ['p1', 'p8', 'p5', 'p3'];
  const byId = new Map(
    getAllProducts()
      .filter((p) => p.merchantId === merchantId)
      .map((p) => [p.id, p]),
  );
  const rows = featuredIds
    .map((id) => byId.get(id))
    .filter((p): p is Product => p !== undefined)
    .slice(0, limit);
  return delay(rows);
}
