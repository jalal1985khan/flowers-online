# 🚀 Platform Update & Enhancement Log

**Project:** Flowers & Cakes Multi-Vendor Delivery Marketplace  
**Repository:** [https://github.com/jalal1985khan/flowers-online.git](https://github.com/jalal1985khan/flowers-online.git)  
**Main Branch:** `main`  
**Primary Maintainer:** Jalal Hussain (`jalal1985khan@gmail.com`)

---

## Release & Enhancement History
 
### [v1.8.16] – 2026-09-26: Strict shadcn UI Migration & Dynamic Theme Architecture
- **Category:** Design System, Component Library & Theme Engine
- **User Requests Addressed:**
  - *"admin section is showing in dark theme why and check is it comptely using the shadcn UI components?"*
  - *"yes completly and strictly use the shadcn UI and its compoenents"*
- **Enhancements:**
  1. **Strict shadcn Component Suite Installed & Built:**
     - Created `Select` (`@radix-ui/react-select`) with trigger, content, item, group, separator.
     - Created `Switch` (`@radix-ui/react-switch`) for accessible toggle switches.
     - Created `Label` (`@radix-ui/react-label`) for form labels.
     - Created `DropdownMenu` (`@radix-ui/react-dropdown-menu`) for action menus.
     - Upgraded `Dialog` (`@radix-ui/react-dialog`) to full Radix primitive architecture.
  2. **Strict Component Migrations across Admin Console:**
     - Migrated all raw `<select>` elements in Orders, Products, Addons, Coupons, SEO, and Growth pages to shadcn `<Select>`.
     - Migrated vendor toggles and product/addon modal stock checkboxes from raw `<input type="checkbox">` to shadcn `<Switch>` and `<Label>`.
  3. **Theme Flexibility & Admin Theme Switcher:**
     - Freed Admin Console from forced dark mode; now built entirely on shadcn semantic CSS tokens (`bg-background`, `text-foreground`, `bg-card`, `border-border`).
     - Added `<AdminThemeToggle />` to sidebar allowing 1-click toggling between Light and Dark mode with persistence in `localStorage`.

---


- **Category:** Admin Orders & Marketplace Operations
- **User Requests Addressed:**
  - *"here also give option to route the order to vendor"* (Added vendor routing option directly in the Admin Orders Queue table)
- **Enhancements:**
  1. **Vendor Routing Dropdown Component (`src/components/admin/admin-order-vendor-select.tsx`):**
     - Dark-mode styled selector in the Admin Orders table showing currently routed vendor and all active fulfillment partners with city.
     - 1-click reassignment of the order to any active vendor.
     - Live visual feedback (loading spinner, checkmark, and green "ROUTED!" notification).
  2. **Admin Orders Queue Table Update (`src/app/(admin)/admin/orders/page.tsx`):**
     - Added dedicated `ROUTE TO VENDOR` column.
     - Real-time display of active vendors count in the header.
  3. **Order Routing API (`src/app/api/admin/orders/[id]/route.ts`):**
     - Supported `vendorId` in `PATCH` requests to update order item vendor mappings and record audit events in `OrderEvent`.

---


- **Category:** Vendor Operations, Order Routing & Fulfillment
- **User Requests Addressed:**
  - *"i have placed the order why it was not routed to vendor also to accept the order"*
- **Enhancements:**
  1. **Order Routing Audit:**
     - Verified that orders placed with Guwahati delivery address (e.g. `#BNB-2026-164174`) are correctly assigned to the Guwahati local vendor partner (`Araz Flora Guwahati`, `cmufzcidy00046r0lw16sd8nt`) in `OrderItem.vendorId`.
  2. **Guwahati Vendor Authentication Account:**
     - Provisioned active `User` account for `Araz Flora Guwahati`:
       - Email: `guwahati@bloomandbakes.com`
       - Password: `Vendor@123`
       - Role: `Role.VENDOR_OWNER`
  3. **Multi-Vendor Login Autofill UI (`src/app/(auth)/vendor/login/page.tsx`):**
     - Updated vendor login page to support both **Guwahati Partner (Araz Flora)** and **Bengaluru Florist (Petals & Bloom)** with 1-click autofill buttons.
  4. **Admin Order Status Fix (`src/components/admin/admin-order-status-select.tsx`):**
     - Aligned dropdown status choices with Prisma's `OrderStatus` enum (`ACCEPTED` instead of `CONFIRMED`).
  5. **Seeder Update (`prisma/seed.ts`):**
     - Added vendor user accounts for all partners so fresh seedings retain multi-vendor portal access.

---


- **Category:** Storefront PDP, Visual Commerce & UX
- **User Requests Addressed:**
  - *"on click of product image its should switch to that product image"* (Interactive thumbnail image switcher on PDP)
- **Enhancements:**
  1. **Interactive Image Gallery Component (`src/components/storefront/product-image-gallery.tsx`):**
     - Clicking or hovering any product thumbnail immediately switches the active hero product image with smooth CSS transitions.
     - Active thumbnail features a highlighted border and ring (`border-primary ring-2 ring-primary/30 ring-offset-1 scale-[1.02] shadow-sm`).
     - Includes previous and next navigation chevron buttons overlaid on the main image for easy multi-angle viewing.
     - Added an image counter pill (`1 / 2`) and preserved the vegetarian/eggless badge.
  2. **PDP Integration (`src/app/(storefront)/product/[slug]/page.tsx`):**
     - Replaced the static server-rendered hero image and non-interactive thumbnail wrappers with the new `<ProductImageGallery />`.

---

### [v1.8.12] – 2026-09-26: Admin Celebration Add-ons Management Suite
- **Category:** Admin Dashboard, Merchandising & Add-on Governance
- **User Requests Addressed:**
  - *"in admin section is there any section to add the addon, edit and delete?"* (Built full Admin Add-ons management page & APIs)
- **Enhancements:**
  1. **Full CRUD Admin Add-ons APIs (`src/app/api/admin/addons/route.ts` & `[id]/route.ts`):**
     - Secure endpoints protected by `requireAdminSession` supporting `GET` (with search and category filters), `POST` (create new add-on), `PATCH` (update fields and stock availability), and `DELETE` (remove add-on).
  2. **Admin Add-ons Management Page (`src/app/(admin)/admin/addons/page.tsx`):**
     - Complete dashboard featuring metric cards (Total, Live in-stock, Hidden, Categories), real-time search, category dropdown filter, and live/hidden status filters.
     - Responsive data table displaying image thumbnail, title, image path, category badge, INR price, 1-click in-stock / hidden toggle button, and quick actions (Edit, Delete).
     - Add & Edit modal with preset category selection, custom category input, price validator, image path input with 1-click local image presets, live image preview, and availability toggle.
     - Secure delete confirmation modal with item preview before permanent deletion.
  3. **Admin Sidebar Navigation Link (`src/components/admin/admin-nav.tsx`):**
     - Added dedicated "Add-ons" item with `Gift` icon in the primary admin navigation menu.

---

### [v1.8.11] – 2026-09-26: Add Ferrero Rocher 200 GM Celebration Add-on
- **Category:** Storefront Checkout UX, Catalog & Upsells
- **User Requests Addressed:**
  - *"add this also addon - /Users/jalal/Documents/web/public/200gm-chocolate.jpg , Ferrero Rocher - 200 GM , ₹549 add this addon"*
- **Enhancements:**
  1. **New Add-on Catalog Item:**
     - Created `prisma.addon` record for "Ferrero Rocher - 200 GM" with category "Chocolates", price ₹549, and local image `/200gm-chocolate.jpg`.
     - Added to fallback lists in [`src/app/api/public/addons/route.ts`](file:///Users/jalal/Documents/web/src/app/api/public/addons/route.ts) and [`prisma/seed.ts`](file:///Users/jalal/Documents/web/prisma/seed.ts).

---

### [v1.8.10] – 2026-09-26: Update Teddy Bear Add-on Image to Local Asset
- **Category:** Storefront Checkout UX, Media Resilience & Image Handling
- **User Requests Addressed:**
  - *"/Users/jalal/Documents/web/public/teddy.webp update this image"* (Updated Cuddly White Teddy Bear add-on image)
- **Enhancements:**
  1. **Local WebP Product Asset Integration (`/teddy.webp`):**
     - Updated `prisma.addon` database record for "Cuddly White Teddy Bear (6 inch)" to `/teddy.webp`.
     - Updated fallback lists in [`src/app/api/public/addons/route.ts`](file:///Users/jalal/Documents/web/src/app/api/public/addons/route.ts) and [`prisma/seed.ts`](file:///Users/jalal/Documents/web/prisma/seed.ts).
     - Updated `onError` fallback in [`src/components/storefront/checkout/checkout-wizard.tsx`](file:///Users/jalal/Documents/web/src/components/storefront/checkout/checkout-wizard.tsx) to `/teddy.webp`.

---

### [v1.8.9] – 2026-09-26: Saved Sender & Recipient Delete Confirmation Modal
- **Category:** Storefront Checkout UX, Address Book Safety & Confirmation Dialogs
- **User Requests Addressed:**
  - *"and what if user want to delete the existing sender and receiver data then when user delete then show the modal delete confirmation before deletion"*
- **Enhancements:**
  1. **Delete Confirmation Dialog (`src/components/storefront/checkout/checkout-wizard.tsx`):**
     - Implemented an animated confirmation modal with a soft destructive warning icon, target preview (name, phone/email, delivery address), and Cancel / "Yes, Delete" buttons.
     - Prevents accidental deletions of stored sender profiles and recipient addresses.
  2. **Sender Profile Deletion Support:**
     - Added a dedicated delete trash button on saved sender profile cards.
     - Automatically cleans up `localStorage` and falls back to another profile or "new sender" mode if the active sender was deleted.
  3. **Improved Recipient Address Deletion:**
     - Replaced instant deletion with the confirmation modal.
     - Made trash buttons easily accessible across mobile/touch screens and desktop for both active and inactive addresses.
     - Calls backend `DELETE /api/account/addresses?id=...` and updates local state.

---

### [v1.8.8] – 2026-09-26: Fix Checkout Add-on Images & Resilient Fallback System
- **Category:** Storefront Checkout UX, Media Resilience & Image Handling
- **User Requests Addressed:**
  - *"why this image is not showing?"* (Fixed broken Ferrero Rocher image in Step 4 Add-ons)
  - *"this the picture for that - /Users/jalal/Documents/web/public/16-peaces-chocolate.jpeg"*
- **Enhancements:**
  1. **Exact Local Product Photography Integration (`/16-peaces-chocolate.jpeg`):**
     - Connected the local high-resolution 16-piece Ferrero Rocher image directly to `prisma.addon` database record.
     - Updated fallback lists in [`src/app/api/public/addons/route.ts`](file:///Users/jalal/Documents/web/src/app/api/public/addons/route.ts) and [`prisma/seed.ts`](file:///Users/jalal/Documents/web/prisma/seed.ts) to `/16-peaces-chocolate.jpeg`.
  2. **Automatic Category Fallback on Error (`src/components/storefront/checkout/checkout-wizard.tsx`):**
     - Attached an `onError` listener to the Add-on card `<img>` component. If any remote image fails to load or returns a 404/network error, it automatically falls back to local high-resolution assets (`/16-peaces-chocolate.jpeg`, `/images/white-teddy-6-inch.jpg`, etc.), completely preventing broken image icons.

---

### [v1.8.7] – 2026-09-26: Checkout Step 4 Add-ons Catalog & Interactive Upsell Gallery
- **Category:** Storefront Checkout UX, Upsells & Commerce Experience
- **User Requests Addressed:**
  - *"here why this is blank check and tell me?"* (Diagnosed empty Add-ons step and built interactive celebration gallery)
- **Enhancements:**
  1. **Interactive Celebration Add-ons Gallery in Checkout Step 4 (`src/components/storefront/checkout/checkout-wizard.tsx`):**
     - Replaced the blank card that only stated `"No add-ons selected."` with an interactive e-commerce add-ons gallery.
     - Features product photography, category badges (`Candles`, `Cards`, `Chocolates`, `Soft Toys`, `Celebration`), item titles, and INR pricing.
     - Added 1-click `+ Add` button with dynamic stepper (`- qty +`) controls.
  2. **Public Add-ons API (`src/app/api/public/addons/route.ts`):**
     - Created endpoint querying `prisma.addon` with resilient fallbacks for candles, greeting cards, Ferrero Rocher chocolates, teddy bears, party poppers, and roses.
  3. **Cart Context Extension (`src/lib/cart-context.tsx`):**
     - Added `updateItemAddons` method to update cart items with selected add-ons, recalculating subtotal and grand total dynamically in real time.

---

### [v1.8.6] – 2026-09-26: Checkout Field-Level Validation & Focus State Remediation
- **Category:** Storefront Checkout UX, Form Validation & Accessibility
- **User Requests Addressed:**
  - *"why its giving this error for sender?"* (Clarified missing Recipient Mobile validation vs focused Email input)
- **Enhancements:**
  1. **Specific, Actionable Error Messages (`src/components/storefront/checkout/checkout-wizard.tsx`):**
     - Replaced the vague generic error message (`"Please fill all required recipient and sender fields."`) with exact field-specific messages pointing directly to what needs attention (e.g. *"Please enter the recipient's 10-digit mobile number"*).
  2. **Inline Field Error Highlighting & Hints:**
     - Added `step1Attempted` validation state.
     - Unfilled or invalid fields now illuminate with a clear red border (`border-destructive`) and display contextual helper text directly underneath the input (e.g. *"Recipient mobile number is required"*).
  3. **Deceptive Placeholder Replacement:**
     - Replaced hardcoded digits `"9876543210"` in phone inputs with descriptive placeholder `"Enter 10-digit number"` so it can never be mistaken for pre-filled data.
  4. **Neutral Focus Ring Styling (`src/components/ui/input.tsx`):**
     - Replaced brand rose-red focus rings (`focus-visible:ring-primary/40`) with modern neutral focus rings (`focus-visible:border-zinc-800 focus-visible:ring-zinc-400/30`), completely eliminating false-positive visual error states on active inputs.

---

### [v1.8.5] – 2026-09-26: Saved Sender & Recipient Address Book (1-Click Fast Checkout)
- **Category:** Storefront Checkout UX, Address Book & Returning Customer Flow
- **User Requests Addressed:**
  - *"for the sender and reciever why cant we use the same way how the other delivery partner use they add the sender and reciever data and when next time user try to order then its showing the existing reciepts and sender and also add new sender or reciepts if that not the same like that"*
- **Enhancements:**
  1. **Saved Senders Profile Architecture (`src/components/storefront/checkout/checkout-wizard.tsx`):**
     - Senders saved in `localStorage` (`bloom_saved_senders`) and merged with logged-in user profile from `/api/auth/me`.
     - Displays clickable sender selection chips with avatars and checkmark indicators.
     - Supports `+ Add New Sender` button for placing orders on behalf of different contacts/businesses.
     - Displays a clean active summary banner with `[Edit Sender]` toggle when a saved sender is active.
     - Configurable toggle: `Save sender details for fast checkout on my future celebration orders`.
  2. **Saved Recipients Address Book & Categorization:**
     - Merges server-side database records from `/api/account/addresses` with `localStorage` (`bloom_saved_recipients`) for seamless guest and member experiences.
     - Displays an address book grid with address category chips (`🏠 HOME`, `💼 WORK`, `🌸 FRIEND`, `🎂 FAMILY`, `📍 OTHER`).
     - Includes 1-click address selection, real-time field auto-fill, and inline address deletion (`Trash2`).
     - Provides a `+ Deliver to Someone New` card with dashed border.
     - New recipient form includes address tag selector, 10-digit mobile validation, street address, and optional landmark.
  3. **Backend API Enhancements (`src/app/api/account/addresses/route.ts`):**
     - Enhanced `GET` with session cookie recognition.
     - Enhanced `POST` to link `userId` whenever authenticated.
     - Added `DELETE` route handler for managing saved addresses.

---

### [v1.8.4] – 2026-09-26: Storefront Theme Isolation & Checkout Form Alignment Fix
- **Category:** Storefront Styling, Tailwind CSS v4 Configuration & Form Layout
- **User Requests Addressed:**
  - *"check the mobile alignment and why the input text background is showing black"* (Resolved dark input backgrounds and form field vertical misalignment)
- **Enhancements:**
  1. **Tailwind CSS v4 Dark Mode Theme Isolation (`src/app/globals.css`):**
     - Configured `@custom-variant dark (&:where(.dark, .dark *));` to prevent Tailwind CSS v4 from automatically triggering dark utilities based on the OS `@media (prefers-color-scheme: dark)` setting.
     - Dark styles now strictly apply only when a `.dark` or `.admin-root` class is explicitly present in the DOM hierarchy, ensuring the storefront remains pristine in light mode.
  2. **Input Component Baseline Styling (`src/components/ui/input.tsx`):**
     - Refactored default input styling to explicitly use `bg-white border-border text-foreground placeholder:text-muted-foreground`.
     - Scoped dark background styles strictly under `.dark:bg-zinc-900 .dark:border-zinc-800`.
  3. **Checkout Form Pixel-Perfect Alignment (`src/components/storefront/checkout/checkout-wizard.tsx`):**
     - Standardized all field label headers across Step 1 (`Your name`, `Email`, `Mobile number`, `Recipient name`, `Recipient mobile`, and `Delivery address`) into uniform `<div className="flex h-5 items-center justify-between">` flex wrappers with `mt-1.5` input spacing.
     - Eliminated the 4px baseline discrepancy caused by the `{length}/10` mobile counter badge, ensuring all inputs in the 3-column and 2-column grids align horizontally and vertically.

---

### [v1.8.3] – 2026-09-26: Checkout Wizard Personalization & Order Summary Visual Enrichment
- **Category:** Storefront Checkout UX & Visual Commerce
- **User Requests Addressed:**
  - *"this doesnot shows the product image why"* (Diagnosed missing product images on Checkout Step 3 Personalization cards)
  - *"quantity also if this is cake and if flowers then the no of flowers"*
- **Enhancements:**
  1. **Visual Product Cards & Item Specifications in Personalization Step (`src/components/storefront/checkout/checkout-wizard.tsx`):**
     - Integrated `item.image` into each cart item card in Step 3 (Personalization) with a clean `size-16` rounded thumbnail, subtle border, and fallback gift icon.
     - Added the 100% Eggless status badge on vegetarian cake thumbnails.
     - Added dedicated specification badge rows showing:
       - **Quantity Ordered:** `Qty: {item.quantity}`
       - **Cake Weight / Size:** `🎂 Cake Weight: 0.5 kg` (or `1.0 kg`, `2.0 kg`)
       - **Flower Count / Stems:** `🌸 Flower Count: 12 Roses` (or `6 Stems`, `50 Roses`)
     - Enhanced typography showing line subtotal, and color-coded styled pills for Cake Message (🎂) and Greeting Card Message (💌).
  2. **Strict Indian Mobile & Email Validation:**
     - Enforced 10-digit numeric constraints (`maxLength={10}`, regex `/^[6-9]\d{9}$/`) on both Sender Mobile and Recipient Mobile.
     - Added automatic sanitization of non-numeric characters and paste handling (stripping `+91` and leading `0`).
     - Added native `+91` country prefix badges, `{length}/10` live character counter, red destructive border states, and descriptive helper text.
     - Enforced validation rules in `validateStep(1)` to block moving to the next step if phone numbers or email format are invalid.
  3. **Checkout Summary Sidebar Image & Specification Integration:**
     - Added compact `size-9` thumbnails and quantity/weight/flower tags into the sticky order summary sidebar.

---

### [v1.8.2] – 2026-09-26: SocialHive Chat Embed Script Hardening & Concierge UI Layout Audit
- **Category:** Storefront Root Architecture, Hydration Stability & Concierge UX
- **User Requests Addressed:**
  - Audit and reposition external SocialHive chat embed script in `src/app/layout.tsx`.
  - Diagnosis of Concierge Configuration Modal tab collisions and layout constraints.
- **Enhancements:**
  1. **Next.js Script Architecture (`src/app/layout.tsx`):**
     - Migrated legacy HTML `<script>` embed to Next.js `<Script>` component (`next/script`).
     - Moved the script tag to execute after `<Providers>{children}</Providers>` with `strategy="afterInteractive"`, completely avoiding React 19 hydration mismatch warnings and DOM manipulation race conditions.
  2. **Concierge Configuration Modal Layout & Width Remediation:**
     - Identified root cause of tab collision: In `components/ui/dialog.tsx`, the base component defines `sm:max-w-md` by default. Passing `max-w-4xl` without the `sm:` media query breakpoint allowed `sm:max-w-md` to take precedence on desktop screens, locking the dialog to a tiny `448px` width.
     - Inside that tiny width, the 4-column tabs (`grid grid-cols-4`) each had only ~105px, causing `"Knowledge & Catalog"` (~165px) to overflow its column boundary and render directly on top of `"Styling & Position"`.
     - **Resolved:** Upgraded the dialog declaration in `components/chat-sites/chat-sites-view.tsx` to `sm:max-w-4xl`, overriding the base breakpoint and unlocking the full 896px canvas. The tabs now have ~210px per column with zero collision or wrapping.
  3. **Plan-Based Dynamic AI Model Resolution for Chat Concierge:**
     - Removed hardcoded static dropdown options in `components/chat-sites/chat-sites-view.tsx`.
     - Updated `app/(app)/app/chat-sites/page.tsx` to query `loadAiModels(identity.workspace.id, identity.workspace.plan, "text")`, ensuring models align with the active workspace subscription tier (Free, Starter, Pro, Business, Enterprise) just like AI Studio and Workflows.
     - Extended `lib/chat/orchestrator.ts` (`resolveLlmTarget`) to resolve any dynamic text model.

---

### [v1.8.1] – 2026-09-25: Conversational AI Gifting Concierge ("Bloomie") with In-Chat Discovery, Cart & Checkout Progression
- **Category:** Conversational Commerce, AI Agent Architecture & Storefront UX
- **User Request Addressed:**
  - *"lets discuss on this - new feature every page there will be a AI Asistant will be there on the right bottom corner but when user click on that it will turn and become a chat box like how the chat gpt chat box is there and it will ask what you are looking for today? and based on that it will give suggestion to the user basically it will help user to find the right choice using the chat and once user finalize the products it will add up to cart and within the chat it will show the option to make the payment and guide the user that it saved to your profile and also for correct information chat will ask to login into user login first for purchasing the product so the complete flow will be assisting by the AI Asistenat only how the user is doing manually"*
- **Enhancements:**
  1. **Floating AI Concierge Widget (`src/components/storefront/ai-assistant-widget.tsx`):**
     - Persistent floating badge located at the bottom-right corner (`bottom-5 right-5 z-50`) across all storefront pages.
     - Redesigned with a rich, vibrant rose gradient (`linear-gradient(135deg, #e11d48 0%, #be123c 60%, #9f1239 100%)`), 2.5px white border, and deep rose drop shadow, resolving washed-out styling under Tailwind v4.
     - Clear, intuitive dual-icon composition: Solid white `MessageCircle` chat bubble with an overlaid glowing golden `Sparkles` star and an active pulsing emerald online status dot.
     - Gentle attention pill badge (*"Need gift advice? Chat with AI"*) prompting user engagement.
     - Smooth morphing animation into a full ChatGPT-style conversational drawer.
  2. **Intelligent Conversational Engine (`src/app/api/ai/assistant/route.ts`):**
     - Natural language intent parsing for occasions (Birthday, Anniversary, Romance, Diwali, etc.), product types (Cakes, Flowers, Bento, Combos, Plants, Chocolates), dietary preferences (100% Eggless / Pure Veg), and budget caps (e.g. "under 1000", "under 1500").
     - Grounds responses in the live Prisma database with real product titles, prices, images, and category metadata.
  3. **Interactive In-Chat Product Cards:**
     - Displays rich product cards inside the conversation with photo thumbnail, title, price (₹), and eggless badge.
     - Includes a one-click **"Add to Cart"** button directly inside each card, invoking `useCart().addItem(...)` and updating global cart counts instantly.
  4. **Authentication & Profile Guidance:**
     - Checks user session via `/api/auth/me`.
     - For guests: Generates an in-chat card prompting 1-click Sign In / Register (`/login?redirect=/checkout`) so delivery addresses and order tracking are securely preserved in their customer profile.
     - For logged-in users: Acknowledges customer by name and confirms order linkage to their account.
  5. **In-Chat Checkout & Payment Flow:**
     - Displays live subtotal, cart item count, and an instant **"Pay Now via Razorpay"** action button directing them straight to checkout.
  6. **Global Storefront Integration (`src/app/(storefront)/layout.tsx`):**
     - Injected `<AIAssistantWidget />` into root storefront layout so it seamlessly accompanies shoppers across all browsing stages.
- **Verification:**
  - TypeScript compilation: `npx tsc --noEmit` exited with code `0`.
  - API validation: Tested `/api/ai/assistant` with natural queries, budget constraints, eggless filters, and checkout intents.

---

### [v1.8.0] – 2026-09-25: 8-Grid Category & Occasion Visual Architecture with Studio Imagery
- **Category:** Storefront Visual Merchandising, Database Normalization & Image Asset Pipeline
- **User Requests Addressed:**
  - *"why for this category images are not showing?"* (Referencing blank pink placeholders for Wedding & Engagement, Raksha Bandhan, Diwali, and New Year)
  - *"here also make 8 items with proper relevent images"* (Expanding "Browse By Category" to a complete 8-item grid with authentic imagery)
- **Enhancements:**
  1. **Root Cause Resolution for Missing Occasion Images:**
     - The database records for `wedding`, `raksha-bandhan`, `diwali`, and `new-year` had `bannerImage: null`, and the frontend dictionary `OCCASION_IMAGES` only declared 4 legacy entries.
     - Generated and installed ultra-crisp 16:9 celebration images for all 4 occasions in `public/images/occasions/`:
       - `wedding.jpg` (Tiered luxury designer wedding cake with delicate ivory florals)
       - `raksha-bandhan.jpg` (Golden handcrafted Rakhi thali with celebration cake & marigolds)
       - `diwali.jpg` (Glowing brass diyas, pistachio cake, and golden gift hamper)
       - `new-year.jpg` (Sparkling champagne, 2026 midnight cake, and gold confetti)
     - Updated database records with active `bannerImage` URLs and expanded `OCCASION_IMAGES` fallback dictionary in `src/app/(storefront)/page.tsx`.
  2. **Expanded "Browse By Category" to 8 Curated Categories:**
     - Curated and synchronized 8 core gifting categories in Prisma database:
       1. **Fresh Flowers** (`/images/categories/fresh-flowers.jpg`)
       2. **Gourmet Cakes** (`/images/categories/gourmet-cakes.jpg`)
       3. **Bento & Mini Cakes** (`/images/categories/bento-cakes.jpg`)
       4. **Combos & Hampers** (`/images/categories/combos-hampers.jpg`)
       5. **Live Plants** (`/images/categories/live-plants.jpg`)
       6. **Chocolates & Sweets** (`/images/categories/chocolates-sweets.jpg`)
       7. **Teddy & Soft Toys** (`/images/categories/soft-toys.jpg`)
       8. **Luxury Gift Hampers** (`/images/categories/luxury-hampers.jpg`)
     - Linked 17 bento products to the new `bento-cakes` category.
     - Generated 1:1 circular crop-optimized studio images in `public/images/categories/` for Live Plants, Chocolates & Sweets, Fresh Flowers, Gourmet Cakes, and Luxury Hampers.
     - Added `CATEGORY_IMAGES` fallback dictionary and upgraded `src/app/(storefront)/page.tsx` so images reliably render without any empty circle or pink placeholder.
  3. **Admin Category Table Enhancements:**
     - Added a dedicated "Thumbnail" preview column in `src/app/(admin)/admin/categories/page.tsx` so administrators can visually audit category images and paths directly from the console.
- **Verification:**
  - Validated HTML server-render output: Verified all 8 occasions and all 8 categories render complete `<img>` tags with responsive `srcSet`.
  - TypeScript compilation: `npx tsc --noEmit` exited with code `0`.

---

### [v1.7.9] – 2026-09-25: Vendor Portal Simplification: Catalog & Product Management Exclusively Centralized in Admin Console
- **Category:** Vendor Experience, Multi-Vendor Architecture & Role-Based Permissions
- **User Request Addressed:** *"in vendor section product catalog is not needed and add product"*
- **Enhancements:**
  1. **Removed Product Catalog & Add Product from Vendor Portal:**
     - Vendors are operational fulfillment partners responsible for receiving incoming orders, baking cakes, tying fresh floral arrangements, dispatching riders, and updating their store profile and delivery pincode coverage.
     - Centralized product catalog creation, pricing, SEO, images, and variant governance exclusively within the Super Admin console (`/admin/products`).
  2. **Updated Vendor Navigation Sub-Bar (`src/components/vendor/vendor-nav-tabs.tsx`):**
     - Removed the `Product Catalog` tab.
     - Streamlined the vendor portal to two focused operational tabs:
       - **Live Orders & Fulfillment** (`/vendor`)
       - **Store Profile & Delivery Settings** (`/vendor/settings`)
  3. **Protected / Redirected Legacy Vendor Product Routes:**
     - Updated `src/app/(vendor)/vendor/products/page.tsx` to automatically redirect to `/vendor`.
     - Updated `src/app/(vendor)/vendor/products/new/page.tsx` to automatically redirect to `/vendor`.
- **Verification:**
  - TypeScript compilation: `npx tsc --noEmit` exited with code `0`.

---

### [v1.7.8] – 2026-09-25: Multi-Vendor Partner Lifecycle: Self-Registration, Vendor Self-Service Settings, and Admin Management & Editing Suite
- **Category:** Multi-Vendor Architecture, Partner Onboarding, Merchant Governance & Self-Service
- **User Request Addressed:** *"what about the vendor registration and how admin edit the vendor details or vendor itself edit his details ?"*
- **Enhancements:**
  1. **Vendor Self-Registration Portal (`/vendor/register` & `/api/vendor/register`):**
     - Public, high-converting registration portal for local florists and bakeries (`src/app/(auth)/vendor/register/page.tsx`).
     - Includes partner value proposition, shop details, owner login credentials, preparation time, and delivery coverage pincodes.
     - Backend API (`src/app/api/vendor/register/route.ts`) safely checks for unique email across both `User` and `Vendor`, hashes owner password with `bcryptjs`, initializes the `Vendor` record in `isApproved: false` state, creates the `User` with `role: "VENDOR_OWNER"`, and seeds `VendorServiceArea` coverage pins.
     - Linked directly from Vendor Login screen (`src/app/(auth)/vendor/login/page.tsx`).
  2. **Vendor Self-Service Profile & Kitchen Settings (`/vendor/settings` & `/api/vendor/profile`):**
     - Dedicated store settings dashboard (`src/app/(vendor)/vendor/settings/page.tsx`) for logged-in florists/bakers.
     - Enables vendors to update their shop display name, contact phone, kitchen physical address, prep lead time (minutes), and manage their service delivery pincodes with an interactive chip tag manager.
     - Protected backend API (`src/app/api/vendor/profile/route.ts`) validates merchant session and synchronizes pincode coverage.
     - Added unified top navigation sub-bar (`src/components/vendor/vendor-nav-tabs.tsx` & `src/app/(vendor)/layout.tsx`) switching between **Live Orders**, **Catalog & Products**, and **Store Profile & Settings**.
  3. **Super Admin Vendor Governance & Editing Console (`/admin/vendors`):**
     - Re-architected `src/app/(admin)/admin/vendors/page.tsx` into an interactive command center (`src/components/admin/admin-vendors-manager.tsx`).
     - **Overview Metrics:** Real-time counters for Total Merchants, Active & Approved, Pending Review (with pulse notification), and Total Catalog Listings.
     - **Live Search & Filter Toolbar:** Real-time filtering by business name, city, email, phone, or delivery pincode, with segmented status pills (All, Approved, Pending Review, Inactive).
     - **"Edit Details" Modal:** Super Admins can click any vendor card to edit business name, email, phone, city, state, kitchen address, commission rate (%), prep lead time (mins), delivery pincodes (comma-separated), and approval/active switches.
     - **"Add New Vendor" Modal:** Super Admins can directly onboard merchant partners from the admin console with initial login credentials and delivery radius.
     - Upgraded backend APIs (`src/app/api/admin/vendors/route.ts` and `src/app/api/admin/vendors/[id]/route.ts`) supporting full CRUD, pincode reconciliation, and safe deactivation.
- **Verification:**
  - TypeScript compilation: `npx tsc --noEmit` exited with code `0` (clean compile).

---

### [v1.7.7] – 2026-09-25: Comprehensive Brand Identity Alignment: "Bloom & Bakes - MyPetalsCart"
- **Category:** Brand Identity, SEO Meta Governance & Omni-Channel Nomenclature
- **User Request Addressed:** *"Bloom & Bakes - My Patelscar is my brand name check every where and updat eit"*
- **Enhancements:**
  - **SEO & Global Metadata Configuration (`src/lib/seo-config.ts` & `src/app/layout.tsx`):**
    - Updated `getSiteName()` default fallback to `"Bloom & Bakes - MyPetalsCart"`.
    - Updated root metadata default title to `"Bloom & Bakes - MyPetalsCart — Flowers • Cakes • Gifts • Delivered With Love"`.
    - Aligned OpenGraph and Twitter card title tags with full brand naming.
  - **Admin Navigation & Sidebar (`src/components/admin/admin-sidebar.tsx`):**
    - Desktop brand title updated to **Bloom & Bakes** with subtitle **MyPetalsCart Marketplace** alongside the brand petal emblem.
    - Mobile header updated to display **Bloom & Bakes · MyPetalsCart [Admin]**.
  - **Admin Governance & Login (`src/app/(auth)/admin/login/page.tsx`):**
    - Header title updated to **Bloom & Bakes - MyPetalsCart** Super Admin Governance Console.
  - **Storefront Header & Footer (`src/components/storefront/`):**
    - Main logo image alt text updated to `"Bloom & Bakes - MyPetalsCart"`.
    - Footer copyright updated to `© 2026 Bloom & Bakes - MyPetalsCart Marketplace Ltd.`.
    - Customer login screen welcome header aligned to `"Welcome to Bloom & Bakes - MyPetalsCart"`.
  - **Products & Checkout Pipeline:**
    - Admin product catalog default vendor name and meta title placeholders updated to `"Bloom & Bakes - MyPetalsCart"`.
    - Checkout Razorpay payment gateway brand name updated to `"Bloom & Bakes - MyPetalsCart"`.
- **Verification:**
  - Static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---
- **Category:** Admin UI/UX & Visual Brand Identity
- **User Request Addressed:** *"update this logo also"* (replacing generic placeholder red shield icon with the authentic brand emblem).
- **Enhancements:**
  - **Admin Left Sidebar (`src/components/admin/admin-sidebar.tsx`):**
    - Replaced generic red squircle with `ShieldCheck` icon with the official high-resolution brand floral petal emblem (`/favicon.png`), featuring vibrant magenta and emerald green petals on a dark container (`bg-zinc-900 border-zinc-800`).
    - Added subtle hover scaling and rose accent glow on the brand emblem.
    - Updated mobile top bar header with the matching official petal emblem.
  - **Super Admin Login Page (`src/app/(auth)/admin/login/page.tsx`):**
    - Replaced placeholder red shield box with the official brand petal emblem in a rounded dark container with subtle border.
- **Verification:**
  - Static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---
- **Category:** Admin Promotions, Discount Governance & Coupon Lifecycle Management
- **User Request Addressed:** *"coupon edit ,active, disable, redeem limit option needed for admin"*
- **Enhancements:**
  - **1-Click Instant Active/Disable Toggle:**
    - Upgraded the static Status column in the coupon table into an interactive, 1-click toggle button.
    - Admins can instantly activate (emerald glowing pill) or disable (zinc/amber paused pill) any promo code without leaving or reloading the page.
    - Updated backend `PATCH /api/admin/coupons/[id]` to persist status and emit optimistic UI state.
  - **Comprehensive Usage Limits & Redemption Cap Governance:**
    - Visual display of redemptions vs total allowance (e.g. `0 / 100 limit` with progress bar, or `0 redeemed (Unlimited)`).
    - Clear visual indicators when a promotional coupon's redemption limit has been fully exhausted.
    - Integrated with checkout validation (`/api/coupons/validate`) which enforces `usageLimit` and prevents over-redemption.
  - **Full Coupon Edit Modal (`src/app/(admin)/admin/coupons/page.tsx`):**
    - Interactive dialog supporting edits to: Promo Code (auto-capitalized with collision check), Offer Description, Discount Type (`% Percentage` vs `₹ Flat`), Discount Value, Minimum Order Value, Max Discount Cap, Total Redemption Usage Limit (with Unlimited toggle), Expiry Date, and Active Status.
  - **Single Coupon Deletion & Copy Code Utility:**
    - Added deletion action with confirmation prompt.
    - Added 1-click copy promo code to clipboard with checkmark feedback.
  - **Backend API Robustness (`src/app/api/admin/coupons/[id]/route.ts` & `src/app/api/admin/coupons/route.ts`):**
    - Supported editing promo code with uniqueness validation.
    - Handled setting `usageLimit` to null for unlimited uses or integer cap.
    - Added `DELETE` endpoint and duplicate code pre-check on `POST`.
- **Verification:**
  - Static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---

### [v1.7.4] – 2026-09-25: Super Admin 701 Products & Inventory Management Suite
- **Category:** Admin Platform Architecture, Product Catalog Management & Inventory APIs
- **Root Cause Addressed:** The Admin panel lacked a dedicated Super Admin products console. Products could previously only be viewed inside `/vendor/products` (scoped to individual logged-in vendors) without a centralized search, filter, edit, or inventory toggle capability for the platform's 701 catalog items.
- **Enhancements:**
  - **Super Admin Products Page (`src/app/(admin)/admin/products/page.tsx`):**
    - Built comprehensive management view with live stat cards (701 Total Listed, In Stock & Live, Out of Stock, Eggless-Friendly).
    - Multi-faceted filter bar: live search by title/slug/tags, category selector, product type dropdown (Cakes, Flowers, Combos, Gifts, Addons), stock status filter, eggless filter, and sorting.
    - Responsive Shadcn Table: thumbnail image preview, prep time, eggless & photo cake indicators, category & type badges, vendor identity, live INR pricing with MRP strikethrough & discount pill, occasion tag preview.
    - **Instant 1-Click Stock Toggle:** Seamlessly switch products between "In Stock" and "Out of Stock" directly from the table without full reload.
    - Storefront preview link to test the live product page on customer store.
  - **Comprehensive Product Edit & Create Modal:**
    - Interactive modal supporting full edits: title, slug, product type, category, description, base price, MRP compare-at price, in-stock toggle, eggless toggle, custom message support, photo cake toggle, prep time, primary image URL with live thumbnail preview, occasion mapping pills (multi-select), tags, and SEO meta tags (title & description).
  - **Admin Products Backend APIs:**
    - `src/app/api/admin/products/route.ts`: Paginated `GET` with full search/filter/sort capabilities and aggregations; `POST` for creating new catalog products.
    - `src/app/api/admin/products/[id]/route.ts`: `GET` single product details; `PATCH` for full/partial updates (including relational occasion remapping and quick availability toggles); `DELETE` with safety check for order history.
  - **Navigation & Dashboard Linking:**
    - Added "Products" (with `ShoppingBag` icon and `701` count badge) to `NAV_ITEMS` in `src/components/admin/admin-nav.tsx` (illuminated in both desktop sidebar and mobile drawer).
    - Linked the "Live Products" overview card in `src/app/(admin)/admin/page.tsx` directly to `/admin/products`.
- **Verification:**
  - Static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---

### [v1.7.3] – 2026-09-25: Dedicated Admin Sidebar with Bottom-Left Static Info & Sign Out
- **Category:** Admin UI/UX & Layout Architecture
- **Enhancements:**
  - **Left Sidebar Component (`src/components/admin/admin-sidebar.tsx`):**
    - Built a fixed/sticky left sidebar (`w-64 border-r border-zinc-850 bg-zinc-950 flex flex-col justify-between h-screen`) following official Shadcn UI dashboard architecture.
    - **Top:** Brand Identity with rose emblem, "Bloom & Bakes", "Admin" badge, and "Marketplace Governance".
    - **Middle:** Vertical navigation suite (`Dashboard`, `Orders`, `Vendors`, `Coupons`, `Catalog`, `SEO Pages`, `Growth OS`) with active route illumination, plus quick links to Storefront and Vendor Portal.
    - **Left Side Bottom:** Pinned footer containing:
      - Static User Identity Card (initials avatar, name, and `SUPER_ADMIN` role badge).
      - Live Guwahati Hub operational status beacon.
      - Full-width tactile **Sign Out** button.
  - **Responsive Layout (`src/app/(admin)/layout.tsx`):**
    - Seamlessly adapts between desktop sidebar and mobile topbar with a slide-out drawer on smaller screens.
    - Main content area now has full unconstrained horizontal width for wide data tables.
- **Verification:**
  - Static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---

### [v1.7.2] – 2026-09-25: Admin Navbar Spatial Rebalancing & Symmetrical Hierarchy
- **Category:** Admin UI/UX & Layout Architecture
- **Enhancements:**
  - **Symmetrical 3-Column Distribution (`src/app/(admin)/layout.tsx`):**
    - Repositioned Brand Identity ("Bloom & Bakes Admin") to the prominent primary left anchor.
    - Moved the Live Storefront shortcut to the right utility group alongside Vendor View.
    - Centered the segmented navigation pill bar in a dedicated flex container (`max-w-2xl`).
    - Upgraded header to full fluid width (`w-full px-4 sm:px-6 lg:px-8`) with height `h-14` to completely prevent edge-clipping or horizontal button overflow on any screen size.
  - **Concise Navigation Labels (`src/components/admin/admin-nav.tsx`):**
    - Refined labels (`Catalog & Occasions` -> `Catalog`, `AI Growth OS` -> `Growth OS` with `AI` badge).
  - **Sleek Sign Out Button (`src/components/admin/admin-logout-button.tsx`):**
    - Replaced heavy red border box with an elegant shadcn ghost icon button with responsive label.
- **Verification:**
  - Static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---

### [v1.7.1] – 2026-09-25: Comprehensive Shadcn/UI Modernization Across All Admin Hubs
- **Category:** Admin UI/UX, Design System Tokens & Component Modernization
- **Enhancements:**
  - **Design System Tokens (`src/app/globals.css`):**
    - Configured dark-mode CSS tokens (`--background`, `--foreground`, `--card`, `--border`, `--muted`, `--primary`) scoped to `.admin-root` and `.dark` for complete fidelity across standard shadcn classes.
  - **Component Dark Support (`src/components/ui/`):**
    - Enhanced `Card`, `Badge`, `Button`, and `Input` with dark mode variant styling (`dark:bg-zinc-950/70`, `dark:border-zinc-800/80`, `dark:text-zinc-100`).
  - **Admin Layout & Navigation (`src/app/(admin)/layout.tsx` & `src/components/admin/admin-nav.tsx`):**
    - Added `.admin-root dark` container classes and glassmorphic navbar with segmented pill tab container.
  - **SEO Landing Pages Manager (`src/app/(admin)/admin/seo/page.tsx`):**
    - Converted all stat cards to shadcn `Card` with glowing accent boxes.
    - Converted table to shadcn `Table`, `TableHeader`, `TableHead`, `TableRow`, `TableCell`.
    - Integrated shadcn `Badge` for categories, occasions, and live status pills with active pulsing dots.
    - Converted action buttons to ghost icon buttons.
  - **Categories & Occasions Hub (`src/app/(admin)/admin/categories/page.tsx`):**
    - Upgraded stats and dual tables with shadcn `Card`, `Table`, `Badge`, and `Button`.
  - **Orders Queue (`src/app/(admin)/admin/orders/page.tsx`):**
    - Upgraded orders table with shadcn `Card`, `Table`, and `Badge`.
  - **Vendors Management (`src/app/(admin)/admin/vendors/page.tsx`):**
    - Upgraded partner cards with shadcn `Card` and `Badge`.
  - **Promotional Coupons (`src/app/(admin)/admin/coupons/page.tsx`):**
    - Upgraded promo table with shadcn `Card`, `Table`, and `Badge`.
  - **Admin Dashboard (`src/app/(admin)/admin/page.tsx`):**
    - Upgraded overview metric widgets with shadcn `Card` and `Badge`.
- **Verification:**
  - Static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---

### [v1.7.0] – 2026-09-25: Admin UI Enhancement with Official Shadcn Components
- **Category:** Admin UI/UX & Design System Architecture
- **Enhancements:**
  - **Shadcn UI Component Architecture (`src/components/ui/`):**
    - Created official shadcn `Table` suite (`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` in `src/components/ui/table.tsx`).
    - Created official shadcn `Tabs` suite (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` in `src/components/ui/tabs.tsx`).
  - **SEO Landing Pages Manager UI Polish (`src/app/(admin)/admin/seo/page.tsx`):**
    - Refactored stat metrics into elevated shadcn `Card` widgets with icon indicators, clean typography hierarchy, and subtle hover borders.
    - Upgraded search and filter toolbar with shadcn `Input` and refined select dropdowns.
    - Upgraded data table with shadcn table styling, subtle zebra/hover row effects, monospace copy-ready slug badges, and compact ghost action buttons.
  - **Super Admin Navigation Polish (`src/components/admin/admin-nav.tsx` & `src/app/(admin)/layout.tsx`):**
    - Eliminated mismatched, rainbow-bordered navigation buttons shown in user screenshot.
    - Implemented a unified active-route indicator using `usePathname()`, consistent pill shapes, muted hover states, and clear separation between platform sections and user account utilities.
- **Verification:**
  - TypeScript static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---

### [v1.6.9] – 2026-09-25: Dedicated Categories & Occasions Admin Console
- **Category:** Admin Governance & Catalog Management
- **Enhancements:**
  - **Full Admin Categories & Occasions Hub (`/admin/categories`):**
    - Built a dual-tabbed management console for administrators to view, create, edit, sort, and toggle visibility for both Product Categories and Gifting Occasions without editing code.
    - Live counters showing total active categories, occasions, and deliverable products indexed.
    - Dynamic edit modal allowing updates to name, slug, merchandising description, banner/icon image URL, sort order, and active storefront visibility.
    - Direct 1-click preview link to live storefront collections (`/catalog?category=...` and `/catalog?occasion=...`).
  - **Admin REST APIs:**
    - `src/app/api/admin/categories/route.ts` & `[id]/route.ts`: GET, POST, PUT, DELETE operations for categories.
    - `src/app/api/admin/occasions/route.ts` & `[id]/route.ts`: GET, POST, PUT, DELETE operations for occasions.
  - **Admin Top Navigation Integration (`src/app/(admin)/layout.tsx`):**
    - Added dedicated "Categories & Occasions" navigation button with badge styling.
- **Verification:**
  - TypeScript static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---

### [v1.6.8] – 2026-09-25: Mega Menu 100% Link Resolution & Catalog Product-Occasion Relational Mapping
- **Category:** Catalog Engineering, Relational Mapping & E-Commerce SEO
- **Enhancements:**
  - **Mega Menu Diagnostic & Complete 133-Link Audit (`src/components/storefront/mega-menu.tsx`):**
    - Audited all 133 links across 6 major mega-menu categories. Discovered 53 links returning zero products due to unpopulated relational join records, missing category entries, unhandled parameters, and missing tags.
    - Achieved **133 / 133 (100% success rate)** of links returning active, deliverable products.
  - **701 Products Relational Mapping (`scripts/map-products-and-occasions.ts`):**
    - Provisioned dedicated Categories for `plants` (Live Plants) and `chocolates` (Chocolates & Sweets).
    - Moved all 52 potted plants and terrariums from generic gifts into the dedicated `plants` category.
    - Populated 999 `ProductOccasion` relational join records linking products to Birthday (380+), Anniversary (230+), Love & Romance (60+), Congratulations (34+), Raksha Bandhan (33+), Diwali (25+), and New Year (13+).
  - **Resilient Search & Query Architecture (`src/lib/catalog-query.ts`):**
    - Added first-class support for `flavor` (Chocolate, Red Velvet, Black Forest, Pineapple, Butterscotch, Blueberry Cheesecake) with intelligent stem and ingredient matching.
    - Enhanced `params.occasion` to check both relational `ProductOccasion` join table and tag/title keywords.
    - Enhanced `params.category` to alias plants and chocolate celebration gifts.
    - Updated midnight delivery filter to include midnight floral deliveries.
  - **Catalog Page UI Support (`src/app/(storefront)/catalog/page.tsx`):**
    - Added active filter badge and cancellation pill for `flavor`.
    - Updated hero banner title to capitalize and display active flavor/occasion collections.
  - **Sitemap Indexing (`src/app/sitemap.ts`):**
    - Added all canonical category collection routes (`/catalog?category=...`) and occasion routes (`/catalog?occasion=...`) to sitemap for search engine crawlability.
- **Verification:**
  - Automated simulation test across all 133 mega menu links: **133/133 passed (0 zero-count links)**.
  - TypeScript static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---

### [v1.6.7] – 2026-09-25: Faded Relevant Celebration Background for Special Occasions Banner
- **Category:** Storefront UI/UX & Visual Merchandising
- **Enhancements:**
  - **Faded Photographic Overlay with Existing Gradient (`src/components/storefront/guwahati-seo-section.tsx` & `src/app/(storefront)/city/[city]/page.tsx`):**
    - Maintained the exact existing rich rose gradient (`from-rose-900 via-rose-800 to-rose-950`), typography, badge, button, and layout.
    - Integrated a subtle, faded romantic celebration photographic layer (`/images/occasions/love-and-romance.jpg`) with `opacity-25 mix-blend-luminosity` and dual gradient shielding (`bg-gradient-to-r from-rose-950/85 via-rose-900/70 to-rose-950/85`).
    - Added `relative z-10` to content and button elements for proper layering and interactivity.
- **Verification:**
  - TypeScript static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---

### [v1.6.6] – 2026-09-25: Rich Photographic Backgrounds for Occasion Spotlight Cards
- **Category:** Storefront UI/UX & Visual Merchandising
- **Enhancements:**
  - **Photographic Occasion Backgrounds (`src/components/storefront/guwahati-seo-section.tsx` & `src/app/(storefront)/city/[city]/page.tsx`):**
    - Upgraded the 3 plain white cards (Birthday Cake Delivery, Anniversary Cake Delivery, Bento Cake Delivery) into premium, high-impact visual banners.
    - Integrated high-resolution, relevant imagery:
      - Birthday: `/images/occasions/birthday.jpg`
      - Anniversary: `/images/occasions/anniversary.jpg`
      - Bento Cake: `/images/bento-cake-spotlight.jpg` (dedicated Korean Bento Cake spotlight photo).
    - Implemented a multi-stage dark gradient overlay (`bg-gradient-to-t from-black/95 via-black/60 to-black/35`) and subtle tint to guarantee maximum readability and WCAG AA contrast for text.
    - Added frosted glassmorphic pill badges (`bg-white/20 backdrop-blur-md border border-white/30`) for occasion category tags ("Birthday Special", "Anniversary Special", "Trending Bento").
    - Added glassmorphic call-to-action buttons (`bg-white/20 hover:bg-white text-white hover:text-zinc-900`) with smooth arrow animation on hover.
    - Enhanced card hover dynamics with subtle scale zoom (`group-hover:scale-110`) and elevation lift (`hover:shadow-2xl hover:-translate-y-1`).
- **Verification:**
  - TypeScript static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---

### [v1.6.5] – 2026-09-25: Faceted Canonical Tag Refinement for Catalog Routes
- **Category:** E-Commerce Technical SEO & Canonicalization
- **Enhancements:**
  - **Dynamic Category/Occasion Canonical Mapping (`src/app/(storefront)/catalog/page.tsx`):**
    - Refined `generateMetadata` so that when a category (e.g. `?category=cakes`) or occasion (e.g. `?occasion=birthday`) is active, its canonical tag points to its dedicated, clean path (`/catalog?category=cakes` or `/catalog?occasion=birthday`).
    - When users sort or filter prices (e.g. `/catalog?category=cakes&sort=price-asc` or `&minPrice=500`), the page automatically assigns `robots: { index: false, follow: true }` and sets its canonical URL back to the clean parent category/occasion route.
    - Fully eliminates duplicate content dilution across sort permutations while concentrating search authority onto commercial landing pages.
- **Verification:**
  - TypeScript static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---

### [v1.6.4] – 2026-09-25: Sticky Filter Sidebar on Product Scroll
- **Category:** Storefront Catalog UX & Sticky Navigation
- **Enhancements:**
  - **Sticky Filter Sidebar (`src/app/(storefront)/catalog/page.tsx`):**
    - Configured `<div className="... items-start ...">` on the catalog grid container to decouple sidebar column stretch.
    - Added `lg:sticky lg:top-24 lg:self-start` to the sidebar `<aside>`, allowing the filters to comfortably stick at the top of the viewport just below the sticky header while scrolling through large product catalogs.
    - Added `max-h-[calc(100vh-6.5rem)] overflow-y-auto` to ensure all filter options remain smoothly scrollable and accessible on shorter laptop screens.
- **Verification:**
  - TypeScript static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---

### [v1.6.3] – 2026-09-25: Interactive Sorting & Price Range Filter Suite
- **Category:** Storefront Catalog UX & E-Commerce Filtering
- **Enhancements:**
  - **Catalog Sort Dropdown (`src/components/storefront/catalog-sort-select.tsx`):**
    - Created a sleek toolbar component displaying live product counts (`{totalCount} products available`).
    - Added interactive Sort dropdown: "Featured / Newest", "Price: Low to High", "Price: High to Low", and "Name: A to Z".
    - Seamlessly pushes URL parameters via `useRouter` while preserving active filters without full page refreshes.
  - **Price Range Filter System (`src/app/(storefront)/catalog/page.tsx`):**
    - Added price bracket presets to the sidebar: All Prices, Under ₹499, ₹500 – ₹999, ₹1,000 – ₹1,999, and ₹2,000 & Above.
    - Integrated with backend `buildCatalogProductWhere` (`minPrice` & `maxPrice`).
  - **Sidebar Sort Section:** Added quick selectable radio-style pills in the sidebar for rapid desktop and mobile sorting.
  - **Active Filter Pills Bar:**
    - Displays removable chips for all active filters (Category, Occasion, Price Range, Sort, and Eggless).
    - Added 1-click individual clear (`✕`) and "Clear all" / "Reset" action buttons.
  - **Query Layer Enhancement (`src/lib/catalog-query.ts`):** Added `title-asc` alphabetical sorting support to `catalogOrderBy`.
- **Verification:**
  - TypeScript static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---

### [v1.6.2] – 2026-09-25: Catalog Header Spacing & Top Border Line Cleanup
- **Category:** Storefront Catalog UI & Layout Polishing
- **Enhancements:**
  - **Removed Stray Border Line (`src/app/(storefront)/catalog/page.tsx`):** Removed `border-b border-border` above the product grid which was visually cutting directly into the top edge of the product cards and filter sidebar.
  - **Enhanced Grid Spacing:** Added responsive top margin (`mt-8 sm:mt-10`) to `<div className="grid grid-cols-1 gap-8 lg:grid-cols-4">` so the Filters sidebar and product cards sit comfortably below the catalog header with ample breathing room.
- **Verification:**
  - TypeScript static analysis: `npx tsc --noEmit` compiled with exit code `0`.

---

### [v1.6.1] – 2026-09-25: Bloom & Bakes SEO Audit & Technical Implementation
- **Category:** Technical SEO, Crawl Optimization & Structured Data Standards
- **Enhancements:**
  - **Centralized SEO Configuration (`src/lib/seo-config.ts`):** Created single source of truth for canonical base URL generation, brand naming (`getSiteName()`), canonical builders (`buildCanonicalUrl()`), and Schema.org BreadcrumbList generators (`buildBreadcrumbJsonLd()`).
  - **Root Layout & MetadataBase (`src/app/layout.tsx`):**
    - Added mandatory `metadataBase` to resolve relative OpenGraph and Twitter images properly across the App Router.
    - Configured dynamic title template (`%s | MyPetalsCart`).
    - Added default OpenGraph and Twitter `summary_large_image` cards.
    - Injected Google-compliant `OnlineStore` JSON-LD schema with `SearchAction` into root body.
  - **XML Sitemap & Roboting Standards (`src/app/sitemap.ts` & `src/app/robots.ts`):**
    - Removed non-operational coming-soon cities (Delhi, Mumbai, Bengaluru, etc.) from sitemap to prevent indexing doorway pages without local fulfillment.
    - Stripped out faceted query-string URLs (`/catalog?category=...`, `/catalog?occasion=...`) from sitemap.
    - Replaced dynamic `new Date()` calls on static routes to preserve meaningful crawl-freshness signals.
    - Standardized production sitemap reference in `robots.ts` via `getBaseUrl()`.
  - **Local SEO & Doorway Page Protection (`src/app/(storefront)/city/[city]/page.tsx`):**
    - Added self-referencing canonical URLs for all city pages.
    - Enforced `robots: { index: false, follow: true }` for non-live cities (`COMING_SOON_CITY_SLUGS`) to guard against deceptive content penalties while preserving crawler link traversal.
  - **Product Detail Page (PDP) Image & Rich Snippets (`src/app/(storefront)/product/[slug]/page.tsx`):**
    - Replaced raw `<img>` tags with Next.js `<Image>` component, adding `priority` and responsive `sizes` to the primary hero image for Largest Contentful Paint (LCP) optimization.
    - Added descriptive `alt` tags to thumbnail gallery images.
    - Added `BreadcrumbList` schema alongside `Product` schema in JSON-LD `@graph`.
    - Eliminated fake review fallbacks (`|| 24` review count and hardcoded `4.9` badge); reviews and ratings now render conditionally strictly when verified customer reviews exist.
  - **Catalog Canonicalization (`src/app/(storefront)/catalog/page.tsx`):**
    - Injected clean, self-referencing canonical URL (`/catalog`) and full OpenGraph/Twitter metadata in `generateMetadata`.
  - **Cart & Checkout Indexation Protection:**
    - Explicitly configured `robots: { index: false, follow: false }` metadata in `src/app/(storefront)/checkout/page.tsx` and new `src/app/(storefront)/cart/layout.tsx` and `src/app/(storefront)/account/layout.tsx`.
  - **SEO Landing Pages Schema Cleanup (`src/app/(storefront)/[slug]/page.tsx`):**
    - Replaced placeholder `LocalBusiness` data (fake phone number and placeholder address) with validated `BreadcrumbList` and `WebPage` structured data linked to the parent `OnlineStore`.
- **Verification:**
  - TypeScript static analysis (`npx tsc --noEmit`) compiled with exit code `0` (clean compilation across all routes).

---
- **Category:** Local SEO Growth & Admin CMS Management
- **Enhancements:**
  - **Prisma Data Model (`SeoLandingPage`):** Added complete schema in `prisma/schema.prisma` supporting slug, title, heading, subheading, metaTitle, metaDescription, categorySlug, occasionSlug, flavorOrType, badgeText, introHtml, contentBody, deliveryAreas, faqs, popularKeywords, and isActive.
  - **Comprehensive Seed Data (`src/lib/seo-pages-seed.ts`):** Defined rich, customized content for all 43 Guwahati search terms from the reference image (Anniversary Cake Delivery, Birthday Cakes for Girls, Send Flowers, KitKat Oreo, Cartoon Theme, Vintage Heart, etc.).
  - **Admin CMS Dashboard & Editor (`/admin/seo`):**
    - Live stats bar displaying Total Pages (43), Live Pages (43), Target Region, and Schema.org structured data.
    - Search bar and category/status filter controls.
    - 1-click "Sync All 43 Pages" button.
    - Multi-tab visual editor with live Google Search SERP snippet preview, character counters, FAQ question/answer manager, and instant database save.
  - **Admin API Endpoints:** Built `/api/admin/seo-pages` and `/api/admin/seo-pages/[id]` supporting CRUD and seed synchronization.
  - **Dynamic Storefront Route (`src/app/(storefront)/[slug]/page.tsx`):**
    - Server-side rendered for instant TTFB and optimal Core Web Vitals (LCP) performance.
    - Dynamic metadata generation, OpenGraph, and Canonical URL tags.
    - Schema.org JSON-LD structured data (`BreadcrumbList`, `LocalBusiness`, `FAQPage`).
    - Filtered live product catalog grid matching category/occasion.
    - Guwahati 40+ delivery areas coverage and delivery slot timing cards.
    - Accessible `<details>`/`<summary>` FAQ accordions.
    - Interconnected 43-link popular search cloud for maximum internal link equity.
  - **Storefront Linking Update:** Linked all 43 popular search pills in `guwahati-seo-section.tsx` and `/city/guwahati` to their dedicated `/${slug}` landing pages.
  - **Verification:** Production build `npm run build` succeeded with code `0` (all 27 routes compiled); verified live HTTP 200 responses on storefront and admin endpoints.

---

### [v1.5.5] – 2026-09-25: Official SVG Brand Icons for Footer Payment Badges
- **Category:** Storefront Footer & Trust UI
- **Enhancements:**
  - Created dedicated vector payment badges component (`src/components/storefront/payment-badges.tsx`) with crisp, authentic brand logos:
    - **UPI:** Dual-chevron arrows in NPCI green (`#22c55e`) and orange (`#f97316`).
    - **Razorpay:** Stylized cyan-blue angular lightning badge (`#3395FF`).
    - **PhonePe:** Brand purple badge (`#5F259F`) with white Devanagari "Pe" motif.
    - **Visa:** Slanted italic bold typography in classic card blue (`#2563eb`).
    - **Mastercard:** Iconic overlapping red (`#EB001B`) and golden amber (`#F79E1B`) intersecting circles.
  - Replaced plain text pills in `src/components/storefront/footer.tsx` with `<PaymentBadges />` for enhanced checkout credibility and visual fidelity.
  - Zero external image CDN dependency; rendered via high-performance inline SVGs.
  - Fully tested and verified with `npm run build` (25/25 routes static/dynamic compiled successfully).

---

### [v1.5.4] – 2026-09-25: Dynamic Marketplace Brand Name in Footer Copyright
- **Category:** Brand Customization & Configuration
- **Enhancements:**
  - Replaced hardcoded competitor name ("Petalscart") in the footer with dynamic `process.env.NEXT_PUBLIC_APP_NAME || "Bloom & Bakes"`.
  - Ensures the site seamlessly reflects the user's custom brand name as soon as their domain/brand is finalized without code edits.

---

### [v1.5.3] – 2026-09-25: Dark Bottom Footer Bar with Delivery Areas & Payment Badges
- **Category:** Storefront Footer & Brand Identity
- **Enhancements:**
  - Implemented the bottom dark navigation and trust bar in `src/components/storefront/footer.tsx` matching the user's design reference:
    - **Popular Delivery Areas Pills:** Rounded interactive pill chips for `Dispur`, `Ganeshguri`, `Zoo Road`, `Beltola`, `Six Mile`, `Khanapara`, `Maligaon`, and `Chandmari`.
    - **"All Areas →" Accent Pill:** Styled with a red/rose outline and hover fill (`border-rose-600 bg-rose-950/40 text-rose-400 hover:bg-rose-600 hover:text-white`) linking directly to the Guwahati city hub.
    - **Localized Copyright:** `© 2026 Petalscart · Delivering Love Across Guwahati 🌸`.
    - **Payment Methods Row:** Small trust badges for `UPI`, `Razorpay`, `PhonePe`, `Visa`, and `Mastercard`.
  - Added Guwahati (Assam Hub) to the "Delivery Cities" column in the main footer.
  - Verified with `npm run build` (0 errors).

---

### [v1.5.2] – 2026-09-25: Homepage Guwahati Local Gifting & SEO Showcase Above Footer
- **Category:** Storefront Homepage & Local SEO Conversion
- **Enhancements:**
  - Implemented and embedded `<GuwahatiSEOSection />` directly above the footer on the marketplace homepage (`src/app/(storefront)/page.tsx`).
  - Integrated rich city gifting narrative with internal domain routes:
    - **Header & Badges:** "Online Flowers, Cake & Plant Delivery in Guwahati", Fresh Cakes, Premium Flowers, Fast Same-Day Delivery, Midnight (11 PM - 12 AM).
    - **Cake Delivery Showcase:** Detailed occasions, 8 popular flavors (Truffle, Black Forest, Pineapple, Butterscotch, Red Velvet, Fruit, Cheesecake, Bento), custom designs, and 100% pure vegetarian (eggless) options.
    - **Coverage Grid (40+ Localities):** Paltan Bazaar, G S Road, Zoo Road, Six Mile, Ganeshguri, Ulubari, Beltola, Dispur, Christian Basti, Rukminigaon, Hatigaon, Bhangagarh, Chandmari, Silpukhuri, Maligaon, Jalukbari, Basistha, Lokhra, Narengi, etc., with WhatsApp chat trigger.
    - **Spotlight Cards:** Birthday Cakes, Anniversary Cakes, Bento Korean mini cakes.
    - **Bouquets & Combos:** Sensational Roses, Orchids, Lilies, Gerberas, Carnations, and Cake & Flower combo pairings.
    - **Occasions & Valentine's:** Love & Romance seasonal banner.
    - **Why Loved in Guwahati:** 4-card trust badges and customer guarantee.
    - **Frequently Asked Questions (FAQ):** 6 questions covering midnight delivery, same-day delivery, covered areas, and NRI orders.
    - **Popular Searches Tag Cloud:** 43 high-intent search tags linking to internal catalog pages.
  - Verified Next.js 16 Turbopack production build with 0 errors.

---

### [v1.5.1] – 2026-09-25: Server-Side RBAC Layout Route Guards & Auth Isolation
- **Category:** Security & Route Protection
- **Enhancements:**
  - Enforced strict server-side authentication guards across all portal layouts:
    - **Admin Console (`/admin`):** Guarded in `AdminLayout` with `getSession()`. Any unauthenticated request or unauthorized non-admin role immediately triggers an HTTP 307 redirect to `/admin/login`.
    - **Vendor Portal (`/vendor`):** Guarded in `VendorLayout` with `getSession()`. Any unauthenticated request or non-vendor role immediately triggers an HTTP 307 redirect to `/vendor/login`.
    - **Customer Account (`/account`):** Guarded in `AccountPage` with `getSession()`. Unauthenticated requests immediately redirect to `/login`.
  - Reorganized login pages into an isolated `(auth)` route group (`src/app/(auth)`) to cleanly separate public authentication forms from guarded layout trees, avoiding redirect loops.
  - Added authenticated user identity chips and instant **Sign Out buttons** directly in the Super Admin Console and Vendor Portal headers (`AdminLogoutButton`, `VendorLogoutButton`).
  - Tested with curl: Verified `HTTP 307` redirect to `/admin/login` for unauthenticated visitors, and `HTTP 200` for authenticated sessions with `SUPER_ADMIN` role.

---

### [v1.5.0] – 2026-09-25: Guwahati City Hub Landing Page & SEO Localized Gifting
- **Category:** Hyperlocal SEO & Gifting Marketplace Expansion
- **Enhancements:**
  - Implemented comprehensive dedicated landing page for Guwahati (`/city/guwahati`) adapting copy and internal links:
    - **Header & Value Proposition:** "Online Flowers, Cake & Plant Delivery in Guwahati" with same-day and midnight 11 PM - 12 AM badges.
    - **Cake Delivery Showcase:** Dedicated section highlighting birthdays, anniversaries, kids' bakes, weddings, bento cakes, and 100% pure vegetarian (eggless) options.
    - **40+ Localities Coverage Grid:** Real-time coverage display for Paltan Bazaar, G S Road, Zoo Road, Six Mile, Ganeshguri, Ulubari, Beltola, Dispur, Christian Basti, Rukminigaon, Hatigaon, Bhangagarh, Chandmari, Silpukhuri, Maligaon, Jalukbari, Basistha, Lokhra, Narengi, etc., with instant WhatsApp chat trigger.
    - **Spotlight Modules:** Birthday Cakes, Anniversary Cakes, Korean Bento Cakes, Fresh Flowers (Roses, Orchids, Lilies, Gerberas, Carnations), Cake & Flower Combos, and Valentine's Day romance gifts.
    - **Guwahati FAQ Section & FAQPage Schema:** 6 structured Q&As answering midnight delivery, morning surprise, NRI international orders, and delivery cutoffs.
    - **Popular Searches Tag Cloud:** 43 high-volume search phrases converted to internal catalog and search links, replacing external competitor domains.
  - Linked Guwahati to the top of "Delivery By City" in the Storefront Mega Menu (`src/components/storefront/mega-menu.tsx`).
  - Tested and validated production build (`npm run build` exits `0`).

---

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
