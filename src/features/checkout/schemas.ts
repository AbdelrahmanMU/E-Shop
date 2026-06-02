import { z } from 'zod';

export const DELIVERY_DAYS = ['today', 'tomorrow', 'd_plus_2'] as const;
export const DELIVERY_SLOTS = ['morning', 'afternoon', 'evening'] as const;
export const PAYMENT_METHODS = ['wallet', 'card', 'cash'] as const;

export const CheckoutFormSchema = z.object({
  day: z.enum(DELIVERY_DAYS, { required_error: 'choose a delivery day' }),
  slot: z.enum(DELIVERY_SLOTS, { required_error: 'choose a delivery slot' }),
  paymentMethod: z.enum(PAYMENT_METHODS, { required_error: 'choose a payment method' }),
});

export type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>;
export type DeliveryDay = (typeof DELIVERY_DAYS)[number];
export type DeliverySlot = (typeof DELIVERY_SLOTS)[number];
