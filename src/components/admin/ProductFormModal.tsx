"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Toggle } from "../ui/Toggle";
import { categories } from "@/lib/mock-data";

export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  flavours: string;
  sizes: string;
  featured: boolean;
  enabled: boolean;
};

export function ProductFormModal({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (p: AdminProduct) => void;
  initial?: AdminProduct;
}) {
  const [form, setForm] = useState<AdminProduct>(
    initial ?? {
      id: crypto.randomUUID(),
      name: "",
      category: categories[0].name,
      price: 0,
      stock: 10,
      flavours: "",
      sizes: "",
      featured: false,
      enabled: true,
    }
  );

  function set<K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit product" : "Add product"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
          onClose();
        }}
        className="space-y-4"
      >
        <label className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-cocoa/15 bg-cream/50 text-cocoa-faint">
          <UploadCloud className="h-5 w-5" />
          <span className="text-[12px] font-medium">Upload product photos (drag to reorder, first = cover)</span>
          <input type="file" multiple accept="image/*" className="hidden" />
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
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
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
            <label className="text-[12px] font-semibold text-cocoa-soft">Price (₦)</label>
            <input
              required
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => set("price", Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-cocoa-soft">Discounted price (₦)</label>
            <input
              type="number"
              min={0}
              value={form.compareAtPrice ?? ""}
              onChange={(e) => set("compareAtPrice", e.target.value ? Number(e.target.value) : undefined)}
              className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
              placeholder="Optional"
            />
          </div>
        </div>

        <div>
          <label className="text-[12px] font-semibold text-cocoa-soft">Sizes (comma separated)</label>
          <input
            value={form.sizes}
            onChange={(e) => set("sizes", e.target.value)}
            placeholder="6&quot; — serves 8, 8&quot; — serves 16"
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

        <Button type="submit" variant="primary" size="lg" className="w-full">
          {initial ? "Save changes" : "Add product"}
        </Button>
      </form>
    </Modal>
  );
}
