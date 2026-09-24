import React from "react";
import Link from "next/link";
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

const GUWAHATI_LOCALITIES = [
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
];

const POPULAR_SEARCHES = [
  { text: "Anniversary Cake Delivery in Guwahati", href: "/anniversary-cake-delivery-in-guwahati" },
  { text: "Anniversary Photo Cakes in Guwahati", href: "/anniversary-photo-cakes-in-guwahati" },
  { text: "Birthday Cake Delivery in Guwahati", href: "/birthday-cake-delivery-in-guwahati" },
  { text: "Birthday Cakes for Girls", href: "/birthday-cakes-for-girls" },
  { text: "Birthday Chocolate Cakes in Guwahati", href: "/birthday-chocolate-cakes-in-guwahati" },
  { text: "Send Flowers in Guwahati", href: "/send-flowers-in-guwahati" },
  { text: "Caramel Cakes", href: "/caramel-cakes" },
  { text: "Cartoon Cake Delivery in Guwahati", href: "/cartoon-cake-delivery-in-guwahati" },
  { text: "Chocolate Anniversary Cakes in Guwahati", href: "/chocolate-anniversary-cakes-in-guwahati" },
  { text: "Chocolate Cake Delivery in Guwahati", href: "/chocolate-cake-delivery-in-guwahati" },
  { text: "Chocolate Overload Cakes in Guwahati", href: "/chocolate-overload-cakes-in-guwahati" },
  { text: "Order Bouquets Online in Guwahati", href: "/order-bouquets-online-in-guwahati" },
  { text: "Custom Heart Cakes in Guwahati", href: "/custom-heart-cakes-in-guwahati" },
  { text: "Customized Designer Cakes", href: "/customized-designer-cakes" },
  { text: "Custom Celebration Cakes", href: "/custom-celebration-cakes" },
  { text: "Customized Photo Cakes in Guwahati", href: "/customized-photo-cakes-in-guwahati" },
  { text: "Designer Birthday Cakes for Girls", href: "/designer-birthday-cakes-for-girls" },
  { text: "Designer Birthday Cakes in Guwahati", href: "/designer-birthday-cakes-in-guwahati" },
  { text: "Doraemon Cake Delivery in Guwahati", href: "/doraemon-cake-delivery-in-guwahati" },
  { text: "Edible Photo Print Cakes in Assam", href: "/edible-photo-print-cakes-in-assam" },
  { text: "Elegant Birthday Cakes in Guwahati", href: "/elegant-birthday-cakes-in-guwahati" },
  { text: "Fresh Flowers Guwahati", href: "/fresh-flowers-guwahati" },
  { text: "Happy Birthday Cakes in Guwahati", href: "/happy-birthday-cakes-in-guwahati" },
  { text: "Heart Shape Birthday Cakes in Guwahati", href: "/heart-shape-birthday-cakes-in-guwahati" },
  { text: "Kids Birthday Cakes in Guwahati", href: "/kids-birthday-cakes-in-guwahati" },
  { text: "KitKat Oreo Cakes in Guwahati", href: "/kitkat-oreo-cakes-in-guwahati" },
  { text: "Luxury Birthday Cakes in Guwahati", href: "/luxury-birthday-cakes-in-guwahati" },
  { text: "Luxury Cakes in Guwahati", href: "/luxury-cakes-in-guwahati" },
  { text: "Flower Delivery in Guwahati", href: "/flower-delivery-in-guwahati" },
  { text: "Online Birthday Cake Delivery in Guwahati", href: "/online-birthday-cake-delivery-in-guwahati" },
  { text: "Online Birthday Cakes for Kids in Guwahati", href: "/online-birthday-cakes-for-kids-in-guwahati" },
  { text: "Online Cake Delivery in Guwahati", href: "/online-cake-delivery-in-guwahati" },
  { text: "Online Cake Shop in Guwahati", href: "/online-cake-shop-in-guwahati" },
  { text: "Personalized Birthday Cakes in Guwahati", href: "/personalized-birthday-cakes-in-guwahati" },
  { text: "Personalized Message Cakes in Guwahati", href: "/personalized-message-cakes-in-guwahati" },
  { text: "Premium Chocolate Cakes in Guwahati", href: "/premium-chocolate-cakes-in-guwahati" },
  { text: "Romantic Anniversary Cakes in Guwahati", href: "/romantic-anniversary-cakes-in-guwahati" },
  { text: "Romantic Cake Delivery in Guwahati", href: "/romantic-cake-delivery-in-guwahati" },
  { text: "Romantic Cakes in Guwahati", href: "/romantic-cakes-in-guwahati" },
  { text: "Rose Flower Cakes in Guwahati", href: "/rose-flower-cakes-in-guwahati" },
  { text: "Same-Day Delivery in Guwahati", href: "/same-day-delivery-in-guwahati" },
  { text: "Valentine Cakes in Guwahati", href: "/valentine-cakes-in-guwahati" },
  { text: "Valentine's Day Heart Cakes in Guwahati", href: "/valentines-day-heart-cakes-in-guwahati" },
];

