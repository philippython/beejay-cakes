import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import type { Category, Product } from "@/lib/types";

type DbProductRow = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { name: string } | null;
  product_images: { url: string; sort_order: number }[];
  product_sizes: { id: string; label: string; price_modifier: number }[];
  product_flavours: { name: string }[];
};

const PRODUCT_SELECT = `
  *,
  categories ( name ),
  product_images ( url, sort_order ),
  product_sizes ( id, label, price_modifier ),
  product_flavours ( name )
`;

// Rating/review count aren't stored as columns — they're derived from the
// reviews table. Until a product has real reviews this is always 0, which
// is correct: no fabricated ratings.
function mapProduct(row: DbProductRow, rating = 0, reviewCount = 0): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.categories?.name ?? "",
    images: [...row.product_images]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => i.url),
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    rating,
    reviewCount,
    badge: row.badge,
    description: row.description,
    flavours: row.product_flavours.map((f) => f.name),
    sizes: row.product_sizes.map((s) => ({
      id: s.id,
      label: s.label,
      priceModifier: Number(s.price_modifier),
    })),
    prepTime: row.prep_time ?? "",
    isFeatured: row.is_featured,
  };
}

/** All active products (storefront). */
export async function getProducts(client: SupabaseClient<Database>): Promise<Product[]> {
  const { data, error } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as DbProductRow[]).map((r) => mapProduct(r));
}

export async function getFeaturedProducts(client: SupabaseClient<Database>): Promise<Product[]> {
  const { data, error } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("is_featured", true);

  if (error || !data) return [];
  return (data as unknown as DbProductRow[]).map((r) => mapProduct(r));
}

export async function getProductBySlug(
  client: SupabaseClient<Database>,
  slug: string
): Promise<Product | null> {
  const { data, error } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapProduct(data as unknown as DbProductRow);
}

export async function getProductsByCategorySlug(
  client: SupabaseClient<Database>,
  categorySlug: string
): Promise<Product[]> {
  const { data, error } = await client
    .from("products")
    .select(`${PRODUCT_SELECT}, categories!inner(name, slug)`)
    .eq("is_active", true)
    .eq("categories.slug", categorySlug);

  if (error || !data) return [];
  return (data as unknown as DbProductRow[]).map((r) => mapProduct(r));
}

export async function searchProducts(
  client: SupabaseClient<Database>,
  query: string
): Promise<Product[]> {
  if (!query.trim()) return getProducts(client);

  const { data, error } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

  if (error || !data) return [];
  return (data as unknown as DbProductRow[]).map((r) => mapProduct(r));
}

export type ProductReview = {
  id: string;
  rating: number;
  comment: string;
  date: string;
  customerName: string;
  photoUrl: string | null;
};

export async function getProductReviews(
  client: SupabaseClient<Database>,
  productId: string
): Promise<ProductReview[]> {
  const { data, error } = await client
    .from("reviews")
    .select("id, rating, comment, photo_url, created_at, profiles ( full_name )")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as unknown as {
    id: string;
    rating: number;
    comment: string;
    photo_url: string | null;
    created_at: string;
    profiles: { full_name: string | null } | null;
  }[]).map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    date: new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    customerName: r.profiles?.full_name ?? "Verified customer",
    photoUrl: r.photo_url,
  }));
}

export async function getWishlist(client: SupabaseClient<Database>, userId: string): Promise<Product[]> {
  const { data, error } = await client
    .from("wishlist_items")
    .select(`products ( ${PRODUCT_SELECT} )`)
    .eq("user_id", userId);

  if (error || !data) return [];

  return (data as unknown as { products: DbProductRow }[])
    .filter((row) => row.products)
    .map((row) => mapProduct(row.products));
}

/** Adds/removes a product from the current user's wishlist. Returns the
 *  new saved state, or null if the visitor isn't logged in (caller should
 *  prompt them to log in rather than silently failing). */
export async function toggleWishlist(
  client: SupabaseClient<Database>,
  productId: string
): Promise<boolean | null> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;

  const { data: existing } = await client
    .from("wishlist_items")
    .select("product_id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await client.from("wishlist_items").delete().eq("user_id", user.id).eq("product_id", productId);
    return false;
  }

  await client.from("wishlist_items").insert({ user_id: user.id, product_id: productId });
  return true;
}

export async function isProductWishlisted(
  client: SupabaseClient<Database>,
  productId: string
): Promise<boolean> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return false;

  const { data } = await client
    .from("wishlist_items")
    .select("product_id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  return !!data;
}

export async function getCategories(client: SupabaseClient<Database>): Promise<Category[]> {
  const { data: categories, error } = await client
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !categories) return [];

  // Product counts per category, for the little "N products" labels.
  const { data: counts } = await client
    .from("products")
    .select("category_id")
    .eq("is_active", true);

  const countMap = new Map<string, number>();
  (counts ?? []).forEach((p) => {
    if (p.category_id) countMap.set(p.category_id, (countMap.get(p.category_id) ?? 0) + 1);
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.slug,
    count: countMap.get(c.id) ?? 0,
  }));
}
