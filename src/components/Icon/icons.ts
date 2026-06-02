/**
 * Icon path map — lucide-style 1.75 stroke, 24x24 viewBox.
 * Mirrors the `I` object in design/customer-1.jsx so the prototype's
 * visual identity is preserved across the customer surfaces.
 */

export interface IconDef {
  d: string;
  filled?: boolean;
  strokeWidth?: number;
}

export const ICONS = {
  search:   { d: 'M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.35-4.35' },
  cart:     { d: 'M3 4h2l2.5 13h12L22 7H6m1 14a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm12 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' },
  heart:    { d: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z' },
  user:     { d: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z' },
  bell:     { d: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0' },
  filter:   { d: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z' },
  pin:      { d: 'M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0116 0zM12 13a3 3 0 100-6 3 3 0 000 6z' },
  back:     { d: 'M9 18l6-6-6-6' },
  forward:  { d: 'M15 18l-6-6 6-6' },
  close:    { d: 'M18 6L6 18M6 6l12 12' },
  star:     { d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', filled: true },
  plus:     { d: 'M12 5v14M5 12h14', strokeWidth: 2 },
  minus:    { d: 'M5 12h14', strokeWidth: 2 },
  check:    { d: 'M20 6L9 17l-5-5' },
  clock:    { d: 'M12 8v4l3 2M12 22a10 10 0 100-20 10 10 0 000 20z' },
  bag:      { d: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 11-8 0' },
  truck:    { d: 'M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm12 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z' },
  chevron:  { d: 'M9 6l-6 6 6 6' },
  wallet:   { d: 'M21 12V7H5a2 2 0 010-4h14v4M3 5v14a2 2 0 002 2h16v-5M16 12a2 2 0 100 4h5v-4z' },
  card:     { d: 'M2 5h20v14H2zM2 10h20M6 15h4' },
  cash:     { d: 'M2 6h20v12H2zM12 8a4 4 0 100 8 4 4 0 000-8zM6 8h.01M18 16h.01' },
  share:    { d: 'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13' },
  leaf:     { d: 'M2 12c0-5.5 4.5-10 10-10 0 5.5-4.5 10-10 10zm0 0c5.5 0 10 4.5 10 10 0-5.5-4.5-10-10-10z' },
  home:     { d: 'M3 12l9-9 9 9M5 10v10h14V10' },
  orders:   { d: 'M3 4h2l2.5 13h12L22 7H6m1 14a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm12 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' },
  inv:      { d: 'M20 7l-8-4-8 4v10l8 4 8-4V7zM4 7l8 4 8-4M12 11v10' },
  customers:{ d: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z' },
  campaigns:{ d: 'M3 11l18-7-3 18-6-5-3 5-2-7-4-4z' },
  reports:  { d: 'M21 21H4V3M7 14l3-3 4 4 6-6' },
  settings: { d: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1.3l2-1.5-2-3.5-2.4.8a7 7 0 00-2.3-1.3L13.6 3h-3.2l-.6 2.2a7 7 0 00-2.3 1.3l-2.4-.8-2 3.5 2 1.5a7 7 0 000 2.6l-2 1.5 2 3.5 2.4-.8a7 7 0 002.3 1.3l.6 2.2h3.2l.6-2.2a7 7 0 002.3-1.3l2.4.8 2-3.5-2-1.5c.07-.4.1-.85.1-1.3z' },
  products: { d: 'M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7' },
  arrowR:   { d: 'M5 12h14M12 5l7 7-7 7' },
  arrowL:   { d: 'M19 12H5M12 19l-7-7 7-7' },
  up:       { d: 'M12 19V5M5 12l7-7 7 7' },
  down:     { d: 'M12 5v14M19 12l-7 7-7-7' },
  eye:      { d: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z' },
  edit:     { d: 'M17 3a2.83 2.83 0 014 4L7.5 20.5 2 22l1.5-5.5L17 3z' },
  trash:    { d: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2' },
  alert:    { d: 'M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' },
} as const satisfies Record<string, IconDef>;

export type IconName = keyof typeof ICONS;
