import { prisma } from "./prisma";

export interface SeoPageSeedItem {
  slug: string;
  title: string;
  heading: string;
  subheading: string;
  metaTitle: string;
  metaDescription: string;
  city: string;
  categorySlug: string;
  occasionSlug?: string;
  flavorOrType?: string;
  badgeText: string;
  heroImage?: string;
  introHtml: string;
  contentBody: string;
  deliveryAreas: string[];
  faqs: { q: string; a: string }[];
  popularKeywords: string[];
}

const DEFAULT_AREAS = [
  "Paltan Bazaar", "G S Road", "Zoo Road", "Six Mile", "Ganeshguri",
  "Ulubari", "Beltola", "Dispur", "Christian Basti", "Rukminigaon",
  "Hatigaon", "Bhangagarh", "Chandmari", "Silpukhuri", "Maligaon",
  "Jalukbari", "Basistha", "Lokhra", "Narengi", "Noonmati",
  "Pan Bazaar", "Fancy Bazaar", "Kahilipara", "Lalganesh"
];

export const SEO_PAGES_SEED_DATA: SeoPageSeedItem[] = [
  {
    slug: "anniversary-cake-delivery-in-guwahati",
    title: "Anniversary Cake Delivery in Guwahati",
    heading: "Handcrafted Anniversary Cakes Delivered Across Guwahati",
    subheading: "Celebrate your love story with handcrafted heart-shaped red velvets, decadent Belgian truffles, and romantic tiered cakes delivered fresh same-day & at midnight.",
    metaTitle: "Anniversary Cake Delivery in Guwahati | Same-Day & Midnight Surprise",
    metaDescription: "Order romantic anniversary cakes online in Guwahati. Fresh red velvet, Belgian chocolate, heart shapes & photo cakes delivered across GS Road, Zoo Road, Beltola & Dispur.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "anniversary",
    badgeText: "Midnight & Same-Day Delivery across Guwahati",
    introHtml: "Mark another year of togetherness with a breathtaking anniversary cake baked freshly in Guwahati. From delicate two-tier floral cakes to rich chocolate truffle hearts, our master bakers use pure ingredients and exquisite styling.",
    contentBody: "Whether it is your 1st anniversary or your silver jubilee celebration, our curated collection of anniversary cakes in Guwahati is designed to make your milestone unforgettable. We deliver right to your doorstep across 40+ Guwahati neighborhoods with exact time slot booking.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can I get midnight anniversary cake delivery in Guwahati?", a: "Yes, our midnight slot delivers between 11:00 PM and 11:59 PM to surprise your spouse right as the clock strikes twelve." },
      { q: "Can I add a personalized anniversary message or custom topper?", a: "Yes, custom messages on cakes and complimentary greeting cards can be specified during checkout." },
      { q: "Are eggless anniversary cakes available in Guwahati?", a: "All our cakes can be prepared 100% vegetarian (eggless) without compromising on fluffiness or flavor." }
    ],
    popularKeywords: ["anniversary cake guwahati", "romantic heart cake", "red velvet anniversary", "midnight cake delivery guwahati"]
  },
  {
    slug: "anniversary-photo-cakes-in-guwahati",
    title: "Anniversary Photo Cakes in Guwahati",
    heading: "Edible Photo Print Anniversary Cakes in Guwahati",
    subheading: "Relive your favorite romantic memories with edible, food-grade high-resolution photo cakes baked fresh in Guwahati.",
    metaTitle: "Anniversary Photo Cakes in Guwahati | Edible Sugar Sheet Cakes",
    metaDescription: "Personalize your anniversary with custom edible photo cakes in Guwahati. High-res sugar prints on rich truffle, black forest & red velvet sponges.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "anniversary",
    flavorOrType: "photo",
    badgeText: "100% Edible Sugar Sheet Prints",
    introHtml: "Transform your most cherished wedding or couple portrait into a stunning, delicious cake centerpiece. Our certified bakers use 100% edible food-grade ink on delicate sugar sheets.",
    contentBody: "Photo cakes provide the ultimate sentimental touch. Upload any couple photograph or wedding portrait, select your favorite flavor from Dutch Chocolate to Fresh Fruit, and our Guwahati bakery will deliver a masterpiece.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Is the photo print completely edible?", a: "Yes, our prints use edible vegetable colors on European food-grade sugar sheets that melt pleasantly in your mouth." },
      { q: "How much advance notice is required for photo cakes in Guwahati?", a: "We require just 3-4 hours notice for same-day delivery, though ordering by morning is recommended for best resolution review." }
    ],
    popularKeywords: ["photo cake guwahati", "edible picture cake", "custom couple photo cake"]
  },
  {
    slug: "birthday-cake-delivery-in-guwahati",
    title: "Birthday Cake Delivery in Guwahati",
    heading: "Delicious Birthday Cakes Delivered Across Guwahati",
    subheading: "Make every birthday extraordinary with freshly baked gourmet cakes, designer themes, and midnight doorstep surprises across Guwahati.",
    metaTitle: "Birthday Cake Delivery in Guwahati | Fresh Same-Day & Midnight",
    metaDescription: "Send birthday cakes to Guwahati online. 100+ gourmet flavors including Dutch Truffle, Pineapple, Red Velvet & Bento cakes delivered same day.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "birthday",
    badgeText: "Guwahati's #1 Birthday Bakery",
    introHtml: "A birthday celebration in Guwahati is incomplete without the perfect cake. Choose from over 50+ exquisite designs, from whimsical cartoon cakes for kids to decadent artisanal cakes for adults.",
    contentBody: "Our Guwahati bakeries prepare every cake from scratch only after your order is confirmed, ensuring maximum moisture, airy sponge texture, and rich frostings.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "How fast can you deliver a birthday cake in Guwahati?", a: "We offer express 2-hour delivery across central Guwahati and same-day delivery across all 40+ localities." },
      { q: "Can I send birthday cakes to someone in Guwahati while living outside Assam?", a: "Yes, thousands of NRIs and outstation family members order smoothly through UPI and international cards." }
    ],
    popularKeywords: ["birthday cake delivery guwahati", "best cake shop guwahati", "online birthday cake"]
  },
  {
    slug: "birthday-cakes-for-girls",
    title: "Birthday Cakes for Girls",
    heading: "Charming & Enchanting Birthday Cakes for Girls in Guwahati",
    subheading: "Delightful pink pastel themes, princess castles, Barbie gowns, and floral butterfly cakes crafted with utmost care.",
    metaTitle: "Birthday Cakes for Girls in Guwahati | Princess, Barbie & Pastel Cakes",
    metaDescription: "Order enchanting birthday cakes for girls in Guwahati. Princess themes, butterfly pastels, unicorn cakes & strawberry bakes delivered same-day.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "birthday",
    badgeText: "Princess & Pastel Themes",
    introHtml: "From magical unicorn themes to elegant pastel aesthetic cakes, our birthday cakes for girls bring smiles and wonder to every birthday party.",
    contentBody: "Featuring soft pink ombre buttercreams, edible pearls, handmade fondant tiaras, and vibrant berry compotes, these cakes make every young girl feel like royalty.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can I customize the color scheme and theme?", a: "Yes, you can request custom colors, age toppers, and themes like Frozen, Barbie, or Floral." }
    ],
    popularKeywords: ["birthday cake for girls guwahati", "princess cake", "barbie cake guwahati"]
  },
  {
    slug: "birthday-chocolate-cakes-in-guwahati",
    title: "Birthday Chocolate Cakes in Guwahati",
    heading: "Decadent Birthday Chocolate Cakes in Guwahati",
    subheading: "Rich Belgian chocolate ganache, moist devil's food sponge, and crunchy hazelnut praline bakes for genuine chocoholics.",
    metaTitle: "Birthday Chocolate Cakes in Guwahati | Belgian Truffle & Ganache",
    metaDescription: "Indulge in rich birthday chocolate cakes in Guwahati. Dutch dark chocolate, KitKat overload, Nutella & Ferrero Rocher cakes delivered fresh.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "birthday",
    flavorOrType: "chocolate",
    badgeText: "Pure Cocoa & Belgian Truffle",
    introHtml: "Nothing satisfies a sweet tooth quite like deep, velvety chocolate. Our Guwahati ovens bake classic Dutch truffles, triple chocolate mousse, and molten fudge bakes daily.",
    contentBody: "Layered with silky cocoa ganache and topped with handcrafted chocolate curls, these cakes are the undeniable crowd-pleaser for birthdays across Assam.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Which chocolate cake flavor is the most popular in Guwahati?", a: "Our Dutch Chocolate Truffle and Ferrero Rocher Overload are top customer favorites." }
    ],
    popularKeywords: ["chocolate cake guwahati", "truffle birthday cake", "belgian chocolate cake"]
  },
  {
    slug: "send-flowers-in-guwahati",
    title: "Send Flowers in Guwahati",
    heading: "Send Fresh Hand-Tied Flowers Across Guwahati",
    subheading: "Express bouquets of Dutch roses, exotic oriental lilies, vibrant carnations, and purple orchids delivered with love.",
    metaTitle: "Send Flowers in Guwahati | Fresh Bouquets Same-Day Delivery",
    metaDescription: "Send fresh flower bouquets online in Guwahati. Red roses, orchids, lilies & carnations hand-tied by expert florists. 2-hr express delivery.",
    city: "Guwahati",
    categorySlug: "flowers",
    badgeText: "Farm-Fresh Stems Guaranteed",
    introHtml: "Flowers speak the language of the heart. Whether celebrating romance, expressing gratitude, or sending warm wishes, our farm-fresh blossoms arrive vibrant and fragrant.",
    contentBody: "Sourced directly from certified growers and arranged by skilled local Guwahati florists in luxury craft wraps and glass vases.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Are the flowers delivered fresh in Guwahati?", a: "Yes, every bouquet is arranged fresh within 60 minutes of dispatch so stems retain full bloom longevity." },
      { q: "Can I combine flowers with a cake or chocolates?", a: "Yes, check our Combos category to pair premium roses with fresh artisanal cakes." }
    ],
    popularKeywords: ["send flowers guwahati", "flower bouquet guwahati", "fresh roses guwahati"]
  },
  {
    slug: "caramel-cakes",
    title: "Caramel Cakes",
    heading: "Golden Salted Caramel & Butterscotch Cakes in Guwahati",
    subheading: "Velvety caramel drip, toasted pecans, and creamy butterscotch layers baked for irresistible indulgence.",
    metaTitle: "Caramel Cakes in Guwahati | Salted Caramel & Butterscotch Drip",
    metaDescription: "Taste artisanal caramel cakes in Guwahati. Sea salt caramel drips, crunchy butterscotch crumbles & caramelized sponge delivered fresh.",
    city: "Guwahati",
    categorySlug: "cakes",
    flavorOrType: "caramel",
    badgeText: "Artisanal Caramel Drip",
    introHtml: "Indulge in sweet, smoky, and buttery decadence. Our caramel cakes feature house-made golden caramel glaze over soft vanilla and toffee sponge.",
    contentBody: "A sophisticated alternative to traditional chocolate, loved by discerning dessert enthusiasts across Guwahati for dinner parties and birthdays.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Is the caramel made in-house?", a: "Yes, our confectionery slow-cooks pure dairy cream, butter, and caramelized sugar for rich authentic flavor." }
    ],
    popularKeywords: ["caramel cake", "salted caramel cake guwahati", "butterscotch cake"]
  },
  {
    slug: "cartoon-cake-delivery-in-guwahati",
    title: "Cartoon Cake Delivery in Guwahati",
    heading: "Fun & Colorful Cartoon Theme Cakes for Kids in Guwahati",
    subheading: "Bring their favorite characters to life with 3D fondant figurines and bright custom frostings.",
    metaTitle: "Cartoon Cake Delivery in Guwahati | Doraemon, Peppa Pig & Superhero",
    metaDescription: "Order cartoon cakes in Guwahati for kids' birthdays. Doraemon, Spiderman, Chhota Bheem & Peppa Pig designs with fast doorstep delivery.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "birthday",
    flavorOrType: "cartoon",
    badgeText: "Kid-Approved Animated Themes",
    introHtml: "Watch your child's eyes light up with an animated cartoon cake modeled after their favorite hero, superhero, or playful animal.",
    contentBody: "Handcrafted using safe, kid-friendly food colors and moist sponge cakes in mild chocolate or strawberry cream flavors.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can you create custom cartoon themes not listed online?", a: "Yes, contact our WhatsApp support to share reference images for custom 3D character cakes." }
    ],
    popularKeywords: ["cartoon cake guwahati", "kids birthday cake", "superhero cake guwahati"]
  },
  {
    slug: "chocolate-anniversary-cakes-in-guwahati",
    title: "Chocolate Anniversary Cakes in Guwahati",
    heading: "Romantic Chocolate Anniversary Cakes in Guwahati",
    subheading: "Deep cocoa passion sculpted into romantic heart motifs, golden edible leaf accents, and satin ganache finishes.",
    metaTitle: "Chocolate Anniversary Cakes in Guwahati | Romantic Truffle Hearts",
    metaDescription: "Order romantic chocolate anniversary cakes online in Guwahati. Heart-shaped dark truffle, Ferrero Rocher & custom anniversary messaging.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "anniversary",
    flavorOrType: "chocolate",
    badgeText: "Romantic Dark Chocolate",
    introHtml: "Nothing expresses romantic passion like rich, velvety dark chocolate. Celebrate your wedding anniversary with our signature truffle bakes.",
    contentBody: "Decorated with delicate chocolate rose petals, golden dust, and heart silhouettes to set the mood for an intimate evening in Guwahati.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can I add 'Happy Anniversary [Names]' in chocolate writing?", a: "Yes, our pastry chefs hand-pipe your custom names and anniversary year on top." }
    ],
    popularKeywords: ["chocolate anniversary cake", "heart shaped chocolate cake guwahati"]
  },
  {
    slug: "chocolate-cake-delivery-in-guwahati",
    title: "Chocolate Cake Delivery in Guwahati",
    heading: "Fresh Chocolate Cake Delivery Across Guwahati",
    subheading: "Order mouthwatering chocolate cakes delivered in as fast as 2 hours anywhere in Guwahati.",
    metaTitle: "Chocolate Cake Delivery in Guwahati | 2-Hour Express Delivery",
    metaDescription: "Fresh chocolate cake delivery in Guwahati. German Black Forest, Dutch Truffle & Death by Chocolate cakes delivered right on time.",
    city: "Guwahati",
    categorySlug: "cakes",
    flavorOrType: "chocolate",
    badgeText: "2-Hour Express Delivery",
    introHtml: "Need an immediate chocolate fix or planning a grand celebration? Our Guwahati network guarantees rapid delivery of freshly baked chocolate cakes.",
    contentBody: "From classic Black Forest with tart cherry compote to triple-layer chocolate mud cakes, we bring bakery-fresh goodness to your doorstep.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Do you deliver to suburbs like Jalukbari and Khanapara?", a: "Yes, we cover all corners of Guwahati from Jalukbari in the west to Khanapara and Narengi in the east." }
    ],
    popularKeywords: ["chocolate cake delivery", "best chocolate cake in guwahati"]
  },
  {
    slug: "chocolate-overload-cakes-in-guwahati",
    title: "Chocolate Overload Cakes in Guwahati",
    heading: "Extreme Chocolate Overload Cakes in Guwahati",
    subheading: "Loaded with KitKat bars, Oreos, Ferrero Rocher truffles, chocolate wafers, and rich fudge drippings.",
    metaTitle: "Chocolate Overload Cakes in Guwahati | Loaded KitKat & Oreo Cakes",
    metaDescription: "Get the ultimate chocolate overload cake in Guwahati. Piled high with KitKat, Oreo cookies, Ferrero Rocher & chocolate fudge ganache.",
    city: "Guwahati",
    categorySlug: "cakes",
    flavorOrType: "chocolate",
    badgeText: "Maximum Chocolate Indulgence",
    introHtml: "Why choose one chocolate when you can have them all? Our Overload series is an architectural marvel of premium confectionery toppings.",
    contentBody: "Surrounded by KitKat fences or crowned with mounds of Oreos and brownies, this is the ultimate party cake for chocolate enthusiasts.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Are the toppings fresh and crisp upon delivery?", a: "Yes, confections are added immediately before dispatch in temperature-controlled transport to prevent melting." }
    ],
    popularKeywords: ["chocolate overload cake", "kitkat cake guwahati", "loaded chocolate cake"]
  },
  {
    slug: "order-bouquets-online-in-guwahati",
    title: "Order Bouquets Online in Guwahati",
    heading: "Order Hand-Crafted Floral Bouquets Online in Guwahati",
    subheading: "Artisanal floral designs wrapped in eco-friendly matte paper with satin ribbons for every joyous milestone.",
    metaTitle: "Order Bouquets Online in Guwahati | Hand-Tied Luxury Flowers",
    metaDescription: "Buy flower bouquets online in Guwahati. Exotic red roses, white lilies & colorful gerberas in luxury wrapping. Same-day delivery guaranteed.",
    city: "Guwahati",
    categorySlug: "flowers",
    badgeText: "Handcrafted Luxury Bouquets",
    introHtml: "Ordering fresh flower bouquets in Guwahati is now effortless. Choose your curated floral aesthetic and let our florist craft your sentiment.",
    contentBody: "We hand-select blooms each morning to guarantee that stems open gracefully and maintain vibrant color for days.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Do bouquets come with flower food?", a: "Yes, all bouquets include care instructions and flower food sachets to prolong vase life." }
    ],
    popularKeywords: ["order bouquets guwahati", "flower bouquet online", "rose bouquet delivery"]
  },
  {
    slug: "custom-heart-cakes-in-guwahati",
    title: "Custom Heart Cakes in Guwahati",
    heading: "Custom Heart-Shaped Cakes in Guwahati",
    subheading: "Express your deepest emotions with vintage piped heart cakes, Lambeth ruffles, and red velvet confections.",
    metaTitle: "Custom Heart Cakes in Guwahati | Vintage Lambeth & Red Velvet",
    metaDescription: "Order trendy custom heart cakes in Guwahati. Vintage Lambeth aesthetic piping, personalized messages & heart shapes for birthdays & anniversaries.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "love-and-romance",
    badgeText: "Trending Vintage Lambeth Style",
    introHtml: "Vintage heart cakes with intricate borders, bow motifs, and custom typography are taking Guwahati by storm. Handcrafted for anniversaries, proposals, and romantic surprises.",
    contentBody: "Baked in velvet sponges with creamy mascarpone or silky vanilla buttercream, each heart cake is a photogenic work of culinary art.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can I choose the piped text on top?", a: "Yes, provide custom wording like 'Always Yours', 'In My Lover Era', or personalized initials." }
    ],
    popularKeywords: ["custom heart cake guwahati", "vintage heart cake", "romantic heart cake"]
  },
  {
    slug: "customized-designer-cakes",
    title: "Customized Designer Cakes",
    heading: "Bespoke Customized Designer Cakes in Guwahati",
    subheading: "Custom wedding cakes, tier masterpieces, architectural designs, and corporate celebration bakes tailored to your vision.",
    metaTitle: "Customized Designer Cakes in Guwahati | Fondant & Tier Cakes",
    metaDescription: "Get customized designer cakes in Guwahati. Tiered wedding cakes, corporate themes & bespoke fondant sculpting by master bakers.",
    city: "Guwahati",
    categorySlug: "cakes",
    badgeText: "Bespoke Custom Sculpting",
    introHtml: "Have a unique idea or theme in mind? Our designer cake studio in Guwahati transforms your concept into an edible centerpiece.",
    contentBody: "From multi-tiered floral wedding cakes to sculpted brand logos, our master pâtissiers execute every subtle detail with exacting finesse.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "How do I request a custom cake quotation?", a: "Contact our admin/concierge team on WhatsApp with reference sketches or photos for custom estimates." }
    ],
    popularKeywords: ["designer cakes guwahati", "custom cakes assam", "tiered wedding cake guwahati"]
  },
  {
    slug: "custom-celebration-cakes",
    title: "Custom Celebration Cakes",
    heading: "Celebration Cakes for Every Festive Milestone in Guwahati",
    subheading: "Graduations, promotions, baby showers, housewarmings, and festive reunions celebrated with artisanal sweetness.",
    metaTitle: "Custom Celebration Cakes in Guwahati | Baby Shower, Milestones",
    metaDescription: "Order custom celebration cakes in Guwahati for graduations, baby showers, housewarmings & promotions. Fresh doorstep delivery.",
    city: "Guwahati",
    categorySlug: "cakes",
    badgeText: "Festive Occasions & Milestones",
    introHtml: "Life in Guwahati is filled with joyous milestones worth celebrating. Our celebration cakes combine joyful artistry with irresistible taste.",
    contentBody: "Customizable with custom message banners, festive emblems, and vibrant colors that make your event photos stand out.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can I order celebration cakes in large weights like 3kg or 5kg?", a: "Yes, we support party sizes from 1kg up to 10kg with prior booking." }
    ],
    popularKeywords: ["celebration cakes guwahati", "party cakes", "baby shower cake guwahati"]
  },
  {
    slug: "customized-photo-cakes-in-guwahati",
    title: "Customized Photo Cakes in Guwahati",
    heading: "Personalized Customized Photo Cakes in Guwahati",
    subheading: "Print your family memories, friendship milestones, or corporate branding directly onto delicious fresh cakes.",
    metaTitle: "Customized Photo Cakes in Guwahati | HD Picture Print Cakes",
    metaDescription: "Create custom photo cakes in Guwahati. High-definition edible prints on fresh cakes with same-day express delivery across Guwahati.",
    city: "Guwahati",
    categorySlug: "cakes",
    flavorOrType: "photo",
    badgeText: "HD Edible Color Printing",
    introHtml: "Add a truly personal touch to your celebration with an HD edible print photo cake. Perfect for reunions, farewells, and birthday moments.",
    contentBody: "Simply provide your photo during order placement, and our imaging specialists will optimize colors for a vibrant finish on edible sugar fondant.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Will the photo colors look vibrant?", a: "Yes, we use high-grade edible printers and premium icing paper to preserve photographic detail." }
    ],
    popularKeywords: ["customized photo cake", "photo print cake guwahati"]
  },
  {
    slug: "designer-birthday-cakes-for-girls",
    title: "Designer Birthday Cakes for Girls",
    heading: "Designer Birthday Cakes for Girls in Guwahati",
    subheading: "Trendy mermaid themes, fairy wings, glitter crowns, and elegant floral tiers crafted for unforgettable birthday photos.",
    metaTitle: "Designer Birthday Cakes for Girls Guwahati | Custom Fairy & Floral",
    metaDescription: "Stunning designer birthday cakes for girls in Guwahati. Fairy tale themes, mermaid colors & pastel tiers baked fresh.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "birthday",
    badgeText: "Fairy Tale & Mermaid Aesthetics",
    introHtml: "Make her birthday magical with designer cakes inspired by fairy tales, shimmering oceans, and enchanting floral gardens.",
    contentBody: "Every tier is decorated with edible sugar flowers, delicate pastels, and premium fillings like raspberry cream and white chocolate mousse.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Are edible glitters used on these cakes safe?", a: "Yes, all sparkles and glitters used are 100% FDA-approved food-grade ingredients." }
    ],
    popularKeywords: ["designer birthday cakes girls", "fairy cake guwahati"]
  },
  {
    slug: "designer-birthday-cakes-in-guwahati",
    title: "Designer Birthday Cakes in Guwahati",
    heading: "Designer Birthday Cakes in Guwahati",
    subheading: "Elevate birthday celebrations with high-concept gourmet cakes styled with geometric minimalism, watercolor buttercreams, and gold foil.",
    metaTitle: "Designer Birthday Cakes in Guwahati | Modern Aesthetic Cakes",
    metaDescription: "Shop luxury designer birthday cakes in Guwahati. Modern aesthetics, textured buttercreams & gold leaf finishes for sophisticated parties.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "birthday",
    badgeText: "Haute Pâtisserie Styling",
    introHtml: "For those who appreciate modern culinary art, our designer birthday cakes bring international pâtisserie trends right here to Guwahati.",
    contentBody: "Featuring textured buttercream strokes, dried floral accents, macaron crowns, and 24K edible gold leaves for a memorable birthday center stage.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can I customize the cake design to match party decor?", a: "Yes, our designers can coordinate colors with your event theme or invitation palette." }
    ],
    popularKeywords: ["designer birthday cake guwahati", "modern cake design"]
  },
  {
    slug: "doraemon-cake-delivery-in-guwahati",
    title: "Doraemon Cake Delivery in Guwahati",
    heading: "Doraemon Theme Cakes Delivered Across Guwahati",
    subheading: "The robotic cat from the future brings sweetness and joy with blue vanilla frostings and edible gadgets.",
    metaTitle: "Doraemon Cake Delivery in Guwahati | Kids Animated Theme Cake",
    metaDescription: "Delight your kids with Doraemon birthday cakes in Guwahati. Blue vanilla & chocolate sponges with cute Doraemon face sculpting.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "birthday",
    flavorOrType: "cartoon",
    badgeText: "Kids' Favorite Robot Cat",
    introHtml: "Doraemon is universally adored by kids across Guwahati. Our Doraemon birthday cakes feature his trademark bell, pocket, and beaming smile.",
    contentBody: "Available in light sponge varieties with fresh fruit or creamy chocolate fudge that kids will eat with glee.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Is the blue frosting natural and safe?", a: "We use certified child-safe food coloring that washes off easily and tastes delightful." }
    ],
    popularKeywords: ["doraemon cake guwahati", "doraemon birthday cake"]
  },
  {
    slug: "edible-photo-print-cakes-in-assam",
    title: "Edible Photo Print Cakes in Assam",
    heading: "Premier Edible Photo Print Cakes Across Guwahati & Assam",
    subheading: "Statewide delivery of high-clarity photographic cakes baked fresh in Guwahati's modern kitchen.",
    metaTitle: "Edible Photo Print Cakes in Assam & Guwahati | Crisp Sugar Sheets",
    metaDescription: "Order edible photo print cakes in Guwahati & Assam. Highest clarity food prints, delicious sponge bases, and safe temperature-controlled shipping.",
    city: "Guwahati",
    categorySlug: "cakes",
    flavorOrType: "photo",
    badgeText: "High-Resolution Sugar Printing",
    introHtml: "Leading Assam in culinary photo-printing technology. Turn any high-resolution portrait or group snapshot into an edible celebration cake.",
    contentBody: "Baked with premium local Assam ingredients and delivered chilled in protective sturdy packaging to preserve the picture surface flawlessly.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "What format should the photo be?", a: "JPEG or PNG images taken on phones or cameras work wonderfully." }
    ],
    popularKeywords: ["photo cakes assam", "edible print cake guwahati"]
  },
  {
    slug: "elegant-birthday-cakes-in-guwahati",
    title: "Elegant Birthday Cakes in Guwahati",
    heading: "Elegant Birthday Cakes for Sophisticated Celebrations",
    subheading: "Refined minimalist silhouettes, neutral tones, dried botanical flourishes, and artisanal taste profiles.",
    metaTitle: "Elegant Birthday Cakes in Guwahati | Minimalist Luxury Cakes",
    metaDescription: "Order elegant birthday cakes in Guwahati. Understated luxury, floral toppers, Earl Grey & dark truffle flavors for adult birthdays.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "birthday",
    badgeText: "Understated Elegance",
    introHtml: "Not all birthdays call for loud colors. Our elegant collection embraces contemporary minimalism, organic textures, and sophisticated flavors.",
    contentBody: "Favored for milestone birthdays like 30th, 40th, 50th, and corporate celebrations where class and restraint make the strongest statement.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "What gourmet flavors are available for elegant cakes?", a: "Hazelnut praline, roasted pistachio rose, dark salted caramel, and Belgian chocolate truffle." }
    ],
    popularKeywords: ["elegant birthday cakes", "luxury birthday cakes guwahati"]
  },
  {
    slug: "fresh-flowers-guwahati",
    title: "Fresh Flowers Guwahati",
    heading: "Fresh Flowers in Guwahati – Farm Picked Every Morning",
    subheading: "Guwahati's most trusted online flower florist for radiant blossoms, exotic blooms, and prompt doorstep delivery.",
    metaTitle: "Fresh Flowers Guwahati | Same-Day Florist Delivery Guwahati",
    metaDescription: "Buy fresh flowers in Guwahati online. Handpicked roses, orchids, lilies & carnations. Same day 2-hour express delivery across Guwahati.",
    city: "Guwahati",
    categorySlug: "flowers",
    badgeText: "100% Fresh Morning Cut Stems",
    introHtml: "Discover the freshest flowers in Guwahati. From romantic red rose bunches to serene white lilies, our florists curate arrangements that uplift any room.",
    contentBody: "Packed with water sponges at the stems to guarantee botanical freshness throughout transit in Guwahati's tropical climate.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "How long will the fresh flowers last?", a: "With regular water replenishment, our fresh blooms thrive for 5 to 7 days." }
    ],
    popularKeywords: ["fresh flowers guwahati", "flower delivery in guwahati", "florist near me"]
  },
  {
    slug: "happy-birthday-cakes-in-guwahati",
    title: "Happy Birthday Cakes in Guwahati",
    heading: "Joyful Happy Birthday Cakes in Guwahati",
    subheading: "Celebrate another wonderful trip around the sun with joyful cakes, colorful sprinkles, and rich frosting layers.",
    metaTitle: "Happy Birthday Cakes in Guwahati | Fresh Birthday Bakes",
    metaDescription: "Send cheerful Happy Birthday cakes in Guwahati. Wide variety of sizes from 500g bento cakes to 2kg party tiers. Order now.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "birthday",
    badgeText: "Same-Day Doorstep Birthday Fun",
    introHtml: "Say Happy Birthday in the sweetest possible way. Our bakery offers classic and contemporary styles to match the birthday person's unique taste.",
    contentBody: "Delivered in festive packaging with complimentary birthday candles and a matching wooden knife.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Do the cakes come with candles and knife?", a: "Yes, every birthday cake includes complementary sparkling/standard candles and a safe cake knife." }
    ],
    popularKeywords: ["happy birthday cake guwahati", "birthday cake delivery"]
  },
  {
    slug: "heart-shape-birthday-cakes-in-guwahati",
    title: "Heart Shape Birthday Cakes in Guwahati",
    heading: "Heart-Shaped Birthday Cakes in Guwahati",
    subheading: "Show your partner, best friend, or sibling how much they mean with an affectionate heart-shaped birthday cake.",
    metaTitle: "Heart Shape Birthday Cakes in Guwahati | Romantic Red Velvet & Chocolate",
    metaDescription: "Order romantic heart shape birthday cakes in Guwahati. Red velvet crumb, dark chocolate truffle & cute vintage borders.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "birthday",
    badgeText: "Romantic Heart Silhouette",
    introHtml: "Heart-shaped cakes are no longer just for anniversaries. They add romantic warmth and affection to your special someone's birthday celebration.",
    contentBody: "Pair with fresh red roses or a box of chocolates for the ultimate birthday romance package in Guwahati.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can I get a heart cake in 500g size?", a: "Yes, our heart cakes start at 500g (ideal for 2-4 people) up to 2kg for bigger gatherings." }
    ],
    popularKeywords: ["heart shape birthday cake", "heart cake delivery guwahati"]
  },
  {
    slug: "kids-birthday-cakes-in-guwahati",
    title: "Kids Birthday Cakes in Guwahati",
    heading: "Fun & Playful Kids Birthday Cakes in Guwahati",
    subheading: "Exciting 3D animal figurines, superhero emblems, racing cars, and enchanted princess themes kids adore.",
    metaTitle: "Kids Birthday Cakes in Guwahati | Superhero & Cartoon Themes",
    metaDescription: "Order playful kids birthday cakes in Guwahati. Spider-Man, Peppa Pig, Jungle Safari & Princess cakes delivered fresh to your party.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "birthday",
    badgeText: "100% Kid-Safe & Eggless Available",
    introHtml: "Throwing a kids birthday bash in Guwahati? Our themed children's cakes are the talk of every party with cheerful designs and delicious sponges.",
    contentBody: "Made with gentle sweetness and natural flavors so parents can celebrate with peace of mind.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can we have an eggless cake for a kids party?", a: "Yes, over 80% of our kids birthday cakes are baked 100% eggless with supreme lightness." }
    ],
    popularKeywords: ["kids birthday cake guwahati", "children birthday cake"]
  },
  {
    slug: "kitkat-oreo-cakes-in-guwahati",
    title: "KitKat Oreo Cakes in Guwahati",
    heading: "Crunchy KitKat & Oreo Cakes in Guwahati",
    subheading: "Surrounded with crispy KitKat wafers and filled with Oreo cookie crumbs folded into silky chocolate cream.",
    metaTitle: "KitKat Oreo Cakes in Guwahati | Loaded Cookie & Chocolate Cakes",
    metaDescription: "Order sensational KitKat and Oreo cakes in Guwahati. Loaded with whole KitKat fingers, Oreo crumbles & silky ganache.",
    city: "Guwahati",
    categorySlug: "cakes",
    flavorOrType: "chocolate",
    badgeText: "Crispy KitKat & Real Oreo Crunch",
    introHtml: "Combine two of the world's favorite snacks into one sensational dessert. The crisp snap of KitKat meets the dark cocoa crunch of Oreo.",
    contentBody: "Tied with an elegant satin ribbon around the KitKat perimeter, this cake looks as thrilling as it tastes.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Does the KitKat stay crispy during delivery?", a: "Yes, our cakes are assembled just before transport so the wafer remains crunchy and intact." }
    ],
    popularKeywords: ["kitkat cake guwahati", "oreo cake delivery", "kitkat oreo cake"]
  },
  {
    slug: "luxury-birthday-cakes-in-guwahati",
    title: "Luxury Birthday Cakes in Guwahati",
    heading: "Ultra-Luxury Birthday Cakes in Guwahati",
    subheading: "Exquisite multi-tiered sculptures, handcrafted sugar flowers, 24K edible gold, and Michelin-inspired flavor pairings.",
    metaTitle: "Luxury Birthday Cakes in Guwahati | Haute Confectionery Cakes",
    metaDescription: "Experience luxury birthday cakes in Guwahati. Premium Belgian chocolates, edible gold leaf, French macarons & custom tier designs.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "birthday",
    badgeText: "Haute Confectionery & 24K Gold",
    introHtml: "When ordinary will not suffice, our luxury line delivers unmatched confectionery artistry. Designed for milestone galas and VIP birthday dinners.",
    contentBody: "Crafted with imported single-origin chocolate, Madagascar Bourbon vanilla, and artisanal French fillings.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "How much advance time is needed for a luxury tier cake?", a: "We recommend booking 24 to 48 hours ahead for bespoke multi-tiered luxury cakes." }
    ],
    popularKeywords: ["luxury birthday cake guwahati", "premium cake shop guwahati"]
  },
  {
    slug: "luxury-cakes-in-guwahati",
    title: "Luxury Cakes in Guwahati",
    heading: "Artisanal Luxury Cakes in Guwahati",
    subheading: "Refined indulgence with Belgian truffles, pistachio mousseline, and hand-sculpted modern confectionery.",
    metaTitle: "Luxury Cakes in Guwahati | Artisanal Gourmet Pâtisserie",
    metaDescription: "Indulge in luxury cakes in Guwahati. Handcrafted gourmet desserts made with pure ingredients, French techniques, and prompt delivery.",
    city: "Guwahati",
    categorySlug: "cakes",
    badgeText: "Artisanal Confectionery Craft",
    introHtml: "Explore our master collection of luxury cakes, blending French pâtisserie precision with contemporary design for Guwahati's most discerning patrons.",
    contentBody: "Every slice offers a harmonious balance of texture, moisture, and rich depth of flavor.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can we order luxury cakes for corporate gifting?", a: "Yes, we support branded corporate gifting boxes with custom company logos and messages." }
    ],
    popularKeywords: ["luxury cakes guwahati", "artisanal cake shop"]
  },
  {
    slug: "flower-delivery-in-guwahati",
    title: "Flower Delivery in Guwahati",
    heading: "Reliable Flower Delivery Across Guwahati",
    subheading: "Send hand-tied bouquets of velvety roses, fragrant lilies, and cheerful gerberas to your loved ones in Guwahati.",
    metaTitle: "Flower Delivery in Guwahati | Same-Day & Midnight Florist",
    metaDescription: "Fast online flower delivery in Guwahati. Red roses, orchids, lilies & carnations. Order bouquets online with 2-hour express delivery.",
    city: "Guwahati",
    categorySlug: "flowers",
    badgeText: "Guwahati's Trusted Online Florist",
    introHtml: "Celebrate life's precious moments with timely flower delivery in Guwahati. Our florists handpick every petal to guarantee freshness and beauty.",
    contentBody: "Serving all residential and commercial addresses in Guwahati including Dispur secretariat, G S Road corporate towers, and residential hubs.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Do you deliver flowers to hospitals and universities in Guwahati?", a: "Yes, we deliver to GMCH, Nemcare, Gauhati University, IIT Guwahati, and all major institutions." }
    ],
    popularKeywords: ["flower delivery in guwahati", "florist in guwahati", "online bouquet delivery"]
  },
  {
    slug: "online-birthday-cake-delivery-in-guwahati",
    title: "Online Birthday Cake Delivery in Guwahati",
    heading: "Seamless Online Birthday Cake Delivery in Guwahati",
    subheading: "Order freshly baked birthday cakes from your phone or laptop with instant confirmation and real-time delivery tracking.",
    metaTitle: "Online Birthday Cake Delivery in Guwahati | Easy Online Ordering",
    metaDescription: "Order birthday cakes online in Guwahati. 100% fresh baking guarantee, multiple delivery slots, secure UPI & card payments.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "birthday",
    badgeText: "Real-Time Tracking & Fast Delivery",
    introHtml: "Experience the easiest way to order birthday cakes online in Guwahati. Browse menus, select weights, personalize greeting cards, and checkout in 2 minutes.",
    contentBody: "With automated slot confirmation and punctual delivery boys, you can relax knowing your surprise is in expert hands.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can I track my delivery in Guwahati?", a: "Yes, you receive order updates and can track status from your account dashboard." }
    ],
    popularKeywords: ["online birthday cake delivery guwahati", "buy cake online"]
  },
  {
    slug: "online-birthday-cakes-for-kids-in-guwahati",
    title: "Online Birthday Cakes for Kids in Guwahati",
    heading: "Order Birthday Cakes for Kids Online in Guwahati",
    subheading: "Exciting flavors, cheerful animated characters, and safe doorstep delivery for children's birthday celebrations.",
    metaTitle: "Online Birthday Cakes for Kids in Guwahati | Fun & Yummy Cakes",
    metaDescription: "Order kids birthday cakes online in Guwahati. Safe food colors, mild flavors & favorite cartoon themes delivered on time.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "birthday",
    badgeText: "Kids Delight Collection",
    introHtml: "Plan your child's dream birthday without stress. Our kid-favorite collection offers gentle vanilla, chocolate, and strawberry cakes decorated with their favorite motifs.",
    contentBody: "Baked fresh on the day of delivery to guarantee maximum softness that children love.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Are the cakes less sugary for small children?", a: "Yes, we balance the sweetness with natural dairy cream and fresh fruit puree for a clean finish." }
    ],
    popularKeywords: ["birthday cakes for kids", "kids cake online guwahati"]
  },
  {
    slug: "online-cake-delivery-in-guwahati",
    title: "Online Cake Delivery in Guwahati",
    heading: "Guwahati's #1 Online Cake Delivery Service",
    subheading: "Fresh cakes, delectable cupcakes, designer bento boxes, and rich celebration tiers delivered across the city.",
    metaTitle: "Online Cake Delivery in Guwahati | Fresh Bakery at Your Door",
    metaDescription: "Guwahati's trusted online cake delivery. 40+ areas covered, same-day delivery, eggless options, and 5-star customer ratings.",
    city: "Guwahati",
    categorySlug: "cakes",
    badgeText: "Over 25,000+ Happy Celebrations",
    introHtml: "From quick family cravings to grand wedding banquets, our online cake delivery service is Guwahati's most dependable choice.",
    contentBody: "Every single cake is baked upon order confirmation using fine flours, real butter, and fresh seasonal ingredients.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "What is the delivery charge across Guwahati?", a: "Standard delivery is complimentary or nominal based on your selected delivery pincode and slot." }
    ],
    popularKeywords: ["online cake delivery in guwahati", "cake delivery guwahati", "order cake online"]
  },
  {
    slug: "online-cake-shop-in-guwahati",
    title: "Online Cake Shop in Guwahati",
    heading: "Your Favorite Online Cake Shop in Guwahati",
    subheading: "Browse hundreds of artisanal cakes, gourmet desserts, bento boxes, and party treats all in one convenient place.",
    metaTitle: "Online Cake Shop in Guwahati | Wide Menu & Custom Bakes",
    metaDescription: "Shop fresh bakery treats at Guwahati's premier online cake shop. Red Velvet, Cheesecake, Truffle, Black Forest & customized celebration cakes.",
    city: "Guwahati",
    categorySlug: "cakes",
    badgeText: "Artisanal Bakery & Pâtisserie",
    introHtml: "Welcome to Guwahati's leading virtual pâtisserie. We bring together master bakers, artisan chocolatiers, and swift delivery experts under one roof.",
    contentBody: "Skip the traffic on G S Road and order fresh gourmet baked goods directly to your doorstep with guaranteed punctuality.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Are eggless options available on all menu items?", a: "Yes, you can toggle eggless preference on nearly all cakes and pastries." }
    ],
    popularKeywords: ["online cake shop in guwahati", "bakery online guwahati"]
  },
  {
    slug: "personalized-birthday-cakes-in-guwahati",
    title: "Personalized Birthday Cakes in Guwahati",
    heading: "Personalized Birthday Cakes in Guwahati",
    subheading: "Custom names, photo prints, personalized age banners, and bespoke color palettes tailored to the guest of honor.",
    metaTitle: "Personalized Birthday Cakes in Guwahati | Custom Name & Toppers",
    metaDescription: "Design personalized birthday cakes in Guwahati. Custom chocolate messaging, acrylic toppers, photo sheets & customized color schemes.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "birthday",
    badgeText: "100% Bespoke Personalization",
    introHtml: "Add a meaningful touch to the celebration. Our personalized cakes feature custom piped script, bespoke flavor fillings, and tailored themes.",
    contentBody: "Our bakers take pride in crafting a cake that tells your loved one's story and reflects their passions.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can I specify custom wording on the cake?", a: "Yes, you can provide up to 35 characters of custom lettering during checkout." }
    ],
    popularKeywords: ["personalized birthday cakes", "custom name cake guwahati"]
  },
  {
    slug: "personalized-message-cakes-in-guwahati",
    title: "Personalized Message Cakes in Guwahati",
    heading: "Personalized Message Cakes in Guwahati",
    subheading: "Speak your heart through sweet confections with beautifully hand-piped messages, love notes, or witty humor.",
    metaTitle: "Personalized Message Cakes in Guwahati | Custom Lettering & Notes",
    metaDescription: "Order personalized message cakes in Guwahati. Bento cakes with witty quotes, romantic messages & celebration wishes hand-piped fresh.",
    city: "Guwahati",
    categorySlug: "cakes",
    badgeText: "Hand-Piped Calligraphy",
    introHtml: "Whether it is an inside joke between friends or a heartfelt love note, our personalized message cakes say it with flavor and charm.",
    contentBody: "Trending Korean bento cakes and classic 1kg rounds with crisp, colorful piped calligraphy that looks amazing in photos.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can Korean bento message cakes be ordered same day?", a: "Yes, our bento message cakes are ready in just 2 to 3 hours across Guwahati." }
    ],
    popularKeywords: ["message cake guwahati", "bento message cake", "custom message cake"]
  },
  {
    slug: "premium-chocolate-cakes-in-guwahati",
    title: "Premium Chocolate Cakes in Guwahati",
    heading: "Premium Chocolate Cakes in Guwahati",
    subheading: "Crafted with 70% dark cocoa, velvety chocolate mousse, and crunchy hazelnut praline for discerning palates.",
    metaTitle: "Premium Chocolate Cakes in Guwahati | 70% Dark Truffle & Mousse",
    metaDescription: "Order premium chocolate cakes in Guwahati. Dark Belgian truffle, chocolate opera, molten lava & hazelnut crunch cakes delivered fresh.",
    city: "Guwahati",
    categorySlug: "cakes",
    flavorOrType: "chocolate",
    badgeText: "Single-Origin Dark Cocoa",
    introHtml: "For chocolate connoisseurs who appreciate the balance between bitter cocoa notes and smooth sweet dairy ganache.",
    contentBody: "Prepared using traditional ganache tempering methods to achieve a mirror-like shine and silk-smooth mouthfeel.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Are dark chocolate options available?", a: "Yes, we offer both 55% semi-sweet and 70% dark Belgian cocoa cakes." }
    ],
    popularKeywords: ["premium chocolate cake", "dark chocolate cake guwahati"]
  },
  {
    slug: "romantic-anniversary-cakes-in-guwahati",
    title: "Romantic Anniversary Cakes in Guwahati",
    heading: "Romantic Anniversary Cakes in Guwahati",
    subheading: "Intimate red velvets, heart drip ganaches, and edible rose accents crafted to ignite romance on your anniversary.",
    metaTitle: "Romantic Anniversary Cakes in Guwahati | Red Velvet & Rose Cakes",
    metaDescription: "Celebrate love with romantic anniversary cakes in Guwahati. Red velvet heart sponges, chocolate kisses & midnight surprise delivery.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "anniversary",
    badgeText: "Romantic Surprise Specialist",
    introHtml: "Rekindle the romance with a cake designed for two. From crimson red velvet sponges with cream cheese frosting to silky chocolate hearts.",
    contentBody: "Complete the celebration by pairing your cake with a bouquet of deep red Dutch roses delivered simultaneously.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can you deliver the cake with red roses?", a: "Yes, check our romantic combos section to order paired cakes and roses delivered together." }
    ],
    popularKeywords: ["romantic anniversary cake", "anniversary cake for couple"]
  },
  {
    slug: "romantic-cake-delivery-in-guwahati",
    title: "Romantic Cake Delivery in Guwahati",
    heading: "Romantic Cake Delivery in Guwahati",
    subheading: "Surprise your soulmate with doorstep cake delivery planned to absolute perfection across Guwahati.",
    metaTitle: "Romantic Cake Delivery in Guwahati | Midnight & Surprise Delivery",
    metaDescription: "Romantic cake delivery in Guwahati. Midnight delivery slots, heart-shaped cakes, and surprise packaging for anniversaries & date nights.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "love-and-romance",
    badgeText: "Doorstep Surprise Guarantee",
    introHtml: "Nothing touches the heart like an unexpected romantic cake delivery. Whether at home, work, or a restaurant, we make romance seamless.",
    contentBody: "Our delivery agents handle surprises with utmost discretion, ensuring the surprise remains a secret until the doorstep reveal.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can you deliver to a hotel or restaurant in Guwahati?", a: "Yes, simply mention the restaurant or hotel room number in delivery notes." }
    ],
    popularKeywords: ["romantic cake delivery", "surprise cake delivery guwahati"]
  },
  {
    slug: "romantic-cakes-in-guwahati",
    title: "Romantic Cakes in Guwahati",
    heading: "Enchanting Romantic Cakes in Guwahati",
    subheading: "Heart shapes, crimson glazes, edible gold accents, and sweet messages crafted for love.",
    metaTitle: "Romantic Cakes in Guwahati | Heart Cakes for Your Loved One",
    metaDescription: "Discover romantic cakes in Guwahati. Handcrafted for anniversaries, Valentine's, proposals & dates. Fresh doorstep delivery.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "love-and-romance",
    badgeText: "Crafted for True Romance",
    introHtml: "Every love story deserves a sweet celebration. Our romantic cake collection blends visual elegance with heavenly taste.",
    contentBody: "Featuring moist sponges infused with vanilla, strawberry compote, or rich chocolate ganache.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can I add a hidden proposal ring or message inside the box?", a: "Yes, contact our concierge to coordinate special proposal deliveries." }
    ],
    popularKeywords: ["romantic cakes guwahati", "love cakes"]
  },
  {
    slug: "rose-flower-cakes-in-guwahati",
    title: "Rose Flower Cakes in Guwahati",
    heading: "Rose Flower Cakes & Combos in Guwahati",
    subheading: "Double the celebration with fragrant fresh rose bouquets paired with freshly baked artisan cakes.",
    metaTitle: "Rose Flower Cakes in Guwahati | Cake & Flower Bouquet Combos",
    metaDescription: "Order rose flower and cake combos in Guwahati. Fresh red roses paired with delicious chocolate & red velvet cakes. Same-day delivery.",
    city: "Guwahati",
    categorySlug: "combos",
    occasionSlug: "love-and-romance",
    badgeText: "Best-Selling Romance Combos",
    introHtml: "Why choose between flowers and cake when both together create pure joy? Our rose flower and cake combos are Guwahati's favorite gift.",
    contentBody: "Each combo features handpicked long-stemmed roses in luxury paper and an oven-fresh gourmet cake delivered together.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Are the flowers and cake delivered in the same box?", a: "They are transported together carefully so the flowers remain crisp and the cake pristine." }
    ],
    popularKeywords: ["rose flower cake", "cake and flower combo guwahati"]
  },
  {
    slug: "same-day-delivery-in-guwahati",
    title: "Same-Day Delivery in Guwahati",
    heading: "Fast Same-Day Cake & Flower Delivery Across Guwahati",
    subheading: "Last-minute plans? Order right now for same-day delivery across all 40+ Guwahati neighborhoods.",
    metaTitle: "Same-Day Cake & Flower Delivery in Guwahati | Fast 2-Hour Express",
    metaDescription: "Need cake or flowers in Guwahati today? Order before 5 PM for same-day delivery or choose 2-hour express delivery across Guwahati.",
    city: "Guwahati",
    categorySlug: "cakes",
    badgeText: "Express 2-Hour Delivery Available",
    introHtml: "Forgot a birthday or celebrating spontaneous good news? Our expedited kitchen and dispatch team ensures your gifts arrive today without compromise.",
    contentBody: "Covering all major Guwahati pin codes: 781001 to 781038 with dedicated delivery partners.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "What is the cutoff time for same-day delivery in Guwahati?", a: "Orders placed by 5:00 PM are guaranteed for same-day evening delivery." }
    ],
    popularKeywords: ["same day cake delivery guwahati", "express flower delivery"]
  },
  {
    slug: "valentine-cakes-in-guwahati",
    title: "Valentine Cakes in Guwahati",
    heading: "Valentine Cakes in Guwahati for Season of Love",
    subheading: "Celebrate Valentine's Day and Valentine's week with heart-shaped velvet cakes, romantic roses, and chocolate surprises.",
    metaTitle: "Valentine Cakes in Guwahati | Valentine's Day Special Bakes",
    metaDescription: "Order Valentine's Day cakes in Guwahati. Heart-shaped red velvet, strawberry cream, chocolate kisses & romantic midnight delivery.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "love-and-romance",
    badgeText: "Valentine's Week Special",
    introHtml: "Make Valentine's week unforgettable. From Rose Day and Chocolate Day to Valentine's Day itself, our Valentine collection spreads pure love.",
    contentBody: "Handcrafted with premium red cocoa, edible rose petals, and heart-shaped sprinkles for the ultimate romantic statement.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can I pre-book for February 14 Valentine's Day delivery?", a: "Yes, pre-booking early secures your preferred time slot during the busy Valentine rush." }
    ],
    popularKeywords: ["valentine cake guwahati", "valentines day cake", "romantic cake"]
  },
  {
    slug: "valentines-day-heart-cakes-in-guwahati",
    title: "Valentine's Day Heart Cakes in Guwahati",
    heading: "Valentine's Day Heart Cakes in Guwahati",
    subheading: "The ultimate emblem of love sculpted into delicate heart shapes with velvety cream cheese and chocolate fudge.",
    metaTitle: "Valentine's Day Heart Cakes in Guwahati | Red Velvet Hearts",
    metaDescription: "Buy Valentine's Day heart cakes in Guwahati online. Romantic heart shapes, crimson red velvet & midnight delivery across Guwahati.",
    city: "Guwahati",
    categorySlug: "cakes",
    occasionSlug: "love-and-romance",
    badgeText: "Signature Red Velvet Heart",
    introHtml: "Symbolize your unconditional devotion with our signature Valentine's heart cake. Baked with rich red velvet crumb and silken cream cheese.",
    contentBody: "Available in single-tier hearts, vintage piping, and paired with red roses for the quintessential romantic gesture.",
    deliveryAreas: DEFAULT_AREAS,
    faqs: [
      { q: "Can I add custom chocolate hearts or names on top?", a: "Yes, personalize your cake with your partner's name or custom loving message." }
    ],
    popularKeywords: ["valentines day heart cake", "heart cake delivery guwahati", "red velvet heart cake"]
  }
];

