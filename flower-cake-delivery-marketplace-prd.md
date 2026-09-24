# Flower & Cake Delivery Marketplace — Product Requirements Document (PRD)

**Document version:** 1.0  
**Date:** 24 September 2026  
**Product type:** Full-stack multi-vendor flower, cake and gifting marketplace  
**Primary market:** India  
**Frontend:** Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui  
**UI acceleration:** 21st.dev components/blocks where appropriate  
**Dashboards:** shadcn/ui only  
**Architecture:** Modular monolith initially, API-first and ready to split into services  
**Primary roles:** Customer, Vendor, Vendor Staff, Super Admin, Operations/Support

---

## 1. Executive Summary

Build a premium online flower and cake delivery marketplace inspired by the strongest commerce patterns found across FNP, IGP and FlowerAura, without copying their branding, assets, layouts or proprietary implementation.

The platform allows customers to:

- Discover flowers, cakes, combos, gifts and add-ons.
- Enter a delivery pincode/city and immediately see location-eligible products.
- Select same-day, scheduled, midnight or fixed-time delivery where supported.
- Personalize cakes and gifts.
- Add a message/card and optional add-ons.
- Pay online.
- Track fulfillment and delivery.
- Reorder and manage addresses, wishlist and reviews.

The platform allows vendors to:

- Register and submit a business for approval.
- Manage products, variants, pricing, inventory, images and delivery coverage.
- Configure preparation time, delivery slots and blackout dates.
- Accept/reject/manage orders.
- Update fulfillment stages.
- Manage delivery staff/riders.
- View earnings, commissions, settlements and operational metrics.

The Super Admin platform controls:

- Vendors and approvals.
- Catalog, categories, products and attributes.
- Orders and fulfillment.
- Delivery zones and slots.
- Coupons, campaigns and promotions.
- Payments, refunds, commissions and settlements.
- Customers, reviews and support.
- CMS, SEO landing pages and merchandising.
- Analytics, audit logs and platform settings.

The storefront should feel emotional, premium, visual and fast. The administrative products should feel operational, information-dense and efficient.

---

# 2. Research Summary

## 2.1 Reference products

### FNP

FNP demonstrates a strong flower/cake/occasion-combo model, with dedicated landing pages for flower + cake combinations and express/fixed-time delivery messaging.

Research implication:

- Make combos a first-class merchandising entity.
- Make delivery promise visible before checkout.
- Support delivery-time selection as part of the buying journey.
- Create SEO landing pages around product combinations and occasions.

Source:
https://www.fnp.com/flowers-n-cakes-lp

### IGP

IGP positions flowers and cakes inside a broader gifting marketplace, emphasizing occasions, same-day delivery, midnight delivery, multiple cities and cross-border ordering.

Research implication:

- Use occasion-led navigation.
- Support international customers ordering for Indian recipients as a future capability.
- Make same-day/midnight eligibility location-aware.
- Support flowers + cakes + gifts in one cart where fulfillment rules allow.

Source:
https://www.igp.com/

### FlowerAura

FlowerAura demonstrates a broad gifting catalog including flowers, cakes, plants, personalized gifts, chocolates, hampers and combinations, along with same-day/midnight/fixed-time delivery and city coverage.

Research implication:

- Design the platform as a gifting marketplace, not only a florist.
- Build a reusable combo/bundle system.
- Support multiple delivery promises.
- Build city/pincode merchandising and SEO into the architecture.

Source:
https://www.floweraura.com/

---

# 3. Product Vision

## Vision

**Make sending a beautiful moment as easy as ordering a product.**

The customer should not have to understand vendors, inventory or logistics. They should simply choose what they want, tell the platform where and when it should arrive, personalize it, pay and track the surprise.

## Product principles

1. **Delivery-first commerce**
   - Product availability is inseparable from location and delivery slot.
2. **Emotion-first UX**
   - Occasion, recipient and intent should be as important as category.
3. **Visual discovery**
   - Large product imagery, clear variants and strong merchandising.
4. **Fast checkout**
   - Minimize unnecessary steps.
5. **Operational truth**
   - Never show a product as available if it cannot actually be fulfilled.
6. **SEO as a product feature**
   - Category, city, occasion and product pages should be indexable.
7. **Multi-vendor ready**
   - Vendor boundaries should be represented in the data model from day one.
8. **Mobile-first**
   - Most gifting sessions should work exceptionally well on mobile.
9. **Accessible components**
   - Use shadcn/ui primitives and semantic HTML.
10. **AI-ready**
   - The architecture should allow recommendations, search, merchandising and content automation later.

---

# 4. Goals

## Business goals

- Build a scalable marketplace for flowers, cakes and gifting.
- Allow multiple local vendors to fulfill orders.
- Increase average order value through combos and add-ons.
- Enable same-day and scheduled delivery.
- Create SEO-driven customer acquisition.
- Give vendors operational independence.
- Provide Super Admin complete marketplace control.

## Customer goals

- Find a suitable gift in under 2 minutes.
- Know whether the product can be delivered to the recipient before paying.
- Know the delivery date/slot before placing the order.
- Personalize gifts where supported.
- Track the order without contacting support.

## Vendor goals

- Receive clear order instructions.
- Know the promised delivery slot.
- Manage inventory and preparation capacity.
- Update fulfillment status quickly.
- Understand revenue and settlement status.

## Admin goals

- Control catalog and merchandising.
- Resolve order exceptions.
- Monitor vendor SLAs.
- Control commissions and settlements.
- Operate promotions without engineering support.

---

# 5. Non-Goals for MVP

The following should not block the first production release:

- Native mobile apps.
- International payment processing.
- Cross-border fulfillment.
- Full warehouse management.
- Advanced route optimization.
- Subscription gifting.
- Corporate bulk-order portal.
- AI-generated product images.
- Loyalty wallet with complex points rules.
- Marketplace advertising platform.

These can be added after the core marketplace is stable.

---

# 6. User Roles

## Customer

Can:

- Browse catalog.
- Search.
- Filter.
- View products.
- Select variants.
- Add personalization.
- Manage cart.
- Manage addresses.
- Place orders.
- Pay.
- Track orders.
- Review products.
- Manage wishlist.
- Manage profile.
- Request support.

## Vendor Owner

Can:

- Manage business profile.
- Manage staff.
- Manage catalog.
- Manage inventory.
- Manage pricing.
- Manage orders.
- Manage fulfillment.
- Manage delivery slots.
- Manage vendor coupons if permitted.
- View revenue.
- View commissions.
- View settlements.

## Vendor Staff

Permissions should be configurable:

- Orders only.
- Fulfillment only.
- Catalog only.
- Inventory only.
- Delivery only.

## Super Admin

Full platform access.

## Operations Manager

Access to:

- Orders.
- Vendors.
- Delivery.
- Exceptions.
- Customer support.

## Catalog Manager

Access to:

- Categories.
- Products.
- Attributes.
- Collections.
- CMS.
- SEO.

## Finance Manager

Access to:

- Payments.
- Refunds.
- Commissions.
- Settlements.
- Invoices.

---

# 7. Product Scope

## 7.1 Core catalog

Initial categories:

### Flowers

- Roses
- Lilies
- Orchids
- Carnations
- Gerberas
- Mixed flowers
- Bouquets
- Flower baskets
- Premium arrangements
- Flower boxes

### Cakes

- Birthday cakes
- Anniversary cakes
- Chocolate cakes
- Black forest
- Red velvet
- Butterscotch
- Vanilla
- Fruit cakes
- Photo cakes
- Designer cakes
- Eggless cakes
- Bento cakes
- Custom cakes

### Combos

- Flowers + Cake
- Flowers + Chocolates
- Cake + Teddy
- Flowers + Cake + Chocolates
- Plant + Cake
- Personalized gift + Cake
- Celebration hampers

### Add-ons

- Chocolates
- Teddy bears
- Greeting cards
- Balloons
- Plants
- Candles
- Photo prints
- Gift wrapping
- Personalized messages

### Future

- Plants
- Hampers
- Personalized gifts
- Perfumes
- Home décor
- Jewelry
- Corporate gifting

---

# 8. Occasion Taxonomy

Occasions should be modeled independently from categories.

Examples:

- Birthday
- Anniversary
- Valentine's Day
- Mother's Day
- Father's Day
- Wedding
- Engagement
- New Baby
- Congratulations
- Thank You
- Get Well Soon
- Housewarming
- Friendship
- Romantic
- Sorry
- Just Because
- Festival
- Corporate

This enables URLs such as:

- `/birthday/flowers`
- `/birthday/cakes`
- `/birthday/flower-cake-combos`
- `/anniversary/flowers`
- `/anniversary/cakes`
- `/valentines-day/flowers`

---

# 9. Location and Delivery Model

This is a core domain.

## 9.1 Delivery eligibility

Every product should have fulfillment rules.

Eligibility depends on:

