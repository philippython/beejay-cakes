import Link from "next/link";
import { MapPin, Heart } from "lucide-react";

export function MobileTopBar() {
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-line/70 bg-cream/90 px-5 pb-3 pt-4 backdrop-blur-md md:hidden">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cocoa font-display text-[14px] font-semibold text-cream">
          B
        </span>
        <div className="leading-tight">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-cocoa-faint">
            Delivering to
          </p>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-honey-deep" />
            <p className="text-[13px] font-semibold text-cocoa">Central London</p>
          </div>
        </div>
      </div>
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
