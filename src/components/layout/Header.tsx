"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Truck } from "lucide-react";
import { useCartStore, cartCount } from "@/store/cart";
import { Logo } from "@/components/ui/Logo";
import { AccountMenu } from "@/components/layout/AccountMenu";
import type { Category } from "@/lib/types";

export function Header({ categories }: { categories: Category[] }) {
  const items = useCartStore((s) => s.items);
  const count = cartCount(items);

  return (
    <header className="sticky top-0 z-40 hidden border-b border-line/70 bg-cream/85 backdrop-blur-md md:block">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-8">
        <div className="flex min-w-0 items-center gap-10">
          <Link href="/" className="shrink-0">
            <Logo size="md" />
          </Link>

          <nav className="no-scrollbar flex min-w-0 items-center gap-7 overflow-x-auto">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="shrink-0 text-[14px] font-medium text-cocoa-soft transition-colors hover:text-cocoa"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <span className="flex items-center gap-1.5 rounded-full border border-cocoa/10 px-3.5 py-2 text-[13px] font-medium text-cocoa-soft">
            <Truck className="h-3.5 w-3.5" />
            Delivering across the UK
          </span>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="flex h-10 w-10 items-center justify-center rounded-full text-cocoa transition-colors hover:bg-cocoa/[0.05]"
          >
            <Heart className="h-[19px] w-[19px]" strokeWidth={1.8} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-cocoa transition-colors hover:bg-cocoa/[0.05]"
          >
            <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.8} />
            {count > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-honey text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
