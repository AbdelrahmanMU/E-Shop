import { beforeEach, describe, expect, it } from 'vitest';
import { deleteProduct } from '@/features/admin/products/api';
import { useCartStore } from '@/features/cart/store';
import { useProductStore } from '@/lib/mock/product-store';

beforeEach(() => {
  useProductStore.getState().reset();
  useCartStore.getState().clear();
  window.localStorage.removeItem('sufra:products');
  window.localStorage.removeItem('sufra:cart');
});

describe('admin product delete → cart sync', () => {
  it('removes the product from an active cart so its subtotal stays correct', async () => {
    // Add p1 to the cart (the customer is shopping right now).
    useCartStore.getState().add({ id: 'p1', price: 28_500, stock: 28 }, 2);
    expect(useCartStore.getState().items.find((l) => l.productId === 'p1')).toBeDefined();

    // Admin deletes p1 from the catalogue.
    await deleteProduct('p1');

    // Cart line is gone; subtotal recomputes cleanly.
    expect(useCartStore.getState().items.find((l) => l.productId === 'p1')).toBeUndefined();
  });

  it('leaves other cart lines untouched', async () => {
    useCartStore.getState().add({ id: 'p1', price: 28_500, stock: 28 });
    useCartStore.getState().add({ id: 'p2', price:  9_500, stock: 42 });

    await deleteProduct('p1');

    expect(useCartStore.getState().items.map((l) => l.productId)).toEqual(['p2']);
  });
});
