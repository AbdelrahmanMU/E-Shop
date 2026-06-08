-- ╭───────────────────────────────────────────────────────────────╮
-- │ 0001 · merchants table + RLS                                  │
-- │                                                               │
-- │ First migration of the backend phase. Establishes the tenant  │
-- │ table and a public-read RLS policy so the storefront resolves │
-- │ a merchant by slug without authentication. Customer/orders/   │
-- │ products tables land in subsequent migrations.                │
-- ╰───────────────────────────────────────────────────────────────╯

create extension if not exists pgcrypto;
create extension if not exists citext;

-- ── merchants ───────────────────────────────────────────────────
create table if not exists public.merchants (
  id          uuid primary key default gen_random_uuid(),
  slug        citext unique not null,
  name        text   not null,
  theme_json  jsonb  not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
comment on column public.merchants.theme_json is
  'CSS-var overrides injected at root on tenant resolve (Slice 9).';

-- ── RLS ─────────────────────────────────────────────────────────
alter table public.merchants enable row level security;

-- Storefront resolves a merchant by slug (anon read). Writes go
-- through the service-role key inside edge functions.
drop policy if exists merchants_read_public on public.merchants;
create policy merchants_read_public on public.merchants
  for select to anon, authenticated
  using (true);

-- ── seed: the Sufra demo merchant ───────────────────────────────
-- Stable UUID so customer/order seeds in later migrations can
-- foreign-key to it without lookup.
insert into public.merchants (id, slug, name, theme_json)
values (
  '00000000-0000-4000-8000-000000000001',
  'sufra',
  'Sufra',
  '{}'::jsonb
)
on conflict (slug) do nothing;
