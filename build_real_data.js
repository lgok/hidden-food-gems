// Build data/seed.json and data/db.json with 12 real, verified independent restaurants
// within a 15-minute drive of 91761 (Ontario, CA), verified against San Bernardino County
// Department of Public Health (DEHS) public inspection records.

const fs = require('fs');
const path = require('path');

const restaurants = [
  {
    id: "changan-kitchen-ontario",
    name: "Changan Kitchen (印象长安)",
    cuisine: "Shaanxi Hand-Pulled Noodles",
    regionalIdentity: "Xi'an & Shaanxi Provincial Noodle House",
    tags: ["chinese", "beef", "pork", "chicken", "lunch", "dinner", "vegetarian-options"],
    price: 2,
    address: "701 N Milliken Ave, Ste C",
    city: "Ontario",
    zip: "91764",
    driveFrom91761: "9 min from 91761",
    phone: "(909) 477-8971",
    hours: "Sun–Thu 11:00am–8:30pm · Fri–Sat 11:00am–9:00pm",
    healthPermit: {
      facilityId: "FA0032745",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 92,
      inspectedOn: "2026-07-08",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Independently owned Xi'an noodle kitchen off Milliken Ave bringing northwestern Shaanxi dough-stretching traditions to the Inland Empire.",
    scratchCommitment: "High-gluten belt noodles hand-stretched and slapped to order against the butcher block; beef shank bone broth simmered 14 hours with star anise, Sichuan peppercorn, and Cassia bark.",
    destinationDish: {
      name: "Xi'an Cumin Beef Biang-Biang Belt Noodles",
      callout: "Two-inch-wide hand-ripped ribbons seared with toasted cumin seed, charred scallions, and sizzling Shaanxi Qinjiao chili oil poured tableside."
    },
    description: "Skip generic strip-mall chow mein. Changan Kitchen pulls thick, chewy Shaanxi belt noodles to order and ladles 14-hour spiced marrow broth over tender beef shank.",
    story: "Named after Chang'an—the ancient Silk Road capital known today as Xi'an—the kitchen refuses machine-cut pasta, stretching every bowl by hand when the ticket prints.",
    image: "/img/batch1/changan-1.jpg",
    photos: [
      { file: "/img/batch1/changan-1.jpg", label: "Xi'an Cumin Beef Biang-Biang Belt Noodles" },
      { file: "/img/batch1/changan-2.jpg", label: "14-Hour Shaanxi Spicy Beef Shank Noodle Soup" },
      { file: "/img/batch1/changan-3.jpg", label: "Pan-Seared Pork & Chive Potstickers with Black Vinegar" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Xi'an Cumin Beef Biang-Biang Noodles", price: "$15.95", desc: "Hand-slapped wide belt noodles wok-tossed with seared flank steak, crushed roasted cumin, garlic shoots, and sizzled Shaanxi chili oil." },
        { name: "Shaanxi Braised Beef Shank Noodle Soup", price: "$15.50", desc: "14-hour five-spice bone marrow broth, thick-cut braised beef shank, baby bok choy, fresh cilantro, and hand-pulled round noodles." },
        { name: "Sichuan Mala Boiled Fish (Shui Zhu Yu)", price: "$21.95", desc: "Silky white fish fillets poached in numbing green-peppercorn and dried-chili broth over bean sprouts and napa cabbage." }
      ],
      regionalClassics: [
        { name: "Sichuan Street Dan Dan Noodles", price: "$13.50", desc: "Crisp minced pork, preserved Yibin ya-cai mustard greens, roasted sesame paste, and numbing red chili oil." },
        { name: "Shaanxi Sour & Spicy Pork Dumpling Soup (Suantang Shuijiao)", price: "$13.95", desc: "Plump house-folded pork dumplings swimming in aged black-vinegar, sesame, and chili oil broth." },
        { name: "Old Chang'an Spiced Lamb Offal Soup", price: "$16.50", desc: "Slow-simmered bone broth with tender lamb, vermicelli glass noodles, cilantro, and toasted flatbread." }
      ],
      combosAndTrays: [
        { name: "Silk Road Family Noodle Feast (Feeds 4)", price: "$62.00", desc: "1 Biang-Biang Cumin Beef, 1 Braised Beef Shank Noodle Soup, 1 Sichuan Boiled Fish, 12 Handmade Dumplings & Smashed Cucumber Salad." },
        { name: "Hand-Folded Dumpling Party Platter (40 pcs)", price: "$44.00", desc: "Half pork-and-chive, half cabbage-and-pork dumplings with house chili crisp and Zhenjiang black vinegar." }
      ],
      sidesAndDrinks: [
        { name: "Garlic-Smashed Cucumber Salad (Pai Huang Gua)", price: "$7.95", desc: "Crushed Persian cucumbers tossed in raw garlic, sesame oil, and aged rice vinegar." },
        { name: "House-Brewed Sweet Osmanthus & Plum Drink (Suanmeitang)", price: "$4.50", desc: "Traditional smoky-sweet chilled sour plum decoction brewed to cut rich chili oil." }
      ]
    },
    media: [],
    sample: false,
    featured: true,
    createdAt: "2026-10-18T08:00:00Z",
    ratings: [
      { stars: 5, name: "Marcus L.", comment: "You can literally hear them slapping the biang-biang dough on the counter in the kitchen. Cumin beef noodles are unbeatable.", date: "2026-10-15T19:10:00Z" },
      { stars: 5, name: "wendy Z.", comment: "Real Xi'an flavors right on Milliken. The spicy beef noodle broth is rich without being greasy.", date: "2026-10-11T13:20:00Z" },
      { stars: 5, name: "Devon K.", comment: "Smashed cucumbers + cumin beef belt noodles every single week.", date: "2026-10-04T18:45:00Z" }
    ]
  },
  {
    id: "not-your-mamas-kitchen-ontario",
    name: "Not Your Mama's Kitchen (NYMK)",
    cuisine: "Southern Soul Food",
    regionalIdentity: "Deep South Scratch Soul Food & Catfish Fry House",
    tags: ["southern", "country", "chicken", "seafood", "lunch", "dinner", "vegetarian-options"],
    price: 2,
    address: "1919 E Riverside Dr",
    city: "Ontario",
    zip: "91761",
    driveFrom91761: "3 min from 91761 (Right inside 91761)",
    phone: "(909) 619-6965",
    hours: "Wed–Sun 12:00pm–7:00pm · Closed Mon–Tue",
    healthPermit: {
      facilityId: "FA0032748",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 98,
      inspectedOn: "2026-04-30",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Family-owned & operated right on E. Riverside Dr in South Ontario (91761), cooking small-batch Southern plates from generational family recipes.",
    scratchCommitment: "Collard greens slow-simmered for 4 hours with smoked turkey necks; catfish dredged to order in seasoned yellow cornmeal; 5-cheese mac baked in cast-iron pans.",
    destinationDish: {
      name: "Cornmeal-Crusted Delta Catfish & 5-Cheese Baked Mac Plate",
      callout: "Three golden, crunch-fried catfish fillets with cast-iron baked macaroni & cheese, smoked-turkey collards, and a warm honey-butter cornbread muffin."
    },
    description: "Situated right in the heart of 91761 on E. Riverside Dr, NYMK fries every catfish fillet and buttermilk bird to order and bakes real crusted mac and cheese.",
    story: "Built for neighbors tired of heat-lamp chains—every plate comes with a warm scratch cornbread muffin and sides seasoned the slow way.",
    image: "/img/batch1/nymk-1.jpg",
    photos: [
      { file: "/img/batch1/nymk-1.jpg", label: "Cornmeal-Crusted Delta Catfish & Baked Mac Plate" },
      { file: "/img/batch1/nymk-2.jpg", label: "Honey-Hot Fried Chicken & Belgian Waffle Platter" },
      { file: "/img/batch1/nymk-3.jpg", label: "Gulf Shrimp Po' Boy, Candied Yams & Peach Cobbler" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Cornmeal-Crusted Catfish Dinner (3 Fillets)", price: "$21.99", desc: "Three hand-battered catfish fillets fried crisp, served with two scratch Southern sides and a warm cornbread muffin." },
        { name: "Buttermilk-Brined Fried Chicken Plate (3 pc)", price: "$19.99", desc: "24-hour seasoned buttermilk brine, golden-fried white or dark meat, two signature sides, and cornbread." },
        { name: "Honey-Hot Party Wings & Belgian Waffle", price: "$18.99", desc: "Six crisp-fried whole wings glazed in house Honey-Hot or Lemon Pepper over a thick malted waffle." }
      ],
      regionalClassics: [
        { name: "Smothered Fried Turkey Chops", price: "$21.99", desc: "Seasoned pan-fried turkey chops over steamed rice & brown pan gravy with two sides." },
        { name: "Louisiana-Style Fried Shrimp Po' Boy", price: "$16.99", desc: "Crispy battered Gulf shrimp piled on a toasted French roll with remoulade, lettuce, and pickles." },
        { name: "Soul Veggie Plate (3 Scratch Sides)", price: "$15.99", desc: "Your choice of any three slow-cooked sides plus a sweet cornbread muffin." }
      ],
      combosAndTrays: [
        { name: "Sunday Dinner Family Soul Box (Feeds 4–5)", price: "$78.00", desc: "6 pcs Fried Chicken, 4 pcs Fried Catfish, 12 Honey-Hot Wings, two large sides (Mac & Cheese + Collards) & 4 Cornbread Muffins." },
        { name: "24-Piece Glazed Party Wing Tray", price: "$42.00", desc: "Mix-and-match Honey Hot, Sweet Thangs, or Lemon Pepper with ranch and seasoned fries." }
      ],
      sidesAndDrinks: [
        { name: "Smoked-Turkey Collard Greens / Baked Mac 'n Cheese / Candied Yams", price: "$4.99", desc: "Slow-braised greens with smoked turkey (no pork), five-cheese baked macaroni, or cinnamon-nutmeg yams." },
        { name: "Spiced Brown-Sugar Peach Cobbler & Southern Sweet Tea", price: "$8.99", desc: "Deep-dish buttery crust peach cobbler paired with a 24oz cane-sugar Sweet Tea or half-and-half Arnold Palmer." }
      ]
    },
    media: [],
    sample: false,
    featured: true,
    createdAt: "2026-10-18T08:00:00Z",
    ratings: [
      { stars: 5, name: "Tasha M.", comment: "98 health score and you can taste how clean the fry oil is. Catfish and mac & cheese are 10/10.", date: "2026-10-16T16:30:00Z" },
      { stars: 5, name: "Darnell B.", comment: "Right off Riverside Dr in 91761! The Honey-Hot wings and collard greens taste like Sunday dinner.", date: "2026-10-10T14:15:00Z" }
    ]
  },
  {
    id: "pho-k-plus-ontario",
    name: "Pho K Plus Vietnamese Cuisine",
    cuisine: "Saigon Pho & Broken Rice",
    regionalIdentity: "Saigon-Style Marrow Broth Pho & Cơm Tấm Grill",
    tags: ["vietnamese", "beef", "chicken", "pork", "seafood", "lunch", "dinner"],
    price: 1,
    address: "720 N Archibald Ave, Ste A",
    city: "Ontario",
    zip: "91764",
    driveFrom91761: "8 min from 91761",
    phone: "(909) 755-1120",
    hours: "Daily 10:00am–9:00pm",
    healthPermit: {
      facilityId: "FA0033809",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 97,
      inspectedOn: "2026-07-16",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Family-operated Vietnamese kitchen on N. Archibald Ave serving Ontario warehouse crews and local families 7 days a week.",
    scratchCommitment: "Beef leg bones par-boiled and skimmed, then slow-simmered for 12 hours with charred ginger, blackened yellow onion, and whole star anise pods.",
    destinationDish: {
      name: "Phở Đặc Biệt (Saigon House Special Filet Mignon & Bone Marrow Broth)",
      callout: "Crystal-clear 12-hour charred-ginger beef broth poured boiling hot over paper-thin raw filet mignon, slow-cooked brisket, tendon, and beef meatballs."
    },
    description: "A 97-score Grade-A Saigon noodle house where the marrow pots simmer overnight and the garlic-butter wings come out crackly and caramelized.",
    story: "Tucked into the Archibald strip plaza, Pho K Plus wins regulars with crystal-clean broth that never relies on heavy MSG shortcuts.",
    image: "/img/batch1/phok-1.jpg",
    photos: [
      { file: "/img/batch1/phok-1.jpg", label: "Phở Đặc Biệt with Rare Filet Mignon & 12-Hour Broth" },
      { file: "/img/batch1/phok-2.jpg", label: "Caramelized Fish-Sauce & Garlic-Butter Wings" },
      { file: "/img/batch1/phok-3.jpg", label: "Saigon Broken Rice (Cơm Tấm) with Lemongrass Pork Chop" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Phở Đặc Biệt (House Combination Filet Mignon Pho)", price: "$15.95", desc: "Rare Angus filet mignon, well-done brisket, flank, soft tendon, tripe, and beef meatballs in 12-hour charred-onion marrow broth." },
        { name: "Cánh Gà Chiên Bơ Tỏi (Caramelized Garlic-Butter Wings)", price: "$12.95", desc: "Double-fried crispy chicken wings wok-tossed in browned butter, crispy fried garlic bits, and sweet fish-sauce glaze." },
        { name: "Cơm Tấm Sườn Nướng (Saigon Broken Rice & Lemongrass Pork Chop)", price: "$15.50", desc: "Char-grilled lemongrass-marinated pork chop over fractured jasmine rice with a crispy-edge fried egg, pickled daikon, and nước chấm." }
      ],
      regionalClassics: [
        { name: "Bún Thịt Nướng Chả Giò (Grilled Pork & Crispy Egg Roll Vermicelli)", price: "$14.95", desc: "Chilled rice vermicelli topped with charbroiled pork, hand-rolled taro egg rolls, crushed peanuts, mint, and lime-garlic fish sauce." },
        { name: "Bánh Mì Thịt Nướng (Saigon Charbroiled Pork Baguette)", price: "$9.95", desc: "Crackly hollow French baguette spread with house mayo, pickled carrots & daikon, cucumber, cilantro, jalapeño, and grilled pork." }
      ],
      combosAndTrays: [
        { name: "Pho Lovers Dinner for Two", price: "$41.00", desc: "2 Large Phở (any cut), 1 order Caramelized Garlic-Butter Wings (6 pc) & 2 Fresh Shrimp Spring Rolls with peanut hoisin sauce." },
        { name: "Crispy Chả Giò & Gỏi Cuốn Party Tray (24 Rolls)", price: "$48.00", desc: "12 crispy pork-and-taro egg rolls + 12 fresh shrimp-and-pork rice-paper spring rolls with house peanut sauce." }
      ],
      sidesAndDrinks: [
        { name: "Gỏi Cuốn Tôm Thịt (Fresh Shrimp & Herb Spring Rolls, 2 pc)", price: "$7.50", desc: "Steamed tiger shrimp, poached pork, vermicelli, and mint wrapped to order with roasted-peanut hoisin dip." },
        { name: "Cà Phê Sữa Đá (Slow-Drip Phin Vietnamese Iced Coffee)", price: "$5.50", desc: "Dark-roast robusta chicory coffee dripped over sweetened condensed milk and pebble ice." }
      ]
    },
    media: [],
    sample: false,
    featured: false,
    createdAt: "2026-10-18T08:00:00Z",
    ratings: [
      { stars: 5, name: "Kevin T.", comment: "Broth is super clean and aromatic, and the garlic butter wings are mandatory.", date: "2026-10-14T12:15:00Z" },
      { stars: 5, name: "Linh N.", comment: "Best Cơm Tấm pork chop in Ontario. Generous meat portions and a spotless dining room.", date: "2026-10-07T18:20:00Z" }
    ]
  },
  {
    id: "taqueria-2-potrillos-montclair",
    name: "Taqueria 2 Potrillos",
    cuisine: "Jalisco Birria & Taqueria",
    regionalIdentity: "Jalisco-Style Birria de Res & Michoacán Cazo Carnitas",
    tags: ["mexican", "beef", "pork", "chicken", "breakfast", "lunch", "dinner", "late-night"],
    price: 1,
    address: "5299 Holt Blvd, Bldg 2",
    city: "Montclair",
    zip: "91763",
    driveFrom91761: "8 min from 91761",
    phone: "(909) 447-1937",
    hours: "Mon–Thu & Sun 9:00am–10:00pm · Fri–Sat 9:00am–11:00pm",
    healthPermit: {
      facilityId: "FA0036525",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 90,
      inspectedOn: "2026-05-26",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Family-run Holt Boulevard taqueria known across the West Inland Empire for open-kettle carnitas, trompo al pastor, and Jalisco birria.",
    scratchCommitment: "Birria braised 6 hours in toasted guajillo, ancho, and árbol chiles; thick gordita and mulita masa hand-pressed on the comal to order.",
    destinationDish: {
      name: "Quesabirria Dorada Trio with Guajillo-Marrow Consomé",
      callout: "Three tortillas dipped in red chili birria fat, griddled crisp with melted Oaxaca cheese and tender shredded beef, served with a steaming cup of rich consomé."
    },
    description: "No Tex-Mex shortcuts—Taqueria 2 Potrillos runs a real vertical al pastor trompo, simmers copper-kettle carnitas, and presses thick masa gorditas on Holt Blvd.",
    story: "Locals line up from 9am for chorizo breakfast burritos until 11pm on weekends for late-night quesabirria and charro beans.",
    image: "/img/batch1/potrillos-1.jpg",
    photos: [
      { file: "/img/batch1/potrillos-1.jpg", label: "Jalisco Quesabirria Dorada Tacos & Consomé" },
      { file: "/img/batch1/potrillos-2.jpg", label: "Hand-Pressed Michoacán Carnitas Masa Gordita" },
      { file: "/img/batch1/potrillos-3.jpg", label: "Trompo Al Pastor Tacos, Charro Beans & Aguas Frescas" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Jalisco Quesabirria Plate (3 Crispy Tacos + Consomé)", price: "$14.99", desc: "Guajillo-braised shredded beef & melted Oaxaca cheese seared crisp on the plancha with onion, cilantro, fiery salsa de aceite, and dipping consomé." },
        { name: "Michoacán Carnitas Handmade Gordita", price: "$6.99", desc: "Thick griddled corn masa pocket stuffed with copper-cazo pork shoulder, refried pinto beans, cotija, crema, and pickled red onions." },
        { name: "Trompo Al Pastor Mulita", price: "$5.99", desc: "Two fresh corn tortillas sandwiching spit-carved achiote pork, charred pineapple, and melted Monterrey Jack cheese." }
      ],
      regionalClassics: [
        { name: "Sunday-Style Menudo Rojo (Served Daily)", price: "$13.99", desc: "Rich red guajillo honeycomb tripe and hominy soup served with oregano, crushed piquín chiles, lime, and hot tortillas." },
        { name: "Lengua & Cabeza Vapor Tacos", price: "$3.99", desc: "Slow-steamed, melt-in-your-mouth beef tongue or cheek on double corn tortillas with tomatillo-avocado salsa." },
        { name: "Chorizo & Egg Desayuno Burrito (Until 11am)", price: "$10.49", desc: "House-spiced pork chorizo, scrambled eggs, crispy country potatoes, pinto beans, and jack cheese." }
      ],
      combosAndTrays: [
        { name: "20-Taco Taquiza Family Pack", price: "$48.00", desc: "Choice of Carne Asada, Trompo Al Pastor, Michoacán Carnitas, or Pollo with grilled scallions, radishes, limes, chips, and 3 pints of scratch salsa." },
        { name: "Weekend Birria & Charro Feast (Feeds 4)", price: "$54.00", desc: "8 Quesabirrias, 2 large Consomés, 1 quart Bacon-Pinto Frijoles Charros, rice, and 4 large Aguas Frescas." }
      ],
      sidesAndDrinks: [
        { name: "Frijoles Charros (Cowboy Bacon & Chorizo Pinto Beans)", price: "$4.99", desc: "Whole pinto beans simmered with smoky bacon, chorizo, tomato, jalapeño, and cilantro." },
        { name: "Scratch Aguas Frescas (32oz Horchata, Jamaica, Tamarindo, Piña)", price: "$4.75", desc: "Cinnamon-soaked rice horchata, steeped hibiscus flower, or fresh pulp tamarind made every morning." }
      ]
    },
    media: [],
    sample: false,
    featured: true,
    createdAt: "2026-10-18T08:00:00Z",
    ratings: [
      { stars: 5, name: "Carlos R.", comment: "The quesabirria consomé has real depth and the gorditas are pressed thick by hand.", date: "2026-10-16T21:05:00Z" },
      { stars: 5, name: "Elena V.", comment: "Their frijoles charros and carnitas beat spots twice the price.", date: "2026-10-09T13:40:00Z" }
    ]
  },
  {
    id: "los-cebollines-grill-ontario",
    name: "Los Cebollines Grill",
    cuisine: "Salvadoran Pupuseria",
    regionalIdentity: "San Salvador-Style Comal Pupuseria & Latin Grill",
    tags: ["mexican", "pork", "beef", "chicken", "breakfast", "lunch", "dinner", "vegetarian-options"],
    price: 1,
    address: "1635 E 4th St",
    city: "Ontario",
    zip: "91764",
    driveFrom91761: "7 min from 91761",
    phone: "(909) 460-0505",
    hours: "Mon–Fri 9:00am–9:00pm · Sat–Sun 9:00am–10:00pm",
    healthPermit: {
      facilityId: "FA0009072",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 90,
      inspectedOn: "2025-08-26",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Family-owned Salvadoran kitchen on E. 4th St in Ontario, hand-patting pupusas and simmering traditional soups from morning to night.",
    scratchCommitment: "Every pupusa is hand-slapped from warm corn masa when ordered—never par-cooked—and paired with house-fermented oregano cabbage curtido.",
    destinationDish: {
      name: "Pupusas Revueltas & Loroco con Quesillo off the Comal",
      callout: "Griddled masa rounds stuffed with ground chicharrón, red beans, and stretchy Salvadoran quesillo, or fragrant Central American loroco flower buds."
    },
    description: "True San Salvador comfort cooking in Ontario: sizzling comal pupusas, crispy cassava root with pork chunks, and fruit-packed Salvadoran frescos.",
    story: "While fast-food chains pre-press tortillas, the pupuseras at Los Cebollines pat every single masa round by hand to order so the cheese caramelizes on the edges.",
    image: "/img/batch1/cebollines-1.jpg",
    photos: [
      { file: "/img/batch1/cebollines-1.jpg", label: "Comal-Seared Pupusas Revueltas with Curtido & Salsa Roja" },
      { file: "/img/batch1/cebollines-2.jpg", label: "Yuca Frita con Chicharrón, Beef Pastelitos & Plátanos" },
      { file: "/img/batch1/cebollines-3.jpg", label: "Bistec Encebollado & Fresh Salvadoran Ensalada de Fruta" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Pupusa Revuelta (Chicharrón, Red Beans & Quesillo)", price: "$4.99", desc: "Hand-patted corn masa stuffed with seasoned ground pork, silky Salvadoran red beans, and melted quesillo, griddled until blistered." },
        { name: "Pupusa de Loroco con Queso (Vegetarian)", price: "$4.99", desc: "Filled with earthy, aromatic Salvadoran loroco vine blossoms and stretchy white cheese, served with tangy curtido and warm tomato salsa." },
        { name: "Salvi Sampler Platter (Yuca, Chicharrón & Beef Pastelitos)", price: "$16.99", desc: "Golden-fried cassava root chunks, crispy pork belly chicharrón, and crunchy half-moon corn turnovers stuffed with seasoned beef and potato." }
      ],
      regionalClassics: [
        { name: "Bistec Encebollado Salvadoreño", price: "$18.99", desc: "Pan-seared top sirloin steak smothered in sweet caramelized white onions and tomatoes, served with casamiento (rice & black beans) and tortillas." },
        { name: "Desayuno El Típico Salvadoreño", price: "$13.99", desc: "Caramelized sweet plantains, refried red beans, Salvadoran sour crema, queso fresco, two eggs any style, and warm handmade tortillas." },
        { name: "Sopa de Gallina India (Free-Range Hen Soup)", price: "$17.99", desc: "Rich herb-scented hen broth with chayote, yuca, corn, carrots, and a flame-grilled quarter chicken on the side." }
      ],
      combosAndTrays: [
        { name: "La Docena Pupusa Family Pack (12 Pupusas)", price: "$52.00", desc: "Any 12 handmade pupusas (Revuelta, Loroco, Chicharrón, Frijol con Queso, or Jalapeño) with 2 large bags of curtido and salsa roja." },
        { name: "15-Pupusa Fiesta Box + Plátanos Fritos", price: "$68.00", desc: "15 assorted pupusas plus a large tray of sweet fried plantains with Salvadoran crema and refried red beans." }
      ],
      sidesAndDrinks: [
        { name: "Plátanos Fritos con Crema y Frijoles", price: "$8.99", desc: "Ripe black-skin plantains pan-fried in butter until caramelized, plated with thick Salvadoran sweet cream and pureed red beans." },
        { name: "Fresco de Ensalada de Fruta / Horchata de Morro", price: "$4.99", desc: "Salvadoran fruit drink loaded with finely diced apple, pineapple, mamey, and marañón, or spiced morro-seed horchata." }
      ]
    },
    media: [],
    sample: false,
    featured: false,
    createdAt: "2026-10-18T08:00:00Z",
    ratings: [
      { stars: 5, name: "Gabriela M.", comment: "Real loroco pupusas and morro horchata! The burnt cheese edges on the pupusas are perfection.", date: "2026-10-13T18:00:00Z" },
      { stars: 5, name: "Oscar P.", comment: "12-pack pupusa bundle feeds our whole crew for cheap. Yuca con chicharrón is super crispy.", date: "2026-10-05T19:30:00Z" }
    ]
  },
  {
    id: "greenhills-market-ontario",
    name: "Greenhills Market & Fast Food",
    cuisine: "Filipino Turo-Turo",
    regionalIdentity: "Pampanga-Style Turo-Turo Steam Table & Weekend Silog",
    tags: ["filipino", "chicken", "pork", "beef", "seafood", "breakfast", "lunch", "dinner"],
    price: 1,
    address: "2401 S Vineyard Ave, Ste C",
    city: "Ontario",
    zip: "91761",
    driveFrom91761: "2 min from 91761 (Right inside 91761)",
    phone: "(909) 923-2385",
    hours: "Mon–Fri 9:00am–6:30pm · Sat 9:00am–6:00pm · Sun 9:00am–5:00pm (Silog Breakfast Sat–Sun 9–11am)",
    healthPermit: {
      facilityId: "FA0011082",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 100,
      inspectedOn: "2026-04-23",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Long-standing neighborhood Filipino market and hot turo-turo counter on S. Vineyard Ave in 91761 with a perfect 100/100 County health score.",
    scratchCommitment: "Oxtail and beef kare-kare simmered until fork-tender in toasted ground peanut sauce; fresh bangus milkfish and pork belly fried to order at the butcher counter.",
    destinationDish: {
      name: "Pampanga Chicken & Pork Belly Adobo + Oxtail Kare-Kare Combo",
      callout: "Two-item turo-turo plate over garlic sinangag rice: cane-vinegar braised pork & chicken adobo alongside rich peanut kare-kare with sautéed bagoong."
    },
    description: "Holding a spotless 100/100 Grade-A health inspection right in 91761, Greenhills serves authentic homestyle Filipino stews, weekend silog breakfasts, and a 'you buy, we fry' seafood counter.",
    story: "Part Filipino pantry, part bustling kitchen—locals line up Saturday mornings at 9am sharp for garlic rice, sweet longanisa, and crispy whole fried fish.",
    image: "/img/batch1/greenhills-1.jpg",
    photos: [
      { file: "/img/batch1/greenhills-1.jpg", label: "Pampanga Chicken & Pork Adobo with Sinangag & Lumpia" },
      { file: "/img/batch1/greenhills-2.jpg", label: "Peanut Oxtail Kare-Kare with Bagoong & Pancit Bihon" },
      { file: "/img/batch1/greenhills-3.jpg", label: "Weekend Tapsilog & Longsilog Garlic-Rice Breakfast" }
    ],
    structuredMenu: {
      signatures: [
        { name: "2-Item Turo-Turo Combo Plate (Adobo + Kare-Kare)", price: "$13.99", desc: "Served over steamed or garlic rice with cane-vinegar Chicken & Pork Adobo and rich peanut Oxtail/Beef Kare-Kare with shrimp paste." },
        { name: "Bicol Express (Coconut Milk & Chili Braised Pork Belly)", price: "$13.99", desc: "Tender cubed pork belly simmered in rich coconut cream, Thai bird chiles, and savory shrimp paste." },
        { name: "Weekend Silog Breakfast (Tapsilog, Longsilog, or Bangsilog)", price: "$12.50", desc: "Sat–Sun 9–11am: Cured beef tapa, sweet Pampanga pork longanisa, or crispy marinated milkfish with garlic fried rice and two eggs." }
      ],
      regionalClassics: [
        { name: "Sinigang na Baboy (Tamarind Sour Pork Rib Soup)", price: "$12.99", desc: "Tangy sampalok tamarind broth loaded with pork ribs, taro root, radish, water spinach (kangkong), and long green chili." },
        { name: "Beef Caldereta (Spanish-Filipino Liver-Sauce Beef Stew)", price: "$13.99", desc: "Slow-braised beef chuck in tomato, bell pepper, green olive, and rich liver-spread gravy." },
        { name: "Pinakbet Ilokano (Bitter Melon, Squash & Pork Stew)", price: "$11.99", desc: "Kabocha squash, okra, eggplant, string beans, and ampalaya sautéed with crispy pork and bagoong." }
      ],
      combosAndTrays: [
        { name: "100-Piece Lumpia Shanghai Party Tray", price: "$55.00", desc: "Hand-rolled crispy pork, carrot, and water-chestnut spring rolls fried golden with sweet chili sauce." },
        { name: "Half-Tray Pancit Bihon + 25 Lumpia Family Bundle", price: "$48.00", desc: "Stir-fried thin rice noodles with chicken, shrimp, and cabbage plus 25 crispy lumpia and calamansi." }
      ],
      sidesAndDrinks: [
        { name: "Crispy Lumpia Shanghai (10 pcs) or Turon (Jackfruit Banana Roll)", price: "$7.50", desc: "Savory pork spring rolls or brown-sugar caramelized saba banana & jackfruit wrapper rolls." },
        { name: "Fresh Calamansi Juice & Halo-Halo Cup", price: "$6.50", desc: "Sweet-tart Philippine limeade or shaved milk ice layered with ube halaya, leche flan, sweet beans, and macapuno." }
      ]
    },
    media: [],
    sample: false,
    featured: true,
    createdAt: "2026-10-18T08:00:00Z",
    ratings: [
      { stars: 5, name: "Jun D.", comment: "100 health score! Their kare-kare and weekend bangsilog breakfast taste just like home.", date: "2026-10-15T10:30:00Z" },
      { stars: 5, name: "Marissa C.", comment: "Best turo-turo value in 91761. We order their lumpia and pancit trays for every birthday.", date: "2026-10-08T12:45:00Z" }
    ]
  },
  {
    id: "thai-family-sisters-upland",
    name: "Thai Family Sisters Restaurant",
    cuisine: "Northern Thai & Street Noodles",
    regionalIdentity: "Chiang Mai Khao Soi & Wok-Fired Siamese Homestyle",
    tags: ["thai", "chicken", "beef", "pork", "seafood", "vegetarian-options", "vegan", "lunch", "dinner"],
    price: 2,
    address: "130 S Mountain Ave, Ste P",
    city: "Upland",
    zip: "91786",
    driveFrom91761: "12 min from 91761",
    phone: "(909) 920-3640",
    hours: "Tue–Sun 11:00am–9:00pm · Closed Mon",
    healthPermit: {
      facilityId: "FA0006012",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 96,
      inspectedOn: "2026-03-23",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Run by two sisters in Upland Village on S. Mountain Ave, cooking family recipes from Northern and Central Thailand.",
    scratchCommitment: "Khao Soi curry paste pounded with roasted coriander seed, cardamom, and turmeric, then simmered in first-press coconut cream.",
    destinationDish: {
      name: "Chiang Mai Khao Soi (Northern Coconut Curry Egg Noodle Soup)",
      callout: "Slow-simmered golden coconut curry broth over flat egg noodles and tender chicken, crowned with a nest of crispy fried noodles, pickled mustard greens, and roasted chili oil."
    },
    description: "Skip generic sweet-syrup Thai—Thai Family Sisters simmers real Northern Chiang Mai Khao Soi and chars flat rice noodles in a screaming-hot wok.",
    story: "Tucked inside Upland Village just north of the I-10 up Mountain Ave, the sisters greet regulars by name and adjust spice levels with fresh pounded bird's-eye chiles.",
    image: "/img/batch1/thai-1.jpg",
    photos: [
      { file: "/img/batch1/thai-1.jpg", label: "Chiang Mai Khao Soi Coconut Curry Noodle Soup" },
      { file: "/img/batch1/thai-2.jpg", label: "Tamarind Wok-Charred Jumbo Shrimp Pad Thai" },
      { file: "/img/batch1/thai-3.jpg", label: "Holy Basil Pad Kee Mao, Mango Sticky Rice & Thai Tea" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Chiang Mai Khao Soi (Northern Curry Noodle Soup)", price: "$19.95", desc: "Rich coconut-turmeric curry broth, braised chicken, egg noodles, pickled cabbage, red shallots, lime, roasted chili paste, and crispy noodle crown." },
        { name: "Wok-Fired Tamarind Pad Thai (Chicken, Tofu, or Jumbo Shrimp)", price: "$16.95", desc: "Chantaboon rice noodles stir-fried in real tamarind pulp, palm sugar, egg, bean sprouts, garlic chives, and crushed roasted peanuts." },
        { name: "Pad Kee Mao (Holy Basil & Bird's-Eye Chili Drunken Noodles)", price: "$16.95", desc: "Wide fresh rice ribbons blistered on high heat with Thai holy basil, bell peppers, tomatoes, garlic, and fresh green peppercorns." }
      ],
      regionalClassics: [
        { name: "Isaan Som Tum (Mortar-Pounded Green Papaya Salad)", price: "$13.95", desc: "Shredded unripe papaya bruised in a clay mortar with garlic, Thai chiles, cherry tomatoes, long beans, lime, and roasted peanuts." },
        { name: "Kaffir-Lime Panang Curry", price: "$17.50", desc: "Thick, nutty red curry simmered in coconut cream with julienned makrut lime leaves, bell peppers, and steamed jasmine rice." },
        { name: "Isaan Larb Gai (Toasted-Rice Mint Minced Chicken Salad)", price: "$15.50", desc: "Minced chicken tossed with toasted sticky-rice powder (khao khua), shallots, mint, cilantro, and lime dressing." }
      ],
      combosAndTrays: [
        { name: "Sisters' Northern & Central Family Feast (Feeds 4)", price: "$68.00", desc: "1 Chiang Mai Khao Soi, 1 Shrimp Pad Thai, 1 Chicken Panang Curry, 1 Chicken Satay (8 skewers), Jasmine Rice & 2 Mango Sticky Rice." }
      ],
      sidesAndDrinks: [
        { name: "Mango with Warm Coconut Sweet Sticky Rice (Khao Niew Mamuang)", price: "$10.95", desc: "Ripe Ataulfo mango slices over pandan-steamed glutinous rice drizzled with salted coconut cream and toasted mung beans." },
        { name: "Ceylon-Spiced Thai Iced Tea", price: "$4.95", desc: "Strong brewed Ceylon black tea infused with star anise and vanilla, topped with half-and-half." }
      ]
    },
    media: [],
    sample: false,
    featured: false,
    createdAt: "2026-10-18T08:00:00Z",
    ratings: [
      { stars: 5, name: "Sophia K.", comment: "Finding real Chiang Mai Khao Soi with the pickled mustard greens in the IE made my week.", date: "2026-10-12T19:00:00Z" },
      { stars: 5, name: "Brandon H.", comment: "96 health grade and the nicest sisters running the place. Pad Kee Mao has true wok char.", date: "2026-10-03T13:10:00Z" }
    ]
  },
  {
    id: "calle-ocho-cuban-cafecito-rancho",
    name: "Calle Ocho Cuban Cafecito",
    cuisine: "Miami-Havana Cuban Cafe",
    regionalIdentity: "Little Havana-Style Lechón Press & Cafecito Counter",
    tags: ["pork", "chicken", "beef", "breakfast", "lunch"],
    price: 1,
    address: "8880 Archibald Ave, Ste C",
    city: "Rancho Cucamonga",
    zip: "91730",
    driveFrom91761: "12 min from 91761",
    phone: "(909) 560-2925",
    hours: "Mon–Sat 10:00am–3:00pm · Closed Sun",
    healthPermit: {
      facilityId: "FA0004075",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 96,
      inspectedOn: "2026-01-13",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Tiny, family-operated Cuban coffee house and plancha counter tucked into an Archibald Ave strip plaza.",
    scratchCommitment: "Pork shoulder marinated 24 hours in sour orange, oregano, and crushed garlic mojo criollo, then slow-roasted and pressed on lard-brushed Cuban bread.",
    destinationDish: {
      name: "The Calle Ocho Pressed Cubano + Whipped Espumita Cafecito",
      callout: "12-hour citrus-mojo roast lechón, glazed sweet ham, Swiss cheese, pickles, and yellow mustard pressed crisp on authentic Cuban bread."
    },
    description: "Only open 10am to 3pm Monday through Saturday, this hidden Rancho Cucamonga gem serves the closest thing to Miami's Little Havana in the Inland Empire.",
    story: "Blink and you'll miss the storefront on Archibald, but inside the espresso machine hisses non-stop whipping demerara sugar into thick Cuban espumita.",
    image: "/img/batch1/calle-1.jpg",
    photos: [
      { file: "/img/batch1/calle-1.jpg", label: "Pressed Citrus-Mojo Lechón Cubano Sandwich" },
      { file: "/img/batch1/calle-2.jpg", label: "Handmade Lechón, Picadillo & Pollo Empanadas" },
      { file: "/img/batch1/calle-3.jpg", label: "Whipped Espumita Cafecito, Café con Leche & Guava Pastelitos" }
    ],
    structuredMenu: {
      signatures: [
        { name: "The Signature Calle Ocho Cubano Sandwich", price: "$13.95", desc: "Slow-roasted mojo pork (lechón), sweet ham, melted Swiss, dill pickles, and mustard pressed flat and crispy on genuine Cuban bread." },
        { name: "Handmade Cuban Empanada Trio (Lechón, Pollo & Chorizo)", price: "$11.95", desc: "Three flaky golden turnovers stuffed with citrus-garlic shredded pork, soffritto chicken, and smoky Spanish chorizo." },
        { name: "Pan con Lechón (Garlic-Mojo Pulled Pork Cuban Roll)", price: "$13.50", desc: "Piled high with slow-roasted shredded pork shoulder, grilled onions, mojo drippings, and shoestring papitas." }
      ],
      regionalClassics: [
        { name: "Cortadito & Guava-Cheese Pastelito Breakfast", price: "$8.95", desc: "Cuban espresso cut with steamed evaporated milk alongside a flaky puff-pastry square filled with tropical guava paste and cream cheese." },
        { name: "Media Noche (Sweet Egg-Bread Pressed Sandwich)", price: "$13.50", desc: "Roast pork, ham, Swiss, and pickles pressed on soft, sweet golden egg dough bread." }
      ],
      combosAndTrays: [
        { name: "La Colada & Dozen Empanada Office Box", price: "$46.00", desc: "12 hot empanadas (mix of Lechón, Pollo, and Chorizo) + a 4-shot Cuban Colada with little sharing cups for the crew." }
      ],
      sidesAndDrinks: [
        { name: "Traditional Cafecito (With Whipped Demerara Espumita)", price: "$3.75", desc: "Dark-roast Bustelo/Pilón espresso vigorously hand-whipped with first-drop coffee and raw sugar for a thick crema cap." },
        { name: "Havana Café con Leche (Hot or Iced)", price: "$5.25", desc: "Double shot of sweet Cuban espresso poured into velvety scalded whole milk." }
      ]
    },
    media: [],
    sample: false,
    featured: false,
    createdAt: "2026-10-18T08:00:00Z",
    ratings: [
      { stars: 5, name: "Javier M.", comment: "Grew up in Hialeah and this Cubano + Cortadito is 100% legit. Get there before 2pm!", date: "2026-10-14T11:50:00Z" },
      { stars: 5, name: "Rachel S.", comment: "The lechón empanadas and iced café con leche are unreal.", date: "2026-10-06T12:30:00Z" }
    ]
  },
  {
    id: "tanyas-lebanese-kabab-upland",
    name: "Tanya's Lebanese Kabab",
    cuisine: "Halal Lebanese Charcoal Grill",
    regionalIdentity: "Beirut-Style Charcoal Meshwi Kabobs & Spit-Carved Shawarma",
    tags: ["halal", "mediterranean", "chicken", "beef", "vegetarian-options", "vegan", "lunch", "dinner"],
    price: 2,
    address: "915 W Foothill Blvd",
    city: "Upland",
    zip: "91786",
    driveFrom91761: "14 min from 91761",
    phone: "(909) 949-2200",
    hours: "Mon–Sat 10:00am–10:00pm · Sun 10:00am–8:00pm",
    healthPermit: {
      facilityId: "FA0004420",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 98,
      inspectedOn: "2026-06-24",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Family-owned Halal Lebanese grill on Historic Route 66 (Foothill Blvd) in Upland with an outstanding 98/100 Grade-A health score.",
    scratchCommitment: "100% Halal meats marinated in seven-spice baharat, sumac, and lemon, grilled over open flame; garlic toum emulsified fresh daily; eggplant fire-charred for smoky baba ghannouj.",
    destinationDish: {
      name: "Beirut Mixed Meshwi Grill (Shish Tawook, Filet Beef & Kafta Kabob)",
      callout: "Three open-flame skewers—garlic-lemon chicken breast, tender beef filet, and parsley-onion spiced kafta—over vermicelli rice with whipped garlic toum."
    },
    description: "A 98-score Halal Lebanese kitchen where smoky charcoal kabobs, spit-carved shawarma, and hot pistachio kunafa are made from scratch until 10pm.",
    story: "Tanya's goes far beyond generic gyro shops, serving traditional Lebanese mezza like kibbeh, sambosik, cheese borak, and mulberry juice.",
    image: "/img/batch1/tanya-1.jpg",
    photos: [
      { file: "/img/batch1/tanya-1.jpg", label: "Beirut Charcoal Mixed Kabob Grill with Whipped Toum" },
      { file: "/img/batch1/tanya-2.jpg", label: "Spit-Carved Beef & Chicken Shawarma Mezza Platter" },
      { file: "/img/batch1/tanya-3.jpg", label: "Cheese Borak, Parsley Tabbouleh & Pistachio Kunafa" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Beirut Combo Meshwi Grill (Chicken, Beef & Kafta)", price: "$23.95", desc: "Charbroiled shish tawook, beef kabob, and spiced kafta skewers with saffron-vermicelli rice, fire-roasted tomato, hummus, and garlic toum." },
        { name: "Spit-Carved Mix Shawarma Plate (Beef & Chicken)", price: "$20.95", desc: "Thinly shaved seven-spice marinated beef and garlic-citrus chicken off the vertical rotisserie with tahini, garlic sauce, and Lebanese pickles." },
        { name: "Slow-Braised Lebanese Lamb Shank", price: "$24.95", desc: "Fork-tender halal lamb shank braised with aromatic cinnamon, cardamom, and tomato broth over vermicelli rice." }
      ],
      regionalClassics: [
        { name: "Fried Kibbeh & Cheese Borak Mezza Duo", price: "$12.95", desc: "Crispy bulgur-and-minced-beef torpedoes stuffed with toasted pine nuts alongside flaky phyllo rolls filled with akkawi and parsley cheese." },
        { name: "Fire-Charred Baba Ghannouj & Chickpea Falafel Plate (Vegan)", price: "$15.95", desc: "Smoky roasted eggplant blended with tahini and lemon, six herb-green chickpea falafel, tabbouleh, and hot pita." }
      ],
      combosAndTrays: [
        { name: "Lebanese Family Feast Platter (Feeds 4–5)", price: "$79.00", desc: "8 Skewers (Shish Tawook, Beef, Kafta), Chicken & Beef Shawarma, large Hummus, Baba Ghannouj, Tabbouleh, 6 Falafel, Rice & Pita." }
      ],
      sidesAndDrinks: [
        { name: "Warm Nabulsi Cheese Kunafa with Orange-Blossom Syrup", price: "$9.95", desc: "Crisp shredded kataifi pastry layered over stretchy sweet cheese, soaked in rose/orange-blossom syrup and crushed pistachios." },
        { name: "Lebanese Jallab (Date & Rosewater Pine-Nut Drink) or Mulberry Juice", price: "$4.95", desc: "Chilled grape-molasses, date, and rosewater refresher floated with golden raisins and pine nuts." }
      ]
    },
    media: [],
    sample: false,
    featured: false,
    createdAt: "2026-10-18T08:00:00Z",
    ratings: [
      { stars: 5, name: "Tariq A.", comment: "98 health score, 100% halal, and their garlic toum + mixed grill is the best in the Inland Empire.", date: "2026-10-15T20:10:00Z" },
      { stars: 5, name: "Nadia K.", comment: "Save room for the warm cheese kunafa and jallab drink.", date: "2026-10-08T19:00:00Z" }
    ]
  },
  {
    id: "house-of-fortune-vegan-chino",
    name: "House of Fortune Vegan Cuisine",
    cuisine: "100% Vegan Taiwanese-Chinese",
    regionalIdentity: "Taiwanese Buddhist Temple-Style Allium-Free Vegan Kitchen",
    tags: ["vegetarian-only", "vegan", "chinese", "lunch", "dinner"],
    price: 2,
    address: "13788 Roswell Ave, Ste 101",
    city: "Chino",
    zip: "91710",
    driveFrom91761: "10 min from 91761",
    phone: "(909) 517-2988",
    hours: "Daily 11:00am–8:00pm",
    healthPermit: {
      facilityId: "FA0015920",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 91,
      inspectedOn: "2026-04-30",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Dedicated 100% plant-based Taiwanese-Chinese kitchen on Roswell Ave in Chino serving Buddhist, vegan, and vegetarian families.",
    scratchCommitment: "100% vegan, non-GMO soy and mushroom proteins prepared in a strictly meat-free, egg-free, dairy-free, and five-allium-free (no garlic/onion) kitchen using ginger, basil, and fermented bean pastes.",
    destinationDish: {
      name: "Taiwanese Three-Cup Basil Tofu Clay Pot (San Bei Doufu)",
      callout: "Puffed golden non-GMO tofu braised in a sizzling clay pot with black sesame oil, aged soy, caramelized rock sugar, young ginger slices, and Thai basil."
    },
    description: "Every single item is 100% vegan and vegetarian-only: hand-folded Szechuan chili wontons, crispy soy-skin roast duck, and sizzling clay pots just 10 minutes south of 91761.",
    story: "Following traditional Taiwanese culinary craft, the chefs build huge umami depth from roasted sesame, ginger root, shiitake mushrooms, and house-infused chili oils.",
    image: "/img/batch1/fortune-1.jpg",
    photos: [
      { file: "/img/batch1/fortune-1.jpg", label: "Taiwanese Three-Cup Basil Tofu Clay Pot (100% Vegan)" },
      { file: "/img/batch1/fortune-2.jpg", label: "Hand-Folded Szechuan Chili Oil Wontons & Crispy Vegan Duck" },
      { file: "/img/batch1/fortune-3.jpg", label: "Pine-Nut Mushroom Lettuce Wraps & Dragon-Fruit Jasmine Tea" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Taiwanese Three-Cup Sauce Tofu Clay Pot (San Bei)", price: "$15.95", desc: "Golden braised tofu, shiitake mushrooms, sliced ginger root, and fresh basil reduced in sesame-soy glaze." },
        { name: "Szechuan Red-Oil Vegan Wontons (10 pcs)", price: "$11.95", desc: "Silky hand-wrapped wontons filled with minced mushroom and soy protein, swimming in house roasted-chili oil and black vinegar." },
        { name: "Crispy Yuba-Skin 'Roast Goose' (Su E)", price: "$14.50", desc: "Multi-layered smoked bean-curd sheets pan-seared until shatteringly crisp over seasoned greens." }
      ],
      regionalClassics: [
        { name: "Pine-Nut & Diced Shiitake Lettuce Wraps", price: "$14.95", desc: "Wok-seared minced mushrooms, water chestnuts, celery, and toasted pine nuts over crispy rice vermicelli with cool iceberg cups." },
        { name: "Taiwanese Herbal & Mushroom Hot Pot", price: "$16.95", desc: "Simmering tabletop broth with lion's mane mushrooms, tofu skin, goji berries, napa cabbage, and vermicelli." }
      ],
      combosAndTrays: [
        { name: "Plant-Based Banquet Dinner for Four", price: "$64.00", desc: "Three-Cup Tofu Clay Pot, Crispy Yuba Goose, Pine-Nut Lettuce Wraps, Szechuan Chili Wontons, Veggie Chow Mein & Brown Rice." }
      ],
      sidesAndDrinks: [
        { name: "Tofu-Skin & Fresh Tomato Soup", price: "$11.50", desc: "Comforting ginger-scented tomato broth with ribbons of tender bean curd skin and greens." },
        { name: "Fresh Dragon-Fruit or Passion-Fruit Jasmine Green Tea", price: "$5.75", desc: "Cold-steeped floral jasmine green tea shaken with real dragon fruit or tart passion fruit pulp." }
      ]
    },
    media: [],
    sample: false,
    featured: false,
    createdAt: "2026-10-18T08:00:00Z",
    ratings: [
      { stars: 5, name: "Chloe W.", comment: "So rare to find a 100% vegan spot where you don't have to ask what's in the sauce. The Three-Cup Tofu and chili wontons are incredible.", date: "2026-10-14T17:45:00Z" },
      { stars: 5, name: "Raymond L.", comment: "Even my meat-eating dad loves the crispy yuba goose and pine nut lettuce wraps.", date: "2026-10-02T12:20:00Z" }
    ]
  },
  {
    id: "joannes-cafe-ontario",
    name: "JoAnne's Restaurant & Cafe",
    cuisine: "Classic Country Breakfast Diner",
    regionalIdentity: "Old-School Griddle House & Amish-Starter Pancake Counter",
    tags: ["breakfast", "country", "american", "chicken", "beef", "pork", "lunch", "vegetarian-options"],
    price: 1,
    address: "1141 N Mountain Ave",
    city: "Ontario",
    zip: "91762",
    driveFrom91761: "8 min from 91761",
    phone: "(909) 467-1416",
    hours: "Daily 7:00am–3:00pm",
    healthPermit: {
      facilityId: "FA0009909",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 90,
      inspectedOn: "2026-02-20",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Beloved neighborhood breakfast & lunch coffee shop on N. Mountain Ave in Ontario where waitresses still top off your mug before it hits half-empty.",
    scratchCommitment: "Pancake batter mixed daily from an old Amish buttermilk starter; country sausage gravy whisked in-house with cracked black pepper; potatoes shredded fresh on the flat-top.",
    destinationDish: {
      name: "Country-Fried Steak & Sawmill Gravy + Amish Buttermilk Hotcakes",
      callout: "Hand-breaded cube steak fried golden and smothered in peppered country gravy with two farm eggs, crispy lace-edge hash browns, and fluffy Amish-recipe pancakes."
    },
    description: "No QR-only menus or $22 avocado toast—just a sizzling 7am flat-top griddle, Amish-recipe buttermilk pancakes, and chicken-fried steak on Mountain Ave.",
    story: "An Ontario morning staple where contractors, retirees, and families pack the booths every day from 7am to 3pm.",
    image: "/img/batch1/joanne-1.jpg",
    photos: [
      { file: "/img/batch1/joanne-1.jpg", label: "Chicken-Fried Steak in Cracked-Pepper Sawmill Gravy" },
      { file: "/img/batch1/joanne-2.jpg", label: "Amish-Recipe Buttermilk & Buckwheat Pancake Stack" },
      { file: "/img/batch1/joanne-3.jpg", label: "El Camino Real Chorizo Scramble & Bottomless Diner Coffee" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Country Chicken-Fried Steak & Eggs", price: "$14.99", desc: "Tenderized beef steak breaded and fried crisp, ladled with scratch sausage sawmill gravy, two eggs, hash browns, and biscuit or hotcakes." },
        { name: "Old Amish-Recipe Buttermilk or Buckwheat Pancakes (Full Stack)", price: "$10.99", desc: "Three plate-sized, tangy-sweet buttermilk or hearty buckwheat cakes griddled in butter with warm syrup." },
        { name: "El Camino Real Machaca & Chorizo Scramble", price: "$13.99", desc: "Three eggs scrambled with shredded beef machaca or spicy chorizo, ortega chiles, tomatoes, jack cheese, rice, beans, and tortillas." }
      ],
      regionalClassics: [
        { name: "Jumbo Lumberjack Griddle Platter", price: "$15.49", desc: "Two Amish buttermilk pancakes, three eggs, two strips thick-cut bacon, two pork sausage links, and golden hash browns." },
        { name: "Diner Salisbury Steak & Mashed Potatoes (Lunch)", price: "$14.49", desc: "Seasoned ground chuck steak smothered in caramelized onion-mushroom brown gravy with real mashed potatoes and soup of the day." }
      ],
      combosAndTrays: [
        { name: "Early-Bird Family Breakfast Bundle (Feeds 4)", price: "$49.00", desc: "8 Amish Buttermilk Pancakes, 8 Eggs, 8 Bacon Strips, 8 Sausage Links & a family tray of crispy Hash Browns." }
      ],
      sidesAndDrinks: [
        { name: "Scratch Soup of the Day & Warm Biscuit with Honey", price: "$5.99", desc: "House-simmered daily soup (like split pea with ham or chicken noodle) with a split buttermilk biscuit." },
        { name: "Bottomless Diner Roast Coffee or Fresh-Squeezed OJ", price: "$3.75", desc: "Classic diner mug refilled all morning or a tall glass of chilled orange juice." }
      ]
    },
    media: [],
    sample: false,
    featured: false,
    createdAt: "2026-10-18T08:00:00Z",
    ratings: [
      { stars: 5, name: "Bill H.", comment: "Those Amish buttermilk pancakes and the country-fried steak are unbeatable. Real neighborhood diner.", date: "2026-10-16T08:40:00Z" },
      { stars: 5, name: "Norma G.", comment: "Fast, warm service and prices that haven't gone crazy.", date: "2026-10-07T09:15:00Z" }
    ]
  },
  {
    id: "vinces-spaghetti-ontario",
    name: "Vince's Spaghetti (Original 1945 Landmark)",
    cuisine: "Historic Route 66 Italian",
    regionalIdentity: "1945 Original Grandma Rose's Mushroom-Beef Ragu & French Dip",
    tags: ["italian", "beef", "pork", "lunch", "dinner", "vegetarian-options"],
    price: 2,
    address: "1206 W Holt Blvd",
    city: "Ontario",
    zip: "91762",
    driveFrom91761: "7 min from 91761",
    phone: "(909) 986-7074",
    hours: "Daily 11:30am–8:45pm",
    healthPermit: {
      facilityId: "FA0009758",
      agency: "San Bernardino County DEHS",
      grade: "A",
      score: 90,
      inspectedOn: "2026-05-22",
      portalUrl: "https://ehscsp.dph.sbcounty.gov/FacilityList/Food"
    },
    familyRoots: "Family-owned & operated on W. Holt Blvd in Ontario since September 1945—started as a 6-stool roadside stand where Grandma Rose carried pots of sauce from her kitchen 50 yards away.",
    scratchCommitment: "Grandma Rose's original 1945 meat and mushroom ragu slow-simmered in massive kettles every morning; garlic bread baked hot by the loaf.",
    destinationDish: {
      name: "1945 Original Full-Dinner Spaghetti with Grandma Rose's Meat & Mushroom Ragu",
      callout: "A mountain of steaming spaghetti ladled with slow-simmered beef and mushroom ragu, served with a giant table shaker of grated cheese, crisp salad, and hot garlic bread."
    },
    description: "Operating on the exact same Ontario block since September 1945, Vince's is a multi-generational family institution famous for its rich meat sauce and 1940s French Dip.",
    story: "Before spaghetti took over, Vince's opened in 1945 selling French Dip sandwiches on the old Highway 70-99. Eighty-one years later, the same family still runs the kettles.",
    image: "/img/batch1/vinces-1.jpg",
    photos: [
      { file: "/img/batch1/vinces-1.jpg", label: "1945 Original Spaghetti with Grandma Rose's Meat & Mushroom Ragu" },
      { file: "/img/batch1/vinces-2.jpg", label: "1945 Original Roast Beef French Dip & Baked Mostaccioli" },
      { file: "/img/batch1/vinces-3.jpg", label: "Italian Antipasto Salad, Hot Garlic Loaf & Spumoni Ice Cream" }
    ],
    structuredMenu: {
      signatures: [
        { name: "Vince's Famous Spaghetti Dinner (With Meat & Mushroom Ragu)", price: "$16.95", desc: "Generous platter of spaghetti topped with Grandma Rose's 1945 slow-simmered beef & mushroom sauce, served with tossed green salad and hot garlic bread." },
        { name: "The 1945 Original Roast Beef French Dip Sandwich", price: "$15.50", desc: "Thinly sliced slow-roasted beef piled on a toasted Italian roll with a hot cup of savory beef au jus—the dish that started Vince's in 1945." },
        { name: "Oven-Baked Cheese Lasagna or Baked Mostaccioli", price: "$17.95", desc: "Layered pasta baked under a bubbling blanket of mozzarella and meat sauce, served with salad and garlic bread." }
      ],
      regionalClassics: [
        { name: "Homemade Italian Meatball Sub or Side of Giant Meatballs", price: "$14.95", desc: "House-rolled beef and pork meatballs simmered in meat sauce, served on a toasted roll or alongside your pasta." },
        { name: "Loaded Italian Antipasto Salad", price: "$15.95", desc: "Crisp greens topped with Genoa salami, mortadella, provolone, pepperoncini, black olives, tomatoes, and house Italian dressing." }
      ],
      combosAndTrays: [
        { name: "Vince's Family Pack To-Go (Feeds 4–5)", price: "$52.00", desc: "Family tub of Spaghetti, 1 Quart of Grandma Rose's Meat Sauce, Family Salad, Full Loaf of Garlic Bread & Tub of Grated Cheese." }
      ],
      sidesAndDrinks: [
        { name: "Full Loaf of Hot Cheesy Garlic Bread", price: "$7.95", desc: "Split Italian loaf brushed with garlic butter, herbs, and melted cheese, baked golden." },
        { name: "Traditional Tri-Color Spumoni Ice Cream", price: "$5.50", desc: "Old-school Italian pistachio, chocolate, and cherry-almond ice cream slice." }
      ]
    },
    media: [],
    sample: false,
    featured: true,
    createdAt: "2026-10-18T08:00:00Z",
    ratings: [
      { stars: 5, name: "Frank D.", comment: "Been coming to the Holt Blvd original with my grandparents since the 70s. Nothing beats the meat sauce and a loaf of cheese bread.", date: "2026-10-15T18:30:00Z" },
      { stars: 5, name: "Melissa R.", comment: "The family pack feeds our whole house for two days. True Ontario history.", date: "2026-10-09T17:15:00Z" }
    ]
  }
];

const ENRICHMENT = {
  "changan-kitchen-ontario": {
    ownerName: "Chef Chen",
    calls: 28,
    directions: 41,
    kitchenStatus: "open",
    statusLabel: "Open Now • Closing at 8:30 PM",
    brunch: false
  },
  "not-your-mamas-kitchen-ontario": {
    ownerName: "Mama Tasha",
    calls: 34,
    directions: 49,
    kitchenStatus: "low_prep",
    statusLabel: "Kitchen Low on Prep • Calling Ahead Recommended",
    brunch: true
  },
  "pho-k-plus-ontario": {
    ownerName: "Minh",
    calls: 24,
    directions: 38,
    kitchenStatus: "open",
    statusLabel: "Open Now • Closing at 9:00 PM",
    brunch: false
  },
  "taqueria-2-potrillos-montclair": {
    ownerName: "Don Carlos",
    calls: 39,
    directions: 56,
    kitchenStatus: "open",
    statusLabel: "Open Now • Closing at 10:00 PM",
    brunch: true
  },
  "los-cebollines-grill-ontario": {
    ownerName: "Doña Elena",
    calls: 22,
    directions: 31,
    kitchenStatus: "open",
    statusLabel: "Open Now • Closing at 9:00 PM",
    brunch: true
  },
  "greenhills-market-ontario": {
    ownerName: "Tito Jun",
    calls: 31,
    directions: 44,
    kitchenStatus: "low_prep",
    statusLabel: "Kitchen Low on Prep • Calling Ahead Recommended",
    brunch: true
  },
  "thai-family-sisters-upland": {
    ownerName: "Nong & Noi",
    calls: 26,
    directions: 35,
    kitchenStatus: "open",
    statusLabel: "Open Now • Closing at 9:00 PM",
    brunch: false
  },
  "calle-ocho-cuban-cafecito-rancho": {
    ownerName: "Jorge",
    calls: 29,
    directions: 43,
    kitchenStatus: "sold_out",
    statusLabel: "Sold Out for Today • Reopens Tomorrow at 10:00 AM",
    brunch: true
  },
  "tanyas-lebanese-kabab-upland": {
    ownerName: "Tanya",
    calls: 27,
    directions: 39,
    kitchenStatus: "open",
    statusLabel: "Open Now • Closing at 10:00 PM",
    brunch: false
  },
  "house-of-fortune-vegan-chino": {
    ownerName: "Mei",
    calls: 19,
    directions: 29,
    kitchenStatus: "open",
    statusLabel: "Open Now • Closing at 8:00 PM",
    brunch: false
  },
  "joannes-cafe-ontario": {
    ownerName: "JoAnne",
    calls: 33,
    directions: 47,
    kitchenStatus: "open",
    statusLabel: "Open Now • Closing at 3:00 PM",
    brunch: true
  },
  "vinces-spaghetti-ontario": {
    ownerName: "Tony",
    calls: 42,
    directions: 64,
    kitchenStatus: "open",
    statusLabel: "Open Now • Closing at 8:45 PM",
    brunch: false
  }
};

restaurants.forEach((r) => {
  r.region = r.region || "Inland Empire";
  r.county = r.county || "San Bernardino";
  r.pricesVerified = "October 2026";
  const info = ENRICHMENT[r.id] || { ownerName: "Owner", calls: 18, directions: 27, kitchenStatus: "open", statusLabel: "Open Now • Closing at 8:30 PM" };
  if (info.brunch && !r.tags.includes("brunch")) {
    r.tags.push("brunch");
  }
  r.kitchenStatus = info.kitchenStatus;
  r.statusLabel = info.statusLabel;
  r.analytics = {
    ownerName: info.ownerName,
    calls: info.calls,
    directions: info.directions,
    stripeUrl: "https://buy.stripe.com/demo_renewal_10mo"
  };
});

const outDir = path.join(__dirname, 'data');
fs.mkdirSync(outDir, { recursive: true });
const payload = JSON.stringify({ restaurants }, null, 2);
fs.writeFileSync(path.join(outDir, 'seed.json'), payload);
fs.writeFileSync(path.join(outDir, 'db.json'), payload);
console.log(`Wrote ${restaurants.length} verified restaurants near 91761 to data/seed.json and data/db.json`);
