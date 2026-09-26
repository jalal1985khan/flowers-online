import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        serviceAreas: true,
        users: { select: { id: true, name: true, email: true, role: true } },
        _count: { select: { products: true, orderItems: true } },
      },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json({ vendor });
  } catch (err: unknown) {
    console.error("Failed to fetch vendor:", err);
    return NextResponse.json({ error: "Failed to fetch vendor" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.vendor.findUnique({
      where: { id },
      include: { serviceAreas: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const {
      name,
      email,
      phone,
      city,
      state,
      address,
      commissionRate,
      prepTimeMinutes,
      isApproved,
      isActive,
      servicePincodes,
    } = body;

    const data: Record<string, unknown> = {};

    if (name !== undefined) data.name = String(name).trim();
    if (email !== undefined) {
      const cleanEmail = String(email).toLowerCase().trim();
      if (cleanEmail !== existing.email) {
        const collision = await prisma.vendor.findUnique({ where: { email: cleanEmail } });
        if (collision && collision.id !== id) {
          return NextResponse.json({ error: `Email "${cleanEmail}" is already used by another vendor.` }, { status: 400 });
        }
      }
      data.email = cleanEmail;
    }
    if (phone !== undefined) data.phone = String(phone).trim();
    if (city !== undefined) data.city = String(city).trim();
    if (state !== undefined) data.state = String(state).trim();
    if (address !== undefined) data.address = String(address).trim();
    if (commissionRate !== undefined && commissionRate !== null) {
      data.commissionRate = Number(commissionRate);
    }
    if (prepTimeMinutes !== undefined && prepTimeMinutes !== null) {
      data.prepTimeMinutes = Number(prepTimeMinutes);
    }
    if (typeof isApproved === "boolean") data.isApproved = isApproved;
    if (typeof isActive === "boolean") data.isActive = isActive;

    // Handle service pincodes update if passed
    if (Array.isArray(servicePincodes)) {
      const targetCity = city || existing.city || "Guwahati";
      const cleanPincodes = Array.from(
        new Set(
          servicePincodes
            .map((p: unknown) => String(p).trim())
            .filter((p: string) => /^\d{6}$/.test(p))
        )
      );

      await prisma.vendorServiceArea.deleteMany({
        where: { vendorId: id },
      });

      if (cleanPincodes.length > 0) {
        await prisma.vendorServiceArea.createMany({
          data: cleanPincodes.map((pin: string) => ({
            vendorId: id,
            pincode: pin,
            city: targetCity,
            isSameDaySupported: true,
            isMidnightSupported: true,
            isFixedTimeSupported: true,
          })),
        });
      }
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id },
      data,
      include: {
        serviceAreas: true,
        _count: { select: { products: true, orderItems: true } },
      },
    });

    return NextResponse.json({
      success: true,
      vendor: updatedVendor,
      message: `Vendor "${updatedVendor.name}" updated successfully`,
    });
  } catch (err: unknown) {
    console.error("Failed to update vendor:", err);
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode"); // "permanent" or "deactivate"

    const existing = await prisma.vendor.findUnique({
      where: { id },
      include: { _count: { select: { products: true, orderItems: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const hasOrders = existing._count.orderItems > 0;

    // If vendor has orders or if mode is specifically deactivate:
    if (hasOrders || mode === "deactivate") {
      await prisma.$transaction([
        prisma.vendor.update({
          where: { id },
          data: { isActive: false, isApproved: false },
        }),
        prisma.product.updateMany({
          where: { vendorId: id },
          data: { isAvailable: false, isApproved: false },
        }),
      ]);

      return NextResponse.json({
        success: true,
        action: "deactivated",
        message: `Vendor "${existing.name}" has been deactivated and all ${existing._count.products} listed products unlisted from the storefront. Order history is preserved.`,
      });
    }

    // If vendor has 0 orders, we can safely delete permanently
    await prisma.$transaction([
      prisma.user.updateMany({
        where: { vendorId: id },
        data: { vendorId: null },
      }),
      prisma.vendorServiceArea.deleteMany({
        where: { vendorId: id },
      }),
      prisma.product.deleteMany({
        where: { vendorId: id },
      }),
      prisma.vendor.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      action: "deleted",
      message: `Vendor "${existing.name}" and its data have been permanently deleted.`,
    });
  } catch (err: unknown) {
    console.error("Failed to delete vendor:", err);
    return NextResponse.json({ error: "Failed to delete vendor" }, { status: 500 });
  }
}
