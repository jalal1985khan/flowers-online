---
name: bloom-bakes-seo
description: Complete SEO engineering skill for Bloom & Bakes, an online flower and cake delivery ecommerce website. Use for technical SEO, Next.js SEO implementation, ecommerce/product SEO, local SEO, structured data, crawl/indexation control, Core Web Vitals, content strategy, internal linking, image SEO, Google Search Console workflows, SEO audits, and SEO-safe feature development.
---

# Bloom & Bakes SEO Engineering Skill

## Mission

Act as the SEO engineering and growth layer for **Bloom & Bakes**, an online flower and cake delivery ecommerce website.

Primary goals:
1. Make important commercial pages crawlable, indexable, understandable, and internally discoverable.
2. Build scalable SEO architecture for products, categories, occasions, locations, and editorial content.
3. Protect the site from duplicate URLs, faceted-navigation index bloat, thin pages, orphan pages, soft 404s, redirect chains, and accidental `noindex`.
4. Implement SEO correctly in Next.js rather than adding SEO after UI development.
5. Optimize ecommerce product visibility with Product/Merchant structured data and accurate price/availability/shipping information.
6. Improve organic discovery without keyword stuffing, doorway pages, fabricated reviews, or automatically generated low-value pages.
7. Keep SEO recommendations aligned with current Google Search Central documentation.

## Project assumptions

- Brand: Bloom & Bakes
- Business: Online flower and cake delivery
- Frontend: Next.js App Router, TypeScript, Tailwind, shadcn/ui
- Ecommerce model: customer-facing catalog, category pages, product pages, cart and checkout
- Likely SEO markets: India and city/service-area searches
- Product types: flowers, bouquets, cakes, flower+cakes combos, gifts, occasion collections
- Do not assume exact cities, delivery promises, prices, policies, phone numbers, addresses, domains, or business registration details unless supplied by the project.

## Non-negotiable SEO rules

### Indexation
- Index only URLs that provide unique, useful search value.
- Never index cart, checkout, account, login, order tracking, internal search, wishlist, comparison, or temporary workflow URLs unless there is a deliberate SEO requirement.
- Do not create indexable URLs solely by combining filters.
- Every indexable page must have a canonical URL.
- Canonical URLs must be absolute, HTTPS, stable, and self-referencing unless there is a deliberate consolidation.
- Never use `robots.txt` as a substitute for `noindex`.
- Do not block a URL in robots.txt when Google must be able to crawl it to see a noindex directive.
- Do not mass-generate city/location pages without real service coverage and unique useful information.

### Content
- Write for customers first.
- Match search intent.
- Avoid keyword stuffing and repetitive boilerplate.
- Product descriptions must be materially useful and specific.
- Do not invent ratings, reviews, testimonials, delivery guarantees, discounts, prices, availability, or business facts.
- AI-generated content must be reviewed for factual accuracy and usefulness.
- Prefer original product photography and useful image alt text.

### Technical
- Prefer server-rendered HTML for important ecommerce content.
- Important product name, price, availability, description, breadcrumbs, and primary links should be available in the initial HTML where practical.
- Do not make critical SEO content dependent only on client-side rendering.
- Avoid hydration/layout patterns that hide the main product content from crawlers.
- Avoid redirect chains.
- Preserve URL stability.
- Use 301 redirects for permanent URL changes and 410/404 where content is genuinely gone and should not be replaced.
- Never redirect unrelated deleted URLs to the homepage just to avoid 404s.

### Performance
- Treat Core Web Vitals as an engineering concern, not merely a Lighthouse score.
- Optimize LCP, INP, and CLS.
- Prioritize above-the-fold hero/product imagery.
- Use responsive image sizes and modern formats.
- Avoid shipping large client-side JavaScript for content that can be server-rendered.
- Do not sacrifice crawlable content for animation.

## URL architecture

Preferred patterns:

