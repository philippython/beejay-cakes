"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, CreditCard, Banknote, Loader2 } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/store/cart";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const DELIVERY_FEE = 2500;

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const router = useRouter();
  const subtotal = cartSubtotal(items);
  const total = subtotal + (items.length ? DELIVERY_FEE : 0);

  const [payment, setPayment] = useState<"card" | "transfer">("card");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    address: "",
    phone: "",
    instructions: "",
  });

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ name: i.name, unitPrice: i.unitPrice, quantity: i.quantity })),
          deliveryFee: items.length ? DELIVERY_FEE : 0,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Something went wrong. Add your Stripe keys in .env.local to enable live checkout.");
      }
    } catch {
      alert("Could not start checkout. Add your Stripe keys in .env.local to enable live checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 pb-32 pt-6 sm:px-8 sm:pb-16">
      <h1 className="font-display text-[26px] font-medium text-cocoa">Checkout</h1>

      <form onSubmit={handlePay} className="mt-6 grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-soft)]">
            <p className="flex items-center gap-2 text-[13px] font-bold text-cocoa">
              <MapPin className="h-4 w-4 text-honey-deep" /> Delivery address
            </p>
            <textarea
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="House number, street, area, city"
              rows={2}
              className="mt-3 w-full resize-none rounded-xl border border-cocoa/12 bg-cream/50 p-3 text-[13.5px] text-cocoa placeholder:text-cocoa-faint focus:border-honey focus:outline-none"
            />
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone number"
              className="mt-3 w-full rounded-xl border border-cocoa/12 bg-cream/50 p-3 text-[13.5px] text-cocoa placeholder:text-cocoa-faint focus:border-honey focus:outline-none"
            />
            <textarea
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              placeholder="Delivery instructions (optional) — e.g. gate code, landmark"
              rows={2}
              className="mt-3 w-full resize-none rounded-xl border border-cocoa/12 bg-cream/50 p-3 text-[13.5px] text-cocoa placeholder:text-cocoa-faint focus:border-honey focus:outline-none"
            />
          </section>

          <section className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-soft)]">
            <p className="text-[13px] font-bold text-cocoa">Payment method</p>
            <div className="mt-3 space-y-2.5">
              <button
                type="button"
                onClick={() => setPayment("card")}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-colors",
                  payment === "card" ? "border-honey bg-honey/[0.06]" : "border-cocoa/12"
                )}
              >
                <CreditCard className="h-4 w-4 text-cocoa" />
                <span className="flex-1 text-[13.5px] font-medium text-cocoa">Pay by card (Stripe)</span>
                {payment === "card" && <span className="h-2 w-2 rounded-full bg-honey" />}
              </button>
              <button
                type="button"
                onClick={() => setPayment("transfer")}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-colors",
                  payment === "transfer" ? "border-honey bg-honey/[0.06]" : "border-cocoa/12"
                )}
              >
                <Banknote className="h-4 w-4 text-cocoa" />
                <span className="flex-1 text-[13.5px] font-medium text-cocoa">Bank transfer</span>
                {payment === "transfer" && <span className="h-2 w-2 rounded-full bg-honey" />}
              </button>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-cocoa-faint">
              Card payments are processed securely by Stripe — Beejay Cakes never sees or stores
              your card details.
            </p>
          </section>
        </div>

        {/* Order summary */}
        <aside className="h-fit space-y-2.5 rounded-2xl bg-surface p-5 shadow-[var(--shadow-soft)]">
          <p className="text-[13px] font-bold text-cocoa">Order summary</p>
          {items.map((i) => (
            <div key={i.id} className="flex justify-between text-[13px] text-cocoa-soft">
              <span className="truncate pr-2">{i.name} × {i.quantity}</span>
              <span className="shrink-0 tabular-nums text-cocoa">{formatPrice(i.unitPrice * i.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-line/70 pt-2.5 text-[13px] text-cocoa-soft">
            <span>Delivery fee</span>
            <span className="tabular-nums text-cocoa">{formatPrice(items.length ? DELIVERY_FEE : 0)}</span>
          </div>
          <div className="flex justify-between border-t border-line/70 pt-2.5 text-[16px] font-bold text-cocoa">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(total)}</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || items.length === 0}
            className="mt-2 hidden w-full md:flex"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Pay ${formatPrice(total)}`}
          </Button>
        </aside>

        <div className="fixed inset-x-0 bottom-[64px] z-30 border-t border-line/70 bg-white/95 px-5 py-3 backdrop-blur-md md:hidden">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || items.length === 0}
            className="w-full"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Pay ${formatPrice(total)}`}
          </Button>
        </div>
      </form>
    </div>
  );
}
