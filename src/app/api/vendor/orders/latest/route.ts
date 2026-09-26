import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getSession();
  if (
    !session ||
    (session.role !== "VENDOR_OWNER" &&
      session.role !== "VENDOR_STAFF" &&
      session.role !== "SUPER_ADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const vendor =
    session.vendorId != null
      ? await prisma.vendor.findUnique({ where: { id: session.vendorId } })
      : await prisma.vendor.findFirst({ where: { isActive: true } });

  const vendorId = vendor?.id;
  if (!vendorId) {
    return NextResponse.json({ error: "No vendor linked" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const since = searchParams.get("since");

  try {
    if (!since) {
      // Baseline fetch: get the timestamp of the latest order for this vendor
      const latestOrder = await prisma.order.findFirst({
        where: {
          items: { some: { vendorId } },
        },
        orderBy: { createdAt: "desc" },
        select: { id: true, createdAt: true },
      });

      return NextResponse.json({
        orders: [],
        latestTimestamp: latestOrder
          ? latestOrder.createdAt.toISOString()
          : new Date().toISOString(),
      });
    }

    const sinceDate = new Date(since);
    if (isNaN(sinceDate.getTime())) {
      return NextResponse.json({ error: "Invalid timestamp" }, { status: 400 });
    }

    const newOrders = await prisma.order.findMany({
      where: {
        items: { some: { vendorId } },
        createdAt: { gt: sinceDate },
      },
      include: {
        deliverySlot: true,
        items: {
          where: { vendorId },
        },
      },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    const latestTimestamp =
      newOrders.length > 0
        ? newOrders[newOrders.length - 1].createdAt.toISOString()
        : since;

    return NextResponse.json({
      orders: newOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        recipientName: o.recipientName,
        recipientPhone: o.recipientPhone,
        total: o.total,
        deliverySlot: o.deliverySlot.title,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((i) => ({
          id: i.id,
          title: i.title,
          quantity: i.quantity,
        })),
      })),
      latestTimestamp,
    });
  } catch (err) {
    console.error("Vendor order polling error:", err);
    return NextResponse.json({ error: "Failed to poll orders" }, { status: 500 });
  }
}
