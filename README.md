# Beejay Cakes

A mobile-first, premium cake & celebration-treats ordering platform, baked in
London and delivered UK-wide — Next.js 16 (App Router) + TypeScript +
Tailwind CSS v4, running on **Supabase** (Postgres + Auth) with **Resend**
for order emails. Payment is by **bank transfer** — there's no payment
gateway; the admin confirms each payment manually once it lands.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Resend + bank details, see below
npm run dev
```

The storefront and admin panel are real Supabase queries, not a mock-data
prototype — you'll see empty states everywhere until you add products and
your database is connected.

## How ordering works

There's no card payment. The flow is:

1. Customer fills in the cart and checks out with their email, delivery
   address and phone — no payment step on the site itself.
2. `/api/orders` creates the order (`status: pending`) and sends **two**
   emails: an "order received" email to the customer with your bank
   details and a payment reference, and a "new order" alert to you.
3. Customer pays by bank transfer, using that reference.
4. You watch for it to land, then click **Confirm payment** in
   `/admin/orders`. That calls `/api/admin/orders/[id]/confirm-payment`,
   which sets `payment_confirmed = true`, moves the order to `confirmed`,
   and emails the customer that payment's been received.
5. As you move the order through `/admin/orders`'s status dropdown
   (baking → ready → out for delivery → delivered, or cancelled), each
   change emails the customer automatically.

All of that is real and wired — not a mock. The only thing that needs you
is the bank-watching step in #3/#4, since there's no automated way to know
a transfer's arrived without a gateway.

## What's real vs. mocked right now

| Area | Status |
|---|---|
| Storefront UI (all pages) | Fully built, production-quality components |
| Admin dashboard UI | Fully built, all CRUD screens |
| Cart | Real client state (Zustand, persisted to localStorage) |
| Order placement | Real — `/api/orders` creates the order directly (no payment gateway) |
| Supabase Auth | Wired (`/login`, `/register` call `supabase.auth`) — needs your project keys |
| `/admin/*` route protection | Real — middleware checks `role = 'admin'` (`src/proxy.ts`) |
| Products & Categories | Wired to Supabase — storefront reads live, admin panel writes live |
| Orders | Wired to Supabase — created on checkout, every status change (including payment confirmation) persists and emails the customer |
| Order emails | Real, via Resend — order received (customer), new order (admin), payment confirmed (customer), status updates (customer). All need `RESEND_API_KEY` set |
| Customers, Reviews (admin pages) | Still local-state demos — not yet wired to Supabase |
| Product photography | Illustrated placeholder tiles — swap for real photos via Cloudinary (see below) |

## Project structure

```
src/
  app/
    (storefront)/          # customer-facing route group — its own root layout
      page.tsx              # Home
      product/[slug]/
      category/[slug]/
      cart/  checkout/  checkout/success/  search/  wishlist/
      account/  orders/  (auth)/login  (auth)/register
    admin/                  # admin route group — separate root layout (own chrome)
      page.tsx              # Dashboard
      products/ orders/ categories/ customers/ reviews/
    api/
      orders/route.ts                          # places an order, sends the two "order placed" emails
      admin/orders/[id]/status/route.ts         # admin-only: change status, emails customer
      admin/orders/[id]/confirm-payment/route.ts # admin-only: confirm payment, emails customer
      auth/callback/route.ts                    # Supabase email-confirmation redirect target
  components/
    ui/                     # Button, Badge, ProductCard, Modal, Toggle, RatingStars…
    layout/                  # Header, MobileTopBar, BottomNav, Footer
    home/ product/ admin/ account/  # feature-specific components
  lib/
    email.ts                # all Resend templates + sending
    data/                    # Supabase queries, mapped to the app's types
    supabase/                # browser / server / service-role clients
    types.ts
  store/cart.ts              # Zustand cart store
  proxy.ts                   # middleware — gates /admin/* behind role = 'admin'
supabase/
  schema.sql                 # paste into Supabase SQL Editor
  policies.sql                # paste in second — Row Level Security
```

Two independent root layouts (via Next.js route groups) keep the admin
dashboard's chrome (sidebar, top bar) completely separate from the
storefront's chrome (header, bottom nav, footer) — no `display: none`
hacks.

## What you need to set up

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com) (pick a UK/EU region).
2. SQL Editor → paste in **`supabase/schema.sql`**, run it. Creates every
   table, a trigger that auto-creates a `profiles` row on signup, and
   seeds the six starter categories. Safe to re-run later if the schema
   changes — it only adds what's missing.
3. SQL Editor → paste in **`supabase/policies.sql`**, run it. Turns on Row
   Level Security everywhere: customers see only their own orders,
   addresses, and wishlist; anyone can read products/categories; only
   admins can write, or see other customers' data.
4. Project Settings → API → copy the Project URL, `anon` key, and
   `service_role` key into `.env.local`.
5. Sign up on the site once (`/register`), then in the SQL Editor run:
   ```sql
   update profiles set role = 'admin'
     where id = (select id from auth.users where email = 'you@example.com');
   ```
   That account can now reach `/admin` — everyone else gets redirected.
6. Authentication → SMTP Settings: connect Resend as custom SMTP (see
   below) so signup/login emails don't hit Supabase's very low free-tier
   send limit. Authentication → URL Configuration: set your Site URL and
   add `<yourdomain>/auth/callback` (and `http://localhost:3000/auth/callback`
   for local dev) to Redirect URLs — without this, email confirmation
   links won't work.

### 2. Resend (order emails)

This is separate from step 6 above — that's Supabase's own login emails;
this is the order emails this app sends itself.

1. Sign up at [resend.com](https://resend.com) (free: 3,000 emails/month).
2. Add and verify your domain (Resend gives you DNS records to add at
   your domain registrar).
3. Create an API key → put it in `.env.local` as `RESEND_API_KEY`.
4. Set `RESEND_FROM_EMAIL` to something on your verified domain, e.g.
   `"Beejay Cakes <orders@beejaycakes.com>"`.
5. Set `ADMIN_NOTIFICATION_EMAIL` to the inbox you actually want new-order
   alerts in.

### 3. Your bank details

These are **not** environment variables — they're edited from
**`/admin/settings`** once you've logged in as an admin (step 5 above),
so you can update them any time without redeploying. They're stored in
the `store_settings` table (created by `schema.sql`) and shown to
customers in the order-received email so they know how to pay. Until you
fill them in there, the email just says "we'll send payment details
shortly" instead of showing incomplete details — so don't launch without
setting them.

### 4. Cloudinary (optional, for real product photos)

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
  soft lavender-tinted white.
- **Logo**: lives at `public/brand/` (full lockup, icon-only, pre-sized
  favicons). `src/components/ui/Logo.tsx` renders the icon next to a
  "Beejay Cakes" wordmark in the site's display serif — used in the
  header, mobile bar, footer, and admin sidebar.
- **Type**: Fraunces (soft optical axis) for display headings, Plus Jakarta
  Sans for UI text — both self-hosted via `@fontsource-variable`.
- **Signature motif**: a hand-drawn "frosting drip" SVG divider between the
  hero and the rest of the page.
- All tokens live in `src/app/globals.css` under `@theme`.

## Next steps

Done:
- [x] `/admin/*` gated behind a Supabase `role = 'admin'` check (`src/proxy.ts`)
- [x] Storefront + admin panel wired to live Supabase queries, including Orders
- [x] Bank-transfer order flow — `/api/orders` creates the order and emails
      customer + admin; `/api/admin/orders/[id]/confirm-payment` confirms
      payment and emails the customer
- [x] Order status-update emails for every stage after that
- [x] Bank details editable from `/admin/settings` (not hardcoded env vars)

Still open:
- [ ] Wire the admin Customers/Reviews pages to real Supabase data
      (currently still local-state demos — Products/Categories/Orders are
      the ones fully wired to the database)
- [ ] Wire Cloudinary uploads in the admin product form (currently a
      non-functional file input)
- [ ] Real product photography
- [ ] Postcode/zone-based delivery pricing (currently a flat fee)
- [ ] Privacy policy, terms, and a cookie consent banner