const FAQS = [
  {
    q: "Do you deliver cakes after midnight in Guwahati?",
    a: "Yes — our Midnight Delivery in Guwahati slot runs 11:00 PM to 11:59 PM, so your cake or flowers arrive right as the celebration begins.",
  },
  {
    q: "Can I get same-day cake delivery in areas like G S Road or Zoo Road?",
    a: "Yes, same-day delivery is available across Guwahati including G S Road, Zoo Road, and 40+ other localities — just order before 5:00 PM.",
  },
  {
    q: "Which areas in Guwahati do you cover for flower delivery?",
    a: "We deliver flowers to every major locality in Guwahati — see our list of covered delivery areas or message our team to confirm instant dispatch.",
  },
  {
    q: "How early do I need to order for morning surprise delivery in Guwahati?",
    a: "Place your order the evening before (by 8:00 PM) to guarantee an early-morning 7:00 AM - 9:00 AM surprise delivery anywhere in Guwahati.",
  },
  {
    q: "Do you deliver bento cakes across Guwahati?",
    a: "Yes, our mini Korean-style bento cakes (300g) are available for same-day delivery across Guwahati — great for small celebrations or a personal treat.",
  },
  {
    q: "Can NRIs send cakes or flowers to Guwahati from abroad?",
    a: "Yes — friends and family overseas (USA, UK, Canada, UAE, Australia, etc.) can order online for direct doorstep delivery anywhere in Guwahati using international payment methods.",
  },
];

