import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { getProfileNames } from "@/lib/data/products";

export type AdminCustomer = {
  name: string;
  email: string;
  orders: number;
  spent: number;
};

/** Built from `orders` rather than `profiles` directly — a customer
 *  only shows up here once they've actually ordered, and guest checkouts
 *  (no account, `user_id` null) are grouped by email so they still show
 *  up instead of silently vanishing from this list. */
export async function getCustomersAdmin(client: SupabaseClient<Database>): Promise<AdminCustomer[]> {
  const { data, error } = await client.from("orders").select("user_id, customer_email, total");

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Supabase query failed (getCustomersAdmin):", error.message);
  }
  if (error || !data) return [];

  const rows = data as unknown as { user_id: string | null; customer_email: string | null; total: number }[];
  const names = await getProfileNames(client, rows.map((r) => r.user_id));

  const byCustomer = new Map<string, AdminCustomer>();
  rows.forEach((r) => {
    const key = r.user_id ?? r.customer_email ?? "unknown";
    const existing = byCustomer.get(key) ?? {
      name: (r.user_id && names.get(r.user_id)) || r.customer_email || "Guest",
      email: r.customer_email ?? "—",
      orders: 0,
      spent: 0,
    };
    existing.orders += 1;
    existing.spent += Number(r.total);
    byCustomer.set(key, existing);
  });

  return [...byCustomer.values()].sort((a, b) => b.spent - a.spent);
}
