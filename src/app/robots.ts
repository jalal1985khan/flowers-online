import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo-config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/vendor/",
          "/api/",
          "/cart",
          "/checkout",
          "/account",
          "/login",
          "/search",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
