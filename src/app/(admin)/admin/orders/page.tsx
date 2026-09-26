import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { AdminOrderStatusSelect } from "@/components/admin/admin-order-status-select";
import { AdminOrderVendorSelect } from "@/components/admin/admin-order-vendor-select";
import { Package, ArrowLeft, Clock, CreditCard, Store } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const [orders, vendors] = await Promise.all([
    prisma.order.findMany({
      include: {
        deliverySlot: true,
        items: {
          include: {
            vendor: { select: { id: true, name: true, city: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.vendor.findMany({
      where: { isActive: true },
      select: { id: true, name: true, city: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-foreground tracking-tight">
            <Package className="h-5 w-5 text-rose-500" />
            <span>Orders Queue</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time marketplace fulfillment routing, vendor assignment & settlement</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-border text-foreground font-mono text-xs">
            <Store className="h-3 w-3 mr-1 text-rose-500" />
            {vendors.length} Active Vendors
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs">
            {orders.length} Orders
          </Badge>
        </div>
      </div>

      <Card className="overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px]">Order #</TableHead>
              <TableHead className="text-[11px]">Customer</TableHead>
              <TableHead className="text-[11px]">Delivery Location</TableHead>
              <TableHead className="text-[11px]">Amount</TableHead>
              <TableHead className="text-[11px]">Payment</TableHead>
              <TableHead className="text-[11px]">Route to Vendor</TableHead>
              <TableHead className="text-[11px]">Fulfillment Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const uniqueVendorIds = Array.from(
                new Set(order.items.map((i) => i.vendorId).filter(Boolean))
              );
              const primaryVendorId =
                uniqueVendorIds.length === 1
                  ? uniqueVendorIds[0]
                  : order.items[0]?.vendorId || null;
              const primaryVendorName = order.items.find(
                (i) => i.vendorId === primaryVendorId
              )?.vendor?.name;

              return (
                <TableRow key={order.id}>
                  <TableCell className="p-4 font-mono">
                    <Link href={`/order/${order.orderNumber}`} className="font-semibold text-primary hover:underline">
                      {order.orderNumber}
                    </Link>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{order.items.length} items</div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="font-semibold text-foreground text-xs">{order.customerName}</div>
                    <div className="text-[11px] text-muted-foreground">{order.customerPhone}</div>
                  </TableCell>
                  <TableCell className="p-4 text-muted-foreground text-xs">
                    <div className="text-foreground font-medium">{order.deliveryCity} · {order.deliveryPincode}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{order.deliverySlot?.title}</div>
                  </TableCell>
                  <TableCell className="p-4 font-mono font-semibold text-foreground text-xs">
                    {formatINR(order.total)}
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge
                      variant={order.paymentStatus === "PAID" ? "success" : "warning"}
                      className="font-mono text-[10px] uppercase"
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4">
                    <AdminOrderVendorSelect
                      orderId={order.id}
                      currentVendorId={primaryVendorId}
                      currentVendorName={primaryVendorName}
                      vendors={vendors}
                    />
                    {uniqueVendorIds.length > 1 && (
                      <span className="block mt-1 text-[10px] text-amber-500 font-mono">
                        (Split across {uniqueVendorIds.length} vendors)
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="p-4">
                    <AdminOrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

