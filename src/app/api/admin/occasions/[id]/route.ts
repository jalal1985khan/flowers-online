import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, description, bannerImage, sortOrder, isActive } = body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
    if (description !== undefined) data.description = description || null;
    if (bannerImage !== undefined) data.bannerImage = bannerImage || null;
    if (sortOrder !== undefined) data.sortOrder = Number(sortOrder);
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const occasion = await prisma.occasion.update({
      where: { id },
      data,
    });

    return NextResponse.json({ occasion, success: true });
  } catch (err: unknown) {
    console.error("Failed to update occasion:", err);
    return NextResponse.json({ error: "Failed to update occasion" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    const productCount = await prisma.productOccasion.count({ where: { occasionId: id } });

    if (productCount > 0) {
      // Soft-deactivate if products are linked
      const occasion = await prisma.occasion.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ occasion, message: "Occasion deactivated as products exist" });
    }

    await prisma.occasion.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Occasion deleted" });
  } catch (err: unknown) {
    console.error("Failed to delete occasion:", err);
    return NextResponse.json({ error: "Failed to delete occasion" }, { status: 500 });
  }
}
