"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/Button";

export default function CheckoutSuccessPage() {
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-tint">
        <CheckCircle2 className="h-8 w-8 text-success" strokeWidth={1.6} />
      </span>
      <h1 className="mt-5 font-display text-[24px] font-medium text-cocoa">Order confirmed!</h1>
      <p className="mt-1.5 text-[14px] leading-relaxed text-cocoa-soft">
        Thanks for your order — we&apos;ve sent a confirmation and will notify you as it&apos;s
        baked, packed and out for delivery.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/orders">
          <Button variant="outline">Track order</Button>
        </Link>
        <Link href="/">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}
