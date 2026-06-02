import { type ReactNode } from 'react';
import styles from './Panel.module.css';

interface PanelProps {
  title?: string;
  sub?: string;
  rightSlot?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Generic admin card with a Playfair section title + optional sub +
 * right-side slot (range chips / "view all" link / etc.).
 */
export function Panel({ title, sub, rightSlot, className, children }: PanelProps) {
  return (
    <div className={[styles.panel, className].filter(Boolean).join(' ')}>
      {(title || rightSlot) && (
        <div className={styles.head}>
          <div className={styles.titleBlock}>
            {title && <h2 className={`section-title ${styles.title}`}>{title}</h2>}
            {sub && <span className={`num ${styles.sub}`}>{sub}</span>}
          </div>
          {rightSlot && <div className={styles.right}>{rightSlot}</div>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
