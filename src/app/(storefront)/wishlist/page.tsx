import { Heart } from "lucide-react";
import { products } from "@/lib/mock-data";
import { ProductCard } from "@/components/ui/ProductCard";

export default function WishlistPage() {
  const saved = products.slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8">
      <h1 className="font-display text-[26px] font-medium text-cocoa">Favourites</h1>
      <p className="mt-1 text-[13.5px] text-cocoa-soft">{saved.length} saved products</p>

      {saved.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} className="w-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <Heart className="h-8 w-8 text-cocoa-faint" strokeWidth={1.5} />
          <p className="mt-3 text-[14px] font-medium text-cocoa">No favourites yet</p>
          <p className="mt-1 text-[13px] text-cocoa-soft">Tap the heart on any product to save it here.</p>
        </div>
      )}
    </div>
  );
}
