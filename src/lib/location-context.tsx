"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface DeliveryLocation {
  pincode: string;
  city: string;
  areaName?: string;
  isEligible: boolean;
}

const DEFAULT_LOCATION: DeliveryLocation = {
  pincode: "560001",
  city: "Bengaluru",
  areaName: "MG Road / Central",
  isEligible: true,
};

interface LocationContextType {
  location: DeliveryLocation;
  setLocation: (loc: DeliveryLocation) => void;
  isPincodeModalOpen: boolean;
  setIsPincodeModalOpen: (open: boolean) => void;
  checkPincode: (pin: string) => Promise<{ valid: boolean; city?: string; area?: string }>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const SUPPORTED_PINCODES: Record<string, { city: string; area: string }> = {
  "560001": { city: "Bengaluru", area: "MG Road / Central" },
  "560038": { city: "Bengaluru", area: "Indiranagar" },
  "560034": { city: "Bengaluru", area: "Koramangala" },
  "560068": { city: "Bengaluru", area: "Madiwala / HSR Layout" },
  "560100": { city: "Bengaluru", area: "Electronic City" },
  "560066": { city: "Bengaluru", area: "Whitefield" },
  "110001": { city: "Delhi", area: "Connaught Place / Central" },
  "110016": { city: "Delhi", area: "Hauz Khas / Green Park" },
  "122001": { city: "Gurugram", area: "Cyber City / Sector 29" },
  "400001": { city: "Mumbai", area: "Fort / South Mumbai" },
  "400050": { city: "Mumbai", area: "Bandra West" },
};

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<DeliveryLocation>(DEFAULT_LOCATION);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bloom_delivery_location");
      if (saved) {
        setLocationState(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const setLocation = (loc: DeliveryLocation) => {
    setLocationState(loc);
    try {
      localStorage.setItem("bloom_delivery_location", JSON.stringify(loc));
    } catch {
      // ignore
    }
  };

  const checkPincode = async (pin: string) => {
    const cleanPin = pin.trim();
    if (SUPPORTED_PINCODES[cleanPin]) {
      const info = SUPPORTED_PINCODES[cleanPin];
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
