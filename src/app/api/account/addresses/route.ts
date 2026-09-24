import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const addresses = await prisma.customerAddress.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ addresses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, address, city, pincode, landmark, label } = body;

    if (!name || !phone || !address || !pincode) {
      return NextResponse.json({ error: "Missing required address fields" }, { status: 400 });
    }

    const saved = await prisma.customerAddress.create({
      data: {
        name,
        phone,
        address,
        city: city || "Bengaluru",
        pincode,
        landmark: landmark || null,
        label: label || "HOME",
      },
    });

    return NextResponse.json({ success: true, address: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
