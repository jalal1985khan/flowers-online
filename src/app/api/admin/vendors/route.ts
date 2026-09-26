import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        _count: { select: { products: true, orderItems: true } },
        serviceAreas: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ vendors });
  } catch (err: unknown) {
    console.error("Failed to fetch admin vendors:", err);
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await req.json();
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
      ownerPassword,
    } = body;

    if (!name || !email || !phone || !city) {
      return NextResponse.json(
        { error: "Business Name, Email, Phone, and City are required" },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).toLowerCase().trim();

    // Check duplicate email
    const existing = await prisma.vendor.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json(
        { error: `Vendor with email "${cleanEmail}" already exists` },
        { status: 400 }
      );
    }

    // Generate slug
    let slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const slugCollision = await prisma.vendor.findUnique({ where: { slug } });
    if (slugCollision) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const cleanPincodes = Array.isArray(servicePincodes)
      ? Array.from(
          new Set(
            servicePincodes
              .map((p: unknown) => String(p).trim())
              .filter((p: string) => /^\d{6}$/.test(p))
          )
        )
      : [];

    const vendor = await prisma.vendor.create({
      data: {
        name: String(name).trim(),
        slug,
        email: cleanEmail,
        phone: String(phone).trim(),
        city: String(city).trim(),
        state: state ? String(state).trim() : "Assam",
        address: address ? String(address).trim() : `${city}, India`,
        commissionRate: commissionRate != null ? Number(commissionRate) : 15.0,
        prepTimeMinutes: prepTimeMinutes != null ? Number(prepTimeMinutes) : 45,
        isApproved: isApproved !== false,
        isActive: isActive !== false,
        serviceAreas: cleanPincodes.length > 0
          ? {
              create: cleanPincodes.map((pin: string) => ({
                pincode: pin,
                city: String(city).trim(),
                isSameDaySupported: true,
                isMidnightSupported: true,
                isFixedTimeSupported: true,
              })),
            }
          : undefined,
      },
      include: {
        serviceAreas: true,
      },
    });

    // If an owner password was provided, create user login for the vendor owner
    if (ownerPassword && String(ownerPassword).length >= 6) {
      const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (!existingUser) {
        const hashedPassword = await hashPassword(ownerPassword);
        await prisma.user.create({
          data: {
            name: String(name).trim(),
            email: cleanEmail,
            phone: String(phone).trim(),
            password: hashedPassword,
            role: "VENDOR_OWNER",
            vendorId: vendor.id,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      vendor,
      message: `Vendor "${vendor.name}" created successfully`,
    }, { status: 201 });
  } catch (err: unknown) {
    console.error("Failed to create vendor:", err);
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 });
  }
}
