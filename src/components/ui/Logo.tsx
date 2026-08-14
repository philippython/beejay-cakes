import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  size = "md",
  showWordmark = true,
  light = false,
  className,
}: {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  light?: boolean;
  className?: string;
}) {
  const iconSize = { sm: 26, md: 32, lg: 40 }[size];
  const textSize = { sm: "text-[15px]", md: "text-[18px]", lg: "text-[22px]" }[size];

  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Image
        src="/brand/logo-icon.png"
        alt="Beejay Cakes"
        width={iconSize}
        height={iconSize}
        className="shrink-0"
        priority
      />
      {showWordmark && (
        <span
          className={cn("font-display font-medium leading-none tracking-[-0.01em]", textSize, light ? "text-cream" : "text-cocoa")}
        >
          Beejay Cakes
        </span>
      )}
    </span>
  );
}
