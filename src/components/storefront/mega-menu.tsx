"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  Sparkles,
  Flame,
  Clock,
  Heart,
  ArrowRight,
  Gift,
  ShieldCheck,
  Star,
  Award,
  Zap,
} from "lucide-react";

interface SubLink {
  label: string;
  href: string;
  isNew?: boolean;
  isHot?: boolean;
}

interface MenuColumn {
  title: string;
  links: SubLink[];
}

interface PromoCard {
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  href: string;
  buttonText: string;
}

interface MegaMenuCategory {
  id: string;
  label: string;
  href: string;
  badge?: string;
  showZapIcon?: boolean;
  columns: MenuColumn[];
  promoCard: PromoCard;
}

function navBadgeClasses(badge: string) {
  const key = badge.toLowerCase();
  if (key.includes("save")) return "bg-amber-100 text-amber-900 border border-amber-200/60";
  if (key === "fast" || key === "eco") return "bg-emerald-100 text-emerald-800 border border-emerald-200/60";
  return "bg-rose-100 text-rose-900 border border-rose-200/60";
}

export const MEGA_MENU_CATEGORIES: MegaMenuCategory[] = [
  {
    id: "flowers",
    label: "Flowers",
    href: "/catalog?category=flowers",
    badge: "Fresh",
    columns: [
      {
        title: "By Flower Type",
        links: [
          { label: "Red Roses", href: "/catalog?category=flowers&tag=roses", isHot: true },
          { label: "Lilies & Orchids", href: "/catalog?category=flowers&tag=lilies" },
          { label: "Carnations & Daisies", href: "/catalog?category=flowers&tag=carnations" },
          { label: "Mixed Floral Bouquets", href: "/catalog?category=flowers", isHot: true },
          { label: "Exotic Dutch Tulips", href: "/catalog?category=flowers&tag=tulips", isNew: true },
          { label: "Sunflowers & Gerberas", href: "/catalog?category=flowers&tag=sunflowers" },
        ],
      },
      {
        title: "By Arrangement",
        links: [
          { label: "Hand-Tied Bouquets", href: "/catalog?category=flowers" },
          { label: "Flower Boxes & Hatboxes", href: "/catalog?category=flowers", isNew: true },
          { label: "Glass Vase Arrangements", href: "/catalog?category=flowers", isHot: true },
          { label: "Heart-Shaped Arrangements", href: "/catalog?category=flowers&occasion=anniversary" },
          { label: "Luxury Velvet Sleeve Roses", href: "/catalog?category=flowers" },
          { label: "Rustic Basket Arrangements", href: "/catalog?category=flowers" },
        ],
      },
      {
        title: "By Occasion",
        links: [
          { label: "Birthday Flowers", href: "/catalog?category=flowers&occasion=birthday", isHot: true },
          { label: "Anniversary Roses", href: "/catalog?category=flowers&occasion=anniversary" },
          { label: "Love & Romance", href: "/catalog?category=flowers&occasion=love-and-romance" },
          { label: "Congratulations", href: "/catalog?category=flowers&occasion=congratulations" },
          { label: "Get Well Soon", href: "/catalog?category=flowers" },
          { label: "Sympathy & Condolence", href: "/catalog?category=flowers" },
        ],
      },
      {
        title: "Delivery & Budget",
        links: [
          { label: "⚡ Same-Day Express Flowers", href: "/catalog?category=flowers&delivery=same-day", isHot: true },
          { label: "🌙 Midnight Flower Delivery", href: "/catalog?category=flowers&delivery=midnight", isHot: true },
          { label: "Under ₹699 Bouquets", href: "/catalog?category=flowers&maxPrice=699" },
          { label: "Under ₹1,299 Premium Stems", href: "/catalog?category=flowers&maxPrice=1299" },
          { label: "Ultra Luxury (> ₹2,500)", href: "/catalog?category=flowers&minPrice=2500" },
        ],
      },
    ],
    promoCard: {
      title: "Royal Red Rose Symphony",
      subtitle: "24 Velvet Red Dutch Roses with Gypsophila & Silk Ribbon",
      badge: "Bestseller #1",
      image: "/images/royal-red-rose-symphony.jpg",
      href: "/product/exotic-25-red-roses-bouquet",
      buttonText: "Order for ₹1,299",
    },
  },
  {
    id: "cakes",
    label: "Cakes",
    href: "/catalog?category=cakes",
    badge: "Bakes",
    columns: [
      {
        title: "By Flavor",
        links: [
          { label: "Chocolate Truffle", href: "/catalog?category=cakes&flavor=chocolate", isHot: true },
          { label: "Red Velvet Cream Cheese", href: "/catalog?category=cakes&flavor=red-velvet", isHot: true },
          { label: "Black Forest Classic", href: "/catalog?category=cakes&flavor=black-forest" },
          { label: "Fresh Pineapple", href: "/catalog?category=cakes&flavor=pineapple" },
          { label: "Butterscotch Crunch", href: "/catalog?category=cakes&flavor=butterscotch" },
          { label: "Blueberry Cheesecake", href: "/catalog?category=cakes&flavor=cheesecake", isNew: true },
        ],
      },
      {
        title: "By Type & Diet",
        links: [
          { label: "🌱 100% Eggless Cakes", href: "/catalog?category=cakes&eggless=true", isHot: true },
          { label: "Photo Printed Cakes", href: "/catalog?category=cakes", isNew: true },
          { label: "Heart-Shaped Cakes", href: "/catalog?category=cakes&occasion=anniversary" },
          { label: "Designer Fondant Cakes", href: "/catalog?category=cakes" },
          { label: "Pinata & Bomb Cakes", href: "/catalog?category=cakes", isHot: true },
          { label: "Pastries & Jar Cakes", href: "/catalog?category=cakes" },
        ],
      },
      {
        title: "By Occasion",
        links: [
          { label: "1st & Milestone Birthdays", href: "/catalog?category=cakes&occasion=birthday", isHot: true },
          { label: "Anniversary Celebrations", href: "/catalog?category=cakes&occasion=anniversary" },
          { label: "Kids Character Cakes", href: "/catalog?category=cakes&occasion=birthday" },
          { label: "Midnight Surprise Cakes", href: "/catalog?category=cakes&delivery=midnight", isHot: true },
          { label: "Corporate & Team Events", href: "/catalog?category=cakes" },
        ],
      },
      {
        title: "Delivery Speed",
        links: [
          { label: "⚡ 2-Hour Instant Bake & Ship", href: "/catalog?category=cakes&delivery=same-day", isHot: true },
          { label: "🌙 Midnight 12 AM Delivery", href: "/catalog?category=cakes&delivery=midnight", isHot: true },
          { label: "Fixed Time Slot Delivery", href: "/catalog?category=cakes" },
          { label: "Half Kg Everyday Delights", href: "/catalog?category=cakes" },
          { label: "1 Kg & 2 Kg Party Sizes", href: "/catalog?category=cakes" },
        ],
      },
    ],
    promoCard: {
      title: "Belgian Dark Truffle",
      subtitle: "Triple layer molten dark ganache with gold leaf crown",
      badge: "Chef's Special",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
      href: "/product/belgian-chocolate-truffle-cake",
      buttonText: "Order from ₹799",
    },
  },
  {
    id: "combos",
    label: "Combos & Hampers",
    href: "/catalog?category=combos",
    badge: "Save 20%",
    columns: [
      {
        title: "Popular Combos",
        links: [
          { label: "Flowers & Cake Combos", href: "/catalog?category=combos", isHot: true },
          { label: "Flowers & Chocolates", href: "/catalog?category=combos" },
          { label: "Cake & Cuddly Teddy", href: "/catalog?category=combos", isHot: true },
          { label: "Flowers + Cake + Teddy Trio", href: "/catalog?category=combos", isHot: true },
          { label: "Flowers & Greeting Card", href: "/catalog?category=combos" },
          { label: "Cake & Exotic Sweets", href: "/catalog?category=combos" },
        ],
      },
      {
        title: "By Recipient",
        links: [
          { label: "Special Gifts For Her", href: "/catalog?occasion=birthday", isHot: true },
          { label: "Thoughtful Gifts For Him", href: "/catalog?occasion=birthday" },
          { label: "Gifts For Mom & Dad", href: "/catalog?occasion=anniversary" },
          { label: "Gifts For Best Friends", href: "/catalog?occasion=birthday" },
          { label: "Celebration Gifts For Couples", href: "/catalog?occasion=anniversary" },
        ],
      },
      {
        title: "Luxury Gift Hampers",
        links: [
          { label: "Gourmet Snack & Chocolate Basket", href: "/catalog?category=combos", isNew: true },
          { label: "Aromatherapy & Spa Hampers", href: "/catalog?category=combos" },
          { label: "Healthy Dry Fruits & Honey Box", href: "/catalog?category=combos" },
          { label: "Executive Desk & Pen Hamper", href: "/catalog?category=combos" },
        ],
      },
      {
        title: "Occasion Combos",
        links: [
          { label: "Birthday Midnight Bash Pack", href: "/catalog?category=combos&occasion=birthday", isHot: true },
          { label: "Silver & Golden Anniversary Box", href: "/catalog?category=combos&occasion=anniversary" },
          { label: "Romantic Proposal Hamper", href: "/catalog?category=combos&occasion=love-and-romance" },
          { label: "Housewarming Blessing Set", href: "/catalog?category=combos" },
        ],
      },
    ],
    promoCard: {
      title: "Royal Celebration Trio",
      subtitle: "10 Red Roses Bouquet + Half Kg Truffle Cake + 6-inch Teddy Bear",
      badge: "Most Loved Combo",
      image: "/images/hero-flower-cake-bundle.jpg",
      href: "/product/roses-and-cake-celebration-combo",
      buttonText: "Save ₹350 • Order ₹1,699",
    },
  },
  {
    id: "chocolates",
    label: "Chocolates & Sweets",
    href: "/catalog?category=chocolates",
    columns: [
      {
        title: "Chocolate Bouquets",
        links: [
          { label: "Ferrero Rocher Golden Bouquet", href: "/catalog?category=chocolates", isHot: true },
          { label: "Cadbury Silk Celebration Tower", href: "/catalog?category=chocolates" },
          { label: "KitKat Crunch Heart Box", href: "/catalog?category=chocolates" },
          { label: "Lindt Swiss Luxury Assortment", href: "/catalog?category=chocolates", isNew: true },
        ],
      },
      {
        title: "Handcrafted Truffles",
        links: [
          { label: "Artisan Belgian Dark Pralines", href: "/catalog?category=chocolates", isHot: true },
          { label: "Roasted Almond & Hazelnut Rocks", href: "/catalog?category=chocolates" },
          { label: "Salted Caramel Chocolate Bars", href: "/catalog?category=chocolates" },
          { label: "Sugar-Free Healthy Chocolates", href: "/catalog?category=chocolates", isNew: true },
        ],
      },
      {
        title: "Traditional Indian Sweets",
        links: [
          { label: "Pure Kaju Katli (Kaju Barfi)", href: "/catalog?category=chocolates" },
          { label: "Gulab Jamun & Rasgulla Tins", href: "/catalog?category=chocolates" },
          { label: "Motichoor & Besan Ladoo", href: "/catalog?category=chocolates" },
          { label: "Assorted Royal Mithai Box", href: "/catalog?category=chocolates", isHot: true },
        ],
      },
      {
        title: "Combos & Add-ons",
        links: [
          { label: "Chocolates with Red Roses", href: "/catalog?category=combos" },
          { label: "Chocolates with Birthday Cake", href: "/catalog?category=combos" },
          { label: "Dry Fruits & Chocolates Box", href: "/catalog?category=combos" },
        ],
      },
    ],
    promoCard: {
      title: "Ferrero Luxury Bouquet",
      subtitle: "16 Golden Ferrero Rocher orbs hand-arranged in satin wrapper",
      badge: "Trending",
      image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80",
      href: "/catalog?category=chocolates",
      buttonText: "Shop Chocolates",
    },
  },
  {
    id: "plants",
    label: "Plants",
    href: "/catalog?category=plants",
    badge: "Eco",
    columns: [
      {
        title: "Green Plants",
        links: [
          { label: "Lucky Bamboo (2 & 3 Layer)", href: "/catalog?category=plants", isHot: true },
          { label: "Money Plant & Golden Pothos", href: "/catalog?category=plants" },
          { label: "Air Purifying Snake Plant", href: "/catalog?category=plants", isHot: true },
          { label: "Jade Plant for Good Fortune", href: "/catalog?category=plants" },
          { label: "Peace Lily in White Ceramic", href: "/catalog?category=plants" },
          { label: "Ficus Bonsai in Terracotta", href: "/catalog?category=plants", isNew: true },
        ],
      },
      {
        title: "By Placement",
        links: [
          { label: "Office Desk & Study Plants", href: "/catalog?category=plants" },
          { label: "Living Room Statement Greens", href: "/catalog?category=plants" },
          { label: "Bedroom Clean Air Plants", href: "/catalog?category=plants" },
          { label: "Balcony & Sunlight Plants", href: "/catalog?category=plants" },
        ],
      },
      {
        title: "Plant Combos",
        links: [
          { label: "Plant & Gourmet Cake", href: "/catalog?category=combos" },
          { label: "Plant with Belgian Chocolates", href: "/catalog?category=combos" },
          { label: "Eco Gift Set with Seed Cards", href: "/catalog?category=plants", isNew: true },
        ],
      },
      {
        title: "Planter Styles",
        links: [
          { label: "Hand-Painted Ceramic Pots", href: "/catalog?category=plants" },
          { label: "Self-Watering Planters", href: "/catalog?category=plants" },
          { label: "Metallic Brass & Gold Pots", href: "/catalog?category=plants" },
        ],
      },
    ],
    promoCard: {
      title: "Fortune Bamboo & Jade Duo",
      subtitle: "Brings positive energy, oxygen, and prosperity to home or office",
      badge: "Eco Choice",
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80",
      href: "/catalog?category=plants",
      buttonText: "Order from ₹499",
    },
  },
  {
    id: "occasions",
    label: "Occasions",
    href: "/catalog",
    columns: [
      {
        title: "Major Celebrations",
        links: [
          { label: "🎉 Birthday Special", href: "/catalog?occasion=birthday", isHot: true },
          { label: "💍 Romantic Anniversary", href: "/catalog?occasion=anniversary", isHot: true },
          { label: "❤️ Love & Romance", href: "/catalog?occasion=love-and-romance", isHot: true },
          { label: "🏆 Congratulations & Success", href: "/catalog?occasion=congratulations" },
          { label: "🏡 Housewarming Gifts", href: "/catalog" },
          { label: "👶 New Born & Baby Shower", href: "/catalog" },
        ],
      },
      {
        title: "Express Your Feelings",
        links: [
          { label: "🥺 I Am Sorry & Make Up", href: "/catalog?category=flowers" },
          { label: "🙏 Thank You Gratitude", href: "/catalog?category=flowers" },
          { label: "💌 Miss You So Much", href: "/catalog?category=combos" },
          { label: "🩹 Get Well Soon Wishes", href: "/catalog?category=flowers" },
          { label: "✨ Just Because / Surprise", href: "/catalog" },
        ],
      },
      {
        title: "Upcoming Festivals",
        links: [
          { label: "🌹 Valentine's & Rose Week", href: "/catalog?occasion=love-and-romance", isHot: true },
          { label: "🧵 Raksha Bandhan Special", href: "/catalog?occasion=raksha-bandhan", isHot: true },
          { label: "🪔 Diwali & Festive Hampers", href: "/catalog?occasion=diwali", isHot: true },
          { label: "🎉 New Year Celebrations", href: "/catalog?occasion=new-year" },
        ],
      },
      {
        title: "Special Services",
        links: [
          { label: "🌙 Midnight Surprise Delivery", href: "/catalog?delivery=midnight", isHot: true },
          { label: "⚡ 2-Hour Express Delivery", href: "/catalog?delivery=same-day", isHot: true },
          { label: "Custom Message on Plaque", href: "/catalog?category=cakes" },
          { label: "Free Handwritten Greeting Card", href: "/catalog" },
        ],
      },
    ],
    promoCard: {
      title: "Midnight Anniversary Surprise",
      subtitle: "Guaranteed doorbell ring at 11:59 PM with cake, flowers & lights",
      badge: "Signature Experience",
      image: "/images/midnight-anniversary-surprise.jpg",
      href: "/catalog?occasion=anniversary&delivery=midnight",
      buttonText: "Book Midnight Slot",
    },
  },
  {
    id: "express",
    label: "Same-Day & Midnight",
    showZapIcon: true,
    href: "/catalog?delivery=same-day",
    badge: "Fast",
    columns: [
      {
        title: "Instant Delivery (2 Hrs)",
        links: [
          { label: "Express Fresh Roses", href: "/catalog?category=flowers&delivery=same-day", isHot: true },
          { label: "Quick Bake Chocolate Truffle", href: "/catalog?category=cakes&delivery=same-day", isHot: true },
          { label: "Instant Red Velvet Cake", href: "/catalog?category=cakes&delivery=same-day" },
          { label: "Express Cake & Flower Combo", href: "/catalog?category=combos&delivery=same-day", isHot: true },
        ],
      },
      {
        title: "Midnight Delivery (11 PM - 12 AM)",
        links: [
          { label: "Midnight Birthday Cakes", href: "/catalog?category=cakes&delivery=midnight", isHot: true },
          { label: "Midnight Red Rose Bouquets", href: "/catalog?category=flowers&delivery=midnight", isHot: true },
          { label: "Midnight Combo Packages", href: "/catalog?category=combos&delivery=midnight" },
          { label: "Midnight Cake + Candle Poppers", href: "/catalog?category=cakes&delivery=midnight" },
        ],
      },
      {
        title: "Delivery By City",
        links: [
          { label: "Guwahati (Assam Hub)", href: "/city/guwahati", isHot: true },
          { label: "Delhi NCR (Gurugram, Noida)", href: "/city/delhi", isHot: true },
          { label: "Mumbai & Navi Mumbai", href: "/city/mumbai", isHot: true },
          { label: "Bengaluru (Bangalore)", href: "/city/bengaluru", isHot: true },
          { label: "Hyderabad & Secunderabad", href: "/city/hyderabad" },
          { label: "Pune & PCMC", href: "/city/pune" },
          { label: "Kolkata City", href: "/city/kolkata" },
        ],
      },
      {
        title: "Our Delivery Guarantee",
        links: [
          { label: "100% On-Time Delivery Guarantee", href: "/catalog" },
          { label: "Temperature Controlled AC Vans", href: "/catalog" },
          { label: "Live WhatsApp GPS Tracking", href: "/catalog" },
          { label: "Contactless Doorstep Handover", href: "/catalog" },
        ],
      },
    ],
    promoCard: {
      title: "Order Before 9 PM",
      subtitle: "For Guaranteed Midnight Delivery across 20+ major metropolitan cities",
      badge: "Express Fleet",
      image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&auto=format&fit=crop&q=80",
      href: "/catalog?delivery=midnight",
      buttonText: "Explore Midnight Slots",
    },
  },
];

