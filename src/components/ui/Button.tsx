import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-cocoa text-cream hover:bg-[#2c1a0f] active:scale-[0.98] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]",
  secondary:
    "bg-honey text-white hover:bg-honey-deep active:scale-[0.98]",
  outline:
    "bg-transparent text-cocoa border border-cocoa/15 hover:border-cocoa/35 hover:bg-cocoa/[0.03] active:scale-[0.98]",
  ghost: "bg-transparent text-cocoa hover:bg-cocoa/[0.05] active:scale-[0.98]",
  gold: "bg-gold text-white hover:bg-[#9c6f30] active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px] gap-1.5",
  md: "h-12 px-6 text-[15px] gap-2",
  lg: "h-14 px-7 text-[16px] gap-2",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }
>(({ className, variant = "primary", size = "md", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold tracking-[-0.01em] transition-all duration-150 ease-out disabled:opacity-40 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";
