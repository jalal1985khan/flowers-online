import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "OPERATIONS")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const page = await prisma.seoLandingPage.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "OPERATIONS")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.seoLandingPage.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // If slug is changed, check uniqueness
    if (body.slug && body.slug !== existing.slug) {
      const slugClash = await prisma.seoLandingPage.findUnique({
        where: { slug: body.slug },
      });
      if (slugClash && slugClash.id !== id) {
        return NextResponse.json({ error: `Slug '${body.slug}' is already taken.` }, { status: 409 });
      }
    }

    const updated = await prisma.seoLandingPage.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : existing.title,
        slug: body.slug !== undefined ? body.slug : existing.slug,
        heading: body.heading !== undefined ? body.heading : existing.heading,
        subheading: body.subheading !== undefined ? body.subheading : existing.subheading,
        metaTitle: body.metaTitle !== undefined ? body.metaTitle : existing.metaTitle,
        metaDescription: body.metaDescription !== undefined ? body.metaDescription : existing.metaDescription,
        city: body.city !== undefined ? body.city : existing.city,
        categorySlug: body.categorySlug !== undefined ? body.categorySlug : existing.categorySlug,
        occasionSlug: body.occasionSlug !== undefined ? body.occasionSlug : existing.occasionSlug,
        flavorOrType: body.flavorOrType !== undefined ? body.flavorOrType : existing.flavorOrType,
        badgeText: body.badgeText !== undefined ? body.badgeText : existing.badgeText,
        introHtml: body.introHtml !== undefined ? body.introHtml : existing.introHtml,
        contentBody: body.contentBody !== undefined ? body.contentBody : existing.contentBody,
        deliveryAreas: Array.isArray(body.deliveryAreas) ? body.deliveryAreas : existing.deliveryAreas,
        faqs: Array.isArray(body.faqs) ? body.faqs : existing.faqs,
        popularKeywords: Array.isArray(body.popularKeywords) ? body.popularKeywords : existing.popularKeywords,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : existing.isActive,
      },
    });

    return NextResponse.json({ success: true, page: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "OPERATIONS")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.seoLandingPage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
