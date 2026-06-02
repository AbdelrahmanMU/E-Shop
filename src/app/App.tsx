import { QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { BareFallback } from '@/components/ErrorBoundary/BareFallback';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import i18n from '@/lib/i18n';
import { queryClient } from '@/lib/queryClient';
import { MerchantProvider } from '@/app/providers/MerchantProvider';
import { AppRouter } from '@/app/router';

/**
 * Two ErrorBoundaries on purpose:
 *  - **Outer** catches catastrophic failures (i18n init throws, providers
 *    crash) and renders a no-i18n fallback so the user always gets *something*.
 *  - **Inner** lives under <I18nextProvider> and renders the translated
 *    fallback — used for component-render errors below the providers.
 */
export function App() {
  return (
    <ErrorBoundary fallback={(error, reset) => <BareFallback error={error} onReset={reset} />}>
      <I18nextProvider i18n={i18n}>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <MerchantProvider>
              <AppRouter />
            </MerchantProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </I18nextProvider>
    </ErrorBoundary>
  );
}
