"use client";

import React from "react";
import { LocationProvider } from "@/lib/location-context";
import { CartProvider } from "@/lib/cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider>
      <CartProvider>{children}</CartProvider>
    </LocationProvider>
  );
}
