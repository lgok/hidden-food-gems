// feature_all_vetted_zips.js
// Sets featured: true for all vetted independent restaurants across all states and ZIP codes
// that pass all 6 pillars and have active social media presence.
// Ensures that inactive spots or mock generated entries without verified social media are NOT featured.

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'db.json');
const seedPath = path.join(__dirname, 'data', 'seed.json');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const restaurants = db.restaurants || [];

// The complete roster of verified independent restaurants with confirmed active social media
// across CA, NY, NJ, MD, DC, TX, IL, VA
const approvedFeaturedIds = new Set([
  // --- CALIFORNIA (SoCal Hubs) ---
  'bce-noodles-anaheim-packing-district',       // Anaheim 92805
  'adya-indian-anaheim-packing-district',       // Anaheim 92805
  'georgias-anaheim-packing-district',          // Anaheim 92805
  'some-crust-bakery-claremont-village',        // Claremont 91711
  'uno-tre-otto-claremont-village',             // Claremont 91711
  'the-quarter-creole-claremont-village',       // Claremont 91711
  'aruffos-italian-claremont-village',          // Claremont 91711
  'cauldron-ice-cream-haven-city',              // Rancho Cucamonga 91730
  'baba-k-haven-city-rancho',                   // Rancho Cucamonga 91730
  'shokunin-haven-city-rancho',                 // Rancho Cucamonga 91730
  'birria-los-socios-haven-city-rancho',        // Rancho Cucamonga 91730
  'the-kroft-haven-city-rancho',                // Rancho Cucamonga 91730
  'changan-kitchen-ontario',                    // Ontario 91764
  'not-your-mamas-kitchen-ontario',             // Ontario 91761
  'pho-k-plus-ontario',                         // Ontario 91764
  'taqueria-2-potrillos-montclair',             // Montclair 91763
  'los-cebollines-grill-ontario',               // Ontario 91764
  'greenhills-market-ontario',                  // Ontario 91761
  'thai-family-sisters-upland',                 // Upland 91786
  'calle-ocho-cuban-cafecito-rancho',           // Rancho Cucamonga 91730
  'tanyas-lebanese-kabab-upland',               // Upland 91786
  'house-of-fortune-vegan-chino',               // Chino 91710
  'joannes-cafe-ontario',                       // Ontario 91762
  'vinces-spaghetti-ontario',                   // Ontario 91762

  // --- NEW YORK (NY Metro & Boroughs) ---
  'ny-10001-itasteexpress',                     // New York NY 10001
  'ny-11354-whitedear',                         // Flushing NY 11354
  'ny-11105-baharigreek',                       // Astoria NY 11105
  'ny-11222-karczmapolish',                     // Brooklyn NY 11222
  'ny-11220-tacoselbronco',                     // Brooklyn NY 11220
  'ny-10003-olioepiu',                          // New York NY 10003

  // --- NEW JERSEY ---
  'nj-07105-teixeiras-newark',                  // Newark NJ 07105
  'nj-07503-fattoush-paterson',                 // Paterson NJ 07503
  'nj-07302-pratobakery',                       // Jersey City NJ 07302

  // --- ILLINOIS (Chicago Metro) ---
  'il-60608-carnitasurapan',                    // Chicago IL 60608
  'il-60616-ricobenes',                         // Chicago IL 60616
  'il-60625-noodlerice-albanypark',             // Chicago IL 60625
  'il-60608-carnitasdonpedro',                  // Chicago IL 60608

  // --- TEXAS (Austin, Dallas, Richardson) ---
  'tx-78702-micklethwait-austin',               // Austin TX 78702
  'tx-75075-jengchiflano',                      // Richardson TX 75075
  'tx-75208-taquerialaventana',                 // Dallas TX 75208 (El Si Hay)
  'tx-75006-bbqchicken-carrollton',             // Carrollton/Dallas TX 75006 (DanSungSa)

  // --- MARYLAND & VIRGINIA (Capital Region) ---
  'md-20814-bethesdabagel',                     // Bethesda MD 20814
  'md-20850-bobsshanghai',                      // Rockville MD 20850
  'va-22003-kogiyavn-annandale',                // Annandale VA 22003

  // --- WASHINGTON, DC ---
  'dc-20001-oohhsaahhssoulfood',                // Washington DC 20001
  'dc-20001-chercherethiopianres',              // Washington DC 20001
  'dc-20001-benschilibowl',                     // Washington DC 20001
  'dc-20002-ethiopicrestaurant',                // Washington DC 20002
  'dc-20002-makettocambodiantaiw',              // Washington DC 20002
  'dc-20005-bubandpopssandwichsh'               // Washington DC 20005
]);

// Apply featured flag strictly: true if in approvedFeaturedIds, false otherwise
let countFeatured = 0;
restaurants.forEach(r => {
  if (approvedFeaturedIds.has(r.id)) {
    r.featured = true;
    countFeatured++;
  } else {
    r.featured = false;
  }
});

console.log('Total approved featured restaurants across all zip codes:', countFeatured);
console.log('Total restaurants in directory:', restaurants.length);

// Save data/db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Saved to data/db.json');

// Save data/seed.json
fs.writeFileSync(seedPath, JSON.stringify(restaurants, null, 2), 'utf8');
console.log('Saved to data/seed.json');

// Save public/seed-data.js
const webSeedPath = path.join(__dirname, 'public', 'seed-data.js');
fs.writeFileSync(webSeedPath, `window.__HFG_OFFLINE_SEED__ = ${JSON.stringify(restaurants)};\n`, 'utf8');
console.log('Saved to public/seed-data.js');
