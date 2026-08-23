// Hand-written types matching `supabase/schema.sql`. Once your Supabase
// project is linked, you can replace this with the real generated types:
//
//   npx supabase gen types typescript --project-id <your-project-ref> > src/lib/database.types.ts

export type OrderStatusDb =
  | "pending"
  | "confirmed"
  | "baking"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type ProfileRow = { id: string; role: "customer" | "admin"; full_name: string | null; created_at: string };
export type CategoryRow = { id: string; name: string; slug: string; sort_order: number };
export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category_id: string | null;
  price: number;
  compare_at_price: number | null;
  prep_time: string | null;
  badge: "Best Seller" | "New" | "Premium" | null;
  is_featured: boolean;
  is_active: boolean;
  stock: number;
  created_at: string;
};
export type ProductImageRow = { id: string; product_id: string; url: string; sort_order: number };
export type ProductSizeRow = { id: string; product_id: string; label: string; price_modifier: number };
export type ProductFlavourRow = { id: string; product_id: string; name: string };
export type ProductAddonRow = { id: string; product_id: string; label: string; price: number };
export type OrderRow = {
  id: string;
  user_id: string | null;
  status: OrderStatusDb;
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_address: string;
  phone: string;
  delivery_instructions: string | null;
  customer_email: string | null;
  payment_confirmed: boolean;
  created_at: string;
};
export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  size: string | null;
  flavour: string | null;
  unit_price: number;
  quantity: number;
};
export type ReviewRow = {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string | null;
  rating: number;
  comment: string;
  photo_url: string | null;
  is_approved: boolean;
  created_at: string;
};
export type AddressRow = { id: string; user_id: string; label: string; detail: string; is_default: boolean };
export type StoreSettingsRow = {
  id: boolean;
  bank_account_name: string | null;
  bank_name: string | null;
  bank_sort_code: string | null;
  bank_account_number: string | null;
  updated_at: string;
};
export type WishlistItemRow = { user_id: string; product_id: string };

type TableDef<Row, RequiredInsertKeys extends keyof Row> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, RequiredInsertKeys>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<ProfileRow, "id">;
      categories: TableDef<CategoryRow, "name" | "slug">;
      products: TableDef<ProductRow, "slug" | "name" | "price">;
      product_images: TableDef<ProductImageRow, "product_id" | "url">;
      product_sizes: TableDef<ProductSizeRow, "product_id" | "label">;
      product_flavours: TableDef<ProductFlavourRow, "product_id" | "name">;
      product_addons: TableDef<ProductAddonRow, "product_id" | "label">;
      orders: TableDef<OrderRow, never>;
      order_items: TableDef<OrderItemRow, "order_id" | "name" | "unit_price" | "quantity">;
      reviews: TableDef<ReviewRow, "product_id" | "user_id" | "rating" | "comment">;
      addresses: TableDef<AddressRow, "user_id" | "label" | "detail">;
      wishlist_items: TableDef<WishlistItemRow, "user_id" | "product_id">;
      store_settings: TableDef<StoreSettingsRow, never>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
