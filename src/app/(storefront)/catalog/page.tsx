import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { SlidersHorizontal, Sparkles, ArrowUpDown, IndianRupee, RotateCcw } from "lucide-react";
import { SectionHeader } from "@/components/storefront/section-header";
import { getServerDeliveryLocation } from "@/lib/delivery-location-server";
import {
  buildCatalogProductWhere,
  catalogOrderBy,
  catalogShouldNoIndex,
  type CatalogSearchParams,
} from "@/lib/catalog-query";
import { getProductImage } from "@/lib/product-images";
import { CatalogSortSelect } from "@/components/storefront/catalog-sort-select";

export const dynamic = "force-dynamic";

interface CatalogPageProps {
  searchParams: Promise<CatalogSearchParams>;
}

import { getBaseUrl, getSiteName, buildCanonicalUrl } from "@/lib/seo-config";

export async function generateMetadata({
  searchParams,
}: CatalogPageProps): Promise<Metadata> {
  const params = await searchParams;
  const appName = getSiteName();
  const title = params.category
    ? `${params.category.replace(/-/g, " ")} | ${appName}`
    : params.occasion
      ? `${params.occasion.replace(/-/g, " ")} Gifts | ${appName}`
      : `Catalog | ${appName}`;

  // Build clean canonical URL consolidating sort/price filter variations back to the clean category or catalog landing page
  const cleanCanonicalPath = params.category
    ? `/catalog?category=${params.category}`
    : params.occasion
      ? `/catalog?occasion=${params.occasion}`
      : "/catalog";
  const canonical = buildCanonicalUrl(cleanCanonicalPath);
  const description = `Browse handcrafted floral bouquets, artisan cakes, and celebration gifts available for delivery.`;
  const shouldNoIndex = catalogShouldNoIndex(params);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: shouldNoIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: appName,
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const { category, occasion, eggless, sort, tag, flavor, recipient, delivery, maxPrice, minPrice } = params;
  const deliveryLocation = await getServerDeliveryLocation();
  const where = buildCatalogProductWhere(params, deliveryLocation.pincode);
  const orderBy = catalogOrderBy(sort);

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

  const buildFilterUrl = (updates: Partial<Record<keyof CatalogSearchParams, string | undefined>>) => {
    const next = { ...params, ...updates };
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) {
      if (v !== undefined && v !== "" && v !== null) {
        q.set(k, v);
      }
    }
    const str = q.toString();
    return str ? `/catalog?${str}` : "/catalog";
  };

  const PRICE_PRESETS = [
    { label: "All Prices", min: undefined, max: undefined },
    { label: "Under ₹499", min: undefined, max: "499" },
    { label: "₹500 – ₹999", min: "500", max: "999" },
    { label: "₹1,000 – ₹1,999", min: "1000", max: "1999" },
    { label: "₹2,000 & Above", min: "2000", max: undefined },
  ];

  const SORT_OPTIONS = [
    { label: "Featured / Newest", value: undefined },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Name: A to Z", value: "title-asc" },
  ];

  const hasActiveFilters = Boolean(
    category || occasion || eggless || sort || maxPrice || minPrice || tag || flavor || recipient || delivery
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Banner Strip */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-rose-200/80 bg-gradient-to-r from-rose-950 via-rose-900 to-pink-950 text-white shadow-lg shadow-rose-950/10">
        <div className="absolute inset-0">
          <Image
            src="/images/catalog-hero-banner.jpg"
            alt="Boutique floral arrangements and freshly baked cakes catalog"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover opacity-35 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-950/95 via-rose-900/85 to-transparent" />
        </div>
        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1 text-xs font-semibold text-rose-100">
            <Sparkles className="h-3.5 w-3.5 text-rose-300" />
            Curated Artisanal Gifting Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif tracking-tight text-white capitalize">
            {flavor
              ? `${flavor.replace(/-/g, " ")} Cakes & Treats`
              : occasion
                ? `${occasion.replace(/-/g, " ")} Celebrations`
                : category
                  ? `${category.replace(/-/g, " ")} Collection`
                  : "Handcrafted Flowers & Oven-Fresh Cakes"}
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed max-w-xl">
            Explore our curated selection of fresh garden blooms, chef-baked celebration cakes, and heartfelt gift hampers. Hand-delivered across Guwahati with same-day and midnight slots.
          </p>
        </div>
      </div>

      {/* Header & Breadcrumb */}
      <div className="pb-2">
        <SectionHeader
          eyebrow={
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" />
              Curated Gifting Catalog
            </div>
          }
          title={
            category
              ? `${category.replace(/-/g, " ")} Collection`
              : occasion
                ? `${occasion.replace(/-/g, " ")} Celebrations`
                : "All Flowers, Cakes & Combos"
          }
          description={`Showing ${products.length} items deliverable to ${deliveryLocation.city} (${deliveryLocation.pincode})${tag ? ` • tag: ${tag}` : ""}${delivery ? ` • ${delivery} delivery` : ""}${maxPrice ? ` • up to ₹${maxPrice}` : ""}${minPrice ? ` • from ₹${minPrice}` : ""}`}
        />
      </div>

      <div className="mt-8 sm:mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
        {/* Left Sidebar Filter (Sticky on Desktop) */}
        <aside className="lg:sticky lg:top-24 lg:self-start lg:col-span-1 space-y-6 max-h-[calc(100vh-6.5rem)] overflow-y-auto pr-1">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-5">
            {/* Filter Header with Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 font-semibold text-sm text-zinc-900">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-rose-600" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <Link
                  href="/catalog"
                  className="flex items-center gap-1 text-xs font-normal text-rose-600 hover:text-rose-700 underline"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </Link>
              )}
            </div>

            {/* Sort Filter */}
            <div className="border-b border-zinc-100 pb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-rose-500" />
                Sort By
              </h4>
              <div className="space-y-1 text-xs">
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = (!sort && !opt.value) || sort === opt.value;
                  return (
                    <Link
                      key={opt.label}
                      href={buildFilterUrl({ sort: opt.value })}
                      className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg transition ${
                        isSelected
                          ? "bg-rose-50 font-bold text-rose-700"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="border-b border-zinc-100 pb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1.5">
                <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
                Price Range
              </h4>
              <div className="space-y-1 text-xs">
                {PRICE_PRESETS.map((preset) => {
                  const isSelected =
                    (preset.min === undefined && preset.max === undefined && !minPrice && !maxPrice) ||
                    (preset.min === minPrice && preset.max === maxPrice);
                  return (
                    <Link
                      key={preset.label}
                      href={buildFilterUrl({
                        minPrice: preset.min,
                        maxPrice: preset.max,
                      })}
                      className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg transition ${
                        isSelected
                          ? "bg-emerald-50 font-bold text-emerald-800"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                      }`}
                    >
                      <span>{preset.label}</span>
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Category Filter */}
            <div className="border-b border-zinc-100 pb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                Categories
              </h4>
              <div className="space-y-1 text-xs">
                <Link
                  href={buildFilterUrl({ category: undefined })}
                  className={`block py-1.5 px-2.5 rounded-lg transition ${
                    !category ? "bg-rose-50 font-bold text-rose-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  All Categories
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={buildFilterUrl({ category: c.slug })}
                    className={`block py-1.5 px-2.5 rounded-lg transition ${
                      category === c.slug
                        ? "bg-rose-50 font-bold text-rose-700"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Occasion Filter */}
            <div className="border-b border-zinc-100 pb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                Occasions
              </h4>
              <div className="space-y-1 text-xs">
                <Link
                  href={buildFilterUrl({ occasion: undefined })}
                  className={`block py-1.5 px-2.5 rounded-lg transition ${
                    !occasion ? "bg-amber-50 font-bold text-amber-800" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  All Occasions
                </Link>
                {occasions.map((o) => (
                  <Link
                    key={o.id}
                    href={buildFilterUrl({ occasion: o.slug })}
                    className={`block py-1.5 px-2.5 rounded-lg transition ${
                      occasion === o.slug
                        ? "bg-amber-50 font-bold text-amber-800"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    {o.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Diet Preference */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                Dietary
              </h4>
              <Link
                href={buildFilterUrl({
                  eggless: eggless === "true" ? undefined : "true",
                })}
                className={`inline-flex items-center justify-between rounded-xl border px-3 py-2 text-xs font-medium transition w-full ${
                  eggless === "true"
                    ? "border-emerald-500 bg-emerald-50 font-semibold text-emerald-800 shadow-2xs"
                    : "border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
                }`}
              >
                <span>🌱 100% Eggless Only</span>
                {eggless === "true" && <span className="text-emerald-700 font-bold">✓</span>}
              </Link>
            </div>
          </div>
        </aside>

        {/* Product Grid & Top Sort Bar */}
        <main className="lg:col-span-3">
          {/* Top Sort Toolbar */}
          <CatalogSortSelect currentSort={sort} totalCount={products.length} />

          {/* Active Filter Pills Bar */}
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl bg-zinc-50 p-3 border border-zinc-200/70">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Active:</span>
              {category && (
                <Link
                  href={buildFilterUrl({ category: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-white border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700 shadow-2xs hover:bg-rose-50 transition"
                >
                  <span>Category: {category}</span>
                  <span className="text-zinc-400 hover:text-rose-700">✕</span>
                </Link>
              )}
              {occasion && (
                <Link
                  href={buildFilterUrl({ occasion: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-white border border-amber-200 px-2.5 py-1 text-xs font-medium text-amber-800 shadow-2xs hover:bg-amber-50 transition"
                >
                  <span>Occasion: {occasion}</span>
                  <span className="text-zinc-400 hover:text-amber-800">✕</span>
                </Link>
              )}
              {flavor && (
                <Link
                  href={buildFilterUrl({ flavor: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-white border border-pink-200 px-2.5 py-1 text-xs font-medium text-pink-800 shadow-2xs hover:bg-pink-50 transition"
                >
                  <span>Flavor: {flavor.replace(/-/g, " ")}</span>
                  <span className="text-zinc-400 hover:text-pink-800">✕</span>
                </Link>
              )}
              {(minPrice || maxPrice) && (
                <Link
                  href={buildFilterUrl({ minPrice: undefined, maxPrice: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-white border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-800 shadow-2xs hover:bg-emerald-50 transition"
                >
                  <span>Price: {minPrice ? `₹${minPrice}` : "₹0"} – {maxPrice ? `₹${maxPrice}` : "Above"}</span>
                  <span className="text-zinc-400 hover:text-emerald-800">✕</span>
                </Link>
              )}
              {sort && (
                <Link
                  href={buildFilterUrl({ sort: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-white border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-800 shadow-2xs hover:bg-zinc-100 transition"
                >
                  <span>Sort: {sort === "price-asc" ? "Price: Low to High" : sort === "price-desc" ? "Price: High to Low" : sort === "title-asc" ? "Name: A to Z" : sort}</span>
                  <span className="text-zinc-400 hover:text-zinc-900">✕</span>
                </Link>
              )}
              {eggless === "true" && (
                <Link
                  href={buildFilterUrl({ eggless: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-white border border-emerald-300 px-2.5 py-1 text-xs font-medium text-emerald-800 shadow-2xs hover:bg-emerald-50 transition"
                >
                  <span>🌱 100% Eggless</span>
                  <span className="text-zinc-400 hover:text-emerald-800">✕</span>
                </Link>
              )}
              <Link
                href="/catalog"
                className="ml-auto text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
              >
                Clear all
              </Link>
            </div>
          )}

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center">
              <p className="text-sm font-semibold text-zinc-900">No products match your filters</p>
              <p className="text-xs text-zinc-500 mt-1">Try relaxing your price or category filters to view more items.</p>
              <Link
                href="/catalog"
                className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition"
              >
                Reset All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, idx) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  slug={p.slug}
                  title={p.title}
                  productType={p.productType}
                  basePrice={p.basePrice}
                  compareAtPrice={p.compareAtPrice}
                  image={getProductImage(p)}
                  categoryName={p.category.name}
                  isEgglessAvailable={p.isEgglessAvailable}
                  tags={p.tags}
                  priority={idx < 3}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
