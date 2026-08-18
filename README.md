# Beejay Cakes

A mobile-first, premium cake & celebration-treats ordering platform, baked in
London and delivered UK-wide —
Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, built to run on
**Supabase** (Postgres + Auth + Storage) instead of a custom backend, with
**Stripe** for payments.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Stripe keys, see below
npm run dev
```

The app runs fully on mock data (`src/lib/mock-data.ts`) out of the box —
you can browse the whole storefront and admin dashboard with no environment
variables set. Auth (`/login`, `/register`) needs real Supabase keys to work.

## What's real vs. mocked right now

| Area | Status |
|---|---|
| Storefront UI (all pages) | Fully built, production-quality components |
| Admin dashboard UI | Fully built, all CRUD screens |
| Cart | Real client state (Zustand, persisted to localStorage) |
| Stripe Checkout | Real API route (`/api/checkout`) — creates a live Checkout Session once you add your Stripe secret key |
| Supabase Auth | Wired (`/login`, `/register` call `supabase.auth`) — needs your project keys |
| Products, orders, reviews, customers | Mock data — see schema below to move to Supabase |
| Product photography | Illustrated placeholder tiles — swap for real photos via Cloudinary (see below) |
| Order status webhooks, admin auth guard, RLS | Not yet implemented — see "Next steps" |

## Project structure

```
src/
  app/
    (storefront)/        # customer-facing route group — its own root layout
      page.tsx            # Home
      product/[slug]/
      category/[slug]/
      cart/  checkout/  search/  wishlist/
      account/  orders/  (auth)/login  (auth)/register
    admin/                # admin route group — separate root layout (own chrome)
      page.tsx            # Dashboard
      products/ orders/ categories/ customers/ reviews/
    api/checkout/route.ts # creates a Stripe Checkout Session
  components/
    ui/                   # Button, Badge, ProductCard, Modal, Toggle, RatingStars…
    layout/                # Header, MobileTopBar, BottomNav, Footer
    home/ product/ admin/  # feature-specific components
  lib/
    mock-data.ts          # seed products/categories/orders/testimonials
    supabase.ts           # browser Supabase client
    stripe.ts             # server Stripe client
    types.ts
  store/cart.ts            # Zustand cart store
```

Two independent root layouts (via Next.js route groups) keep the admin
dashboard's chrome (sidebar, top bar) completely separate from the
storefront's chrome (header, bottom nav, footer) — no `display: none`
hacks.

## Backend setup — Supabase

The storefront and admin panel are **fully wired to Supabase** — this isn't
a mock-data prototype waiting to be connected, it's real queries that just
need a database behind them:

1. Create a project at [supabase.com](https://supabase.com).
2. SQL Editor → paste in **`supabase/schema.sql`**, run it. Creates every
   table, plus a trigger that auto-creates a `profiles` row on signup and
   seeds the six starter categories.
3. SQL Editor → paste in **`supabase/policies.sql`**, run it. Turns on Row
   Level Security everywhere and adds the policies (customers see their own
   orders/addresses/wishlist only; anyone can read products/categories;
   only admins can write).
4. Project Settings → API → copy the Project URL, `anon` key, and
   `service_role` key into `.env.local` (see `.env.example`).
5. Sign up on the site once (`/register`), then in the SQL Editor run:
   ```sql
   update profiles set role = 'admin'
     where id = (select id from auth.users where email = 'you@example.com');
   ```
   That account can now reach `/admin` — everyone else is redirected (see
   `src/proxy.ts`, which gates the whole `/admin` route group).

That's it — no code changes required. `src/lib/data/products.ts` is the
data-access layer every storefront page reads from, and
`src/lib/data/admin-products.ts` / `admin-categories.ts` are what the admin
panel writes through. Ratings/review counts are genuinely computed from the
`reviews` table, so a product with zero reviews correctly shows zero —
nothing is ever fabricated.

`src/lib/database.types.ts` is hand-written to match `supabase/schema.sql`.
Once you're on Supabase and want the types to stay perfectly in sync as you
evolve the schema, regenerate them instead:

```bash
npx supabase gen types typescript --project-id <your-project-ref> > src/lib/database.types.ts
```

## Stripe

`src/lib/stripe.ts` and `src/app/api/checkout/route.ts` are fully wired —
add `STRIPE_SECRET_KEY` to `.env.local` and the checkout button on
`/checkout` will create a real Stripe Checkout Session and redirect there.

To close the loop in production:

1. Add a webhook endpoint at `src/app/api/webhooks/stripe/route.ts` that
   verifies the signature with `STRIPE_WEBHOOK_SECRET` and listens for
   `checkout.session.completed`.
2. On that event, mark the matching `orders` row `payment_confirmed = true`
   and `status = 'confirmed'`.
3. Point Stripe's webhook (Dashboard → Developers → Webhooks) at that URL.

## Cloudinary (product photography)

Product images are currently illustrated placeholder tiles
(`src/components/ui/ProductMedia.tsx`) so the UI has no dependency on
external stock photography. To go live:

1. Add your Cloudinary credentials to `.env.local`.
2. In the admin "Add product" modal (`src/components/admin/ProductFormModal.tsx`),
   wire the file input to an upload widget or a signed upload route.
3. Store the returned URLs in `product_images` and swap `ProductMedia`
   for a real `<Image>` wherever a product is rendered.

## Design system

- **Palette**: pulled directly from the brand logo (`public/brand/logo-full.png`)
  — deep violet (`#5B3097`-family, token `cocoa`) and vivid magenta-pink
  (`#EF239C`, token `rose`/`honey`), antique gold for premium badges, on a
  soft lavender-tinted white. Token *names* (cocoa/honey/rose/gold/etc.)
  stayed the same as the original warm-cream theme on purpose — every
  component already references them, so re-theming was a one-file change
  in `globals.css` rather than touching every component.
- **Logo**: the real logo lives at `public/brand/` (full lockup, icon-only,
  and pre-sized favicons). `src/components/ui/Logo.tsx` renders the icon
  next to a "Beejay Cakes" wordmark set in the site's own display serif
  (Fraunces), so the real logo mark always appears alongside consistent,
  on-brand typography — used in the header, mobile bar, footer, and admin
  sidebar.
- **Type**: Fraunces (soft optical axis) for display headings, Plus Jakarta
  Sans for UI text — both self-hosted via `@fontsource-variable` (no
  external font CDN, no render-blocking third-party requests).
- **Signature motif**: a hand-drawn "frosting drip" SVG divider between the
  hero and the rest of the page.
- All tokens live in `src/app/globals.css` under `@theme`.

## Next steps

Done:
- [x] `/admin/*` gated behind a Supabase `role = 'admin'` check (`src/proxy.ts`)
- [x] Storefront + admin panel wired to live Supabase queries
- [x] Stripe webhook route creates the order once payment is confirmed

Still open:
- [ ] Wire the admin Orders/Customers/Reviews pages to real Supabase data
      (currently still local-state demos — Products/Categories are the
      ones fully wired to the database; see `src/lib/mock-data.ts`)
- [ ] Wire Cloudinary uploads in the admin product form (currently a
      non-functional file input)
- [ ] Order notifications (confirmation, status changes) — Supabase Edge
      Functions + an email/SMS provider, or a `notifications` table +
      realtime subscription for in-app toasts
- [ ] Real product photography
- [ ] Postcode/zone-based delivery pricing (currently a flat fee)
- [ ] Privacy policy, terms, and a cookie consent banner
