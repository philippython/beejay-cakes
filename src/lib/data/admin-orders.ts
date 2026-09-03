import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, OrderStatusDb } from "@/lib/database.types";
import type { Order } from "@/lib/types";

const STATUS_LABELS: Record<OrderStatusDb, Order["status"]> = {
  pending: "Pending",
  confirmed: "Confirmed",
  baking: "Baking",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export type AdminOrder = Order & {
  paymentConfirmed: boolean;
  customerEmail: string | null;
  customerPhone: string;
  deliveryAddress: string;
};

export async function getAllOrdersAdmin(client: SupabaseClient<Database>): Promise<AdminOrder[]> {
  const { data, error } = await client
    .from("orders")
    .select(
      "id, status, total, created_at, payment_confirmed, customer_email, phone, delivery_address, order_items ( name, quantity )"
    )
    .order("created_at", { ascending: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Supabase query failed (getAllOrdersAdmin):", error.message);
  }
  if (error || !data) return [];

  return (data as unknown as {
    id: string;
    status: OrderStatusDb;
    total: number;
    created_at: string;
    payment_confirmed: boolean;
    customer_email: string | null;
    phone: string;
    delivery_address: string;
    order_items: { name: string; quantity: number }[];
  }[]).map((o) => ({
    id: o.id,
    date: new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    status: STATUS_LABELS[o.status],
    items: o.order_items.map((i) => ({ name: i.name, quantity: i.quantity, image: "birthday" })),
    total: Number(o.total),
    paymentConfirmed: o.payment_confirmed,
    customerEmail: o.customer_email,
    customerPhone: o.phone,
    deliveryAddress: o.delivery_address,
  }));
}
