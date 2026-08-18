"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Toggle } from "../ui/Toggle";
import { Category } from "@/lib/types";
import { AdminProductInput } from "@/lib/data/admin-products";

export type AdminProductFormValues = {
  name: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  flavours: string; // comma-separated in the UI
  sizes: string; // "Label:modifier, Label:modifier" in the UI
  featured: boolean;
  enabled: boolean;
};

function parseSizes(raw: string): { label: string; priceModifier: number }[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [label, modifier] = s.split(":").map((p) => p.trim());
      return { label, priceModifier: Number(modifier) || 0 };
    });
}

export function toProductInput(form: AdminProductFormValues): AdminProductInput {
  return {
    name: form.name,
    categoryId: form.categoryId || null,
    price: form.price,
    compareAtPrice: form.compareAtPrice,
    stock: form.stock,
    flavours: form.flavours.split(",").map((f) => f.trim()).filter(Boolean),
    sizes: parseSizes(form.sizes),
    featured: form.featured,
    enabled: form.enabled,
  };
}

export function ProductFormModal({
  open,
  onClose,
  onSave,
  categories,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: AdminProductFormValues) => Promise<void> | void;
  categories: Category[];
  initial?: AdminProductFormValues;
}) {
  const [form, setForm] = useState<AdminProductFormValues>(
    initial ?? {
      name: "",
      categoryId: categories[0]?.id ?? "",
      price: 0,
      stock: 10,
      flavours: "",
      sizes: "",
      featured: false,
      enabled: true,
    }
  );
  const [saving, setSaving] = useState(false);

  function set<K extends keyof AdminProductFormValues>(key: K, value: AdminProductFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit product" : "Add product"}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            await onSave(form);
            onClose();
          } finally {
            setSaving(false);
          }
        }}
        className="space-y-4"
      >
        <label className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-cocoa/15 bg-cream/50 text-cocoa-faint">
          <UploadCloud className="h-5 w-5" />
          <span className="text-center text-[12px] font-medium px-4">
            Photo upload needs Cloudinary connected — see README. For now, add images after
            saving via the product&apos;s Supabase row.
          </span>
          <input type="file" multiple accept="image/*" className="hidden" disabled />
        </label>

        <div>
          <label className="text-[12px] font-semibold text-cocoa-soft">Product name</label>
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] font-semibold text-cocoa-soft">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
            >
              {categories.length === 0 && <option value="">Add a category first</option>}
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-semibold text-cocoa-soft">Stock</label>
            <input
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => set("stock", Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] font-semibold text-cocoa-soft">Price (£)</label>
            <input
              required
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => set("price", Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-cocoa-soft">Discounted price (£)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.compareAtPrice ?? ""}
              onChange={(e) => set("compareAtPrice", e.target.value ? Number(e.target.value) : undefined)}
              className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
              placeholder="Optional"
            />
          </div>
        </div>

        <div>
          <label className="text-[12px] font-semibold text-cocoa-soft">
            Sizes — <span className="font-normal text-cocoa-faint">label:extra price, comma separated</span>
          </label>
          <input
            value={form.sizes}
            onChange={(e) => set("sizes", e.target.value)}
            placeholder='6" serves 8:0, 8" serves 16:14'
            className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[12px] font-semibold text-cocoa-soft">Flavours (comma separated)</label>
          <input
            value={form.flavours}
            onChange={(e) => set("flavours", e.target.value)}
            placeholder="Vanilla, Red Velvet, Chocolate"
            className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-cream/60 px-4 py-3">
          <span className="text-[13px] font-medium text-cocoa">Mark as featured</span>
          <Toggle checked={form.featured} onChange={(v) => set("featured", v)} />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-cream/60 px-4 py-3">
          <span className="text-[13px] font-medium text-cocoa">Enabled (visible to customers)</span>
          <Toggle checked={form.enabled} onChange={(v) => set("enabled", v)} />
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={saving}>
          {saving ? "Saving…" : initial ? "Save changes" : "Add product"}
        </Button>
      </form>
    </Modal>
  );
}
