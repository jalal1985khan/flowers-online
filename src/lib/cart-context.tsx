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

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  slotFeesTotal: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bloom_cart");
      if (saved) {
        setItems(JSON.parse(saved));
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

  const total = subtotal + slotFeesTotal;

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
        total,
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
