import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { SectionHeader } from "@/components/storefront/section-header";
import { Button } from "@/components/ui/button";
import { GuwahatiSEOSection } from "@/components/storefront/guwahati-seo-section";
import { getServerDeliveryLocation } from "@/lib/delivery-location-server";
import { getProductImage } from "@/lib/product-images";
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

const OCCASION_IMAGES: Record<string, string> = {
  birthday: "/images/occasions/birthday.jpg",
  anniversary: "/images/occasions/anniversary.jpg",
  "love-and-romance": "/images/occasions/love-and-romance.jpg",
  congratulations: "/images/occasions/congratulations.jpg",
  wedding: "/images/occasions/wedding.jpg",
  "raksha-bandhan": "/images/occasions/raksha-bandhan.jpg",
  diwali: "/images/occasions/diwali.jpg",
  "new-year": "/images/occasions/new-year.jpg",
};

const CATEGORY_IMAGES: Record<string, string> = {
  flowers: "/images/categories/fresh-flowers.jpg",
  cakes: "/images/categories/gourmet-cakes.jpg",
  "bento-cakes": "/images/categories/bento-cakes.jpg",
  combos: "/images/categories/combos-hampers.jpg",
  plants: "/images/categories/live-plants.jpg",
  chocolates: "/images/categories/chocolates-sweets.jpg",
  gifts: "/images/categories/soft-toys.jpg",
  "luxury-hampers": "/images/categories/luxury-hampers.jpg",
};

export default async function HomePage() {
  const deliveryLocation = await getServerDeliveryLocation();
  const pincodeFilter = {
    vendor: {
      serviceAreas: { some: { pincode: deliveryLocation.pincode } },
    },
  };

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
      where: { isAvailable: true, isApproved: true, ...pincodeFilter },
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
        ...pincodeFilter,
      },
      include: {
        category: true,
        variants: true,
      },
      take: 6,
    }),
  ]);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft via-background to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="flex flex-col gap-6 text-left lg:col-span-7">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-200 bg-card/90 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs backdrop-blur-xs">
                <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
                <span>Flowers • Cakes • Gifts • Delivered With Love</span>
              </div>

              <h1 className="font-display text-4xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Make every moment special with fresh flowers &amp; delicious cakes.
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Send fresh flower bouquets, tasty cakes, and gift packs anywhere in Guwahati. Fast same-day and midnight surprise delivery available.
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
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Midnight (11-12 PM) slots open</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-primary" />
                  <span>Eggless options available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  <span>100% Freshness Guarantee</span>
                </div>
              </div>
            </div>

            {/* Hero Image Collage */}
            <div className="relative lg:col-span-5">
              <Link href="/catalog?category=combos" className="group block">
                <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-rose-200/60 bg-card p-3 shadow-2xl shadow-rose-200/40 transition-transform duration-300 group-hover:scale-[1.02]">
                  <div className="relative aspect-4/5 overflow-hidden rounded-2xl">
                    <Image
                      src="/images/hero-flower-cake-bundle.jpg"
                      alt="12 Dutch Red Roses and Belgian Truffle Cake Celebration Combo"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 420px"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute inset-x-4 bottom-4 text-left text-white">
                      <span className="inline-block rounded-full bg-primary/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                        Bestseller Bundle
                      </span>
                      <h3 className="mt-1 text-base font-bold">Midnight Symphony</h3>
                      <p className="text-xs text-rose-100">12 Dutch Red Roses + Belgian Truffle Cake</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions Carousel / Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Celebrate by Occasion"
          description="Curated arrangements suited for life’s sweetest moments"
          action={
            <Link
              href="/catalog"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-rose-700"
            >
              <span>All Occasions</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {occasions.map((occ) => {
            const occImage =
              occ.bannerImage || OCCASION_IMAGES[occ.slug] || "/images/occasions/birthday.jpg";
            return (
              <Link
                key={occ.id}
                href={`/catalog?occasion=${occ.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-left transition hover:border-rose-300 hover:shadow-lg"
              >
                <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl bg-primary-soft">
                  <Image
                    src={occImage}
                    alt={occ.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover object-center transition duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-sm font-bold text-foreground transition group-hover:text-primary">
                  {occ.name}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {occ.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Browse By Category"
          description="Only the finest hand-selected blooms and artisan confections"
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((cat) => {
            const catImage =
              cat.image || CATEGORY_IMAGES[cat.slug] || "/images/categories/fresh-flowers.jpg";
            return (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-border bg-card p-4 text-center transition hover:border-rose-300 hover:shadow-md"
              >
                <div className="relative mb-3 size-28 overflow-hidden rounded-full border-2 border-rose-100 bg-primary-soft shadow-inner">
                  <Image
                    src={catImage}
                    alt={cat.name}
                    fill
                    sizes="112px"
                    className="object-cover object-center transition duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-sm font-bold text-foreground transition group-hover:text-primary">
                  {cat.name}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={
            <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" />
              Handcrafted with Love
            </div>
          }
          title="Trending Celebrations"
          action={
            <Link
              href="/catalog"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-rose-700"
            >
              <span>View All ({featuredProducts.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((p, idx) => (
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
              priority={idx < 2}
            />
          ))}
        </div>
      </section>

      {/* Signature Flower + Cake Combos Section */}
      {combos.length > 0 && (
        <section className="border-y border-rose-100 bg-primary-soft/60 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow={
                <span className="inline-block w-fit rounded-full bg-rose-200/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-900">
                  Best Value Combos
                </span>
              }
              title="Bouquet & Cake Pairings"
              description="Delivered together in a presentation gift box"
              action={
                <Link
                  href="/catalog?category=combos"
                  className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-rose-700"
                >
                  <span>View All Combos</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
            />

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
                  image={getProductImage(p)}
                  categoryName={p.category.name}
                  isEgglessAvailable={p.isEgglessAvailable}
                  tags={p.tags}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guwahati SEO & Local Gifting Showcase above Footer */}
      <GuwahatiSEOSection />
    </div>
  );
}
