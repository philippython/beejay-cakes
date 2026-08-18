"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/Toggle";

const DEFAULTS = [
  { key: "orderConfirmation", label: "Order confirmation", desc: "When your order is placed and payment is confirmed." },
  { key: "statusUpdates", label: "Order status updates", desc: "Baking, ready, out for delivery." },
  { key: "delivery", label: "Delivery completed", desc: "When your order has been delivered." },
  { key: "offers", label: "Offers & new arrivals", desc: "Occasional news from Beejay Cakes." },
];

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    orderConfirmation: true,
    statusUpdates: true,
    delivery: true,
    offers: false,
  });

  return (
    <div className="mx-auto max-w-2xl px-5 pb-16 pt-6 sm:px-8">
      <h1 className="font-display text-[24px] font-medium text-cocoa">Notifications</h1>
      <p className="mt-1 text-[13.5px] text-cocoa-soft">Choose what you&apos;d like to hear about.</p>

      <div className="mt-6 overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-soft)]">
        {DEFAULTS.map((d, i) => (
          <div
            key={d.key}
            className={`flex items-center justify-between gap-3 px-5 py-4 ${i !== DEFAULTS.length - 1 ? "border-b border-line/50" : ""}`}
          >
            <div>
              <p className="text-[13.5px] font-semibold text-cocoa">{d.label}</p>
              <p className="mt-0.5 text-[12px] text-cocoa-soft">{d.desc}</p>
            </div>
            <Toggle
              checked={prefs[d.key]}
              onChange={(v) => setPrefs((p) => ({ ...p, [d.key]: v }))}
              label={d.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
