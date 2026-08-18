"use client";

import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Address, createAddress, deleteAddress, updateAddress } from "@/lib/data/addresses";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toggle } from "@/components/ui/Toggle";

export function AddressList({ userId, initial }: { userId: string; initial: Address[] }) {
  const [addresses, setAddresses] = useState(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [label, setLabel] = useState("");
  const [detail, setDetail] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  function openAdd() {
    setEditing(null);
    setLabel("");
    setDetail("");
    setIsDefault(addresses.length === 0);
    setModalOpen(true);
  }

  function openEdit(a: Address) {
    setEditing(a);
    setLabel(a.label);
    setDetail(a.detail);
    setIsDefault(a.isDefault);
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateAddress(supabase, userId, editing.id, { label, detail, isDefault });
        setAddresses((prev) =>
          prev.map((a) => ({
            ...a,
            isDefault: a.id === editing.id ? isDefault : isDefault ? false : a.isDefault,
            ...(a.id === editing.id ? { label, detail } : {}),
          }))
        );
      } else {
        await createAddress(supabase, userId, { label, detail, isDefault });
        setAddresses((prev) => [
          { id: crypto.randomUUID(), label, detail, isDefault },
          ...(isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev),
        ]);
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    await deleteAddress(supabase, id);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-16 pt-6 sm:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-[24px] font-medium text-cocoa">Saved addresses</h1>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={openAdd}>
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl bg-surface px-6 py-14 text-center shadow-[var(--shadow-soft)]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-peach-tint">
            <MapPin className="h-5 w-5 text-honey-deep" strokeWidth={1.6} />
          </span>
          <p className="mt-4 text-[14px] font-medium text-cocoa">No saved addresses yet</p>
          <p className="mt-1 max-w-xs text-[13px] text-cocoa-soft">
            Add one to check out faster next time.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3.5">
          {addresses.map((a) => (
            <div key={a.id} className="flex items-start gap-3.5 rounded-2xl bg-surface p-4 shadow-[var(--shadow-soft)]">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-peach-tint">
                <MapPin className="h-4 w-4 text-honey-deep" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[13.5px] font-semibold text-cocoa">{a.label}</p>
                  {a.isDefault && (
                    <span className="rounded-full bg-success-tint px-2 py-0.5 text-[10px] font-bold text-success">
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[13px] text-cocoa-soft">{a.detail}</p>
              </div>
              <button aria-label="Edit address" onClick={() => openEdit(a)} className="text-cocoa-faint hover:text-cocoa">
                <Pencil className="h-4 w-4" />
              </button>
              <button
                aria-label="Delete address"
                onClick={() => handleDelete(a.id)}
                className="text-cocoa-faint hover:text-rose-deep"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit address" : "Add address"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-cocoa-soft">Label</label>
            <input
              autoFocus
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Home, Office"
              className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-cocoa-soft">Address</label>
            <textarea
              required
              rows={2}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="House number, street, city, postcode"
              className="mt-1 w-full resize-none rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-cream/60 px-4 py-3">
            <span className="text-[13px] font-medium text-cocoa">Set as default</span>
            <Toggle checked={isDefault} onChange={setIsDefault} />
          </div>
          <Button type="submit" variant="primary" size="lg" disabled={saving} className="w-full">
            {saving ? "Saving…" : editing ? "Save changes" : "Add address"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
