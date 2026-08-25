"use client";

import { Plus, X } from "lucide-react";
import { Button } from "../ui/Button";

export function RepeatingRows<T extends { key: string }>({
  label,
  hint,
  rows,
  onChange,
  addLabel,
  makeRow,
  renderRow,
  emptyHint,
}: {
  label: string;
  hint?: string;
  rows: T[];
  onChange: (rows: T[]) => void;
  addLabel: string;
  makeRow: () => T;
  renderRow: (row: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  emptyHint?: string;
}) {
  function updateRow(key: string, patch: Partial<T>) {
    onChange(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function removeRow(key: string) {
    onChange(rows.filter((r) => r.key !== key));
  }

  return (
    <div>
      <label className="text-[12px] font-semibold text-cocoa-soft">
        {label} {hint && <span className="font-normal text-cocoa-faint">— {hint}</span>}
      </label>

      {rows.length === 0 && emptyHint && (
        <p className="mt-1.5 text-[12px] text-cocoa-faint">{emptyHint}</p>
      )}

      <div className="mt-2 space-y-2">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center gap-2">
            <div className="flex-1">{renderRow(row, (patch) => updateRow(row.key, patch))}</div>
            <button
              type="button"
              aria-label="Remove"
              onClick={() => removeRow(row.key)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cocoa-faint hover:bg-rose/[0.08] hover:text-rose-deep"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2 gap-1.5"
        onClick={() => onChange([...rows, makeRow()])}
      >
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </Button>
    </div>
  );
}
