"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Star, X, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategories, getProducts } from "@/lib/data/products";
import {
  createProduct,
  deleteProduct,
  setProductField,
  updateProduct,
  bulkAssignCategory,
} from "@/lib/data/admin-products";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { ProductFormModal, AdminProductFormValues, toProductInput } from "@/components/admin/ProductFormModal";
import { Category, Product } from "@/lib/types";

function AdminProductsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category"); // category id, from /admin/categories

  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: string; values: AdminProductFormValues } | undefined>(undefined);
  const [addInstance, setAddInstance] = useState(0);
  const [bulkCategoryId, setBulkCategoryId] = useState("");
  const [bulkApplying, setBulkApplying] = useState(false);

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
    setAddInstance((n) => n + 1);
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
        stock: p.stock,
        flavours: p.flavours.map((name) => ({ key: crypto.randomUUID(), name })),
        sizes: p.sizes.map((s) => ({ key: crypto.randomUUID(), label: s.label, priceModifier: s.priceModifier })),
        addOns: p.addOns.map((a) => ({ key: crypto.randomUUID(), label: a.label, price: a.price })),
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

  async function handleBulkAssign() {
    if (!bulkCategoryId) return;
    setBulkApplying(true);
    try {
      await bulkAssignCategory(uncategorized.map((p) => p.id), bulkCategoryId);
      await refresh();
      setBulkCategoryId("");
    } catch (err) {
      alert(err instanceof Error ? `Couldn't update: ${err.message}` : "Couldn't update those products.");
    } finally {
      setBulkApplying(false);
    }
  }

  async function toggleFeatured(p: Product) {
    const next = !p.isFeatured;
    setItems((prev) => prev.map((i) => (i.id === p.id ? { ...i, isFeatured: next } : i)));
    await setProductField(p.id, "is_featured", next);
  }

  const activeCategory = categoryFilter ? categories.find((c) => c.id === categoryFilter) : null;
  const filteredItems = activeCategory ? items.filter((p) => p.category === activeCategory.name) : items;
  const uncategorized = items.filter((p) => !p.category);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[26px] font-medium text-cocoa">Products</h1>
          <p className="mt-1 text-[13.5px] text-cocoa-soft">
            {filteredItems.length} product{filteredItems.length !== 1 ? "s" : ""}
            {activeCategory && ` in "${activeCategory.name}"`}
          </p>
        </div>
        <Button className="gap-1.5" onClick={openAdd} disabled={loading}>
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </div>

      {activeCategory && (
        <button
          onClick={() => router.push("/admin/products")}
          className="mt-3 flex items-center gap-1.5 rounded-full bg-honey/10 px-3 py-1.5 text-[12.5px] font-semibold text-honey-deep hover:bg-honey/20"
        >
          Filtered by {activeCategory.name}
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      {!loading && uncategorized.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-dashed border-rose/40 bg-rose/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-[13px] font-medium text-cocoa">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-deep" />
            {uncategorized.length} product{uncategorized.length !== 1 ? "s" : ""} with no category — they
            won&apos;t show up under any category on the site.
          </p>
          <div className="flex items-center gap-2">
            <select
              value={bulkCategoryId}
              onChange={(e) => setBulkCategoryId(e.target.value)}
              className="rounded-xl border border-cocoa/12 bg-white px-3 py-2 text-[13px] focus:border-honey focus:outline-none"
            >
              <option value="">Assign to…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Button size="sm" onClick={handleBulkAssign} disabled={!bulkCategoryId || bulkApplying}>
              {bulkApplying ? "Applying…" : `Apply to all ${uncategorized.length}`}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-soft)]">
        {loading ? (
          <div className="px-6 py-16 text-center text-[13px] text-cocoa-soft">Loading…</div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-peach-tint">
              <Plus className="h-5 w-5 text-honey-deep" strokeWidth={1.8} />
            </span>
            <p className="mt-4 text-[14px] font-medium text-cocoa">
              {activeCategory ? "No products in this category yet" : "No products yet"}
            </p>
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
                {filteredItems.map((p) => (
                  <tr key={p.id} className="border-b border-line/50 last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                          <ProductMedia tag={p.images[0] ?? "birthday"} className="h-full w-full" iconClassName="h-4 w-4" />
                        </div>
                        <span className="text-[13px] font-medium text-cocoa">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[12.5px]">
                      {p.category ? (
                        <span className="text-cocoa-soft">{p.category}</span>
                      ) : (
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-full bg-rose/10 px-2.5 py-1 text-[11px] font-bold text-rose-deep hover:bg-rose/20"
                          title="This product isn't counted in any category until you set one"
                        >
                          No category — fix
                        </button>
                      )}
                    </td>
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
        key={editing?.id ?? `new-${addInstance}`}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        categories={categories}
        initial={editing?.values}
      />
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense>
      <AdminProductsPageInner />
    </Suspense>
  );
}
