import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ addresses: [] });
    }

    const addresses = await prisma.customerAddress.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ addresses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ success: true, guest: true });
    }

    const body = await request.json();
    const { name, phone, address, city, pincode, landmark, label } = body;

    if (!name || !phone || !address) {
      return NextResponse.json({ error: "Missing required address fields" }, { status: 400 });
    }

    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    // Prevent duplicate entries for the same user
    const existing = await prisma.customerAddress.findFirst({
      where: {
        userId: session.id,
        phone: trimmedPhone,
        address: trimmedAddress,
      },
    });

    if (existing) {
      return NextResponse.json({ success: true, address: existing });
    }

    const saved = await prisma.customerAddress.create({
      data: {
        userId: session.id,
        name: name.trim(),
        phone: trimmedPhone,
        address: trimmedAddress,
        city: city || "Guwahati",
        pincode: pincode || "781001",
        landmark: landmark?.trim() || null,
        label: label || "HOME",
      },
    });

    return NextResponse.json({ success: true, address: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing address ID" }, { status: 400 });
    }

    await prisma.customerAddress.deleteMany({
      where: { id, userId: session.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