- Pincode.
- City.
- Vendor.
- Product.
- Inventory.
- Preparation lead time.
- Delivery date.
- Delivery slot.
- Vendor working hours.
- Vendor blackout dates.
- Capacity.
- Delivery method.

Example:

```text
Product: Red Rose Cake Combo
Pincode: 560001
Date: 2026-09-25
Slot: 18:00-20:00

Vendor A:
Inventory = available
Preparation = 2 hours
Capacity = available
Delivery zone = supported

Result:
SELLABLE
```

## 9.2 Delivery types

MVP:

- Standard scheduled.
- Same-day.
- Fixed-time.

Phase 2:

- Midnight delivery.
- Express.
- Two-hour delivery.
- Next-day.

## 9.3 Delivery slot structure

Example:

```text
10:00 AM - 12:00 PM
12:00 PM - 02:00 PM
02:00 PM - 04:00 PM
04:00 PM - 06:00 PM
06:00 PM - 08:00 PM
08:00 PM - 10:00 PM
12:00 AM - 01:00 AM
```

Slots must be configurable by:

- Vendor.
- City.
- Pincode.
- Product category.
- Delivery method.
- Day of week.
- Date.

## 9.4 Capacity

A vendor may define:

```text
Maximum orders per slot = 25
Maximum cakes per slot = 15
Maximum bouquets per slot = 30
```

When capacity is reached:

- Slot becomes unavailable.
- Checkout cannot select it.
- Existing orders remain unaffected.

---

# 10. Storefront UX

## 10.1 Header

Desktop:

- Logo.
- Delivery location/pincode selector.
- Search.
- Occasion navigation.
- Categories.
- Offers.
- Track order.
- Account.
- Wishlist.
- Cart.

Mobile:

- Logo.
- Search.
- Location.
- Cart.
- Menu drawer.

## 10.2 Hero section

Recommended structure:

- Emotional campaign visual.
- Primary occasion.
- Short headline.
- Search/browse CTA.
- Delivery promise.

Example:

> Make Their Day Bloom

CTA:

> Shop Flowers

Secondary:

> Send a Cake

## 10.3 Quick delivery selector

A prominent widget:

```text
Deliver to
[ Enter pincode ]

When?
[ Today ▼ ]

Delivery:
[ Same Day ] [ Scheduled ] [ Fixed Time ]
```

The selected location should influence catalog availability.

## 10.4 Category navigation

Use visual cards:

- Flowers
- Cakes
- Combos
- Gifts
- Chocolates
- Plants

## 10.5 Occasion navigation

Use:

- Birthday
- Anniversary
- Love
- Congratulations
- Thank You
- New Baby

## 10.6 Product sections

Homepage sections:

1. Trending Now.
2. Best Sellers.
3. Same-Day Delivery.
4. Flowers for Every Occasion.
5. Cakes They’ll Love.
6. Flower + Cake Combos.
7. Gifts Under ₹499.
8. Premium Gifts.
9. Personalized Gifts.
10. Recently Viewed.
11. Customer Reviews.
12. SEO content/FAQ.

---

# 11. Search

Search should support:

- Product name.
- SKU.
- Category.
- Occasion.
- Flower type.
- Cake flavor.
- Vendor.
- City.
- Pincode.
- Synonyms.

Examples:

```text
red roses
birthday cake
flower cake combo
eggless cake
midnight flowers
anniversary gifts
gifts under 999
```

## Search ranking

Recommended weighted ranking:

```text
Exact product match
>
Availability for destination
>
Inventory
>
Popularity
>
Conversion rate
>
Rating
>
Margin
>
Freshness
```

Do not expose internal margin ranking to customers.

---

# 12. Product Listing Page

URL example:

`/flowers/roses`

Components:

- Breadcrumb.
- SEO heading.
- Description.
- Delivery location.
- Filter sidebar.
- Sort.
- Product grid.
- Product cards.
- Pagination or infinite loading.
- FAQ.
- Related collections.

Filters:

- Price.
- Flower type.
- Color.
- Occasion.
- Delivery time.
- Rating.
- Eggless.
- Size.
- Availability.
- Personalization.
- Vendor, only if marketplace transparency is enabled.

Product card:

- Image.
- Badge.
- Product name.
- Rating.
- Current price.
- MRP.
- Discount.
- Earliest delivery.
- Wishlist.
- Quick add.

---

# 13. Product Detail Page

URL:

`/p/red-rose-birthday-bouquet`

Sections:

1. Breadcrumb.
2. Image gallery.
3. Product title.
4. Rating/review count.
5. Price.
6. Discount.
7. Delivery availability.
8. Variant selector.
9. Personalization.
10. Delivery date.
11. Delivery slot.
12. Add-ons.
13. Add to cart.
14. Buy now.
15. Product details.
16. Ingredients/materials.
17. Care instructions.
18. Delivery information.
19. Cancellation policy.
20. Reviews.
21. Related products.
22. Frequently bought together.

## Product delivery widget

```text
Deliver to: 560001

✓ Available for delivery

Earliest:
Today, 6 PM - 8 PM

[ Change ]
```

If unavailable:

```text
Not available for this pincode today.

Next available:
Tomorrow, 10 AM - 12 PM
```

---

# 14. Personalization

Supported personalization types:

## Text

- Cake message.
- Greeting card.
- Gift message.

Validation:

- Maximum characters.
- Allowed characters.
- Profanity moderation.

## Image

For photo cakes/gifts:

- Upload image.
- Crop.
- Rotate.
- Preview.
- Validate resolution.
- Store secure media URL.

## Product options

Example:

```text
Cake:
1 kg

Flavor:
Chocolate

Egg:
Eggless

Message:
Happy Birthday Sarah!

Add:
Greeting Card + ₹99
```

---

# 15. Cart

Cart should be vendor-aware.

Example:

```text
Vendor A
Flower Bouquet
Cake

Vendor B
Chocolate Hamper
```

MVP recommendation:

**Restrict checkout to one fulfillment group per order**, while allowing multiple groups in the cart.

If multiple vendors are selected:

```text
Your cart contains products from different delivery partners.

These will be placed as separate orders.
```

This prevents fulfillment and delivery-slot ambiguity.

## Cart calculations

```text
Subtotal
Discount
Delivery Fee
Express Fee
Personalization Fee
Packaging Fee
Tax
Tip
Grand Total
```

All calculations must be server-authoritative.

---

# 16. Checkout

## Step 1 — Recipient

- Name.
- Mobile.
- Address.
- Landmark.
- Pincode.
- City.
- State.
- Address type.

## Step 2 — Delivery

- Date.
- Slot.
- Delivery type.
- Special instructions.

## Step 3 — Personalization

- Card message.
- Cake message.
- Uploads.

## Step 4 — Add-ons

- Chocolates.
- Teddy.
- Balloons.
- Card.
- Gift wrap.

## Step 5 — Payment

- UPI.
- Cards.
- Net banking.
- Wallets.
- Other gateway-supported methods.

## Step 6 — Confirmation

Show:

- Order ID.
- Delivery date.
- Slot.
- Recipient.
- Amount.
- Tracking.

---

# 17. Payment Architecture

Use a payment gateway abstraction.

Recommended first integration:

- Razorpay or another India-compatible gateway.

The application must not hardcode gateway-specific business logic throughout checkout.

Use:

```text
PaymentProvider
  ├── createOrder()
  ├── initiatePayment()
  ├── verifyPayment()
  ├── refund()
  └── getPaymentStatus()
```

Payment states:

```text
CREATED
PENDING
AUTHORIZED
CAPTURED
FAILED
REFUND_PENDING
REFUNDED
PARTIALLY_REFUNDED
```

Never mark an order as paid based solely on frontend success.

Payment confirmation must be verified server-side/webhook-side.

---

# 18. Order State Machine

Recommended states:

```text
CART
↓
CHECKOUT_STARTED
↓
PAYMENT_PENDING
↓
PAYMENT_CONFIRMED
↓
ORDER_CONFIRMED
↓
VENDOR_ACCEPTED
↓
PREPARING
↓
READY_FOR_PICKUP
↓
OUT_FOR_DELIVERY
↓
DELIVERED
```

Exception states:

```text
VENDOR_REJECTED
CANCELLED
PAYMENT_FAILED
REFUND_PENDING
REFUNDED
DELIVERY_FAILED
CUSTOMER_UNAVAILABLE
```

Order status must be append-only through an order event log.

---

# 19. Order Event Timeline

Example:

```text
09:20
Order placed

09:21
Payment confirmed

09:24
Vendor accepted order

14:10
Cake preparation started

16:20
Order packed

17:00
Picked up by delivery partner

17:35
Out for delivery

18:12
Delivered
```

Every event stores:

- Timestamp.
- Actor.
- Role.
- Status.
- Metadata.
- IP/device where appropriate.

---

# 20. Vendor Marketplace

## Vendor onboarding

Fields:

- Business name.
- Legal name.
- Owner name.
- Phone.
- Email.
- Address.
- GST details.
- PAN.
- Bank account.
- IFSC.
- Business documents.
- Store images.
- Categories.
- Service locations.
- Operating hours.

