"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/Button";

function initials(nameOrEmail: string) {
  const base = nameOrEmail.includes("@") ? nameOrEmail.split("@")[0] : nameOrEmail;
  return base
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function AccountMenu() {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-cocoa/[0.06]" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2.5">
        <Link href="/login">
          <Button variant="ghost" size="sm" className="h-10 px-4">
            Log in
          </Button>
        </Link>
        <Link href="/register">
          <Button variant="primary" size="sm" className="h-10 px-5">
            Create account
          </Button>
        </Link>
      </div>
    );
  }

  const displayName = (user.user_metadata?.full_name as string | undefined)?.trim() || user.email || "Account";

  return (
    <Link href="/account" aria-label="Your account">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cocoa/[0.06] text-[13px] font-bold text-cocoa">
        {initials(displayName)}
      </div>
    </Link>
  );
}
