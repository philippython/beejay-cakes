import { Category, Order, Product } from "./types";

// Category taxonomy — structural, not "dummy" business data. Product counts
// are derived from real products once they exist (see `count` below).
export const categories: Category[] = [
  { id: "c1", name: "Birthday Cakes", slug: "birthday-cakes", image: "birthday", count: 0 },
  { id: "c2", name: "Wedding Cakes", slug: "wedding-cakes", image: "wedding", count: 0 },
  { id: "c3", name: "Cupcakes", slug: "cupcakes", image: "cupcakes", count: 0 },
  { id: "c4", name: "Pastries", slug: "pastries", image: "pastries", count: 0 },
  { id: "c5", name: "Small Chops", slug: "small-chops", image: "small-chops", count: 0 },
  { id: "c6", name: "Treat Boxes", slug: "treat-boxes", image: "treat-boxes", count: 0 },
];

// No seeded products — the storefront reads from Supabase once it's wired
// up (see README.md). Empty here means every list renders its empty state
// so nothing fake ever shows to a real visitor.
export const products: Product[] = [];

export const bestSellers = products.filter((p) => p.badge === "Best Seller");
export const newArrivals = products.filter((p) => p.badge === "New");
export const featured = products.filter((p) => p.isFeatured);

// No seeded orders either — admin and account pages render empty states
// until real orders exist.
export const orders: Order[] = [];

export const ORDER_STEPS: Order["status"][] = [
  "Confirmed",
  "Baking",
  "Ready",
  "Out for Delivery",
  "Delivered",
];
