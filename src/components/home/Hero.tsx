"use client";

import { motion } from "framer-motion";
import { Sparkles, ChefHat, ShieldCheck, Truck } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { ProductMedia } from "../ui/ProductMedia";

const OCCASIONS = ["Birthdays", "Weddings", "Celebrations", "Anniversaries", "Just Because"];

const FEATURES = [
  { icon: ChefHat, label: "Baked fresh to order" },
  { icon: Truck, label: "Delivered UK-wide" },
  { icon: ShieldCheck, label: "Secure checkout" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-peach-tint">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 pb-20 pt-8 sm:px-8 sm:pt-14 md:grid-cols-2 md:items-center md:pb-28 md:pt-16">
        {/* Copy + search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[12px] font-bold uppercase tracking-wide text-honey-deep">
            <Sparkles className="h-3.5 w-3.5" />
            Freshly baked for every celebration
          </div>

          <h1 className="mt-4 font-display text-[38px] font-medium leading-[1.08] tracking-[-0.01em] text-cocoa sm:text-[46px] md:text-[52px]">
            Cakes &amp; treats,
            <br />
            baked fresh <span className="italic text-honey-deep">in London.</span>
          </h1>

          <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-cocoa-soft">
            From birthday showstoppers to small chops platters — order in minutes and
            get it delivered UK-wide.
          </p>

          <div className="mt-6">
            <SearchBar />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                key={o}
                className="rounded-full border border-cocoa/10 bg-white/60 px-3.5 py-1.5 text-[12.5px] font-medium text-cocoa-soft transition-colors hover:border-cocoa/25 hover:text-cocoa"
              >
                {o}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70">
                  <f.icon className="h-4 w-4 text-honey-deep" strokeWidth={1.8} />
                </span>
                <p className="text-[13px] font-medium text-cocoa">{f.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stacked tiers visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative mx-auto hidden aspect-square w-full max-w-[440px] md:block"
        >
          <div className="absolute left-[8%] top-[6%] h-[62%] w-[62%] -rotate-6 overflow-hidden rounded-[28px] shadow-[var(--shadow-lift)] ring-4 ring-cream">
            <ProductMedia tag="wedding" className="h-full w-full" iconClassName="h-14 w-14" />
          </div>
          <div className="absolute bottom-[4%] right-[2%] h-[54%] w-[54%] rotate-6 overflow-hidden rounded-[28px] shadow-[var(--shadow-lift)] ring-4 ring-cream">
            <ProductMedia tag="birthday" className="h-full w-full" iconClassName="h-12 w-12" />
          </div>
          <div className="absolute bottom-[26%] left-[0%] h-[38%] w-[38%] -rotate-3 overflow-hidden rounded-[24px] shadow-[var(--shadow-lift)] ring-4 ring-cream">
            <ProductMedia tag="cupcakes" className="h-full w-full" iconClassName="h-9 w-9" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute right-[6%] top-[2%] flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-[var(--shadow-lift)]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-peach-tint">
              <Sparkles className="h-4 w-4 text-rose" strokeWidth={1.8} />
            </span>
            <div className="leading-tight">
              <p className="font-display text-[13px] italic text-cocoa">taste the</p>
              <p className="font-display text-[13px] italic text-cocoa">difference</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Signature frosting-drip divider into the page below */}
      <svg
        className="absolute inset-x-0 bottom-[-1px] h-6 w-full text-cream sm:h-9"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0 0C120 34 240 34 360 18C480 2 600 2 720 20C840 38 960 38 1080 20C1200 2 1320 2 1440 22V60H0V0Z"
        />
      </svg>
    </section>
  );
}
