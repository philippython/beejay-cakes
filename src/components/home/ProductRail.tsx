import { Product } from "@/lib/types";
import { ProductCard } from "../ui/ProductCard";
import { SectionHeader } from "../ui/SectionHeader";

export function ProductRail({
  eyebrow,
  title,
  href,
  products,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  products: Product[];
}) {
  return (
    <section className="pt-10 sm:pt-14">
      <SectionHeader eyebrow={eyebrow} title={title} href={href} />
      <div className="no-scrollbar flex gap-4 overflow-x-auto px-5 pb-2 sm:px-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} className="w-[64vw] max-w-[240px] sm:w-[240px]" />
        ))}
      </div>
    </section>
  );
}