export async function seedSeoLandingPages(): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  for (const item of SEO_PAGES_SEED_DATA) {
    const existing = await prisma.seoLandingPage.findUnique({
      where: { slug: item.slug }
    });

    if (existing) {
      await prisma.seoLandingPage.update({
        where: { slug: item.slug },
        data: {
          title: item.title,
          heading: item.heading,
          subheading: item.subheading,
          metaTitle: item.metaTitle,
          metaDescription: item.metaDescription,
          city: item.city,
          categorySlug: item.categorySlug,
          occasionSlug: item.occasionSlug,
          flavorOrType: item.flavorOrType,
          badgeText: item.badgeText,
          introHtml: item.introHtml,
          contentBody: item.contentBody,
          deliveryAreas: item.deliveryAreas,
          faqs: item.faqs,
          popularKeywords: item.popularKeywords,
          isActive: true
        }
      });
      updated++;
    } else {
      await prisma.seoLandingPage.create({
        data: {
          slug: item.slug,
          title: item.title,
          heading: item.heading,
          subheading: item.subheading,
          metaTitle: item.metaTitle,
          metaDescription: item.metaDescription,
          city: item.city,
          categorySlug: item.categorySlug,
          occasionSlug: item.occasionSlug,
          flavorOrType: item.flavorOrType,
          badgeText: item.badgeText,
          introHtml: item.introHtml,
          contentBody: item.contentBody,
          deliveryAreas: item.deliveryAreas,
          faqs: item.faqs,
          popularKeywords: item.popularKeywords,
          isActive: true
        }
      });
      created++;
    }
  }

  return { created, updated };
}
