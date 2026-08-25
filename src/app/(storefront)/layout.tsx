import type { Metadata, Viewport } from "next";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { createPublicClient } from "@/lib/supabase/public";
import { getCategories } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Beejay Cakes — Cakes, Pastries & Celebration Treats in London",
  description:
    "Order handcrafted birthday cakes, wedding cakes, cupcakes, pastries, small chops and treat boxes for delivery across London.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf5ec",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetched once here (not hardcoded) so nav links never point at a
  // category slug that's been renamed or deleted in the admin panel —
  // that mismatch was exactly what caused the 404s.
  const supabase = createPublicClient();
  const categories = await getCategories(supabase);

  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-cream text-cocoa antialiased">
        <Header categories={categories} />
        <MobileTopBar />
        <main className="flex-1">{children}</main>
        <Footer categories={categories} />
        <BottomNav />
      </body>
    </html>
  );
}
