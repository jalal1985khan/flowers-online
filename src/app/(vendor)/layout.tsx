import React from "react";
import Link from "next/link";
import { Store, ShoppingBag, ArrowLeft, Layers, DollarSign } from "lucide-react";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Vendor Top Bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Storefront</span>
            </Link>
            <div className="h-4 w-px bg-zinc-200" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white font-bold text-sm">
                <Store className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-zinc-900 leading-tight">
                  Vendor Partner Portal
                </h1>
                <p className="text-[10px] text-zinc-400">Fulfillment & Operations Console</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Order Stream
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