Vendor lifecycle:

```text
DRAFT
→ SUBMITTED
→ UNDER_REVIEW
→ APPROVED
→ ACTIVE
→ SUSPENDED
→ CLOSED
```

## Vendor profile

Vendor can manage:

- Business information.
- Store hours.
- Holidays.
- Delivery zones.
- Product catalog.
- Inventory.
- Preparation time.
- Order capacity.
- Staff.
- Bank details.

---

# 21. Vendor Product Management

Vendor product fields:

```text
Product ID
SKU
Name
Slug
Description
Category
Occasions
Images
Videos
Base Price
MRP
Sale Price
Tax Class
Weight
Dimensions
Variants
Inventory
Preparation Time
Delivery Zones
Available Dates
Status
```

Vendor can:

- Create.
- Edit.
- Duplicate.
- Archive.
- Bulk update.
- Upload CSV.
- Manage images.
- Manage variants.

Super Admin controls publishing approval.

---

# 22. Product Approval Workflow

Vendor:

```text
Draft → Submit
```

Admin:

```text
Pending Review
```

Admin actions:

- Approve.
- Reject with reason.
- Request changes.

Approved:

```text
Published
```

Rejected:

```text
Changes Required
```

---

# 23. Vendor Inventory

Inventory must support:

- Simple quantity.
- Variant quantity.
- Daily capacity.
- Slot capacity.

For cakes:

```text
Chocolate 0.5kg = 20
Chocolate 1kg = 10
Chocolate 2kg = 5
```

For flowers:

```text
Red Roses Bouquet = 50
Premium Orchid Box = 10
```

Inventory reservations should happen during checkout/payment with an expiration.

Example:

```text
Reservation TTL = 10 minutes
```

After expiration:

- Release inventory.
- Release delivery-slot capacity.

---

# 24. Vendor Order Dashboard

Main views:

- New.
- Accepted.
- Preparing.
- Ready.
- Picked Up.
- Delivered.
- Cancelled.
- Exceptions.

Order card:

```text
#ORD-10245

Delivery:
Today, 6-8 PM

Recipient:
Sarah

Products:
1 × Red Rose Bouquet
1 × Chocolate Cake

Special:
Eggless

[Accept] [Reject]
```

---

# 25. Vendor Dashboard

Metrics:

- Today's orders.
- Today's revenue.
- Pending orders.
- Orders due today.
- Fulfillment SLA.
- Cancellation rate.
- Product availability.
- Upcoming slots.
- Settlement balance.

Charts:

- Revenue.
- Orders.
- Average order value.
- Category sales.
- Delivery performance.

Use shadcn/ui dashboard blocks/components. shadcn provides sidebar, cards, charts, data tables and other dashboard primitives suitable for this structure.

---

# 26. Super Admin Dashboard

Top KPIs:

- GMV.
- Net revenue.
- Orders.
- AOV.
- Active customers.
- Active vendors.
- Pending vendor approvals.
- Pending order exceptions.
- Refunds.
- Cancellation rate.

Dashboard sections:

1. Revenue overview.
2. Order funnel.
3. Vendor performance.
4. Delivery performance.
5. Top products.
6. Top categories.
7. City performance.
8. Coupon performance.
9. Customer acquisition.
10. Exceptions.

---

# 27. Admin Navigation

```text
Overview

Orders
  All Orders
  Pending
  Exceptions
  Returns
  Refunds

Catalog
  Products
  Categories
  Collections
  Attributes
  Add-ons
  Combos

Vendors
  All Vendors
  Pending Approval
  Vendor Staff
  Vendor Performance
  Settlements

Customers
  Customers
  Segments
  Reviews
  Support

Delivery
  Zones
  Slots
  Capacity
  Delivery Partners
  Tracking

Marketing
  Coupons
  Promotions
  Campaigns
  Banners
  Recommendations

CMS
  Pages
  Blog
  FAQs
  Landing Pages
  SEO

Finance
  Payments
  Refunds
  Commissions
  Settlements
  Invoices

Analytics
  Sales
  Customers
  Vendors
  Products
  Delivery

Settings
  General
  Tax
  Payment
  Notifications
  Roles
  Audit Logs
```

---

# 28. Admin UI Rules

The dashboard must use **shadcn/ui completely**.

Allowed:

- Button.
- Card.
- Dialog.
- Sheet.
- Drawer.
- Dropdown Menu.
- Command.
- Input.
- Select.
- Combobox.
- Calendar.
- Date Picker.
- Table.
- Data Table.
- Tabs.
- Badge.
- Tooltip.
- Toast/Sonner.
- Sidebar.
- Chart.
- Pagination.
- Breadcrumb.
- Form.
- Alert.
- Alert Dialog.
- Skeleton.
- Empty State patterns composed from shadcn primitives.

Use 21st.dev for selected storefront/marketing components where it improves the experience, but integrate the source into the project's shadcn-compatible component architecture.

Do not introduce an unrelated component library.

---

# 29. Design System

## Storefront

Visual direction:

- Premium.
- Warm.
- Emotional.
- Editorial.
- High-quality photography.
- Generous whitespace.
- Strong typography.
- Soft surfaces.
- Elegant cards.
- Subtle motion.

Do not copy FNP, IGP or FlowerAura visual identity.

## Admin

Visual direction:

- Clean.
- Dense but readable.
- Operational.
- Data-first.
- Consistent.
- Keyboard-friendly.

## Component rules

- Tailwind CSS only.
- shadcn/ui as the base.
- Lucide icons.
- No inline styles.
- No custom CSS files unless absolutely required by a third-party integration.
- Use CSS variables for theme values.
- Dark mode should work for admin.
- Storefront should support responsive layouts.
- Avoid hardcoded colors in components.

---

# 30. Recommended Frontend Architecture

Use Next.js App Router.

The current Next.js App Router is based on React Server Components, Suspense and Server Functions and provides file-system routing, layouts and navigation optimizations.

Recommended structure:

```text
src/
├── app/
│   ├── (storefront)/
│   │   ├── page.tsx
│   │   ├── flowers/
│   │   ├── cakes/
│   │   ├── combos/
│   │   ├── gifts/
│   │   ├── occasions/
│   │   ├── p/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── account/
│   │
│   ├── (admin)/
│   │   └── admin/
│   │
│   ├── (vendor)/
│   │   └── vendor/
│   │
│   ├── api/
│   ├── sitemap.ts
│   ├── robots.ts
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── storefront/
│   ├── product/
│   ├── checkout/
│   ├── admin/
│   └── vendor/
│
├── features/
│   ├── catalog/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── delivery/
│   ├── vendors/
│   ├── payments/
│   └── customers/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── payments/
│   ├── delivery/
│   ├── search/
│   ├── notifications/
│   ├── seo/
│   └── utils/
│
├── hooks/
├── types/
└── config/
```

Reference:
https://nextjs.org/docs/app

---

# 31. Server vs Client Components

Default:

**Server Components**

Use for:

- Product pages.
- Category pages.
- SEO content.
- Product data fetching.
- Server-rendered navigation.
- CMS content.
- Structured data.

**Client Components**

Use only when interaction requires it:

- Cart drawer.
- Filters.
- Product image carousel.
- Date/slot picker.
- Personalization editor.
- Checkout forms.
- Payment UI.
- Interactive dashboard charts.

This keeps the storefront fast and reduces unnecessary client JavaScript.

---

# 32. State Management

Recommended:

- TanStack Query for server state where client caching is needed.
- Zustand for local UI/cart state where appropriate.
- React Hook Form + Zod for forms.
- URL search parameters for filters/sorting.
- Server actions/API routes for mutations where appropriate.

Do not put the entire application state into Zustand.

---

# 33. Backend Architecture

Recommended initial architecture:

```text
Next.js Web
      |
      v
API Layer
      |
      +----------------+
      |                |
      v                v
PostgreSQL         Redis
      |
      +-------------------------------+
      |        |        |       |      |
    Catalog  Orders  Vendors  Users  Finance
```

Recommended backend options:

### Option A — Next.js full stack

Use:

- Route Handlers.
- Server Actions.
- PostgreSQL.
- ORM.

### Option B — Next.js + dedicated API

Recommended for a serious marketplace:

```text
Next.js
    |
API / Backend
    |
PostgreSQL
Redis
Workers
```

This gives more flexibility for:

- Vendor integrations.
- Payment webhooks.
- Delivery integrations.
- Background jobs.
- Notifications.
- Future mobile apps.

---

# 34. Database

Recommended database:

**PostgreSQL**

Core tables/entities:

