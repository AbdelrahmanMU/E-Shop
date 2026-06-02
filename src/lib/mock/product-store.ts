import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StoredProductsStateSchema } from '@/types/storage-schemas';
import type { Product } from '@/types/domain';
import { MOCK_PRODUCTS } from './data';

/**
 * Single source of truth for the product catalog during the mock phase.
 *
 * Customer-side `catalog/api.ts` reads through this store, and admin
 * CRUD writes through it — so admin edits show up on the storefront
 * immediately. Backend phase: every read/write becomes a Supabase
 * query against the `products` table.
 */

interface ProductStoreState {
  byId: Record<Product['id'], Product>;
  upsert: (product: Product) => void;
  remove: (productId: Product['id']) => void;
  reset: () => void;
}

const STORAGE_KEY = 'sufra:products';
const STORAGE_VERSION = 1;

const seedById = (): Record<Product['id'], Product> => {
  const out: Record<string, Product> = {};
  for (const p of MOCK_PRODUCTS) out[p.id] = p;
  return out;
};

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set) => ({
      byId: seedById(),
      upsert: (product) =>
        set((state) => ({ byId: { ...state.byId, [product.id]: product } })),
      remove: (productId) =>
        set((state) => {
          const next = { ...state.byId };
          delete next[productId];
          return { byId: next };
        }),
      reset: () => set({ byId: seedById() }),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ byId: state.byId }),
      // Validate persisted shape on rehydrate. Bad shape falls back to
      // the in-memory seed (which is current state at this point).
      // Cast: Zod's inferred type widens optional fields to `T | undefined`
      // under exactOptionalPropertyTypes; runtime shape is identical.
      merge: (persisted, current): ProductStoreState => {
        const parsed = StoredProductsStateSchema.safeParse(persisted);
        if (!parsed.success) return current;
        return {
          ...current,
          byId: parsed.data.byId as Record<string, Product>,
        };
      },
    },
  ),
);

/** Snapshot accessor for non-React code (api.ts modules). */
export const getAllProducts = (): Product[] =>
  Object.values(useProductStore.getState().byId);
