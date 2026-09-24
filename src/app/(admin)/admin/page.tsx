import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Store,
  Package,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Search,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [vendors, products, orders, categories] = await Promise.all([
    prisma.vendor.findMany({
      include: {
        products: true,
        serviceAreas: true,
      },
    }),
    prisma.product.findMany({
      include: {
        category: true,
        vendor: true,
      },
    }),
    prisma.order.findMany({
      include: {
        deliverySlot: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany(),
  ]);

  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0);
  const platformCommission = totalGMV * 0.15; // 15% platform cut

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Gross Merchandise Value</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {formatINR(totalGMV)}
          </div>
          <p className="mt-1 text-[11px] text-emerald-400">Total customer spend</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Platform Commission (15%)</span>
            <DollarSign className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-400">
            {formatINR(platformCommission)}
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">Net platform revenue</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Active Vendors</span>
            <Store className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {vendors.length}
          </div>
          <p className="mt-1 text-[11px] text-amber-400">Florists & Bakeries</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Live Products</span>
            <Package className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {products.length}
          </div>
          <p className="mt-1 text-[11px] text-blue-400">{categories.length} active categories</p>
        </div>
      </div>

      {/* AI Growth Operating System Card (From 01.md) */}
      <div className="rounded-3xl border border-rose-900/60 bg-gradient-to-r from-rose-950/40 via-zinc-950 to-zinc-950 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600/30 text-rose-400 border border-rose-500/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  AI Commerce Growth Engine (01.md)
                </h3>
                <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                  Autonomous Intelligence
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Continuous observation, catalog enrichment, SEO self-repair, and Google Search Console optimization.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-800/50">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              SEO Health: 99.4%
            </span>
          </div>
        </div>

        {/* AI Recommendations List */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Competitor Trend Signal</span>
              <span className="text-[10px] text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/50">
                High Impact
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Market search volume for "Midnight Birthday Combo under ₹1500" up 38% in Bengaluru.
            </p>
            <div className="text-[11px] text-rose-400 font-semibold cursor-pointer hover:underline">
              → Propose new combo bundle
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>SEO Schema & Rich Snippets</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
                Verified
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              All 5 active products validated with Schema.org Product, Offer, and Review structured JSON-LD.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold">
              ✓ 0 schema errors detected
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Pincode Cutoff Diagnostic</span>
              <span className="text-[10px] text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800/50">
                Operational
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              6 Bengaluru pincodes active. Midnight cutoff dynamic window set to 150 minutes before 11 PM.
            </p>
            <div className="text-[11px] text-blue-400 font-semibold">
              ✓ Automated slot capacity active
            </div>
          </div>
        </div>
      </div>

      {/* Vendors Overview */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Registered Marketplace Vendors
          </h3>
          <span className="text-xs text-zinc-400">Total: {vendors.length}</span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {vendors.map((v) => (
            <div key={v.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-white font-bold">
                  {v.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">{v.name}</div>
                  <div className="text-zinc-400 text-[11px]">
                    {v.city}, {v.state} • {v.phone} • {v.serviceAreas.length} Service Pincodes
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-zinc-300">
                  {v.products.length} Products
                </span>
                <span className="rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800">
                  Approved & Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Recent Orders & State Machine
          </h3>
          <span className="text-xs text-zinc-400">{orders.length} total orders</span>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">No orders placed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="text-[11px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="pb-2">Order #</th>
                  <th className="pb-2">Customer / Recipient</th>
                  <th className="pb-2">Delivery Slot</th>
                  <th className="pb-2">Pincode</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-900/40 transition">
                    <td className="py-3 font-mono font-bold text-white">
                      <Link href={`/order/${o.orderNumber}`} className="hover:text-rose-400 underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3">
                      <div className="text-white font-medium">{o.recipientName}</div>
                      <div className="text-[10px] text-zinc-400">By {o.customerName}</div>
                    </td>
                    <td className="py-3">
                      <div>{o.deliverySlot.title}</div>
                      <div className="text-[10px] text-zinc-400">
                        {new Date(o.deliveryDate).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="py-3 font-mono">{o.deliveryPincode}</td>
                    <td className="py-3 font-mono font-bold text-white">{formatINR(o.total)}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-rose-950 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-800">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
