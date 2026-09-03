"use client";

import { useEffect, useState } from "react";
import { Check, Trash2, MessageSquareText, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getAllReviewsAdmin, approveReview, deleteReviewAdmin, type AdminReview } from "@/lib/data/admin-reviews";
import { RatingStars } from "@/components/ui/RatingStars";
import { cn } from "@/lib/utils";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    getAllReviewsAdmin(supabase).then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  async function handleApprove(id: string) {
    setBusyId(id);
    try {
      await approveReview(supabase, id);
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Couldn't approve this review.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review? This can't be undone.")) return;
    setBusyId(id);
    try {
      await deleteReviewAdmin(supabase, id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Couldn't delete this review.");
    } finally {
      setBusyId(null);
    }
  }

  const pending = reviews.filter((r) => !r.isApproved);
  const approved = reviews.filter((r) => r.isApproved);

  return (
    <div>
      <h1 className="font-display text-[26px] font-medium text-cocoa">Reviews</h1>
      <p className="mt-1 text-[13.5px] text-cocoa-soft">
        {pending.length} awaiting approval · {approved.length} published
      </p>

      {loading ? (
        <div className="mt-8 flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-cocoa-faint" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl bg-surface px-6 py-16 text-center shadow-[var(--shadow-soft)]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-peach-tint">
            <MessageSquareText className="h-5 w-5 text-honey-deep" strokeWidth={1.6} />
          </span>
          <p className="mt-4 text-[14px] font-medium text-cocoa">No reviews yet</p>
          <p className="mt-1 max-w-xs text-[13px] text-cocoa-soft">
            Only customers who&apos;ve completed a purchase can leave a review — they&apos;ll appear
            here for approval as soon as they come in.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {[...pending, ...approved].map((r) => (
            <div key={r.id} className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13.5px] font-semibold text-cocoa">{r.customerName}</p>
                  <p className="text-[12px] text-cocoa-soft">on {r.productName} · {r.date}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-bold",
                    r.isApproved ? "bg-success-tint text-success" : "bg-honey/10 text-honey-deep"
                  )}
                >
                  {r.isApproved ? "Published" : "Pending"}
                </span>
              </div>

              <RatingStars rating={r.rating} size={13} className="mt-2" />
              <p className="mt-2 text-[13.5px] leading-relaxed text-cocoa-soft">{r.comment}</p>

              <div className="mt-4 flex items-center gap-1.5">
                {!r.isApproved && (
                  <button
                    onClick={() => handleApprove(r.id)}
                    disabled={busyId === r.id}
                    className="flex items-center gap-1.5 rounded-full bg-success-tint px-3 py-1.5 text-[11.5px] font-semibold text-success disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={busyId === r.id}
                  className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold text-rose-deep hover:bg-rose/[0.08] disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
