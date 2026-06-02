import { type ReactNode } from 'react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  sub?: string;
  actions?: ReactNode;
}

/**
 * Per-page banner used by Orders / Products / Campaigns admin screens.
 * The AdminShell already renders the topbar (search + bell + quick-add) —
 * this is the screen-specific header below it.
 */
export function PageHeader({ title, sub, actions }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{title}</h1>
        {sub && <p className={styles.sub}>{sub}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
