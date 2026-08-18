import { ChefHat } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { CategoryRail } from "@/components/home/CategoryRail";
import { ProductRail } from "@/components/home/ProductRail";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { createClient } from "@/lib/supabase/server";
import { getCategories, getFeaturedProducts, getProducts } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const [categories, products, featured] = await Promise.all([
    getCategories(supabase),
    getProducts(supabase),
    getFeaturedProducts(supabase),
  ]);

  const bestSellers = products.filter((p) => p.badge === "Best Seller");
  const newArrivals = products.filter((p) => p.badge === "New");

  return (
    <>
      <Hero />
      <CategoryRail categories={categories} />

      {products.length === 0 ? (
        <section className="mx-5 mt-10 flex flex-col items-center rounded-[22px] bg-surface px-6 py-14 text-center shadow-[var(--shadow-soft)] sm:mx-8 sm:mt-14">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-peach-tint">
            <ChefHat className="h-6 w-6 text-honey-deep" strokeWidth={1.6} />
          </span>
          <p className="mt-4 font-display text-[19px] font-medium text-cocoa">
            Our menu is being freshly prepared
          </p>
          <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-cocoa-soft">
            Cakes, pastries and treat boxes will appear here as soon as they&apos;re added in the
            admin panel.
          </p>
        </section>
      ) : (
        <>
          <ProductRail eyebrow="Handpicked" title="Featured cakes" href="/search?f=featured" products={featured} />
          <ProductRail eyebrow="Crowd favourites" title="Popular treats" href="/search" products={products.slice(0, 5)} />
          <ProductRail eyebrow="Top rated" title="Best sellers" href="/search?f=best-sellers" products={bestSellers} />
          <ProductRail eyebrow="Just in" title="New arrivals" href="/search?f=new" products={newArrivals} />
        </>
      )}

      <WhyChooseUs />
      <Testimonials />
    </>
  );
}
