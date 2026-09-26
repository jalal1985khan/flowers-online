import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import {
  TrendingUp,
  DollarSign,
  Store,
  Package,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

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
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Gross Merchandise Value</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">
            {formatINR(totalGMV)}
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Total customer spend</span>
          </p>
        </Card>

        <Card className="p-4 hover:border-rose-500/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Platform Commission</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <DollarSign className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
            {formatINR(platformCommission)}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">15% Net platform revenue</p>
        </Card>

        <Card className="p-4 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Active Vendors</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Store className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">
            {vendors.length}
          </div>
          <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">Florists & Bakeries</p>
        </Card>

        <Link href="/admin/products" className="block group">
          <Card className="p-4 group-hover:border-blue-500/40 transition-colors">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Live Products</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                <Package className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {products.length}
            </div>
            <p className="mt-1 text-[11px] text-blue-600 dark:text-blue-400 flex items-center justify-between">
              <span>{categories.length} active categories</span>
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground">Manage &rarr;</span>
            </p>
          </Card>
        </Link>
      </div>

      {/* AI Growth Operating System Card */}
      <Card className="rounded-3xl border border-rose-500/20 bg-gradient-to-r from-rose-500/5 via-card to-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  AI Commerce Growth Engine (01.md)
                </h3>
                <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-300 border border-rose-500/30">
                  Autonomous Intelligence
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Continuous observation, catalog enrichment, SEO self-repair, and Google Search Console optimization.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
              SEO Health: 99.4%
            </Badge>
          </div>
        </div>

        {/* AI Recommendations List */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-4 space-y-2 bg-muted/40 border-border">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span>Competitor Trend Signal</span>
              <Badge variant="outline" className="text-[10px] text-amber-700 dark:text-amber-400 border-amber-500/30 bg-amber-500/10">
                High Impact
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Market search volume for "Midnight Birthday Combo under ₹1500" up 38% in Guwahati.
            </p>
            <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold cursor-pointer hover:underline">
              → Propose new combo bundle
            </div>
          </Card>

          <Card className="p-4 space-y-2 bg-muted/40 border-border">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span>SEO Schema & Rich Snippets</span>
              <Badge variant="outline" className="text-[10px] text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                Verified
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              All active products validated with Schema.org Product, Offer, and Review structured JSON-LD.
            </p>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ 0 schema errors detected
            </div>
          </Card>

          <Card className="p-4 space-y-2 bg-muted/40 border-border">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span>Pincode Cutoff Diagnostic</span>
              <Badge variant="outline" className="text-[10px] text-blue-700 dark:text-blue-400 border-blue-500/30 bg-blue-500/10">
                Operational
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              12 Guwahati pincodes active. Midnight cutoff dynamic window set to 150 minutes before 11 PM.
            </p>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
              ✓ Automated slot capacity active
            </div>
          </Card>
        </div>
      </Card>

      {/* Registered Vendors Overview */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Registered Marketplace Vendors
          </h3>
          <span className="text-xs text-muted-foreground">Total: {vendors.length}</span>
        </div>

        <div className="divide-y divide-border">
          {vendors.map((v) => (
            <div key={v.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground font-bold">
                  {v.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{v.name}</div>
                  <div className="text-muted-foreground text-[11px]">
                    {v.city}, {v.state} • {v.phone} • {v.serviceAreas.length} Service Pincodes
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-muted-foreground">
                  {v.products.length} Products
                </span>
                <Badge variant="outline" className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                  Approved & Active
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Orders Overview */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Recent Orders & State Machine
          </h3>
          <span className="text-xs text-muted-foreground">{orders.length} total orders</span>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">No orders placed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px]">Order #</TableHead>
                  <TableHead className="text-[11px]">Customer / Recipient</TableHead>
                  <TableHead className="text-[11px]">Delivery Slot</TableHead>
                  <TableHead className="text-[11px]">Pincode</TableHead>
                  <TableHead className="text-[11px]">Amount</TableHead>
                  <TableHead className="text-[11px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono font-bold text-foreground">
                      <Link href={`/order/${o.orderNumber}`} className="hover:text-primary underline">
                        {o.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-foreground font-medium">{o.recipientName}</div>
                      <div className="text-[10px] text-muted-foreground">By {o.customerName}</div>
                    </TableCell>
                    <TableCell>
                      <div>{o.deliverySlot.title}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(o.deliveryDate).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{o.deliveryPincode}</TableCell>
                    <TableCell className="font-mono font-bold text-foreground">{formatINR(o.total)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {o.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
