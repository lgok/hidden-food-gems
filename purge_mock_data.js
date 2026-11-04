const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('Total listings before purge:', dbData.restaurants.length);

// Strictly keep only real, vetted listings that have passed human curation (featured === true)
const verifiedList = dbData.restaurants.filter(r => r.featured === true);

console.log('Total verified listings remaining after purge:', verifiedList.length);

dbData.restaurants = verifiedList;
fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');

// Update public/seed-data.js
const publicSeedPath = path.join(__dirname, 'public', 'seed-data.js');
fs.writeFileSync(publicSeedPath, 'window.__SEED_RESTAURANTS__ = ' + JSON.stringify(verifiedList) + ';\n', 'utf8');

// Update root seed-data.js if present
const rootSeedPath = path.join(__dirname, 'seed-data.js');
if (fs.existsSync(rootSeedPath)) {
  fs.writeFileSync(rootSeedPath, 'window.__SEED_RESTAURANTS__ = ' + JSON.stringify(verifiedList) + ';\n', 'utf8');
}

// Update data/seed.json if present
const dataSeedPath = path.join(__dirname, 'data', 'seed.json');
if (fs.existsSync(dataSeedPath)) {
  fs.writeFileSync(dataSeedPath, JSON.stringify(verifiedList, null, 2), 'utf8');
}

console.log('Successfully purged all mock/template listings! All database files synced.');
