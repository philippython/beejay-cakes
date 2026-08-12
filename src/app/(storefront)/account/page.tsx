import Link from "next/link";
import { Receipt, MapPin, Heart, LogOut, ChevronRight, Bell } from "lucide-react";

const LINKS = [
  { label: "Order history & tracking", href: "/orders", icon: Receipt },
  { label: "Saved addresses", href: "/account/addresses", icon: MapPin },
  { label: "Favourites", href: "/wishlist", icon: Heart },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
];

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pb-16 pt-6 sm:px-8">
      <h1 className="font-display text-[26px] font-medium text-cocoa">Account</h1>

      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-[var(--shadow-soft)]">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cocoa/[0.06] font-display text-[20px] font-medium text-cocoa">
          AO
        </span>
        <div>
          <p className="font-display text-[17px] font-medium text-cocoa">Amara Okafor</p>
          <p className="text-[13px] text-cocoa-soft">amara.okafor@email.com</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-soft)]">
        {LINKS.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-cocoa/[0.02] ${
              i !== LINKS.length - 1 ? "border-b border-line/70" : ""
            }`}
          >
            <link.icon className="h-[18px] w-[18px] text-honey-deep" strokeWidth={1.8} />
            <span className="flex-1 text-[14px] font-medium text-cocoa">{link.label}</span>
            <ChevronRight className="h-4 w-4 text-cocoa-faint" />
          </Link>
        ))}
      </div>

      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-cocoa/10 py-3.5 text-[13.5px] font-semibold text-rose-deep transition-colors hover:bg-rose/[0.04]">
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </div>
  );
}
