import { useTranslation } from 'react-i18next';
import styles from './ErrorFallback.module.css';

interface ErrorFallbackProps {
  error: Error;
  onReset: () => void;
}

/**
 * Generic full-screen fallback shown when the App root catches an
 * uncaught render error. Per-route or per-widget callers can supply
 * their own via `<ErrorBoundary fallback={…}>`.
 */
export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const { t } = useTranslation('common');
  const isDev = import.meta.env.DEV;

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <span className={styles.glyph} aria-hidden>⚠️</span>
        <h1 className={styles.title}>{t('errors.crash_title')}</h1>
        <p className={styles.body}>{t('errors.crash_body')}</p>
        {isDev && (
          <pre className={styles.detail}>
            {error.name}: {error.message}
          </pre>
        )}
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={onReset}>
            {t('errors.try_again')}
          </button>
          <a href="/" className={styles.secondary}>
            {t('nav.home')}
          </a>
        </div>
      </div>
    </div>
  );
}
