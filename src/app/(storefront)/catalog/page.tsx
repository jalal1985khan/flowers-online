import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductType } from "@prisma/client";
import { SlidersHorizontal, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    occasion?: string;
    eggless?: string;
    sort?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { category, occasion, eggless, sort } = await searchParams;

  // Build where filter
  const where: any = {
    isAvailable: true,
    isApproved: true,
  };

  if (category) {
    where.category = { slug: category };
  }

  if (occasion) {
    where.occasions = {
      some: {
        occasion: {
          slug: occasion,
        },
      },
    };
  }

  if (eggless === "true") {
    where.isEgglessAvailable = true;
  }

  // Sorting
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { basePrice: "asc" };
  if (sort === "price-desc") orderBy = { basePrice: "desc" };

  const [products, categories, occasions] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: true,
      },
      orderBy,
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.occasion.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header & Breadcrumb */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5">
        <div>
          <div className="text-xs font-semibold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            Curated Gifting Catalog
          </div>
          <h1 className="text-2xl font-bold font-serif text-zinc-900 capitalize sm:text-3xl mt-1">
            {category
              ? `${category.replace("-", " ")} Collection`
              : occasion
              ? `${occasion.replace("-", " ")} Celebrations`
              : "All Flowers, Cakes & Combos"}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Showing {products.length} handpicked artisanal items ready for same-day delivery
          </p>
        </div>

        {/* Active Pill Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {category && (
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100"
            >
              Category: {category} ✕
            </Link>
          )}
          {occasion && (
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100"
            >
              Occasion: {occasion} ✕
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Left Sidebar Filter */}
        <aside className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 font-semibold text-sm text-zinc-900">
              <SlidersHorizontal className="h-4 w-4 text-rose-600" />
              <span>Filters</span>
            </div>

            {/* Category Filter */}
            <div className="py-4 border-b border-zinc-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                Categories
              </h4>
              <div className="space-y-2 text-xs">
                <Link
                  href="/catalog"
                  className={`block py-1 transition ${
                    !category ? "font-bold text-rose-600" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  All Categories
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/catalog?category=${c.slug}`}
                    className={`block py-1 transition ${
                      category === c.slug
                        ? "font-bold text-rose-600"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Occasion Filter */}
            <div className="py-4 border-b border-zinc-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                Occasions
              </h4>
              <div className="space-y-2 text-xs">
                {occasions.map((o) => (
                  <Link
                    key={o.id}
                    href={`/catalog?occasion=${o.slug}`}
                    className={`block py-1 transition ${
                      occasion === o.slug
                        ? "font-bold text-rose-600"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {o.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Diet Preference */}
            <div className="pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                Dietary
              </h4>
              <Link
                href={eggless === "true" ? "/catalog" : "/catalog?eggless=true"}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition ${
                  eggless === "true"
                    ? "border-emerald-500 bg-emerald-50 font-semibold text-emerald-800"
                    : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                🌱 100% Eggless Only
              </Link>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center">
              <p className="text-sm font-semibold text-zinc-900">No products found</p>
              <p className="text-xs text-zinc-500 mt-1">Try clearing your filters to see more blooms and bakes.</p>
              <Link
                href="/catalog"
                className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </main>
      </div>
    </div>
  );
}
