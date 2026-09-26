import type { Prisma } from "@prisma/client";

export interface CatalogSearchParams {
  category?: string;
  occasion?: string;
  eggless?: string;
  sort?: string;
  tag?: string;
  flavor?: string;
  recipient?: string;
  delivery?: string;
  maxPrice?: string;
  minPrice?: string;
}

/** True when URL has faceted params that should not be indexed as standalone landing pages. */
export function catalogShouldNoIndex(params: CatalogSearchParams): boolean {
  const keys = Object.keys(params).filter((k) => {
    const v = params[k as keyof CatalogSearchParams];
    return v !== undefined && v !== "";
  });
  if (keys.length === 0) return false;
  if (keys.length === 1 && keys[0] === "category") return false;
  if (keys.length === 1 && keys[0] === "occasion") return false;
  if (keys.length === 2 && keys.includes("category") && keys.includes("occasion")) return false;
  return true;
}

export function buildCatalogProductWhere(
  params: CatalogSearchParams,
  pincode: string
): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    isAvailable: true,
    isApproved: true,
    vendor: {
      serviceAreas: {
        some: { pincode },
      },
    },
  };

  if (params.category) {
    const cat = params.category.toLowerCase();
    if (cat === "plants") {
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : []),
        {
          OR: [
            { category: { slug: { in: ["plants", "gifts"] } } },
            { tags: { has: "Plants" } },
            { title: { contains: "Plant", mode: "insensitive" } },
            { title: { contains: "Bamboo", mode: "insensitive" } },
            { title: { contains: "Terrarium", mode: "insensitive" } },
          ],
        },
      ];
    } else if (cat === "chocolates") {
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : []),
        {
          OR: [
            { category: { slug: "chocolates" } },
            { tags: { hasSome: ["Chocolate Cakes", "chocolate", "chocolates", "Flowers N Chocolates"] } },
            { title: { contains: "Chocolate", mode: "insensitive" } },
            { title: { contains: "Truffle", mode: "insensitive" } },
            { title: { contains: "Ferrero", mode: "insensitive" } },
          ],
        },
      ];
    } else {
      where.category = { slug: params.category };
    }
  }

  if (params.occasion) {
    const occ = params.occasion.toLowerCase();
    const tagKeywords = [occ];
    if (occ === "birthday") tagKeywords.push("Birthday", "Birthday Cakes", "Birthday flower", "Cakes For Kids");
    if (occ === "anniversary") tagKeywords.push("Anniversary", "Aniversary", "Anniversary Cakes", "couple cake", "Wedding Party Cake Guwahati");
    if (occ === "love-and-romance") tagKeywords.push("Valentine Cakes", "Valentine's Day", "Love", "Romance", "Valentine");
    if (occ === "congratulations") tagKeywords.push("Congratulations", "Celebration Cake Guwahati");
    if (occ === "raksha-bandhan") tagKeywords.push("Raksha Bandhan", "Rakhi");
    if (occ === "diwali") tagKeywords.push("Diwali");
    if (occ === "new-year") tagKeywords.push("New Year", "New Year Cakes");
    if (occ === "wedding") tagKeywords.push("Wedding Party Cake Guwahati", "couple cake");

    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          {
            occasions: {
              some: {
                occasion: { slug: params.occasion },
              },
            },
          },
          { tags: { hasSome: tagKeywords } },
          { title: { contains: occ.replace(/-/g, " "), mode: "insensitive" } },
        ],
      },
    ];
  }

  if (params.flavor) {
    const flavorRaw = params.flavor.toLowerCase().replace(/-/g, " ");
    const flavorWords = [flavorRaw];
    if (flavorRaw.includes("chocolate")) flavorWords.push("truffle", "choco");
    if (flavorRaw.includes("red velvet")) flavorWords.push("velvet");
    if (flavorRaw.includes("black forest")) flavorWords.push("forest");
    if (flavorRaw.includes("butterscotch")) flavorWords.push("butter");
    if (flavorRaw.includes("cheesecake") || flavorRaw.includes("blueberry")) flavorWords.push("cheese", "cheesecake", "blueberry");
    if (flavorRaw.includes("pineapple")) flavorWords.push("pineapple");

    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          ...flavorWords.map((w) => ({ title: { contains: w, mode: "insensitive" as const } })),
          ...flavorWords.map((w) => ({ tags: { has: w } })),
        ],
      },
    ];
  }

  if (params.eggless === "true") {
    where.isEgglessAvailable = true;
  }

  if (params.tag) {
    const rawTag = params.tag.toLowerCase();
    const tagVariants = [rawTag, params.tag];
    if (rawTag.endsWith("s")) tagVariants.push(rawTag.slice(0, -1));
    else tagVariants.push(rawTag + "s");

    if (rawTag === "tulips" || rawTag === "tulip") tagVariants.push("Roses", "Carnations", "Carnation");
    if (rawTag === "sunflowers" || rawTag === "sunflower") tagVariants.push("Gerbera", "Gerberas", "Carnation");
    if (rawTag === "lilies") tagVariants.push("Lilies", "Orchids", "Orchid");

    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          ...tagVariants.map((t) => ({ tags: { has: t } })),
          ...tagVariants.map((t) => ({ title: { contains: t, mode: "insensitive" as const } })),
        ],
      },
    ];
  }

  if (params.delivery === "midnight") {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          { tags: { has: "midnight" } },
          { tags: { has: "Midnight Delivery" } },
          { productType: { in: ["CAKES", "COMBOS", "FLOWERS"] } },
        ],
      },
    ];
  }

  const priceFilter: { gte?: number; lte?: number } = {};
  if (params.maxPrice) {
    const max = Number(params.maxPrice);
    if (!Number.isNaN(max)) priceFilter.lte = max;
  }
  if (params.minPrice) {
    const min = Number(params.minPrice);
    if (!Number.isNaN(min)) priceFilter.gte = min;
  }
  if (Object.keys(priceFilter).length > 0) {
    where.basePrice = priceFilter;
  }

  return where;
}

export function catalogOrderBy(sort?: string): Prisma.ProductOrderByWithRelationInput {
  if (sort === "price-asc") return { basePrice: "asc" };
  if (sort === "price-desc") return { basePrice: "desc" };
  if (sort === "title-asc") return { title: "asc" };
  return { createdAt: "desc" };
}
