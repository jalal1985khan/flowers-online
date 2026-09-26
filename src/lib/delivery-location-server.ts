import { cookies } from "next/headers";
import { DEFAULT_LOCATION, lookupPincode } from "@/lib/delivery-pincodes";

export interface ServerDeliveryLocation {
  pincode: string;
  city: string;
  areaName?: string;
  isEligible: boolean;
}

export async function getServerDeliveryLocation(): Promise<ServerDeliveryLocation> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("bloom_delivery_location")?.value;
  if (!raw) {
    return { ...DEFAULT_LOCATION };
  }
  try {
    const parsed = JSON.parse(raw) as ServerDeliveryLocation;
    if (parsed.pincode && lookupPincode(parsed.pincode)) {
      return parsed;
    }
  } catch {
    // fall through
  }
  return { ...DEFAULT_LOCATION };
}
