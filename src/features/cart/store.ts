import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StoredCartStateSchema } from '@/types/storage-schemas';
import type { Product } from '@/types/domain';

export interface CartLine {
  productId: Product['id'];
  qty: number;
  /** Captured at add time so total math is stable if catalog price changes. */
  priceAtAdd: number;
}

interface CartState {
  items: CartLine[];
  add: (product: Pick<Product, 'id' | 'price' | 'stock'>, qty?: number) => void;
  increment: (productId: Product['id']) => void;
  decrement: (productId: Product['id']) => void;
  setQty: (productId: Product['id'], qty: number) => void;
  remove: (productId: Product['id']) => void;
  clear: () => void;
}

const STORAGE_KEY = 'sufra:cart';
const STORAGE_VERSION = 1;

const clampQty = (qty: number, stock: number): number => {
  if (qty <= 0) return 0;
  if (stock > 0 && qty > stock) return stock;
  return Math.floor(qty);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, _get) => ({
      items: [],

      add: (product, qty = 1) => {
        if (product.stock <= 0) return;
        set((state) => {
          const existing = state.items.find((l) => l.productId === product.id);
          const nextQty = clampQty((existing?.qty ?? 0) + qty, product.stock);
          if (nextQty === 0) {
            return { items: state.items.filter((l) => l.productId !== product.id) };
          }
          if (existing) {
            return {
              items: state.items.map((l) =>
                l.productId === product.id ? { ...l, qty: nextQty } : l,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { productId: product.id, qty: nextQty, priceAtAdd: product.price },
            ],
          };
        });
      },

      increment: (productId) =>
        set((state) => ({
          items: state.items.map((l) =>
            l.productId === productId ? { ...l, qty: l.qty + 1 } : l,
          ),
        })),

      decrement: (productId) =>
        set((state) => {
          const line = state.items.find((l) => l.productId === productId);
          if (!line) return state;
          if (line.qty <= 1) {
            return { items: state.items.filter((l) => l.productId !== productId) };
          }
          return {
            items: state.items.map((l) =>
              l.productId === productId ? { ...l, qty: l.qty - 1 } : l,
            ),
          };
        }),

      setQty: (productId, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter((l) => l.productId !== productId) };
          }
          return {
            items: state.items.map((l) =>
              l.productId === productId ? { ...l, qty: Math.floor(qty) } : l,
            ),
          };
        }),

      remove: (productId) =>
        set((state) => ({ items: state.items.filter((l) => l.productId !== productId) })),

      clear: () => set({ items: [] }),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      // Drop persisted state if its shape doesn't match — covers stale
      // storage after a model migration or user-edited devtools pollution.
      merge: (persisted, current) => {
        const parsed = StoredCartStateSchema.safeParse(persisted);
        return parsed.success ? { ...current, items: parsed.data.items } : current;
      },
    },
  ),
);

// ── Selectors (use these in components rather than reading state directly) ──

export const selectCartItems = (state: CartState): CartLine[] => state.items;
export const selectCartLineCount = (state: CartState): number => state.items.length;
export const selectCartItemCount = (state: CartState): number =>
  state.items.reduce((sum, l) => sum + l.qty, 0);
export const selectCartSubtotalPiastres = (state: CartState): number =>
  state.items.reduce((sum, l) => sum + l.priceAtAdd * l.qty, 0);
