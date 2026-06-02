/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_MAPBOX_TOKEN?: string;
  readonly VITE_DEFAULT_MERCHANT_SLUG?: string;
  readonly VITEST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
