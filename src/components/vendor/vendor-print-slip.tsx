"use client";

import React, { useState } from "react";
import { type OrderData } from "./vendor-order-card";
import { formatINR } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Printer,
  Copy,
  Check,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Package,
  Heart,
  Cake,
  FileText,
} from "lucide-react";

interface VendorPrintSlipModalProps {
  order: OrderData;
  isOpen: boolean;
  onClose: () => void;
  vendorName?: string;
}

export function printOrderSlip(order: OrderData, vendorName?: string) {
  const printWindow = window.open("", "_blank", "width=850,height=950");
  if (!printWindow) {
    alert("Please allow popups to print the delivery slip.");
    return;
  }

  const deliveryDateFormatted = new Date(order.deliveryDate).toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const itemsHtml = order.items
    .map(
      (it, idx) => `
      <tr style="border-bottom: 1px solid #e4e4e7;">
        <td style="padding: 10px 8px; text-align: center; width: 40px;">
          <div style="width: 18px; height: 18px; border: 2px solid #71717a; border-radius: 3px; margin: 0 auto;"></div>
        </td>
        <td style="padding: 10px 8px; text-align: center; font-weight: bold; font-family: monospace; font-size: 14px; width: 50px;">
          ${it.quantity}x
        </td>
        <td style="padding: 10px 8px;">
          <div style="font-weight: 600; font-size: 13px; color: #18181b;">${it.title}</div>
          ${it.variantName
          ? `<div style="font-size: 11px; color: #71717a;">Variant: ${it.variantName}</div>`
          : ""
        }
          ${it.isEggless
          ? `<span style="display: inline-block; font-size: 10px; font-weight: bold; color: #166534; background: #dcfce7; padding: 1px 6px; border-radius: 4px; margin-top: 3px;">🌱 100% Eggless</span>`
          : ""
        }
          ${it.customCakeMessage
          ? `<div style="font-size: 11px; color: #9a3412; background: #fff7ed; padding: 3px 6px; border-radius: 4px; margin-top: 4px; border: 1px dashed #fdba74;">🎂 Cake Piping: "${it.customCakeMessage}"</div>`
          : ""
        }
        </td>
        <td style="padding: 10px 8px; text-align: right; font-family: monospace; font-weight: bold; font-size: 13px;">
          ₹${it.totalPrice.toLocaleString("en-IN")}
        </td>
      </tr>
    `
    )
    .join("");

  const slipHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Dispatch Slip - #${order.orderNumber}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 12mm 15mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #18181b;
          margin: 0;
          padding: 0;
          font-size: 12px;
          line-height: 1.4;
        }
        .container {
          max-width: 100%;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #18181b;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .brand-title {
          font-size: 22px;
          font-weight: 800;
          color: #e11d48;
          letter-spacing: -0.5px;
        }
        .brand-sub {
          font-size: 11px;
          color: #71717a;
          margin-top: 2px;
        }
        .order-badge {
          text-align: right;
        }
        .order-num {
          font-family: monospace;
          font-size: 18px;
          font-weight: 800;
          color: #18181b;
        }
        .status-pill {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          background: #f4f4f5;
          padding: 2px 8px;
          border-radius: 999px;
          margin-top: 4px;
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 16px;
        }
        .card {
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          padding: 12px;
          background: #fafafa;
        }
        .card-header {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid #e4e4e7;
        }
        .receiver-header {
          color: #e11d48;
        }
        .sender-header {
          color: #2563eb;
        }
        .field {
          margin-bottom: 4px;
        }
        .label {
          font-size: 10px;
          color: #71717a;
          text-transform: uppercase;
        }
        .value {
          font-weight: 600;
          color: #18181b;
        }
        .value-large {
          font-size: 14px;
          font-weight: 700;
        }
        .slot-banner {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          border-radius: 8px;
          padding: 10px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .slot-title {
          font-size: 13px;
          font-weight: 700;
          color: #be123c;
        }
        .slot-time {
          font-size: 12px;
          font-weight: 600;
          color: #9f1239;
        }
        .message-box {
          border: 1px dashed #e11d48;
          background: #fff5f7;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 16px;
        }
        .message-title {
          font-size: 11px;
          font-weight: 800;
          color: #be123c;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .message-text {
          font-size: 13px;
          font-style: italic;
          color: #4c0519;
          line-height: 1.5;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
        }
        th {
          background: #f4f4f5;
          padding: 8px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: #71717a;
          border-bottom: 1px solid #d4d4d8;
        }
        .signoff {
          margin-top: 24px;
          padding-top: 14px;
          border-top: 1px dashed #d4d4d8;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
          text-align: center;
        }
        .sign-line {
          border-bottom: 1px solid #71717a;
          height: 35px;
          margin-bottom: 4px;
        }
        .sign-label {
          font-size: 10px;
          color: #71717a;
          text-transform: uppercase;
          font-weight: 600;
        }
        .footer-note {
          text-align: center;
          font-size: 10px;
          color: #a1a1aa;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Top Header -->
        <div class="header">
          <div>
            <div class="brand-title">MyPetalsCart</div>
            <div class="brand-sub">Artisan Flower & Cake Delivery • Kitchen & Dispatch Slip</div>
            ${vendorName ? `<div style="font-size: 10px; color: #52525b; margin-top: 2px;">Vendor: <strong>${vendorName}</strong></div>` : ""}
          </div>
          <div class="order-badge">
            <div class="order-num">#${order.orderNumber}</div>
            <div class="status-pill">${order.status.replace("_", " ")}</div>
          </div>
        </div>

        <!-- Delivery Schedule Banner -->
        <div class="slot-banner">
          <div>
            <div style="font-size: 10px; text-transform: uppercase; color: #9f1239; font-weight: 700;">Scheduled Delivery Date</div>
            <div class="slot-title">${deliveryDateFormatted}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 10px; text-transform: uppercase; color: #9f1239; font-weight: 700;">Time Slot</div>
            <div class="slot-time">${order.deliverySlot.title} (${order.deliverySlot.startTime} - ${order.deliverySlot.endTime})</div>
          </div>
        </div>

        <!-- Receiver & Sender Grid -->
        <div class="grid-2">
          <!-- Recipient Details -->
          <div class="card" style="border-color: #fecdd3; background: #fffcfd;">
            <div class="card-header receiver-header">
              📍 DELIVER TO (RECIPIENT)
            </div>
            <div class="field">
              <div class="label">Recipient Name</div>
              <div class="value-large" style="color: #9f1239;">${order.recipientName}</div>
            </div>
            <div class="field" style="margin-top: 6px;">
              <div class="label">Contact Phone</div>
              <div class="value" style="font-family: monospace; font-size: 14px;">${order.recipientPhone}</div>
            </div>
            <div class="field" style="margin-top: 6px;">
              <div class="label">Full Delivery Address</div>
              <div class="value" style="font-size: 12px; line-height: 1.4;">
                ${order.deliveryAddress}
                ${order.landmark ? `<br><span style="color: #71717a;">Landmark: Near ${order.landmark}</span>` : ""}
                <br><strong>${order.deliveryCity} — ${order.deliveryPincode}</strong>
              </div>
            </div>
            ${order.deliveryInstructions
      ? `<div style="margin-top: 8px; padding: 6px 8px; background: #fef2f2; border: 1px solid #fee2e2; border-radius: 4px; font-size: 11px; color: #991b1b;">
                    <strong>Instructions:</strong> ${order.deliveryInstructions}
                  </div>`
      : ""
    }
          </div>

          <!-- Customer / Sender Details -->
          <div class="card">
            <div class="card-header sender-header">
              👤 ORDERED BY (SENDER)
            </div>
            <div class="field">
              <div class="label">Customer Name</div>
              <div class="value-large">${order.customerName}</div>
            </div>
            <div class="field" style="margin-top: 6px;">
              <div class="label">Customer Phone</div>
              <div class="value" style="font-family: monospace;">${order.customerPhone}</div>
            </div>
            ${order.customerEmail
      ? `<div class="field" style="margin-top: 6px;">
                    <div class="label">Customer Email</div>
                    <div class="value" style="font-size: 11px;">${order.customerEmail}</div>
                  </div>`
      : ""
    }
            <div class="field" style="margin-top: 12px; padding: 8px; background: #f4f4f5; border-radius: 6px;">
              <div style="font-size: 10px; color: #71717a; text-transform: uppercase;">Payment Details</div>
              <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 2px;">
                <span>Total Amount:</span>
                <span style="font-family: monospace;">₹${order.total.toLocaleString("en-IN")}</span>
              </div>
              <div style="font-size: 10px; color: #16a34a; font-weight: 600; margin-top: 2px;">
                ✓ Online Prepaid Order
              </div>
            </div>
          </div>
        </div>

        <!-- Greeting Card Message (if any) -->
        ${order.messageOnCard
      ? `
          <div class="message-box">
            <div class="message-title">💌 Greeting Card Message to Attach:</div>
            <div class="message-text">"${order.messageOnCard}"</div>
          </div>
        `
      : ""
    }

        <!-- Cake Message (if any) -->
        ${order.messageOnCake
      ? `
          <div class="message-box" style="border-color: #f97316; background: #fffaf0;">
            <div class="message-title" style="color: #c2410c;">🎂 Special Cake Message:</div>
            <div class="message-text" style="color: #7c2d12;">"${order.messageOnCake}"</div>
          </div>
        `
      : ""
    }

        <!-- Items Checklist -->
        <div>
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #3f3f46; margin-bottom: 6px;">
            📦 Items to Prepare & Pack (${order.items.length} item${order.items.length > 1 ? "s" : ""})
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 40px;">Pack</th>
                <th style="width: 50px;">Qty</th>
                <th style="text-align: left;">Product & Customization Details</th>
                <th style="text-align: right; width: 80px;">Item Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <!-- Sign-off Lines -->
        <div class="signoff">
          <div>
            <div class="sign-line"></div>
            <div class="sign-label">Prepared By (Florist/Baker)</div>
          </div>
          <div>
            <div class="sign-line"></div>
            <div class="sign-label">Handover to Delivery Rider</div>
          </div>
          <div>
            <div class="sign-line"></div>
            <div class="sign-label">Recipient Signature / Delivery Proof</div>
          </div>
        </div>

        <div class="footer-note">
          MyPetalsCart Dispatch Sheet • Generated on ${new Date().toLocaleString("en-IN")} • Handle fresh flowers and delicate cakes with utmost care.
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(slipHtml);
  printWindow.document.close();

  // Give resources a brief moment to render, then open system print dialog
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 350);
}

