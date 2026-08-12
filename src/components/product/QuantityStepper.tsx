"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-cocoa/12 bg-white">
      <button
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-11 w-11 items-center justify-center rounded-full text-cocoa transition-colors hover:bg-cocoa/5 disabled:opacity-30"
      >
        <Minus className="h-4 w-4" strokeWidth={2.3} />
      </button>
      <span className="w-8 text-center text-[15px] font-bold tabular-nums text-cocoa">{value}</span>
      <button
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-11 w-11 items-center justify-center rounded-full text-cocoa transition-colors hover:bg-cocoa/5 disabled:opacity-30"
      >
        <Plus className="h-4 w-4" strokeWidth={2.3} />
      </button>
    </div>
  );
}
