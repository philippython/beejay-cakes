import { Banknote, ShoppingBag, Users, AlertTriangle, Sparkles } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { createClient } from "@/lib/supabase/server";
import { getProducts } from "@/lib/data/products";
import { getAllOrdersAdmin } from "@/lib/data/admin-orders";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [products, orders] = await Promise.all([getProducts(supabase), getAllOrdersAdmin(supabase)]);
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-[26px] font-medium text-cocoa">Dashboard</h1>
        <p className="mt-1 text-[13.5px] text-cocoa-soft">Here&apos;s what&apos;s happening at Beejay Cakes today.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Revenue (all time)" value={formatPrice(revenue)} icon={Banknote} />
        <StatCard label="Orders" value={String(orders.length)} icon={ShoppingBag} />
        <StatCard label="Products live" value={String(products.length)} icon={Users} />
        <StatCard label="Low stock alerts" value="0" icon={AlertTriangle} />
      </div>

      {products.length === 0 && orders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-honey/40 bg-honey/[0.05] p-6">
          <p className="flex items-center gap-2 text-[14px] font-bold text-cocoa">
            <Sparkles className="h-4 w-4 text-honey-deep" /> Let&apos;s get your storefront ready
          </p>
          <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-cocoa-soft">
            You haven&apos;t added any products yet, so there&apos;s no sales data to show. Once
            you add products and start receiving orders, revenue, top sellers, recent orders and
            customer activity will all populate here automatically.
          </p>
          <Link href="/admin/products">
            <Button size="sm" className="mt-4">Add your first product</Button>
          </Link>
        </div>
      )}

      {orders.length > 0 && (
        <div className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-soft)]">
          <p className="text-[13px] font-bold text-cocoa">Recent orders</p>
          <div className="mt-4 space-y-3">
            {orders.slice(0, 8).map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold text-cocoa">#{o.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-[11px] text-cocoa-soft">{o.date}</p>
                  <p className="mt-0.5 truncate text-[11px] text-cocoa-faint">
                    {o.customerEmail ?? "No email"} · {o.customerPhone || "No phone"}
                  </p>
                </div>
                <Badge kind={o.status === "Delivered" ? "success" : "Best Seller"}>{o.status}</Badge>
                <p className="w-20 shrink-0 text-right text-[12.5px] font-semibold tabular-nums text-cocoa">
                  {formatPrice(o.total)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
