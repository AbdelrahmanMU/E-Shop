import { type ReactNode } from 'react';
import styles from './AdminShell.module.css';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AdminShellProps {
  title: string;
  sub?: string;
  actionLabel?: string;
  onAction?: () => void;
  children: ReactNode;
}

/**
 * Admin desktop shell. Wraps everything in `.sufra-admin` so the token
 * overrides (charcoal sidebar, gold accents, ivory canvas, etc.) take
 * effect. Layout is a 264px sidebar + main column with sticky Topbar.
 *
 * Designed for 1280×820 — no responsive collapse for now. Narrow
 * viewports get horizontal overflow; the admin is desktop-only by spec.
 */
export function AdminShell({ title, sub, actionLabel, onAction, children }: AdminShellProps) {
  return (
    <div className={`sufra-admin ${styles.shell}`}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar
          title={title}
          {...(sub !== undefined ? { sub } : {})}
          {...(actionLabel !== undefined ? { actionLabel } : {})}
          {...(onAction !== undefined ? { onAction } : {})}
        />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