```text
users
roles
permissions
user_roles

customers
customer_addresses
customer_preferences

vendors
vendor_staff
vendor_documents
vendor_service_areas
vendor_business_hours
vendor_holidays

categories
subcategories
occasions
collections

products
product_variants
product_images
product_attributes
product_attribute_values

inventory
inventory_reservations

combos
combo_items
add_ons

delivery_zones
delivery_slots
delivery_slot_capacity

carts
cart_items

orders
order_items
order_addresses
order_delivery
order_events

payments
payment_transactions
refunds

coupons
coupon_rules
coupon_redemptions

reviews
review_media

wishlists
wishlist_items

notifications
notification_templates

commissions
vendor_settlements
settlement_items

cms_pages
seo_pages
blog_posts
faqs
banners

support_tickets

audit_logs
```

---

# 35. Important Database Relationships

```text
Vendor
 ├── Products
 ├── Staff
 ├── Inventory
 ├── Service Areas
 ├── Delivery Slots
 └── Orders

Product
 ├── Category
 ├── Occasions
 ├── Variants
 ├── Images
 ├── Inventory
 └── Vendor

Order
 ├── Customer
 ├── Vendor
 ├── Items
 ├── Address
 ├── Delivery
 ├── Payment
 ├── Events
 └── Refunds
```

---

# 36. Product Model

A product should support:

```text
Product
  id
  vendorId
  categoryId
  name
  slug
  shortDescription
  description
  status
  basePrice
  compareAtPrice
  taxClass
  preparationMinutes
  isPersonalizable
  isEggless
  weight
  seoTitle
  seoDescription
  createdAt
  updatedAt
```

Variant:

```text
ProductVariant
  id
  productId
  sku
  name
  price
  compareAtPrice
  inventory
  attributes
```

---

# 37. Combo Model

Combos must not be implemented as a simple product description.

Example:

```text
Combo:
Rose + Chocolate Cake

Components:
1 × Rose Bouquet
1 × Chocolate Cake

Rules:
- Same vendor required
OR
- Compatible fulfillment group
```

A combo should have its own:

- Price.
- Images.
- SKU.
- Inventory logic.
- Preparation time.
- Delivery rules.
- SEO metadata.

---

# 38. API Design

Use REST initially, with clear domain boundaries.

## Customer APIs

```text
GET    /api/v1/categories
GET    /api/v1/occasions
GET    /api/v1/products
GET    /api/v1/products/:slug
GET    /api/v1/search
POST   /api/v1/location/check
GET    /api/v1/delivery/slots
POST   /api/v1/cart
PATCH  /api/v1/cart
DELETE /api/v1/cart/items/:id

POST   /api/v1/orders
GET    /api/v1/orders
GET    /api/v1/orders/:id
POST   /api/v1/payments/create
POST   /api/v1/payments/verify
POST   /api/v1/reviews
```

## Vendor APIs

```text
GET    /api/v1/vendor/dashboard
GET    /api/v1/vendor/orders
PATCH  /api/v1/vendor/orders/:id
GET    /api/v1/vendor/products
POST   /api/v1/vendor/products
PATCH  /api/v1/vendor/products/:id
GET    /api/v1/vendor/inventory
PATCH  /api/v1/vendor/inventory/:id
GET    /api/v1/vendor/settlements
```

## Admin APIs

```text
GET    /api/v1/admin/dashboard
GET    /api/v1/admin/vendors
PATCH  /api/v1/admin/vendors/:id/status
GET    /api/v1/admin/orders
PATCH  /api/v1/admin/orders/:id
GET    /api/v1/admin/products
PATCH  /api/v1/admin/products/:id/approval
GET    /api/v1/admin/settlements
POST   /api/v1/admin/coupons
POST   /api/v1/admin/banners
```

---

# 39. API Security

Requirements:

- HTTPS only.
- Secure HTTP-only cookies where applicable.
- CSRF protection for cookie-authenticated mutations.
- RBAC.
- Input validation with Zod.
- Rate limiting.
- Request IDs.
- Audit logs.
- Webhook signature validation.
- Idempotency keys for payment/order mutations.
- Server-side authorization on every protected mutation.
- Never trust customer/vendor role claims supplied by the browser.

---

# 40. Authentication

Support:

MVP:

- Email/password.
- Mobile OTP.
- Password reset.

Future:

- Google login.
- Apple login.
- WhatsApp authentication.

Sessions should be secure and revocable.

Admin authentication:

- Strong password policy.
- Optional/required MFA.
- Session timeout.
- Device/session management.

---

# 41. Notifications

Channels:

- Email.
- SMS.
- WhatsApp.
- Web push.
- In-app.

Events:

```text
ORDER_PLACED
PAYMENT_SUCCESS
PAYMENT_FAILED
ORDER_ACCEPTED
ORDER_PREPARING
ORDER_READY
OUT_FOR_DELIVERY
ORDER_DELIVERED
ORDER_CANCELLED
REFUND_INITIATED
REFUND_COMPLETED
```

Use a notification abstraction:

```text
NotificationService
  ├── EmailProvider
  ├── SMSProvider
  ├── WhatsAppProvider
  └── PushProvider
```

FCM can support web push notifications; web FCM requires HTTPS and service-worker support.

Reference:
https://firebase.google.com/docs/cloud-messaging/web/get-started

---

# 42. Delivery Tracking

MVP:

- Order status tracking.
- Delivery partner name/phone where permitted.
- Estimated delivery window.

Phase 2:

- Live rider location.
- Map.
- ETA.
- Delivery proof.
- OTP verification.

Delivery proof:

- Recipient OTP.
- Photo proof where policy permits.
- Timestamp.
- GPS coordinate.

---

# 43. Coupons and Promotions

Coupon types:

- Percentage.
- Fixed amount.
- Free delivery.
- Category-specific.
- Product-specific.
- Vendor-specific.
- Occasion-specific.
- First-order.
- Minimum order value.
- Maximum discount.
- Date-bound.
- Usage-limit.
- Customer-limit.

Rules example:

```text
WELCOME100

Minimum cart:
₹999

Discount:
₹100

New customers only

Valid:
2026-10-01 → 2026-10-31
```

Coupon validation must happen server-side.

---

# 44. Pricing Engine

Create a centralized pricing service.

```text
PricingEngine.calculate({
  customer,
  items,
  vendor,
  destination,
  deliveryDate,
  deliverySlot,
  coupon
})
```

Returns:

```text
subtotal
discount
couponDiscount
deliveryFee
expressFee
personalizationFee
tax
grandTotal
```

This same engine should be used by:

- Cart.
- Checkout.
- Order creation.
- Admin.
- Vendor reporting.

Avoid duplicate pricing logic.

---

# 45. Commission Engine

Example:

```text
Product selling price: ₹1,500

Platform commission: 20%
Commission: ₹300

Vendor gross settlement:
₹1,200
```

Support:

- Percentage commission.
- Fixed commission.
- Category commission.
- Vendor-specific commission.
- Promotional commission override.

Commission records must be immutable after settlement.

---

# 46. Settlement

Vendor settlement states:

```text
PENDING
ELIGIBLE
PROCESSING
PAID
FAILED
ON_HOLD
```

Settlement calculation:

```text
Delivered orders
- refunds
- cancellations
- platform commission
- adjustments
= vendor payable
```

Admin can place settlements on hold.

---

# 47. Reviews

Customer can review only after delivery.

Review:

- Rating.
- Title.
- Comment.
- Photos.
- Product.
- Order.
- Vendor.

Admin moderation:

- Publish.
- Hide.
- Flag.
- Remove for policy violation.

Vendor can respond.

---

# 48. Customer Account

Pages:

```text
/account
/account/orders
/account/orders/:id
/account/profile
/account/addresses
/account/wishlist
/account/reviews
/account/notifications
/account/support
```

Dashboard:

- Recent order.
- Upcoming delivery.
- Reorder.
- Wishlist.
- Saved addresses.

---

# 49. SEO Architecture

SEO is a first-class requirement.

Indexable pages:

```text
/
 /flowers
 /cakes
 /combos
 /gifts
 /flowers/roses
 /cakes/chocolate
 /birthday
 /birthday/flowers
 /birthday/cakes
 /anniversary/flowers
 /anniversary/cakes
 /city/bangalore/flowers
 /city/bangalore/cakes
 /city/bangalore/flower-cake-combos
 /p/product-slug
```

Avoid creating unlimited thin pages.

Only generate city/category combinations when there is:

- Real inventory.
- Unique content.
- Meaningful delivery information.
- Search demand/business value.

---

# 50. SEO Technical Requirements

Use Next.js metadata APIs for:

- Title.
- Description.
- Canonical.
- Open Graph.
- Twitter/X metadata.
- Robots.

Generate:

- `sitemap.ts`
- `robots.ts`

Next.js provides built-in metadata file conventions for sitemap, robots and OG assets.

References:
https://nextjs.org/docs/app/getting-started/metadata-and-og-images
https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

---

# 51. Structured Data

Product pages should generate server-rendered JSON-LD.

Types:

- Product.
- Offer.
- AggregateRating.
- BreadcrumbList.
- Organization.
- WebSite.
- LocalBusiness where appropriate.
- FAQPage only where eligible and appropriate.

