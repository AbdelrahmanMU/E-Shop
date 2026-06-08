/**
 * Supabase client (browser).
 *
 * Singleton so React strict-mode + HMR don't create multiple realtime
 * connections. Uses the anon key — never the service-role key, which
 * only lives in edge functions.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const url = import.meta.env.VITE_SUPABASE_URL ?? '';
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

/** True when both env vars are present. UI can fall back to mock if false. */
export const SUPABASE_CONFIGURED = url.length > 0 && anonKey.length > 0;

let client: SupabaseClient<Database> | null = null;

function buildClient(): SupabaseClient<Database> {
  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'sufra:auth',
    },
    global: {
      headers: { 'x-application-name': 'sufra-customer' },
    },
  });
}

/**
 * Returns the singleton Supabase client.
 * Throws if env vars are missing — callers should check
 * `SUPABASE_CONFIGURED` first if they want a mock fallback.
 */
export function supabase(): SupabaseClient<Database> {
  if (!SUPABASE_CONFIGURED) {
    throw new Error(
      '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing in .env.local',
    );
  }
  if (!client) client = buildClient();
  return client;
}
