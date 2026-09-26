import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const since = searchParams.get("since");

  try {
    if (!since) {
      // First poll / initial mount: return the timestamp of the latest order
      const latestOrder = await prisma.order.findFirst({
        orderBy: { createdAt: "desc" },
        select: { id: true, createdAt: true, orderNumber: true },
      });

      return NextResponse.json({
        orders: [],
        latestTimestamp: latestOrder ? latestOrder.createdAt.toISOString() : new Date().toISOString(),
      });
    }

    const sinceDate = new Date(since);
    if (isNaN(sinceDate.getTime())) {
      return NextResponse.json({ error: "Invalid timestamp" }, { status: 400 });
    }

    // Query orders created after `sinceDate`
    const newOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gt: sinceDate,
        },
      },
      orderBy: { createdAt: "asc" },
      take: 10,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerPhone: true,
        total: true,
        createdAt: true,
        status: true,
        items: {
          select: {
            id: true,
            title: true,
            quantity: true,
          },
        },
      },
    });

    const latestTimestamp =
      newOrders.length > 0
        ? newOrders[newOrders.length - 1].createdAt.toISOString()
        : since;

    return NextResponse.json({
      orders: newOrders,
      latestTimestamp,
    });
  } catch (err) {
    console.error("Error polling latest orders for admin:", err);
    return NextResponse.json({ error: "Failed to poll orders" }, { status: 500 });
  }
}
