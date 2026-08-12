import { Search, Bell } from "lucide-react";

export function AdminTopBar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line/70 bg-cream/90 px-5 py-4 backdrop-blur-md sm:px-8">
      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[var(--shadow-soft)] sm:w-72">
        <Search className="h-4 w-4 text-cocoa-faint" />
        <input
          placeholder="Search orders, products, customers…"
          className="w-full bg-transparent text-[13px] text-cocoa placeholder:text-cocoa-faint focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[var(--shadow-soft)]">
          <Bell className="h-4 w-4 text-cocoa" strokeWidth={1.8} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose" />
        </button>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cocoa/[0.06] text-[12.5px] font-bold text-cocoa">
          BJ
        </span>
      </div>
    </header>
  );
}
