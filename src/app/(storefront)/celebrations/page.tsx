import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

const PACKAGES = [
  { name: "Birthday Package", desc: "Cake, cupcakes and a treat box, sized to your guest count." },
  { name: "Wedding Package", desc: "Tiered cake plus a dessert table of pastries and small chops." },
  { name: "Owambe & Small Chops Package", desc: "Full small chops spread, portioned for larger gatherings." },
];

export default function CelebrationsPage() {
  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="For every occasion"
        title="Celebration packages"
        blurb="Planning something bigger than a single cake? We put together bundles across cakes, pastries and small chops for birthdays, weddings and parties of any size."
      />

      <div className="mx-auto mt-10 max-w-2xl space-y-4 px-5 sm:px-8">
        {PACKAGES.map((p) => (
          <div key={p.name} className="flex items-start gap-4 rounded-2xl bg-surface p-5 shadow-[var(--shadow-soft)]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach-tint">
              <PartyPopper className="h-4.5 w-4.5 text-honey-deep" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="font-display text-[16px] font-medium text-cocoa">{p.name}</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-cocoa-soft">{p.desc}</p>
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-dashed border-honey/40 bg-honey/[0.05] p-5 text-center">
          <p className="text-[13.5px] text-cocoa-soft">
            Every package is quoted to your guest count and date — get in touch and we&apos;ll put
            one together for you.
          </p>
          <Link href="/contact">
            <Button size="sm" className="mt-3">Get in touch</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
