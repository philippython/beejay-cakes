"use client";

import { useEffect, useState } from "react";
import { Search, Users, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCustomersAdmin, type AdminCustomer } from "@/lib/data/admin-customers";
import { formatPrice } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getCustomersAdmin(supabase).then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="font-display text-[26px] font-medium text-cocoa">Customers</h1>
      <p className="mt-1 text-[13.5px] text-cocoa-soft">{customers.length} customers</p>

      <div className="mt-5 flex max-w-sm items-center gap-2 rounded-full bg-surface px-4 py-2 shadow-[var(--shadow-soft)]">
        <Search className="h-4 w-4 text-cocoa-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers…"
          className="w-full bg-transparent text-[13px] text-cocoa placeholder:text-cocoa-faint focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-cocoa-faint" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl bg-surface px-6 py-16 text-center shadow-[var(--shadow-soft)]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-peach-tint">
            <Users className="h-5 w-5 text-honey-deep" strokeWidth={1.6} />
          </span>
          <p className="mt-4 text-[14px] font-medium text-cocoa">No customers yet</p>
          <p className="mt-1 max-w-xs text-[13px] text-cocoa-soft">
            Customers will show up here as soon as they place an order.
          </p>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-soft)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-line/70 text-[11.5px] font-bold uppercase tracking-wide text-cocoa-faint">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Orders</th>
                  <th className="px-5 py-3">Total spent</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.email} className="border-b border-line/50 last:border-0">
                    <td className="px-5 py-3">
                      <p className="text-[13px] font-semibold text-cocoa">{c.name}</p>
                      <p className="text-[12px] text-cocoa-soft">{c.email}</p>
                    </td>
                    <td className="px-5 py-3 text-[12.5px] text-cocoa">{c.orders}</td>
                    <td className="px-5 py-3 text-[12.5px] font-semibold tabular-nums text-cocoa">
                      {formatPrice(c.spent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
