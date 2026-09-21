import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_LABELS: Record<string, OrderStatus> = {
  pending: "Pending",
  confirmed: "Confirmed",
  baking: "Baking",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export async function getOrders(client: SupabaseClient<Database>, userId: string): Promise<Order[]> {
  const { data, error } = await client
    .from("orders")
    .select(
      "id, status, total, created_at, order_items ( name, quantity, products ( slug, product_images ( url, sort_order ) ) )"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as unknown as {
    id: string;
    status: string;
    total: number;
    created_at: string;
    order_items: {
      name: string;
      quantity: number;
      products: { slug: string; product_images: { url: string; sort_order: number }[] } | null;
    }[];
  }[]).map((o) => ({
    id: o.id.slice(0, 8).toUpperCase(),
    date: new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    status: STATUS_LABELS[o.status] ?? "Pending",
    items: o.order_items.map((i) => {
      const image = [...(i.products?.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0]?.url;
      return {
        name: i.name,
        quantity: i.quantity,
        image: image ?? "birthday",
        productSlug: i.products?.slug ?? null,
      };
    }),
    total: Number(o.total),
  }));
}
