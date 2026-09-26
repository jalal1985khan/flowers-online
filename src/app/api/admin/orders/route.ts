import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const limit = Math.min(Number(searchParams.get("limit") || 50), 200);

  const orders = await prisma.order.findMany({
    where: status && status !== "all" ? { status: status as never } : undefined,
    include: {
      deliverySlot: true,
      items: { include: { vendor: true } },
      events: { orderBy: { createdAt: "desc" }, take: 3 },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ orders });
}
