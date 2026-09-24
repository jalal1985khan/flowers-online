import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import {
  Sparkles,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  Heart,
  CheckCircle2,
  MapPin,
  Calendar,
  Gift,
  HelpCircle,
  Truck,
  ArrowRight,
  Search,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = await prisma.seoLandingPage.findUnique({
    where: { slug },
  });

  if (!page || !page.isActive) {
    return {
      title: "Page Not Found | Bloom & Bakes",
      description: "The requested delivery page could not be found.",
    };
  }

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Bloom & Bakes";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bloomandbakes.com";
  const title = page.metaTitle || `${page.title} | ${appName}`;
  const description =
    page.metaDescription ||
    `Order ${page.title} online with fresh same-day and midnight doorstep delivery across Guwahati. 100% freshness guarantee.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${appUrl}/${page.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${appUrl}/${page.slug}`,
      siteName: appName,
      type: "website",
      locale: "en_IN",
      images: [
        {
          url:
            page.heroImage ||
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&auto=format&fit=crop&q=80",
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SeoLandingPageRoute({ params }: Props) {
  const { slug } = await params;

  const page = await prisma.seoLandingPage.findUnique({
    where: { slug },
  });

  if (!page || !page.isActive) {
    notFound();
  }

  // Query live matching products from the database
  const productFilter: any = {
    isAvailable: true,
  };

  if (page.categorySlug === "cakes") {
    productFilter.productType = "CAKES";
  } else if (page.categorySlug === "flowers") {
    productFilter.productType = "FLOWERS";
  } else if (page.categorySlug === "combos") {
    productFilter.productType = "COMBOS";
  }

  // If specific flavor/type or occasion exists
  if (page.occasionSlug) {
    productFilter.occasions = {
      some: {
        occasion: {
          slug: { contains: page.occasionSlug, mode: "insensitive" },
        },
      },
    };
  }

  let products = await prisma.product.findMany({
    where: productFilter,
    include: {
      category: true,
      variants: {
        where: { isDefault: true },
      },
    },
    take: 12,
  });

  // Fallback: If strict occasion filter yielded few products, fetch general products for this category
  if (products.length < 4) {
    products = await prisma.product.findMany({
      where: {
        isAvailable: true,
        ...(page.categorySlug === "flowers"
          ? { productType: "FLOWERS" }
          : page.categorySlug === "combos"
          ? { productType: "COMBOS" }
          : { productType: "CAKES" }),
      },
      include: {
        category: true,
        variants: {
          where: { isDefault: true },
        },
      },
      take: 12,
    });
  }

  // Fetch all 43 active landing pages for interconnected internal links cloud
  const allSeoPages = await prisma.seoLandingPage.findMany({
    where: { isActive: true },
    select: { slug: true, title: true },
    orderBy: { title: "asc" },
  });

  const faqs = (page.faqs as any[]) || [];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bloomandbakes.com";
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Bloom & Bakes";

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": appUrl,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Guwahati",
            "item": `${appUrl}/city/guwahati`,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": page.title,
            "item": `${appUrl}/${page.slug}`,
          },
        ],
      },
      {
        "@type": "LocalBusiness",
        "name": `${appName} – ${page.title}`,
        "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
        "telephone": "+91-9876543210",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "G S Road, Dispur",
          "addressLocality": "Guwahati",
          "addressRegion": "Assam",
          "postalCode": "781005",
          "addressCountry": "IN",
        },
        "priceRange": "₹₹",
        "servesCuisine": "Artisanal Cakes, Fresh Flowers, Gourmet Pastries",
        "areaServed": "Guwahati, Assam",
      },
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              "mainEntity": faqs.map((faq) => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.a,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-zinc-50 pb-16">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-zinc-200/80 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Link href="/" className="hover:text-rose-600 transition">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-zinc-400" />
              <Link href="/city/guwahati" className="hover:text-rose-600 transition">
                Guwahati
              </Link>
              <ChevronRight className="h-3 w-3 text-zinc-400" />
              <span className="font-semibold text-zinc-800 truncate max-w-xs sm:max-w-md">
                {page.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-rose-100 bg-linear-to-b from-rose-50/70 via-white to-zinc-50 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              {/* Delivery Highlight Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3.5 py-1 text-xs font-semibold text-rose-700 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-rose-600" />
                <span>{page.badgeText || "Same-Day & Midnight Delivery across Guwahati"}</span>
              </div>

              {/* Keyword-Optimized H1 */}
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
                {page.heading || page.title}
              </h1>

              {/* Subheading Narrative */}
              {page.subheading && (
                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                  {page.subheading}
                </p>
              )}

              {/* Quick Action CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={
                    page.categorySlug === "flowers"
                      ? "/catalog?category=flowers"
                      : page.categorySlug === "combos"
                      ? "/catalog?category=combos"
                      : "/catalog?category=cakes"
                  }
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <span>Order Now for Today</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/city/guwahati"
                  className="rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold px-4 py-2.5 text-xs shadow-2xs transition flex items-center gap-1.5"
                >
                  <Clock className="h-3.5 w-3.5 text-rose-600" />
                  <span>Midnight Slot (11 PM - 12 AM)</span>
                </Link>
              </div>

              {/* 4 Trust Guarantee Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-rose-100/80">
                <div className="flex items-center gap-2 text-xs text-zinc-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">100% Freshly Baked</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-700">
                  <Truck className="h-4 w-4 text-rose-600 shrink-0" />
                  <span className="font-medium">2-Hr Express Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-700">
                  <Gift className="h-4 w-4 text-purple-600 shrink-0" />
                  <span className="font-medium">Free Candles & Card</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-700">
                  <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="font-medium">Eggless Available</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Filtered Products Catalog Section */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900">
                Popular Selections for {page.title}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Handcrafted treats available for same-day delivery in Guwahati
              </p>
            </div>
            <Link
              href={
                page.categorySlug === "flowers"
                  ? "/catalog?category=flowers"
                  : page.categorySlug === "combos"
                  ? "/catalog?category=combos"
                  : "/catalog?category=cakes"
              }
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
            >
              <span>View Full Menu</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => {
              const defaultVariant = product.variants[0];
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  title={product.title}
                  productType={product.productType}
                  basePrice={defaultVariant?.price || product.basePrice}
                  compareAtPrice={defaultVariant?.compareAtPrice || product.compareAtPrice}
                  image={
                    product.images[0] ||
                    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80"
                  }
                  categoryName={product.category.name}
                  isEgglessAvailable={product.isEgglessAvailable}
                  tags={product.tags}
                />
              );
            })}
          </div>
        </section>

        {/* Local Delivery Hubs in Guwahati */}
        <section className="border-t border-b border-zinc-200/80 bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-2">
                <MapPin className="h-4 w-4" />
                <span>Guwahati Delivery Coverage</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900">
                Delivering Across All 40+ Neighborhoods in Guwahati
              </h2>
              <p className="mt-1 text-xs text-zinc-600">
                Whether sending to a home in Beltola, a corporate office along G S Road, or a hostel near Gauhati University, our temperature-monitored riders guarantee safe, punctual doorstep delivery.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {(page.deliveryAreas && page.deliveryAreas.length > 0
                ? page.deliveryAreas
                : [
                    "Paltan Bazaar", "G S Road", "Zoo Road", "Six Mile", "Ganeshguri",
                    "Ulubari", "Beltola", "Dispur", "Christian Basti", "Rukminigaon",
                    "Hatigaon", "Bhangagarh", "Chandmari", "Silpukhuri", "Maligaon"
                  ]
              ).map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 hover:border-rose-300 hover:bg-rose-50/50 transition cursor-default"
                >
                  {area}
                </span>
              ))}
            </div>

            {/* Delivery Slots Timing Cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <span>Standard Delivery</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">9:00 AM – 9:00 PM (Slots available every 2 hours)</p>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                  <Sparkles className="h-4 w-4 text-rose-600" />
                  <span>Midnight Surprise Slot</span>
                </div>
                <p className="text-[11px] text-zinc-600 mt-1">11:00 PM – 11:59 PM (Exact strike of twelve)</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span>Express 2-Hour Delivery</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">Order before 5 PM for instant express dispatch</p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Editorial & SEO Copy Section */}
        {(page.introHtml || page.contentBody) && (
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-5 shadow-2xs">
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-3">
                About {page.title}
              </h2>
              {page.introHtml && (
                <div className="prose prose-sm max-w-none text-zinc-600 text-xs sm:text-sm leading-relaxed">
                  <p>{page.introHtml}</p>
                </div>
              )}
              {page.contentBody && (
                <div className="prose prose-sm max-w-none text-zinc-600 text-xs sm:text-sm leading-relaxed border-t border-zinc-100 pt-3">
                  <p>{page.contentBody}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Accessible FAQ Accordion Section */}
        {faqs.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-zinc-900">
                <HelpCircle className="h-5 w-5 text-rose-600" />
                <h2 className="text-base sm:text-lg font-bold">Frequently Asked Questions</h2>
              </div>
              <p className="text-xs text-zinc-500">
                Everything you need to know about ordering and delivery in Guwahati
              </p>

              <div className="space-y-3 pt-2">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 transition open:bg-rose-50/20 open:border-rose-200"
                  >
                    <summary className="flex cursor-pointer items-center justify-between text-xs sm:text-sm font-semibold text-zinc-800 list-none select-none">
                      <span>{faq.q}</span>
                      <span className="ml-2 text-zinc-400 group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-2.5 text-xs text-zinc-600 leading-relaxed border-t border-zinc-200/60 pt-2.5">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Interconnected Popular Searches Cloud (43 Links) */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <Search className="h-4 w-4 text-rose-600" />
              <h3 className="text-sm font-bold text-zinc-900">Explore More Popular Searches in Guwahati</h3>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Browse our dedicated curated categories for cakes, flowers, and surprise gifts across Guwahati.
            </p>
            <div className="flex flex-wrap gap-2">
              {allSeoPages.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    item.slug === page.slug
                      ? "border-rose-600 bg-rose-600 text-white font-bold shadow-2xs"
                      : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/50"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
