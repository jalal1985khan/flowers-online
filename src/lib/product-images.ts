const FALLBACK =
  "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80";

function blockedImageHosts(): string[] {
  const raw = process.env.BLOCKED_IMAGE_HOSTS || process.env.NEXT_PUBLIC_BLOCKED_IMAGE_HOSTS || "";
  return raw
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

export type ProductImageRecord = {
  images: string[];
  cloudinaryImages?: string[];
};

function isBlocked(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return blockedImageHosts().some((b) => host === b || host.endsWith(`.${b}`));
  } catch {
    return true;
  }
}

function sanitizeUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  if (isBlocked(url)) return null;
  return url;
}

/** Pick display CDN: `imagekit` (default) or `cloudinary` via NEXT_PUBLIC_IMAGE_CDN */
export function getProductImageList(product: ProductImageRecord): string[] {
  const cdn = process.env.NEXT_PUBLIC_IMAGE_CDN || "imagekit";
  const ik = product.images.map((u) => sanitizeUrl(u)).filter(Boolean) as string[];
  const cl = (product.cloudinaryImages || [])
    .map((u) => sanitizeUrl(u))
    .filter(Boolean) as string[];

  if (cdn === "cloudinary" && cl.length > 0) return cl;
  if (ik.length > 0) return ik;
  if (cl.length > 0) return cl;
  return [FALLBACK];
}

export function getProductImage(product: ProductImageRecord): string {
  return getProductImageList(product)[0] || FALLBACK;
}

export function isAllowedRemoteImageHost(hostname: string): boolean {
  if (blockedImageHosts().some((b) => hostname === b || hostname.endsWith(`.${b}`))) {
    return false;
  }
  return true;
}
