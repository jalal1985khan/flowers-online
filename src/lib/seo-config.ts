/**
 * Centralized SEO Configuration and Helpers
 * Aligned with MyPetalsCart SEO Engineering Skill
 */

export function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/+$/, "");
  }
  // Production fallback if environment variable is missing
  return process.env.NODE_ENV === "production"
    ? "https://mypetalscart.com"
    : "http://localhost:3000";
}

export function getSiteName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME || "MyPetalsCart";
}

export function buildCanonicalUrl(path: string): string {
  const base = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : buildCanonicalUrl(item.url),
    })),
  };
}
