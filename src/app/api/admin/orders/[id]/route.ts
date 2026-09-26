import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { requireAdminSession } from "@/lib/admin-auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const { status, paymentStatus, vendorId, itemId, note } = body;

  const currentOrder = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!currentOrder) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Handle vendor re-routing
  if (vendorId) {
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    if (itemId) {
      await prisma.orderItem.update({
        where: { id: itemId },
        data: { vendorId },
      });
    } else {
      await prisma.orderItem.updateMany({
        where: { orderId: id },
        data: { vendorId },
      });
    }

    await prisma.orderEvent.create({
      data: {
        orderId: id,
        status: (status as OrderStatus) || currentOrder.status,
        note: note || `Admin routed order to vendor ${vendor.name} (${vendor.city})`,
        actorRole: "ADMIN",
      },
    });
  }

  const data: Record<string, unknown> = {};
  if (status && Object.values(OrderStatus).includes(status)) {
    data.status = status;
  }
  if (paymentStatus) {
    data.paymentStatus = paymentStatus;
  }

  let updated = currentOrder;
  if (Object.keys(data).length > 0) {
    updated = await prisma.order.update({
      where: { id },
      data: {
        ...data,
        events: status
          ? {
            create: {
              status: status as OrderStatus,
              note: note || `Admin updated status to ${status}`,
              actorRole: "ADMIN",
            },
          }
          : undefined,
      },
      include: {
        items: {
          include: {
            vendor: { select: { id: true, name: true, city: true } },
          },
        },
      },
    });
  } else if (vendorId) {
    updated = (await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            vendor: { select: { id: true, name: true, city: true } },
          },
        },
      },
    }))!;
  } else {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  return NextResponse.json({ success: true, order: updated, actor: session!.email });
}
