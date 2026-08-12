import {
  Cake,
  Sparkles,
  CakeSlice,
  Croissant,
  UtensilsCrossed,
  Gift,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = {
  bg: string;
  fg: string;
  icon: LucideIcon;
};

const TONES: Record<string, Tone> = {
  birthday: { bg: "#F7E4D6", fg: "#C76A20", icon: Cake },
  wedding: { bg: "#F3E7E9", fg: "#B0813A", icon: Sparkles },
  cupcakes: { bg: "#FBE7ED", fg: "#C85F7E", icon: CakeSlice },
  pastries: { bg: "#F6ECD9", fg: "#8A5A2B", icon: Croissant },
  "small-chops": { bg: "#F7E1D3", fg: "#A6461B", icon: UtensilsCrossed },
  "treat-boxes": { bg: "#F1E3F0", fg: "#9C5B8C", icon: Gift },
};

function toneFor(tag: string): Tone {
  const key = Object.keys(TONES).find((k) => tag.startsWith(k));
  return TONES[key ?? "birthday"];
}

export function ProductMedia({
  tag,
  className,
  iconClassName,
}: {
  tag: string;
  className?: string;
  iconClassName?: string;
}) {
  const { bg, fg, icon: Icon } = toneFor(tag);
  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{ backgroundColor: bg }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
        <pattern id={`dots-${tag}`} width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill={fg} fillOpacity="0.25" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#dots-${tag})`} />
      </svg>
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30"
        style={{ backgroundColor: fg }}
      />
      <Icon
        className={cn("relative", iconClassName ?? "h-10 w-10")}
        style={{ color: fg }}
        strokeWidth={1.6}
      />
    </div>
  );
}
