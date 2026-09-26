"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Store, Gift } from "lucide-react";

export function VendorNavTabs() {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Live Orders & Fulfillment",
      href: "/vendor",
      icon: ClipboardList,
      exact: true,
    },
    {
      label: "Store Profile & Delivery Settings",
      href: "/vendor/settings",
      icon: Store,
      exact: false,
    },
    {
      label: "My Add-on Items",
      href: "/vendor/addons",
      icon: Gift,
      exact: false,
    },
  ];

  return (
    <div className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
                isActive
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-800"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-rose-600" : "text-zinc-400"}`} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
