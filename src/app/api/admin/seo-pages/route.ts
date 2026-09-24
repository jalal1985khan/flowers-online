import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { seedSeoLandingPages } from "@/lib/seo-pages-seed";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "OPERATIONS")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "all";

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { heading: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category && category !== "all") {
      where.categorySlug = category;
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    const pages = await prisma.seoLandingPage.findMany({
      where,
      orderBy: { title: "asc" },
    });

    const totalCount = await prisma.seoLandingPage.count();
    const activeCount = await prisma.seoLandingPage.count({ where: { isActive: true } });

    return NextResponse.json({
      pages,
      totalCount,
      activeCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "OPERATIONS")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (body.action === "seed") {
      const result = await seedSeoLandingPages();
      return NextResponse.json({
        success: true,
        message: `Synced all 43 SEO Landing Pages: ${result.created} created, ${result.updated} updated.`,
        result,
      });
    }

    if (!body.title || !body.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const normalizedSlug = body.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await prisma.seoLandingPage.findUnique({
      where: { slug: normalizedSlug },
    });

    if (existing) {
      return NextResponse.json({ error: `A page with slug '${normalizedSlug}' already exists.` }, { status: 409 });
    }

    const page = await prisma.seoLandingPage.create({
      data: {
        slug: normalizedSlug,
        title: body.title,
        heading: body.heading || body.title,
        subheading: body.subheading || null,
        metaTitle: body.metaTitle || `${body.title} | Same-Day & Midnight Delivery`,
        metaDescription: body.metaDescription || `Order ${body.title} online with fresh same-day and midnight delivery.`,
        city: body.city || "Guwahati",
        categorySlug: body.categorySlug || "cakes",
        occasionSlug: body.occasionSlug || null,
        flavorOrType: body.flavorOrType || null,
        badgeText: body.badgeText || "Same-Day & Midnight Delivery",
        introHtml: body.introHtml || null,
        contentBody: body.contentBody || null,
        deliveryAreas: Array.isArray(body.deliveryAreas) ? body.deliveryAreas : [],
        faqs: Array.isArray(body.faqs) ? body.faqs : [],
        popularKeywords: Array.isArray(body.popularKeywords) ? body.popularKeywords : [],
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      },
    });

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
