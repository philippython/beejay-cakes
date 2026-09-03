-- Beejay Cakes — Row Level Security policies
-- Run this AFTER schema.sql. Paste into Supabase → SQL Editor → Run.
-- Safe to run more than once — every policy is dropped and recreated,
-- rather than erroring if it already exists (Postgres has no
-- CREATE POLICY IF NOT EXISTS, so this is the standard way to make a
-- policies file idempotent).

alter table profiles enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_sizes enable row level security;
alter table product_flavours enable row level security;
alter table product_addons enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table reviews enable row level security;
alter table addresses enable row level security;
alter table wishlist_items enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- Profiles: everyone can read their own; only admins can change roles.
drop policy if exists "Read own profile" on profiles;
create policy "Read own profile" on profiles for select using (auth.uid() = id or is_admin());
drop policy if exists "Update own profile" on profiles;
create policy "Update own profile" on profiles for update using (auth.uid() = id);

-- Categories & products: public read, admin write.
drop policy if exists "Anyone can read categories" on categories;
create policy "Anyone can read categories" on categories for select using (true);
drop policy if exists "Admins manage categories" on categories;
create policy "Admins manage categories" on categories for all using (is_admin()) with check (is_admin());

drop policy if exists "Anyone can read active products" on products;
create policy "Anyone can read active products" on products for select using (is_active or is_admin());
drop policy if exists "Admins manage products" on products;
create policy "Admins manage products" on products for all using (is_admin()) with check (is_admin());

drop policy if exists "Anyone can read product images" on product_images;
create policy "Anyone can read product images" on product_images for select using (true);
drop policy if exists "Admins manage product images" on product_images;
create policy "Admins manage product images" on product_images for all using (is_admin()) with check (is_admin());

drop policy if exists "Anyone can read product sizes" on product_sizes;
create policy "Anyone can read product sizes" on product_sizes for select using (true);
drop policy if exists "Admins manage product sizes" on product_sizes;
create policy "Admins manage product sizes" on product_sizes for all using (is_admin()) with check (is_admin());

drop policy if exists "Anyone can read product flavours" on product_flavours;
create policy "Anyone can read product flavours" on product_flavours for select using (true);
drop policy if exists "Admins manage product flavours" on product_flavours;
create policy "Admins manage product flavours" on product_flavours for all using (is_admin()) with check (is_admin());

drop policy if exists "Anyone can read product addons" on product_addons;
create policy "Anyone can read product addons" on product_addons for select using (true);
drop policy if exists "Admins manage product addons" on product_addons;
create policy "Admins manage product addons" on product_addons for all using (is_admin()) with check (is_admin());

-- Orders: customers see and create their own; admins see and manage all.
drop policy if exists "Users see own orders" on orders;
create policy "Users see own orders" on orders for select using (auth.uid() = user_id or is_admin());
drop policy if exists "Users create own orders" on orders;
create policy "Users create own orders" on orders for insert with check (auth.uid() = user_id or user_id is null);
drop policy if exists "Admins update orders" on orders;
create policy "Admins update orders" on orders for update using (is_admin());

drop policy if exists "Users see own order items" on order_items;
create policy "Users see own order items" on order_items for select using (
  exists (select 1 from orders where orders.id = order_id and (orders.user_id = auth.uid() or is_admin()))
);
drop policy if exists "Admins manage order items" on order_items;
create policy "Admins manage order items" on order_items for all using (is_admin()) with check (is_admin());

-- Reviews: anyone reads approved reviews; authors manage their own; admins manage all.
drop policy if exists "Anyone reads approved reviews" on reviews;
create policy "Anyone reads approved reviews" on reviews for select using (is_approved or auth.uid() = user_id or is_admin());
drop policy if exists "Users create own reviews" on reviews;
create policy "Users create own reviews" on reviews for insert with check (
  auth.uid() = user_id
  and exists (
    select 1 from order_items
    join orders on orders.id = order_items.order_id
    where orders.user_id = auth.uid()
      and orders.payment_confirmed = true
      and order_items.product_id = reviews.product_id
  )
);
drop policy if exists "Admins moderate reviews" on reviews;
create policy "Admins moderate reviews" on reviews for update using (is_admin());
drop policy if exists "Admins delete reviews" on reviews;
create policy "Admins delete reviews" on reviews for delete using (is_admin());

-- Addresses & wishlist: strictly private to the owning user.
drop policy if exists "Users manage own addresses" on addresses;
create policy "Users manage own addresses" on addresses for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users manage own wishlist" on wishlist_items;
create policy "Users manage own wishlist" on wishlist_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Store settings (bank details etc): admins only, both ways. Nobody else
-- has any reason to read this — it's fetched server-side (via the
-- service-role client, which bypasses RLS anyway) when building order
-- emails, and edited only from /admin/settings.
alter table store_settings enable row level security;
drop policy if exists "Admins read settings" on store_settings;
create policy "Admins read settings" on store_settings for select using (is_admin());
drop policy if exists "Admins update settings" on store_settings;
create policy "Admins update settings" on store_settings for update using (is_admin()) with check (is_admin());

-- To make yourself an admin after signing up on the site once, run:
--   update profiles set role = 'admin' where id =
--     (select id from auth.users where email = 'you@example.com');
