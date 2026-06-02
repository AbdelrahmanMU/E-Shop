import { type CSSProperties } from 'react';
import { ICONS, type IconDef, type IconName } from './icons';

interface IconProps {
  name: IconName;
  size?: number;
  /** Optional class — accepts undefined from CSS-Module accesses under exactOptionalPropertyTypes. */
  className?: string | undefined;
  style?: CSSProperties | undefined;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
}

export function Icon({
  name,
  size = 18,
  className,
  style,
  'aria-hidden': ariaHidden = true,
  'aria-label': ariaLabel,
}: IconProps) {
  const def: IconDef = ICONS[name];
  const sw = def.strokeWidth ?? 1.75;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={def.filled ? 'currentColor' : 'none'}
      stroke={def.filled ? 'none' : 'currentColor'}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden={ariaHidden && !ariaLabel}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    >
      <path d={def.d} />
    </svg>
  );
}
