"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Store,
  Ticket,
  Layers,
  Globe,
  Sparkles,
  LayoutDashboard,
  ShoppingBag,
  Gift,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: ShoppingBag, badge: "701" },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Vendors", href: "/admin/vendors", icon: Store },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Catalog", href: "/admin/categories", icon: Layers },
  { label: "Add-ons", href: "/admin/addons", icon: Gift },
  { label: "Media Library", href: "/admin/media", icon: FolderOpen, badge: "Cloud" },
  { label: "SEO Pages", href: "/admin/seo", icon: Globe },
  { label: "Growth OS", href: "/admin/growth", icon: Sparkles, badge: "AI" },
];

export function AdminNav({
  orientation = "vertical",
  onItemClick,
}: {
  orientation?: "vertical" | "horizontal";
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  if (orientation === "horizontal") {
    return (
      <nav className="flex items-center gap-1 bg-card p-1 rounded-xl border border-border backdrop-blur-xs">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "group relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 whitespace-nowrap",
                isActive
                  ? "bg-muted text-foreground font-semibold shadow-xs border border-border"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span>{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.5 text-[9px] font-bold text-rose-600 dark:text-rose-300 leading-none">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    );
  }

  // Vertical Sidebar Navigation (Default)
  return (
    <nav className="flex flex-col gap-1 w-full">
      <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Menu & Governance
      </div>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150",
              isActive
                ? "bg-muted text-foreground font-semibold border border-border shadow-xs"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border border-transparent"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="rounded-full bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.2 text-[9px] font-bold text-rose-600 dark:text-rose-300 leading-none">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
