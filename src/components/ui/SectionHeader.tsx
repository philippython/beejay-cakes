import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = "See all",
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between px-5 sm:px-8">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.08em] text-rose-deep">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-[22px] font-medium text-cocoa sm:text-[26px]">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 whitespace-nowrap text-[13px] font-semibold text-cocoa-soft transition-colors hover:text-honey-deep"
        >
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
