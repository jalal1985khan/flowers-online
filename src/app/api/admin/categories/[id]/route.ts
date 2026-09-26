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
    const { name, slug, description, image, sortOrder, isActive } = body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
    if (description !== undefined) data.description = description || null;
    if (image !== undefined) data.image = image || null;
    if (sortOrder !== undefined) data.sortOrder = Number(sortOrder);
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    return NextResponse.json({ category, success: true });
  } catch (err: unknown) {
    console.error("Failed to update category:", err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
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
    const productCount = await prisma.product.count({ where: { categoryId: id } });

    if (productCount > 0) {
      // Soft-deactivate if products are assigned
      const category = await prisma.category.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ category, message: "Category deactivated as products exist" });
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (err: unknown) {
    console.error("Failed to delete category:", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
