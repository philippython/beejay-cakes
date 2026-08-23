"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategories, getProducts } from "@/lib/data/products";
import {
  createProduct,
  deleteProduct,
  setProductField,
  updateProduct,
} from "@/lib/data/admin-products";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { ProductFormModal, AdminProductFormValues, toProductInput } from "@/components/admin/ProductFormModal";
import { Category, Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: string; values: AdminProductFormValues } | undefined>(undefined);

  async function refresh() {
    const [cats, products] = await Promise.all([getCategories(supabase), getProducts(supabase)]);
    setCategories(cats);
    setItems(products);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  function openAdd() {
    setEditing(undefined);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    const category = categories.find((c) => c.name === p.category);
    setEditing({
      id: p.id,
      values: {
        name: p.name,
        categoryId: category?.id ?? "",
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        stock: 0,
        flavours: p.flavours.join(", "),
        sizes: p.sizes.map((s) => `${s.label}:${s.priceModifier}`).join(", "),
        addOns: p.addOns.map((a) => `${a.label}:${a.price}`).join(", "),
        images: p.images,
        featured: !!p.isFeatured,
        enabled: true,
      },
    });
    setModalOpen(true);
  }

  async function handleSave(form: AdminProductFormValues) {
    const input = toProductInput(form);
    if (editing) {
      await updateProduct(editing.id, input);
    } else {
      await createProduct(input);
    }
    await refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    try {
      await deleteProduct(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? `Couldn't delete: ${err.message}` : "Couldn't delete this product.");
    }
  }

  async function toggleFeatured(p: Product) {
    const next = !p.isFeatured;
    setItems((prev) => prev.map((i) => (i.id === p.id ? { ...i, isFeatured: next } : i)));
    await setProductField(p.id, "is_featured", next);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[26px] font-medium text-cocoa">Products</h1>
          <p className="mt-1 text-[13.5px] text-cocoa-soft">{items.length} products</p>
        </div>
        <Button className="gap-1.5" onClick={openAdd} disabled={loading}>
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-soft)]">
        {loading ? (
          <div className="px-6 py-16 text-center text-[13px] text-cocoa-soft">Loading…</div>
        ) : items.length === 0 ? (
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
                  <th className="px-5 py-3">Featured</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b border-line/50 last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                          <ProductMedia tag={p.images[0] ?? "birthday"} className="h-full w-full" iconClassName="h-4 w-4" />
                        </div>
                        <span className="text-[13px] font-medium text-cocoa">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[12.5px] text-cocoa-soft">{p.category}</td>
                    <td className="px-5 py-3 text-[12.5px] font-semibold tabular-nums text-cocoa">
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggleFeatured(p)}>
                        <Star
                          className={cn("h-4 w-4", p.isFeatured ? "fill-gold text-gold" : "text-cocoa/15")}
                          strokeWidth={1.5}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          aria-label="Edit"
                          onClick={() => openEdit(p)}
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
        categories={categories}
        initial={editing?.values}
      />
    </div>
  );
}
