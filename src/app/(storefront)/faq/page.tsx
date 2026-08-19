"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How far in advance should I order?",
    a: "Cupcakes, pastries and small chops can often be ordered same-day or next-day. Birthday and wedding cakes need more notice — the exact lead time is shown on each product page.",
  },
  {
    q: "Do you deliver outside London?",
    a: "Yes — we deliver UK-wide by courier. Delivery cost and estimated timing are calculated at checkout based on your address.",
  },
  {
    q: "Can I customise flavours or sizes?",
    a: "Most cakes come with a choice of flavours and sizes on the product page. For anything more specific, get in touch and we'll see what we can do.",
  },
  {
    q: "How do I pay?",
    a: "Once you place an order, we'll email you our bank details and a payment reference. Your order goes into the kitchen as soon as we've confirmed the transfer's arrived.",
  },
  {
    q: "What if something's wrong with my order?",
    a: "Message us on Instagram or WhatsApp with your order details and we'll sort it out as quickly as we can.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="pb-16">
      <PageHeader eyebrow="Questions" title="Frequently asked questions" />

      <div className="mx-auto mt-10 max-w-2xl space-y-3 px-5 sm:px-8">
        {FAQS.map((f, i) => (
          <div key={f.q} className="overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-soft)]">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <span className="text-[14px] font-semibold text-cocoa">{f.q}</span>
              <ChevronDown
                className={cn("h-4 w-4 shrink-0 text-cocoa-faint transition-transform", open === i && "rotate-180")}
              />
            </button>
            {open === i && (
              <p className="px-5 pb-4 text-[13.5px] leading-relaxed text-cocoa-soft">{f.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
