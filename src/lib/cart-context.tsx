"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartAddon {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  id: string; // unique item uuid in cart
  productId: string;
  vendorId: string;
  title: string;
  image: string;
  variantId?: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  isEggless?: boolean;
  messageOnCake?: string;
  messageOnCard?: string;
  deliveryDate?: string; // YYYY-MM-DD
  deliverySlotId?: string;
  deliverySlotTitle?: string;
  slotSurcharge?: number;
  addons?: CartAddon[];
}

export interface AppliedCoupon {
  code: string;
  discount: number;
  description: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  slotFeesTotal: number;
  appliedCoupon: AppliedCoupon | null;
  discountTotal: number;
  total: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message?: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bloom_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem("bloom_coupon");
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("bloom_cart", JSON.stringify(newItems));
    } catch {
      // ignore
    }
  };

  const addItem = (newItem: Omit<CartItem, "id">) => {
    const id = `${newItem.productId}-${newItem.variantId || "default"}-${Date.now()}`;
    const updated = [...items, { ...newItem, id }];
    saveItems(updated);
  };

  const removeItem = (cartItemId: string) => {
    const updated = items.filter((item) => item.id !== cartItemId);
    saveItems(updated);
  };

  const updateQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(cartItemId);
      return;
    }
    const updated = items.map((item) =>
      item.id === cartItemId ? { ...item, quantity: qty } : item
    );
    saveItems(updated);
  };

  const clearCart = () => {
    saveItems([]);
    removeCoupon();
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce((acc, item) => {
    const base = item.unitPrice * item.quantity;
    const addonsCost = (item.addons || []).reduce(
      (a, addon) => a + addon.price * addon.quantity,
      0
    );
    return acc + base + addonsCost;
  }, 0);

  const slotFeesTotal = items.reduce(
    (acc, item) => acc + (item.slotSurcharge || 0),
    0
  );

  const discountTotal = appliedCoupon ? Math.min(appliedCoupon.discount, subtotal) : 0;
  const total = Math.max(0, subtotal + slotFeesTotal - discountTotal);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        return { success: false, message: data.message || "Invalid coupon" };
      }
      const couponObj: AppliedCoupon = {
        code: data.code,
        discount: data.discount,
        description: data.description,
      };
      setAppliedCoupon(couponObj);
      localStorage.setItem("bloom_coupon", JSON.stringify(couponObj));
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message || "Failed to validate coupon" };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    try {
      localStorage.removeItem("bloom_coupon");
    } catch {
      // ignore
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        slotFeesTotal,
        appliedCoupon,
        discountTotal,
        total,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
