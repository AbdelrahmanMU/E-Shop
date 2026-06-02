/**
 * Tracking — mock derivation of order progression from elapsed time.
 *
 * The mock pipeline advances new → preparing → shipping → delivered as
 * minutes pass after the order was placed. Driver position interpolates
 * 0..1 along an SVG-space path during the shipping phase.
 *
 * Backend phase replaces this with:
 *   - a Supabase Realtime subscription on `driver_positions(order_id=…)`
 *   - status reads from the order row itself (admin advances it).
 */

import { getOrder } from '@/features/checkout/api';
import { delay } from '@/lib/mock/delay';
import type { IsoDateTime, Order, OrderId, OrderStatus, OrderTimelineEntry } from '@/types/domain';

// ── Mock timing ──────────────────────────────────────────────────────
/**
 * Per-stage durations (minutes). Total ≈ 50 min, matching the
 * prototype's "ETA 15:45 – 16:00" framing relative to a 14:20 order.
 */
const STAGE_MINUTES: Record<Exclude<OrderStatus, 'cancelled'>, number> = {
  new:        5,    // 0–5 min after createdAt
  preparing:  10,   // 5–15 min
  shipping:   35,   // 15–50 min
  delivered:  0,    // terminal
};

const STAGE_ORDER: ReadonlyArray<Exclude<OrderStatus, 'cancelled'>> = [
  'new',
  'preparing',
  'shipping',
  'delivered',
];

const minToMs = (m: number): number => m * 60 * 1000;

export interface EtaWindow {
  earliest: IsoDateTime;
  latest: IsoDateTime;
}

export interface DriverPositionPct {
  /** 0..1 along the path. 0 = origin, 1 = destination. */
  progress: number;
}

export interface TrackingState {
  order: Order;
  /** Live status after elapsed-time progression (mock); may differ from order.status. */
  derivedStatus: OrderStatus;
  timeline: OrderTimelineEntry[];
  driver: DriverPositionPct;
  etaWindow: EtaWindow | null;
}

// ── Stage transition helpers (pure) ──────────────────────────────────

export function deriveStatusAt(createdAt: IsoDateTime, now: Date = new Date()): Exclude<OrderStatus, 'cancelled'> {
  const elapsed = now.getTime() - new Date(createdAt).getTime();
  let cumulative = 0;
  for (const stage of STAGE_ORDER) {
    cumulative += minToMs(STAGE_MINUTES[stage]);
    if (stage === 'delivered') return 'delivered';
    if (elapsed < cumulative) return stage;
  }
  return 'delivered';
}

export function buildTimeline(
  createdAt: IsoDateTime,
  derivedStatus: Exclude<OrderStatus, 'cancelled'>,
): OrderTimelineEntry[] {
  const start = new Date(createdAt).getTime();
  const entries: OrderTimelineEntry[] = [];
  let cumulative = 0;
  const reached = STAGE_ORDER.indexOf(derivedStatus);
  for (let i = 0; i < STAGE_ORDER.length; i += 1) {
    const stage = STAGE_ORDER[i]!;
    if (i > reached) break;
    const at = new Date(start + cumulative).toISOString();
    entries.push({ status: stage, at });
    cumulative += minToMs(STAGE_MINUTES[stage]);
  }
  return entries;
}

export function deriveDriverProgress(
  createdAt: IsoDateTime,
  derivedStatus: Exclude<OrderStatus, 'cancelled'>,
  now: Date = new Date(),
): number {
  if (derivedStatus === 'new' || derivedStatus === 'preparing') return 0;
  if (derivedStatus === 'delivered') return 1;
  // shipping — interpolate within the shipping window
  const start = new Date(createdAt).getTime();
  const shippingStart = start + minToMs(STAGE_MINUTES.new + STAGE_MINUTES.preparing);
  const shippingEnd = shippingStart + minToMs(STAGE_MINUTES.shipping);
  const t = (now.getTime() - shippingStart) / (shippingEnd - shippingStart);
  return Math.max(0, Math.min(1, t));
}

export function deriveEtaWindow(createdAt: IsoDateTime): EtaWindow {
  const start = new Date(createdAt).getTime();
  const totalMin = STAGE_MINUTES.new + STAGE_MINUTES.preparing + STAGE_MINUTES.shipping;
  const earliest = new Date(start + minToMs(totalMin - 5)).toISOString();
  const latest = new Date(start + minToMs(totalMin + 10)).toISOString();
  return { earliest, latest };
}

// ── Public API ───────────────────────────────────────────────────────

export async function getTrackingState(
  orderId: OrderId,
  now: Date = new Date(),
): Promise<TrackingState | null> {
  const order = await getOrder(orderId);
  if (!order) return null;

  if (order.status === 'cancelled') {
    return delay({
      order,
      derivedStatus: 'cancelled' as OrderStatus,
      timeline: order.timeline,
      driver: { progress: 0 },
      etaWindow: null,
    });
  }

  const derivedStatus = deriveStatusAt(order.createdAt, now);
  const timeline = buildTimeline(order.createdAt, derivedStatus);
  const driver = { progress: deriveDriverProgress(order.createdAt, derivedStatus, now) };
  const etaWindow = derivedStatus === 'delivered' ? null : deriveEtaWindow(order.createdAt);

  return delay({ order, derivedStatus, timeline, driver, etaWindow });
}
