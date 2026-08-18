import { Truck, Clock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

const INFO = [
  {
    icon: Truck,
    title: "UK-wide delivery",
    text: "Baked fresh in London and delivered across the UK by courier. Delivery cost is calculated at checkout based on your address.",
  },
  {
    icon: Clock,
    title: "Lead times",
    text: "Most cupcakes, pastries and small chops can be ordered for same-day or next-day delivery. Birthday and wedding cakes need more notice — check the prep time shown on each product.",
  },
  {
    icon: ShieldCheck,
    title: "Packaging",
    text: "Cakes are boxed and secured for transit, with temperature-safe packaging for longer journeys.",
  },
];

export default function DeliveryPage() {
  return (
    <div className="pb-16">
      <PageHeader eyebrow="Good to know" title="Delivery information" />

      <div className="mx-auto mt-10 max-w-2xl space-y-4 px-5 sm:px-8">
        {INFO.map((i) => (
          <div key={i.title} className="flex items-start gap-4 rounded-2xl bg-surface p-5 shadow-[var(--shadow-soft)]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach-tint">
              <i.icon className="h-4.5 w-4.5 text-honey-deep" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="font-display text-[16px] font-medium text-cocoa">{i.title}</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-cocoa-soft">{i.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
