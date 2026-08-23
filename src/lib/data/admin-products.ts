import { supabase } from "@/lib/supabase/client";

export type AdminProductInput = {
  name: string;
  categoryId: string | null;
  price: number;
  compareAtPrice?: number;
  stock: number;
  flavours: string[];
  sizes: { label: string; priceModifier: number }[];
  addOns: { label: string; price: number }[];
  images: string[];
  featured: boolean;
  enabled: boolean;
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(input: AdminProductInput) {
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      slug: `${slugify(input.name)}-${Math.random().toString(36).slice(2, 6)}`,
      description: "",
      category_id: input.categoryId,
      price: input.price,
      compare_at_price: input.compareAtPrice ?? null,
      stock: input.stock,
      is_featured: input.featured,
      is_active: input.enabled,
    })
    .select()
    .single();

  if (error || !product) throw error ?? new Error("Failed to create product");

  await writeRelations(product.id, input);
  return product;
}

export async function updateProduct(id: string, input: AdminProductInput) {
  const { error } = await supabase
    .from("products")
    .update({
      name: input.name,
      category_id: input.categoryId,
      price: input.price,
      compare_at_price: input.compareAtPrice ?? null,
      stock: input.stock,
      is_featured: input.featured,
      is_active: input.enabled,
    })
    .eq("id", id);

  if (error) throw error;

  // Simplest correct approach: replace sizes/flavours/addons/images wholesale on every save.
  await supabase.from("product_sizes").delete().eq("product_id", id);
  await supabase.from("product_flavours").delete().eq("product_id", id);
  await supabase.from("product_addons").delete().eq("product_id", id);
  await supabase.from("product_images").delete().eq("product_id", id);
  await writeRelations(id, input);
}

async function writeRelations(productId: string, input: AdminProductInput) {
  if (input.sizes.length) {
    await supabase
      .from("product_sizes")
      .insert(input.sizes.map((s) => ({ product_id: productId, label: s.label, price_modifier: s.priceModifier })));
  }
  if (input.flavours.length) {
    await supabase
      .from("product_flavours")
      .insert(input.flavours.map((name) => ({ product_id: productId, name })));
  }
  if (input.addOns.length) {
    await supabase
      .from("product_addons")
      .insert(input.addOns.map((a) => ({ product_id: productId, label: a.label, price: a.price })));
  }
  if (input.images.length) {
    await supabase
      .from("product_images")
      .insert(input.images.map((url, i) => ({ product_id: productId, url, sort_order: i })));
  }
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function setProductField(id: string, field: "is_featured" | "is_active", value: boolean) {
  const patch = field === "is_featured" ? { is_featured: value } : { is_active: value };
  const { error } = await supabase.from("products").update(patch).eq("id", id);
  if (error) throw error;
}