export function GuwahatiSEOSection() {
  return (
    <section className="border-t border-rose-100 bg-white py-14 space-y-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Banner & Header */}
        <div className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50/70 via-white to-pink-50/40 p-6 sm:p-10 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3.5 py-1 text-xs font-semibold text-rose-700 shadow-2xs">
            <MapPin className="h-3.5 w-3.5 text-rose-600" />
            <span>Guwahati City Gifting Hub</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-zinc-900 leading-tight">
            Online Flowers, Cake & Plant Delivery in Guwahati
          </h2>

          <p className="text-base font-medium text-rose-800">
            Fresh cakes and beautiful flowers delivered the same day across Guwahati
          </p>

          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-4xl">
            Celebrate every special moment with Bloom & Bakes. From birthdays and anniversaries to weddings, Valentine&apos;s Day, Women&apos;s Day, and surprise celebrations — we help you send love with freshly baked cakes and hand-crafted flower bouquets.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100/70 px-3 py-1 text-xs font-semibold text-rose-900">
              <Cake className="h-3.5 w-3.5 text-rose-600" />
              Fresh Cakes
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100/70 px-3 py-1 text-xs font-semibold text-pink-900">
              <Sparkles className="h-3.5 w-3.5 text-pink-600" />
              Premium Flowers
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-semibold text-emerald-900">
              <Truck className="h-3.5 w-3.5 text-emerald-600" />
              Fast Same-Day Delivery
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/70 px-3 py-1 text-xs font-semibold text-purple-900">
              <Clock className="h-3.5 w-3.5 text-purple-600" />
              Midnight (11 PM - 12 AM)
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/catalog?category=combos"
              className="rounded-full bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-xs font-bold shadow-xs hover:shadow transition flex items-center gap-2"
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
              href="/city/guwahati"
              className="rounded-full bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 px-5 py-2.5 text-xs font-bold shadow-xs transition"
            >
              View Guwahati City Page
            </Link>
          </div>
        </div>

        {/* Cake Delivery in Guwahati Section */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="max-w-3xl space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-zinc-900">
              Bloom & Bakes – Cake Delivery in Guwahati. Delicious Cakes for Every Celebration
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Bloom & Bakes is one of the leading online cake delivery services in Guwahati. We deliver fresh, delicious cakes to your doorstep across Guwahati — including Same Day & Midnight delivery. Choose from a wide range of cakes including birthday cakes, anniversary cakes, designer cakes, bento cakes, cupcakes, and more. Whether it&apos;s a celebration or a surprise, enjoy the best cake delivery in Guwahati with Bloom & Bakes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            <div className="space-y-3 p-5 rounded-2xl bg-rose-50/50 border border-rose-100">
              <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-600 fill-rose-600" />
                <span>Cake for Every Happy Moment</span>
              </h4>
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
                  <span>Surprise celebrations</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <h4 className="text-sm font-bold text-zinc-900">
                Popular Cake Flavours in Guwahati
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Chocolate Truffle",
                  "Black Forest",
                  "Fresh Pineapple",
                  "Butterscotch Crunch",
                  "Red Velvet Cream Cheese",
                  "Fruit Cakes",
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
              <div className="pt-2 text-xs space-y-1 text-zinc-600 border-t border-zinc-200">
                <div>✓ Custom designs available</div>
                <div>✓ 100% Eggless cake options available</div>
                <div>✓ Same-day & midnight cake delivery in Guwahati</div>
              </div>
              <Link
                href="/catalog?category=cakes"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:underline"
              >
                <span>Order Cake Online Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Delivery Across Guwahati — Areas We Cover */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-xl font-bold font-serif text-zinc-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-600" />
                <span>Delivery Across Guwahati — Areas We Cover</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                We deliver cakes, flowers, and combos to homes, offices, and hostels across every major locality in Guwahati — same day, midnight, or morning surprise, your choice.
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
            {GUWAHATI_LOCALITIES.map((area) => (
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
              Don&apos;t see your area listed? <a href="https://api.whatsapp.com/send?text=Hi%20Bloom%20and%20Bakes,%20I%20want%20to%20confirm%20delivery%20in%20Guwahati" target="_blank" rel="noopener noreferrer" className="font-bold text-rose-700 underline">Chat with us</a> — we cover 40+ localities across Guwahati.
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

        {/* 3 Occasion Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-2xl">🎂</span>
              <h4 className="text-lg font-bold font-serif text-zinc-900">
                Birthday Cake Delivery in Guwahati
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Make birthdays unforgettable with our range of birthday cakes — from classic chocolate to designer photo cakes — delivered same-day or at midnight, anywhere in Guwahati.
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

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-2xl">💍</span>
              <h4 className="text-lg font-bold font-serif text-zinc-900">
                Anniversary Cake Delivery in Guwahati
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Celebrate togetherness with an anniversary cake crafted for the moment — pair it with fresh flowers for a combo that says it best. Same-day and midnight anniversary cake delivery available across Guwahati.
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

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-2xl">🍰</span>
              <h4 className="text-lg font-bold font-serif text-zinc-900">
                Bento Cake Delivery in Guwahati
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Our mini Korean-style bento cakes are perfect for small celebrations, desk surprises, or a personal treat — freshly baked and delivered same-day across Guwahati.
              </p>
            </div>
            <Link
              href="/catalog?category=cakes"
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline pt-2 border-t border-zinc-100"
            >
              <span>Order Bento Cakes in Guwahati</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Fresh Flowers & Combos Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50/50 to-white p-6 sm:p-8 space-y-4 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Fresh Blooms</span>
            <h4 className="text-xl font-bold font-serif text-zinc-900">
              Fresh Flowers That Speak From the Heart
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Flowers are nature&apos;s most beautiful way to express love, care, and emotions. Our expert florists hand-craft every bouquet with attention and care to make your gift truly special. Whether it&apos;s a romantic gesture or a thoughtful surprise, our flowers say it all.
            </p>
            <div className="text-xs space-y-1 text-zinc-700">
              <div className="font-bold text-[11px] uppercase text-zinc-500">Choose from:</div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Sensational Roses", "Elegant Orchids", "Soft Lilies", "Beautiful Gerberas", "Unique Carnations"].map((fl) => (
                  <span key={fl} className="rounded-md bg-white border border-rose-200 px-2 py-0.5 text-xs text-rose-900 font-medium">
                    🌸 {fl}
                  </span>
                ))}
              </div>
              <div className="pt-2 text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>100% fresh flowers • Beautifully arranged bouquets • Delivered across Guwahati</span>
              </div>
            </div>
            <div className="pt-2 border-t border-rose-100">
              <Link
                href="/catalog?category=flowers"
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <span>Send Flowers Online</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/50 to-white p-6 sm:p-8 space-y-4 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">The Ultimate Pairing</span>
            <h4 className="text-xl font-bold font-serif text-zinc-900">
              Cake & Flower Combos – The Perfect Gift
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Why send just one when you can send both? Our cake & flower combos pair a freshly baked cake with a hand-picked bouquet — packed and delivered together, same-day, anywhere in Guwahati. Perfect for birthdays, anniversaries, or when &ldquo;just a cake&rdquo; doesn&apos;t feel like enough — with midnight and morning delivery slots available too.
            </p>
            <div className="pt-2">
              <div className="text-[11px] font-bold text-zinc-700 uppercase">Popular Combinations:</div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {["Flowers & Truffle Cake", "Roses + Cake + Teddy", "Lilies & Pineapple Cake", "Midnight Surprise Pack"].map((c) => (
                  <span key={c} className="rounded-md bg-white border border-amber-200 px-2 py-0.5 text-xs text-amber-900 font-medium">
                    🎁 {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-amber-100">
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

        {/* Occasions & Valentine Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 p-8 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="rounded-full bg-rose-700/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-200">
              Special Celebrations
            </span>
            <h4 className="text-2xl font-bold font-serif sm:text-3xl text-white">
              Celebrate Every Occasion with Flowers & Cakes in Guwahati
            </h4>
            <p className="text-xs text-rose-100 leading-relaxed">
              From Women&apos;s Day and Mother&apos;s Day to anniversaries, birthdays, and &ldquo;just because&rdquo; moments — Bloom & Bakes helps you celebrate every occasion beautifully. Every celebration feels complete with fresh flowers and cake. Make your Valentine feel truly special with romantic cakes and fresh flower bouquets delivered across Guwahati. From classic roses to heart-shaped cakes, we help you express love in the sweetest way.
            </p>
          </div>
          <Link
            href="/catalog?occasion=love-and-romance"
            className="rounded-full bg-white text-rose-900 hover:bg-rose-50 px-6 py-3 text-xs font-bold shadow-md transition shrink-0"
          >
            Send Valentine Gifts
          </Link>
        </div>

        {/* Why Loved in Guwahati */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h4 className="text-2xl font-bold font-serif text-zinc-900">
              Why Bloom & Bakes is Loved in Guwahati
            </h4>
            <p className="text-xs text-zinc-500">
              Your happiness is our priority — from order placement to doorstep delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-center space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 mx-auto">
                <Truck className="h-5 w-5" />
              </div>
              <h5 className="text-xs font-bold text-zinc-900">Fast & On-Time Delivery</h5>
              <p className="text-[11px] text-zinc-500">Doorstep delivery across all 40+ localities in Guwahati.</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-center space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mx-auto">
                <Clock className="h-5 w-5" />
              </div>
              <h5 className="text-xs font-bold text-zinc-900">Same-Day & Midnight</h5>
              <p className="text-[11px] text-zinc-500">Guaranteed midnight delivery (11:00 PM - 11:59 PM) available.</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-center space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mx-auto">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h5 className="text-xs font-bold text-zinc-900">100% Fresh Guaranteed</h5>
              <p className="text-[11px] text-zinc-500">Freshly baked artisan cakes and hand-picked flowers only.</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-center space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 mx-auto">
                <Heart className="h-5 w-5" />
              </div>
              <h5 className="text-xs font-bold text-zinc-900">Free & Friendly Support</h5>
              <p className="text-[11px] text-zinc-500">Trusted local gifting brand dedicated to customer happiness.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 text-center space-y-2">
            <h5 className="text-sm font-bold text-zinc-900">
              Make Every Moment Special with Bloom & Bakes
            </h5>
            <p className="text-xs text-zinc-600">
              Send flowers and cakes online in Guwahati with ease and confidence. Freshly baked cakes • Hand-crafted bouquets • Fast & reliable delivery.
            </p>
            <div className="pt-2">
              <Link
                href="/catalog?delivery=same-day"
                className="inline-flex items-center gap-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 text-xs font-bold shadow-xs hover:shadow transition"
              >
                <span>Order Now – Same-Day Delivery in Guwahati</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <HelpCircle className="h-5 w-5 text-rose-600" />
            <h4 className="text-xl font-bold font-serif text-zinc-900">
              Frequently Asked Questions — Cake & Flower Delivery in Guwahati
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1.5">
                <strong className="text-xs font-bold text-zinc-900 block">
                  {faq.q}
                </strong>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Search className="h-4 w-4 text-zinc-500" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800">
              Popular Searches
            </h4>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {POPULAR_SEARCHES.map((item, idx) => (
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
      </div>
    </section>
  );
}
