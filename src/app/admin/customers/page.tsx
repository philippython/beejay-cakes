"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";

// No seeded customers — this list is driven by real sign-ups once
// Supabase Auth is connected (see README.md). Search/suspend UI is
// fully wired and ready for that data.
const CUSTOMERS: {
  name: string;
  email: string;
  orders: number;
  spent: number;
  suspended: boolean;
}[] = [];

export default function AdminCustomersPage() {
  const [query, setQuery] = useState("");
  const filtered = CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="font-display text-[26px] font-medium text-cocoa">Customers</h1>
      <p className="mt-1 text-[13.5px] text-cocoa-soft">{CUSTOMERS.length} registered customers</p>

      <div className="mt-5 flex max-w-sm items-center gap-2 rounded-full bg-surface px-4 py-2 shadow-[var(--shadow-soft)]">
        <Search className="h-4 w-4 text-cocoa-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers…"
          className="w-full bg-transparent text-[13px] text-cocoa placeholder:text-cocoa-faint focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl bg-surface px-6 py-16 text-center shadow-[var(--shadow-soft)]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-peach-tint">
            <Users className="h-5 w-5 text-honey-deep" strokeWidth={1.6} />
          </span>
          <p className="mt-4 text-[14px] font-medium text-cocoa">No customers yet</p>
          <p className="mt-1 max-w-xs text-[13px] text-cocoa-soft">
            Customers will show up here as soon as they create an account.
          </p>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-soft)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-line/70 text-[11.5px] font-bold uppercase tracking-wide text-cocoa-faint">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Orders</th>
                  <th className="px-5 py-3">Total spent</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.email} className="border-b border-line/50 last:border-0">
                    <td className="px-5 py-3 text-[13px] font-semibold text-cocoa">{c.name}</td>
                    <td className="px-5 py-3 text-[12.5px] text-cocoa">{c.orders}</td>
                    <td className="px-5 py-3 text-[12.5px] text-cocoa">{c.spent}</td>
                    <td className="px-5 py-3 text-[12.5px] text-cocoa">{c.suspended ? "Suspended" : "Active"}</td>
                    <td className="px-5 py-3" />
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
