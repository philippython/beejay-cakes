import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

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
    .select("id, rating, comment, is_approved, created_at, products ( name ), profiles ( full_name )")
    .order("created_at", { ascending: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Supabase query failed (getAllReviewsAdmin):", error.message);
  }
  if (error || !data) return [];

  return (data as unknown as {
    id: string;
    rating: number;
    comment: string;
    is_approved: boolean;
    created_at: string;
    products: { name: string } | null;
    profiles: { full_name: string | null } | null;
  }[]).map((r) => ({
    id: r.id,
    productName: r.products?.name ?? "Unknown product",
    customerName: r.profiles?.full_name ?? "Customer",
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
