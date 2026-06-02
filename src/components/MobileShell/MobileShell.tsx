import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './MobileShell.module.css';

export type ShellTone = 'ivory' | 'ivory-2';

interface MobileShellProps {
  children: ReactNode;
  bottomNav?: ReactNode;
  /** Page background tone. Defaults to ivory; checkout uses ivory-2. */
  tone?: ShellTone;
}

const TONE_BG: Record<ShellTone, string> = {
  ivory: 'var(--ivory)',
  'ivory-2': 'var(--ivory-2)',
};

/**
 * Customer-side mobile container.
 *
 * Renders edge-to-edge on real mobile devices (≤480px). On wider
 * viewports it caps at a phone-width column with the deep-ivory body
 * acting as ambient backdrop — useful for desktop QA, no visual lie
 * on real phones.
 *
 * Tracks scroll state on the inner scroll container and writes
 * `data-scrolled="true|false"` on the shell root. Sticky elements
 * (with `data-sticky="top"` or `data-sticky="bottom"`) pick up the
 * soft shadow via global selectors in src/styles/globals.css.
 */
export function MobileShell({ children, bottomNav, tone = 'ivory' }: MobileShellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 2);
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={styles.viewport}>
      <div
        className={styles.shell}
        data-scrolled={scrolled || undefined}
        style={{ background: TONE_BG[tone] }}
      >
        <div className={styles.scroll} ref={scrollRef}>
          {children}
        </div>
        {bottomNav && <div className={styles.nav}>{bottomNav}</div>}
      </div>
    </div>
  );
}
