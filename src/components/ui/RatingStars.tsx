import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = 14,
  showValue = false,
  reviewCount,
  className,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-[1px]">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(rating);
          return (
            <Star
              key={i}
              width={size}
              height={size}
              className={filled ? "fill-gold text-gold" : "fill-cocoa/10 text-cocoa/10"}
              strokeWidth={1}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-[13px] font-semibold text-cocoa tabular-nums">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-[13px] text-cocoa-soft tabular-nums">({reviewCount})</span>
      )}
    </div>
  );
}
