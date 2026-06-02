/**
 * Money utilities. All monetary values are stored as integer **piastres**
 * (1 EGP = 100 piastres). Format only at the UI edge.
 */

export type Piastres = number;
export type Locale = 'ar' | 'en';

export const PIASTRES_PER_EGP = 100;

export const toPiastres = (egp: number): Piastres => Math.round(egp * PIASTRES_PER_EGP);
export const toEgp = (piastres: Piastres): number => piastres / PIASTRES_PER_EGP;

/**
 * Format a price in piastres for display.
 *
 * Arabic: "٢٨٥ ج.م" — we render Western digits and the Arabic currency
 * suffix because the prototype uses Western numerals universally and
 * wraps amounts in `<span class="num">` for tabular alignment.
 *
 * English: "EGP 285".
 */
export function formatMoney(piastres: Piastres, locale: Locale = 'ar'): string {
  const egp = toEgp(piastres);
  const hasFraction = Math.round(piastres) % PIASTRES_PER_EGP !== 0;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(egp);

  return locale === 'ar' ? `${formatted} ج.م` : `EGP ${formatted}`;
}

/**
 * Format a bare number with thousands separators (for stat values, counts).
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