Product structured data should include:

- Name.
- Image.
- Description.
- SKU.
- Brand where applicable.
- Offers.
- Price.
- Currency.
- Availability.
- URL.
- Aggregate rating where legitimate.

Google documents Product/Offer structured data for merchant listing eligibility.

Reference:
https://developers.google.com/search/docs/appearance/structured-data/merchant-listing

---

# 52. Google Merchant Center

Phase 1:

- Product structured data.

Phase 2:

- Google Merchant Center product feed.

Feed should contain:

```text
id
title
description
link
image_link
price
availability
brand
condition
product_type
google_product_category
shipping
```

Google recommends combining product structured data with Merchant Center product data for ecommerce visibility.

Reference:
https://developers.google.com/search/docs/specialty/ecommerce/share-your-product-data-with-google

---

# 53. Performance Requirements

Target:

- LCP < 2.5s.
- INP < 200ms.
- CLS < 0.1.

Priorities:

- Optimize product images.
- Use responsive image sizes.
- Lazy-load below-fold media.
- Avoid oversized client bundles.
- Use Server Components by default.
- Cache catalog responses.
- CDN delivery.
- Preconnect where justified.
- Optimize fonts.
- Avoid blocking third-party scripts.

---

# 54. Image Architecture

Product images should support:

```text
original
thumbnail
card
listing
detail
zoom
social
```

Recommended storage:

- Object storage.
- CDN transformation.
- WebP/AVIF where supported.

Image rules:

- No giant original image sent to listing cards.
- Generate multiple sizes.
- Use descriptive alt text.
- Use stable URLs.

---

# 55. Caching Strategy

Cacheable:

- Categories.
- Occasions.
- Product content.
- CMS pages.
- SEO landing pages.

Short-lived/dynamic:

- Inventory.
- Delivery slots.
- Capacity.
- Pricing.
- Coupons.

Never rely on stale cache for:

- Inventory confirmation.
- Payment status.
- Order status.
- Delivery slot capacity.

---

# 56. Background Jobs

Use a queue/worker system for:

- Payment webhook processing.
- Notifications.
- Order reminders.
- Vendor reminders.
- Settlement processing.
- Image processing.
- Search indexing.
- Sitemap generation.
- Abandoned cart notifications.
- Review reminders.

Recommended:

```text
Redis
+
BullMQ / equivalent queue
```

---

# 57. Observability

Track:

- API latency.
- Error rate.
- Checkout failures.
- Payment failures.
- Order creation failures.
- Vendor acceptance SLA.
- Delivery SLA.
- Queue failures.
- Database latency.

Use:

- Structured logs.
- Error monitoring.
- Metrics.
- Distributed/request IDs.

Every order and payment operation should be traceable by ID.

---

# 58. Audit Logging

Audit all administrative mutations.

Example:

```text
Actor:
Admin #123

Action:
PRODUCT_PRICE_UPDATED

Target:
Product #998

Before:
1499

After:
1599

Timestamp:
2026-09-24T10:30:00Z
```

Audit log should be append-only.

---

# 59. Admin Analytics

## Sales

- GMV.
- Net sales.
- AOV.
- Orders.
- Discounts.
- Refunds.
- Revenue by day/week/month.

## Customer

- New customers.
- Returning customers.
- Repeat purchase rate.
- Customer lifetime value.
- Acquisition source.

## Product

- Views.
- Add-to-cart.
- Conversion.
- Units sold.
- Revenue.
- Rating.

## Vendor

- Orders.
- Revenue.
- Acceptance time.
- Cancellation.
- SLA.
- Rating.

## Delivery

- On-time percentage.
- Late deliveries.
- Failed deliveries.
- Slot utilization.

---

# 60. CMS

Admin should manage:

- Homepage hero.
- Homepage sections.
- Banners.
- Category content.
- Occasion pages.
- City landing pages.
- FAQs.
- Blog.
- Promotional pages.

CMS blocks:

```text
Hero
Product Carousel
Category Grid
Occasion Grid
Banner
Rich Text
FAQ
Testimonials
Collection
Countdown
```

Use shadcn components for CMS controls.

---

# 61. Homepage CMS

Do not hardcode homepage merchandising.

Admin should configure:

```text
Section
Title
Subtitle
Collection
Products
Image
CTA
Start Date
End Date
Sort Order
Visibility
```

Example:

```text
Section:
Same Day Delivery

Collection:
same-day-bestsellers

Start:
2026-09-24

End:
2026-10-01
```

---

# 62. Recommendation Engine

MVP:

Rule-based:

```text
Frequently bought together
Popular in city
Popular for occasion
Recently viewed
Similar products
```

Phase 2:

AI recommendations based on:

- Customer behavior.
- Occasion.
- Budget.
- Recipient.
- Delivery requirement.
- Historical purchases.

Example:

> “You’re sending a birthday gift to Bangalore today. Here are 5 options under ₹1,500 that can arrive by 8 PM.”

---

# 63. AI Opportunities

Future AI capabilities:

### Gift finder

Input:

```text
Recipient: Wife
Occasion: Anniversary
Budget: ₹2000
Delivery: Today
```

Output:

- 5 products.
- Reasons.
- Delivery availability.

### AI search

Natural language:

> “Show me an elegant birthday flower and cake combo under 1500 that can reach Koramangala tonight.”

### AI merchandising

Admin prompt:

> Create a Valentine's Day collection under ₹1999.

### AI content

Generate:

- Product descriptions.
- SEO descriptions.
- FAQs.
- Social content.

AI output must remain reviewable before publication.

---

# 64. Analytics Events

Customer events:

```text
page_view
search
search_result_click
product_view
wishlist_add
add_to_cart
remove_from_cart
checkout_started
delivery_slot_selected
payment_started
payment_success
payment_failed
order_created
order_delivered
review_submitted
coupon_applied
```

Vendor events:

```text
vendor_login
order_accepted
order_rejected
product_created
inventory_updated
order_marked_ready
```

Admin events:

```text
vendor_approved
product_approved
coupon_created
refund_processed
settlement_processed
```

---

# 65. Security Requirements

- OWASP-aligned implementation.
- Input validation.
- Output encoding.
- Secure cookies.
- CSRF protection.
- Rate limiting.
- Brute-force protection.
- Password hashing.
- Secrets only in server environment.
- Signed webhooks.
- File upload validation.
- Malware/content scanning where appropriate.
- Role-based authorization.
- Admin audit logs.
- PII minimization.
- Data retention policy.

Never expose:

- Payment secrets.
- Database credentials.
- Vendor bank information.
- Admin tokens.
- Internal commission details to unauthorized users.

---

# 66. File Upload Security

For cake/photo personalization:

- Maximum file size.
- Allowed MIME types.
- File signature validation.
- Image dimension limits.
- Virus/malware scanning where available.
- Randomized object names.
- Private upload bucket.
- Signed download URLs when necessary.

---

# 67. Fraud/Abuse Controls

Track:

- Multiple failed payments.
- Multiple accounts from same device/IP.
- Coupon abuse.
- Excessive refunds.
- Suspicious order velocity.
- High-value orders.
- Repeated delivery failures.

Admin risk state:

```text
NORMAL
REVIEW
BLOCKED
```

Do not automatically block legitimate users solely from one signal.

---

# 68. Accessibility

Target WCAG 2.2 AA principles.

Requirements:

- Keyboard navigation.
- Focus states.
- Screen-reader labels.
- Semantic HTML.
- Accessible dialogs.
- Accessible forms.
- Error announcements.
- Color contrast.
- Reduced motion support.
- Touch target sizing.

---

# 69. Responsive Design

Breakpoints should be designed from content, not device names.

Mobile priorities:

- Search.
- Location.
- Product images.
- Delivery availability.
- Add to cart.
- Checkout.

Admin mobile:

- Essential order operations.
- Status updates.
- Alerts.

Full data-heavy admin workflows can remain desktop-first but must not become unusable on tablets.

---

# 70. Error Handling

Customer-facing errors should be actionable.

Bad:

> Error 500.

Good:

> We couldn't confirm this delivery slot. Please select another slot.

Payment:

> Your payment could not be confirmed. Your cart is still saved. Please try again.

Inventory:

> This product sold out while you were checking out. We've removed it from your cart.

---

# 71. Empty States

Examples:

Wishlist:

> Nothing saved yet.
> Save gifts you love and find them here later.

Orders:

> No orders yet.
> Find something beautiful for someone special.

Vendor orders:

> No orders for this period.

Admin:

> No pending approvals.

---

# 72. MVP Screens

## Storefront

1. Homepage.
2. Category listing.
3. Search.
4. Product detail.
5. Cart.
6. Login/signup.
7. Address management.
8. Delivery selection.
9. Checkout.
10. Payment.
11. Order confirmation.
12. Order tracking.
13. Account.
14. Wishlist.
15. Reviews.
16. Support.

## Vendor

