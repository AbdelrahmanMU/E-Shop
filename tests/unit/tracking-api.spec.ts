import { beforeEach, describe, expect, it } from 'vitest';
import {
  buildTimeline,
  deriveDriverProgress,
  deriveEtaWindow,
  deriveStatusAt,
  getTrackingState,
} from '@/features/tracking/api';
import { createOrder } from '@/features/checkout/api';
import { DEMO_ADDRESS, DEMO_CUSTOMER } from '@/features/checkout/demoCustomer';
import { DEMO_MERCHANT_ID } from '@/lib/mock/data';

const CREATED_AT = '2026-05-25T14:20:00.000Z';
const at = (offsetMin: number): Date => new Date(new Date(CREATED_AT).getTime() + offsetMin * 60_000);

beforeEach(() => {
  window.localStorage.clear();
});

describe('deriveStatusAt', () => {
  it('returns "new" within the first 5 minutes', () => {
    expect(deriveStatusAt(CREATED_AT, at(0))).toBe('new');
    expect(deriveStatusAt(CREATED_AT, at(4))).toBe('new');
  });

  it('returns "preparing" from minute 5 to 15', () => {
    expect(deriveStatusAt(CREATED_AT, at(5))).toBe('preparing');
    expect(deriveStatusAt(CREATED_AT, at(14))).toBe('preparing');
  });

  it('returns "shipping" from minute 15 to 50', () => {
    expect(deriveStatusAt(CREATED_AT, at(15))).toBe('shipping');
    expect(deriveStatusAt(CREATED_AT, at(49))).toBe('shipping');
  });

  it('returns "delivered" after minute 50', () => {
    expect(deriveStatusAt(CREATED_AT, at(50))).toBe('delivered');
    expect(deriveStatusAt(CREATED_AT, at(500))).toBe('delivered');
  });
});

describe('buildTimeline', () => {
  it('grows monotonically as status advances', () => {
    expect(buildTimeline(CREATED_AT, 'new')).toHaveLength(1);
    expect(buildTimeline(CREATED_AT, 'preparing')).toHaveLength(2);
    expect(buildTimeline(CREATED_AT, 'shipping')).toHaveLength(3);
    expect(buildTimeline(CREATED_AT, 'delivered')).toHaveLength(4);
  });

  it('encodes the correct order of status entries', () => {
    const tl = buildTimeline(CREATED_AT, 'shipping');
    expect(tl.map((e) => e.status)).toEqual(['new', 'preparing', 'shipping']);
  });

  it('first entry timestamp matches createdAt', () => {
    const tl = buildTimeline(CREATED_AT, 'shipping');
    expect(tl[0]!.at).toBe(new Date(CREATED_AT).toISOString());
  });
});

describe('deriveDriverProgress', () => {
  it('is 0 when not yet shipping', () => {
    expect(deriveDriverProgress(CREATED_AT, 'new', at(2))).toBe(0);
    expect(deriveDriverProgress(CREATED_AT, 'preparing', at(10))).toBe(0);
  });

  it('linearly interpolates within the shipping window', () => {
    // shipping starts at +15 min, ends at +50 min → midpoint = +32.5
    expect(deriveDriverProgress(CREATED_AT, 'shipping', at(15))).toBeCloseTo(0, 5);
    expect(deriveDriverProgress(CREATED_AT, 'shipping', at(32.5))).toBeCloseTo(0.5, 2);
    // clamps to 1 at/after the end
    expect(deriveDriverProgress(CREATED_AT, 'shipping', at(50))).toBe(1);
  });

  it('is 1 after delivery', () => {
    expect(deriveDriverProgress(CREATED_AT, 'delivered', at(120))).toBe(1);
  });
});

describe('deriveEtaWindow', () => {
  it('produces an earliest < latest window in the future', () => {
    const win = deriveEtaWindow(CREATED_AT);
    const earliest = new Date(win.earliest).getTime();
    const latest = new Date(win.latest).getTime();
    expect(earliest).toBeLessThan(latest);
    expect(earliest).toBeGreaterThan(new Date(CREATED_AT).getTime());
  });
});

describe('getTrackingState', () => {
  it('returns null for an unknown order id', async () => {
    expect(await getTrackingState('SUF-9999-99999', at(0))).toBeNull();
  });

  it('derives a shipping state for an order placed 20 minutes ago', async () => {
    const order = await createOrder({
      merchantId: DEMO_MERCHANT_ID,
      customer: DEMO_CUSTOMER,
      address: DEMO_ADDRESS,
      items: [{ productId: 'p1', qty: 1, priceAtAdd: 28_500 }],
      form: { day: 'tomorrow', slot: 'afternoon', paymentMethod: 'card' },
    });
    // pretend "now" is 20 min after the order was created
    const fakeNow = new Date(new Date(order.createdAt).getTime() + 20 * 60_000);
    const state = await getTrackingState(order.id, fakeNow);
    expect(state).not.toBeNull();
    expect(state!.derivedStatus).toBe('shipping');
    expect(state!.timeline).toHaveLength(3);
    expect(state!.driver.progress).toBeGreaterThan(0);
    expect(state!.driver.progress).toBeLessThan(1);
    expect(state!.etaWindow).not.toBeNull();
  });

  it('returns null etaWindow once delivered', async () => {
    const order = await createOrder({
      merchantId: DEMO_MERCHANT_ID,
      customer: DEMO_CUSTOMER,
      address: DEMO_ADDRESS,
      items: [{ productId: 'p1', qty: 1, priceAtAdd: 28_500 }],
      form: { day: 'tomorrow', slot: 'afternoon', paymentMethod: 'card' },
    });
    const fakeNow = new Date(new Date(order.createdAt).getTime() + 120 * 60_000);
    const state = await getTrackingState(order.id, fakeNow);
    expect(state!.derivedStatus).toBe('delivered');
    expect(state!.etaWindow).toBeNull();
    expect(state!.driver.progress).toBe(1);
  });
});
