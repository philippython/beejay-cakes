# Beejay Cakes

A mobile-first, premium cake & celebration-treats ordering platform for Lagos —
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

## Moving from mock data to Supabase

Run this in the Supabase SQL editor to create the core schema:

```sql
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  sort_order int not null default 0
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  category_id uuid references categories(id),
  price numeric not null,
  compare_at_price numeric,
  prep_time text,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  is_cover boolean default false
);

create table product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  label text not null,
  price_modifier numeric not null default 0,
  stock int not null default 0
);

create table product_flavours (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  name text not null
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  status text not null default 'pending'
    check (status in ('pending','confirmed','baking','ready','out_for_delivery','delivered','cancelled')),
  subtotal numeric not null,
  delivery_fee numeric not null default 0,
  total numeric not null,
  delivery_address text not null,
  phone text not null,
  delivery_instructions text,
  stripe_session_id text,
  payment_confirmed boolean default false,
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  name text not null,
  size text,
  flavour text,
  add_ons text[],
  unit_price numeric not null,
  quantity int not null
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  user_id uuid references auth.users(id),
  order_id uuid references orders(id),
  rating int not null check (rating between 1 and 5),
  comment text not null,
  photo_url text,
  is_approved boolean default false,
  created_at timestamptz default now()
);

create table addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  label text not null,
  detail text not null,
  is_default boolean default false
);

create table wishlist_items (
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  primary key (user_id, product_id)
);
```

Then enable Row Level Security on every table and add policies, e.g.:

```sql
alter table orders enable row level security;
create policy "Users see their own orders"
  on orders for select using (auth.uid() = user_id);
create policy "Users create their own orders"
  on orders for insert with check (auth.uid() = user_id);
```

For an admin role, the simplest approach is a `profiles` table with a
`role` column (`'customer' | 'admin'`) and policies like
`using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))`
on the admin-only tables/actions. Gate the `/admin` route group with a
Server Component check against that role before rendering.

Once the schema is live, regenerate types and replace the placeholder file:

```bash
npx supabase gen types typescript --project-id <your-project-ref> > src/lib/database.types.ts
```

Then swap the mock-data reads in the `(storefront)` pages for real
`supabase.from("products").select()` calls — React Server Components are
already `async` where needed (e.g. `product/[slug]/page.tsx`), so this is
mostly a drop-in change.

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

- **Palette**: buttery cream background, dusty rose + glazed honey accents,
  antique gold for premium badges, deep cocoa for headings — tuned warmer
  and more saturated than typical "AI cream + terracotta" defaults.
- **Type**: Fraunces (soft optical axis) for display headings, Plus Jakarta
  Sans for UI text — both self-hosted via `@fontsource-variable` (no
  external font CDN, no render-blocking third-party requests).
- **Signature motif**: a hand-drawn "frosting drip" SVG divider between the
  hero and the rest of the page.
- All tokens live in `src/app/globals.css` under `@theme`.

## Next steps

- [ ] Gate `/admin/*` behind a Supabase `role = 'admin'` check
- [ ] Replace mock data reads with live Supabase queries
- [ ] Add the Stripe webhook route + order status sync
- [ ] Wire Cloudinary uploads in the admin product form
- [ ] Add customer notifications (order confirmation, status changes) —
      Supabase Edge Functions + email/SMS provider, or a simple
      `notifications` table + realtime subscription for in-app toasts
- [ ] Real product photography
