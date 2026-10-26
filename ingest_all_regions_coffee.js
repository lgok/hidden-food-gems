const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const newRoster = require('./all_regions_coffee_boba.js');
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

// Update public/seed-data.js
const publicSeedPath = path.join(__dirname, 'public', 'seed-data.js');
fs.writeFileSync(publicSeedPath, 'window.__HFG_OFFLINE_SEED__ = ' + JSON.stringify(dbData.restaurants) + ';\n', 'utf8');

// Update seed-data.js
const rootSeedPath = path.join(__dirname, 'seed-data.js');
if (fs.existsSync(rootSeedPath)) {
  fs.writeFileSync(rootSeedPath, 'window.__HFG_OFFLINE_SEED__ = ' + JSON.stringify(dbData.restaurants) + ';\n', 'utf8');
}

// Update data/seed.json
const dataSeedPath = path.join(__dirname, 'data', 'seed.json');
if (fs.existsSync(dataSeedPath)) {
  fs.writeFileSync(dataSeedPath, JSON.stringify(dbData.restaurants, null, 2), 'utf8');
}

console.log('Successfully ingested regional coffee & boba gems across all regions!');
