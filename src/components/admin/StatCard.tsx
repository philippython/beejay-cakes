import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string;
  change?: { value: string; positive: boolean };
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <p className="text-[12.5px] font-semibold text-cocoa-soft">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-peach-tint">
          <Icon className="h-4 w-4 text-honey-deep" strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-3 font-display text-[24px] font-medium tabular-nums text-cocoa">{value}</p>
      {change && (
        <p
          className={cn(
            "mt-1 flex items-center gap-1 text-[12px] font-semibold",
            change.positive ? "text-success" : "text-rose-deep"
          )}
        >
          {change.positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {change.value} vs last month
        </p>
      )}
    </div>
  );
}
