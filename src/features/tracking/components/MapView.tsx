import { useMemo, type CSSProperties } from 'react';
import { Icon } from '@/components/Icon/Icon';
import styles from './MapView.module.css';

interface MapViewProps {
  /** 0..1 along the path; 0 = origin, 1 = destination. */
  driverProgress: number;
  /** Show the driver marker (hidden when not yet shipping). */
  driverVisible: boolean;
}

// The single cubic-ish path that the driver travels (and the dashed line
// renders). Coordinates are in SVG-space (viewBox 358×220) so they match
// the prototype's framing exactly. Anchors used both for the stroke
// and to derive marker absolute positions.
const PATH = {
  origin:      { x: 40,  y: 180 },
  control1:    { x: 130, y: 160 },
  midpoint:    { x: 180, y: 130 },
  control2:    { x: 250, y: 90 },
  destination: { x: 320, y: 50 },
} as const;

const VIEW_W = 358;
const VIEW_H = 220;

/**
 * Quadratic-ish curve sampled at t∈[0,1] to place the driver marker.
 * Visually close enough to the `M…Q…T` SVG path we draw; not analytically
 * exact (real impl uses Mapbox or a path.getPointAtLength in the backend
 * slice). Mock-only.
 */
function sampleAt(t: number): { x: number; y: number } {
  const c = t < 0.5 ? PATH.control1 : PATH.control2;
  const start = t < 0.5 ? PATH.origin : PATH.midpoint;
  const end = t < 0.5 ? PATH.midpoint : PATH.destination;
  const u = t < 0.5 ? t * 2 : (t - 0.5) * 2;
  const omu = 1 - u;
  return {
    x: omu * omu * start.x + 2 * omu * u * c.x + u * u * end.x,
    y: omu * omu * start.y + 2 * omu * u * c.y + u * u * end.y,
  };
}

const pct = (n: number, total: number): string => `${(n / total) * 100}%`;

export function MapView({ driverProgress, driverVisible }: MapViewProps) {
  const driver = useMemo(() => sampleAt(Math.max(0, Math.min(1, driverProgress))), [driverProgress]);

  const driverStyle: CSSProperties = {
    insetInlineStart: pct(driver.x, VIEW_W),
    top: pct(driver.y, VIEW_H),
  };
  const destStyle: CSSProperties = {
    insetInlineStart: pct(PATH.destination.x, VIEW_W),
    top: pct(PATH.destination.y, VIEW_H),
  };
  const originStyle: CSSProperties = {
    insetInlineStart: pct(PATH.origin.x, VIEW_W),
    top: pct(PATH.origin.y, VIEW_H),
  };

  return (
    <div className={`map-ph ${styles.map}`} role="img" aria-label="map">
      <svg
        className={styles.svg}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d={`M${PATH.origin.x} ${PATH.origin.y}
              Q ${PATH.control1.x} ${PATH.control1.y}, ${PATH.midpoint.x} ${PATH.midpoint.y}
              T ${PATH.destination.x} ${PATH.destination.y}`}
          fill="none"
          stroke="var(--red)"
          strokeWidth={3}
          strokeDasharray="6 4"
          strokeLinecap="round"
          opacity={0.85}
        />
      </svg>

      <span className={styles.origin} style={originStyle} aria-hidden />
      <span className={styles.destination} style={destStyle} aria-hidden>📍</span>
      {driverVisible && (
        <span className={styles.driver} style={driverStyle} aria-label="driver">
          <Icon name="truck" size={16} />
        </span>
      )}
    </div>
  );
}
