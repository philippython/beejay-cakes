import { LayoutDashboard, Package, Receipt, Tags, Users, MessageSquareText, Settings } from "lucide-react";

export const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: Receipt },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquareText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
