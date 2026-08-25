"use client";

import { useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Toggle } from "../ui/Toggle";
import { RepeatingRows } from "./RepeatingRows";
import { Category } from "@/lib/types";
import { AdminProductInput } from "@/lib/data/admin-products";
import { uploadImageToCloudinary, CloudinaryUploadError } from "@/lib/cloudinary";

type SizeRow = { key: string; label: string; priceModifier: number };
type FlavourRow = { key: string; name: string };
type AddOnRow = { key: string; label: string; price: number };

export type AdminProductFormValues = {
  name: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  flavours: FlavourRow[];
  sizes: SizeRow[];
  addOns: AddOnRow[];
  images: string[];
  featured: boolean;
  enabled: boolean;
};

function newKey() {
  return crypto.randomUUID();
}

export function toProductInput(form: AdminProductFormValues): AdminProductInput {
  return {
    name: form.name,
    categoryId: form.categoryId || null,
    price: form.price,
    compareAtPrice: form.compareAtPrice,
    stock: form.stock,
    flavours: form.flavours.map((f) => f.name.trim()).filter(Boolean),
    sizes: form.sizes
      .filter((s) => s.label.trim())
      .map((s) => ({ label: s.label.trim(), priceModifier: s.priceModifier })),
    addOns: form.addOns
      .filter((a) => a.label.trim())
      .map((a) => ({ label: a.label.trim(), price: a.price })),
    images: form.images,
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
  // NOTE: the parent renders this with key={editing?.id ?? "new"}, which
  // remounts it fresh every time you switch what you're editing (or
  // switch from Add to Edit) — that's what makes useState's initial
  // value below actually apply each time, instead of "sticking" to
  // whatever the very first product edited was.
  const [form, setForm] = useState<AdminProductFormValues>(
    initial ?? {
      name: "",
      categoryId: categories[0]?.id ?? "",
      price: 0,
      stock: 10,
      flavours: [],
      sizes: [],
      addOns: [],
      images: [],
      featured: false,
      enabled: true,
    }
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function set<K extends keyof AdminProductFormValues>(key: K, value: AdminProductFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow selecting the same file again later
    if (!files.length) return;

    setUploading(true);
    setUploadError(null);
    try {
      const urls = await Promise.all(files.map(uploadImageToCloudinary));
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    } catch (err) {
      setUploadError(err instanceof CloudinaryUploadError ? err.message : "Upload failed — please try again.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));
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
        className="space-y-5"
      >
        <div>
          <label
            className={`flex h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed text-cocoa-faint transition-colors ${
              uploading ? "border-honey/40 bg-honey/[0.04]" : "border-cocoa/15 bg-cream/50 hover:border-cocoa/25"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-honey-deep" />
                <span className="text-[12px] font-medium">Uploading…</span>
              </>
            ) : (
              <>
                <UploadCloud className="h-5 w-5" />
                <span className="text-[12px] font-medium">
                  Upload photos — first one becomes the cover image
                </span>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleFileSelect}
            />
          </label>
          {uploadError && <p className="mt-1.5 text-[12px] font-medium text-rose-deep">{uploadError}</p>}

          {form.images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2.5">
              {form.images.map((url, i) => (
                <div key={url} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-cocoa/80 py-0.5 text-center text-[8px] font-bold uppercase tracking-wide text-cream">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => removeImage(url)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cocoa/70 text-cream"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
              required
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              disabled={categories.length === 0}
              className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none disabled:opacity-50"
            >
              <option value="" disabled>
                {categories.length === 0 ? "Add a category first" : "Choose a category"}
              </option>
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

        <RepeatingRows<SizeRow>
          label="Sizes"
          hint="leave empty if this product only comes in one size"
          rows={form.sizes}
          onChange={(rows) => set("sizes", rows)}
          addLabel="Add a size"
          makeRow={() => ({ key: newKey(), label: "", priceModifier: 0 })}
          emptyHint="No sizes added — customers won't see a size picker on this product."
          renderRow={(row, update) => (
            <div className="flex gap-2">
              <input
                value={row.label}
                onChange={(e) => update({ label: e.target.value })}
                placeholder='e.g. 8" — serves 16'
                className="flex-1 rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
              />
              <div className="flex w-32 items-center gap-1.5 rounded-xl border border-cocoa/12 px-3 py-2.5">
                <span className="shrink-0 text-[12px] text-cocoa-faint">+£</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={row.priceModifier}
                  onChange={(e) => update({ priceModifier: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full bg-transparent text-[13.5px] focus:outline-none"
                />
              </div>
            </div>
          )}
        />

        <RepeatingRows<AddOnRow>
          label="Add-ons"
          hint="entirely up to you — leave empty for none on this product"
          rows={form.addOns}
          onChange={(rows) => set("addOns", rows)}
          addLabel="Add an add-on"
          makeRow={() => ({ key: newKey(), label: "", price: 0 })}
          emptyHint="No add-ons — customers won't see an add-ons section on this product."
          renderRow={(row, update) => (
            <div className="flex gap-2">
              <input
                value={row.label}
                onChange={(e) => update({ label: e.target.value })}
                placeholder="e.g. Gold cake topper"
                className="flex-1 rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
              />
              <div className="flex w-32 items-center gap-1.5 rounded-xl border border-cocoa/12 px-3 py-2.5">
                <span className="shrink-0 text-[12px] text-cocoa-faint">£</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={row.price}
                  onChange={(e) => update({ price: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full bg-transparent text-[13.5px] focus:outline-none"
                />
              </div>
            </div>
          )}
        />

        <RepeatingRows<FlavourRow>
          label="Flavours"
          rows={form.flavours}
          onChange={(rows) => set("flavours", rows)}
          addLabel="Add a flavour"
          makeRow={() => ({ key: newKey(), name: "" })}
          emptyHint="No flavours added — customers won't see a flavour picker on this product."
          renderRow={(row, update) => (
            <input
              value={row.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="e.g. Vanilla Bean"
              className="w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
            />
          )}
        />

        <div className="flex items-center justify-between rounded-xl bg-cream/60 px-4 py-3">
          <span className="text-[13px] font-medium text-cocoa">Mark as featured</span>
          <Toggle checked={form.featured} onChange={(v) => set("featured", v)} />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-cream/60 px-4 py-3">
          <span className="text-[13px] font-medium text-cocoa">Enabled (visible to customers)</span>
          <Toggle checked={form.enabled} onChange={(v) => set("enabled", v)} />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={saving || uploading || !form.categoryId}
        >
          {saving ? "Saving…" : initial ? "Save changes" : "Add product"}
        </Button>
      </form>
    </Modal>
  );
}