export function VendorPrintSlipModal({
  order,
  isOpen,
  onClose,
  vendorName,
}: VendorPrintSlipModalProps) {
  const [copied, setCopied] = useState(false);

  const copyAddressAndContact = () => {
    const text = `Order #${order.orderNumber}
Recipient: ${order.recipientName}
Phone: ${order.recipientPhone}
Address: ${order.deliveryAddress}${order.landmark ? `, Near ${order.landmark}` : ""}
City: ${order.deliveryCity} - ${order.deliveryPincode}
Delivery Slot: ${order.deliverySlot.title}
Items: ${order.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}
${order.deliveryInstructions ? `Instructions: ${order.deliveryInstructions}` : ""}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 pr-6">
            <div>
              <DialogTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-rose-600" />
                <span>Delivery & Dispatch Slip</span>
              </DialogTitle>
              <p className="text-xs text-zinc-500 mt-0.5">
                Order <span className="font-mono font-bold text-zinc-900">#{order.orderNumber}</span> • Receiver & Sender details
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyAddressAndContact}
                className="text-xs gap-1.5 h-8 border-zinc-200"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Copy Text</span>
                  </>
                )}
              </Button>

              <Button
                size="sm"
                onClick={() => printOrderSlip(order, vendorName)}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1.5 h-8 font-semibold shadow-xs"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Slip</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Printable Preview Container */}
        <div className="space-y-4 pt-1 text-xs">
          {/* Slot Header */}
          <div className="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-xl p-3">
            <div className="flex items-center gap-2 text-rose-900 font-semibold">
              <Calendar className="h-4 w-4 text-rose-600 shrink-0" />
              <span>
                {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-900 font-semibold">
              <Clock className="h-4 w-4 text-rose-600 shrink-0" />
              <span>
                {order.deliverySlot.title} ({order.deliverySlot.startTime} - {order.deliverySlot.endTime})
              </span>
            </div>
          </div>

          {/* Receiver & Sender 2-col box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Receiver */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-rose-200">
                <MapPin className="h-3.5 w-3.5 text-rose-600" />
                <span>Receiver (Deliver To)</span>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Recipient Name</div>
                <div className="text-sm font-bold text-zinc-900">{order.recipientName}</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Contact Number</div>
                <div className="font-mono font-bold text-zinc-900">{order.recipientPhone}</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Delivery Address</div>
                <div className="text-zinc-800 font-medium leading-relaxed">
                  {order.deliveryAddress}
                  {order.landmark && (
                    <div className="text-zinc-600 text-[11px]">Landmark: Near {order.landmark}</div>
                  )}
                  <div className="font-bold text-zinc-900 mt-0.5">
                    {order.deliveryCity} — {order.deliveryPincode}
                  </div>
                </div>
              </div>
              {order.deliveryInstructions && (
                <div className="rounded bg-rose-100/70 p-2 text-rose-900 text-[11px] font-medium border border-rose-200">
                  <strong>Delivery Note:</strong> {order.deliveryInstructions}
                </div>
              )}
            </div>

            {/* Sender */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-blue-800 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-zinc-200">
                <User className="h-3.5 w-3.5 text-blue-600" />
                <span>Sender (Ordered By)</span>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Customer Name</div>
                <div className="text-sm font-bold text-zinc-900">{order.customerName}</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Contact Number</div>
                <div className="font-mono font-bold text-zinc-900">{order.customerPhone}</div>
              </div>
              {order.customerEmail && (
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">Email Address</div>
                  <div className="text-zinc-700 truncate">{order.customerEmail}</div>
                </div>
              )}
              <div className="rounded-lg bg-white border border-zinc-200 p-2.5 mt-2">
                <div className="flex justify-between items-center text-xs font-bold text-zinc-900">
                  <span>Order Total:</span>
                  <span className="font-mono text-sm">{formatINR(order.total)}</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                  ✓ Prepaid Online
                </div>
              </div>
            </div>
          </div>

          {/* Greeting Card Message */}
          {order.messageOnCard && (
            <div className="rounded-xl border border-rose-300 bg-rose-50/50 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold text-[11px] uppercase tracking-wider">
                <Heart className="h-3.5 w-3.5 text-rose-600" />
                <span>Greeting Card Inscription:</span>
              </div>
              <div className="italic text-rose-950 font-serif text-sm bg-white p-2.5 rounded-lg border border-rose-200">
                "{order.messageOnCard}"
              </div>
            </div>
          )}

          {/* Cake Inscription */}
          {order.messageOnCake && (
            <div className="rounded-xl border border-amber-300 bg-amber-50/50 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold text-[11px] uppercase tracking-wider">
                <Cake className="h-3.5 w-3.5 text-amber-600" />
                <span>Cake Piping Message:</span>
              </div>
              <div className="text-amber-950 font-semibold text-xs bg-white p-2.5 rounded-lg border border-amber-200">
                "{order.messageOnCake}"
              </div>
            </div>
          )}

          {/* Items Checklist */}
          <div className="rounded-xl border border-zinc-200 bg-white p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-zinc-800 font-bold text-[11px] uppercase tracking-wider pb-1 border-b border-zinc-100">
              <Package className="h-3.5 w-3.5 text-zinc-500" />
              <span>Kitchen & Florist Preparation Checklist ({order.items.length})</span>
            </div>
            <div className="divide-y divide-zinc-100">
              {order.items.map((it) => (
                <div key={it.id} className="py-2 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-zinc-900 text-xs">
                      {it.quantity}x {it.title}
                    </div>
                    {it.variantName && (
                      <div className="text-zinc-500 text-[11px]">Variant: {it.variantName}</div>
                    )}
                    {it.isEggless && (
                      <span className="inline-block rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800 mt-1">
                        🌱 Eggless
                      </span>
                    )}
                    {it.customCakeMessage && (
                      <div className="mt-1 text-[11px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        🎂 Cake Piping: "{it.customCakeMessage}"
                      </div>
                    )}
                  </div>
                  <span className="font-mono font-bold text-zinc-900 shrink-0">
                    {formatINR(it.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
          <Button
            size="sm"
            onClick={() => printOrderSlip(order, vendorName)}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1.5 font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Delivery Slip</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