1. Login.
2. Dashboard.
3. Orders.
4. Order detail.
5. Products.
6. Product create/edit.
7. Inventory.
8. Delivery slots.
9. Service areas.
10. Staff.
11. Earnings.
12. Settlements.
13. Profile/settings.

## Admin

1. Login.
2. Dashboard.
3. Orders.
4. Order detail.
5. Vendors.
6. Vendor approval.
7. Products.
8. Product approval.
9. Categories.
10. Collections.
11. Inventory.
12. Delivery zones.
13. Delivery slots.
14. Coupons.
15. Campaigns.
16. Customers.
17. Reviews.
18. Payments.
19. Refunds.
20. Commissions.
21. Settlements.
22. CMS.
23. SEO.
24. Analytics.
25. Settings.
26. Roles.
27. Audit logs.

---

# 73. Detailed Customer Flow

```text
Homepage
   ↓
Select location
   ↓
Choose occasion/category
   ↓
Browse products
   ↓
Open product
   ↓
Select variant
   ↓
Select delivery date
   ↓
Select delivery slot
   ↓
Personalize
   ↓
Add to cart
   ↓
Checkout
   ↓
Address
   ↓
Delivery
   ↓
Coupon
   ↓
Payment
   ↓
Confirmation
   ↓
Tracking
   ↓
Delivery
   ↓
Review
```

---

# 74. Detailed Vendor Flow

```text
Vendor registration
   ↓
Business details
   ↓
Documents
   ↓
Submit
   ↓
Admin review
   ↓
Approval
   ↓
Configure service areas
   ↓
Create products
   ↓
Admin product approval
   ↓
Publish
   ↓
Receive order
   ↓
Accept
   ↓
Prepare
   ↓
Ready
   ↓
Pickup
   ↓
Delivered
   ↓
Settlement
```

---

# 75. Detailed Admin Flow

```text
Admin login
   ↓
Dashboard
   ↓
Review vendor applications
   ↓
Approve vendor
   ↓
Review catalog
   ↓
Approve products
   ↓
Configure delivery
   ↓
Configure promotions
   ↓
Monitor orders
   ↓
Handle exceptions
   ↓
Monitor payments
   ↓
Process refunds
   ↓
Calculate settlements
   ↓
Review analytics
```

---

# 76. Delivery Assignment

MVP options:

### Option A
Vendor-managed delivery.

### Option B
Third-party delivery integration.

The order should store:

```text
deliveryProvider
deliveryPartnerId
trackingId
pickupTime
estimatedDeliveryTime
deliveredAt
proof
```

Shipping/delivery integrations should be behind an adapter.

Example:

```text
DeliveryProvider
  ├── createShipment()
  ├── assign()
  ├── track()
  ├── cancel()
  └── getRate()
```

Shiprocket exposes APIs for integrating shipping functionality and can be evaluated as one provider option.

Reference:
https://www.shiprocket.in/developers/

---

# 77. Vendor SLA

Configurable SLA:

```text
Accept order:
≤ 5 minutes

Start preparation:
≤ 15 minutes

Ready:
Before pickup cutoff

Delivery:
Within selected slot
```

Admin should see SLA breaches in real time.

---

# 78. Exception Management

Exception types:

- Vendor rejected.
- Inventory unavailable.
- Payment captured but order failed.
- Delivery slot unavailable.
- Delivery delayed.
- Customer unreachable.
- Wrong address.
- Damaged product.
- Product substitution.
- Refund required.

Admin should have an exception queue.

Each exception:

```text
Priority
Order
Customer
Vendor
Issue
Age
SLA
Owner
Next action
```

---

# 79. Product Substitution

For flowers, exact appearance can vary.

Vendor can request:

```text
Original:
Red Rose Bouquet

Proposed:
Premium Red Rose Bouquet

Price:
Same

Customer approval:
Required
```

Admin can configure whether substitution is:

- Not allowed.
- Allowed with customer approval.
- Allowed within same category/value.

---

# 80. Cake Operations

Cake products should support:

- Flavor.
- Size.
- Egg/eggless.
- Shape.
- Message.
- Photo.
- Delivery handling.
- Preparation lead time.

Example:

```text
Chocolate Cake

Size:
0.5kg
1kg
1.5kg
2kg

Base:
Egg
Eggless

Message:
Max 40 characters
```

---

# 81. Inventory Reservation

When checkout begins:

```text
available inventory
↓
temporary reservation
↓
payment
↓
order confirmation
```

If payment fails or expires:

```text
reservation released
```

If payment succeeds:

```text
reservation converted to committed stock
```

This prevents overselling.

---

# 82. Idempotency

Critical operations must be idempotent:

- Create order.
- Create payment.
- Payment webhook.
- Refund.
- Vendor settlement.
- Delivery creation.

Example:

```http
Idempotency-Key: 9a1c...
```

Repeated request must not create duplicate orders/payments.

---

# 83. Testing Strategy

## Unit tests

Test:

- Pricing.
- Coupon rules.
- Delivery eligibility.
- Slot capacity.
- Commission.
- Inventory reservation.
- Order state transitions.

## Integration tests

- Checkout.
- Payment webhook.
- Order creation.
- Vendor acceptance.
- Refund.
- Settlement.

## E2E

Customer:

```text
Browse → Cart → Checkout → Payment → Order
```

Vendor:

```text
Login → Order → Accept → Prepare → Ready
```

Admin:

```text
Vendor approval → Product approval → Order monitoring
```

---

# 84. Critical Test Cases

### Delivery

- Unsupported pincode.
- Supported pincode.
- Same-day cutoff passed.
- Same-day available.
- Slot full.
- Vendor closed.
- Holiday.
- Product unavailable.
- Product available but combo unavailable.

### Payment

- Success.
- Failure.
- Timeout.
- Duplicate webhook.
- Payment success but browser closed.
- Refund.
- Partial refund.

### Inventory

- Two users buy last item.
- Reservation expires.
- Payment succeeds after reservation expiry.
- Vendor manually changes inventory.

### Orders

- Vendor accepts.
- Vendor rejects.
- Admin reassigns.
- Customer cancels.
- Vendor marks ready.
- Delivery fails.

---

# 85. API Contract Rules

Every API should define:

```text
Request
Response
Error response
Authentication
Authorization
Rate limit
Idempotency
Pagination
Sorting
Filtering
```

Standard error:

```json
{
  "success": false,
  "error": {
    "code": "DELIVERY_SLOT_FULL",
    "message": "The selected delivery slot is no longer available."
  },
  "requestId": "req_123"
}
```

---

# 86. Pagination

Use cursor pagination for high-volume resources:

- Orders.
- Products.
- Customers.
- Audit logs.

Use page pagination where UX benefits:

- Search.
- Category listing.

---

# 87. Search Engine

MVP:

- PostgreSQL full-text search.

Scale:

- OpenSearch/Elasticsearch/Algolia equivalent.

Index:

```text
product name
description
category
occasion
attributes
city
availability
```

Search should be location-aware.

---

# 88. Recommended Infrastructure

Example production architecture:

```text
CDN
 |
Next.js
 |
Load Balancer
 |
API
 |
+-------------+
|             |
PostgreSQL   Redis
|             |
Storage      Queue
              |
           Workers
```

External:

```text
Payment Gateway
SMS
Email
WhatsApp
Maps/Geocoding
Delivery Provider
Analytics
Error Monitoring
```

---

# 89. Environment Strategy

```text
local
development
staging
production
```

Each environment should have independent:

- Database.
- Redis.
- Storage bucket.
- Payment credentials.
- Webhook endpoints.
- Notification credentials.

Never share production credentials with local development.

---

# 90. Deployment

Recommended:

### Frontend

Vercel or equivalent Next.js-compatible platform.

### Backend

Containerized deployment on:

- AWS.
- Azure.
- DigitalOcean.
- GCP.

### Database

Managed PostgreSQL.

### Redis

Managed Redis.

### Storage

S3-compatible object storage.

---

# 91. CI/CD

Pipeline:

```text
Pull Request
 ↓
Lint
 ↓
Typecheck
 ↓
Unit Tests
 ↓
Integration Tests
 ↓
Build
 ↓
Preview
 ↓
Approval
 ↓
Staging
 ↓
Smoke Tests
 ↓
Production
```

Run database migrations as a controlled deployment step.

---

# 92. Feature Flags

Use flags for:

- New checkout.
- New payment gateway.
- Midnight delivery.
- New recommendation engine.
- New search engine.
- New vendor commission.
- New homepage campaign.

Flags should be server-evaluable where business logic is involved.

---

# 93. Accessibility and SEO QA

Every production page must be checked for:

- Canonical.
- Title.
- Description.
- H1.
- Breadcrumb.
- Structured data.
- Robots behavior.
- Sitemap inclusion.
- Image alt text.
- Keyboard navigation.
- Focus state.
- Mobile layout.
- Performance.

---

# 94. Analytics Funnel

Core funnel:

