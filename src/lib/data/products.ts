import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import type { Category, Product } from "@/lib/types";

type DbProductRow = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { name: string } | null;
  product_images: { url: string; sort_order: number }[];
  product_sizes: { id: string; label: string; price_modifier: number }[];
  product_flavours: { name: string }[];
  product_addons: { id: string; label: string; price: number }[];
};

const PRODUCT_FIELDS = `
  *,
  product_images ( url, sort_order ),
  product_sizes ( id, label, price_modifier ),
  product_flavours ( name ),
  product_addons ( id, label, price )
`;

const PRODUCT_SELECT = `${PRODUCT_FIELDS}, categories ( name )`;

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
    addOns: row.product_addons.map((a) => ({ id: a.id, label: a.label, price: Number(a.price) })),
    prepTime: row.prep_time ?? "",
    isFeatured: row.is_featured,
    stock: row.stock,
  };
}

/** Attaches real rating/reviewCount to products, computed from approved
 *  reviews. `mapProduct` alone always leaves these at 0 since ratings
 *  aren't stored on the product row — this is what makes them show up
 *  on listing cards (home, category, search) once reviews are approved. */
async function withRatings(client: SupabaseClient<Database>, products: Product[]): Promise<Product[]> {
  if (products.length === 0) return products;

  const { data } = await client
    .from("reviews")
    .select("product_id, rating")
    .eq("is_approved", true)
    .in("product_id", products.map((p) => p.id));

  const byProduct = new Map<string, number[]>();
  (data ?? []).forEach((r) => {
    const list = byProduct.get(r.product_id) ?? [];
    list.push(r.rating);
    byProduct.set(r.product_id, list);
  });

  return products.map((p) => {
    const ratings = byProduct.get(p.id);
    if (!ratings?.length) return p;
    return {
      ...p,
      rating: ratings.reduce((sum, n) => sum + n, 0) / ratings.length,
      reviewCount: ratings.length,
    };
  });
}

/** All active products (storefront). */
export async function getProducts(client: SupabaseClient<Database>): Promise<Product[]> {
  const { data, error } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Supabase query failed:", error.message, error.details ?? "");
  }
  if (error || !data) return [];
  return withRatings(client, (data as unknown as DbProductRow[]).map((r) => mapProduct(r)));
}

export async function getFeaturedProducts(client: SupabaseClient<Database>): Promise<Product[]> {
  const { data, error } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("is_featured", true);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Supabase query failed:", error.message, error.details ?? "");
  }
  if (error || !data) return [];
  return withRatings(client, (data as unknown as DbProductRow[]).map((r) => mapProduct(r)));
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
  const [product] = await withRatings(client, [mapProduct(data as unknown as DbProductRow)]);
  return product;
}

export async function getProductsByCategorySlug(
  client: SupabaseClient<Database>,
  categorySlug: string
): Promise<Product[]> {
  const { data, error } = await client
    .from("products")
    .select(`${PRODUCT_FIELDS}, categories!inner ( name, slug )`)
    .eq("is_active", true)
    .eq("categories.slug", categorySlug);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Supabase query failed:", error.message, error.details ?? "");
  }
  if (error || !data) return [];
  return withRatings(client, (data as unknown as DbProductRow[]).map((r) => mapProduct(r)));
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

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Supabase query failed:", error.message, error.details ?? "");
  }
  if (error || !data) return [];
  return withRatings(client, (data as unknown as DbProductRow[]).map((r) => mapProduct(r)));
}

/** Looks up display names for a set of user ids. `reviews.user_id` (and
 *  `orders.user_id`) only FK to `auth.users`, not `profiles` — so
 *  PostgREST can't auto-embed `profiles ( full_name )` from those tables
 *  (no relationship to walk). Fetching profiles separately and merging
 *  in JS sidesteps that instead of requiring a schema migration. */
export async function getProfileNames(
  client: SupabaseClient<Database>,
  userIds: (string | null)[]
): Promise<Map<string, string>> {
  const ids = [...new Set(userIds.filter((id): id is string => !!id))];
  const names = new Map<string, string>();
  if (ids.length === 0) return names;

  const { data } = await client.from("profiles").select("id, full_name").in("id", ids);
  (data ?? []).forEach((p) => {
    if (p.full_name) names.set(p.id, p.full_name);
  });
  return names;
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
    .select("id, rating, comment, photo_url, created_at, user_id")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Supabase query failed:", error.message, error.details ?? "");
  }
  if (error || !data) return [];

  const rows = data as unknown as {
    id: string;
    rating: number;
    comment: string;
    photo_url: string | null;
    created_at: string;
    user_id: string;
  }[];
  const names = await getProfileNames(client, rows.map((r) => r.user_id));

  return rows.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    date: new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    customerName: names.get(r.user_id) ?? "Verified customer",
    photoUrl: r.photo_url,
  }));
}

export async function getWishlist(client: SupabaseClient<Database>, userId: string): Promise<Product[]> {
  const { data, error } = await client
    .from("wishlist_items")
    .select(`products ( ${PRODUCT_SELECT} )`)
    .eq("user_id", userId);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Supabase query failed:", error.message, error.details ?? "");
  }
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

/** Finds the customer's most recent paid order that included this
 *  product — used both to gate the "write a review" form (eligibility)
 *  and to attach the review to a real order. Mirrors what the
 *  "Users create own reviews" RLS policy checks server-side, so the UI
 *  and the actual enforcement never disagree. */
export async function getEligibleOrderForReview(
  client: SupabaseClient<Database>,
  userId: string,
  productId: string
): Promise<string | null> {
  const { data, error } = await client
    .from("order_items")
    .select("order_id, orders!inner ( id, user_id, payment_confirmed, created_at )")
    .eq("product_id", productId)
    .eq("orders.user_id", userId)
    .eq("orders.payment_confirmed", true)
    .order("orders(created_at)", { ascending: false })
    .limit(1);

  if (error || !data?.length) return null;
  return (data[0] as unknown as { order_id: string }).order_id;
}

export async function getUserReviewForProduct(
  client: SupabaseClient<Database>,
  userId: string,
  productId: string
) {
  const { data } = await client
    .from("reviews")
    .select("id, rating, comment, is_approved")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();
  return data;
}

export async function submitReview(
  client: SupabaseClient<Database>,
  input: { productId: string; orderId: string; userId: string; rating: number; comment: string }
) {
  const { error } = await client.from("reviews").insert({
    product_id: input.productId,
    order_id: input.orderId,
    user_id: input.userId,
    rating: input.rating,
    comment: input.comment,
  });
  if (error) throw error;
}
