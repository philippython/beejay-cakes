"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Banknote, Mail, Loader2 } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const router = useRouter();
  const subtotal = cartSubtotal(items);
  const total = subtotal;

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [form, setForm] = useState({
    email: "",
    address: "",
    phone: "",
    instructions: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id);
      if (data.user?.email) setForm((f) => ({ ...f, email: data.user!.email! }));
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            size: i.size,
            flavour: i.flavour,
            unitPrice: i.unitPrice,
            quantity: i.quantity,
          })),
          deliveryAddress: form.address,
          phone: form.phone,
          deliveryInstructions: form.instructions,
          userId,
          customerEmail: form.email,
        }),
      });
      const data = await res.json();
      if (res.ok && data.orderId) {
        clear();
        router.push(`/checkout/success?order=${data.orderId}`);
      } else {
        alert(data.error ?? "Something went wrong placing your order.");
      }
    } catch {
      alert("Could not place your order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 pb-32 pt-6 sm:px-8 sm:pb-16">
      <h1 className="font-display text-[26px] font-medium text-cocoa">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-soft)]">
            <p className="flex items-center gap-2 text-[13px] font-bold text-cocoa">
              <MapPin className="h-4 w-4 text-honey-deep" /> Delivery details
            </p>
            <label className="mt-3 flex items-center gap-2.5 rounded-xl border border-cocoa/12 bg-cream/50 px-3 py-2.5">
              <Mail className="h-4 w-4 shrink-0 text-cocoa-faint" />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email — order updates go here"
                className="w-full bg-transparent text-[13.5px] text-cocoa placeholder:text-cocoa-faint focus:outline-none"
              />
            </label>
            <textarea
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="House number, street, area, city, postcode"
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
            <div className="flex items-center gap-3 rounded-xl border border-honey bg-honey/[0.06] p-3.5">
              <Banknote className="h-4 w-4 shrink-0 text-cocoa" />
              <span className="text-[13.5px] font-medium text-cocoa">Pay by bank transfer</span>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-cocoa-faint">
              We&apos;ll email you our bank details and a payment reference right after you place
              your order. Your order goes into the kitchen as soon as we&apos;ve confirmed your
              payment's arrived. Delivery cost isn&apos;t included below — we&apos;ll confirm that
              with you directly once we have your order.
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
            <span>Delivery</span>
            <span className="text-cocoa">To be confirmed</span>
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
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Place order"}
          </Button>
        </aside>

        <div className="fixed inset-x-0 bottom-[var(--bottom-nav-h)] z-50 border-t border-line/70 bg-white/95 px-5 py-3 backdrop-blur-md md:hidden" style={{ transform: "translateZ(0)" }}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || items.length === 0}
            className="w-full"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Place order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
