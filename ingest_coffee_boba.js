const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. Tag Calle Ocho with 'coffee' and 'coffee_boba'
const calle = dbData.restaurants.find(r => r.id === 'calle-ocho-cuban-cafecito-rancho');
if (calle) {
  if (!calle.tags.includes('coffee')) calle.tags.push('coffee');
  if (!calle.tags.includes('coffee_boba')) calle.tags.push('coffee_boba');
  if (!calle.meal_types.includes('coffee')) calle.meal_types.push('coffee');
  if (!calle.meal_types.includes('coffee_boba')) calle.meal_types.push('coffee_boba');
  console.log('Updated Calle Ocho tags:', calle.tags);
}

// 2. Tag Some Crust Bakery with 'coffee' and 'coffee_boba'
const someCrust = dbData.restaurants.find(r => r.id === 'some-crust-bakery-claremont-village');
if (someCrust) {
  if (!someCrust.tags.includes('coffee')) someCrust.tags.push('coffee');
  if (!someCrust.tags.includes('coffee_boba')) someCrust.tags.push('coffee_boba');
  if (!someCrust.meal_types) someCrust.meal_types = ['breakfast', 'brunch', 'lunch'];
  if (!someCrust.meal_types.includes('coffee')) someCrust.meal_types.push('coffee');
  if (!someCrust.meal_types.includes('coffee_boba')) someCrust.meal_types.push('coffee_boba');
  console.log('Updated Some Crust Bakery tags:', someCrust.tags);
}

// 3. Ingest top_vetted_coffee_boba
const newRoster = require('./top_vetted_coffee_boba.js');
let added = 0;
let updated = 0;

for (const spot of newRoster) {
  const existingIdx = dbData.restaurants.findIndex(r => r.id === spot.id || (r.name === spot.name && r.city === spot.city));
  if (existingIdx >= 0) {
    dbData.restaurants[existingIdx] = { ...dbData.restaurants[existingIdx], ...spot };
    updated++;
  } else {
    dbData.restaurants.push(spot);
    added++;
  }
}

console.log(`Added: ${added}, Updated: ${updated}, Total restaurants: ${dbData.restaurants.length}`);

// Write back to db.json
fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');

// Build seed-data.js and dist if needed
const seedPath = path.join(__dirname, 'public', 'seed-data.js');
fs.writeFileSync(seedPath, 'window.__SEED_RESTAURANTS__ = ' + JSON.stringify(dbData.restaurants) + ';\n', 'utf8');
console.log('Successfully updated db.json and seed-data.js!');
