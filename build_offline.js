// Build standalone double-clickable HiddenFoodGems_Offline.html and BusinessCard_Staples_Print.html
const fs = require('fs');
const path = require('path');

const pubDir = path.join(__dirname, 'public');
const indexHtml = fs.readFileSync(path.join(pubDir, 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(pubDir, 'styles.css'), 'utf8');
const appJs = fs.readFileSync(path.join(pubDir, 'app.js'), 'utf8');
const seedRaw = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'seed.json'), 'utf8'));
const seedData = Array.isArray(seedRaw) ? seedRaw : (seedRaw.restaurants || []);

// Convert /img/... paths to ./public/img/... for file:// double-click execution
const offlineSeed = JSON.parse(JSON.stringify(seedData)).map(r => {
  if (r.image && r.image.startsWith('/img/')) {
    r.image = './public' + r.image;
  }
  if (Array.isArray(r.photos)) {
    r.photos = r.photos.map(p => ({
      ...p,
      file: p.file && p.file.startsWith('/img/') ? './public' + p.file : p.file
    }));
  }
  return r;
});

// Write public/seed-data.js for instant Vercel Edge static loading
const webSeedPath = path.join(pubDir, 'seed-data.js');
fs.writeFileSync(webSeedPath, `window.__HFG_OFFLINE_SEED__ = ${JSON.stringify(seedData)};\n`, 'utf8');

// Replace CSS/JS references and relative image paths in index.html
let outHtml = indexHtml
  .replace(/src="\/img\//g, 'src="./public/img/')
  .replace(/href="\/business-card\.html"/g, 'href="./BusinessCard_Staples_Print.html"')
  .replace(/<link rel="stylesheet" href="\/styles\.css(?:\?[^"]*)?"\s*\/?>/, `<style>\n${stylesCss}\n</style>`)
  .replace(/<script src="\/seed-data\.js(?:\?[^"]*)?"><\/script>\s*/, '')
  .replace(
    /<script src="\/app\.js(?:\?[^"]*)?"><\/script>/,
    `<script>\nwindow.__HFG_OFFLINE_SEED__ = ${JSON.stringify(offlineSeed)};\n${appJs}\n</script>`
  );

const offlinePath = path.join(__dirname, 'HiddenFoodGems_Offline.html');
fs.writeFileSync(offlinePath, outHtml, 'utf8');

const cardHtml = fs.readFileSync(path.join(pubDir, 'business-card.html'), 'utf8');
const cardOfflinePath = path.join(__dirname, 'BusinessCard_Staples_Print.html');
fs.writeFileSync(cardOfflinePath, cardHtml, 'utf8');

console.log(`Built ${offlinePath} (${Math.round(fs.statSync(offlinePath).size / 1024)} KB) and ${cardOfflinePath}`);
