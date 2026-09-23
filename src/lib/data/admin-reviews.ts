import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { getProfileNames } from "@/lib/data/products";

export type AdminReview = {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
};

export async function getAllReviewsAdmin(client: SupabaseClient<Database>): Promise<AdminReview[]> {
  const { data, error } = await client
    .from("reviews")
    .select("id, rating, comment, is_approved, created_at, user_id, products ( name )")
    .order("created_at", { ascending: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Supabase query failed (getAllReviewsAdmin):", error.message);
  }
  if (error || !data) return [];

  const rows = data as unknown as {
    id: string;
    rating: number;
    comment: string;
    is_approved: boolean;
    created_at: string;
    user_id: string;
    products: { name: string } | null;
  }[];
  const names = await getProfileNames(client, rows.map((r) => r.user_id));

  return rows.map((r) => ({
    id: r.id,
    productName: r.products?.name ?? "Unknown product",
    customerName: names.get(r.user_id) ?? "Customer",
    rating: r.rating,
    comment: r.comment,
    date: new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    isApproved: r.is_approved,
  }));
}

export async function approveReview(client: SupabaseClient<Database>, id: string) {
  const { error } = await client.from("reviews").update({ is_approved: true }).eq("id", id);
  if (error) throw error;
}

export async function deleteReviewAdmin(client: SupabaseClient<Database>, id: string) {
  const { error } = await client.from("reviews").delete().eq("id", id);
  if (error) throw error;
}
