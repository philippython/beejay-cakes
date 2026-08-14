import Link from "next/link";
import { Truck, Heart } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function MobileTopBar() {
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-line/70 bg-cream/90 px-5 pb-3 pt-4 backdrop-blur-md md:hidden">
      <Link href="/" className="flex items-center gap-2.5">
        <Logo size="sm" showWordmark={false} />
        <div className="leading-tight">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-cocoa-faint">
            Beejay Cakes
          </p>
          <div className="flex items-center gap-1">
            <Truck className="h-3 w-3 text-honey-deep" />
            <p className="text-[12.5px] font-semibold text-cocoa">Delivering UK-wide</p>
          </div>
        </div>
      </Link>
      <Link
        href="/wishlist"
        aria-label="Wishlist"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[var(--shadow-soft)]"
      >
        <Heart className="h-[18px] w-[18px] text-cocoa" strokeWidth={1.8} />
      </Link>
    </div>
  );
}
