import { MapPin, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";

const ADDRESSES = [
  { label: "Home", detail: "24 Bakery Lane, Notting Hill, London", isDefault: true },
  { label: "Office", detail: "5th Floor, Riverside House, Canary Wharf, London", isDefault: false },
];

export default function AddressesPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pb-16 pt-6 sm:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-[24px] font-medium text-cocoa">Saved addresses</h1>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </div>

      <div className="mt-6 space-y-3.5">
        {ADDRESSES.map((a) => (
          <div key={a.label} className="flex items-start gap-3.5 rounded-2xl bg-surface p-4 shadow-[var(--shadow-soft)]">
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
            <button aria-label="Edit address" className="text-cocoa-faint hover:text-cocoa">
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