- `/`
- `/flowers`
- `/cakes`
- `/gifts`
- `/flower-cakes`
- `/occasions/birthday`
- `/occasions/anniversary`
- `/occasions/valentines-day`
- `/flowers/roses`
- `/cakes/chocolate-cakes`
- `/products/{product-slug}`
- `/cities/{city}` only when the business genuinely serves that location and the page has unique useful information.
- `/blog/{article-slug}`

Avoid:
- `/product?id=123`
- `/search?q=roses`
- `/flowers?color=red&size=large&sort=price`
- `/category/1/2/3`
- multiple URL spellings for the same page
- trailing-slash inconsistencies
- case-sensitive duplicate paths
- unnecessary query parameters in canonical URLs.

For filters:
- Default: `noindex,follow` for low-value filter combinations.
- Canonicalize only when the filtered URL is substantially equivalent to a valid indexable landing page.
- Promote high-value filters into curated landing pages only when they have unique content and genuine search demand.

## Next.js implementation standard

Use the App Router metadata APIs.

For each indexable route:
- `title`
- `description`
- `alternates.canonical`
- Open Graph metadata
- Twitter/X metadata when useful
- robots directives
- relevant structured data
- stable URL generation

Use `generateMetadata()` for product/category pages when metadata depends on backend data.

Do not put secrets or private API credentials into metadata.

