"use client";

import { MessageSquareText } from "lucide-react";

// No seeded reviews — customers can only review products they've
// purchased, so this list stays empty until real orders and reviews
// come through Supabase (see README.md).
const REVIEWS: {
  id: string;
  name: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}[] = [];

export default function AdminReviewsPage() {
  return (
    <div>
      <h1 className="font-display text-[26px] font-medium text-cocoa">Reviews</h1>
      <p className="mt-1 text-[13.5px] text-cocoa-soft">
        {REVIEWS.length} reviews awaiting or under moderation
      </p>

      <div className="mt-8 flex flex-col items-center rounded-2xl bg-surface px-6 py-16 text-center shadow-[var(--shadow-soft)]">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-peach-tint">
          <MessageSquareText className="h-5 w-5 text-honey-deep" strokeWidth={1.6} />
        </span>
        <p className="mt-4 text-[14px] font-medium text-cocoa">No reviews yet</p>
        <p className="mt-1 max-w-xs text-[13px] text-cocoa-soft">
          Only customers who've completed a purchase can leave a review — they&apos;ll appear
          here for approval as soon as they come in.
        </p>
      </div>
    </div>
  );
}
