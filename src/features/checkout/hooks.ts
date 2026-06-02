import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import { useCartStore } from '@/features/cart/store';
import { useMerchant } from '@/hooks/useMerchant';
import type { Order, OrderId } from '@/types/domain';
import { createOrder, getOrder } from './api';
import { DEMO_ADDRESS, DEMO_CUSTOMER } from './demoCustomer';
import type { CheckoutFormValues } from './schemas';

/**
 * Stub auth — until the backend phase lights up Supabase Auth,
 * the checkout always uses the demo customer + address.
 */
export const useCheckoutCustomer = () => ({ customer: DEMO_CUSTOMER, address: DEMO_ADDRESS });

export function useCreateOrder(): UseMutationResult<Order, Error, CheckoutFormValues> {
  const { merchant } = useMerchant();
  const { customer, address } = useCheckoutCustomer();
  const clearCart = useCartStore((s) => s.clear);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: CheckoutFormValues) => {
      const items = useCartStore.getState().items;
      const order = await createOrder({
        merchantId: merchant.id,
        customer,
        address,
        items,
        form,
      });
      clearCart();
      queryClient.setQueryData(['order', order.id], order);
      // The account screen reads order count + active count from the same
      // localStorage we just wrote — drop its cached profile so it refetches.
      void queryClient.invalidateQueries({ queryKey: ['customer-profile'] });
      return order;
    },
  });
}

export function useOrder(orderId: OrderId | undefined): UseQueryResult<Order | null> {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => (orderId ? getOrder(orderId) : Promise.resolve(null)),
    enabled: !!orderId,
  });
}
