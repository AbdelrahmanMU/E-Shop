import { beforeEach, describe, expect, it } from 'vitest';
import { createOrder, getOrder } from '@/features/checkout/api';
import { DEMO_ADDRESS, DEMO_CUSTOMER } from '@/features/checkout/demoCustomer';
import {
  FLAT_DELIVERY_PIASTRES,
  PREMIUM_DISCOUNT_PIASTRES,
} from '@/features/checkout/pricing';
import { CheckoutFormSchema, type CheckoutFormValues } from '@/features/checkout/schemas';
import { DEMO_MERCHANT_ID } from '@/lib/mock/data';

const baseLine = { priceAtAdd: 12_000 };          // 120 EGP
const goodForm: CheckoutFormValues = { day: 'tomorrow', slot: 'afternoon', paymentMethod: 'card' };

beforeEach(() => {
  window.localStorage.clear();
});

describe('createOrder', () => {
  it('throws when the cart is empty', async () => {
    await expect(() =>
      createOrder({
        merchantId: DEMO_MERCHANT_ID,
        customer: DEMO_CUSTOMER,
        address: DEMO_ADDRESS,
        items: [],
        form: goodForm,
      }),
    ).rejects.toThrow(/empty/);
  });

  it('issues a SUF-YYYY-NNNNN id and writes the order to localStorage', async () => {
    const items = [{ productId: 'p1', qty: 2, priceAtAdd: 28_500 }];
    const order = await createOrder({
      merchantId: DEMO_MERCHANT_ID,
      customer: DEMO_CUSTOMER,
      address: DEMO_ADDRESS,
      items,
      form: goodForm,
    });

    expect(order.id).toMatch(/^SUF-\d{4}-\d{5}$/);
    const stored = JSON.parse(window.localStorage.getItem('sufra:mock-orders') ?? '{}');
    expect(stored[order.id]).toBeDefined();
    expect(stored[order.id].total).toBe(order.total);
  });

  it('computes subtotal + delivery − premium discount for a premium customer', async () => {
    const items = [{ productId: 'p1', qty: 2, ...baseLine }]; // subtotal = 24000
    const order = await createOrder({
      merchantId: DEMO_MERCHANT_ID,
      customer: DEMO_CUSTOMER, // premium
      address: DEMO_ADDRESS,
      items,
      form: goodForm,
    });
    expect(order.subtotal).toBe(24_000);
    expect(order.deliveryFee).toBe(FLAT_DELIVERY_PIASTRES);
    expect(order.discount).toBe(PREMIUM_DISCOUNT_PIASTRES);
    expect(order.total).toBe(24_000 + FLAT_DELIVERY_PIASTRES - PREMIUM_DISCOUNT_PIASTRES);
  });

  it('omits the membership discount for a standard customer', async () => {
    const items = [{ productId: 'p1', qty: 1, ...baseLine }];
    const order = await createOrder({
      merchantId: DEMO_MERCHANT_ID,
      customer: { ...DEMO_CUSTOMER, tier: 'standard' },
      address: DEMO_ADDRESS,
      items,
      form: goodForm,
    });
    expect(order.discount).toBe(0);
    expect(order.total).toBe(12_000 + FLAT_DELIVERY_PIASTRES);
  });

  it('seeds paymentStatus by method: cash → pending, card/wallet → paid', async () => {
    const items = [{ productId: 'p1', qty: 1, ...baseLine }];

    const cashOrder = await createOrder({
      merchantId: DEMO_MERCHANT_ID,
      customer: DEMO_CUSTOMER,
      address: DEMO_ADDRESS,
      items,
      form: { ...goodForm, paymentMethod: 'cash' },
    });
    expect(cashOrder.paymentStatus).toBe('pending');

    const cardOrder = await createOrder({
      merchantId: DEMO_MERCHANT_ID,
      customer: DEMO_CUSTOMER,
      address: DEMO_ADDRESS,
      items,
      form: { ...goodForm, paymentMethod: 'card' },
    });
    expect(cardOrder.paymentStatus).toBe('paid');

    const walletOrder = await createOrder({
      merchantId: DEMO_MERCHANT_ID,
      customer: DEMO_CUSTOMER,
      address: DEMO_ADDRESS,
      items,
      form: { ...goodForm, paymentMethod: 'wallet' },
    });
    expect(walletOrder.paymentStatus).toBe('paid');
  });

  it('seeds the order with a "new" status + timeline + matching customerId', async () => {
    const items = [{ productId: 'p1', qty: 1, ...baseLine }];
    const order = await createOrder({
      merchantId: DEMO_MERCHANT_ID,
      customer: DEMO_CUSTOMER,
      address: DEMO_ADDRESS,
      items,
      form: goodForm,
    });
    expect(order.status).toBe('new');
    expect(order.timeline).toEqual([{ status: 'new', at: order.createdAt }]);
    expect(order.customerId).toBe(DEMO_CUSTOMER.id);
    expect(order.addressId).toBe(DEMO_ADDRESS.id);
  });

  it('getOrder reads back the order by id', async () => {
    const items = [{ productId: 'p1', qty: 1, ...baseLine }];
    const order = await createOrder({
      merchantId: DEMO_MERCHANT_ID,
      customer: DEMO_CUSTOMER,
      address: DEMO_ADDRESS,
      items,
      form: goodForm,
    });
    const fetched = await getOrder(order.id);
    expect(fetched?.id).toBe(order.id);
    expect(await getOrder('SUF-2000-99999')).toBeNull();
  });
});

describe('CheckoutFormSchema', () => {
  it('accepts a valid form', () => {
    const r = CheckoutFormSchema.safeParse(goodForm);
    expect(r.success).toBe(true);
  });

  it('rejects an unknown payment method', () => {
    const r = CheckoutFormSchema.safeParse({ ...goodForm, paymentMethod: 'crypto' });
    expect(r.success).toBe(false);
  });

  it('rejects an unknown delivery day', () => {
    const r = CheckoutFormSchema.safeParse({ ...goodForm, day: 'next-week' });
    expect(r.success).toBe(false);
  });
});
