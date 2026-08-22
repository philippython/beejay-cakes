"use client";

import Link from "next/link";
import { useState } from "react";
import { Trash2, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = cartSubtotal(items);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-peach-tint">
          <ShoppingBag className="h-7 w-7 text-honey-deep" strokeWidth={1.6} />
        </span>
        <h1 className="mt-5 font-display text-[22px] font-medium text-cocoa">Your cart is empty</h1>
        <p className="mt-1.5 text-[14px] text-cocoa-soft">
          Add a cake, box of pastries or a treat box to get started.
        </p>
        <Link href="/">
          <Button className="mt-6">Start browsing</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 pb-32 pt-6 sm:px-8 sm:pb-16">
      <h1 className="font-display text-[26px] font-medium text-cocoa">Your cart</h1>
      <p className="mt-1 text-[13.5px] text-cocoa-soft">{items.length} item{items.length > 1 ? "s" : ""}</p>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3.5 rounded-2xl bg-surface p-3.5 shadow-[var(--shadow-soft)]">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
              <ProductMedia tag={item.image} className="h-full w-full" iconClassName="h-8 w-8" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-[15.5px] font-medium leading-tight text-cocoa">
                    {item.name}
                  </p>
                  <button
                    aria-label="Remove item"
                    onClick={() => remove(item.id)}
                    className="shrink-0 text-cocoa-faint transition-colors hover:text-rose-deep"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                </div>
                <p className="mt-0.5 text-[12px] text-cocoa-soft">
                  {item.size} · {item.flavour}
                  {item.addOns.length > 0 && ` · +${item.addOns.length} add-on${item.addOns.length > 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <QuantityStepper value={item.quantity} onChange={(v) => setQuantity(item.id, v)} />
                <p className="text-[14px] font-bold tabular-nums text-cocoa">
                  {formatPrice(item.unitPrice * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-dashed border-cocoa/20 p-2 pl-4">
        <Tag className="h-4 w-4 shrink-0 text-cocoa-faint" />
        <input
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Coupon code"
          className="h-10 w-full bg-transparent text-[13.5px] text-cocoa placeholder:text-cocoa-faint focus:outline-none"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCouponApplied(coupon.trim().length > 0)}
        >
          Apply
        </Button>
      </div>
      {couponApplied && (
        <p className="mt-2 text-[12.5px] font-semibold text-success">Coupon applied — 10% off</p>
      )}

      {/* Order summary */}
      <div className="mt-6 space-y-2.5 rounded-2xl bg-surface p-5 shadow-[var(--shadow-soft)]">
        <div className="flex justify-between text-[13.5px] text-cocoa-soft">
          <span>Subtotal</span>
          <span className="tabular-nums text-cocoa">{formatPrice(subtotal)}</span>
        </div>
        {couponApplied && (
          <div className="flex justify-between text-[13.5px] text-success">
            <span>Discount</span>
            <span className="tabular-nums">−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-[13.5px] text-cocoa-soft">
          <span>Delivery</span>
          <span className="text-cocoa">Arranged with you directly</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-line/70 pt-3 text-[16px] font-bold text-cocoa">
          <span>Total</span>
          <span className="tabular-nums">{formatPrice(total)}</span>
        </div>
      </div>
      <p className="mt-2 text-[12px] text-cocoa-faint">
        Delivery cost isn&apos;t included yet — we&apos;ll confirm it with you after you order.
      </p>

      <div className="fixed inset-x-0 bottom-[var(--bottom-nav-h)] z-50 border-t border-line/70 bg-white/95 px-5 py-3 backdrop-blur-md sm:static sm:mt-6 sm:border-none sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <Link href="/checkout">
          <Button variant="primary" size="lg" className="w-full justify-between px-6">
            Checkout · {formatPrice(total)}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
