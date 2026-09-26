/** Cities with live vendor coverage and checkout enabled. */
export const LIVE_DELIVERY_CITY_SLUGS = ["guwahati"] as const;

export type LiveCitySlug = (typeof LIVE_DELIVERY_CITY_SLUGS)[number];

export const COMING_SOON_CITY_SLUGS = [
  "delhi",
  "mumbai",
  "bengaluru",
  "hyderabad",
  "pune",
  "kolkata",
] as const;

export function isCityLiveDelivery(citySlug: string): boolean {
  return LIVE_DELIVERY_CITY_SLUGS.includes(citySlug.toLowerCase() as LiveCitySlug);
}

export function citySlugFromPincodeCity(cityName: string): string {
  return cityName.toLowerCase().replace(/\s+/g, "-");
}
