import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ShieldCheck, ArrowLeft, Store, Sparkles, UserCheck, Globe } from "lucide-react";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "OPERATIONS")) {
    redirect("/admin/login");
  }

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

          <div className="flex items-center gap-3 text-xs">
            {/* Active Admin Identity Badge */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/80 px-3 py-1 text-zinc-300">
              <UserCheck className="h-3.5 w-3.5 text-rose-400" />
              <span className="font-semibold text-white">{session.name}</span>
              <span className="text-[10px] font-mono uppercase bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded">
                {session.role}
              </span>
            </div>

            <Link
              href="/admin/seo"
              className="flex items-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-950/40 px-3 py-1.5 text-blue-300 hover:bg-blue-900/50 transition font-semibold"
            >
              <Globe className="h-3.5 w-3.5 text-blue-400" />
              <span>SEO Pages</span>
            </Link>

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

            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
