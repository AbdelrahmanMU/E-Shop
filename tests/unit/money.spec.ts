import { describe, expect, it } from 'vitest';
import { formatMoney, formatNumber, toEgp, toPiastres } from '@/lib/money';

describe('toPiastres / toEgp', () => {
  it('round-trips whole EGP amounts', () => {
    expect(toPiastres(285)).toBe(28_500);
    expect(toEgp(28_500)).toBe(285);
  });

  it('preserves exact piastre amounts when EGP has one decimal', () => {
    expect(toPiastres(2.5)).toBe(250);
    expect(toPiastres(0.99)).toBe(99);
  });

  it('rounds away float noise (0.1 + 0.2 must land on 30 piastres)', () => {
    expect(toPiastres(0.1 + 0.2)).toBe(30);
  });
});

describe('formatMoney', () => {
  it('formats Arabic with the ج.م suffix and no fractional zeros', () => {
    expect(formatMoney(28_500, 'ar')).toBe('285 ج.م');
  });

  it('formats English with the EGP prefix', () => {
    expect(formatMoney(28_500, 'en')).toBe('EGP 285');
  });

  it('keeps two fraction digits when the amount has piastres', () => {
    expect(formatMoney(28_550, 'en')).toBe('EGP 285.50');
  });

  it('uses thousands separators', () => {
    expect(formatMoney(toPiastres(124_580), 'en')).toBe('EGP 124,580');
  });
});

describe('formatNumber', () => {
  it('groups thousands', () => {
    expect(formatNumber(1_842)).toBe('1,842');
  });
});
