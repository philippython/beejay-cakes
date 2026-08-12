"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, SearchX } from "lucide-react";
import { products } from "@/lib/mock-data";
import { ProductCard } from "@/components/ui/ProductCard";

function SearchResults() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.category, ...p.flavours].some((field) => field.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8">
      <div className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-4 shadow-[var(--shadow-soft)] focus-within:shadow-[var(--shadow-lift)]">
        <SearchIcon className="h-[18px] w-[18px] shrink-0 text-cocoa-faint" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cakes, flavours, occasions…"
          className="h-11 w-full bg-transparent text-[14.5px] text-cocoa placeholder:text-cocoa-faint focus:outline-none"
        />
      </div>

      <p className="mt-5 text-[13px] font-semibold text-cocoa-soft">
        {results.length} result{results.length !== 1 ? "s" : ""} {query && `for "${query}"`}
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} className="w-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <SearchX className="h-8 w-8 text-cocoa-faint" strokeWidth={1.5} />
          <p className="mt-3 text-[14px] font-medium text-cocoa">Nothing matched that search</p>
          <p className="mt-1 text-[13px] text-cocoa-soft">Try a cake name, flavour or occasion.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
