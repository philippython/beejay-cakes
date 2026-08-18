import Link from "next/link";
import { Receipt, MapPin, Heart, ChevronRight, Bell, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { SignOutButton } from "@/components/account/SignOutButton";

const LINKS = [
  { label: "Order history & tracking", href: "/orders", icon: Receipt },
  { label: "Saved addresses", href: "/account/addresses", icon: MapPin },
  { label: "Favourites", href: "/wishlist", icon: Heart },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
];

function initials(nameOrEmail: string) {
  const base = nameOrEmail.includes("@") ? nameOrEmail.split("@")[0] : nameOrEmail;
  const parts = base.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-peach-tint">
          <LogIn className="h-7 w-7 text-honey-deep" strokeWidth={1.6} />
        </span>
        <h1 className="mt-5 font-display text-[22px] font-medium text-cocoa">You&apos;re not logged in</h1>
        <p className="mt-1.5 text-[14px] text-cocoa-soft">
          Log in to view your profile, orders and saved addresses.
        </p>
        <Link href="/login">
          <Button className="mt-6">Log in</Button>
        </Link>
      </div>
    );
  }

  const fullName = (user.user_metadata?.full_name as string | undefined)?.trim();
  const displayName = fullName || user.email || "Your account";

  return (
    <div className="mx-auto max-w-2xl px-5 pb-16 pt-6 sm:px-8">
      <h1 className="font-display text-[26px] font-medium text-cocoa">Account</h1>

      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-[var(--shadow-soft)]">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cocoa/[0.06] font-display text-[20px] font-medium text-cocoa">
          {initials(displayName)}
        </span>
        <div>
          <p className="font-display text-[17px] font-medium text-cocoa">{displayName}</p>
          {fullName && user.email && <p className="text-[13px] text-cocoa-soft">{user.email}</p>}
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

      <SignOutButton />
    </div>
  );
}
