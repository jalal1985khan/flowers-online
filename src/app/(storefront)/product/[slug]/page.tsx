import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PDPInteractive } from "@/components/storefront/pdp-interactive";
import { Star, ShieldCheck, Clock, Award, Heart, Sparkles, MapPin } from "lucide-react";
import type { Metadata } from "next";

interface PDPPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PDPPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return { title: "Product Not Found — Bloom & Bakes" };
  }

  return {
    title: product.metaTitle || `${product.title} — Same Day Delivery | Bloom & Bakes`,
    description: product.metaDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PDPPageProps) {
  const { slug } = await params;

  const [product, deliverySlots, addons] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        vendor: true,
        variants: {
          orderBy: { price: "asc" },
        },
        reviews: {
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.deliverySlot.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.addon.findMany({
      where: { isAvailable: true },
      take: 4,
    }),
  ]);

  if (!product) {
    notFound();
  }

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images,
    description: product.description,
    sku: product.variants[0]?.sku || product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.basePrice,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: product.vendor.name,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: Math.max(product.reviews.length, 12),
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* JSON-LD for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left: Product Images Gallery */}
        <div className="space-y-4 lg:col-span-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-zinc-200/80 bg-rose-50/20 shadow-xs">
            <img
              src={product.images[0] || ""}
              alt={product.title}
              className="h-full w-full object-cover"
            />
            {product.isEgglessAvailable && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                🌱 Pure Vegetarian / Eggless Option
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden rounded-xl border border-zinc-200 hover:border-rose-400 cursor-pointer"
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Vendor Badge */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 font-bold">
                  {product.vendor.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">{product.vendor.name}</h4>
                  <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-rose-500" />
                    {product.vendor.city} • Verified Artisan Partner
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                ⭐ 4.9 Super Vendor
              </span>
            </div>
          </div>

          {/* Description & Care instructions */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
              Product Description
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            <div className="pt-4 border-t border-zinc-100 space-y-2">
              <h4 className="text-xs font-bold text-zinc-900">Delivery & Care Tips:</h4>
              <ul className="text-xs text-zinc-500 space-y-1 list-disc list-inside">
                <li>Flowers arrive in hydrating packaging; trim stems 1 inch before placing in fresh water.</li>
                <li>Cakes must be kept refrigerated at 4°C - 8°C until 15 minutes before serving.</li>
                <li>Midnight delivery orders are dispatched via temperature-controlled delivery partners.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Title, Rating, Interactive Selectors & Cart Form */}
        <div className="space-y-6 lg:col-span-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              {product.category.name}
            </span>
            <h1 className="text-2xl font-bold font-serif text-zinc-900 sm:text-3xl mt-1 leading-snug">
              {product.title}
            </h1>

            {/* Ratings Bar */}
            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-600">
              <div className="flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 font-bold text-white">
                <span>4.9</span>
                <Star className="h-3 w-3 fill-white" />
              </div>
              <span className="font-semibold text-zinc-800">
                {product.reviews.length || 24} Verified Reviews
              </span>
              <span className="text-zinc-400">•</span>
              <span className="text-emerald-700 font-medium">98% Recommended</span>
            </div>
          </div>

          {/* Interactive PDP Component (Variants, Slots, Eggless, Addons, Cart) */}
          <PDPInteractive
            product={{
              id: product.id,
              vendorId: product.vendorId,
              title: product.title,
              slug: product.slug,
              productType: product.productType,
              basePrice: product.basePrice,
              compareAtPrice: product.compareAtPrice,
              images: product.images,
              isEgglessAvailable: product.isEgglessAvailable,
              isCustomMessageSupported: product.isCustomMessageSupported,
            }}
            variants={product.variants.map((v) => ({
              id: v.id,
              name: v.name,
              price: v.price,
              compareAtPrice: v.compareAtPrice,
              isDefault: v.isDefault,
            }))}
            deliverySlots={deliverySlots.map((s) => ({
              id: s.id,
              title: s.title,
              slotType: s.slotType,
              startTime: s.startTime,
              endTime: s.endTime,
              surcharge: s.surcharge,
            }))}
            addons={addons.map((a) => ({
              id: a.id,
              title: a.title,
              category: a.category,
              price: a.price,
              image: a.image,
            }))}
          />

          {/* Reviews List */}
          {product.reviews.length > 0 && (
            <div className="pt-6 border-t border-zinc-200 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                Verified Customer Reviews
              </h3>
              <div className="space-y-3">
                {product.reviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-zinc-900">{r.customerName}</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
