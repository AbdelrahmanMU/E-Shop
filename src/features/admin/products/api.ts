/**
 * Admin products — list with filters + CRUD against the shared product
 * store (`src/lib/mock/product-store.ts`). Customer Catalog reads from
 * the same store, so admin edits appear on the storefront immediately.
 *
 * Backend phase: replaced by Supabase against the `products` table;
 * low-stock derivation moves into a Postgres function flagging products
 * with `stock <= reorder_threshold`.
 */

import { useCartStore } from '@/features/cart/store';
import { DEMO_MERCHANT_ID } from '@/lib/mock/data';
import { delay } from '@/lib/mock/delay';
import { getAllProducts, useProductStore } from '@/lib/mock/product-store';
import { toPiastres } from '@/lib/money';
import type { Product } from '@/types/domain';
import type { ProductStockLevel } from '@/features/admin/components/StatusChip';
import type { ProductFormValues, StockFilter } from './schemas';

const LOW_STOCK_THRESHOLD = 15;

export function deriveStockLevel(stock: number): ProductStockLevel {
  if (stock === 0) return 'out';
  if (stock <= LOW_STOCK_THRESHOLD) return 'low';
  return 'active';
}

// ── List + filter ───────────────────────────────────────────────────

export interface AdminProductsFilter {
  search: string;
  stock: StockFilter;
}

export function applyProductFilter(
  products: ReadonlyArray<Product>,
  filter: AdminProductsFilter,
): Product[] {
  let rows: Product[] = [...products];
  if (filter.stock !== 'all') {
    rows = rows.filter((p) => deriveStockLevel(p.stock) === filter.stock);
  }
  if (filter.search.trim()) {
    const q = filter.search.trim().toLowerCase();
    rows = rows.filter(
      (p) =>
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q),
    );
  }
  return rows;
}

export interface AdminProductsResult {
  rows: Product[];
  totalCount: number;
  totalMatching: number;
}

export async function listAdminProducts(filter: AdminProductsFilter): Promise<AdminProductsResult> {
  const all = getAllProducts();
  const matching = applyProductFilter(all, filter);
  return delay({ rows: matching, totalCount: all.length, totalMatching: matching.length });
}

// ── Stats ──────────────────────────────────────────────────────────

export interface AdminProductsStats {
  total: number;
  active: number;
  low: number;
  out: number;
}

export function computeProductsStats(products: ReadonlyArray<Product>): AdminProductsStats {
  return {
    total: products.length,
    active: products.filter((p) => deriveStockLevel(p.stock) === 'active').length,
    low:    products.filter((p) => deriveStockLevel(p.stock) === 'low').length,
    out:    products.filter((p) => deriveStockLevel(p.stock) === 'out').length,
  };
}

export async function getProductsStats(): Promise<AdminProductsStats> {
  return delay(computeProductsStats(getAllProducts()));
}

// ── Low-stock alert (low + out) ────────────────────────────────────

export interface LowStockAlert {
  count: number;
  productNames: string[];
}

export async function getLowStockAlert(): Promise<LowStockAlert> {
  const flagged = getAllProducts().filter(
    (p) => deriveStockLevel(p.stock) !== 'active',
  );
  return delay({
    count: flagged.length,
    productNames: flagged.slice(0, 3).map((p) => p.nameAr),
  });
}

// ── CRUD ───────────────────────────────────────────────────────────

let nextSyntheticId = 100;

function nextProductId(): string {
  // Existing seed ids are p1..p12; assign p100+ to new ones so admin
  // creations never collide with the demo catalogue.
  nextSyntheticId += 1;
  return `p${nextSyntheticId}`;
}

function formToProduct(values: ProductFormValues, baseId?: string): Product {
  const id = baseId ?? nextProductId();
  const cleanGlyph = values.glyph && values.glyph.length > 0 ? values.glyph : undefined;
  return {
    id,
    merchantId: DEMO_MERCHANT_ID,
    categoryId: values.categoryId,
    nameAr: values.nameAr,
    nameEn: values.nameEn,
    subtitle: values.subtitle,
    price: toPiastres(values.priceEgp),
    ...(values.oldPriceEgp !== undefined ? { oldPrice: toPiastres(values.oldPriceEgp) } : {}),
    weight: values.weight,
    rating: 0,
    reviewCount: 0,
    ...(values.badge !== undefined ? { badge: values.badge } : {}),
    stock: values.stock,
    images: [],
    ...(cleanGlyph !== undefined ? { glyph: cleanGlyph } : {}),
  };
}

export async function createProduct(values: ProductFormValues): Promise<Product> {
  const product = formToProduct(values);
  useProductStore.getState().upsert(product);
  return delay(product);
}

export async function updateProduct(id: string, values: ProductFormValues): Promise<Product> {
  const existing = useProductStore.getState().byId[id];
  const product = formToProduct(values, id);
  // Preserve rating/reviewCount from the live row if it existed.
  if (existing) {
    product.rating = existing.rating;
    product.reviewCount = existing.reviewCount;
  }
  useProductStore.getState().upsert(product);
  return delay(product);
}

export async function deleteProduct(id: string): Promise<void> {
  useProductStore.getState().remove(id);
  // Also drop the product from any active cart so the customer doesn't see
  // a phantom line that still contributes to the subtotal.
  useCartStore.getState().remove(id);
  return delay(undefined);
}