```text
Landing
↓
Location selected
↓
Category/Search
↓
Product view
↓
Add to cart
↓
Checkout
↓
Payment initiated
↓
Payment successful
↓
Order delivered
```

Metrics:

```text
Product conversion
Cart conversion
Checkout conversion
Payment success
Order completion
```

---

# 95. Business KPIs

Primary:

- GMV.
- Net revenue.
- Orders/day.
- AOV.
- Repeat purchase rate.
- Contribution margin.
- Vendor fulfillment rate.
- On-time delivery rate.

Secondary:

- Search conversion.
- Product conversion.
- Coupon usage.
- Refund rate.
- Cancellation rate.
- Customer support contacts/order.

---

# 96. MVP Acceptance Criteria

The MVP is ready when:

### Customer

- Customer can select a location.
- Customer can browse only relevant products.
- Customer can select product variants.
- Customer can select delivery date and slot.
- Customer can personalize supported products.
- Customer can add to cart.
- Customer can checkout.
- Customer can pay.
- Customer receives confirmation.
- Customer can track status.
- Customer can review after delivery.

### Vendor

- Vendor can onboard.
- Admin can approve vendor.
- Vendor can create products.
- Admin can approve products.
- Vendor can manage inventory.
- Vendor receives orders.
- Vendor can update fulfillment.
- Vendor can see settlement information.

### Admin

- Admin can manage vendors.
- Admin can manage products.
- Admin can manage categories.
- Admin can manage orders.
- Admin can manage delivery rules.
- Admin can manage coupons.
- Admin can process refunds.
- Admin can see commissions.
- Admin can manage CMS.
- Admin can view analytics.
- Admin can see audit logs.

---

# 97. Recommended MVP Release Plan

## Phase 0 — Foundation

- Repository.
- Next.js.
- TypeScript.
- Tailwind.
- shadcn.
- 21st.dev integration where useful.
- Auth.
- PostgreSQL.
- ORM.
- CI/CD.
- Environment management.
- Logging.

## Phase 1 — Catalog

- Categories.
- Occasions.
- Products.
- Variants.
- Images.
- Vendor catalog.
- Search.
- Product detail.
- SEO.

## Phase 2 — Delivery

- Pincode.
- Service areas.
- Delivery slots.
- Capacity.
- Same-day rules.
- Scheduled delivery.

## Phase 3 — Cart/Checkout

- Cart.
- Pricing.
- Coupons.
- Address.
- Personalization.
- Checkout.
- Payment.

## Phase 4 — Orders

- Order lifecycle.
- Vendor fulfillment.
- Tracking.
- Notifications.
- Reviews.

## Phase 5 — Admin

- Vendor approvals.
- Catalog moderation.
- Orders.
- Finance.
- Coupons.
- CMS.
- Analytics.

## Phase 6 — Hardening

- Security.
- Performance.
- SEO.
- Observability.
- E2E tests.
- Load testing.
- Disaster recovery.

---

# 98. Phase 2 Roadmap

After MVP:

- Midnight delivery.
- Express delivery.
- Live tracking.
- Rider app.
- Vendor mobile/PWA.
- AI gift finder.
- AI search.
- Personalized recommendations.
- Loyalty program.
- Corporate gifting.
- Subscription.
- Google Merchant Center automation.
- WhatsApp commerce.
- International customer ordering.
- Advanced route optimization.

---

# 99. UI Component Strategy

## Storefront components

Build reusable components:

```text
SiteHeader
LocationSelector
SearchBar
CategoryNav
OccasionNav
HeroBanner
ProductCard
ProductGrid
ProductCarousel
ProductBadge
PriceDisplay
RatingStars
DeliveryPromise
DeliverySlotPicker
VariantSelector
PersonalizationForm
AddOnSelector
CartDrawer
OrderTimeline
ReviewCard
FAQ
Footer
```

## Dashboard components

Use shadcn:

```text
DashboardShell
Sidebar
DataTable
StatsCard
ChartCard
FilterBar
DateRangePicker
StatusBadge
ConfirmDialog
FormDialog
CommandMenu
BulkActions
EmptyState
SkeletonTable
ActivityTimeline
```

---

# 100. 21st.dev Usage Rules

21st.dev should be used as an accelerator, not as a second design system.

Use it for:

- Premium hero sections.
- Interactive marketing sections.
- Advanced product presentation.
- Visual navigation patterns.
- Motion-rich storefront sections.

Before adding any 21st.dev component:

1. Verify its source.
2. Check App Router compatibility.
3. Check whether it introduces client boundaries.
4. Check dependencies.
5. Adapt it to the project's shadcn theme.
6. Remove unnecessary dependencies.
7. Ensure accessibility.
8. Ensure responsive behavior.

21st.dev documentation notes that many components are client components by default, so App Router boundaries should be checked before adoption.

Reference:
https://docs.21st.dev/blog/nextjs-app-router-component-libraries

---

# 101. shadcn/ui Usage Rules

Use the official shadcn/ui project as the dashboard foundation.

shadcn/ui provides components including Button, Card, Table, Data Table patterns, Dialog, Sheet, Sidebar, Tabs, Calendar, Command, Chart and others.

Reference:
https://ui.shadcn.com/docs/components

The shadcn model adds component source into the project, giving the team ownership of the code.

Reference:
https://ui.shadcn.com/docs/new

Rules:

- Prefer existing shadcn components.
- Do not create a duplicate custom Button.
- Do not create a duplicate custom Dialog.
- Do not introduce MUI/Ant Design/Chakra for dashboard UI.
- Compose primitives when a specialized component is missing.
- Keep component APIs consistent.

---

# 102. Recommended Repository Structure

```text
flower-marketplace/
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── config/
│   ├── validation/
│   └── database/
│
├── workers/
│   ├── notifications/
│   ├── payments/
│   ├── search/
│   └── settlements/
│
├── docs/
│   ├── prd/
│   ├── api/
│   └── architecture/
│
├── .github/
│   └── workflows/
│
└── README.md
```

If the team is small, begin as a single Next.js application with clear domain modules and extract services only when operational load justifies it.

---

# 103. Recommended Domain Modules

```text
auth
users
customers
vendors
catalog
categories
occasions
inventory
delivery
cart
pricing
checkout
orders
payments
refunds
coupons
reviews
notifications
cms
seo
analytics
finance
settlements
support
audit
```

Each module should own:

- Validation.
- Database queries.
- Business rules.
- API handlers.
- Tests.

Avoid a giant `utils` business-logic folder.

---

# 104. Critical Architectural Decision

## Do not model product availability as:

```text
product.isAvailable = true
```

Instead model:

```text
Product
+
Vendor
+
Inventory
+
Destination
+
Delivery date
+
Delivery slot
+
Capacity
+
Preparation time
+
Business hours
=
Fulfillment eligibility
```

This is one of the most important architectural decisions in the entire system.

---

# 105. Checkout Integrity

At checkout, the server must revalidate:

```text
product price
product availability
inventory
vendor status
delivery area
delivery date
delivery slot
capacity
coupon
tax
delivery fee
```

Only after revalidation should an order be created.

The frontend is never authoritative.

---

# 106. Recommended Order Transaction

```text
BEGIN TRANSACTION

1. Lock/validate cart
2. Validate vendor
3. Validate products
4. Validate variants
5. Validate inventory
6. Validate delivery zone
7. Validate slot capacity
8. Calculate pricing
9. Reserve inventory
10. Reserve slot capacity
11. Create order
12. Create payment intent
13. Commit

If anything fails:
ROLLBACK
```

Payment gateway callbacks should transition the order through a separate verified flow.

---

# 107. Data Privacy

Customer data includes:

- Name.
- Phone.
- Email.
- Address.
- Order history.
- Recipient details.

Access must be restricted by role.

Vendor should see only the information required to fulfill an order.

Example:

Vendor may need:

```text
Recipient name
Recipient phone
Delivery address
Delivery instructions
```

Vendor should not automatically receive:

```text
Customer lifetime value
Internal payment metadata
Other customer orders
Internal risk score
```

---

# 108. Disaster Recovery

Requirements:

- Automated database backups.
- Point-in-time recovery where supported.
- Object-storage versioning.
- Database migration history.
- Recovery runbook.
- Backup restore tests.

Recommended targets:

```text
RPO ≤ 15 minutes
RTO ≤ 1 hour
```

These should be validated against the actual infrastructure budget.

---

# 109. Launch Checklist

## Product

- Catalog loaded.
- Categories verified.
- Vendors approved.
- Delivery zones verified.
- Delivery slots configured.
- Products have correct prices.
- Inventory verified.
- Coupons tested.

## Payment

- Production credentials configured.
- Webhooks verified.
- Refunds tested.
- Duplicate webhook protection tested.

## Delivery

- Vendors trained.
- Delivery providers configured.
- SLA configured.
- Exception workflow tested.

## SEO

- Sitemap.
- Robots.
- Canonicals.
- Product structured data.
- Breadcrumb structured data.
- Search Console.
- Merchant Center where applicable.

