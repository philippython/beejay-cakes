"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`flex items-center gap-2 rounded-full bg-white p-1.5 pl-4 shadow-[var(--shadow-soft)] transition-shadow focus-within:shadow-[var(--shadow-lift)] ${className ?? ""}`}
    >
      <Search className="h-[18px] w-[18px] shrink-0 text-cocoa-faint" strokeWidth={2} />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        placeholder="Search cakes, flavours, occasions…"
        className="h-11 w-full min-w-0 bg-transparent text-[14.5px] text-cocoa placeholder:text-cocoa-faint focus:outline-none"
      />
      <button
        type="button"
        aria-label="Filters"
        className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-cocoa-soft transition-colors hover:bg-cocoa/5 sm:flex"
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
      </button>
      <button
        type="submit"
        className="flex h-11 shrink-0 items-center justify-center rounded-full bg-cocoa px-5 text-[13.5px] font-semibold text-cream transition-transform active:scale-95"
      >
        Search
      </button>
    </form>
  );
}
