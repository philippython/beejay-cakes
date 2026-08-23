import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProductBySlug, getProductReviews, getProductsByCategorySlug } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { Gallery } from "@/components/product/Gallery";
import { ProductOptions } from "@/components/product/ProductOptions";
import { Reviews } from "@/components/product/Reviews";
import { SimilarProducts } from "@/components/product/SimilarProducts";
import { RatingStars } from "@/components/ui/RatingStars";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const product = await getProductBySlug(supabase, slug);
  if (!product) notFound();

  const categorySlug = product.category.toLowerCase().replace(/\s+/g, "-");
  const [reviews, categoryProducts] = await Promise.all([
    getProductReviews(supabase, product.id),
    getProductsByCategorySlug(supabase, categorySlug),
  ]);

  const similar = categoryProducts.filter((p) => p.id !== product.id);
  const rating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="pb-28 sm:pb-16">
      {/* Breadcrumb - desktop only */}
      <div className="mx-auto hidden max-w-6xl items-center gap-1.5 px-8 pt-6 text-[12.5px] text-cocoa-soft sm:flex">
        <Link href="/" className="hover:text-cocoa">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/category/${categorySlug}`} className="hover:text-cocoa">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-cocoa">{product.name}</span>
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-4 sm:px-8 sm:pt-6 md:grid md:grid-cols-2 md:gap-12">
        {/* Gallery */}
        <div className="md:sticky md:top-24 md:self-start">
          <Gallery images={product.images} productName={product.name} />
        </div>

        {/* Details */}
        <div className="mt-6 md:mt-0">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-cocoa-faint">
            {product.category}
          </p>
          <h1 className="mt-1 font-display text-[26px] font-medium leading-tight text-cocoa sm:text-[30px]">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2">
            {reviews.length > 0 ? (
              <RatingStars rating={rating} showValue reviewCount={reviews.length} />
            ) : (
              <span className="text-[13px] text-cocoa-soft">No reviews yet</span>
            )}
            {product.badge && <Badge kind={product.badge}>{product.badge}</Badge>}
          </div>

          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="font-display text-[26px] font-medium tabular-nums text-cocoa">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[15px] tabular-nums text-cocoa-faint line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="mt-4 text-[14.5px] leading-relaxed text-cocoa-soft">{product.description}</p>

          <div className="mt-7 border-t border-line/70 pt-6">
            <ProductOptions product={product} />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-6xl space-y-14 px-5 sm:px-8">
        <Reviews reviews={reviews} />
        <SimilarProducts products={similar} />
      </div>
    </div>
  );
}
