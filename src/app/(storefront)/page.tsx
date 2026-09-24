import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  Clock,
  Heart,
  ShieldCheck,
  Cake,
  Flower2,
  Gift,
} from "lucide-react";

export const revalidate = 60; // revalidate every minute

export default async function HomePage() {
  const [categories, occasions, featuredProducts, combos] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.occasion.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findMany({
      where: { isAvailable: true, isApproved: true },
      include: {
        category: true,
        variants: true,
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: {
        isAvailable: true,
        isApproved: true,
        productType: "COMBOS",
      },
      include: {
        category: true,
        variants: true,
      },
      take: 4,
    }),
  ]);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-100/70 via-rose-50/30 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-3 py-1 text-xs font-semibold text-rose-700 shadow-xs backdrop-blur-xs">
                <Sparkles className="h-3.5 w-3.5 text-rose-600" />
                Guaranteed Midnight & 2-Hour Delivery
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl font-serif leading-[1.15]">
                Say it with fresh blooms & artisan cakes.
              </h1>

              <p className="max-w-xl text-base text-zinc-600 sm:text-lg leading-relaxed">
                Handcrafted floral bouquets, chef-baked Belgian truffles, and celebratory hampers delivered right on time across Bengaluru, Delhi NCR, and Mumbai.
              </p>

              {/* Quick Call to Action buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/catalog?category=flowers">
                  <Button size="lg" className="gap-2 shadow-md hover:shadow-lg">
                    <Flower2 className="h-4 w-4" />
                    <span>Explore Flowers</span>
                  </Button>
                </Link>
                <Link href="/catalog?category=cakes">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Cake className="h-4 w-4" />
                    <span>Order Cakes</span>
                  </Button>
                </Link>
                <Link href="/catalog?category=combos">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Gift className="h-4 w-4" />
                    <span>View Combos</span>
                  </Button>
                </Link>
              </div>

              {/* Trust micro-bar */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-rose-600" />
                  <span>Midnight (11-12 PM) slots open</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-rose-600" />
                  <span>Eggless options available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>100% Freshness Guarantee</span>
                </div>
              </div>
            </div>

            {/* Hero Image Collage */}
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-rose-200/60 bg-white p-3 shadow-2xl shadow-rose-200/50">
                <div className="relative aspect-4/5 overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80"
                    alt="Flower and cake combination"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="inline-block rounded-full bg-rose-600/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                      Bestseller Bundle
                    </span>
                    <h3 className="mt-1 text-base font-bold">Midnight Symphony</h3>
                    <p className="text-xs text-rose-100">12 Dutch Red Roses + Belgian Truffle Cake</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions Carousel / Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl font-serif">
              Celebrate by Occasion
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Curated arrangements suited for life’s sweetest moments</p>
          </div>
          <Link
            href="/catalog"
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            <span>All Occasions</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {occasions.map((occ) => (
            <Link
              key={occ.id}
              href={`/catalog?occasion=${occ.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-rose-300 hover:shadow-lg"
            >
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-zinc-100 mb-3">
                {occ.bannerImage && (
                  <img
                    src={occ.bannerImage}
                    alt={occ.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <h3 className="text-sm font-bold text-zinc-900 group-hover:text-rose-600 transition">
                {occ.name}
              </h3>
              <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                {occ.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl font-serif">
            Browse By Category
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Only the finest hand-selected blooms and artisan confections</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.slug}`}
              className="group flex flex-col items-center rounded-2xl border border-zinc-200 bg-white p-4 text-center transition hover:border-rose-300 hover:shadow-md"
            >
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-rose-100 bg-rose-50 mb-3 shadow-inner">
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                  />
                )}
              </div>
              <h3 className="text-sm font-bold text-zinc-900 group-hover:text-rose-600 transition">
                {cat.name}
              </h3>
              <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-rose-600">
              <Sparkles className="h-3 w-3" />
              Handcrafted with Love
            </div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl font-serif">
              Trending Celebrations
            </h2>
          </div>
          <Link
            href="/catalog"
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            <span>View All ({featuredProducts.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((p) => (
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
      </section>

      {/* Signature Flower + Cake Combos Section */}
      {combos.length > 0 && (
        <section className="bg-rose-50/50 py-12 border-y border-rose-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="inline-block rounded-full bg-rose-200/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-800">
                  Best Value Combos
                </span>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl font-serif mt-1">
                  Bouquet & Cake Pairings
                </h2>
                <p className="text-xs text-zinc-500">Delivered together in a presentation gift box</p>
              </div>
              <Link
                href="/catalog?category=combos"
                className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                <span>View All Combos</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {combos.map((p) => (
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
          </div>
        </section>
      )}
    </div>
  );
}
