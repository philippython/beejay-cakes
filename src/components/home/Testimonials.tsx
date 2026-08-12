import { MessageCircleHeart } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";

export function Testimonials() {
  return (
    <section className="pt-10 sm:pt-14">
      <SectionHeader eyebrow="Loved in London" title="What our customers say" />
      <div className="mx-5 flex flex-col items-center rounded-[22px] bg-surface px-6 py-10 text-center shadow-[var(--shadow-soft)] sm:mx-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-peach-tint">
          <MessageCircleHeart className="h-5 w-5 text-honey-deep" strokeWidth={1.6} />
        </span>
        <p className="mt-4 font-display text-[17px] font-medium text-cocoa">
          Reviews will appear here soon
        </p>
        <p className="mt-1 max-w-xs text-[13.5px] leading-relaxed text-cocoa-soft">
          Once customers start ordering, their ratings and reviews will show up on this page.
        </p>
      </div>
    </section>
  );
}
