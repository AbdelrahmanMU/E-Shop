/**
 * Sufra domain model.
 *
 * Shape mirrors the Postgres schema described in README.md so the
 * Supabase swap (backend phase) only changes each feature's api.ts,
 * not the UI layer.
 *
 * Money is stored as integer **piastres** (1 EGP = 100 piastres).
 */

import type { Piastres } from '@/lib/money';

// ── Identifiers ─────────────────────────────────────────────────────
export type Uuid = string;                        // RFC 4122
export type OrderId = string;                     // "SUF-YYYY-NNNNN"
export type IsoDateTime = string;                 // 2026-05-16T14:20:00Z

// ── Merchant ───────────────────────────────────────────────────────
export interface Merchant {
  id: Uuid;
  slug: string;
  name: string;
  themeJson: Record<string, string>;             // CSS-var overrides
  createdAt: IsoDateTime;
}

// ── Category ────────────────────────────────────────────────────────
export interface Category {
  id: string;                                     // slug-style ("olive", "tahini", …)
  merchantId: Uuid;
  nameAr: string;
  nameEn: string;
  glyph: string;                                  // emoji or icon key
  gradientA: string;                              // hex, e.g. "#7a8a4d"
  gradientB: string;                              // hex, e.g. "#4a5a2f"
  sort: number;
}

// ── Product ─────────────────────────────────────────────────────────
export type ProductBadge =
  | 'bestseller'
  | 'handmade'
  | 'limited'
  | 'organic'
  | 'new';

export interface Product {
  id: string;
  merchantId: Uuid;
  categoryId: Category['id'];
  nameAr: string;
  nameEn: string;
  subtitle: string;                               // origin / heritage tag
  price: Piastres;
  oldPrice?: Piastres;
  weight: string;                                 // display string ("750 مل")
  rating: number;                                 // 0..5
  reviewCount: number;
  badge?: ProductBadge;
  stock: number;
  images: string[];                               // URLs; empty → use category placeholder
  glyph?: string;                                 // UI fallback while real images don't exist
}

// ── Address ─────────────────────────────────────────────────────────
export interface Address {
  id: Uuid;
  customerId: Uuid;
  label: string;                                  // "المنزل" / "العمل"
  line1: string;
  line2?: string;
  city: string;
  district: string;
  phone: string;
  geo?: { lat: number; lng: number };
}

// ── Customer ────────────────────────────────────────────────────────
export type CustomerTier = 'standard' | 'premium';

export interface Customer {
  id: Uuid;
  merchantId: Uuid;
  phone: string;
  name: string;
  /** Pre-computed avatar initials. Stored, not derived — Arabic names with
   *  definite articles (e.g. "أحمد المصري" → "أم") don't survive a generic
   *  first-letter algorithm. Backend phase stores it on the customers row. */
  initials: string;
  email?: string;
  tier: CustomerTier;
  loyaltyPoints: number;
  createdAt: IsoDateTime;
}

// ── Order ───────────────────────────────────────────────────────────
export type OrderStatus =
  | 'new'
  | 'preparing'
  | 'shipping'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'wallet';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface OrderItem {
  productId: Product['id'];
  qty: number;
  priceAtTime: Piastres;
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  at: IsoDateTime;
}

export interface Order {
  id: OrderId;
  merchantId: Uuid;
  customerId: Uuid;
  customerName: string;                           // denormalized for mock + table UI
  addressId?: Uuid;
  city: string;                                   // denormalized for table UI
  items: OrderItem[];
  itemCount: number;
  subtotal: Piastres;
  deliveryFee: Piastres;
  discount: Piastres;
  total: Piastres;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  scheduledFor?: IsoDateTime;
  createdAt: IsoDateTime;
  timeline: OrderTimelineEntry[];
}

// ── Campaign ────────────────────────────────────────────────────────
export type CampaignChannel = 'Instagram' | 'Facebook' | 'TikTok' | 'Google';
export type CampaignStatus = 'active' | 'paused' | 'review';

export interface Campaign {
  id: string;
  merchantId: Uuid;
  name: string;
  channel: CampaignChannel;
  spend: Piastres;
  revenue: Piastres;
  conversions: number;
  ctr: number;                                    // 0..100
  roas: number;
  status: CampaignStatus;
}

// ── Driver position (Realtime channel in backend phase) ────────────
export interface DriverPosition {
  orderId: OrderId;
  lat: number;
  lng: number;
  updatedAt: IsoDateTime;
}
