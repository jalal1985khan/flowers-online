import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProductImage } from "@/lib/product-images";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message: string = (body.message || "").trim();
    const history: ChatMessage[] = body.history || [];
    const user = body.user || null;
    const cartCount: number = body.cartCount || 0;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const lower = message.toLowerCase();

    // 1. CHECKOUT & PAYMENT INTENT
    if (
      lower.includes("checkout") ||
      lower.includes("pay") ||
      lower.includes("payment") ||
      lower.includes("place order") ||
      lower.includes("buy now")
    ) {
      if (cartCount === 0) {
        return NextResponse.json({
          reply:
            "Your shopping bag is currently empty! Let me help you find the perfect fresh flowers, celebration cake, or gift hamper first. What occasion are you celebrating today?",
          products: [],
          suggestedActions: [
            { label: "🎂 Birthday Cakes", type: "query", payload: "Show me popular birthday cakes" },
            { label: "🌹 Fresh Red Roses", type: "query", payload: "I want romantic red roses" },
            { label: "⚡ Same-Day Combos", type: "query", payload: "Show flower and cake combos" },
          ],
        });
      }

      if (!user) {
        return NextResponse.json({
          reply:
            "Awesome! You have items ready in your bag. To ensure your surprise delivery address, order receipts, and live tracking are securely saved to your profile, please sign in or register before completing payment.",
          products: [],
          authPrompt: true,
          checkoutPrompt: true,
          suggestedActions: [
            { label: "🔐 Sign In / Register", type: "login", payload: "/login?redirect=/checkout" },
            { label: "💳 Proceed to Payment", type: "checkout", payload: "/checkout" },
          ],
        });
      }

      return NextResponse.json({
        reply: `You're all set, ${user.name || "friend"}! Your order will be linked to ${user.email || "your profile"}. You can now review your delivery slot, recipient card message, and make payment safely via Razorpay (UPI, Cards, NetBanking).`,
        products: [],
        checkoutPrompt: true,
        suggestedActions: [
          { label: "💳 Pay Now via Razorpay", type: "checkout", payload: "/checkout" },
          { label: "🛍️ View Cart", type: "cart", payload: "/cart" },
        ],
      });
    }

    // 2. AUTH / PROFILE INTENT
    if (
      lower.includes("login") ||
      lower.includes("sign in") ||
      lower.includes("my account") ||
      lower.includes("my profile")
    ) {
      if (user) {
        return NextResponse.json({
          reply: `You are currently logged in as **${user.name || user.email}**. All orders and addresses are automatically saved to your profile! What would you like to shop for today?`,
          products: [],
          suggestedActions: [
            { label: "👤 View My Account", type: "checkout", payload: "/account" },
            { label: "🎂 Birthday Specials", type: "query", payload: "Best birthday gifts" },
          ],
        });
      }

      return NextResponse.json({
        reply:
          "Signing in lets you track your orders live, save frequent delivery addresses (home, office, loved ones), and receive exclusive partner discounts. You can sign in with your email and password in seconds!",
        products: [],
        authPrompt: true,
        suggestedActions: [
          { label: "🔐 Sign In Now", type: "login", payload: "/login" },
          { label: "🎂 Continue Shopping", type: "query", payload: "Trending cakes under 1000" },
        ],
      });
    }

    // 3. INTENT EXTRACTION: Price, Occasion, Product Type, Diet
    let maxPrice: number | null = null;
    const priceMatch = lower.match(/(?:under|below|less than|within|around)\s*(?:rs\.?|inr|₹)?\s*(\d{3,5})/);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1], 10);
    }

    const isEggless =
      lower.includes("eggless") ||
      lower.includes("without egg") ||
      lower.includes("pure veg");

    // Category detection
    let productTypeFilter: "CAKES" | "FLOWERS" | "COMBOS" | "GIFTS" | null = null;
    if (
      lower.includes("cake") ||
      lower.includes("truffle") ||
      lower.includes("bento") ||
      lower.includes("black forest") ||
      lower.includes("red velvet")
    ) {
      productTypeFilter = "CAKES";
    } else if (
      lower.includes("flower") ||
      lower.includes("rose") ||
      lower.includes("roses") ||
      lower.includes("bouquet") ||
      lower.includes("orchid")
    ) {
      productTypeFilter = "FLOWERS";
    } else if (
      lower.includes("combo") ||
      lower.includes("bundle") ||
      lower.includes("hamper")
    ) {
      productTypeFilter = "COMBOS";
    } else if (
      lower.includes("plant") ||
      lower.includes("chocolate") ||
      lower.includes("teddy")
    ) {
      productTypeFilter = "GIFTS";
    }

    // Keyword matching for Prisma query
    const searchTerms: string[] = [];
    if (lower.includes("bento")) searchTerms.push("Bento");
    if (lower.includes("truffle")) searchTerms.push("Truffle");
    if (lower.includes("chocolate")) searchTerms.push("Chocolate");
    if (lower.includes("rose")) searchTerms.push("Rose");
    if (lower.includes("red velvet")) searchTerms.push("Velvet");
    if (lower.includes("plant") || lower.includes("bamboo")) searchTerms.push("Plant", "Bamboo");
    if (lower.includes("anniversary")) searchTerms.push("Anniversary");
    if (lower.includes("birthday")) searchTerms.push("Birthday");
    if (lower.includes("love") || lower.includes("girlfriend") || lower.includes("wife") || lower.includes("valentine")) {
      searchTerms.push("Love", "Heart", "Romantic");
    }

    // Construct Prisma Query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      isAvailable: true,
      isApproved: true,
    };

    if (productTypeFilter) {
      whereClause.productType = productTypeFilter;
    }

    if (maxPrice) {
      whereClause.basePrice = { lte: maxPrice };
    }

    if (isEggless) {
      whereClause.isEgglessAvailable = true;
    }

    if (searchTerms.length > 0) {
      whereClause.OR = [
        ...searchTerms.map((term) => ({
          title: { contains: term, mode: "insensitive" as const },
        })),
        ...searchTerms.map((term) => ({
          tags: { has: term },
        })),
        ...searchTerms.map((term) => ({
          description: { contains: term, mode: "insensitive" as const },
        })),
      ];
    }

    let products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        variants: true,
        vendor: { select: { id: true, name: true } },
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    });

    // Fallback if query was too strict
    if (products.length === 0) {
      products = await prisma.product.findMany({
        where: { isAvailable: true, isApproved: true },
        include: {
          category: true,
          variants: true,
          vendor: { select: { id: true, name: true } },
        },
        take: 4,
        orderBy: { basePrice: "asc" },
      });
    }

    // Format products payload
    const formattedProducts = products.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      basePrice: p.basePrice,
      compareAtPrice: p.compareAtPrice,
      image: getProductImage(p),
      categoryName: p.category.name,
      isEgglessAvailable: p.isEgglessAvailable,
      vendorId: p.vendorId || p.vendor?.id || "",
    }));

    // Craft conversational reply
    let reply = "";
    if (isEggless && productTypeFilter === "CAKES") {
      reply = `I found delicious 100% vegetarian / eggless cakes prepared fresh by our partner bakers! You can add any of these directly to your cart:`;
    } else if (maxPrice) {
      reply = `Here are our best-rated recommendations within your budget of ₹${maxPrice}:`;
    } else if (productTypeFilter === "FLOWERS") {
      reply = `Here are fresh hand-tied floral bouquets ready for same-day delivery:`;
    } else if (productTypeFilter === "COMBOS") {
      reply = `These celebration combos include fresh flowers, cakes, and treats—giving you the best value for your surprise!`;
    } else if (lower.includes("bento")) {
      reply = `Here are our trending Korean-style Bento & Mini celebration cakes, ideal for intimate surprises:`;
    } else {
      reply = `Here are our most popular artisan picks that match what you're looking for:`;
    }

    // Quick suggestions for next step
    const suggestedActions = [
      { label: "🌱 Eggless Only", type: "query" as const, payload: "Show only 100% eggless cakes" },
      { label: "💰 Under ₹999", type: "query" as const, payload: "Show gifts under 999" },
      { label: "🌹 Add Red Roses", type: "query" as const, payload: "Show red roses bouquet" },
      { label: "💳 View Cart & Pay", type: "checkout" as const, payload: "/checkout" },
    ];

    return NextResponse.json({
      reply,
      products: formattedProducts,
      suggestedActions,
      authPrompt: !user,
      cartPrompt: cartCount > 0,
    });
  } catch (err: unknown) {
    console.error("AI Assistant error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
