import { type CSSProperties } from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ width, height, radius, className, style }: SkeletonProps) {
  return (
    <span
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
      aria-hidden
    />
  );
}
