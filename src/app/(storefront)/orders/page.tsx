import { Check, Receipt } from "lucide-react";
import Link from "next/link";
import { orders, ORDER_STEPS } from "@/lib/mock-data";
import { formatPrice, cn } from "@/lib/utils";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

function StatusBadgeTone(status: string) {
  if (status === "Delivered") return "success" as const;
  if (status === "Cancelled") return "discount" as const;
  return "Best Seller" as const;
}

export default function OrdersPage() {
  if (orders.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-peach-tint">
          <Receipt className="h-7 w-7 text-honey-deep" strokeWidth={1.6} />
        </span>
        <h1 className="mt-5 font-display text-[22px] font-medium text-cocoa">No orders yet</h1>
        <p className="mt-1.5 text-[14px] text-cocoa-soft">
          Once you place an order, you&apos;ll be able to track it here in real time.
        </p>
        <Link href="/">
          <Button className="mt-6">Start browsing</Button>
        </Link>
      </div>
    );
  }

  const current = orders[0];
  const currentStepIndex = ORDER_STEPS.indexOf(current.status);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-16 pt-6 sm:px-8">
      <h1 className="font-display text-[26px] font-medium text-cocoa">Your orders</h1>

      {/* Live tracking for the current order */}
      <div className="mt-6 rounded-[22px] bg-surface p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-bold text-cocoa">Order {current.id}</p>
          <Badge kind={StatusBadgeTone(current.status)}>{current.status}</Badge>
        </div>
        <p className="mt-0.5 text-[12px] text-cocoa-soft">{current.date}</p>

        <div className="mt-6 flex items-center">
          {ORDER_STEPS.map((step, i) => {
            const done = i <= currentStepIndex;
            const isLast = i === ORDER_STEPS.length - 1;
            return (
              <div key={step} className={cn("flex items-center", !isLast && "flex-1")}>
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold",
                      done ? "bg-success text-white" : "bg-cocoa/[0.08] text-cocoa-faint"
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className="w-16 text-center text-[10px] font-medium leading-tight text-cocoa-soft">
                    {step}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={cn("mx-1 h-[2px] flex-1", i < currentStepIndex ? "bg-success" : "bg-cocoa/[0.08]")}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Order history */}
      <div className="mt-8 space-y-4">
        <p className="text-[13px] font-bold uppercase tracking-wide text-cocoa-faint">
          Order history
        </p>
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <p className="text-[13.5px] font-semibold text-cocoa">{o.id}</p>
              <Badge kind={StatusBadgeTone(o.status)}>{o.status}</Badge>
            </div>
            <p className="mt-0.5 text-[12px] text-cocoa-soft">{o.date}</p>

            <div className="mt-3 flex items-center gap-2">
              {o.items.slice(0, 3).map((item, i) => (
                <div key={i} className="h-11 w-11 overflow-hidden rounded-lg">
                  <ProductMedia tag={item.image} className="h-full w-full" iconClassName="h-4 w-4" />
                </div>
              ))}
              <p className="ml-1 flex-1 truncate text-[12.5px] text-cocoa-soft">
                {o.items.map((i) => i.name).join(", ")}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-line/70 pt-3">
              <p className="text-[13px] font-bold tabular-nums text-cocoa">{formatPrice(o.total)}</p>
              <button className="text-[12.5px] font-semibold text-honey-deep">View details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
