export type Direction = 'rtl' | 'ltr';
export type Locale = 'ar' | 'en';

export const localeToDir = (locale: Locale): Direction => (locale === 'ar' ? 'rtl' : 'ltr');

/**
 * Sync <html dir> and <html lang> with the active i18n locale.
 * Called on i18n init and from the language toggle.
 */
export function applyDocumentDirection(locale: Locale): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.lang = locale;
  root.dir = localeToDir(locale);
}
