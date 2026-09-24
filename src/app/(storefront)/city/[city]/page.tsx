import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { formatINR } from "@/lib/utils";
import { MapPin, Clock, ShieldCheck, Sparkles, Heart, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

interface CityPageProps {
  params: Promise<{
    city: string;
  }>;
}

const CITY_METADATA: Record<
  string,
  {
    name: string;
    headline: string;
    pincodes: string[];
    hubAddress: string;
    reviewRating: string;
  }
> = {
  bengaluru: {
    name: "Bengaluru",
    headline: "Same-Day Flower & Gourmet Cake Delivery in Bengaluru",
    pincodes: ["560001", "560038", "560034", "560068", "560100", "560066"],
    hubAddress: "Indiranagar 100ft Road, Bengaluru, Karnataka",
    reviewRating: "4.94",
  },
  delhi: {
    name: "Delhi NCR",
    headline: "Express Floral Bouquets & Midnight Cakes in Delhi NCR",
    pincodes: ["110001", "110016", "110020", "122001"],
    hubAddress: "Connaught Place / Green Park, New Delhi",
    reviewRating: "4.91",
  },
  mumbai: {
    name: "Mumbai",
    headline: "Fresh Flowers & Artisan Cake Gifting in Mumbai",
    pincodes: ["400001", "400050", "400051", "400053"],
    hubAddress: "Bandra West / Fort, Mumbai, Maharashtra",
    reviewRating: "4.92",
  },
};

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const meta = CITY_METADATA[city.toLowerCase()];
  if (!meta) return { title: "City Not Found — Bloom & Bakes" };

  return {
    title: `Online Flower & Cake Delivery in ${meta.name} | Guaranteed Midnight Delivery`,
    description: `Send fresh red roses, Belgian chocolate truffle cakes, and gift combos across ${meta.name}. Guaranteed 2-hour express and midnight delivery to ${meta.pincodes.join(", ")}.`,
  };
}

export default async function CityLandingPage({ params }: CityPageProps) {
  const { city } = await params;
  const cityKey = city.toLowerCase();
  const meta = CITY_METADATA[cityKey];

  if (!meta) {
    notFound();
  }

  const [products, vendors] = await Promise.all([
    prisma.product.findMany({
      where: { isAvailable: true, isApproved: true },
      include: { category: true, variants: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.vendor.findMany({
      where: {
        city: { contains: meta.name.split(" ")[0], mode: "insensitive" },
      },
    }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Bloom & Bakes ${meta.name}`,
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80",
    address: {
      "@type": "PostalAddress",
      addressLocality: meta.name,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "12.9716",
      longitude: "77.5946",
    },
    url: `http://localhost:3000/city/${cityKey}`,
    telephone: "+919876543210",
    priceRange: "₹₹",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: meta.reviewRating,
      reviewCount: 320,
    },
  };

  return (
    <div className="space-y-12 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-rose-100/60 via-rose-50/20 to-white py-12 sm:py-16 border-b border-rose-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-700 shadow-xs">
              <MapPin className="h-3.5 w-3.5 text-rose-600" />
              <span>Hyperlocal Gifting in {meta.name}</span>
            </div>

            <h1 className="text-3xl font-extrabold font-serif text-zinc-900 sm:text-4xl lg:text-5xl leading-tight">
              {meta.headline}
            </h1>

            <p className="text-sm text-zinc-600 leading-relaxed">
              Order fresh hand-arranged roses, chef-baked truffle cakes, and celebration hampers with guaranteed 2-hour express delivery and midnight surprises across all major {meta.name} localities.
            </p>

            {/* Pincodes covered chip list */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Active Service Pincodes:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {meta.pincodes.map((pin) => (
                  <span
                    key={pin}
                    className="rounded-md bg-white border border-rose-200 px-2 py-0.5 text-xs font-mono font-semibold text-rose-900 shadow-xs"
                  >
                    📍 {pin}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Verified Vendors */}
      {vendors.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold font-serif text-zinc-900">
              Verified Artisan Partners in {meta.name}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Local florists and craft bakeries fulfilling orders in under 90 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700 font-bold text-lg">
                    {v.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">{v.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{v.address}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      ✓ Avg Prep: {v.prepTimeMinutes} mins
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  ⭐ 4.9 Rated
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Products in this City */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold font-serif text-zinc-900">
              Top Trending Celebrations in {meta.name}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Most requested bouquets and cakes for same-day and midnight delivery.
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
          >
            View Full Catalog →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
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
      </section>

      {/* FAQ Accordion for Rich Snippet SEO */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-lg font-bold font-serif text-zinc-900 border-b border-zinc-100 pb-3">
            Frequently Asked Questions — Gifting in {meta.name}
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-zinc-50 rounded-xl space-y-1">
              <strong className="text-zinc-900 block">Can I order midnight cake delivery in {meta.name}?</strong>
              <p className="text-zinc-600">
                Yes! We guarantee midnight delivery between 11:00 PM and 11:59 PM. Please place your order at least 2.5 hours prior to the slot.
              </p>
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl space-y-1">
              <strong className="text-zinc-900 block">Are all cakes available in 100% pure vegetarian (eggless)?</strong>
              <p className="text-zinc-600">
                Absolutely. All our gourmet cakes feature an eggless toggle during product selection and are prepared in certified vegetarian baking stations.
              </p>
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl space-y-1">
              <strong className="text-zinc-900 block">Can I include a personalized message and greeting card?</strong>
              <p className="text-zinc-600">
                Yes, every floral and cake order includes a complimentary gold foil greeting card, and cakes support custom piping text up to 30 characters.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
