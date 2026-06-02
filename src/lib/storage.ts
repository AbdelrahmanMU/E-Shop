import type { ZodType } from 'zod';

/**
 * Validated localStorage helpers.
 *
 * Every persisted shape goes through a Zod schema on read so that
 * stale storage from a previous schema version, hand-edited devtools
 * pollution, or malformed JSON degrades to the fallback instead of
 * propagating bad shapes downstream.
 *
 * Backend phase: localStorage stops being a source of truth, but the
 * `readJson` shape stays in `partialize`/migrate paths.
 */

export function readJson<T>(
  key: string,
  schema: ZodType<T>,
  fallback: T,
): T {
  if (typeof window === 'undefined') return fallback;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    // Reading localStorage can throw in some privacy modes.
    return fallback;
  }
  if (!raw) return fallback;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Malformed JSON in storage — nuke and return fallback.
    writeJson(key, fallback);
    return fallback;
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    // Shape doesn't match the schema (likely a previous-version migration).
    // Clear so we don't keep paying the parse cost on every read.
    writeJson(key, fallback);
    return fallback;
  }
  return result.data;
}

export function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded / private mode — swallow. Telemetry hook lands in
    // the backend phase alongside Sentry wiring.
  }
}

export function removeJson(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* same as above */
  }
}
