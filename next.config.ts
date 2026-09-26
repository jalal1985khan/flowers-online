import type { NextConfig } from "next";

function imageKitHostname(): string | null {
  const endpoint = process.env.IMAGEKIT_URL_ENDPOINT;
  if (!endpoint) return null;
  try {
    return new URL(endpoint).hostname;
  } catch {
    return null;
  }
}

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "plus.unsplash.com" },
  { protocol: "https", hostname: "**.unsplash.com" },
  { protocol: "https", hostname: "**.supabase.co" },
  { protocol: "https", hostname: "ik.imagekit.io" },
  { protocol: "https", hostname: "res.cloudinary.com" },
];

const ikHost = imageKitHostname();
if (ikHost && ikHost !== "ik.imagekit.io") {
  remotePatterns.push({ protocol: "https", hostname: ikHost });
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns,
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days cache for optimized images
  },
};

export default nextConfig;
