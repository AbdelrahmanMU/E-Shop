import { beforeEach, describe, expect, it } from 'vitest';
import {
  selectCartItemCount,
  selectCartLineCount,
  selectCartSubtotalPiastres,
  useCartStore,
} from '@/features/cart/store';

const PRODUCT_A = { id: 'p-a', price: 1000, stock: 10 };
const PRODUCT_B = { id: 'p-b', price: 2500, stock: 3 };

describe('cart store', () => {
  beforeEach(() => {
    useCartStore.getState().clear();
  });

  it('starts empty', () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(selectCartLineCount(state)).toBe(0);
    expect(selectCartItemCount(state)).toBe(0);
    expect(selectCartSubtotalPiastres(state)).toBe(0);
  });

  it('add stores price-at-add and a default qty of 1', () => {
    useCartStore.getState().add(PRODUCT_A);
    const state = useCartStore.getState();
    expect(state.items).toEqual([{ productId: 'p-a', qty: 1, priceAtAdd: 1000 }]);
    expect(selectCartItemCount(state)).toBe(1);
  });

  it('add merges into the existing line and respects stock cap', () => {
    useCartStore.getState().add(PRODUCT_B, 2);
    useCartStore.getState().add(PRODUCT_B, 5); // would be 7 but stock = 3
    const line = useCartStore.getState().items[0]!;
    expect(line.qty).toBe(3);
  });

  it('add is a no-op when stock is 0', () => {
    useCartStore.getState().add({ id: 'sold', price: 500, stock: 0 });
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('increment and decrement adjust the line; decrement at qty=1 removes', () => {
    useCartStore.getState().add(PRODUCT_A);
    useCartStore.getState().increment('p-a');
    expect(useCartStore.getState().items[0]!.qty).toBe(2);
    useCartStore.getState().decrement('p-a');
    expect(useCartStore.getState().items[0]!.qty).toBe(1);
    useCartStore.getState().decrement('p-a');
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('setQty replaces the value, qty <= 0 removes the line', () => {
    useCartStore.getState().add(PRODUCT_A);
    useCartStore.getState().setQty('p-a', 5);
    expect(useCartStore.getState().items[0]!.qty).toBe(5);
    useCartStore.getState().setQty('p-a', 0);
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('remove drops a line', () => {
    useCartStore.getState().add(PRODUCT_A);
    useCartStore.getState().add(PRODUCT_B);
    useCartStore.getState().remove('p-a');
    expect(useCartStore.getState().items.map((l) => l.productId)).toEqual(['p-b']);
  });

  it('clear empties everything', () => {
    useCartStore.getState().add(PRODUCT_A);
    useCartStore.getState().add(PRODUCT_B);
    useCartStore.getState().clear();
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('selectors compute correct totals across multiple lines', () => {
    useCartStore.getState().add(PRODUCT_A, 3);     // 3 × 1000 = 3000
    useCartStore.getState().add(PRODUCT_B, 2);     // 2 × 2500 = 5000
    const state = useCartStore.getState();
    expect(selectCartLineCount(state)).toBe(2);
    expect(selectCartItemCount(state)).toBe(5);
    expect(selectCartSubtotalPiastres(state)).toBe(8000);
  });
});
