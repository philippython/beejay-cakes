import { notFound } from "next/navigation";
import { ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import { products } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { Gallery } from "@/components/product/Gallery";
import { ProductOptions } from "@/components/product/ProductOptions";
import { Reviews } from "@/components/product/Reviews";
import { SimilarProducts } from "@/components/product/SimilarProducts";
import { RatingStars } from "@/components/ui/RatingStars";
import { Badge } from "@/components/ui/Badge";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const similar = products.filter((p) => p.category === product.category && p.id !== product.id);

  return (
    <div className="pb-28 sm:pb-16">
      {/* Breadcrumb - desktop only */}
      <div className="mx-auto hidden max-w-6xl items-center gap-1.5 px-8 pt-6 text-[12.5px] text-cocoa-soft sm:flex">
        <Link href="/" className="hover:text-cocoa">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/category/${product.category.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-cocoa">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-cocoa">{product.name}</span>
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-4 sm:px-8 sm:pt-6 md:grid md:grid-cols-2 md:gap-12">
        {/* Gallery */}
        <div className="md:sticky md:top-24 md:self-start">
          <Gallery images={product.images} />
        </div>

        {/* Details */}
        <div className="mt-6 md:mt-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-cocoa-faint">
                {product.category}
              </p>
              <h1 className="mt-1 font-display text-[26px] font-medium leading-tight text-cocoa sm:text-[30px]">
                {product.name}
              </h1>
            </div>
            <button
              aria-label="Save to wishlist"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-[var(--shadow-soft)]"
            >
              <Heart className="h-[19px] w-[19px] text-cocoa" strokeWidth={1.8} />
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <RatingStars rating={product.rating} showValue reviewCount={product.reviewCount} />
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
        <Reviews rating={product.rating} reviewCount={product.reviewCount} />
        <SimilarProducts products={similar} />
      </div>
    </div>
  );
}
