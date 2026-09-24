import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [categories, occasions] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.occasion.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    return NextResponse.json({ categories, occasions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
