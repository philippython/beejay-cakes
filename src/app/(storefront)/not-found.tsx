import Link from "next/link";
import { Cake } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/home/SearchBar";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center px-6 py-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-peach-tint">
        <Cake className="h-9 w-9 text-honey-deep" strokeWidth={1.5} />
      </span>
      <p className="mt-6 font-display text-[56px] font-medium leading-none text-cocoa">404</p>
      <h1 className="mt-3 font-display text-[22px] font-medium text-cocoa">
        This page fell off the tray
      </h1>
      <p className="mt-1.5 text-[14px] leading-relaxed text-cocoa-soft">
        We couldn&apos;t find what you&apos;re looking for. It may have been moved, or the link
        might not be quite right.
      </p>

      <div className="mt-6 w-full">
        <SearchBar />
      </div>

      <Link href="/">
        <Button className="mt-5">Back to home</Button>
      </Link>
    </div>
  );
}
