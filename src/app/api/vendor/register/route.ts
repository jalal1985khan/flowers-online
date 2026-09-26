import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      ownerName,
      email,
      password,
      phone,
      businessName,
      city,
      state,
      address,
      primaryPincode,
      prepTimeMinutes,
      servicePincodes,
    } = body;

    if (!businessName || !ownerName || !email || !password || !phone || !city) {
      return NextResponse.json(
        { error: "Business Name, Owner Name, Email, Password, Phone, and City are required" },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).toLowerCase().trim();

    // Check if email already exists in User or Vendor
    const [existingUser, existingVendor] = await Promise.all([
      prisma.user.findUnique({ where: { email: cleanEmail } }),
      prisma.vendor.findUnique({ where: { email: cleanEmail } }),
    ]);

    if (existingUser || existingVendor) {
      return NextResponse.json(
        { error: `An account with email "${cleanEmail}" already exists. Please log in instead.` },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = businessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const slugCollision = await prisma.vendor.findUnique({ where: { slug } });
    if (slugCollision) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Prepare pincodes array
    let allPincodes: string[] = [];
    if (primaryPincode && /^\d{6}$/.test(String(primaryPincode).trim())) {
      allPincodes.push(String(primaryPincode).trim());
    }
    if (Array.isArray(servicePincodes)) {
      servicePincodes.forEach((p: unknown) => {
        const pin = String(p).trim();
        if (/^\d{6}$/.test(pin) && !allPincodes.includes(pin)) {
          allPincodes.push(pin);
        }
      });
    }

    const hashedPassword = await hashPassword(password);

    // Create Vendor
    const vendor = await prisma.vendor.create({
      data: {
        name: String(businessName).trim(),
        slug,
        email: cleanEmail,
        phone: String(phone).trim(),
        city: String(city).trim(),
        state: state ? String(state).trim() : "Assam",
        address: address ? String(address).trim() : `${city}, India`,
        commissionRate: 15.0,
        prepTimeMinutes: prepTimeMinutes ? Number(prepTimeMinutes) : 45,
        isApproved: false, // Subject to admin review
        isActive: true,
        serviceAreas: allPincodes.length > 0
          ? {
              create: allPincodes.map((pin) => ({
                pincode: pin,
                city: String(city).trim(),
                isSameDaySupported: true,
                isMidnightSupported: true,
                isFixedTimeSupported: true,
              })),
            }
          : undefined,
        users: {
          create: {
            name: String(ownerName).trim(),
            email: cleanEmail,
            phone: String(phone).trim(),
            password: hashedPassword,
            role: "VENDOR_OWNER",
          },
        },
      },
      include: {
        serviceAreas: true,
        users: { select: { id: true, email: true, name: true, role: true } },
      },
    });

    return NextResponse.json({
      success: true,
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        city: vendor.city,
        isApproved: vendor.isApproved,
      },
      message: "Vendor registration submitted successfully! Your account will be reviewed by platform operations.",
    }, { status: 201 });
  } catch (err: unknown) {
    console.error("Vendor registration failed:", err);
    return NextResponse.json(
      { error: "Failed to complete vendor registration. Please try again." },
      { status: 500 }
    );
  }
}
