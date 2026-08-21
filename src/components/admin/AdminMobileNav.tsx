"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { ADMIN_NAV } from "./adminNav";

export function AdminMobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-cocoa/40 backdrop-blur-[2px]"
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-y-0 left-0 flex w-64 flex-col bg-surface shadow-[var(--shadow-lift)]"
          >
            <div className="flex items-center justify-between px-5 py-5">
              <Logo size="sm" />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-full text-cocoa-soft hover:bg-cocoa/[0.05]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 px-3">
              {ADMIN_NAV.map((item) => {
                const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3.5 py-3 text-[14px] font-medium transition-colors",
                      active ? "bg-cocoa text-cream" : "text-cocoa-soft hover:bg-cocoa/[0.05]"
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/"
              onClick={onClose}
              className="mx-3 mb-6 flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[13.5px] font-medium text-cocoa-soft hover:bg-cocoa/[0.05]"
            >
              <ArrowLeft className="h-4 w-4" /> Back to storefront
            </Link>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
