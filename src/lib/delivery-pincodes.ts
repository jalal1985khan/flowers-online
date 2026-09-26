/** Supported delivery pincodes — primary market: Guwahati (Assam). */

export interface PincodeInfo {
  city: string;
  area: string;
  state?: string;
}

export const SUPPORTED_PINCODES: Record<string, PincodeInfo> = {
  // Guwahati (primary)
  "781001": { city: "Guwahati", area: "Paltan Bazaar / Fancy Bazaar", state: "Assam" },
  "781003": { city: "Guwahati", area: "Pan Bazaar", state: "Assam" },
  "781005": { city: "Guwahati", area: "Uzan Bazaar", state: "Assam" },
  "781006": { city: "Guwahati", area: "Rehabari", state: "Assam" },
  "781007": { city: "Guwahati", area: "Latasil", state: "Assam" },
  "781012": { city: "Guwahati", area: "Zoo Road", state: "Assam" },
  "781022": { city: "Guwahati", area: "G S Road / Christian Basti", state: "Assam" },
  "781024": { city: "Guwahati", area: "Six Mile", state: "Assam" },
  "781028": { city: "Guwahati", area: "Beltola", state: "Assam" },
  "781036": { city: "Guwahati", area: "Dispur / Ganeshguri", state: "Assam" },
  "781014": { city: "Guwahati", area: "Maligaon", state: "Assam" },
  "781029": { city: "Guwahati", area: "Jalukbari", state: "Assam" },
};

export const DEFAULT_PINCODE = "781001";

export const DEFAULT_LOCATION = {
  pincode: DEFAULT_PINCODE,
  city: SUPPORTED_PINCODES[DEFAULT_PINCODE].city,
  areaName: SUPPORTED_PINCODES[DEFAULT_PINCODE].area,
  isEligible: true,
};

export function lookupPincode(pin: string): PincodeInfo | null {
  const clean = pin.trim();
  return SUPPORTED_PINCODES[clean] ?? null;
}

export const POPULAR_DELIVERY_ZONES = Object.entries(SUPPORTED_PINCODES)
  .slice(0, 9)
  .map(([pincode, info]) => ({
    pincode,
    city: info.city,
    area: info.area,
  }));

export const GUWAHATI_PINCODES = Object.keys(SUPPORTED_PINCODES);
