import { MessageSquareText, CheckCircle2, Clock } from "lucide-react";
import { RatingStars } from "../ui/RatingStars";
import { WriteReview } from "./WriteReview";
import type { ProductReview } from "@/lib/data/products";

type ExistingReview = { id: string; rating: number; comment: string; is_approved: boolean } | null;

export function Reviews({
  reviews,
  productId,
  userId,
  eligibleOrderId,
  existingReview,
}: {
  reviews: ProductReview[];
  productId: string;
  userId: string | null;
  eligibleOrderId: string | null;
  existingReview: ExistingReview;
}) {
  const reviewCount = reviews.length;
  const rating = reviewCount
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : 0;

  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return { stars, pct: reviewCount ? Math.round((count / reviewCount) * 100) : 0 };
  });

  function renderWriteReviewArea() {
    if (!userId) return null;

    if (existingReview) {
      return (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-line/70 p-4">
          {existingReview.is_approved ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
          ) : (
            <Clock className="h-5 w-5 shrink-0 text-honey-deep" />
          )}
          <p className="text-[13.5px] text-cocoa">
            {existingReview.is_approved
              ? "You've already reviewed this product — thanks!"
              : "You've submitted a review for this product — it's awaiting approval."}
          </p>
        </div>
      );
    }

    if (eligibleOrderId) {
      return <WriteReview productId={productId} orderId={eligibleOrderId} userId={userId} />;
    }

    return null;
  }

  return (
    <div>
      <h2 className="font-display text-[22px] font-medium text-cocoa">Reviews &amp; ratings</h2>

      {reviewCount === 0 ? (
        <div className="mt-5 flex flex-col items-center rounded-2xl border border-line/70 px-6 py-10 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-peach-tint">
            <MessageSquareText className="h-4.5 w-4.5 text-honey-deep" strokeWidth={1.6} />
          </span>
          <p className="mt-3 text-[14px] font-medium text-cocoa">No reviews yet</p>
          <p className="mt-1 max-w-xs text-[13px] text-cocoa-soft">
            Only customers who&apos;ve purchased this product can leave a review — be the first.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="flex shrink-0 flex-col items-center gap-1 sm:items-start">
              <p className="font-display text-[44px] font-medium leading-none text-cocoa">
                {rating.toFixed(1)}
              </p>
              <RatingStars rating={rating} size={16} />
              <p className="text-[13px] text-cocoa-soft">{reviewCount} review{reviewCount !== 1 ? "s" : ""}</p>
            </div>

            <div className="flex-1 space-y-1.5">
              {breakdown.map((b) => (
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
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-line/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13.5px] font-semibold text-cocoa">{r.customerName}</p>
                  <p className="text-[12px] text-cocoa-faint">{r.date}</p>
                </div>
                <RatingStars rating={r.rating} size={12} className="mt-1" />
                <p className="mt-2 text-[13.5px] leading-relaxed text-cocoa-soft">{r.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {renderWriteReviewArea()}
    </div>
  );
}
