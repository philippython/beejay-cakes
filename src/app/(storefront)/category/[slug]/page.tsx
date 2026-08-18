import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories, getProductsByCategorySlug } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const [categories, items] = await Promise.all([
    getCategories(supabase),
    getProductsByCategorySlug(supabase, slug),
  ]);

  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-cocoa-faint">Category</p>
      <h1 className="mt-1 font-display text-[28px] font-medium text-cocoa">{category.name}</h1>
      <p className="mt-1 text-[13.5px] text-cocoa-soft">{items.length} products</p>

      <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} className="w-full" />
        ))}
      </div>

      {items.length === 0 && (
        <div className="py-16 text-center text-[14px] text-cocoa-soft">
          No products in this category yet — check back soon.
        </div>
      )}
    </div>
  );
}
