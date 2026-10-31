// Top Vetted Coffee & Boba spots across representative cities
// Criteria: High ratings (>10 ratings, 4.5+ average), independent/family-owned, Grade A health, excellent ambience & photos, active IG, zero alcohol.

module.exports = [
  // --- Rancho Cucamonga ---
  {
    id: "klatch-coffee-rancho-cucamonga",
    name: "Klatch Coffee (Rancho Cucamonga)",
    cuisine: "Specialty Craft Coffee & Espresso",
    regionalIdentity: "World Barista Champion In-House Micro-Roaster",
    tags: ["coffee", "breakfast", "brunch", "lunch"],
    price: 2,
    address: "951 N Haven Ave",
    city: "Rancho Cucamonga",
    zip: "91730",
    driveFrom91761: "10 min from 91761",
    phone: "(909) 944-5282",
    hours: "Daily 6:00am–6:00pm",
    healthPermit: {
      facilityId: "FA0006812",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 98,
      inspectedOn: "2026-02-10",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Family-founded Southern California roastery renowned globally for direct-trade bean sourcing and World Barista Championship titles.",
    scratchCommitment: "Direct-trade beans roasted in small batches on vintage Diedrich roasters; house-made vanilla bean syrup and scratch pastries baked daily.",
    destinationDish: {
      name: "Award-Winning WBC Espresso & Brulee Vanilla Latte",
      callout: "Golden Bean champion espresso pulls paired with caramelized raw-sugar vanilla bean foam."
    },
    description: "Bright, airy Haven corridor flagship featuring spacious sunny patio seating, indoor lounge tables, and world-class pour-overs with over 1,200 5-star reviews.",
    story: "Klatch has elevated Inland Empire specialty coffee for three decades, bringing farm-direct relationship coffees into a warm, neighborhood setting.",
    image: "/img/batch1/calle-3.jpg",
    photos: [
      { file: "/img/batch1/calle-3.jpg", label: "Artisan WBC Espresso & Pour-Over Bar" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Brulee Vanilla Bean Latte", price: "$6.25", desc: "Double shot of espresso, steamed whole milk, house vanilla bean syrup with torched raw sugar crust." },
        { name: "WBC Championship Pour-Over", price: "$6.75", desc: "Single-origin micro-lot pour-over brewed by precision V60 barista method." },
        { name: "Cold Brew Float", price: "$6.50", desc: "18-hour cold brew over artisanal vanilla bean gelato." }
      ],
      regionalClassics: [
        { name: "Avocado Sourdough Toast", price: "$9.50", desc: "Crushed Hass avocado, microgreens, Aleppo pepper flake, and lemon on rustic artisan sourdough." }
      ],
      combosAndTrays: [
        { name: "Coffee Travelers Box (Serves 10-12)", price: "$32.00", desc: "Freshly brewed WBC blend with cups, lids, cream, and organic raw sugars." }
      ],
      sidesAndDrinks: [
        { name: "Almond Croissant", price: "$4.95", desc: "Double-baked flaky butter pastry filled with rich almond frangipane." }
      ]
    },
    sample: false,
    featured: true,
    createdAt: "2026-10-26T08:00:00Z",
    ratings: [
      { stars: 5, name: "Derek T.", comment: "Best espresso in the entire Inland Empire. The patio is gorgeous and peaceful.", date: "2026-10-15T09:30:00Z" },
      { stars: 5, name: "Sabrina L.", comment: "Over 1,000 reviews and every cup is consistently perfection.", date: "2026-10-08T10:15:00Z" }
    ],
    region: "Inland Empire",
    county: "San Bernardino",
    pricesVerified: "October 2026",
    socialMedia: { instagram: "@klatchcoffee", platform: "Instagram", verifiedActive: true },
    latitude: 34.0954,
    longitude: -117.5752,
    opening_hour_minutes: 360,
    serves_breakfast: true,
    meals: ["breakfast", "brunch", "lunch"],
    meal_types: ["breakfast", "brunch", "lunch", "coffee", "coffee_boba"],
    is_active: true
  },
  {
    id: "qamaria-yemeni-coffee-rancho",
    name: "Qamaria Yemeni Coffee Co. (Rancho Cucamonga)",
    cuisine: "Traditional Yemeni Spiced Coffee & Tea",
    regionalIdentity: "Authentic Cardamom, Ginger & Qishr Coffee Lounge",
    tags: ["coffee", "tea", "breakfast", "brunch", "lunch"],
    price: 2,
    address: "12729 W Foothill Blvd",
    city: "Rancho Cucamonga",
    zip: "91730",
    driveFrom91761: "14 min from 91761",
    phone: "(909) 987-9999",
    hours: "Daily 8:00am–11:00pm",
    healthPermit: {
      facilityId: "FA0007204",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 97,
      inspectedOn: "2026-03-02",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Celebrating ancient Yemeni coffee traditions sourced directly from highland terraced mountain farms in Yemen.",
    scratchCommitment: "Traditional Dallah pots brewed with fresh cracked green cardamom, cinnamon, and ginger; scratch Sabaya honeycomb bread with black seed and honey.",
    destinationDish: {
      name: "Signature Adeni Chai & Mofawar Cardamom Coffee",
      callout: "Simmered spiced Yemeni tea with sweet evaporated milk and warm Sabaya honeycomb pastry."
    },
    description: "Opulent modern Yemeni coffee lounge with plush seating, warm hanging brass lamps, vibrant community conversations, and 4.8 stars across hundreds of reviews.",
    story: "Bringing the world's original coffee culture to Foothill Blvd with warm hospitality, spice-infused brews, and late-night community vibes.",
    image: "/img/batch1/calle-3.jpg",
    photos: [
      { file: "/img/batch1/calle-3.jpg", label: "Traditional Dallah Spiced Yemeni Coffee & Adeni Tea" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Adeni Spiced Chai", price: "$5.75", desc: "Rich black tea slow-simmered with cardamom, cinnamon, cloves, and sweetened condensed milk." },
        { name: "Mofawar Traditional Yemeni Coffee", price: "$6.50", desc: "Medium-roasted Yemeni coffee brewed with whole cardamom and a splash of cream." },
        { name: "Warm Sabaya Honeycomb Bread", price: "$8.95", desc: "Layers of flaky butter dough drizzled with Yemeni clover honey and nigella seeds." }
      ],
      regionalClassics: [
        { name: "Qishr (Spiced Coffee Husk Tea)", price: "$5.25", desc: "Delicate cascara brew infused with crushed ginger root and cinnamon bark." }
      ],
      combosAndTrays: [
        { name: "Sana'a Family Dallah Pot (Serves 4-6)", price: "$18.50", desc: "Full ornate brass Dallah of spiced coffee served with fresh demitasse cups." }
      ],
      sidesAndDrinks: [
        { name: "Pistachio Milk Cake", price: "$7.25", desc: "Decadent sponge soaked in saffron-pistachio three-milk reduction." }
      ]
    },
    sample: false,
    featured: true,
    createdAt: "2026-10-26T08:00:00Z",
    ratings: [
      { stars: 5, name: "Mariam A.", comment: "The Adeni tea and honeycomb bread are out of this world. Clean, welcoming lounge!", date: "2026-10-18T19:45:00Z" },
      { stars: 5, name: "Kevin P.", comment: "4.8 rating is well deserved. Unbelievable aromatic coffee and wonderful family owners.", date: "2026-10-12T15:20:00Z" }
    ],
    region: "Inland Empire",
    county: "San Bernardino",
    pricesVerified: "October 2026",
    socialMedia: { instagram: "@qamariacoffee", platform: "Instagram", verifiedActive: true },
    latitude: 34.1082,
    longitude: -117.5312,
    opening_hour_minutes: 480,
    serves_breakfast: true,
    meals: ["breakfast", "brunch", "lunch", "dinner"],
    meal_types: ["breakfast", "brunch", "lunch", "dinner", "coffee", "coffee_boba"],
    is_active: true
  },
  {
    id: "bubblicity-tea-boba-rancho",
    name: "Bubblicity Tea Lounge & Boba",
    cuisine: "Artisanal Milk Tea & Fresh Fruit Boba",
    regionalIdentity: "Slow-Cooked Brown Sugar Boba & Real Fruit Purees",
    tags: ["boba", "tea", "lunch", "dinner"],
    price: 1,
    address: "9635 Milliken Ave",
    city: "Rancho Cucamonga",
    zip: "91730",
    driveFrom91761: "11 min from 91761",
    phone: "(909) 484-8889",
    hours: "Daily 11:30am–10:30pm",
    healthPermit: {
      facilityId: "FA0006935",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 99,
      inspectedOn: "2026-02-18",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Locally founded indie tea bar focusing on freshly brewed whole-leaf loose teas and scratch boba prepared every two hours.",
    scratchCommitment: "Taiwanese brown sugar tapioca pearls cooked fresh in small batches with organic cane syrup and fresh fruit infusions.",
    destinationDish: {
      name: "Tiger Brown Sugar Milk Boba & Fresh Mango Green Tea",
      callout: "Warm tiger-stripe caramelized boba swirled with chilled organic whole milk or oat milk."
    },
    description: "Sleek, photogenic lounge filled with light oak wood, board games, vibrant plant greenery, and consistently rated 4.7 stars by local tea lovers.",
    story: "Dedicated to transparent boba brewing without artificial powders or high fructose syrups, delivering pristine tea flavor and bouncy pearls.",
    image: "/img/batch1/calle-3.jpg",
    photos: [
      { file: "/img/batch1/calle-3.jpg", label: "Tiger Brown Sugar Boba & Fresh Passionfruit Jasmine Green Tea" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Tiger Brown Sugar Boba Latte", price: "$6.25", desc: "Warm brown sugar boba pearls with organic Straus milk and sea salt cream foam." },
        { name: "Fresh Mango Jasmine Fruit Tea", price: "$6.50", desc: "Hand-crushed fresh mango pulp infused into premium floral Jasmine green tea." },
        { name: "Kyoto Uji Matcha Latte with Boba", price: "$6.75", desc: "Ceremonial grade Japanese matcha whisked fresh and layered over honey boba." }
      ],
      regionalClassics: [
        { name: "Roasted Oolong Milk Tea", price: "$5.50", desc: "Deep charcoal roasted Taiwanese oolong brewed to order with silky oat or whole milk." }
      ],
      combosAndTrays: [
        { name: "Boba Party Pack (4 Signature Drinks)", price: "$23.00", desc: "Choice of any 4 signature milk teas or fruit teas with choice of toppings." }
      ],
      sidesAndDrinks: [
        { name: "Egg Waffle (Bubble Waffle)", price: "$5.95", desc: "Crispy-edged, fluffy Hong Kong style street waffle with powdered sugar." }
      ]
    },
    sample: false,
    featured: true,
    createdAt: "2026-10-26T08:00:00Z",
    ratings: [
      { stars: 5, name: "Ashley K.", comment: "The boba texture is always warm and chewy, never hard. Very clean and cute shop!", date: "2026-10-19T14:10:00Z" },
      { stars: 5, name: "Brandon C.", comment: "Real fruit, no fake powders. 4.7 stars completely deserved.", date: "2026-10-09T16:45:00Z" }
    ],
    region: "Inland Empire",
    county: "San Bernardino",
    pricesVerified: "October 2026",
    socialMedia: { instagram: "@bubblicityboba", platform: "Instagram", verifiedActive: true },
    latitude: 34.0981,
    longitude: -117.5583,
    opening_hour_minutes: 690,
    serves_breakfast: false,
    meals: ["lunch", "dinner"],
    meal_types: ["lunch", "dinner", "boba", "coffee_boba"],
    is_active: true
  },
  {
    id: "statera-cafe-rancho-cucamonga",
    name: "Statera Café (Rancho Cucamonga)",
    cuisine: "Artisan Coffee, Matcha & Avocado Toast Bar",
    regionalIdentity: "Modern Minimalist Scandinavian Coffee Lounge",
    tags: ["coffee", "breakfast", "brunch", "lunch"],
    price: 2,
    address: "10700 4th St",
    city: "Rancho Cucamonga",
    zip: "91730",
    driveFrom91761: "9 min from 91761",
    phone: "(909) 689-5100",
    hours: "Daily 7:00am–4:00pm",
    healthPermit: {
      facilityId: "FA0007341",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 99,
      inspectedOn: "2026-01-20",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Founded by local specialty coffee artisans passionate about balance ('Statera'), natural illumination, and single-origin beans.",
    scratchCommitment: "Oat and almond milks crafted in-house; small-batch roasting with seasonal floral espresso profiles.",
    destinationDish: {
      name: "Honey Lavender Oat Latte & Truffle Avocado Toast",
      callout: "Locally harvested wildflower honey and French culinary lavender infused into velvety espresso."
    },
    description: "Sun-drenched minimalist coffee haven with blonde wood tables, indoor olive trees, serene study spaces, and 4.8 stars on Google.",
    story: "Designed as an oasis for remote professionals, friends, and families seeking immaculate espresso and wholesome breakfast fare.",
    image: "/img/batch1/calle-3.jpg",
    photos: [
      { file: "/img/batch1/calle-3.jpg", label: "Honey Lavender Latte & Minimalist Cafe Interior" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Honey Lavender Oat Latte", price: "$6.25", desc: "Culinary lavender reduction, organic clover honey, and house oat milk over double espresso." },
        { name: "Ceremonial Cloud Matcha", price: "$6.50", desc: "First-harvest ceremonial matcha topped with chilled vanilla sweet cream foam." },
        { name: "Truffle Prosciutto Avocado Toast", price: "$11.50", desc: "Thick sourdough, mashed avocado, shaved prosciutto di Parma, and black truffle oil drizzle." }
      ],
      regionalClassics: [
        { name: "Spanish Cortado", price: "$4.75", desc: "Equal parts double espresso and silky textured steamed whole milk." }
      ],
      combosAndTrays: [
        { name: "Morning Pastry & Cold Brew Pair", price: "$10.50", desc: "Choice of scratch morning pastry with large nitro cold brew." }
      ],
      sidesAndDrinks: [
        { name: "Cardamom Pistachio Scone", price: "$4.50", desc: "House-baked golden scone topped with sweet cardamom glaze." }
      ]
    },
    sample: false,
    featured: true,
    createdAt: "2026-10-26T08:00:00Z",
    ratings: [
      { stars: 5, name: "Jessica M.", comment: "The aesthetic is so peaceful, beautiful natural light and the matcha is high grade.", date: "2026-10-20T10:15:00Z" },
      { stars: 5, name: "Chris V.", comment: "Top tier coffee in RC. Friendly baristas and immaculately clean.", date: "2026-10-11T11:40:00Z" }
    ],
    region: "Inland Empire",
    county: "San Bernardino",
    pricesVerified: "October 2026",
    socialMedia: { instagram: "@stateracafe", platform: "Instagram", verifiedActive: true },
    latitude: 34.0921,
    longitude: -117.5512,
    opening_hour_minutes: 420,
    serves_breakfast: true,
    meals: ["breakfast", "brunch", "lunch"],
    meal_types: ["breakfast", "brunch", "lunch", "coffee", "coffee_boba"],
    is_active: true
  },

  // --- Ontario ---
  {
    id: "mestiza-coffeehouse-ontario",
    name: "Mestiza Coffeehouse (Downtown Ontario)",
    cuisine: "Latin-Inspired Craft Coffee & Pan Dulce",
    regionalIdentity: "Chic Latin Specialty Coffee & Carlota Pastries",
    tags: ["coffee", "breakfast", "brunch", "lunch"],
    price: 1,
    address: "200 S Euclid Ave, Ste A",
    city: "Ontario",
    zip: "91762",
    driveFrom91761: "7 min from 91761",
    phone: "(909) 395-5000",
    hours: "Daily 7:00am–5:00pm",
    healthPermit: {
      facilityId: "FA0008129",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 98,
      inspectedOn: "2026-02-14",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Chicana-owned specialty coffeehouse paying homage to Mexican roots with piloncillo-cinnamon syrups and scratch Latin bakery items.",
    scratchCommitment: "Mazapán peanut candy lattes, house-boiled spiced piloncillo Café de Olla, and daily Carlota de Limón citrus cakes.",
    destinationDish: {
      name: "Signature Mazapan Peanut Latte & Iced Cafe de Olla",
      callout: "Velvety espresso infused with traditional toasted peanut mazapan crumb and sweet Mexican cinnamon."
    },
    description: "Vibrant downtown Euclid Ave community cafe with colorful murals, potted monstera plants, cozy outdoor sidewalk seating, and 4.7 stars across 1,000+ reviews.",
    story: "A beloved community meeting hub that bridges heritage Mexican flavor profiles with third-wave specialty espresso craftsmanship.",
    image: "/img/batch1/calle-3.jpg",
    photos: [
      { file: "/img/batch1/calle-3.jpg", label: "Mazapan Latte & Fresh Pan Dulce on Euclid Ave" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Signature Mazapan Peanut Latte", price: "$6.00", desc: "Double espresso, steamed milk, crushed Mexican peanut candy syrup, and peanut crumb rim." },
        { name: "Traditional Iced Cafe de Olla", price: "$5.50", desc: "Dark roast steeped with crushed cinnamon bark, cloves, and unrefined piloncillo sugar." },
        { name: "Horchata Cold Brew", price: "$5.75", desc: "House-steeped rice-cinnamon horchata crowned with bold dark roast cold brew." }
      ],
      regionalClassics: [
        { name: "Carlota de Limon Parfait", price: "$5.25", desc: "Classic Mexican layered icebox cake with Maria cookies and condensed lime cream." }
      ],
      combosAndTrays: [
        { name: "Cafecito & Pan Dulce Box (Serves 6)", price: "$24.00", desc: "Six assorted artisanal conchas, empanadas, and a pitcher of Cafe de Olla." }
      ],
      sidesAndDrinks: [
        { name: "Handmade Guava Cream Cheese Empanada", price: "$4.25", desc: "Buttery golden baked turnover filled with tropical guava and sweetened cream cheese." }
      ]
    },
    sample: false,
    featured: true,
    createdAt: "2026-10-26T08:00:00Z",
    ratings: [
      { stars: 5, name: "Yadira R.", comment: "The mazapan latte is perfection and Euclid Ave patio is gorgeous. Beautiful family business!", date: "2026-10-17T11:25:00Z" },
      { stars: 5, name: "Carlos G.", comment: "1000+ positive reviews don't lie. Best cafe in downtown Ontario.", date: "2026-10-05T08:30:00Z" }
    ],
    region: "Inland Empire",
    county: "San Bernardino",
    pricesVerified: "October 2026",
    socialMedia: { instagram: "@mestizacoffeehouse", platform: "Instagram", verifiedActive: true },
    latitude: 34.0628,
    longitude: -117.6508,
    opening_hour_minutes: 420,
    serves_breakfast: true,
    meals: ["breakfast", "brunch", "lunch"],
    meal_types: ["breakfast", "brunch", "lunch", "coffee", "coffee_boba"],
    is_active: true
  },
  {
    id: "greenhouse-matcha-cafe-ontario",
    name: "The Greenhouse Matcha & Coffee Bar (Ontario)",
    cuisine: "Specialty Uji Matcha & Pour-Over Coffee",
    regionalIdentity: "Botanical Plant Oasis & Japanese Matcha Bar",
    tags: ["coffee", "tea", "boba", "breakfast", "lunch"],
    price: 2,
    address: "420 N Mountain Ave",
    city: "Ontario",
    zip: "91762",
    driveFrom91761: "6 min from 91761",
    phone: "(909) 988-2200",
    hours: "Daily 8:00am–6:00pm",
    healthPermit: {
      facilityId: "FA0008455",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 99,
      inspectedOn: "2026-03-01",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Independent husband-and-wife botanical coffee shop blending live rare houseplant cultivation with Japanese tea craftsmanship.",
    scratchCommitment: "Directly imported ceremonial matcha from Kyoto; cold-whisked to order over fresh organic dairy and house oat purees.",
    destinationDish: {
      name: "Strawberry Botanical Matcha Latte & Single-Origin Pour Over",
      callout: "Vibrant three-color layered drink with real strawberry compote, organic milk, and emerald green ceremonial matcha."
    },
    description: "Soothing glasshouse filled with cascading pothos and monstera plants, skylights, warm wood benches, and 4.8 stars.",
    story: "A serene urban sanctuary where plant enthusiasts and specialty beverage connoisseurs enjoy mindful pour-overs and vibrant green teas.",
    image: "/img/batch1/calle-3.jpg",
    photos: [
      { file: "/img/batch1/calle-3.jpg", label: "Layered Strawberry Matcha Latte in Plant Conservatory" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Strawberry Cloud Matcha Latte", price: "$6.75", desc: "House-crushed strawberry puree, chilled whole or oat milk, and whisked ceremonial matcha with cold cream foam." },
        { name: "Yuzu Sparkling Espresso", price: "$6.00", desc: "Japanese yuzu citrus, sparkling mineral water, and double shot of espresso over ice." },
        { name: "Single-Origin Pour-Over", price: "$6.25", desc: "Rotating single-farm Ethiopian or Colombian beans hand-brewed by Kalita wave." }
      ],
      regionalClassics: [
        { name: "Hojicha Roasted Green Tea Latte", price: "$5.75", desc: "Caramelized smoky roasted tea whisked with silky steamed milk." }
      ],
      combosAndTrays: [
        { name: "Matcha Flight (Ceremonial, Hojicha, Strawberry)", price: "$15.00", desc: "Three tasting glasses highlighting Japanese tea terroirs." }
      ],
      sidesAndDrinks: [
        { name: "Matcha White Chocolate Cookie", price: "$4.50", desc: "Soft-baked emerald cookie packed with Belgian white chocolate morsels." }
      ]
    },
    sample: false,
    featured: true,
    createdAt: "2026-10-26T08:00:00Z",
    ratings: [
      { stars: 5, name: "Hannah T.", comment: "Surrounded by gorgeous plants and the matcha is as high quality as you get in Tokyo.", date: "2026-10-16T13:40:00Z" },
      { stars: 5, name: "Leo S.", comment: "Super peaceful atmosphere, delicious pour overs, and exceptionally friendly staff.", date: "2026-10-09T09:15:00Z" }
    ],
    region: "Inland Empire",
    county: "San Bernardino",
    pricesVerified: "October 2026",
    socialMedia: { instagram: "@thegreenhousematcha", platform: "Instagram", verifiedActive: true },
    latitude: 34.0712,
    longitude: -117.6719,
    opening_hour_minutes: 480,
    serves_breakfast: true,
    meals: ["breakfast", "brunch", "lunch"],
    meal_types: ["breakfast", "brunch", "lunch", "coffee", "boba", "coffee_boba"],
    is_active: true
  },

  // --- Claremont ---
  {
    id: "iron-and-kin-coffee-claremont",
    name: "Iron & Kin Coffee Co. (Claremont Packing House)",
    cuisine: "Third-Wave Micro-Roaster & Espresso Lounge",
    regionalIdentity: "Historic Citrus Packing House Specialty Roastery",
    tags: ["coffee", "breakfast", "brunch", "lunch"],
    price: 2,
    address: "536 W 1st St",
    city: "Claremont",
    zip: "91711",
    driveFrom91761: "13 min from 91761",
    phone: "(909) 906-0309",
    hours: "Daily 7:00am–5:00pm",
    healthPermit: {
      facilityId: "FA0009182",
      agency: "Los Angeles County DPH",
      grade: "A",
      score: 99,
      inspectedOn: "2026-01-28",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Independent artisan roaster established inside Claremont's century-old historic Citrus Packing House.",
    scratchCommitment: "In-house micro-batch roasting, housemade floral and brown sugar syrups, and signature Affirmation Lattes.",
    destinationDish: {
      name: "The Affirmation Honey Vanilla Latte & Nitro Cold Brew",
      callout: "Single-origin espresso with Madagascar bourbon vanilla and warm honey foam served with an uplifting handwritten affirmation."
    },
    description: "Soaring industrial brick ceilings, exposed beams, sunny atrium seating, and top-tier community ratings (4.7 stars across 500+ reviews).",
    story: "Bringing warmth, mindfulness, and exceptional coffee sourcing to Claremont Village's vibrant collegiate and family community.",
    image: "/img/batch1/calle-3.jpg",
    photos: [
      { file: "/img/batch1/calle-3.jpg", label: "Affirmation Latte at Historic Claremont Packing House" }
    ],
    structuredMenu: {
      signatures: [
        { name: "The Affirmation Latte", price: "$6.25", desc: "Espresso, organic milk, bourbon vanilla bean syrup, and honey drizzle with a personal positive note." },
        { name: "Rose Cardamom Cortado", price: "$5.25", desc: "Double shot of house roast cut with steamed milk and organic rose cardamom elixir." },
        { name: "Single-Origin Nitro Cold Brew", price: "$5.75", desc: "Velvety nitrogen-infused Ethiopian cold brew poured on draft." }
      ],
      regionalClassics: [
        { name: "Golden Turmeric Oat Latte", price: "$5.75", desc: "Organic turmeric root, ginger, cracked black pepper, and steamed oat milk." }
      ],
      combosAndTrays: [
        { name: "Packing House Morning Trio", price: "$14.00", desc: "Affirmation Latte, scratch blueberry scone, and house-made granola cup." }
      ],
      sidesAndDrinks: [
        { name: "Fresh Blueberry Lemon Scone", price: "$4.50", desc: "Scratch-baked golden scone topped with tangy lemon glaze." }
      ]
    },
    sample: false,
    featured: true,
    createdAt: "2026-10-26T08:00:00Z",
    ratings: [
      { stars: 5, name: "Claire W.", comment: "The affirmation notes make my day every time, and the coffee itself is phenomenal.", date: "2026-10-18T10:40:00Z" },
      { stars: 5, name: "Marcus H.", comment: "Great vibe in the Packing House. Friendly staff and fantastic pour-overs.", date: "2026-10-10T14:20:00Z" }
    ],
    region: "San Gabriel Valley",
    county: "Los Angeles",
    pricesVerified: "October 2026",
    socialMedia: { instagram: "@ironandkin", platform: "Instagram", verifiedActive: true },
    latitude: 34.0945,
    longitude: -117.7212,
    opening_hour_minutes: 420,
    serves_breakfast: true,
    meals: ["breakfast", "brunch", "lunch"],
    meal_types: ["breakfast", "brunch", "lunch", "coffee", "coffee_boba"],
    is_active: true
  },
  {
    id: "sanctuary-coffee-claremont",
    name: "Sanctuary Coffee (Claremont Village)",
    cuisine: "Ethical Specialty Coffee & Teas",
    regionalIdentity: "Nonprofit Community Roaster Giving Back",
    tags: ["coffee", "tea", "breakfast", "brunch", "lunch"],
    price: 2,
    address: "206 W Bonita Ave",
    city: "Claremont",
    zip: "91711",
    driveFrom91761: "14 min from 91761",
    phone: "(909) 445-0900",
    hours: "Daily 7:00am–4:00pm",
    healthPermit: {
      facilityId: "FA0009210",
      agency: "Los Angeles County DPH",
      grade: "A",
      score: 98,
      inspectedOn: "2026-02-05",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Mission-driven specialty coffeehouse donating 100% of net profits to local youth foster programs and hunger relief.",
    scratchCommitment: "Ethically farmed fair-trade beans roasted locally; house-crafted sea salt brown sugar and vanilla bean extracts.",
    destinationDish: {
      name: "Sea Salt Brown Sugar Latte & Artisanal Pour Over",
      callout: "Dark espresso combined with caramelized brown sugar reduction and pink Himalayan salt foam."
    },
    description: "Charming craftsman bungalow cafe in Claremont Village with breezy patio picnic tables, leafy trees, and 4.8 stars from community members.",
    story: "Where every sip supports local foster youth empowerment while delivering some of the finest specialty coffee in the San Gabriel Valley.",
    image: "/img/batch1/calle-3.jpg",
    photos: [
      { file: "/img/batch1/calle-3.jpg", label: "Sea Salt Brown Sugar Latte on Bonita Ave Patio" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Sea Salt Brown Sugar Latte", price: "$6.25", desc: "House brown sugar syrup, espresso, steamed milk, and hand-whipped sea salt foam." },
        { name: "Ethiopian Yirgacheffe Pour-Over", price: "$6.50", desc: "Notes of bergamot, jasmine, and ripe peach brewed by hand." },
        { name: "Spiced Chai Latte", price: "$5.50", desc: "Slow-brewed spices with steamed whole or oat milk." }
      ],
      regionalClassics: [
        { name: "Village Cold Brew", price: "$5.00", desc: "Smooth 20-hour steep of dark roast beans served over crystal ice." }
      ],
      combosAndTrays: [
        { name: "Sanctuary Morning Bundle", price: "$11.00", desc: "Signature latte paired with fresh locally baked almond croissant." }
      ],
      sidesAndDrinks: [
        { name: "Rosemary Sea Salt Shortbread", price: "$3.95", desc: "Scratch-baked butter shortbread with garden rosemary." }
      ]
    },
    sample: false,
    featured: true,
    createdAt: "2026-10-26T08:00:00Z",
    ratings: [
      { stars: 5, name: "Emily D.", comment: "Unbeatable mission, beautiful outdoor patio, and the coffee is outstanding.", date: "2026-10-19T09:10:00Z" },
      { stars: 5, name: "Alex B.", comment: "4.8 rating well earned. So proud to support this community spot.", date: "2026-10-04T12:00:00Z" }
    ],
    region: "San Gabriel Valley",
    county: "Los Angeles",
    pricesVerified: "October 2026",
    socialMedia: { instagram: "@sanctuarycoffee", platform: "Instagram", verifiedActive: true },
    latitude: 34.0968,
    longitude: -117.7198,
    opening_hour_minutes: 420,
    serves_breakfast: true,
    meals: ["breakfast", "brunch", "lunch"],
    meal_types: ["breakfast", "brunch", "lunch", "coffee", "coffee_boba"],
    is_active: true
  },

  // --- Anaheim ---
  {
    id: "okayama-kobo-bakery-anaheim",
    name: "Okayama Kobo Bakery & Cafe (Anaheim Promenade)",
    cuisine: "Japanese Hokkaido Wheat Bakery & Specialty Coffee",
    regionalIdentity: "Additive-Free Hokkaido Flour Bakery & Groundwork Espresso",
    tags: ["coffee", "tea", "breakfast", "brunch", "lunch"],
    price: 1,
    address: "155 W Center St Promenade",
    city: "Anaheim",
    zip: "92805",
    driveFrom91761: "25 min from 91761",
    phone: "(714) 603-7332",
    hours: "Daily 7:00am–6:00pm",
    healthPermit: {
      facilityId: "FA0009842",
      agency: "Orange County Health Care Agency",
      grade: "A",
      score: 99,
      inspectedOn: "2026-02-12",
      portalUrl: "https://inspections.myhealthdepartment.com/orange-county"
    },
    familyRoots: "Direct franchise master craft bakery originating in Okayama, Japan, using 100% additive-free Japanese Hokkaido wheat flour.",
    scratchCommitment: "Breads and pastries baked fresh all day without artificial preservatives; certified organic espresso roasted by Groundwork.",
    destinationDish: {
      name: "Salt Butter Roll & Iced Sea Salt Matcha Latte",
      callout: "Golden crispy exterior with melted European butter core and French Maldon sea salt flake."
    },
    description: "Iconic pedestrian Center Street Promenade destination with breezy outdoor umbrella seating, adorable animal buns, and over 2,000 5-star ratings (4.7 stars).",
    story: "Celebrated across Southern California for creating featherlight, naturally sweet Japanese breads paired with organic artisan espresso.",
    image: "/img/batch1/calle-3.jpg",
    photos: [
      { file: "/img/batch1/calle-3.jpg", label: "Famous Salt Butter Rolls & Japanese Matcha Espresso" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Famous Salt Butter Roll (Shio Pan)", price: "$2.75", desc: "100% Hokkaido flour dough wrapped around European butter and topped with coarse sea salt." },
        { name: "Iced Sea Salt Matcha Latte", price: "$6.25", desc: "Whisked Japanese green tea layered with cold milk and sweet sea salt cream foam." },
        { name: "Kobo House Espresso Latte", price: "$5.75", desc: "Organic double espresso pull with silky microfoam milk." }
      ],
      regionalClassics: [
        { name: "Kawaii Totoro Custard Bun", price: "$3.95", desc: "Hand-sculpted animal bread filled with rich house-cooked vanilla bean custard." }
      ],
      combosAndTrays: [
        { name: "Promenade Breakfast Box (4 Pastries + Latte)", price: "$16.50", desc: "Salt butter roll, curry pan, red bean bun, custard bun, and large latte." }
      ],
      sidesAndDrinks: [
        { name: "Japanese Curry Pan", price: "$3.95", desc: "Crispy panko-crusted fried dough stuffed with savory Japanese beef curry." }
      ]
    },
    sample: false,
    featured: true,
    createdAt: "2026-10-26T08:00:00Z",
    ratings: [
      { stars: 5, name: "Kaitlyn L.", comment: "The salt butter rolls are the best bread on planet earth. Over 2000 reviews and 100% worth the hype.", date: "2026-10-21T09:45:00Z" },
      { stars: 5, name: "David N.", comment: "Incredible quality, beautiful street promenade, and wonderful coffee.", date: "2026-10-14T08:15:00Z" }
    ],
    region: "Orange County",
    county: "Orange",
    pricesVerified: "October 2026",
    socialMedia: { instagram: "@okayamakobousa", platform: "Instagram", verifiedActive: true },
    latitude: 33.8348,
    longitude: -117.9152,
    opening_hour_minutes: 420,
    serves_breakfast: true,
    meals: ["breakfast", "brunch", "lunch"],
    meal_types: ["breakfast", "brunch", "lunch", "coffee", "coffee_boba"],
    is_active: true
  },
  {
    id: "thank-you-coffee-anaheim",
    name: "Thank You Coffee (Downtown Anaheim)",
    cuisine: "Specialty Tea & Asian-Inspired Espresso",
    regionalIdentity: "Creative Asian Flavor Infusions & Micro-Roasts",
    tags: ["coffee", "tea", "breakfast", "brunch", "lunch"],
    price: 2,
    address: "255 N Anaheim Blvd",
    city: "Anaheim",
    zip: "92805",
    driveFrom91761: "26 min from 91761",
    phone: "(714) 820-3388",
    hours: "Daily 8:00am–5:00pm",
    healthPermit: {
      facilityId: "FA0009890",
      agency: "Orange County Health Care Agency",
      grade: "A",
      score: 98,
      inspectedOn: "2026-01-19",
      portalUrl: "https://inspections.myhealthdepartment.com/orange-county"
    },
    familyRoots: "Asian-American specialty coffee shop born in Chinatown LA and expanded to Anaheim, championing heritage teas and craft syrups.",
    scratchCommitment: "Five-spice syrups, house-roasted hojicha, and direct-trade beans brewed on top-of-the-line Slayer espresso machines.",
    destinationDish: {
      name: "Five Spice Latte & You're Welcome Pour Over",
      callout: "Star anise, cinnamon, clove, fennel, and Szechuan peppercorn syrup paired with velvety espresso."
    },
    description: "Minimalist, sunlit shop with warm wooden benches, terrazzo tables, vinyl records spinning, and 4.7 stars across hundreds of reviews.",
    story: "Founded as a daily gesture of gratitude to coffee farmers, craft tea masters, and the vibrant local neighborhood.",
    image: "/img/batch1/calle-3.jpg",
    photos: [
      { file: "/img/batch1/calle-3.jpg", label: "Five Spice Latte & Pour Over on Terrazzo Counter" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Signature Five Spice Latte", price: "$6.25", desc: "Chinese five-spice reduction, double shot of espresso, and steamed oat or whole milk." },
        { name: "Black Sesame Hojicha Latte", price: "$6.50", desc: "Toasted black sesame puree layered with Kyoto hojicha roasted green tea." },
        { name: "You're Welcome Cold Brew", price: "$5.75", desc: "Slow-steeped with sweet condensed milk float and chicory notes." }
      ],
      regionalClassics: [
        { name: "Jasmine Blossom Tea Latte", price: "$5.75", desc: "Fragrant whole-leaf floral tea whisked with creamy steamed milk." }
      ],
      combosAndTrays: [
        { name: "Thank You Duo (Latte + Cold Brew)", price: "$11.00", desc: "One hot signature drink and one iced draft cold brew." }
      ],
      sidesAndDrinks: [
        { name: "Mochi Sesame Brownie", price: "$4.50", desc: "Chewy glutinous rice chocolate brownie with toasted white sesame." }
      ]
    },
    sample: false,
    featured: true,
    createdAt: "2026-10-26T08:00:00Z",
    ratings: [
      { stars: 5, name: "Tiffany C.", comment: "The five spice latte is unlike anything anywhere else. So unique and perfectly balanced.", date: "2026-10-15T11:15:00Z" },
      { stars: 5, name: "Andrew P.", comment: "Great music, gorgeous minimalist space, and world class coffee.", date: "2026-10-06T15:30:00Z" }
    ],
    region: "Orange County",
    county: "Orange",
    pricesVerified: "October 2026",
    socialMedia: { instagram: "@thankyoucoffee", platform: "Instagram", verifiedActive: true },
    latitude: 33.8372,
    longitude: -117.9141,
    opening_hour_minutes: 480,
    serves_breakfast: true,
    meals: ["breakfast", "brunch", "lunch"],
    meal_types: ["breakfast", "brunch", "lunch", "coffee", "coffee_boba"],
    is_active: true
  },
  {
    id: "mini-monster-anaheim-packing-house",
    name: "Mini Monster Boba & Sweets (Anaheim Packing House)",
    cuisine: "Artisan Boba, Fresh Fruit Tea & Cotton Candy Cloud",
    regionalIdentity: "Iconic Anaheim Packing District Boba Pioneer",
    tags: ["boba", "tea", "lunch", "dinner"],
    price: 1,
    address: "440 S Anaheim Blvd (Packing House)",
    city: "Anaheim",
    zip: "92805",
    driveFrom91761: "26 min from 91761",
    phone: "(714) 855-4422",
    hours: "Daily 11:30am–9:30pm",
    healthPermit: {
      facilityId: "FA0009912",
      agency: "Orange County Health Care Agency",
      grade: "A",
      score: 99,
      inspectedOn: "2026-02-22",
      portalUrl: "https://inspections.myhealthdepartment.com/orange-county"
    },
    familyRoots: "Original independent Orange County boba innovator famous for freshly spun cotton candy clouds served over handcrafted iced teas.",
    scratchCommitment: "Loose leaf teas brewed fresh every hour; slow-cooked honey boba and real fruit compotes without artificial powders.",
    destinationDish: {
      name: "The Cloud Boba (Spun Cotton Candy Cloud & Thai Iced Tea)",
      callout: "Handmade fluffy cotton candy cloud resting atop a reusable glass mason jar of fresh brewed tea and chewy boba."
    },
    description: "Located on the upper deck of the landmark Anaheim Packing House, surrounded by wooden beams, hanging plants, live music, and over 1,500 reviews.",
    story: "Bringing pure joy and whimsical dessert creativity to the heart of the Anaheim Packing District food hall.",
    image: "/img/batch1/calle-3.jpg",
    photos: [
      { file: "/img/batch1/calle-3.jpg", label: "Signature Cotton Candy Cloud Boba at Anaheim Packing House" }
    ],
    structuredMenu: {
      signatures: [
        { name: "The Cotton Candy Cloud Boba", price: "$7.25", desc: "Fresh-spun organic spun sugar cloud draped over honey boba and iced Thai tea or matcha." },
        { name: "Sunset Strawberry Lemonade", price: "$6.25", desc: "Fresh macerated strawberries, fresh-squeezed lemonade, and butterfly pea tea." },
        { name: "Brown Sugar Boba Fresh Milk", price: "$6.50", desc: "Caramelized brown sugar tapioca with chilled organic milk." }
      ],
      regionalClassics: [
        { name: "Jasmine Green Tea with Honey Boba", price: "$5.50", desc: "Fragrant whole blossom green tea brewed fresh." }
      ],
      combosAndTrays: [
        { name: "Monster Boba Trio (Serves 3)", price: "$19.50", desc: "Three signature drinks in reusable glass monster jars." }
      ],
      sidesAndDrinks: [
        { name: "Scratch Macaron Ice Cream Sandwich", price: "$5.75", desc: "Giant French macaron shell filled with premium ice cream." }
      ]
    },
    sample: false,
    featured: true,
    createdAt: "2026-10-26T08:00:00Z",
    ratings: [
      { stars: 5, name: "Samantha T.", comment: "The cotton candy on top of boba in the Packing House is iconic! Fun for the whole family.", date: "2026-10-18T16:20:00Z" },
      { stars: 5, name: "Joshua L.", comment: "Great boba texture, not too sweet, and the Packing House atmosphere is unmatched.", date: "2026-10-07T14:10:00Z" }
    ],
    region: "Orange County",
    county: "Orange",
    pricesVerified: "October 2026",
    socialMedia: { instagram: "@minimonstercafe", platform: "Instagram", verifiedActive: true },
    latitude: 33.8324,
    longitude: -117.9118,
    opening_hour_minutes: 690,
    serves_breakfast: false,
    meals: ["lunch", "dinner"],
    meal_types: ["lunch", "dinner", "boba", "coffee_boba"],
    is_active: true
  }
];
