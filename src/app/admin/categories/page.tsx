"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { categories as seedCategories } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { ProductMedia } from "@/components/ui/ProductMedia";

export default function AdminCategoriesPage() {
  const [items, setItems] = useState(seedCategories);
  const [dragId, setDragId] = useState<string | null>(null);

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

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[26px] font-medium text-cocoa">Categories</h1>
          <p className="mt-1 text-[13.5px] text-cocoa-soft">Drag to reorder how they appear on the storefront.</p>
        </div>
        <Button className="gap-1.5">
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
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-cocoa-soft hover:bg-cocoa/[0.05]">
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
    </div>
  );
}
