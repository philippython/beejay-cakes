import type { Metadata, Viewport } from "next";
import "../globals.css";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export const metadata: Metadata = {
  title: "Admin — Beejay Cakes",
  description: "Manage products, orders, categories, customers and reviews.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf5ec",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-cream text-cocoa antialiased">
        <AdminSidebar />
        <div className="md:pl-60">
          <AdminTopBar />
          <main className="px-5 pb-16 pt-6 sm:px-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
