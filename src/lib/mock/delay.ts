/**
 * Simulate network latency so the UI can render its loading states
 * meaningfully while we're in the mock-data phase. Disabled in tests.
 */
export function delay<T>(value: T, ms = 120): Promise<T> {
  if (import.meta.env?.MODE === 'test' || import.meta.env?.VITEST) {
    return Promise.resolve(value);
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}
