"use client";

import { useEffect, useState } from "react";
import { Landmark, Loader2, Save, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getBankDetails, updateBankDetails, hasBankDetails, type BankDetails } from "@/lib/data/settings";
import { Button } from "@/components/ui/Button";

const EMPTY: BankDetails = { accountName: "", bankName: "", sortCode: "", accountNumber: "" };

export default function AdminSettingsPage() {
  const [details, setDetails] = useState<BankDetails>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getBankDetails(supabase).then((d) => {
      setDetails({
        accountName: d.accountName ?? "",
        bankName: d.bankName ?? "",
        sortCode: d.sortCode ?? "",
        accountNumber: d.accountNumber ?? "",
      });
      setLoading(false);
    });
  }, []);

  function set<K extends keyof BankDetails>(key: K, value: string) {
    setDetails((d) => ({ ...d, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateBankDetails(supabase, details);
      setSaved(true);
    } catch {
      alert("Couldn't save — please try again.");
    } finally {
      setSaving(false);
    }
  }

  const complete = hasBankDetails(details);

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-[26px] font-medium text-cocoa">Settings</h1>
      <p className="mt-1 text-[13.5px] text-cocoa-soft">
        Bank details shown to customers on the order-received email, so they know how to pay.
      </p>

      {loading ? (
        <div className="mt-8 flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-cocoa-faint" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="mt-6 rounded-2xl bg-surface p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-peach-tint">
              <Landmark className="h-4.5 w-4.5 text-honey-deep" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-[13.5px] font-bold text-cocoa">Bank transfer details</p>
              {!complete && (
                <p className="text-[11.5px] text-rose-deep">
                  Incomplete — customers currently just see &quot;details coming shortly&quot;
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-[12px] font-semibold text-cocoa-soft">Account name</label>
              <input
                required
                value={details.accountName ?? ""}
                onChange={(e) => set("accountName", e.target.value)}
                placeholder="Beejay Cakes Ltd"
                className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-cocoa-soft">Bank name (optional)</label>
              <input
                value={details.bankName ?? ""}
                onChange={(e) => set("bankName", e.target.value)}
                placeholder="Monzo, Starling, etc."
                className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] focus:border-honey focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-semibold text-cocoa-soft">Sort code</label>
                <input
                  required
                  value={details.sortCode ?? ""}
                  onChange={(e) => set("sortCode", e.target.value)}
                  placeholder="00-00-00"
                  className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] tabular-nums focus:border-honey focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-cocoa-soft">Account number</label>
                <input
                  required
                  value={details.accountNumber ?? ""}
                  onChange={(e) => set("accountNumber", e.target.value)}
                  placeholder="12345678"
                  className="mt-1 w-full rounded-xl border border-cocoa/12 px-3.5 py-2.5 text-[13.5px] tabular-nums focus:border-honey focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Button type="submit" disabled={saving} className="gap-1.5">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save changes
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-success">
                <CheckCircle2 className="h-4 w-4" /> Saved
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
