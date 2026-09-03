"use client";

import { useState } from "react";
import { Star, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { submitReview } from "@/lib/data/products";
import { Button } from "../ui/Button";

export function WriteReview({
  productId,
  orderId,
  userId,
}: {
  productId: string;
  orderId: string;
  userId: string;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Pick a star rating first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitReview(supabase, { productId, orderId, userId, rating, comment });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't submit your review — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-success/30 bg-success-tint p-4">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
        <p className="text-[13.5px] text-cocoa">
          Thanks! Your review is in — it&apos;ll appear here once we&apos;ve approved it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-line/70 p-5">
      <p className="text-[13.5px] font-bold text-cocoa">Write a review</p>
      <p className="mt-0.5 text-[12px] text-cocoa-soft">You bought this — let others know what you thought.</p>

      <div className="mt-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(n)}
          >
            <Star
              className="h-7 w-7 transition-colors"
              strokeWidth={1.5}
              style={{
                fill: n <= (hoverRating || rating) ? "var(--color-gold)" : "transparent",
                color: n <= (hoverRating || rating) ? "var(--color-gold)" : "var(--color-cocoa-faint)",
              }}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        minLength={5}
        rows={3}
        placeholder="What did you think?"
        className="mt-3 w-full resize-none rounded-xl border border-cocoa/12 p-3 text-[13.5px] text-cocoa placeholder:text-cocoa-faint focus:border-honey focus:outline-none"
      />

      {error && <p className="mt-2 text-[12.5px] font-medium text-rose-deep">{error}</p>}

      <Button type="submit" disabled={submitting} size="sm" className="mt-3 gap-1.5">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit review"}
      </Button>
    </form>
  );
}
