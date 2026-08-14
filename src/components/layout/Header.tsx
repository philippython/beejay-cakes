"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Truck } from "lucide-react";
import { useCartStore, cartCount } from "@/store/cart";
import { Logo } from "@/components/ui/Logo";

const NAV_LINKS = [
  { label: "Birthday Cakes", href: "/category/birthday-cakes" },
  { label: "Wedding Cakes", href: "/category/wedding-cakes" },
  { label: "Cupcakes", href: "/category/cupcakes" },
  { label: "Pastries", href: "/category/pastries" },
  { label: "Small Chops", href: "/category/small-chops" },
  { label: "Treat Boxes", href: "/category/treat-boxes" },
];

export function Header() {
  const items = useCartStore((s) => s.items);
  const count = cartCount(items);

  return (
    <header className="sticky top-0 z-40 hidden border-b border-line/70 bg-cream/85 backdrop-blur-md md:block">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-8">
        <div className="flex items-center gap-10">
          <Link href="/">
            <Logo size="md" />
          </Link>

          <nav className="flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-cocoa-soft transition-colors hover:text-cocoa"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-5">
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
          <Link href="/account">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cocoa/[0.06] text-[13px] font-bold text-cocoa">
              A
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
