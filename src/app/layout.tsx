import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

import { getBaseUrl, getSiteName } from "@/lib/seo-config";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "MyPetalsCart — Flowers • Cakes • Gifts • Delivered With Love",
    template: `%s | ${getSiteName()}`,
  },
  description:
    "MyPetalsCart: Flowers • Cakes • Gifts • Delivered With Love. Order hand-tied fresh floral bouquets, gourmet artisan cakes, and celebration gift hampers with guaranteed same-day and midnight delivery.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: getBaseUrl(),
    siteName: getSiteName(),
    title: "MyPetalsCart — Flowers • Cakes • Gifts • Delivered With Love",
    description:
      "Order hand-tied fresh floral bouquets, gourmet artisan cakes, and celebration gift hampers with guaranteed same-day and midnight delivery.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyPetalsCart — Flowers • Cakes • Gifts • Delivered With Love",
    description:
      "Order hand-tied fresh floral bouquets, gourmet artisan cakes, and celebration gift hampers with guaranteed same-day and midnight delivery.",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: ["/favicon.png"],
    apple: [
      { url: "/favicon.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: getSiteName(),
    url: getBaseUrl(),
    logo: `${getBaseUrl()}/logo.png`,
    description:
      "Online marketplace for hand-tied fresh floral bouquets, artisanal celebration cakes, and gift hampers delivered across India.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${getBaseUrl()}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        />

        <Providers>{children}</Providers>
        {/* SocialHive Chat Widget */}
        {/* <Script
          src="http://localhost:3000/embed/socialhive-chat.js"
          data-site-key="sh_pub_VdidOsFBF3lsSNihCi1KdVd"
          strategy="afterInteractive"
        /> */}
      </body>
    </html>
  );
}
