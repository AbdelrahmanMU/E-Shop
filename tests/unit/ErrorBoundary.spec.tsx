import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { useState, type ReactNode } from 'react';
import i18n from '@/lib/i18n';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

function withProviders(node: ReactNode) {
  return <I18nextProvider i18n={i18n}>{node}</I18nextProvider>;
}

function Bomb({ when }: { when: boolean }) {
  if (when) throw new Error('kaboom');
  return <span>ok</span>;
}

describe('<ErrorBoundary>', () => {
  afterEach(() => cleanup());

  it('renders children when nothing throws', () => {
    render(withProviders(
      <ErrorBoundary><Bomb when={false} /></ErrorBoundary>,
    ));
    expect(screen.getByText('ok')).toBeDefined();
  });

  it('catches a thrown error and shows the fallback title', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(withProviders(
      <ErrorBoundary><Bomb when={true} /></ErrorBoundary>,
    ));
    // Default fallback shows the i18n title (Arabic by default).
    expect(screen.getByRole('heading')).toBeDefined();
    consoleError.mockRestore();
  });

  it('uses a custom fallback when provided', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(withProviders(
      <ErrorBoundary fallback={(error, reset) => (
        <div>
          <span>oops: {error.message}</span>
          <button type="button" onClick={reset}>retry</button>
        </div>
      )}>
        <Bomb when={true} />
      </ErrorBoundary>,
    ));
    expect(screen.getByText('oops: kaboom')).toBeDefined();
    consoleError.mockRestore();
  });

  it('reset clears the error and re-renders children', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    function Wrapper() {
      const [armed, setArmed] = useState(true);
      return (
        <ErrorBoundary
          fallback={(_e, reset) => (
            <button type="button" onClick={() => { setArmed(false); reset(); }}>
              reset
            </button>
          )}
        >
          <Bomb when={armed} />
        </ErrorBoundary>
      );
    }
    render(withProviders(<Wrapper />));
    expect(screen.getByText('reset')).toBeDefined();
    fireEvent.click(screen.getByText('reset'));
    expect(screen.getByText('ok')).toBeDefined();
    consoleError.mockRestore();
  });
});
