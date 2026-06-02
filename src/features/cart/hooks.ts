import { useCartStore, selectCartItemCount, selectCartLineCount, selectCartSubtotalPiastres } from './store';

export const useCartItems = () => useCartStore((s) => s.items);
export const useCartItemCount = () => useCartStore(selectCartItemCount);
export const useCartLineCount = () => useCartStore(selectCartLineCount);
export const useCartSubtotal = () => useCartStore(selectCartSubtotalPiastres);

export const useCartActions = () => {
  const add = useCartStore((s) => s.add);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  return { add, increment, decrement, setQty, remove, clear };
};
