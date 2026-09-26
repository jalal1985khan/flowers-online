import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const CURATED_PRESETS = [
  {
    title: "Ferrero Rocher Hazelnut Box (16 Pcs)",
    category: "Chocolates",
    image: "/16-peaces-chocolate.jpeg",
    source: "preset",
  },
  {
    title: "Ferrero Rocher - 200 GM Signature Collection",
    category: "Chocolates",
    image: "/200gm-chocolate.jpg",
    source: "preset",
  },
  {
    title: "Cuddly White Teddy Bear (6-inch)",
    category: "Soft Toys",
    image: "/teddy.webp",
    source: "preset",
  },
  {
    title: "White Plush Teddy Bear with Ribbon",
    category: "Soft Toys",
    image: "/images/white-teddy-6-inch.jpg",
    source: "preset",
  },
  {
    title: "Chocolates & Sweets Gift Box",
    category: "Chocolates",
    image: "/images/categories/chocolates-sweets.jpg",
    source: "preset",
  },
  {
    title: "Celebration Party Balloons & Confetti",
    category: "Celebration",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    source: "preset",
  },
  {
    title: "Golden Foil Birthday Greeting Card",
    category: "Cards",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    source: "preset",
  },
  {
    title: "Musical Rotating Lotus Birthday Candle",
    category: "Candles",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
    source: "preset",
  },
  {
    title: "Single Premium Long-Stem Red Rose Sleeve",
    category: "Flowers",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    source: "preset",
  },
  {
    title: "Festive Sparkle Party Popper Streamer",
    category: "Celebration",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
    source: "preset",
  },
  {
    title: "Deluxe Celebration Gift Hamper",
    category: "Celebration",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
    source: "preset",
  },
  {
    title: "Handwritten Floral Parchment Note Card",
    category: "Cards",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80",
    source: "preset",
  },
];

export async function GET(req: Request) {
  const session = await getSession();

  if (
    !session ||
    (session.role !== "VENDOR_OWNER" &&
      session.role !== "VENDOR_STAFF" &&
      session.role !== "SUPER_ADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = (searchParams.get("q") || "").toLowerCase().trim();

    // 1. Fetch images from existing Addons
    const addons = await prisma.addon.findMany({
      select: {
        id: true,
        title: true,
        image: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Fetch images from existing Products (active catalog)
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        images: true,
        category: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 40,
    });

    // Combine and deduplicate by image URL
    const seenUrls = new Set<string>();
    const libraryItems: Array<{
      url: string;
      title: string;
      category: string;
      source: "preset" | "addon" | "product";
    }> = [];

    // Add presets first
    for (const p of CURATED_PRESETS) {
      if (p.image && !seenUrls.has(p.image)) {
        seenUrls.add(p.image);
        libraryItems.push({
          url: p.image,
          title: p.title,
          category: p.category,
          source: "preset",
        });
      }
    }

    // Add existing addon images
    for (const a of addons) {
      if (a.image && !seenUrls.has(a.image)) {
        seenUrls.add(a.image);
        libraryItems.push({
          url: a.image,
          title: a.title,
          category: a.category || "Addon",
          source: "addon",
        });
      }
    }

    // Add existing product images
    for (const pr of products) {
      for (const img of pr.images || []) {
        if (img && !seenUrls.has(img)) {
          seenUrls.add(img);
          libraryItems.push({
            url: img,
            title: pr.title,
            category: pr.category?.name || "Product",
            source: "product",
          });
        }
      }
    }

    // Filter by category or search query if requested
    let results = libraryItems;
    if (category && category !== "ALL") {
      results = results.filter((item) =>
        item.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    if (query) {
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.url.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      images: results,
      total: results.length,
      categories: Array.from(new Set(libraryItems.map((i) => i.category))),
    });
  } catch (err: unknown) {
    console.error("Failed to fetch media library:", err);
    return NextResponse.json({ error: "Failed to fetch media library" }, { status: 500 });
  }
}
