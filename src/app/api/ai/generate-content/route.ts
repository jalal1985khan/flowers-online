import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { title, productType, flavorOrFlowers, occasion } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title or core concept is required" }, { status: 400 });
    }

    const type = productType || "CAKES";
    const occ = occasion || "Birthday";
    const notes = flavorOrFlowers || "artisan chocolate & fresh vanilla cream";

    // Commercial and emotional copy generation
    const generatedTitle = `Artisan ${title} — Handcrafted ${type === "FLOWERS" ? "Fresh Bouquet" : "Celebration Cake"}`;
    const generatedDescription = `Handcrafted with meticulous dedication for ${occ} moments. Featuring exquisite notes of ${notes}, crafted by verified master bakers and florists. Guaranteed to arrive fresh in our temperature-controlled presentation packaging with complimentary greeting card.`;
    const metaTitle = `Order ${title} Online — Same Day & Midnight Delivery | MyPetalsCart`;
    const metaDescription = `Send fresh handcrafted ${title} with ${notes}. Same-day 2-hour delivery & guaranteed midnight slots across Guwahati, Bengaluru, Mumbai, and Delhi.`;
    const tags = [
      type.toLowerCase(),
      occ.toLowerCase(),
      "same-day-delivery",
      "midnight-delivery",
      "artisan-gifting",
      "bestseller",
    ];

    const suggestedPrice = type === "FLOWERS" ? 799 : type === "COMBOS" ? 1499 : 849;

    return NextResponse.json({
      success: true,
      generated: {
        title: generatedTitle,
        description: generatedDescription,
        metaTitle,
        metaDescription,
        tags,
        suggestedPrice,
        prepTimeMinutes: type === "CAKES" ? 90 : 45,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
