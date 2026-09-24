import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Package, Edit, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VendorProductsPage() {
  const [products, vendor] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.vendor.findFirst(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-zinc-900">
            Catalog & Inventory Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage your freshly baked cakes, floral bouquets, variants, and stock status.
          </p>
        </div>

        <Link href="/vendor/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Starting Price</th>
                <th className="py-3.5 px-4">Variants & Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Storefront</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/60 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0] || ""}
                        alt={p.title}
                        className="h-12 w-12 rounded-lg object-cover bg-zinc-100 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-zinc-900">{p.title}</div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          Prep: {p.prepTimeMinutes} mins
                          {p.isEgglessAvailable ? " • 🌱 Eggless" : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="rounded bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-800">
                      {p.category.name}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-900">
                    {formatINR(p.basePrice)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {p.variants.map((v) => (
                        <div key={v.id} className="text-[11px] text-zinc-600 flex items-center gap-1.5">
                          <span>{v.name}:</span>
                          <strong className="text-zinc-900">{formatINR(v.price)}</strong>
                          <span className="text-[10px] text-zinc-400">({v.stock} in stock)</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {p.isApproved ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                        In Review
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/product/${p.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
                    >
                      <span>View</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
