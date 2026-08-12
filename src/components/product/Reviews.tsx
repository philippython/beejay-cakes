import { RatingStars } from "../ui/RatingStars";
import { Button } from "../ui/Button";

const BREAKDOWN = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 15 },
  { stars: 3, pct: 5 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

const REVIEWS = [
  {
    name: "Funmi B.",
    date: "2 weeks ago",
    rating: 5,
    comment:
      "Ordered the caramel drip cake for my son's 5th birthday and it was flawless — moist, not too sweet, and the drip design looked exactly like the photos.",
  },
  {
    name: "David E.",
    date: "1 month ago",
    rating: 5,
    comment:
      "Delivery was early and the rider called ahead. The cake held up perfectly in the heat. Will be ordering again for my anniversary.",
  },
  {
    name: "Ngozi K.",
    date: "1 month ago",
    rating: 4,
    comment: "Lovely cake, slightly smaller than I expected for the 8-inch size but the taste made up for it.",
  },
];

export function Reviews({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div>
      <h2 className="font-display text-[22px] font-medium text-cocoa">Reviews &amp; ratings</h2>

      <div className="mt-5 flex flex-col gap-8 sm:flex-row sm:items-center">
        <div className="flex shrink-0 flex-col items-center gap-1 sm:items-start">
          <p className="font-display text-[44px] font-medium leading-none text-cocoa">
            {rating.toFixed(1)}
          </p>
          <RatingStars rating={rating} size={16} />
          <p className="text-[13px] text-cocoa-soft">{reviewCount} reviews</p>
        </div>

        <div className="flex-1 space-y-1.5">
          {BREAKDOWN.map((b) => (
            <div key={b.stars} className="flex items-center gap-3">
              <span className="w-3 text-[12px] text-cocoa-soft">{b.stars}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cocoa/[0.06]">
                <div className="h-full rounded-full bg-gold" style={{ width: `${b.pct}%` }} />
              </div>
              <span className="w-8 text-right text-[12px] text-cocoa-soft">{b.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {REVIEWS.map((r, i) => (
          <div key={i} className="rounded-2xl border border-line/70 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13.5px] font-semibold text-cocoa">{r.name}</p>
              <p className="text-[12px] text-cocoa-faint">{r.date}</p>
            </div>
            <RatingStars rating={r.rating} size={12} className="mt-1" />
            <p className="mt-2 text-[13.5px] leading-relaxed text-cocoa-soft">{r.comment}</p>
          </div>
        ))}
      </div>

      <Button variant="outline" className="mt-5 w-full sm:w-auto">
        See all {reviewCount} reviews
      </Button>
    </div>
  );
}
