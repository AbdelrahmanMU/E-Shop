import styles from './ErrorFallback.module.css';

interface BareFallbackProps {
  error: Error;
  onReset: () => void;
}

/**
 * I18n-free fallback used by the **outer** ErrorBoundary in App.tsx,
 * which sits above `<I18nextProvider>`. If i18n itself fails to init,
 * the rich `<ErrorFallback>` (which uses `useTranslation`) can't render —
 * this minimal version uses only literals so the user always gets *something*.
 */
export function BareFallback({ error, onReset }: BareFallbackProps) {
  const isDev = import.meta.env.DEV;
  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <span className={styles.glyph} aria-hidden>⚠️</span>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.body}>
          The app failed to start. Try reloading; if the issue persists,
          contact support.
        </p>
        {isDev && (
          <pre className={styles.detail}>
            {error.name}: {error.message}
          </pre>
        )}
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={onReset}>
            Try again
          </button>
          <a href="/" className={styles.secondary}>Reload</a>
        </div>
      </div>
    </div>
  );
}
