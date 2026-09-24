import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Store, ArrowLeft, UserCheck } from "lucide-react";
import { VendorLogoutButton } from "@/components/vendor/vendor-logout-button";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (
    !session ||
    (session.role !== "VENDOR_OWNER" &&
      session.role !== "VENDOR_STAFF" &&
      session.role !== "SUPER_ADMIN")
  ) {
    redirect("/vendor/login");
  }

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
            {/* Active Vendor Identity Badge */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-zinc-700">
              <UserCheck className="h-3.5 w-3.5 text-rose-600" />
              <span className="font-semibold text-zinc-900">{session.name}</span>
              <span className="text-[10px] font-mono uppercase bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                {session.role}
              </span>
            </div>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Order Stream
            </span>

            <VendorLogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
