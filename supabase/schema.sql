-- Beejay Cakes — database schema
-- Paste this whole file into Supabase → SQL Editor → New query → Run.

create extension if not exists "pgcrypto";

-- Who's an admin. One row per user, created automatically on signup.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer','admin')),
  full_name text,
  created_at timestamptz default now()
);

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  sort_order int not null default 0
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  category_id uuid references categories(id) on delete set null,
  price numeric not null,
  compare_at_price numeric,
  prep_time text,
  badge text check (badge in ('Best Seller','New','Premium')),
  is_featured boolean not null default false,
  is_active boolean not null default true,
  stock int not null default 0,
  created_at timestamptz default now()
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  sort_order int not null default 0
);

create table if not exists product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  label text not null,
  price_modifier numeric not null default 0
);

create table if not exists product_flavours (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  name text not null
);

create table if not exists orders (
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
  customer_email text,
  payment_confirmed boolean not null default false,
  created_at timestamptz default now()
);

-- Safe to re-run: adds the column if you already created this table
-- before customer_email existed here, and drops the old Stripe-specific
-- column if you have it from an earlier version of this schema (this app
-- now uses bank transfer, not Stripe).
alter table orders add column if not exists customer_email text;
alter table orders drop column if exists stripe_session_id;

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  name text not null,
  size text,
  flavour text,
  unit_price numeric not null,
  quantity int not null
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  user_id uuid references auth.users(id),
  order_id uuid references orders(id),
  rating int not null check (rating between 1 and 5),
  comment text not null,
  photo_url text,
  is_approved boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  label text not null,
  detail text not null,
  is_default boolean not null default false
);

create table if not exists wishlist_items (
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  primary key (user_id, product_id)
);

-- Store-wide settings editable from /admin/settings. Singleton table —
-- there's only ever one row (id is always `true`), so the app can just
-- select/update it without needing to know an ID.
create table if not exists store_settings (
  id boolean primary key default true,
  bank_account_name text,
  bank_name text,
  bank_sort_code text,
  bank_account_number text,
  updated_at timestamptz default now(),
  constraint store_settings_singleton check (id = true)
);
insert into store_settings (id) values (true) on conflict (id) do nothing;

-- Starter categories matching the storefront's fixed nav —
-- safe to re-run, will not duplicate.
insert into categories (name, slug, sort_order)
values
  ('Birthday Cakes', 'birthday-cakes', 1),
  ('Wedding Cakes', 'wedding-cakes', 2),
  ('Cupcakes', 'cupcakes', 3),
  ('Pastries', 'pastries', 4),
  ('Small Chops', 'small-chops', 5),
  ('Treat Boxes', 'treat-boxes', 6)
on conflict (slug) do nothing;
