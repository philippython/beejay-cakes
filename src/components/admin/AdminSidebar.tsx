"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { ADMIN_NAV } from "./adminNav";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line/70 bg-surface md:flex">
      <Link href="/" className="px-6 py-6">
        <Logo size="sm" />
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {ADMIN_NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-colors",
                active ? "bg-cocoa text-cream" : "text-cocoa-soft hover:bg-cocoa/[0.05]"
              )}
            >
              <item.icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="mx-3 mb-6 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-cocoa-soft hover:bg-cocoa/[0.05]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to storefront
      </Link>
    </aside>
  );
}
