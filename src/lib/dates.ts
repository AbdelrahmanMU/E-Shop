import type { Locale } from './money';

/**
 * Format an ISO timestamp into a short human-readable string.
 * Backend stores timestamps as ISO strings (Postgres timestamptz).
 */
export function formatDateTime(iso: string, locale: Locale = 'ar'): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d);
}

/**
 * Coarse "time ago" using Intl.RelativeTimeFormat. Returns the largest unit
 * (minutes / hours / days). Good enough for activity lists; replace with
 * a real lib if we need granular control.
 */
export function timeAgo(iso: string, locale: Locale = 'ar', now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diffSec = Math.round((then - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar-EG' : 'en', { numeric: 'auto' });

  const abs = Math.abs(diffSec);
  if (abs < 60) return rtf.format(diffSec, 'second');
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
  if (abs < 86_400) return rtf.format(Math.round(diffSec / 3600), 'hour');
  return rtf.format(Math.round(diffSec / 86_400), 'day');
}
