/**
 * Zod schemas for every persisted-localStorage shape we rely on.
 * Kept centrally so a single review surface shows what data is allowed
 * to round-trip through the user's browser storage.
 */

import { z } from 'zod';

// ── Order persistence (sufra:mock-orders) ──────────────────────────

const OrderStatusSchema = z.enum(['new', 'preparing', 'shipping', 'delivered', 'cancelled']);
const PaymentMethodSchema = z.enum(['cash', 'card', 'wallet']);
const PaymentStatusSchema = z.enum(['pending', 'paid', 'refunded']);

const OrderItemSchema = z.object({
  productId: z.string(),
  qty: z.number().int().nonnegative(),
  priceAtTime: z.number().int().nonnegative(),
});

const OrderTimelineEntrySchema = z.object({
  status: OrderStatusSchema,
  at: z.string(),
});

const OrderSchema = z.object({
  id: z.string(),
  merchantId: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  addressId: z.string().optional(),
  city: z.string(),
  items: z.array(OrderItemSchema),
  itemCount: z.number().int().nonnegative(),
  subtotal: z.number().int().nonnegative(),
  deliveryFee: z.number().int().nonnegative(),
  discount: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  status: OrderStatusSchema,
  paymentMethod: PaymentMethodSchema,
  paymentStatus: PaymentStatusSchema,
  scheduledFor: z.string().optional(),
  createdAt: z.string(),
  timeline: z.array(OrderTimelineEntrySchema),
});

export const StoredOrdersIndexSchema = z.record(z.string(), OrderSchema);
export type StoredOrdersIndex = z.infer<typeof StoredOrdersIndexSchema>;

// ── Cart persistence (sufra:cart, zustand-persist envelope) ────────

const CartLineSchema = z.object({
  productId: z.string(),
  qty: z.number().int().positive(),
  priceAtAdd: z.number().int().nonnegative(),
});

/** Inner state we put into the persist's `partialize`. */
export const StoredCartStateSchema = z.object({
  items: z.array(CartLineSchema),
});
export type StoredCartState = z.infer<typeof StoredCartStateSchema>;

// ── Product persistence (sufra:products, zustand-persist envelope) ─

const ProductBadgeSchema = z.enum(['bestseller', 'handmade', 'limited', 'organic', 'new']);

const ProductSchema = z.object({
  id: z.string(),
  merchantId: z.string(),
  categoryId: z.string(),
  nameAr: z.string(),
  nameEn: z.string(),
  subtitle: z.string(),
  price: z.number().int().nonnegative(),
  oldPrice: z.number().int().nonnegative().optional(),
  weight: z.string(),
  rating: z.number().nonnegative(),
  reviewCount: z.number().int().nonnegative(),
  badge: ProductBadgeSchema.optional(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string()),
  glyph: z.string().optional(),
});

export const StoredProductsStateSchema = z.object({
  byId: z.record(z.string(), ProductSchema),
});
export type StoredProductsState = z.infer<typeof StoredProductsStateSchema>;
