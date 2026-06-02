import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface ErrorBoundaryProps {
  /** Custom fallback. Receives the caught error + a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Fired when reset is invoked — host can use this to navigate, clear state, etc. */
  onReset?: () => void;
  /** Fired on capture for telemetry. Backend phase wires this to Sentry. */
  onCapture?: (error: Error, info: ErrorInfo) => void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Class component because React error boundaries are class-only.
 *
 * Two-layer usage:
 *  - **App root** wraps everything for "the app exploded" recovery.
 *  - **Per-route or per-widget** to keep crashes scoped (a broken admin
 *    chart shouldn't blank the whole admin shell).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Always log so developers see it in console; production builds keep this.
    console.error('[ErrorBoundary]', error, info.componentStack);
    this.props.onCapture?.(error, info);
  }

  reset = (): void => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  override render(): ReactNode {
    const { error } = this.state;
    if (error) {
      if (this.props.fallback) return this.props.fallback(error, this.reset);
      return <ErrorFallback error={error} onReset={this.reset} />;
    }
    return this.props.children;
  }
}
