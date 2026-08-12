"use client";

import { useState } from "react";
import { Printer, XCircle, Receipt } from "lucide-react";
import { orders as seedOrders, ORDER_STEPS } from "@/lib/mock-data";
import { OrderStatus } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";

const ALL_STATUSES: OrderStatus[] = ["Pending", ...ORDER_STEPS, "Cancelled"];

export default function AdminOrdersPage() {
  const [rows, setRows] = useState(
    seedOrders.map((o) => ({ ...o, paymentConfirmed: o.status !== "Pending" }))
  );

  function setStatus(id: string, status: OrderStatus) {
    setRows((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  function confirmPayment(id: string) {
    setRows((prev) => prev.map((o) => (o.id === id ? { ...o, paymentConfirmed: true } : o)));
  }

  return (
    <div>
      <h1 className="font-display text-[26px] font-medium text-cocoa">Orders</h1>
      <p className="mt-1 text-[13.5px] text-cocoa-soft">{rows.length} orders</p>

      {rows.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl bg-surface px-6 py-16 text-center shadow-[var(--shadow-soft)]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-peach-tint">
            <Receipt className="h-5 w-5 text-honey-deep" strokeWidth={1.6} />
          </span>
          <p className="mt-4 text-[14px] font-medium text-cocoa">No orders yet</p>
          <p className="mt-1 max-w-xs text-[13px] text-cocoa-soft">
            Orders will land here the moment a customer checks out.
          </p>
        </div>
      ) : (
      <div className="mt-6 overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-soft)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left">
            <thead>
              <tr className="border-b border-line/70 text-[11.5px] font-bold uppercase tracking-wide text-cocoa-faint">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>

            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-b border-line/50 last:border-0">
                  <td className="px-5 py-3">
                    <p className="text-[13px] font-semibold text-cocoa">{o.id}</p>
                    <p className="text-[11.5px] text-cocoa-soft">{o.date}</p>
                  </td>
                  <td className="max-w-[220px] truncate px-5 py-3 text-[12.5px] text-cocoa-soft">
                    {o.items.map((i) => i.name).join(", ")}
                  </td>
                  <td className="px-5 py-3 text-[12.5px] font-semibold tabular-nums text-cocoa">
                    {formatPrice(o.total)}
                  </td>
                  <td className="px-5 py-3">
                    {o.paymentConfirmed ? (
                      <span className="rounded-full bg-success-tint px-2.5 py-1 text-[11px] font-bold text-success">
                        Confirmed
                      </span>
                    ) : (
                      <button
                        onClick={() => confirmPayment(o.id)}
                        className="rounded-full bg-honey/10 px-2.5 py-1 text-[11px] font-bold text-honey-deep hover:bg-honey/20"
                      >
                        Confirm payment
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                      className={cn(
                        "rounded-full border-0 px-3 py-1.5 text-[11.5px] font-bold outline-none",
                        o.status === "Delivered"
                          ? "bg-success-tint text-success"
                          : o.status === "Cancelled"
                          ? "bg-cocoa text-cream"
                          : "bg-honey/10 text-honey-deep"
                      )}
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        aria-label="Print invoice"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-cocoa-soft hover:bg-cocoa/[0.05]"
                        title="Print invoice"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                      <button
                        aria-label="Cancel order"
                        onClick={() => setStatus(o.id, "Cancelled")}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-cocoa-soft hover:bg-rose/[0.08] hover:text-rose-deep"
                        title="Cancel order"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </button>
                    </div>
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
