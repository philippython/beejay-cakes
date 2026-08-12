"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, Receipt, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore, cartCount } from "@/store/cart";

export function BottomNav() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const count = cartCount(items);

  const ITEMS = [
    { label: "Home", href: "/", icon: Home },
    { label: "Search", href: "/search", icon: Search },
    { label: "Cart", href: "/cart", icon: ShoppingBag, badge: count || undefined },
    { label: "Orders", href: "/orders", icon: Receipt },
    { label: "Account", href: "/account", icon: User },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line/70 bg-white/95 pb-[max(env(safe-area-inset-bottom),10px)] pt-2 backdrop-blur-md md:hidden"
      style={{ boxShadow: "0 -4px 20px rgba(59,36,21,0.06)" }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex flex-col items-center gap-1 py-1.5 active:scale-95 transition-transform"
              >
                <span className="relative flex h-8 w-8 items-center justify-center">
                  <Icon
                    className={cn("h-[21px] w-[21px]", active ? "text-honey-deep" : "text-cocoa-faint")}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  {item.badge && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose text-[9px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10.5px] font-semibold",
                    active ? "text-cocoa" : "text-cocoa-faint"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
