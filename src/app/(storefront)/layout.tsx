import type { Metadata, Viewport } from "next";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-cream text-cocoa antialiased">
        <Header />
        <MobileTopBar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
