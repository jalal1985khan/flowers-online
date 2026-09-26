import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
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
    let vendor = null;

    if (session.vendorId) {
      vendor = await prisma.vendor.findUnique({
        where: { id: session.vendorId },
        include: {
          serviceAreas: { orderBy: { pincode: "asc" } },
          _count: { select: { products: true, orderItems: true } },
        },
      });
    } else {
      // Fallback for super admin testing vendor view
      vendor = await prisma.vendor.findFirst({
        include: {
          serviceAreas: { orderBy: { pincode: "asc" } },
          _count: { select: { products: true, orderItems: true } },
        },
      });
    }

    if (!vendor) {
      return NextResponse.json({ error: "No vendor profile found" }, { status: 404 });
    }

    return NextResponse.json({ vendor });
  } catch (err: unknown) {
    console.error("Failed to fetch vendor profile:", err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
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
    const body = await req.json();
    const { name, phone, address, city, state, prepTimeMinutes, servicePincodes } = body;

    // Identify target vendor
    let targetVendorId = session.vendorId;
    if (!targetVendorId) {
      const first = await prisma.vendor.findFirst();
      targetVendorId = first?.id;
    }

    if (!targetVendorId) {
      return NextResponse.json({ error: "No vendor profile linked" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    // Store name is locked for vendors and can only be updated by SUPER_ADMIN
    if (name !== undefined && session.role === "SUPER_ADMIN") {
      data.name = String(name).trim();
    }
    if (phone !== undefined) data.phone = String(phone).trim();
    if (address !== undefined) data.address = String(address).trim();
    if (city !== undefined) data.city = String(city).trim();
    if (state !== undefined) data.state = String(state).trim();
    if (prepTimeMinutes !== undefined) data.prepTimeMinutes = Number(prepTimeMinutes);

    // Sync delivery pincodes if passed
    if (Array.isArray(servicePincodes)) {
      const targetCity = city || "Guwahati";
      const cleanPincodes = Array.from(
        new Set(
          servicePincodes
            .map((p: unknown) => String(p).trim())
            .filter((p: string) => /^\d{6}$/.test(p))
        )
      );

      await prisma.vendorServiceArea.deleteMany({
        where: { vendorId: targetVendorId },
      });

      if (cleanPincodes.length > 0) {
        await prisma.vendorServiceArea.createMany({
          data: cleanPincodes.map((pin: string) => ({
            vendorId: targetVendorId,
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
      where: { id: targetVendorId },
      data,
      include: {
        serviceAreas: { orderBy: { pincode: "asc" } },
        _count: { select: { products: true, orderItems: true } },
      },
    });

    return NextResponse.json({
      success: true,
      vendor: updatedVendor,
      message: "Store profile updated successfully",
    });
  } catch (err: unknown) {
    console.error("Failed to update vendor profile:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
