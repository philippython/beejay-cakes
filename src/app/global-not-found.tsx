import "./globals.css";
import Link from "next/link";
import { Cake } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalNotFound() {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col items-center justify-center bg-cream px-6 text-center text-cocoa antialiased">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-peach-tint">
          <Cake className="h-9 w-9 text-honey-deep" strokeWidth={1.5} />
        </span>
        <p className="mt-6 font-display text-[56px] font-medium leading-none text-cocoa">404</p>
        <h1 className="mt-3 font-display text-[22px] font-medium text-cocoa">
          This page fell off the tray
        </h1>
        <p className="mt-1.5 max-w-sm text-[14px] leading-relaxed text-cocoa-soft">
          We couldn&apos;t find what you&apos;re looking for.
        </p>
        <Link href="/">
          <Button className="mt-6">Back to home</Button>
        </Link>
      </body>
    </html>
  );
}
