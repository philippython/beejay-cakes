import { Category } from "@/lib/types";
import { CategoryCard } from "../ui/CategoryCard";
import { SectionHeader } from "../ui/SectionHeader";

export function CategoryRail({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="pt-10 sm:pt-14">
      <SectionHeader eyebrow="Browse" title="Shop by category" />
      <div className="no-scrollbar flex gap-5 overflow-x-auto px-5 pb-1 sm:px-8">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    </section>
  );
}
