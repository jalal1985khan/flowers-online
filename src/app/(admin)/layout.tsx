import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, BarChart3, Users, Store, Package, Sparkles } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Storefront</span>
            </Link>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-tight">
                  Super Admin Console
                </h1>
                <p className="text-[10px] text-zinc-400">Bloom & Bakes Marketplace Governance</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/admin/growth"
              className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-950/40 px-3 py-1.5 text-rose-300 hover:bg-rose-900/50 transition font-semibold"
            >
              <Sparkles className="h-3.5 w-3.5 text-rose-400" />
              <span>AI Growth OS</span>
            </Link>
            <Link
              href="/vendor"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800 transition"
            >
              <Store className="h-3.5 w-3.5 text-zinc-400" />
              <span>Vendor View</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