export function MegaMenu() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (categoryId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveCategoryId(categoryId);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveCategoryId(null);
    }, 180);
  };

  const activeCategory = MEGA_MENU_CATEGORIES.find(
    (c) => c.id === activeCategoryId
  );

  return (
    <div
      className="relative z-30"
      onMouseLeave={handleMouseLeave}
    >
      {/* Category Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 py-1.5 text-xs font-semibold text-foreground">
        <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-1.5">
          {MEGA_MENU_CATEGORIES.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <div
                key={cat.id}
                onMouseEnter={() => handleMouseEnter(cat.id)}
                className="relative shrink-0"
              >
                <Link
                  href={cat.href}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 ${isActive
                    ? "bg-primary-soft text-primary font-semibold"
                    : "text-foreground/90 hover:bg-primary-soft/70 hover:text-primary"
                    }`}
                >
                  {cat.showZapIcon && (
                    <Zap className="size-3.5 shrink-0 fill-amber-400 text-amber-500" />
                  )}
                  <span className="whitespace-nowrap">{cat.label}</span>
                  {cat.badge && (
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider leading-none ${navBadgeClasses(cat.badge)}`}
                    >
                      {cat.badge}
                    </span>
                  )}
                  <ChevronDown
                    className={`size-3 shrink-0 text-muted transition-transform duration-200 ${isActive ? "rotate-180 text-primary" : ""
                      }`}
                  />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="hidden shrink-0 items-center gap-3 pl-3 text-xs font-medium xl:flex whitespace-nowrap">
          {/* <Link
            href="/catalog?delivery=midnight"
            className="flex items-center gap-1.5 text-violet-800 hover:text-violet-900 hover:underline"
          >
            <span className="text-sm leading-none" aria-hidden>
              🌙
            </span>
            <span>Midnight Delivery</span>
          </Link> */}
          <span className="h-3.5 w-px bg-border" aria-hidden />
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-foreground">2-Hour Delivery in Your Area</span>
          </span>
        </div>
      </div>

      {/* Full-Width Mega Menu Dropdown */}
      {activeCategory && (
        <div
          onMouseEnter={() => handleMouseEnter(activeCategory.id)}
          onMouseLeave={handleMouseLeave}
          className="absolute left-0 right-0 top-full w-full border-b border-border bg-card shadow-2xl transition-all duration-200"
        >
          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Columns for subcategories (8 columns total) */}
              <div
                className={`grid gap-6 ${activeCategory.columns.length === 4
                  ? "grid-cols-4 col-span-9"
                  : activeCategory.columns.length === 3
                    ? "grid-cols-3 col-span-8"
                    : "grid-cols-4 col-span-9"
                  }`}
              >
                {activeCategory.columns.map((column, idx) => (
                  <div key={idx} className="flex flex-col gap-3">
                    <h3 className="border-b border-rose-100/70 pb-2 text-xs font-bold uppercase tracking-wider text-foreground">
                      {column.title}
                    </h3>
                    <ul className="flex flex-col gap-2 text-xs">
                      {column.links.map((link, linkIdx) => (
                        <li key={linkIdx}>
                          <Link
                            href={link.href}
                            onClick={() => setActiveCategoryId(null)}
                            className="group flex items-center justify-between py-0.5 text-muted-foreground transition-transform duration-150 hover:translate-x-1 hover:text-primary"
                          >
                            <span className="group-hover:font-medium">
                              {link.label}
                            </span>
                            {link.isHot && (
                              <span className="flex items-center text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded">
                                <Flame className="h-3 w-3 mr-0.5 fill-rose-500 text-rose-500" />
                                Hot
                              </span>
                            )}
                            {link.isNew && (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded uppercase">
                                New
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Visual Promotional Card (3-4 columns) */}
              <div className="col-span-3 border-l border-rose-100 pl-6 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-zinc-100 mb-3 group">
                    <Image
                      src={activeCategory.promoCard.image}
                      alt={activeCategory.promoCard.title}
                      fill
                      sizes="(max-width: 1200px) 25vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 rounded-full bg-rose-600/95 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      {activeCategory.promoCard.badge}
                    </div>
                  </div>

                  <h4 className="font-display text-sm font-bold text-foreground group-hover:text-primary">
                    {activeCategory.promoCard.title}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {activeCategory.promoCard.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100">
                  <Link
                    href={activeCategory.promoCard.href}
                    onClick={() => setActiveCategoryId(null)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white px-3 py-2 text-xs font-semibold shadow-xs hover:shadow transition"
                  >
                    <span>{activeCategory.promoCard.buttonText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom highlights strip */}
            <div className="mt-6 pt-4 border-t border-rose-100/60 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>100% Fresh Flower & Baked-on-Demand Guarantee</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-rose-600" />
                  <span>Real-Time Kitchen & Florist Tracking</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span>Free Premium Greeting Card with Placed Orders</span>
                </span>
              </div>
              <Link
                href={activeCategory.href}
                onClick={() => setActiveCategoryId(null)}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <span>View All {activeCategory.label}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
