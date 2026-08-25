"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, ShieldCheck } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import { QuantityStepper } from "./QuantityStepper";
import { useCartStore } from "@/store/cart";

export function ProductOptions({ product }: { product: Product }) {
  const hasSizes = product.sizes.length > 0;
  const hasFlavours = product.flavours.length > 0;

  const [sizeId, setSizeId] = useState(product.sizes[0]?.id ?? "");
  const [flavour, setFlavour] = useState(product.flavours[0] ?? "");
  const [qty, setQty] = useState(1);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((s) => s.add);
  const router = useRouter();

  const size = product.sizes.find((s) => s.id === sizeId) ?? { id: "", label: "", priceModifier: 0 };
  const addOnTotal = product.addOns
    .filter((a) => selectedAddOnIds.includes(a.id))
    .reduce((s, a) => s + a.price, 0);
  const unitPrice = product.price + size.priceModifier;
  const total = useMemo(() => (unitPrice + addOnTotal) * qty, [unitPrice, addOnTotal, qty]);

  function toggleAddOn(id: string) {
    setSelectedAddOnIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  }

  function buildCartItem() {
    const addOnLabels = product.addOns
      .filter((a) => selectedAddOnIds.includes(a.id))
      .map((a) => a.label);
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      size: size.label,
      flavour,
      addOns: addOnLabels,
      unitPrice: unitPrice + addOnTotal,
      quantity: qty,
    };
  }

  function handleAdd() {
    addToCart(buildCartItem());
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    addToCart(buildCartItem());
    router.push("/cart");
  }

  return (
    <div>
      {/* Sizes — only shown if the admin has configured any for this product */}
      {hasSizes && (
        <div className="mt-1">
          <p className="text-[13px] font-bold text-cocoa">Size</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s.id}
                onClick={() => setSizeId(s.id)}
                className={cn(
                  "rounded-2xl border px-4 py-2.5 text-left text-[13px] font-medium transition-colors",
                  s.id === sizeId
                    ? "border-cocoa bg-cocoa text-cream"
                    : "border-cocoa/12 text-cocoa-soft hover:border-cocoa/30"
                )}
              >
                {s.label}
                {s.priceModifier > 0 && (
                  <span className={cn("ml-1.5", s.id === sizeId ? "text-cream/70" : "text-cocoa-faint")}>
                    +{formatPrice(s.priceModifier)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Flavours — only shown if the admin has configured any for this product */}
      {hasFlavours && (
        <div className="mt-6">
          <p className="text-[13px] font-bold text-cocoa">Flavour</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {product.flavours.map((f) => (
              <button
                key={f}
                onClick={() => setFlavour(f)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[13px] font-medium transition-colors",
                  f === flavour
                    ? "border-honey bg-honey/10 text-honey-deep"
                    : "border-cocoa/12 text-cocoa-soft hover:border-cocoa/30"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add-ons — only shown if the admin has configured any for this product */}
      {product.addOns.length > 0 && (
        <div className="mt-6">
          <p className="text-[13px] font-bold text-cocoa">Add-ons</p>
          <div className="mt-2.5 space-y-2">
            {product.addOns.map((a) => {
              const checked = selectedAddOnIds.includes(a.id);
              return (
                <label
                  key={a.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 transition-colors",
                    checked ? "border-honey bg-honey/[0.06]" : "border-cocoa/10"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAddOn(a.id)}
                      className="h-[18px] w-[18px] accent-honey"
                    />
                    <span className="text-[13.5px] font-medium text-cocoa">{a.label}</span>
                  </span>
                  <span className="text-[13px] font-semibold text-cocoa-soft">
                    +{formatPrice(a.price)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity + delivery info */}
      <div className="mt-7 flex items-center justify-between">
        <p className="text-[13px] font-bold text-cocoa">Quantity</p>
        <QuantityStepper value={qty} onChange={setQty} />
      </div>

      <div className="mt-6 space-y-2.5 rounded-2xl bg-peach-tint/60 p-4">
        <div className="flex items-center gap-2.5 text-[13px] text-cocoa">
          <Truck className="h-4 w-4 text-honey-deep" />
          {product.prepTime} · delivery estimate 45–90 min after baking
        </div>
        <div className="flex items-center gap-2.5 text-[13px] text-cocoa">
          <ShieldCheck className="h-4 w-4 text-honey-deep" />
          In stock — ready to order
        </div>
      </div>

      {/* Desktop actions */}
      <div className="mt-7 hidden items-center gap-3 sm:flex">
        <Button variant="outline" size="lg" className="flex-1" onClick={handleAdd}>
          {added ? "Added ✓" : `Add to cart · ${formatPrice(total)}`}
        </Button>
        <Button variant="primary" size="lg" className="flex-1" onClick={handleBuyNow}>
          Buy now
        </Button>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-[var(--bottom-nav-h)] z-50 border-t border-line/70 bg-white/95 px-5 py-3 backdrop-blur-md sm:hidden" style={{ transform: "translateZ(0)" }}>
        <div className="flex items-center gap-3">
          <div className="leading-tight">
            <p className="text-[11px] text-cocoa-faint">Total</p>
            <p className="text-[16px] font-bold tabular-nums text-cocoa">{formatPrice(total)}</p>
          </div>
          <Button variant="primary" size="lg" className="flex-1" onClick={handleAdd}>
            {added ? "Added to cart ✓" : "Add to cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
