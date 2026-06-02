/**
 * Checkout — order creation (mock).
 *
 * Backend phase: same signature, but the body invokes a Supabase edge
 * function (`create-order`) that re-validates totals server-side. The
 * client never decides what an order costs.
 */

import type { CartLine } from '@/features/cart/store';
import { delay } from '@/lib/mock/delay';
import { DEMO_MERCHANT_ID } from '@/lib/mock/data';
import { readJson, writeJson } from '@/lib/storage';
import { StoredOrdersIndexSchema, type StoredOrdersIndex } from '@/types/storage-schemas';
import type {
  Address,
  Customer,
  IsoDateTime,
  Order,
  OrderId,
  OrderItem,
  PaymentMethod,
  Uuid,
} from '@/types/domain';
import { computeTotals } from './pricing';
import type { CheckoutFormValues, DeliveryDay, DeliverySlot } from './schemas';

export const ORDERS_KEY = 'sufra:mock-orders';
const EMPTY_INDEX: StoredOrdersIndex = {};

// ── Visual-QA fixtures ──────────────────────────────────────────────
// Backdated demo orders so /tracking/<id> can render the shipping and
// delivered states immediately, without waiting through 15+ minutes of
// derived progression. Not persisted — resolved by getOrder() as a
// fallback when the live store misses.
const DEMO_AGE_MIN: Record<string, number> = {
  'SUF-DEMO-SHIP': 25, // mid-shipping
  'SUF-DEMO-DONE': 90, // delivered
};

function buildDemoOrder(id: OrderId, ageMinutes: number): Order {
  const createdAt = new Date(Date.now() - ageMinutes * 60_000).toISOString();
  return {
    id,
    merchantId: DEMO_MERCHANT_ID,
    customerId: '00000000-0000-4000-8000-000000000010',
    customerName: 'أحمد المصري',
    addressId: '00000000-0000-4000-8000-000000000020',
    city: 'القاهرة · المعادي',
    items: [{ productId: 'p1', qty: 1, priceAtTime: 28_500 }],
    itemCount: 1,
    subtotal: 28_500,
    deliveryFee: 4_500,
    discount: 2_500,
    total: 30_500,
    status: 'new',
    paymentMethod: 'wallet',
    paymentStatus: 'pending',
    scheduledFor: createdAt,
    createdAt,
    timeline: [{ status: 'new', at: createdAt }],
  };
}

interface CreateOrderInput {
  merchantId: Uuid;
  customer: Customer;
  address: Address;
  items: CartLine[];
  form: CheckoutFormValues;
}

// ── Order ID + scheduled-for derivation ──────────────────────────────
let lastSeq = 4891; // continues the prototype's sample IDs

function nextOrderId(now: Date = new Date()): OrderId {
  lastSeq += 1;
  const year = now.getFullYear();
  return `SUF-${year}-${String(lastSeq).padStart(5, '0')}`;
}

const SLOT_HOURS: Record<DeliverySlot, number> = {
  morning:   10,
  afternoon: 14,
  evening:   18,
};

const DAY_OFFSETS: Record<DeliveryDay, number> = {
  today:      0,
  tomorrow:   1,
  d_plus_2:   2,
};

function deriveScheduledFor(day: DeliveryDay, slot: DeliverySlot, now: Date = new Date()): IsoDateTime {
  const d = new Date(now);
  d.setDate(d.getDate() + DAY_OFFSETS[day]);
  d.setHours(SLOT_HOURS[slot], 0, 0, 0);
  return d.toISOString();
}

// ── Persistence (mock) ───────────────────────────────────────────────
function readOrdersIndex(): Record<OrderId, Order> {
  return readJson(ORDERS_KEY, StoredOrdersIndexSchema, EMPTY_INDEX) as Record<OrderId, Order>;
}

function writeOrdersIndex(index: Record<OrderId, Order>): void {
  writeJson(ORDERS_KEY, index);
}

// ── Public API ───────────────────────────────────────────────────────
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  if (input.items.length === 0) {
    throw new Error('cart is empty');
  }
  const now = new Date();
  const orderId = nextOrderId(now);
  const totals = computeTotals(input.items, { premium: input.customer.tier === 'premium' });

  const orderItems: OrderItem[] = input.items.map((l) => ({
    productId: l.productId,
    qty: l.qty,
    priceAtTime: l.priceAtAdd,
  }));

  const scheduledFor = deriveScheduledFor(input.form.day, input.form.slot, now);

  const order: Order = {
    id: orderId,
    merchantId: input.merchantId,
    customerId: input.customer.id,
    customerName: input.customer.name,
    addressId: input.address.id,
    city: `${input.address.city} · ${input.address.district}`,
    items: orderItems,
    itemCount: orderItems.reduce((sum, i) => sum + i.qty, 0),
    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    discount: totals.discount,
    total: totals.total,
    status: 'new',
    paymentMethod: input.form.paymentMethod as PaymentMethod,
    // Mock: card/wallet are "captured immediately" because there's no
    // real gateway. Backend phase: all non-cash starts `pending` until
    // the Stripe webhook flips it. Cash always stays `pending` until COD.
    paymentStatus: input.form.paymentMethod === 'cash' ? 'pending' : 'paid',
    scheduledFor,
    createdAt: now.toISOString(),
    timeline: [{ status: 'new', at: now.toISOString() }],
  };

  const index = readOrdersIndex();
  index[orderId] = order;
  writeOrdersIndex(index);

  return delay(order);
}

export async function getOrder(orderId: OrderId): Promise<Order | null> {
  const live = readOrdersIndex()[orderId];
  if (live) return delay(live);
  const demoAge = DEMO_AGE_MIN[orderId];
  if (demoAge !== undefined) return delay(buildDemoOrder(orderId, demoAge));
  return delay(null);
}
