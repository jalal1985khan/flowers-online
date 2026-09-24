import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import {
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  Heart,
  CheckCircle2,
  Phone,
  MessageCircle,
  Truck,
  Cake,
  Gift,
  HelpCircle,
  ArrowRight,
  Star,
  Search,
} from "lucide-react";
import type { Metadata } from "next";

interface CityPageProps {
  params: Promise<{
    city: string;
  }>;
}

interface CityData {
  name: string;
  state: string;
  headline: string;
  subheadline: string;
  aboutBrand: string;
  pincodes: string[];
  localities: string[];
  hubAddress: string;
  reviewRating: string;
  reviewCount: number;
  phone: string;
  faqs: { question: string; answer: string }[];
  popularSearches: { text: string; href: string }[];
}

const CITY_METADATA: Record<string, CityData> = {
  guwahati: {
    name: "Guwahati",
    state: "Assam",
    headline: "Online Flowers, Cake & Plant Delivery in Guwahati",
    subheadline: "Fresh cakes and beautiful flowers delivered the same day across Guwahati",
    aboutBrand:
      "Celebrate every special moment with Bloom & Bakes. From birthdays and anniversaries to weddings, Valentine's Day, Women's Day, and surprise celebrations — we help you send love with freshly baked cakes and hand-crafted flower bouquets.",
    pincodes: [
      "781001",
      "781003",
      "781005",
      "781006",
      "781007",
      "781012",
      "781022",
      "781024",
      "781028",
      "781036",
    ],
    localities: [
      "Paltan Bazaar",
      "G S Road",
      "Zoo Road",
      "Six Mile",
      "Ganeshguri",
      "Ulubari",
      "Beltola",
      "Dispur",
      "Christian Basti",
      "Rukminigaon",
      "Hatigaon",
      "Bhangagarh",
      "Chandmari",
      "Silpukhuri",
      "Maligaon",
      "Jalukbari",
      "Basistha",
      "Lokhra",
      "Narengi",
      "Khanapara",
      "Pan Bazaar",
      "Uzanbazar",
      "Borbari",
      "Kahilipara",
      "Lalganesh",
    ],
    hubAddress: "G.S. Road, Bhangagarh / Christian Basti, Guwahati, Assam 781005",
    reviewRating: "4.96",
    reviewCount: 428,
    phone: "+91 98765 43210",
    faqs: [
      {
        question: "Do you deliver cakes after midnight in Guwahati?",
        answer:
          "Yes! Our Midnight Delivery in Guwahati runs from 11:00 PM to 11:59 PM, so your cake or flowers arrive right as the celebration begins.",
      },
      {
        question: "Can I get same-day cake delivery in areas like G S Road or Zoo Road?",
        answer:
          "Yes, same-day delivery is available across Guwahati including G S Road, Zoo Road, Six Mile, and 40+ other localities — just order before 5:00 PM.",
      },
      {
        question: "Which areas in Guwahati do you cover for flower delivery?",
        answer:
          "We deliver flowers to every major locality in Guwahati including Paltan Bazaar, Ganeshguri, Beltola, Dispur, Maligaon, and Jalukbari. If your area is not listed, message us to confirm instant delivery.",
      },
      {
        question: "How early do I need to order for morning surprise delivery in Guwahati?",
        answer:
          "Place your order the evening before (by 8:00 PM) to guarantee an early-morning 7:00 AM - 9:00 AM surprise delivery anywhere in Guwahati.",
      },
      {
        question: "Do you deliver bento cakes across Guwahati?",
        answer:
          "Yes, our mini Korean-style bento cakes (300g) are available for same-day delivery across Guwahati — great for intimate celebrations or a personal treat.",
      },
      {
        question: "Can NRIs send cakes or flowers to Guwahati from abroad?",
        answer:
          "Yes! Friends and family overseas (USA, UK, Canada, UAE, Australia, etc.) can easily order online using international credit/debit cards or PayPal/Razorpay for direct doorstep delivery in Guwahati.",
      },
    ],
    popularSearches: [
      { text: "Anniversary Cake Delivery in Guwahati", href: "/catalog?category=cakes&occasion=anniversary" },
      { text: "Anniversary Photo Cakes in Guwahati", href: "/catalog?category=cakes&occasion=anniversary" },
      { text: "Birthday Cake Delivery in Guwahati", href: "/catalog?category=cakes&occasion=birthday" },
      { text: "Birthday Cakes for Girls", href: "/catalog?category=cakes&occasion=birthday" },
      { text: "Birthday Chocolate Cakes in Guwahati", href: "/catalog?category=cakes&flavor=chocolate" },
      { text: "Send Flowers in Guwahati", href: "/catalog?category=flowers" },
      { text: "Caramel Cakes", href: "/catalog?category=cakes" },
      { text: "Cartoon Cake Delivery in Guwahati", href: "/catalog?category=cakes&occasion=birthday" },
      { text: "Chocolate Anniversary Cakes in Guwahati", href: "/catalog?category=cakes&flavor=chocolate" },
      { text: "Chocolate Cake Delivery in Guwahati", href: "/catalog?category=cakes&flavor=chocolate" },
      { text: "Chocolate Overload Cakes in Guwahati", href: "/catalog?category=cakes&flavor=chocolate" },
      { text: "Order Bouquets Online in Guwahati", href: "/catalog?category=flowers" },
      { text: "Custom Heart Cakes in Guwahati", href: "/catalog?category=cakes&occasion=anniversary" },
      { text: "Customized Designer Cakes", href: "/catalog?category=cakes" },
      { text: "Custom Celebration Cakes", href: "/catalog?category=cakes" },
      { text: "Customized Photo Cakes in Guwahati", href: "/catalog?category=cakes" },
      { text: "Designer Birthday Cakes for Girls", href: "/catalog?category=cakes&occasion=birthday" },
      { text: "Designer Birthday Cakes in Guwahati", href: "/catalog?category=cakes&occasion=birthday" },
      { text: "Doraemon Cake Delivery in Guwahati", href: "/catalog?category=cakes&occasion=birthday" },
      { text: "Edible Photo Print Cakes in Assam", href: "/catalog?category=cakes" },
      { text: "Elegant Birthday Cakes in Guwahati", href: "/catalog?category=cakes&occasion=birthday" },
      { text: "Fresh Flowers Guwahati", href: "/catalog?category=flowers" },
      { text: "Happy Birthday Cakes in Guwahati", href: "/catalog?category=cakes&occasion=birthday" },
      { text: "Heart Shape Birthday Cakes in Guwahati", href: "/catalog?category=cakes&occasion=birthday" },
      { text: "Kids Birthday Cakes in Guwahati", href: "/catalog?category=cakes&occasion=birthday" },
      { text: "KitKat Oreo Cakes in Guwahati", href: "/catalog?category=cakes&flavor=chocolate" },
      { text: "Luxury Birthday Cakes in Guwahati", href: "/catalog?category=cakes&occasion=birthday" },
      { text: "Luxury Cakes in Guwahati", href: "/catalog?category=cakes" },
      { text: "Flower Delivery in Guwahati", href: "/catalog?category=flowers" },
      { text: "Online Birthday Cake Delivery in Guwahati", href: "/catalog?category=cakes&occasion=birthday" },
      { text: "Online Birthday Cakes for Kids in Guwahati", href: "/catalog?category=cakes&occasion=birthday" },
      { text: "Online Cake Delivery in Guwahati", href: "/catalog?category=cakes" },
      { text: "Online Cake Shop in Guwahati", href: "/catalog?category=cakes" },
      { text: "Personalized Birthday Cakes in Guwahati", href: "/catalog?category=cakes&occasion=birthday" },
      { text: "Personalized Message Cakes in Guwahati", href: "/catalog?category=cakes" },
      { text: "Premium Chocolate Cakes in Guwahati", href: "/catalog?category=cakes&flavor=chocolate" },
      { text: "Romantic Anniversary Cakes in Guwahati", href: "/catalog?category=cakes&occasion=anniversary" },
      { text: "Romantic Cake Delivery in Guwahati", href: "/catalog?category=cakes&occasion=love-and-romance" },
      { text: "Romantic Cakes in Guwahati", href: "/catalog?category=cakes&occasion=love-and-romance" },
      { text: "Rose Flower Cakes in Guwahati", href: "/catalog?category=combos" },
      { text: "Same-Day Delivery in Guwahati", href: "/catalog?delivery=same-day" },
      { text: "Valentine Cakes in Guwahati", href: "/catalog?occasion=love-and-romance" },
      { text: "Valentine's Day Heart Cakes in Guwahati", href: "/catalog?occasion=love-and-romance" },
    ],
  },
  delhi: {
    name: "Delhi NCR",
    state: "Delhi",
    headline: "Express Floral Bouquets & Midnight Cakes in Delhi NCR",
    subheadline: "Fresh cakes and luxury blooms delivered same-day across Delhi, Gurugram, and Noida",
    aboutBrand:
      "Celebrate every moment with Bloom & Bakes. Handcrafted red roses, Dutch lilies, and artisan gourmet cakes prepared on-demand with guaranteed express 2-hour and midnight delivery.",
    pincodes: ["110001", "110016", "110020", "122001", "201301"],
    localities: [
      "Connaught Place",
      "South Extension",
      "Green Park",
      "Lajpat Nagar",
      "Hauz Khas",
      "Saket",
      "Dwarka",
      "Rohini",
      "Cyber City Gurugram",
      "Noida Sector 18",
    ],
    hubAddress: "Connaught Place / Green Park, New Delhi 110001",
    reviewRating: "4.92",
    reviewCount: 680,
    phone: "+91 98765 43210",
    faqs: [
      {
        question: "Can I order midnight cake delivery in Delhi NCR?",
        answer: "Yes, our midnight slot runs 11:00 PM to 11:59 PM across Delhi, Noida, and Gurugram.",
      },
      {
        question: "Do you have eggless cake options?",
        answer: "Yes, 100% pure vegetarian eggless bakes are available across all flavours.",
      },
    ],
    popularSearches: [
      { text: "Flower Delivery in Delhi", href: "/catalog?category=flowers" },
      { text: "Midnight Cake Delivery Delhi", href: "/catalog?category=cakes&delivery=midnight" },
      { text: "Same-Day Flowers Gurugram", href: "/catalog?category=flowers&delivery=same-day" },
      { text: "Birthday Cakes Noida", href: "/catalog?category=cakes&occasion=birthday" },
    ],
  },
  mumbai: {
    name: "Mumbai",
    state: "Maharashtra",
    headline: "Fresh Flowers & Artisan Cake Gifting in Mumbai",
    subheadline: "Handcrafted flower bouquets and oven-fresh cakes delivered across Mumbai & Navi Mumbai",
    aboutBrand:
      "Experience premium gifting with Bloom & Bakes Mumbai. From Bandra to South Bombay, enjoy refrigerated temperature-controlled delivery on all fresh flowers and cakes.",
    pincodes: ["400001", "400050", "400051", "400053", "400076"],
    localities: [
      "Bandra West",
      "Colaba & Fort",
      "Juhu",
      "Andheri West",
      "Powai",
      "Lower Parel",
      "Dadar",
      "Thane West",
    ],
    hubAddress: "Bandra West / Fort, Mumbai, Maharashtra 400050",
    reviewRating: "4.94",
    reviewCount: 520,
    phone: "+91 98765 43210",
    faqs: [
      {
        question: "Do you deliver to South Mumbai and Western Suburbs?",
        answer: "Yes, our express fleet covers South Mumbai, Western Suburbs, and Central Mumbai.",
      },
      {
        question: "Can I get same-day delivery in Mumbai?",
        answer: "Yes, order before 5 PM for guaranteed same-day delivery.",
      },
    ],
    popularSearches: [
      { text: "Cake Delivery in Mumbai", href: "/catalog?category=cakes" },
      { text: "Roses Delivery Bandra", href: "/catalog?category=flowers" },
      { text: "Midnight Cakes Mumbai", href: "/catalog?category=cakes&delivery=midnight" },
    ],
  },
  bengaluru: {
    name: "Bengaluru",
    state: "Karnataka",
    headline: "Same-Day Flower & Gourmet Cake Delivery in Bengaluru",
    subheadline: "Fresh artisanal flowers and cakes delivered in 2 hours across Bangalore",
    aboutBrand:
      "Send love across Bengaluru with Bloom & Bakes. Hand-picked Dutch roses, Belgian chocolate cakes, and plant gifts delivered with care.",
    pincodes: ["560001", "560038", "560034", "560068", "560100", "560066"],
    localities: [
      "Indiranagar",
      "Koramangala",
      "HSR Layout",
      "Whitefield",
      "JP Nagar",
      "Malleshwaram",
      "Electronic City",
    ],
    hubAddress: "Indiranagar 100ft Road, Bengaluru, Karnataka 560038",
    reviewRating: "4.95",
    reviewCount: 710,
    phone: "+91 98765 43210",
    faqs: [
      {
        question: "How fast is express delivery in Bengaluru?",
        answer: "We offer 2-hour express delivery for select cakes and flower bouquets.",
      },
    ],
    popularSearches: [
      { text: "Flower Delivery Bangalore", href: "/catalog?category=flowers" },
      { text: "Cake Delivery Indiranagar", href: "/catalog?category=cakes" },
      { text: "Midnight Gifting Bangalore", href: "/catalog?delivery=midnight" },
    ],
  },
};

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const meta = CITY_METADATA[city.toLowerCase()];
  if (!meta) {
    return { title: "City Delivery — Bloom & Bakes" };
  }

  return {
    title: `${meta.headline} | Bloom & Bakes`,
    description: `${meta.subheadline}. Order fresh flowers, chocolate cakes, and gift combos with 2-hour same-day and midnight delivery in ${meta.name}, ${meta.state}.`,
    keywords: [
      `Cake delivery in ${meta.name}`,
      `Flower delivery in ${meta.name}`,
      `Midnight cake ${meta.name}`,
      `Same-day flowers ${meta.name}`,
      `Bento cakes ${meta.name}`,
      `Online cake shop ${meta.name}`,
    ],
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

  const jsonLdLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Bloom & Bakes ${meta.name}`,
    description: meta.subheadline,
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80",
    address: {
      "@type": "PostalAddress",
      addressLocality: meta.name,
      addressRegion: meta.state,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "26.1445",
      longitude: "91.7362",
    },
    url: `http://localhost:3000/city/${cityKey}`,
    telephone: meta.phone,
    priceRange: "₹₹",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: meta.reviewRating,
      reviewCount: meta.reviewCount,
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: meta.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Schema Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-100/70 via-rose-50/30 to-white py-12 sm:py-16 border-b border-rose-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3.5 py-1 text-xs font-semibold text-rose-700 shadow-xs">
              <MapPin className="h-3.5 w-3.5 text-rose-600" />
              <span>Hyperlocal Florist & Bakery Hub in {meta.name}</span>
            </div>

            <h1 className="text-3xl font-extrabold font-serif text-zinc-900 sm:text-4xl lg:text-5xl leading-tight">
              {meta.headline}
            </h1>

            <p className="text-base font-medium text-rose-800">
              {meta.subheadline}
            </p>

            <p className="text-sm text-zinc-600 leading-relaxed">
              {meta.aboutBrand}
            </p>

            {/* Quick Value Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-900">
                <Cake className="h-3.5 w-3.5 text-rose-600" />
                Fresh Cakes
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 border border-pink-200 px-3 py-1 text-xs font-semibold text-pink-900">
                <Sparkles className="h-3.5 w-3.5 text-pink-600" />
                Premium Flowers
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-900">
                <Truck className="h-3.5 w-3.5 text-emerald-600" />
                Fast Same-Day Delivery
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-semibold text-purple-900">
                <Clock className="h-3.5 w-3.5 text-purple-600" />
                Midnight (11 PM - 12 AM)
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="/catalog?category=combos"
                className="rounded-full bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
              >
                <span>Order Flowers & Cakes</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/catalog?category=cakes"
                className="rounded-full bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 px-5 py-2.5 text-xs font-bold shadow-xs transition"
              >
                Explore Cakes
              </Link>
              <Link
                href="/catalog?category=flowers"
                className="rounded-full bg-white hover:bg-zinc-50 text-rose-700 border border-rose-200 px-5 py-2.5 text-xs font-bold shadow-xs transition"
              >
                Send Flowers Online
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Delicious Cakes Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-rose-100 bg-white p-6 sm:p-10 shadow-sm space-y-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600">
              <Cake className="h-4 w-4" />
              <span>Artisan Bakery Hub</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-zinc-900 sm:text-3xl">
              Cake Delivery in {meta.name}. Delicious Cakes for Every Celebration
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Bloom & Bakes is one of the leading online cake delivery services in {meta.name}. We deliver fresh, delicious cakes to your doorstep across {meta.name} — including Same Day & Midnight delivery. Choose from a wide range of cakes including birthday cakes, anniversary cakes, designer cakes, bento cakes, cupcakes, and more. Whether it&apos;s a celebration or a surprise, enjoy the best cake delivery in {meta.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3 p-5 rounded-2xl bg-rose-50/40 border border-rose-100">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-600 fill-rose-600" />
                <span>Cake for Every Happy Moment</span>
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Cake is not just for birthdays — it&apos;s for every happy moment. At Bloom & Bakes, we offer freshly baked cakes made with premium ingredients, perfect for:
              </p>
              <ul className="text-xs space-y-1.5 text-zinc-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Birthdays & anniversaries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Kids&apos; parties & first birthdays</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Weddings & engagements</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Surprise midnight celebrations</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <h3 className="text-sm font-bold text-zinc-900">
                Popular Cake Flavours & Customisations
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Chocolate Truffle",
                  "Black Forest",
                  "Fresh Pineapple",
                  "Butterscotch Crunch",
                  "Red Velvet Cream Cheese",
                  "Exotic Fresh Fruit",
                  "Blueberry Cheesecake",
                  "Korean Bento Cakes",
                ].map((flv) => (
                  <span
                    key={flv}
                    className="rounded-lg bg-white border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-800 shadow-2xs"
                  >
                    🍰 {flv}
                  </span>
                ))}
              </div>
              <div className="pt-2 text-xs space-y-1.5 text-zinc-600 border-t border-zinc-200">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span><strong>Custom designs & photo prints available</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span><strong>100% pure vegetarian (eggless) options on every cake</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span><strong>Same-day & midnight cake delivery in {meta.name}</strong></span>
                </div>
              </div>
              <Link
                href="/catalog?category=cakes"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:underline"
              >
                <span>Order Cake Online Now in {meta.name}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Areas We Cover in Guwahati */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-zinc-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-600" />
                <span>Delivery Across {meta.name} — Areas We Cover</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                We deliver cakes, flowers, and combos to homes, offices, and hostels across every major locality in {meta.name} — same day, midnight, or morning surprise, your choice.
              </p>
            </div>
            <a
              href="https://api.whatsapp.com/send?text=Hi%20Bloom%20and%20Bakes,%20I%20want%20to%20order%20in%20Guwahati"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs shrink-0 self-start sm:self-auto"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Chat with Us</span>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {meta.localities.map((area) => (
              <div
                key={area}
                className="flex items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50/70 px-3 py-2 text-xs font-medium text-zinc-800 hover:border-rose-300 hover:bg-rose-50/60 transition group cursor-default"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 group-hover:scale-125 transition" />
                <span className="truncate">{area}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-rose-50/60 border border-rose-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-rose-950 font-medium">
              Don&apos;t see your area listed? We cover <strong>40+ localities across {meta.name}</strong> including surrounding townships.
            </span>
            <Link
              href="/catalog?delivery=same-day"
              className="inline-flex items-center gap-1 font-bold text-rose-700 hover:underline shrink-0"
            >
              <span>Check Delivery Availability</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Spotlight Occasion Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Birthday */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-2xl">🎂</span>
              <h3 className="text-lg font-bold font-serif text-zinc-900">
                Birthday Cake Delivery in {meta.name}
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Make birthdays unforgettable with our range of birthday cakes — from classic chocolate to designer photo cakes — delivered same-day or at midnight, anywhere in {meta.name}.
              </p>
            </div>
            <Link
              href="/catalog?category=cakes&occasion=birthday"
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline pt-2 border-t border-zinc-100"
            >
              <span>Shop Birthday Cakes</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Card 2: Anniversary */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-2xl">💍</span>
              <h3 className="text-lg font-bold font-serif text-zinc-900">
                Anniversary Cake Delivery in {meta.name}
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Celebrate togetherness with an anniversary cake crafted for the moment — pair it with fresh flowers for a combo that says it best. Same-day and midnight anniversary delivery available.
              </p>
            </div>
            <Link
              href="/catalog?category=cakes&occasion=anniversary"
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline pt-2 border-t border-zinc-100"
            >
              <span>Shop Anniversary Cakes</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Card 3: Bento Cakes */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-2xl">🍰</span>
              <h3 className="text-lg font-bold font-serif text-zinc-900">
                Bento Cake Delivery in {meta.name}
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Our mini Korean-style bento cakes are perfect for small celebrations, desk surprises, or a personal treat — freshly baked and delivered same-day across {meta.name}.
              </p>
            </div>
            <Link
              href="/catalog?category=cakes"
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline pt-2 border-t border-zinc-100"
            >
              <span>Order Bento Cakes in {meta.name}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Fresh Flowers & Combos Feature Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flowers Spotlight */}
          <div className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50/50 to-white p-6 sm:p-8 space-y-4 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Hand-Picked Stems</span>
            <h3 className="text-xl font-bold font-serif text-zinc-900">
              Fresh Flowers That Speak From the Heart
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Flowers are nature&apos;s most beautiful way to express love, care, and emotions. Our expert florists hand-craft every bouquet with attention and care to make your gift truly special. Whether it&apos;s a romantic gesture or a thoughtful surprise, our flowers say it all.
            </p>
            <div className="pt-2">
              <div className="text-[11px] font-bold text-zinc-700 uppercase">Choose from:</div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {["Sensational Roses", "Elegant Orchids", "Soft Lilies", "Beautiful Gerberas", "Unique Carnations"].map((fl) => (
                  <span key={fl} className="rounded-md bg-white border border-rose-200 px-2 py-0.5 text-xs text-rose-900 font-medium">
                    🌸 {fl}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-rose-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-bold">✓ 100% Fresh Stems Guaranteed</span>
              <Link
                href="/catalog?category=flowers"
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <span>Send Flowers Online</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Combos Spotlight */}
          <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/50 to-white p-6 sm:p-8 space-y-4 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Perfect Pairings</span>
            <h3 className="text-xl font-bold font-serif text-zinc-900">
              Cake & Flower Combos – The Perfect Gift
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Why send just one when you can send both? Our cake & flower combos pair a freshly baked cake with a hand-picked bouquet — packed and delivered together, same-day, anywhere in {meta.name}. Perfect for birthdays, anniversaries, or when &ldquo;just a cake&rdquo; doesn&apos;t feel like enough.
            </p>
            <div className="pt-2">
              <div className="text-[11px] font-bold text-zinc-700 uppercase">Highlights:</div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {["Flowers + Truffle Cake", "Cake + Cuddly Teddy", "Rose Bouquet + Greeting Card", "Midnight Surprise Pack"].map((co) => (
                  <span key={co} className="rounded-md bg-white border border-amber-200 px-2 py-0.5 text-xs text-amber-900 font-medium">
                    🎁 {co}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
              <span className="text-[11px] text-amber-800 font-bold">⭐ Save up to ₹350 on Combos</span>
              <Link
                href="/catalog?category=combos"
                className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
              >
                <span>Shop Cake & Flower Combos</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Valentine & Occasions Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="rounded-full bg-rose-700/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-200">
              Special Occasions & Celebrations
            </span>
            <h3 className="text-2xl font-bold font-serif sm:text-3xl text-white">
              Celebrate Love & Special Moments in {meta.name}
            </h3>
            <p className="text-xs text-rose-100 leading-relaxed">
              From Women&apos;s Day and Mother&apos;s Day to anniversaries, birthdays, and romantic &ldquo;just because&rdquo; surprises — Bloom & Bakes helps you celebrate beautifully. Make your Valentine feel truly special with romantic cakes and fresh flower bouquets delivered across {meta.name}.
            </p>
          </div>
          <Link
            href="/catalog?occasion=love-and-romance"
            className="rounded-full bg-white text-rose-900 hover:bg-rose-50 px-6 py-3 text-xs font-bold shadow-lg transition shrink-0"
          >
            Explore Romantic Gifts
          </Link>
        </div>
      </section>

      {/* Trending Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold font-serif text-zinc-900">
              Trending Celebrations in {meta.name}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Freshly prepared cakes, hand-tied bouquets, and gift sets ready for same-day delivery.
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

      {/* Why We Are Loved */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-2xl font-bold font-serif text-zinc-900">
              Why Bloom & Bakes is Loved in {meta.name}
            </h2>
            <p className="text-xs text-zinc-500">
              Your happiness is our priority — from order placement to doorstep delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-center space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 mx-auto">
                <Truck className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-zinc-900">Fast & On-Time Delivery</h4>
              <p className="text-[11px] text-zinc-500">Guaranteed 2-hour express and doorstep handover across all sectors.</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-center space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mx-auto">
                <Clock className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-zinc-900">Midnight Delivery</h4>
              <p className="text-[11px] text-zinc-500">Celebrate birthdays and anniversaries right at 11:59 PM.</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-center space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mx-auto">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-zinc-900">100% Fresh Guarantee</h4>
              <p className="text-[11px] text-zinc-500">Oven-fresh artisan cakes and farm-fresh floral stems only.</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-center space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 mx-auto">
                <Heart className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-zinc-900">Trusted Local Gifting</h4>
              <p className="text-[11px] text-zinc-500">Rated {meta.reviewRating} / 5 by hundreds of delighted customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <HelpCircle className="h-5 w-5 text-rose-600" />
            <h2 className="text-xl font-bold font-serif text-zinc-900">
              Frequently Asked Questions — Cake & Flower Delivery in {meta.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meta.faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1.5">
                <strong className="text-xs font-bold text-zinc-900 block">
                  {faq.question}
                </strong>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Searches Tag Cloud */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Search className="h-4 w-4 text-zinc-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800">
              Popular Searches in {meta.name}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {meta.popularSearches.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="rounded-lg bg-zinc-50 hover:bg-rose-50 border border-zinc-200 hover:border-rose-300 px-2.5 py-1 text-xs text-zinc-700 hover:text-rose-700 transition"
              >
                {item.text}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
