import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FALLBACK_ADDONS = [
  {
    id: "addon_candle_1",
    title: "Musical Rotating Birthday Candle",
    category: "Candles",
    price: 99,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "addon_card_1",
    title: "Handwritten Golden Foil Greeting Card",
    category: "Cards",
    price: 149,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "addon_choc_1",
    title: "Ferrero Rocher Hazelnut Chocolates (16 Pcs)",
    category: "Chocolates",
    price: 499,
    image: "/16-peaces-chocolate.jpeg",
  },
  {
    id: "addon_choc_2",
    title: "Ferrero Rocher - 200 GM",
    category: "Chocolates",
    price: 549,
    image: "/200gm-chocolate.jpg",
  },
  {
    id: "addon_toy_1",
    title: "Cuddly White Teddy Bear (6 inch)",
    category: "Soft Toys",
    price: 299,
    image: "/teddy.webp",
  },
  {
    id: "addon_popper_1",
    title: "Celebration Party Popper (Sparkle Streamers)",
    category: "Celebration",
    price: 129,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "addon_rose_1",
    title: "Single Premium Red Rose in Sleeve",
    category: "Flowers",
    price: 99,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendorId");

    const where: any = {
      isAvailable: true,
      isApproved: true,
    };

    if (vendorId) {
      where.OR = [
        { vendorId: null }, // Global addons
        { vendorId: vendorId }, // Approved addons from this vendor
      ];
    } else {
      // General checkout gallery: only global approved addons or all approved items
      where.OR = [
        { vendorId: null },
      ];
    }

    const addons = await prisma.addon.findMany({
      where,
      orderBy: { price: "asc" },
    });

    if (!addons || addons.length === 0) {
      return NextResponse.json({ addons: FALLBACK_ADDONS });
    }

    return NextResponse.json({ addons });
  } catch {
    return NextResponse.json({ addons: FALLBACK_ADDONS });
  }
}
