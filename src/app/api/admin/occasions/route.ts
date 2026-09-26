import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const occasions = await prisma.occasion.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ occasions });
  } catch (err: unknown) {
    console.error("Failed to fetch admin occasions:", err);
    return NextResponse.json({ error: "Failed to fetch occasions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await req.json();
    const { name, slug, description, bannerImage, sortOrder, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");

    const occasion = await prisma.occasion.create({
      data: {
        name,
        slug: cleanSlug,
        description: description || null,
        bannerImage: bannerImage || null,
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ occasion, success: true }, { status: 201 });
  } catch (err: unknown) {
    console.error("Failed to create occasion:", err);
    return NextResponse.json({ error: "Failed to create occasion. Slug might already exist." }, { status: 500 });
  }
}
