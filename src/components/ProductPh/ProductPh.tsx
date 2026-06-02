import { type CSSProperties } from 'react';
import styles from './ProductPh.module.css';

interface ProductPhProps {
  gradientA: string;
  gradientB: string;
  glyph?: string | undefined;
  label?: string | undefined;
  imageUrl?: string | undefined;
  alt?: string;
  glyphSize?: number;
  className?: string;
}

/**
 * Gradient + glyph product placeholder.
 *
 * When `imageUrl` is provided it renders the real image; otherwise it
 * falls back to the per-category gradient pair with the product glyph
 * stamped in the middle. Matches the `<ProductPh>` from
 * design/customer-1.jsx + the `.cat-*` seeds in src/styles/sufra.css.
 */
export function ProductPh({
  gradientA,
  gradientB,
  glyph,
  label,
  imageUrl,
  alt = '',
  glyphSize = 56,
  className,
}: ProductPhProps) {
  if (imageUrl) {
    return (
      <div className={[styles.root, className].filter(Boolean).join(' ')}>
        <img src={imageUrl} alt={alt} className={styles.img} />
      </div>
    );
  }

  const style: CSSProperties = {
    '--ph-a': gradientA,
    '--ph-b': gradientB,
  } as CSSProperties;

  return (
    <div className={[styles.root, styles.placeholder, className].filter(Boolean).join(' ')} style={style}>
      {glyph && (
        <span className={styles.glyph} style={{ fontSize: glyphSize }} aria-hidden>
          {glyph}
        </span>
      )}
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
