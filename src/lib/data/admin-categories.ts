import { supabase } from "@/lib/supabase/client";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategory(name: string, sortOrder: number) {
  const { error } = await supabase
    .from("categories")
    .insert({ name, slug: slugify(name), sort_order: sortOrder });
  if (error) throw error;
}

export async function updateCategory(id: string, name: string) {
  const { error } = await supabase
    .from("categories")
    .update({ name, slug: slugify(name) })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderCategories(ids: string[]) {
  await Promise.all(ids.map((id, i) => supabase.from("categories").update({ sort_order: i }).eq("id", id)));
}
