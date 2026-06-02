import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import arCommon from '@/locales/ar/common.json';
import enCommon from '@/locales/en/common.json';
import { applyDocumentDirection, type Locale } from './rtl';

export const SUPPORTED_LOCALES: readonly Locale[] = ['ar', 'en'] as const;
export const DEFAULT_LOCALE: Locale = 'ar';

const isLocale = (value: string): value is Locale =>
  (SUPPORTED_LOCALES as readonly string[]).includes(value);

void i18n.use(initReactI18next).init({
  resources: {
    ar: { common: arCommon },
    en: { common: enCommon },
  },
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  ns: ['common'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  returnNull: false,
});

applyDocumentDirection(DEFAULT_LOCALE);

i18n.on('languageChanged', (lng) => {
  if (isLocale(lng)) applyDocumentDirection(lng);
});

export default i18n;
