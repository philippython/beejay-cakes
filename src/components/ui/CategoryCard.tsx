import Link from "next/link";
import { Category } from "@/lib/types";
import { ProductMedia } from "./ProductMedia";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex shrink-0 flex-col items-center gap-2.5"
    >
      <div className="relative h-20 w-20 overflow-hidden rounded-full ring-1 ring-cocoa/[0.06] transition-transform duration-200 group-active:scale-95 sm:h-24 sm:w-24">
        <ProductMedia tag={category.image} className="h-full w-full" iconClassName="h-8 w-8 sm:h-9 sm:w-9" />
      </div>
      <div className="text-center">
        <p className="max-w-[92px] text-[13px] font-semibold leading-tight text-cocoa">
          {category.name}
        </p>
      </div>
    </Link>
  );
}
