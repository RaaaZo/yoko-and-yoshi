# Yoko & Yoshi

Affiliate e-commerce + content platform — a Polish niche-first store for
shibowiarze that recommends products and links out to Allegro.
Two mascots — **Yoko** (red shiba) and **Yoshi** (cream shiba) — recommend
items from a curated selection.

Stack: **Next.js 15** (App Router, RSC, SSR-first) · **Tailwind v4** ·
**shadcn/ui** · **Supabase** (Postgres + Auth + Storage + RLS) ·
**TypeScript strict**.

## Getting started

```bash
pnpm install
cp .env.example .env.local       # fill in Supabase keys
pnpm dev                          # http://localhost:3000
```

The app degrades gracefully when Supabase / Upstash / Resend / Allegro env
vars are missing — pages render with empty data instead of crashing.

## Scripts

```bash
pnpm dev          # next dev --turbopack
pnpm build        # next build
pnpm start        # production server (run `pnpm build` first)
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint .
pnpm format       # prettier --write
pnpm test         # vitest run
pnpm db:types     # regenerate src/types/database.ts from live schema
                  # (requires SUPABASE_PROJECT_ID env)
pnpm db:push      # apply local migrations to the linked Supabase project
```

## Repo layout

```
src/
├── app/
│   ├── (public)/                    public site routes
│   │   ├── page.tsx                 homepage
│   │   ├── produkt/[slug]/          PDP
│   │   ├── szukaj/                  search + filter
│   │   ├── poradnik/                articles + breeds
│   │   ├── o-nas, kontakt, …        static + form pages
│   │   └── informacja-affiliate, regulamin, polityka-*
│   ├── (admin)/admin/
│   │   ├── login/                   public, no role guard
│   │   └── (protected)/             role-gated by middleware + layout
│   │       ├── page.tsx             dashboard with KPI cards
│   │       ├── produkty/            full CRUD
│   │       ├── audyt, newsletter, ustawienia
│   │       └── … (skeleton placeholders for the rest)
│   ├── api/
│   │   ├── track-click/             affiliate click telemetry
│   │   ├── newsletter/{confirm,unsubscribe}
│   │   ├── revalidate/              on-demand cache busting (token-guarded)
│   │   └── cron/allegro-sync        daily Allegro price sync
│   ├── sitemap.ts, robots.ts, opengraph-image.tsx
│   ├── layout.tsx, error.tsx, not-found.tsx
├── components/
│   ├── ui/                          shadcn primitives (button/badge restyled)
│   ├── brand/                       MascotCallout, PawDivider, mascot SVG icons
│   ├── product/                     ProductCard, AllegroCTA, CategoryTile, …
│   └── layout/                      Header, MobileMenu (Sheet), Footer
├── lib/
│   ├── actions/                     Server Actions (auth, products, newsletter, contact)
│   ├── allegro/                     OAuth client + sync logic
│   ├── db/queries/                  per-domain DB queries
│   ├── supabase/                    server / browser / admin clients
│   ├── validation/                  Zod schemas (shared client+server)
│   ├── logger.ts, rate-limit.ts, safe-action.ts, utils.ts
├── middleware.ts                    session refresh + admin guard + headers
└── types/                           Database stub + domain types
supabase/
├── migrations/0001_init.sql         full schema + RLS + indexes
├── seed.sql                         6 species, 12 item types, 10 products, …
└── config.toml                      local Supabase config
```

## Architecture decisions worth knowing

- **SSR-first**. Every public page is a Server Component. `"use client"`
  appears only on interactive leaves (forms, dialogs, the mobile menu,
  the Allegro CTA's click handler).
- **No brand names on the public site (MVP).** The `ProductCard` kicker
  renders the *item type* (Szarpaki, Piłki, …) rather than a brand. The
  `brands` table stays in the schema for the future moment when Yoko &
  Yoshi ships its own-branded SKUs.
- **Item types are an orthogonal taxonomy** to nested categories. They
  power the homepage filter "po co dziś tu jesteś?".
- **Three Supabase clients**: server (RSC + Server Actions, anon + cookie),
  browser (anon, no cookies), admin (service role, server-only). The admin
  client carries `import 'server-only'` on the first line so accidental
  client imports become build errors.
- **Database types** are stubbed (`src/types/database.ts`) until the first
  `pnpm db:types` run. Until then queries are loosely typed (`<any>` on
  every supabase client). Restore strict types after generating.
- **Partial Pre-Rendering** is wired in spirit but `experimental.ppr` is
  commented out — it's still canary-only as of Next 15.5.15. Re-enable
  once stable.

## Environment variables

See `.env.example`. Minimum to get a meaningful local dev:

```
NEXT_PUBLIC_SUPABASE_URL=…
NEXT_PUBLIC_SUPABASE_ANON_KEY=…
SUPABASE_SERVICE_ROLE_KEY=…
NEXT_PUBLIC_SITE_URL=http://localhost:3000
REVALIDATE_TOKEN=<random>
```

Optional but recommended for production:

```
UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN   # rate limiting
RESEND_API_KEY, RESEND_FROM_EMAIL                   # newsletter, contact
ALLEGRO_CLIENT_ID, ALLEGRO_CLIENT_SECRET            # Allegro sync
NEXT_PUBLIC_PLAUSIBLE_DOMAIN                        # cookieless analytics
```

## Bootstrapping the database

1. Create a Supabase project (cloud or self-hosted)
2. `supabase link --project-ref <YOUR_REF>` then
   `supabase db push` — applies migrations + seed.
3. Create the first admin user manually in Supabase Auth UI, then in
   SQL editor: `update profiles set role='admin' where email='you@…'`.
4. Visit `/admin/login` and sign in.

## Deployment

The repo is Vercel-shaped. Wire `NEXT_PUBLIC_*` and server-only env vars
in the Vercel dashboard, push to `main`, done. `vercel.json` declares the
daily Allegro sync cron at 03:00 UTC.

For staging: a second Supabase project + `staging` branch deployed by
Vercel with its own env scope.

## CI

`.github/workflows/ci.yml` runs typecheck + lint + format:check + test +
build on every push and PR to `main`/`staging`.

## Roadmap (the parts not in this scaffold yet)

- Admin: full CRUDs for kategorie / typy / artykuły / rasy / homepage /
  nawigacja / przekierowania / użytkownicy / media-library upload pipeline
- 2FA TOTP enrollment for admin role
- Allegro: full image mirroring to Storage, parameter mapping
- Newsletter compose UI (Resend) + confirmation email template
- RODO data export tool
- Lighthouse CI workflow + Sentry server hooks
- E2E Playwright suite

Each admin module page lists its own TODO items in-place.