## Performance

- Lighthouse/PageSpeed review.
- Image optimization.
- CDN.
- Caching.
- Bundle analysis.

## Security

- Secrets rotation.
- Admin MFA.
- Rate limiting.
- Backup restore test.
- Dependency audit.

---

# 110. Definition of Done

A feature is not complete until:

- UI is responsive.
- UI uses approved design system.
- Loading state exists.
- Empty state exists.
- Error state exists.
- Permission checks exist.
- API validation exists.
- Database constraints exist.
- Analytics events exist where applicable.
- Tests exist.
- SEO is handled where applicable.
- Accessibility is checked.
- Audit logging exists for sensitive admin mutations.
- Documentation is updated.

---

# 111. Final Recommended Technology Stack

| Layer | Recommendation |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| UI | shadcn/ui |
| UI accelerator | 21st.dev |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Forms | React Hook Form |
| Validation | Zod |
| Server state | TanStack Query |
| Local state | Zustand |
| Database | PostgreSQL |
| ORM | Prisma or Drizzle |
| Cache | Redis |
| Queue | BullMQ or equivalent |
| Search MVP | PostgreSQL FTS |
| Search scale | OpenSearch/Algolia |
| Object storage | S3-compatible |
| CDN | Cloudflare/Vercel/CDN provider |
| Payments | Razorpay/compatible gateway |
| Delivery | Provider abstraction + Shiprocket/other provider |
| Notifications | Email + SMS + WhatsApp + FCM |
| Auth | Secure session-based auth |
| Analytics | Product analytics + server events |
| Monitoring | Error tracking + logs + metrics |
| Testing | Vitest/Jest + Playwright |
| CI/CD | GitHub Actions |
| Deployment | Vercel + managed backend/database |

---

# 112. Priority Matrix

## P0 — Must Have

- Customer authentication.
- Catalog.
- Search.
- Product pages.
- Location/pincode.
- Delivery eligibility.
- Inventory.
- Cart.
- Checkout.
- Payment.
- Orders.
- Vendor onboarding.
- Vendor orders.
- Admin catalog.
- Admin vendors.
- Admin orders.
- Coupons.
- Refunds.
- Basic notifications.
- SEO.

## P1 — Important

- Wishlist.
- Reviews.
- CMS.
- Analytics.
- Settlements.
- Delivery tracking.
- Product personalization.
- Combos.
- Same-day.
- Fixed-time.

## P2 — Growth

- Midnight.
- Express.
- AI gift finder.
- AI search.
- Recommendations.
- Loyalty.
- WhatsApp commerce.
- Merchant Center automation.
- Corporate gifting.

---

# 113. Success Metrics After Launch

First 90 days:

### Customer

- Search-to-product conversion.
- Product-to-cart conversion.
- Checkout conversion.
- Payment success rate.
- Repeat purchase.

### Operations

- Vendor acceptance SLA.
- On-time delivery.
- Cancellation.
- Refund.
- Delivery failure.

### Business

- GMV.
- Net revenue.
- AOV.
- Contribution margin.
- Vendor activation.
- Active customers.

### Technical

- Core Web Vitals.
- API p95 latency.
- Error rate.
- Payment webhook reliability.
- Checkout failure rate.

---

# 114. Product Architecture Summary

The complete system should be thought of as five connected products:

```text
                    ┌───────────────────────┐
                    │       CUSTOMER        │
                    │ Storefront + Checkout │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │     COMMERCE CORE     │
                    │ Catalog / Cart / Order│
                    │ Pricing / Inventory   │
                    └───────┬───────┬───────┘
                            │       │
                ┌───────────┘       └───────────┐
                ▼                               ▼
      ┌─────────────────┐             ┌─────────────────┐
      │     VENDOR      │             │    DELIVERY     │
      │ Fulfillment     │             │ Slots / Zones   │
      │ Inventory       │             │ Tracking        │
      └────────┬────────┘             └────────┬────────┘
               │                               │
               └──────────────┬────────────────┘
                              ▼
                    ┌───────────────────────┐
                    │     SUPER ADMIN       │
                    │ Marketplace Control   │
                    │ Finance / CMS / SEO   │
                    └───────────────────────┘
```

---

# 115. Recommended Build Order

Do not start by building every dashboard screen.

Build the vertical slice first:

```text
Product
→ Location
→ Delivery eligibility
→ Cart
→ Checkout
→ Payment
→ Order
→ Vendor acceptance
→ Fulfillment
→ Delivery
```

Once that flow works end-to-end, expand:

```text
Catalog management
Vendor onboarding
Admin operations
Finance
CMS
Marketing
Analytics
```

This reduces the risk of building attractive screens around an incorrect commerce model.

---

# 116. Final Product Principle

The platform should not be treated as:

> “An ecommerce website with flowers and cakes.”

It should be treated as:

> **A location-aware, time-sensitive, multi-vendor gifting fulfillment platform with an emotional ecommerce storefront.**

That distinction should drive the database, APIs, checkout, inventory, delivery, vendor dashboard and admin architecture from the beginning.

---

# Research References

1. FNP — Flowers & Cakes delivery:
https://www.fnp.com/flowers-n-cakes-lp

2. IGP — Online gifting, flowers and cakes:
https://www.igp.com/

3. FlowerAura — Gifts, flowers, cakes, combos and delivery:
https://www.floweraura.com/

4. FlowerAura — Gift delivery and delivery FAQs:
https://www.floweraura.com/gifts

5. Next.js App Router:
https://nextjs.org/docs/app

6. Next.js Metadata:
https://nextjs.org/docs/app/getting-started/metadata-and-og-images

7. Next.js Sitemap:
https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

8. Next.js Robots:
https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

9. shadcn/ui Components:
https://ui.shadcn.com/docs/components

10. shadcn/ui Project Setup:
https://ui.shadcn.com/docs/new

11. shadcn/ui Blocks:
https://ui.shadcn.com/blocks

12. 21st.dev App Router component guidance:
https://docs.21st.dev/blog/nextjs-app-router-component-libraries

13. Google Merchant Listing Structured Data:
https://developers.google.com/search/docs/appearance/structured-data/merchant-listing

14. Google Product Data / Merchant Center:
https://developers.google.com/search/docs/specialty/ecommerce/share-your-product-data-with-google

15. Firebase Cloud Messaging Web:
https://firebase.google.com/docs/cloud-messaging/web/get-started

16. Shiprocket Developer API:
https://www.shiprocket.in/developers/

---

# Appendix A — Initial Backlog

## Epic 1: Foundation

- [ ] Setup Next.js App Router
- [ ] Configure TypeScript
- [ ] Configure Tailwind
- [ ] Configure shadcn/ui
- [ ] Establish design tokens
- [ ] Setup linting
- [ ] Setup testing
- [ ] Setup CI/CD
- [ ] Setup database
- [ ] Setup Redis
- [ ] Setup logging

## Epic 2: Authentication

- [ ] Customer signup
- [ ] Customer login
- [ ] OTP
- [ ] Vendor login
- [ ] Admin login
- [ ] RBAC
- [ ] Session management

## Epic 3: Catalog

- [ ] Categories
- [ ] Occasions
- [ ] Products
- [ ] Variants
- [ ] Images
- [ ] Combos
- [ ] Add-ons
- [ ] Inventory
- [ ] Search

## Epic 4: Delivery

- [ ] Pincode serviceability
- [ ] Vendor service areas
- [ ] Delivery slots
- [ ] Capacity
- [ ] Same-day rules
- [ ] Scheduling

## Epic 5: Commerce

- [ ] Cart
- [ ] Pricing
- [ ] Coupon
- [ ] Personalization
- [ ] Checkout
- [ ] Payment
- [ ] Order

## Epic 6: Vendor

- [ ] Vendor onboarding
- [ ] Vendor approval
- [ ] Vendor dashboard
- [ ] Product management
- [ ] Inventory
- [ ] Orders
- [ ] Fulfillment
- [ ] Settlement

## Epic 7: Admin

- [ ] Admin dashboard
- [ ] Vendors
- [ ] Products
- [ ] Orders
- [ ] Customers
- [ ] Coupons
- [ ] Delivery
- [ ] Finance
- [ ] CMS
- [ ] SEO
- [ ] Analytics
- [ ] Audit logs

## Epic 8: Growth

- [ ] Wishlist
- [ ] Reviews
- [ ] Recommendations
- [ ] AI gift finder
- [ ] AI search
- [ ] Merchant Center
- [ ] WhatsApp
- [ ] Loyalty

---

# Appendix B — First 10 Screens to Design

1. Homepage.
2. Category/Product Listing.
3. Product Detail.
4. Delivery/Pincode Selector.
5. Cart.
6. Checkout.
7. Order Tracking.
8. Vendor Dashboard.
9. Super Admin Dashboard.
10. Product/Order Data Tables.

Design these first in Figma, establish the design system, then implement the reusable shadcn components before scaling to the remaining screens.
