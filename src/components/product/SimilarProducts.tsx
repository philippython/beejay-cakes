import { Product } from "@/lib/types";
import { ProductCard } from "../ui/ProductCard";

export function SimilarProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <div>
      <h2 className="font-display text-[22px] font-medium text-cocoa">You might also like</h2>
      <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto pb-2">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} className="w-[64vw] max-w-[220px] sm:w-[220px]" />
        ))}
      </div>
    </div>
  );
}
