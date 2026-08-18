import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export type Address = {
  id: string;
  label: string;
  detail: string;
  isDefault: boolean;
};

export async function getAddresses(client: SupabaseClient<Database>, userId: string): Promise<Address[]> {
  const { data, error } = await client
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false });

  if (error || !data) return [];
  return data.map((a) => ({ id: a.id, label: a.label, detail: a.detail, isDefault: a.is_default }));
}

export async function createAddress(
  client: SupabaseClient<Database>,
  userId: string,
  input: { label: string; detail: string; isDefault: boolean }
) {
  if (input.isDefault) {
    await client.from("addresses").update({ is_default: false }).eq("user_id", userId);
  }
  const { error } = await client.from("addresses").insert({
    user_id: userId,
    label: input.label,
    detail: input.detail,
    is_default: input.isDefault,
  });
  if (error) throw error;
}

export async function updateAddress(
  client: SupabaseClient<Database>,
  userId: string,
  id: string,
  input: { label: string; detail: string; isDefault: boolean }
) {
  if (input.isDefault) {
    await client.from("addresses").update({ is_default: false }).eq("user_id", userId);
  }
  const { error } = await client
    .from("addresses")
    .update({ label: input.label, detail: input.detail, is_default: input.isDefault })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteAddress(client: SupabaseClient<Database>, id: string) {
  const { error } = await client.from("addresses").delete().eq("id", id);
  if (error) throw error;
}
