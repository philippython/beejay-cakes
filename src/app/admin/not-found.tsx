import Link from "next/link";
import { FolderSearch } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-peach-tint">
        <FolderSearch className="h-7 w-7 text-honey-deep" strokeWidth={1.6} />
      </span>
      <p className="mt-5 font-display text-[40px] font-medium leading-none text-cocoa">404</p>
      <h1 className="mt-3 font-display text-[19px] font-medium text-cocoa">Page not found</h1>
      <p className="mt-1.5 max-w-xs text-[13.5px] text-cocoa-soft">
        That admin page doesn&apos;t exist, or the link is out of date.
      </p>
      <Link href="/admin">
        <Button className="mt-5" size="sm">Back to dashboard</Button>
      </Link>
    </div>
  );
}
