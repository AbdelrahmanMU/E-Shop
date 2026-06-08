import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { MOCK_MERCHANT } from '@/lib/mock/data';
import { SUPABASE_CONFIGURED, supabase } from '@/lib/supabase';
import type { Merchant } from '@/types/domain';
import { MerchantContext, type MerchantContextValue } from './MerchantContext';

interface MerchantProviderProps {
  children: ReactNode;
}

const DEFAULT_SLUG =
  import.meta.env.VITE_DEFAULT_MERCHANT_SLUG ?? MOCK_MERCHANT.slug;

/**
 * Resolves the active tenant.
 *
 * Strategy:
 *  1. If `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` are present,
 *     fetch `merchants` where `slug = VITE_DEFAULT_MERCHANT_SLUG`.
 *  2. On success → real data + `source: 'supabase'`.
 *  3. On any failure (network, missing row, RLS) → log + fall back
 *     to `MOCK_MERCHANT` so the rest of the app keeps working.
 *
 * Backend phase Slice 1 also resolves by subdomain in production:
 *   sufra.app  → slug 'sufra' (default)
 *   acme.sufra.app → slug 'acme'
 */
export function MerchantProvider({ children }: MerchantProviderProps) {
  const [resolved, setResolved] = useState<MerchantContextValue>(() => ({
    merchant: MOCK_MERCHANT as Merchant,
    source: 'mock',
  }));

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) {
      console.warn('[merchant] Supabase not configured — using mock merchant');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase()
          .from('merchants')
          .select('id, slug, name, theme_json, created_at')
          .eq('slug', DEFAULT_SLUG)
          .maybeSingle();

        if (cancelled) return;
        if (error) {
          console.warn('[merchant] Supabase query failed, falling back to mock:', error.message);
          return;
        }
        if (!data) {
          console.warn(
            `[merchant] No merchant row for slug '${DEFAULT_SLUG}' — falling back to mock. ` +
              'Did you run the 0001 migration?',
          );
          return;
        }
        const merchant: Merchant = {
          id: data.id,
          slug: data.slug,
          name: data.name,
          themeJson: (data.theme_json as Record<string, string>) ?? {},
          createdAt: data.created_at,
        };
        setResolved({ merchant, source: 'supabase' });
        console.warn(`[merchant] Resolved '${merchant.slug}' from Supabase ✓`);
      } catch (err) {
        if (!cancelled) {
          console.warn('[merchant] Supabase unreachable, falling back to mock:', err);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<MerchantContextValue>(() => resolved, [resolved]);

  return <MerchantContext.Provider value={value}>{children}</MerchantContext.Provider>;
}
