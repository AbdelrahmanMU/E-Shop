import { beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';
import { readJson, removeJson, writeJson } from '@/lib/storage';

const SampleSchema = z.object({
  n: z.number(),
  s: z.string(),
});
type Sample = z.infer<typeof SampleSchema>;

const KEY = 'test:sample';
const FALLBACK: Sample = { n: 0, s: '' };

beforeEach(() => {
  window.localStorage.clear();
});

describe('readJson', () => {
  it('returns the fallback when the key is missing', () => {
    expect(readJson(KEY, SampleSchema, FALLBACK)).toEqual(FALLBACK);
  });

  it('round-trips a valid value', () => {
    writeJson(KEY, { n: 42, s: 'hi' });
    expect(readJson(KEY, SampleSchema, FALLBACK)).toEqual({ n: 42, s: 'hi' });
  });

  it('falls back and CLEARS storage when JSON is malformed', () => {
    window.localStorage.setItem(KEY, '{this is not valid json');
    expect(readJson(KEY, SampleSchema, FALLBACK)).toEqual(FALLBACK);
    // The cleared storage means a subsequent read short-circuits to fallback,
    // not via the parse path again.
    expect(window.localStorage.getItem(KEY)).toBe(JSON.stringify(FALLBACK));
  });

  it('falls back and clears when JSON parses but shape is wrong', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ n: 'not-a-number', extra: true }));
    expect(readJson(KEY, SampleSchema, FALLBACK)).toEqual(FALLBACK);
    expect(window.localStorage.getItem(KEY)).toBe(JSON.stringify(FALLBACK));
  });
});

describe('writeJson + removeJson', () => {
  it('writeJson stores a JSON serialization', () => {
    writeJson(KEY, { n: 1, s: 'a' });
    expect(window.localStorage.getItem(KEY)).toBe('{"n":1,"s":"a"}');
  });

  it('removeJson deletes the key', () => {
    writeJson(KEY, { n: 1, s: 'a' });
    removeJson(KEY);
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });
});
