import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (err: unknown) {
    console.error("Failed to fetch admin categories:", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await req.json();
    const { name, slug, description, image, sortOrder, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");

    const category = await prisma.category.create({
      data: {
        name,
        slug: cleanSlug,
        description: description || null,
        image: image || null,
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ category, success: true }, { status: 201 });
  } catch (err: unknown) {
    console.error("Failed to create category:", err);
    return NextResponse.json({ error: "Failed to create category. Slug might already exist." }, { status: 500 });
  }
}
