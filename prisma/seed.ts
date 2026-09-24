import { PrismaClient, ProductType, SlotType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Cleaning up previous records...");
  await prisma.orderEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productOccasion.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendorServiceArea.deleteMany();
  await prisma.deliverySlot.deleteMany();
  await prisma.addon.deleteMany();
  await prisma.category.deleteMany();
  await prisma.occasion.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.aIRecommendation.deleteMany();
  await prisma.customerAddress.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.vendor.deleteMany();

  console.log("🚚 Creating Delivery Slots...");
  const slots = await Promise.all([
    prisma.deliverySlot.create({
      data: {
        title: "Early Morning (6:30 AM - 9:00 AM)",
        slotType: SlotType.STANDARD,
        startTime: "06:30",
        endTime: "09:00",
        surcharge: 150,
        cutoffMinutesBefore: 180,
        sortOrder: 1,
      },
    }),
    prisma.deliverySlot.create({
      data: {
        title: "Standard Morning (9:00 AM - 1:00 PM)",
        slotType: SlotType.STANDARD,
        startTime: "09:00",
        endTime: "13:00",
        surcharge: 0,
        cutoffMinutesBefore: 120,
        sortOrder: 2,
      },
    }),
    prisma.deliverySlot.create({
      data: {
        title: "Standard Afternoon (1:00 PM - 5:00 PM)",
        slotType: SlotType.STANDARD,
        startTime: "13:00",
        endTime: "17:00",
        surcharge: 0,
        cutoffMinutesBefore: 120,
        sortOrder: 3,
      },
    }),
    prisma.deliverySlot.create({
      data: {
        title: "Standard Evening (5:00 PM - 9:00 PM)",
        slotType: SlotType.STANDARD,
        startTime: "17:00",
        endTime: "21:00",
        surcharge: 0,
        cutoffMinutesBefore: 120,
        sortOrder: 4,
      },
    }),
    prisma.deliverySlot.create({
      data: {
        title: "Fixed Time (Within 1 Hour)",
        slotType: SlotType.FIXED_TIME,
        startTime: "10:00",
        endTime: "20:00",
        surcharge: 100,
        cutoffMinutesBefore: 90,
        sortOrder: 5,
      },
    }),
    prisma.deliverySlot.create({
      data: {
        title: "Midnight Surprise (11:00 PM - 11:59 PM)",
        slotType: SlotType.MIDNIGHT,
        startTime: "23:00",
        endTime: "23:59",
        surcharge: 250,
        cutoffMinutesBefore: 150,
        sortOrder: 6,
      },
    }),
  ]);

  console.log("🏷️ Creating Categories...");
  const catFlowers = await prisma.category.create({
    data: {
      name: "Fresh Flowers",
      slug: "flowers",
      description: "Artisan hand-tied bouquets, exotic orchids, and fresh red roses.",
      image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80",
      sortOrder: 1,
    },
  });

  const catCakes = await prisma.category.create({
    data: {
      name: "Gourmet Cakes",
      slug: "cakes",
      description: "Freshly baked celebration cakes, Belgian truffles, and artisan cheesecakes.",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
      sortOrder: 2,
    },
  });

  const catCombos = await prisma.category.create({
    data: {
      name: "Combos & Hampers",
      slug: "combos",
      description: "Thoughtfully paired flower bouquets, cakes, and celebration gifts.",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      sortOrder: 3,
    },
  });

  const catGifts = await prisma.category.create({
    data: {
      name: "Personalized Gifts",
      slug: "gifts",
      description: "Custom engraved frames, keepsakes, and celebration items.",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
      sortOrder: 4,
    },
  });

  console.log("🎉 Creating Occasions...");
  const occBirthday = await prisma.occasion.create({
    data: {
      name: "Birthday",
      slug: "birthday",
      description: "Make birthdays unforgettable with joyous blooms and decadent cakes.",
      bannerImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 1,
    },
  });

  const occAnniversary = await prisma.occasion.create({
    data: {
      name: "Anniversary",
      slug: "anniversary",
      description: "Celebrate milestones of love with romantic roses and midnight surprises.",
      bannerImage: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 2,
    },
  });

  const occLove = await prisma.occasion.create({
    data: {
      name: "Love & Romance",
      slug: "love-and-romance",
      description: "Speak the language of love with scarlet roses and velvet heart cakes.",
      bannerImage: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 3,
    },
  });

  const occCongrats = await prisma.occasion.create({
    data: {
      name: "Congratulations",
      slug: "congratulations",
      description: "Brighten their achievements with celebratory floral arrangements.",
      bannerImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 4,
    },
  });

  console.log("🏪 Creating Vendors...");
  const vendorFlorist = await prisma.vendor.create({
    data: {
      name: "Petals & Bloom Florals",
      slug: "petals-and-bloom",
      email: "orders@petalsbloom.in",
      phone: "+919876543210",
      city: "Bengaluru",
      state: "Karnataka",
      address: "14/2 Indiranagar 100ft Road",
      isApproved: true,
      isActive: true,
      commissionRate: 15.0,
      prepTimeMinutes: 45,
    },
  });

  const vendorBakery = await prisma.vendor.create({
    data: {
      name: "The Velvet Cake Studio",
      slug: "the-velvet-cake-studio",
      email: "chef@velvetcakes.in",
      phone: "+919876543211",
      city: "Bengaluru",
      state: "Karnataka",
      address: "88 Koramangala 4th Block",
      isApproved: true,
      isActive: true,
      commissionRate: 18.0,
      prepTimeMinutes: 90,
    },
  });

  console.log("📍 Creating Service Areas...");
  const bengaluruPincodes = [
    "560001", // MG Road / Central
    "560038", // Indiranagar
    "560034", // Koramangala
    "560068", // Madiwala / HSR
    "560100", // Electronic City
    "560066", // Whitefield
  ];

  for (const pin of bengaluruPincodes) {
    await prisma.vendorServiceArea.create({
      data: {
        vendorId: vendorFlorist.id,
        pincode: pin,
        city: "Bengaluru",
        minOrderValue: 299,
        deliveryFee: 0, // Free standard delivery
        isSameDaySupported: true,
        isMidnightSupported: true,
        isFixedTimeSupported: true,
      },
    });

    await prisma.vendorServiceArea.create({
      data: {
        vendorId: vendorBakery.id,
        pincode: pin,
        city: "Bengaluru",
        minOrderValue: 499,
        deliveryFee: 0,
        isSameDaySupported: true,
        isMidnightSupported: true,
        isFixedTimeSupported: true,
      },
    });
  }

  console.log("🌹 Creating Products...");

  // 1. Red Roses Bouquet
  const pRoses = await prisma.product.create({
    data: {
      vendorId: vendorFlorist.id,
      title: "Scarlet Passion — 12 Dutch Red Roses Bouquet",
      slug: "scarlet-passion-12-dutch-red-roses",
      description: "Hand-picked premium long-stem Dutch red roses wrapped in matte black luxury paper with silk ribbon. Freshly harvested for maximum vase life.",
      productType: ProductType.FLOWERS,
      categoryId: catFlowers.id,
      basePrice: 699,
      compareAtPrice: 899,
      images: [
        "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
      ],
      isAvailable: true,
      isApproved: true,
      isEgglessAvailable: false,
      isCustomMessageSupported: true,
      prepTimeMinutes: 30,
      tags: ["Roses", "Romantic", "Bestseller", "Same-day"],
      metaTitle: "Scarlet Passion Red Roses Bouquet Delivery in Bengaluru",
      metaDescription: "Order 12 fresh Dutch red roses bouquet with same-day and midnight delivery in Bengaluru.",
      variants: {
        create: [
          { name: "12 Roses (Standard)", price: 699, compareAtPrice: 899, isDefault: true, stock: 50 },
          { name: "24 Roses (Deluxe)", price: 1299, compareAtPrice: 1599, isDefault: false, stock: 30 },
          { name: "50 Roses (Grand Luxury)", price: 2499, compareAtPrice: 2999, isDefault: false, stock: 15 },
        ],
      },
      occasions: {
        create: [
          { occasionId: occBirthday.id },
          { occasionId: occAnniversary.id },
          { occasionId: occLove.id },
        ],
      },
    },
  });

  // 2. Asiatic Pink Lilies & Carnations
  const pLilies = await prisma.product.create({
    data: {
      vendorId: vendorFlorist.id,
      title: "Blushing Grace — Pink Oriental Lilies & Carnations",
      slug: "blushing-grace-pink-lilies-carnations",
      description: "Fragrant oriental pink lilies accented with pastel carnations and lush eucalyptus greens. A magnificent centerpiece of elegance.",
      productType: ProductType.FLOWERS,
      categoryId: catFlowers.id,
      basePrice: 1199,
      compareAtPrice: 1499,
      images: [
        "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80",
      ],
      isAvailable: true,
      isApproved: true,
      isCustomMessageSupported: true,
      prepTimeMinutes: 45,
      tags: ["Lilies", "Pastel", "Celebration"],
      variants: {
        create: [
          { name: "Standard (6 Stems)", price: 1199, compareAtPrice: 1499, isDefault: true, stock: 25 },
          { name: "Luxury (10 Stems)", price: 1799, compareAtPrice: 2199, isDefault: false, stock: 15 },
        ],
      },
      occasions: {
        create: [
          { occasionId: occBirthday.id },
          { occasionId: occCongrats.id },
        ],
      },
    },
  });

  // 3. Belgian Chocolate Truffle Cake
  const pCakeTruffle = await prisma.product.create({
    data: {
      vendorId: vendorBakery.id,
      title: "Decadent Belgian Dark Chocolate Truffle Cake",
      slug: "belgian-dark-chocolate-truffle-cake",
      description: "Layers of moist Dutch cocoa sponge filled with silky 54% dark Belgian chocolate ganache, draped in mirror glaze. Pure indulgence.",
      productType: ProductType.CAKES,
      categoryId: catCakes.id,
      basePrice: 649,
      compareAtPrice: 799,
      images: [
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80",
      ],
      isAvailable: true,
      isApproved: true,
      isEgglessAvailable: true,
      isCustomMessageSupported: true,
      isPhotoCake: false,
      prepTimeMinutes: 90,
      tags: ["Chocolate", "Eggless Option", "Bestseller", "Birthday"],
      variants: {
        create: [
          { name: "0.5 kg (Regular)", price: 649, compareAtPrice: 799, isDefault: true, stock: 40 },
          { name: "1.0 kg (Celebration)", price: 1199, compareAtPrice: 1399, isDefault: false, stock: 30 },
          { name: "2.0 kg (Grand Feast)", price: 2199, compareAtPrice: 2599, isDefault: false, stock: 10 },
        ],
      },
      occasions: {
        create: [
          { occasionId: occBirthday.id },
          { occasionId: occAnniversary.id },
          { occasionId: occLove.id },
          { occasionId: occCongrats.id },
        ],
      },
    },
  });

  // 4. Classic Red Velvet Cake
  const pCakeRedVelvet = await prisma.product.create({
    data: {
      vendorId: vendorBakery.id,
      title: "Royal Red Velvet Cream Cheese Heart Cake",
      slug: "royal-red-velvet-cream-cheese-cake",
      description: "Crimson-tinted cocoa sponge frosted with authentic Philadelphia cream cheese frosting. Crafted in an artisan heart silhouette.",
      productType: ProductType.CAKES,
      categoryId: catCakes.id,
      basePrice: 749,
      compareAtPrice: 899,
      images: [
        "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80",
      ],
      isAvailable: true,
      isApproved: true,
      isEgglessAvailable: true,
      isCustomMessageSupported: true,
      prepTimeMinutes: 90,
      tags: ["Red Velvet", "Heart Shape", "Romance", "Eggless Option"],
      variants: {
        create: [
          { name: "0.5 kg", price: 749, compareAtPrice: 899, isDefault: true, stock: 25 },
          { name: "1.0 kg", price: 1399, compareAtPrice: 1599, isDefault: false, stock: 20 },
        ],
      },
      occasions: {
        create: [
          { occasionId: occAnniversary.id },
          { occasionId: occLove.id },
        ],
      },
    },
  });

  // 5. Flower + Cake Combo
  const pCombo = await prisma.product.create({
    data: {
      vendorId: vendorFlorist.id,
      title: "Midnight Symphony — 12 Red Roses & Chocolate Truffle Cake Combo",
      slug: "midnight-symphony-roses-truffle-combo",
      description: "The ultimate romantic gesture: a bouquet of 12 velvety red roses paired with a decadent 0.5kg Belgian Chocolate Truffle Cake. Prepared together and delivered in synchronized harmony.",
      productType: ProductType.COMBOS,
      categoryId: catCombos.id,
      basePrice: 1249,
      compareAtPrice: 1499,
      images: [
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      ],
      isAvailable: true,
      isApproved: true,
      isEgglessAvailable: true,
      isCustomMessageSupported: true,
      prepTimeMinutes: 90,
      tags: ["Combo", "Best Value", "Anniversary", "Midnight"],
      variants: {
        create: [
          { name: "12 Roses + 0.5kg Cake", price: 1249, compareAtPrice: 1499, isDefault: true, stock: 20 },
          { name: "24 Roses + 1.0kg Cake", price: 2299, compareAtPrice: 2799, isDefault: false, stock: 15 },
        ],
      },
      occasions: {
        create: [
          { occasionId: occBirthday.id },
          { occasionId: occAnniversary.id },
          { occasionId: occLove.id },
        ],
      },
    },
  });

  console.log("🎁 Creating Add-ons...");
  await Promise.all([
    prisma.addon.create({
      data: {
        title: "Musical Rotating Birthday Candle",
        category: "Candles",
        price: 99,
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80",
      },
    }),
    prisma.addon.create({
      data: {
        title: "Handwritten Golden Foil Greeting Card",
        category: "Cards",
        price: 149,
        image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80",
      },
    }),
    prisma.addon.create({
      data: {
        title: "Ferrero Rocher Hazelnut Chocolates (16 Pcs)",
        category: "Chocolates",
        price: 499,
        image: "https://images.unsplash.com/photo-1548741487-18d16a1a094c?auto=format&fit=crop&w=400&q=80",
      },
    }),
    prisma.addon.create({
      data: {
        title: "Cuddly White Teddy Bear (6 inch)",
        category: "Soft Toys",
        price: 299,
        image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80",
      },
    }),
  ]);

  console.log("👤 Creating Admin & Vendor Users...");
  console.log("👤 Creating Admin, Vendor, and Customer Users...");
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const vendorPassword = await bcrypt.hash("Vendor@123", 10);
  const customerPassword = await bcrypt.hash("Customer@123", 10);

  await prisma.user.create({
    data: {
      email: "admin@bloomandbakes.com",
      name: "Super Admin",
      password: adminPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      email: "vendor@petalsbloom.in",
      name: "Ramesh Florist",
      password: vendorPassword,
      role: Role.VENDOR_OWNER,
      vendorId: vendorFlorist.id,
    },
  });

  await prisma.user.create({
    data: {
      email: "customer@example.com",
      name: "Aakash Sharma",
      password: customerPassword,
      phone: "+91 9876543210",
      role: Role.CUSTOMER,
    },
  });

  console.log("⭐ Adding Initial Reviews...");
  await prisma.review.create({
    data: {
      productId: pRoses.id,
      customerName: "Priya S.",
      rating: 5,
      comment: "Arrived right at 11:58 PM for midnight surprise! The roses were fresh with morning dew, absolutely breathtaking presentation.",
    },
  });

  await prisma.review.create({
    data: {
      productId: pCakeTruffle.id,
      customerName: "Arjun K.",
      rating: 5,
      comment: "Best truffle cake in Bangalore! Not overly sweet, rich chocolate flavor. The eggless texture was surprisingly fluffy.",
    },
  });

  console.log("🎟️ Creating Initial Coupons...");
  await prisma.coupon.createMany({
    data: [
      {
        code: "FIRSTBLOOM",
        description: "15% off your first celebration order",
        discountType: "PERCENTAGE",
        discountValue: 15,
        minOrderValue: 499,
        maxDiscount: 250,
        isActive: true,
      },
      {
        code: "MIDNIGHT50",
        description: "Flat ₹50 off on midnight deliveries",
        discountType: "FLAT",
        discountValue: 50,
        minOrderValue: 699,
        isActive: true,
      },
      {
        code: "FESTIVE200",
        description: "Flat ₹200 off on luxury bouquets & cake hampers",
        discountType: "FLAT",
        discountValue: 200,
        minOrderValue: 1499,
        isActive: true,
      },
    ],
  });

  console.log("🧠 Creating Initial AI Recommendations...");
  await prisma.aIRecommendation.createMany({
    data: [
      {
        category: "SEO",
        title: "Dynamic Landing Pages for 'Flowers & Cakes Delivery Whitefield'",
        description: "Identified high organic search intent for Whitefield (560066). Proposes generating a targeted localized landing page with relevant local vendor inventory.",
        impactScore: 92,
        status: "PROPOSED",
        payload: {
          targetCity: "Bengaluru",
          targetPincode: "560066",
          proposedSlug: "/flowers-cakes-delivery-whitefield",
          estimatedMonthlyClicks: 1450,
        },
      },
      {
        category: "CATALOG",
        title: "Occasion Bundle: Valentine & Rose Day Pre-Orders",
        description: "Historical demand peaks require pre-packaging 20 Dutch Roses with Red Velvet Heart Cake. Auto-generated SKU concept ready for review.",
        impactScore: 88,
        status: "APPROVED",
        payload: {
          comboTitle: "Scarlet Romance Luxury Pairing",
          suggestedPrice: 1599,
          margin: 32,
        },
      },
      {
        category: "PRICING",
        title: "Midnight Slot Dynamic Surcharge Adjustment",
        description: "Demand between 11 PM - 12 AM is running at 94% rider capacity. Suggesting surge pricing increase of ₹50 to balance driver incentives.",
        impactScore: 78,
        status: "PROPOSED",
        payload: {
          currentSurcharge: 250,
          proposedSurcharge: 300,
          driverIncentiveShare: 80,
        },
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
