"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { products as seedProducts } from "@/lib/mock-data";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { ProductFormModal, AdminProduct } from "@/components/admin/ProductFormModal";

function seedToAdmin(): AdminProduct[] {
  return seedProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    stock: 12,
    flavours: p.flavours.join(", "),
    sizes: p.sizes.map((s) => s.label).join(", "),
    featured: !!p.isFeatured,
    enabled: true,
  }));
}

export default function AdminProductsPage() {
  const [items, setItems] = useState<AdminProduct[]>(seedToAdmin());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | undefined>(undefined);

  function handleSave(product: AdminProduct) {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists ? prev.map((p) => (p.id === product.id ? product : p)) : [product, ...prev];
    });
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function toggle(id: string, key: "featured" | "enabled", value: boolean) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[26px] font-medium text-cocoa">Products</h1>
          <p className="mt-1 text-[13.5px] text-cocoa-soft">{items.length} products</p>
        </div>
        <Button
          className="gap-1.5"
          onClick={() => {
            setEditing(undefined);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-soft)]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-peach-tint">
              <Plus className="h-5 w-5 text-honey-deep" strokeWidth={1.8} />
            </span>
            <p className="mt-4 text-[14px] font-medium text-cocoa">No products yet</p>
            <p className="mt-1 max-w-xs text-[13px] text-cocoa-soft">
              Add your first cake, pastry or treat box to start selling.
            </p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-line/70 text-[11.5px] font-bold uppercase tracking-wide text-cocoa-faint">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Featured</th>
                <th className="px-5 py-3">Enabled</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-line/50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                        <ProductMedia tag={p.category.toLowerCase().split(" ")[0]} className="h-full w-full" iconClassName="h-4 w-4" />
                      </div>
                      <span className="text-[13px] font-medium text-cocoa">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[12.5px] text-cocoa-soft">{p.category}</td>
                  <td className="px-5 py-3 text-[12.5px] font-semibold tabular-nums text-cocoa">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "text-[12.5px] font-semibold tabular-nums",
                        p.stock <= 3 ? "text-rose-deep" : "text-cocoa"
                      )}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggle(p.id, "featured", !p.featured)}>
                      <Star
                        className={cn("h-4 w-4", p.featured ? "fill-gold text-gold" : "text-cocoa/15")}
                        strokeWidth={1.5}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <Toggle checked={p.enabled} onChange={(v) => toggle(p.id, "enabled", v)} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        aria-label="Edit"
                        onClick={() => {
                          setEditing(p);
                          setModalOpen(true);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-cocoa-soft hover:bg-cocoa/[0.05]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        aria-label="Delete"
                        onClick={() => handleDelete(p.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-cocoa-soft hover:bg-rose/[0.08] hover:text-rose-deep"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}
