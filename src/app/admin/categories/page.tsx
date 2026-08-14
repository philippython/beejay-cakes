"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Tag } from "lucide-react";
import { categories as seedCategories } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProductMedia } from "@/components/ui/ProductMedia";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCategoriesPage() {
  const [items, setItems] = useState(seedCategories);
  const [dragId, setDragId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<(typeof seedCategories)[number] | null>(null);
  const [name, setName] = useState("");

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    setItems((prev) => {
      const next = [...prev];
      const from = next.findIndex((c) => c.id === dragId);
      const to = next.findIndex((c) => c.id === targetId);
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDragId(null);
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((c) => c.id !== id));
  }

  function openAdd() {
    setEditing(null);
    setName("");
    setModalOpen(true);
  }

  function openEdit(cat: (typeof seedCategories)[number]) {
    setEditing(cat);
    setName(cat.name);
    setModalOpen(true);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    if (editing) {
      setItems((prev) => prev.map((c) => (c.id === editing.id ? { ...c, name, slug: slugify(name) } : c)));
    } else {
      setItems((prev) => [
        ...prev,
        { id: crypto.randomUUID(), name, slug: slugify(name), image: "treat-boxes", count: 0 },
      ]);
    }
    setModalOpen(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[26px] font-medium text-cocoa">Categories</h1>
          <p className="mt-1 text-[13.5px] text-cocoa-soft">Drag to reorder how they appear on the storefront.</p>
        </div>
        <Button className="gap-1.5" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add category
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-soft)]">
        {items.map((c, i) => (
          <div
            key={c.id}
            draggable
            onDragStart={() => setDragId(c.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(c.id)}
            className={`flex items-center gap-3.5 px-5 py-4 ${i !== items.length - 1 ? "border-b border-line/50" : ""}`}
          >
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-cocoa-faint" />
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <ProductMedia tag={c.image} className="h-full w-full" iconClassName="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-[13.5px] font-semibold text-cocoa">{c.name}</p>
              <p className="text-[11.5px] text-cocoa-soft">{c.count} products</p>
            </div>
            <button
              onClick={() => openEdit(c)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-cocoa-soft hover:bg-cocoa/[0.05]"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => remove(c.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-cocoa-soft hover:bg-rose/[0.08] hover:text-rose-deep"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit category" : "Add category"}>
        <form onSubmit={save} className="space-y-4">
          <div className="flex h-16 items-center gap-3 rounded-2xl bg-cream/60 px-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-peach-tint">
              <Tag className="h-4 w-4 text-honey-deep" />
            </span>
            <p className="text-[12.5px] text-cocoa-soft">
              New categories appear on the storefront immediately and can be assigned to
              products from the product form.
            </p>
          </div>
          <div>
            <label className="text-[12px] font-semibold text-cocoa-soft">Category name</label>
            <input
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cookie Boxes"
              className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
            />
          </div>
          <Button type="submit" variant="primary" size="lg" className="w-full">
            {editing ? "Save changes" : "Add category"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
