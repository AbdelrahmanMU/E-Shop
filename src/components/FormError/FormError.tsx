import { Icon } from '@/components/Icon/Icon';
import { useTranslation } from 'react-i18next';
import styles from './FormError.module.css';

interface FormErrorProps {
  /** When falsy, nothing renders. */
  error: unknown;
  /** Optional override; otherwise we use `errors.generic`. */
  fallbackKey?: string;
}

/**
 * Inline error strip surfaced near a form's CTA or above a drawer's
 * footer. Pass the `error` value from a TanStack `UseMutationResult`
 * directly — we coerce unknown shapes to a string.
 */
export function FormError({ error, fallbackKey = 'errors.generic' }: FormErrorProps) {
  const { t } = useTranslation('common');
  if (!error) return null;

  const message = (() => {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === 'string') return error;
    return t(fallbackKey);
  })();

  return (
    <div role="alert" className={styles.box}>
      <Icon name="alert" size={14} />
      <span>{message}</span>
    </div>
  );
}
