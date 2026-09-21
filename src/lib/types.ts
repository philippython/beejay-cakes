export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
};

export type ProductSize = {
  id: string;
  label: string;
  priceModifier: number;
};

export type ProductAddon = {
  id: string;
  label: string;
  price: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: "Best Seller" | "New" | "Premium" | null;
  description: string;
  flavours: string[];
  sizes: ProductSize[];
  addOns: ProductAddon[];
  prepTime: string;
  isFeatured?: boolean;
  stock: number;
};

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Baking"
  | "Ready"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  items: { name: string; quantity: number; image: string; productSlug: string | null }[];
  total: number;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatar: string;
};
