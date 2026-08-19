import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-tint">
        <Mail className="h-8 w-8 text-success" strokeWidth={1.6} />
      </span>
      <h1 className="mt-5 font-display text-[24px] font-medium text-cocoa">Order placed!</h1>
      <p className="mt-1.5 text-[14px] leading-relaxed text-cocoa-soft">
        Check your email — we&apos;ve sent your order summary along with bank transfer details.
        Your order goes into the kitchen as soon as we&apos;ve confirmed payment.
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
