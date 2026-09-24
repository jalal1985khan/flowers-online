import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { Search, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const products = query
    ? await prisma.product.findMany({
        where: {
          isAvailable: true,
          isApproved: true,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { tags: { has: query } },
          ],
        },
        include: {
          category: true,
          variants: true,
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="border-b border-zinc-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider">
          <Search className="h-3.5 w-3.5" />
          <span>Search Results</span>
        </div>
        <h1 className="text-2xl font-bold font-serif text-zinc-900 sm:text-3xl mt-1">
          {query ? `Results for "${query}"` : "Search our Gifting Collection"}
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Found {products.length} {products.length === 1 ? "item" : "items"} available for same-day delivery
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-16 text-center">
          <Search className="mx-auto h-10 w-10 text-zinc-300" />
          <h3 className="mt-3 text-base font-bold text-zinc-900">
            No matching flowers or cakes found
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
            Try searching for "roses", "truffle", "red velvet", or "birthday" to explore available celebrations.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              href="/catalog?category=flowers"
              className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-100"
            >
              🌹 Fresh Flowers
            </Link>
            <Link
              href="/catalog?category=cakes"
              className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            >
              🎂 Gourmet Cakes
            </Link>
            <Link
              href="/catalog?category=combos"
              className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-800 hover:bg-purple-100"
            >
              🎁 Combos
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              slug={p.slug}
              title={p.title}
              productType={p.productType}
              basePrice={p.basePrice}
              compareAtPrice={p.compareAtPrice}
              image={p.images[0] || ""}
              categoryName={p.category.name}
              isEgglessAvailable={p.isEgglessAvailable}
              tags={p.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
}
