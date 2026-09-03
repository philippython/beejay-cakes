"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { ProductMedia } from "./ProductMedia";
import { Badge } from "./Badge";
import { RatingStars } from "./RatingStars";
import { formatPrice, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { isProductWishlisted, toggleWishlist } from "@/lib/data/products";

export function ProductCard({
  product,
  className,
  priority = false,
}: {
  product: Product;
  className?: string;
  priority?: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const discount = product.compareAtPrice
    ? Math.round(100 - (product.price / product.compareAtPrice) * 100)
    : null;

  useEffect(() => {
    let cancelled = false;
    isProductWishlisted(supabase, product.id).then((v) => {
      if (!cancelled) setSaved(v);
    });
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  async function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    const next = await toggleWishlist(supabase, product.id);
    if (next === null) {
      router.push("/login");
      return;
    }
    setSaved(next);
  }

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-[22px] bg-surface shadow-[var(--shadow-soft)] transition-shadow duration-200 hover:shadow-[var(--shadow-lift)]",
        className
      )}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] w-full">
          <ProductMedia tag={product.images[0]} alt={product.name} className="h-full w-full" iconClassName="h-12 w-12" />

          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {product.badge && <Badge kind={product.badge}>{product.badge}</Badge>}
            {discount && <Badge kind="discount">-{discount}%</Badge>}
          </div>

          <button
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            onClick={handleToggleWishlist}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform active:scale-90"
          >
            <Heart
              className={cn("h-[18px] w-[18px] transition-colors", saved ? "fill-rose text-rose" : "text-cocoa/60")}
              strokeWidth={2}
            />
          </button>
        </div>

        <div className="p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-faint">
            {product.category}
          </p>
          <h3 className="mt-0.5 truncate font-display text-[17px] font-medium leading-snug text-cocoa">
            {product.name}
          </h3>

          {product.reviewCount > 0 && (
            <div className="mt-1.5">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={12} />
            </div>
          )}

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[15px] font-bold tabular-nums text-cocoa">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[12px] tabular-nums text-cocoa-faint line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