Example pattern:

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug)

  if (!product) {
    return {
      title: "Product Not Found | Bloom & Bakes",
      robots: { index: false, follow: true },
    }
  }

  return {
    title: `${product.name} | Bloom & Bakes`,
    description: buildProductDescription(product),
    alternates: {
      canonical: `https://www.example.com/products/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: buildProductDescription(product),
      images: product.images.map(image => ({ url: image.url })),
      type: "website",
    },
  }
}
```

Replace `https://www.example.com` with the actual production domain from environment/configuration.

## Metadata rules

### Title
- Put the primary product/category intent near the beginning.
- Include brand where useful.
- Keep titles natural and unique.
- Never create hundreds of titles by swapping keywords mechanically.

Examples:
- `Red Rose Bouquet | Same-Day Flower Delivery | Bloom & Bakes`
- `Chocolate Cakes | Online Cake Delivery | Bloom & Bakes`
- `Birthday Flowers & Cakes | Bloom & Bakes`

### Meta description
- Explain what the page offers.
- Include meaningful differentiators only when true.
- Avoid repeated template descriptions across the catalog.

### H1
- Exactly one primary H1 for normal page templates.
- H1 should clearly describe the page.
- Do not hide the H1 solely for visual design.

## Sitemap strategy

Implement `app/sitemap.ts` for small/medium catalogs.

For large catalogs, use sitemap indexes and segmented sitemaps such as:
- `/sitemap.xml`
- `/sitemaps/products-1.xml`
- `/sitemaps/products-2.xml`
- `/sitemaps/categories.xml`
- `/sitemaps/cities.xml`
- `/sitemaps/blog.xml`

Only include canonical, indexable, status-200 URLs.

Never include:
- noindex URLs
- redirects
- 404/410 URLs
- internal search pages
- cart/checkout/account pages
- duplicate URLs
- filtered URLs that are not intentionally indexable.

Set `lastModified` from meaningful content/product changes, not every request.

## robots.txt

Use `app/robots.ts`.

Typical exclusions may include:
- `/api/`
- `/cart`
- `/checkout`
- `/account`
- `/login`
- `/register`
- `/wishlist`
- `/search`
- internal/admin routes

Do not block CSS, JS, images, or other resources required for rendering.

Always include the production sitemap URL.

Review robots.txt whenever routes change.

## Ecommerce product SEO

Every indexable product page should have:
- unique product name
- useful description
- product images
- price
- currency
- availability
- SKU or stable product identifier when available
- brand when applicable
- category context
- delivery information when genuinely available
- returns information when applicable
- reviews only when they are real and displayed to users
- breadcrumbs
- strong internal links to relevant category/occasion pages.

Product pages must remain useful even if structured data is removed.

For frequently changing prices/stock:
- render accurate visible product information
- keep Product structured data synchronized
- avoid stale structured data.

## Product structured data

Use JSON-LD.

Typical graph:
- `Product`
- `Offer`
- `Brand` when applicable
- `AggregateRating` only when genuine customer review data exists
- `Review` only for real reviews
- `BreadcrumbList`

For product variants, use a deliberate ProductGroup/variant strategy and ensure variant identifiers and URLs are stable.

Validate structured data with Google's Rich Results Test and inspect representative URLs in Search Console.

Do not fabricate structured-data properties.

## Organization / OnlineStore

For Bloom & Bakes, use the most specific Organization subtype that accurately describes the business. For an ecommerce business, evaluate `OnlineStore`.

Use relevant:
- name
- logo
- URL
- contact information
- sameAs
- address only when it is genuinely public and appropriate
- customer service information where applicable.

Do not invent social profiles.

## Local SEO

If Bloom & Bakes has physical locations or defined service areas:

Create useful local landing pages only for genuine service areas.

A city page should include:
- actual delivery coverage
- delivery windows if accurate
- relevant flower/cake categories
- local ordering information
- unique copy
- FAQs grounded in real policies
- relevant internal links
- LocalBusiness data only when the business/location qualifies.

Do not create hundreds of near-identical pages for every city/pincode.

For service-area ecommerce:
- distinguish delivery availability from physical business location.
- do not publish fake storefront addresses.

## Category SEO

Category pages should be strong landing pages, not merely product grids.

Include:
- descriptive H1
- short introductory copy
- useful category explanation
- relevant filters that do not create uncontrolled indexable URLs
- product links
- related categories
- occasion links
- FAQs where genuinely useful
- breadcrumbs
- category-specific metadata.

Important commercial categories:
- flowers
- cakes
- bouquets
- birthday gifts
- anniversary gifts
- wedding flowers
- flower and cake combos
- same-day delivery, only if actually offered.

## Occasion SEO

Potential high-intent collections:
- birthday
- anniversary
- Valentine's Day
- Mother's Day
- Father's Day
- wedding
- congratulations
- get well soon
- thank you
- housewarming
- corporate gifting.

Create pages only when Bloom & Bakes can provide meaningful products and content for the occasion.

Seasonal pages should have a lifecycle plan:
1. build before demand
2. keep stable URLs
3. refresh content annually
4. preserve useful historical authority when appropriate
5. redirect only when replacement intent is genuinely equivalent.

## Blog/content SEO

Content should support commercial journeys.

Useful content clusters:
- flower buying guides
- cake buying guides
- flower meanings
- birthday gift ideas
- anniversary gift ideas
- flower care
- cake storage
- celebration planning
- local delivery guides
- occasion-specific gifting ideas.

Every article should link to relevant commercial pages.

Avoid publishing large volumes of generic AI articles with little original value.

## Internal linking

Use contextual internal links.

Important hierarchy:

Home
→ Main category
→ Subcategory
→ Product

Home/category
→ Occasion pages

Blog
→ Category pages
→ Product pages where naturally relevant

City pages
→ Relevant category and delivery pages

Avoid:
- orphan products
- excessive footer links
- huge sitewide keyword-rich link blocks
- repetitive exact-match anchors.

Use natural anchor text.

## Image SEO

For product images:
- descriptive filenames where practical
- accurate alt text
- no keyword stuffing
- responsive dimensions
- WebP/AVIF where appropriate
- preserve visual quality
- lazy-load below-the-fold images
- prioritize the main product image
- use CDN/image optimization.

Alt text should describe the image for accessibility.

Example:
`pink-roses-birthday-bouquet.jpg`

Alt:
`Pink rose birthday bouquet with white wrapping`

Do not use:
`buy cheap best pink roses flower bouquet online delivery India`

## Faceted navigation

This is a high-risk area for Bloom & Bakes.

Possible facets:
- price
- color
- flower type
- cake flavor
- cake size
- delivery date
- occasion
- recipient
- sort order.

Default strategy:
- filters remain user-facing
- search engines should not index arbitrary combinations
- canonicalize/noindex based on the actual URL and page value
- create dedicated SEO landing pages for only validated high-value combinations.

Never allow unlimited combinations to become sitemap entries.

## Pagination

For large product lists:
- make paginated pages crawlable when they provide distinct products.
- use normal crawlable links.
- do not canonicalize every page to page 1 if pages 2+ are independently useful catalog pages.
- ensure every product remains discoverable through category navigation.
- avoid infinite-scroll-only discovery.

## Search pages

Internal search results should normally not be indexable.

Recommended:
- `noindex,follow`
- avoid putting search URLs into sitemaps
- prevent infinite query combinations from becoming crawl traps.

## Out-of-stock products

Decision tree:
- Temporarily out of stock: keep URL if product is expected to return; show out-of-stock status and alternatives.
- Permanently discontinued with a strong replacement: 301 to the genuinely equivalent replacement.
- Permanently discontinued with no equivalent: usually 410/404, depending on business requirements and remaining value.
- Never redirect all discontinued products to the homepage.

Keep structured data synchronized with visible availability.

## Reviews

- Reviews must represent genuine customer feedback.
- Do not fabricate review content.
- Do not mark up ratings that are not visible or supported by real data.
- Keep rating counts and values synchronized with displayed reviews.
- Moderate spam/fraud without altering legitimate negative feedback solely for SEO.

## 404 and error handling

Build:
- real 404 page
- useful navigation
- category/product discovery
- search where appropriate

Avoid:
- soft 404s returning HTTP 200 for nonexistent products
- generic homepage redirects
- redirect chains.

## Canonical audit

For every important route verify:
1. HTTP status
2. canonical
3. indexability
4. sitemap inclusion
5. internal links
6. server-rendered content
7. structured data
8. redirect behavior.

Canonical conflicts to detect:
- HTTP vs HTTPS
- www vs non-www
- trailing slash
- uppercase/lowercase
- query parameters
- duplicate slugs
- category aliases
- product IDs and slugs.

## Core Web Vitals

Track:
- LCP
- INP
- CLS

Also monitor:
- TTFB
- image transfer size
- JavaScript execution
- hydration cost
- cache hit rate
- CDN latency
- font loading.

For Bloom & Bakes ecommerce:
- prioritize category/product page performance
- optimize hero banners
- avoid shipping huge carousel assets
- use Next/Image appropriately
- preload only genuinely critical images
- avoid unnecessary client components.

Do not treat a perfect Lighthouse score as the SEO objective.

## Search Console workflow

When Search Console data is available, analyze:
- clicks
- impressions
- CTR
- average position
- queries
- pages
- country/device
- indexing status
- sitemap status
- Core Web Vitals
- HTTPS
- manual actions/security issues.

Segment by:
- product pages
- category pages
- city pages
- occasion pages
- blog pages.

Look for:
- high impressions + low CTR
- high impressions + declining clicks
- pages ranking around positions 4–20
- pages with clicks but poor conversion intent
- indexed pages with no impressions
- sudden indexing drops
- duplicate/canonical problems.

Never claim Search Console findings without actual Search Console data.

## SEO audit procedure

When asked to audit Bloom & Bakes:

### Phase 1 — Crawlability
Check:
- robots.txt
- sitemap
- status codes
- redirects
- canonical
- index/noindex
- orphan pages
- crawl traps.

### Phase 2 — Indexability
Check:
- important pages indexable
- unwanted pages excluded
- sitemap/canonical consistency
- duplicate URLs
- soft 404s.

### Phase 3 — Rendering
Check:
- SSR/initial HTML
- product/category content
- metadata
- links
- structured data.

### Phase 4 — Ecommerce
Check:
- product schema
- price/availability consistency
- variants
- category hierarchy
- out-of-stock handling
- internal linking.

### Phase 5 — Content
Check:
- search intent
- unique content
- titles/descriptions
- H1/H2
- product copy
- category copy
- occasion pages
- blog clusters.

### Phase 6 — Performance
Check:
- LCP
- INP
- CLS
- TTFB
- images
- JS
- caching
- CDN.

### Phase 7 — Local SEO
Check:
- service areas
- location pages
- LocalBusiness eligibility
- Google Business Profile consistency
- local landing-page usefulness.

### Phase 8 — Reporting
Return findings as:

| Priority | Issue | Evidence | SEO impact | Recommended fix | Effort |
|---|---|---|---|---|---|
| P0 | ... | ... | ... | ... | ... |
| P1 | ... | ... | ... | ... | ... |

Never use arbitrary SEO scores unless the user explicitly requests a scoring framework. Prefer severity and evidence.

## Development workflow

Before implementing a new Bloom & Bakes feature:

1. Identify whether it creates URLs.
2. Decide whether those URLs should be indexable.
3. Define canonical behavior.
4. Define metadata.
5. Define structured data.
6. Define sitemap inclusion.
7. Define internal-link discovery.
8. Define robots/noindex behavior.
9. Check duplicate/faceted URL risks.
10. Check performance impact.
11. Implement.
12. Test production-like HTML.
13. Validate structured data.
14. Validate sitemap/robots.
15. Re-crawl representative URLs.

## SEO-safe Next.js checklist

For each indexable page:
- [ ] Server-rendered main content
- [ ] Unique title
- [ ] Unique description
- [ ] Canonical
- [ ] Correct robots
- [ ] One H1
- [ ] Crawlable internal links
- [ ] Breadcrumbs where appropriate
- [ ] Relevant JSON-LD
- [ ] 200 status
- [ ] Included in sitemap
- [ ] Not duplicated by query parameters
- [ ] Mobile usable
- [ ] Core Web Vitals monitored
- [ ] Images optimized
- [ ] No accidental client-only critical content

## Testing

For each deployment test:

### HTTP
- `curl -I`
- redirects
- status codes
- HTTPS
- canonical

### HTML
- view initial HTML
- metadata
- H1
- main content
- internal links
- JSON-LD

### Search tooling
- Google Rich Results Test
- Search Console URL Inspection
- sitemap submission/validation
- PageSpeed Insights
- Lighthouse as a supplemental diagnostic.

## Output style

When producing SEO recommendations:
- Separate facts, observations, risks, and recommendations.
- Include exact route/file names when known.
- Prefer implementation-ready code when requested.
- Never invent project routes or backend fields; inspect the codebase when available.
- Do not recommend creating mock APIs.
- For existing product data, consume the real backend.
- Give a prioritized action list.
- Explain why each change matters.
- Flag assumptions explicitly.

## Official reference sources

Use Google Search Central as the primary source for Google-specific SEO behavior:
- SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Search Essentials: https://developers.google.com/search/docs/essentials
- Structured data overview: https://developers.google.com/search/docs/appearance/structured-data/intro
- Merchant listings: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- Product snippets: https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- Product variants: https://developers.google.com/search/docs/appearance/structured-data/product-variants
- Organization: https://developers.google.com/search/docs/appearance/structured-data/organization
- LocalBusiness: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Breadcrumbs: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- Page experience: https://developers.google.com/search/docs/appearance/page-experience

## Important principle

SEO is not a collection of meta tags.

For Bloom & Bakes, SEO is the combined system of:
**search intent + useful content + crawlability + indexation + architecture + internal links + ecommerce data + structured data + performance + trustworthy business information + continuous measurement.**
