"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  DEFAULT_LOCATION as DEFAULT_DELIVERY,
  lookupPincode,
} from "@/lib/delivery-pincodes";

export interface DeliveryLocation {
  pincode: string;
  city: string;
  areaName?: string;
  isEligible: boolean;
}

const DEFAULT_LOCATION: DeliveryLocation = { ...DEFAULT_DELIVERY };

interface LocationContextType {
  location: DeliveryLocation;
  setLocation: (loc: DeliveryLocation) => void;
  isPincodeModalOpen: boolean;
  setIsPincodeModalOpen: (open: boolean) => void;
  checkPincode: (pin: string) => Promise<{ valid: boolean; city?: string; area?: string }>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

function persistDeliveryLocation(loc: DeliveryLocation) {
  try {
    localStorage.setItem("bloom_delivery_location", JSON.stringify(loc));
    document.cookie = `bloom_delivery_location=${encodeURIComponent(JSON.stringify(loc))};path=/;max-age=31536000;SameSite=Lax`;
  } catch {
    // ignore
  }
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<DeliveryLocation>(DEFAULT_LOCATION);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bloom_delivery_location");
      if (saved) {
        const parsed = JSON.parse(saved) as DeliveryLocation;
        setLocationState(parsed);
        persistDeliveryLocation(parsed);
      } else {
        persistDeliveryLocation(DEFAULT_LOCATION);
      }
    } catch {
      persistDeliveryLocation(DEFAULT_LOCATION);
    }
  }, []);

  const setLocation = (loc: DeliveryLocation) => {
    setLocationState(loc);
    persistDeliveryLocation(loc);
  };

  const checkPincode = async (pin: string) => {
    const info = lookupPincode(pin.trim());
    if (info) {
      return { valid: true, city: info.city, area: info.area };
    }
    return { valid: false };
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        isPincodeModalOpen,
        setIsPincodeModalOpen,
        checkPincode,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
