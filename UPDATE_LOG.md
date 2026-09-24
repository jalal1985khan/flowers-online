# 🚀 Platform Update & Enhancement Log

**Project:** Flowers & Cakes Multi-Vendor Delivery Marketplace  
**Repository:** [https://github.com/jalal1985khan/flowers-online.git](https://github.com/jalal1985khan/flowers-online.git)  
**Main Branch:** `main`  
**Primary Maintainer:** Jalal Hussain (`jalal1985khan@gmail.com`)

---

## Release & Enhancement History

### [v1.4.1] – 2026-09-25: Image Remote Patterns Configuration Patch
- **Category:** Configuration & Bugfix
- **Enhancements:**
  - Configured `images.remotePatterns` in `next.config.ts` to allow Unsplash (`images.unsplash.com`, `plus.unsplash.com`, `**.unsplash.com`) and Supabase storage (`**.supabase.co`).
  - Resolved Next.js runtime error `Invalid src prop on next/image, hostname images.unsplash.com is not configured`.
  - Restarted Turbopack development server and validated production build.

---

### [v1.4.0] – 2026-09-25: FNP-Style Full-Width Mega Menu & Mobile Drawer
- **Category:** Storefront UX & Conversion Navigation
- **Enhancements:**
  - Designed & implemented comprehensive **FNP / IGP-style Mega Menu** (`src/components/storefront/mega-menu.tsx`).
  - **7 Primary Departments:** Flowers, Cakes, Combos & Hampers, Chocolates & Sweets, Plants, Occasions, and Express Same-Day & Midnight.
  - **Multi-Column Deep Categorization:**
    - Flowers: By Variety (Roses, Lilies, Carnations), By Arrangement (Bouquets, Boxes, Vases), By Occasion, and By Budget.
    - Cakes: By Flavor (Truffle, Red Velvet, Cheesecake), By Diet (100% Eggless, Heart-Shaped, Photo Cakes), and By Weight.
    - Combos: Gift pairings (Flowers + Cake, Cake + Teddy, Hampers), By Recipient (For Her, For Him).
    - Chocolates: Ferrero bouquets, artisan pralines, and Indian mithai.
    - Plants: Air-purifying, lucky bamboo, and jade in ceramic pots.
    - Express Delivery: 2-hour express links, midnight delivery slots, and city hubs.
  - **Visual Merchandising Promo Cards:** Each dropdown features a dedicated product teaser with photo, bestseller/trending badge, and direct 1-click CTA button.
  - **Interactive Hover Debouncing:** Built smooth cursor-transition delay (180ms) to eliminate dropdown flickering.
  - **Mobile Accordion Navigation Drawer:** Mobile menu upgraded to an expandable department accordion with direct sub-links and city selector.
  - Full production build tested and verified with zero errors.

---

### [v1.3.0] – 2026-09-25: Supabase SDK & SSR Infrastructure Integration
- **Commit:** [`231ac0d`](https://github.com/jalal1985khan/flowers-online/commit/231ac0d)
- **Category:** Infrastructure & External BaaS Integration
- **Enhancements:**
  - Installed official Supabase SDKs: `@supabase/supabase-js` and `@supabase/ssr`.
  - Built Next.js App Router client helper: `src/lib/supabase/client.ts` (`createBrowserClient`).
  - Built Next.js Server helper: `src/lib/supabase/server.ts` (`createServerClient` with asynchronous cookies integration).
  - Built Next.js Middleware session refresh utility: `src/lib/supabase/middleware.ts`.
  - Configured environment variable mappings for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - Full TypeScript and Next.js Turbopack build verification (`npm run build` completed with 0 errors).

---

### [v1.2.0] – 2026-09-24: Dedicated Role-Based Authentication & Portals
- **Commit:** [`f5aa25a`](https://github.com/jalal1985khan/flowers-online/commit/f5aa25a) (rewritten with official author email)
- **Category:** Authentication & Security (RBAC)
- **Enhancements:**
  - **Customer Portal (`/login`):**
    - Dual-mode Sign In and Sign Up tabs.
    - 1-Click Demo autofill button (`customer@example.com` / `Customer@123`).
    - Redirects to `/account`.
  - **Vendor Partner Portal (`/vendor/login`):**
    - Dedicated partner operations branding.
    - Role restriction: Only `VENDOR_OWNER` and `VENDOR_STAFF` can authenticate.
    - 1-Click Demo autofill button (`vendor@petalsbloom.in` / `Vendor@123`).
    - Redirects to `/vendor`.
  - **Super Admin Console (`/admin/login`):**
    - High-security console styling with dark mode accents.
    - Role restriction: Only `SUPER_ADMIN` and `OPERATIONS` can authenticate.
    - 1-Click Demo autofill button (`admin@bloomandbakes.com` / `Admin@123`).
    - Redirects to `/admin`.
  - **Security Core (`src/lib/auth.ts` & `/api/auth/*`):**
    - Passwords securely hashed with `bcryptjs` (salt rounds: 10).
    - Session cookies signed and verified using `jose` JWTs.
    - Cross-portal unauthorized defense: returns `403 Forbidden` if a customer attempts logging into Admin/Vendor consoles.
    - Storefront header updated with dynamic user avatar chip and one-click Sign Out.

---

### [v1.1.0] – 2026-09-24: Vendor Inventory, Coupons, Instant Search, City SEO & AI Growth Center
- **Commit:** [`877443b`](https://github.com/jalal1985khan/flowers-online/commit/877443b)
- **Category:** Core Marketplace Features & SEO
- **Enhancements:**
  - **Coupon Engine:**
    - Schema support for discount codes (`FIRST50`, `MIDNIGHT100`, `FESTIVE15`).
    - Real-time coupon validator API (`/api/coupons/validate`) with minimum order value checks and discount calculation.
    - Applied coupon discount breakdown integrated directly into cart and checkout total sums.
  - **Vendor Product & Inventory Management:**
    - Vendor product list (`/vendor/products`) with real-time in-stock/out-of-stock toggles.
    - Create new product page (`/vendor/products/new`) with category selection, price, and variant configuration.
    - Backend API (`/api/vendor/products`) for CRUD operations.
  - **Live Search & Discovery:**
    - Instant debounced search modal with live product and category autocomplete.
    - Dedicated search results page (`/search?q=...`).
    - Backend search endpoint (`/api/search`).
  - **Programmatic City Landing Pages (Hyperlocal SEO):**
    - Dynamic city route: `/city/[city]` (e.g. `/city/delhi`, `/city/mumbai`, `/city/bengaluru`, `/city/hyderabad`).
    - Localized delivery banners, local florist highlight, local pin code validator, and city-specific FAQ schema.
    - Auto-generated `sitemap.xml` and `robots.txt` for crawlability.
  - **Customer Account Management (`/account`):**
    - Tabbed view: Orders, Saved Addresses, Profile Settings.
    - Live order status badges, item breakdown, and re-order action.
    - Address book API (`/api/account/addresses`) for adding and selecting delivery addresses.
  - **Admin AI Growth Control Center (`/admin/growth`):**
    - Module toggles: AI Product Importer, Self-Healing SEO, Blog & Content Studio, Google Feed Sync.
    - AI-assisted product description and meta tag generator (`/api/ai/generate-content`).

---

### [v1.0.0] – 2026-09-24: Foundations, Multi-Tenant Database, Storefront & Checkouts
- **Commit:** [`88173cc`](https://github.com/jalal1985khan/flowers-online/commit/88173cc)
- **Category:** Architecture & MVP Foundations
- **Enhancements:**
  - Next.js 16 App Router + React 19 + Tailwind CSS + Lucide Icons foundation.
  - PostgreSQL schema with 30+ relational models:
    - Products, Variants, Categories, Add-On Groups, Add-On Items.
    - Vendors, Vendor Pincode Coverage, Time Slots, Delivery Options.
    - Orders, Order Items, Order Add-Ons, Order Events timeline.
    - Payments, Refunds, Coupons, Payouts, Reviews, AI Recommendations, System Settings.
  - Comprehensive Database Seeder (`prisma/seed.ts`) populating:
    - 4 Major vendors across Delhi NCR and Mumbai.
    - 6 Product categories (Roses, Bouquets, Cakes, Combos, Chocolates, Plants).
    - 12 High-fidelity products with weight variants, eggless tags, and preparation times.
    - Add-on upsell groups (Candles, Greeting Cards, Balloons, Chocolates).
    - 4 Pre-seeded delivery orders with complete event histories.
  - Storefront Pages:
    - Homepage (`/`) with Hero, Occasion cards, AI Gift Assistant widget, Curated collections.
    - Catalog (`/catalog`) with multi-faceted filtering (Category, Price, Rating, Eggless, Delivery Slot).
    - Product Details (`/product/[slug]`) with image gallery, cake message input, pin code checker, delivery date/slot selection, and add-on carousels.
    - Cart (`/cart`) with add-ons, free delivery progress, and discount code application.
    - Multi-step Checkout (`/checkout`) with address capture, recipient details, and Razorpay sandbox mock.
    - Live Order Tracking (`/orders/[orderNumber]/track`) with 5-stage timeline visual stepper.
  - Admin & Vendor Portals:
    - Vendor Dashboard (`/vendor`) and Live Order Kitchen/Florist Queue (`/vendor/orders`).
    - Admin Console (`/admin`), Vendor Management (`/admin/vendors`), Category Management (`/admin/categories`), Delivery Slot Engine (`/admin/delivery-slots`).
