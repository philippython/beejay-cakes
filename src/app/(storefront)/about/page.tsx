import { ChefHat, Heart, MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

const POINTS = [
  {
    icon: ChefHat,
    title: "Handcrafted, always",
    text: "Every cake, pastry and treat box is made to order — nothing frozen, nothing mass-produced.",
  },
  {
    icon: Heart,
    title: "Built for celebrations",
    text: "Birthdays, weddings, owambe, or just because — we bake for the moments that matter.",
  },
  {
    icon: MapPin,
    title: "London-baked, UK-wide",
    text: "Every order is baked fresh in London and carefully delivered across the UK.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Our story"
        title="Taste the difference"
        blurb="Beejay Cakes is a London bakery specialising in birthday cakes, wedding cakes, cupcakes, pastries, small chops and celebration treat boxes — baked fresh and delivered with care."
      />

      <div className="mx-auto mt-10 grid max-w-4xl gap-5 px-5 sm:grid-cols-3 sm:px-8">
        {POINTS.map((p) => (
          <div key={p.title} className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-soft)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-peach-tint">
              <p.icon className="h-4.5 w-4.5 text-honey-deep" strokeWidth={1.8} />
            </span>
            <h2 className="mt-3 font-display text-[16px] font-medium text-cocoa">{p.title}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-cocoa-soft">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
