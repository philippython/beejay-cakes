import { cn } from "@/lib/utils";
import { Sparkles, Flame, Crown } from "lucide-react";

type BadgeKind = "Best Seller" | "New" | "Premium" | "discount" | "success";

const styles: Record<BadgeKind, string> = {
  "Best Seller": "bg-honey text-white",
  New: "bg-rose text-white",
  Premium: "bg-gold text-white",
  discount: "bg-cocoa text-cream",
  success: "bg-success-tint text-success",
};

const icons: Partial<Record<BadgeKind, React.ElementType>> = {
  "Best Seller": Flame,
  New: Sparkles,
  Premium: Crown,
};

export function Badge({
  kind,
  children,
  className,
}: {
  kind: BadgeKind;
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = icons[kind];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        styles[kind],
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3" strokeWidth={2.5} />}
      {children}
    </span>
  );
}
