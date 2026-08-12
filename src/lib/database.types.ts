// Placeholder types so the Supabase client is fully typed during development.
// Once your Supabase project is linked, replace this file with the real
// generated types:
//
//   npx supabase gen types typescript --project-id <your-project-ref> > src/lib/database.types.ts
//
// The shape below mirrors the schema documented in README.md.

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          category_id: string;
          price: number;
          compare_at_price: number | null;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
      };
      categories: {
        Row: { id: string; slug: string; name: string; sort_order: number };
        Insert: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status:
            | "pending"
            | "confirmed"
            | "baking"
            | "ready"
            | "out_for_delivery"
            | "delivered"
            | "cancelled";
          total: number;
          delivery_address: string;
          phone: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          order_id: string;
          rating: number;
          comment: string;
          photo_url: string | null;
          is_approved: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
      };
    };
  };
};
