const fs = require('fs');
const appFile = 't:\\antigravity\\mibees\\hidden-food-gems\\public\\app.js';
let app = fs.readFileSync(appFile, 'utf8');

const sIdx = app.indexOf('  const placeholderHtml = (r) =>');
const eIdx = app.indexOf('  const mediaHtml = (r,');

if (sIdx === -1 || eIdx === -1) {
  console.error('Boundaries not found');
  process.exit(1);
}

// Clean minimalist colored tile: Keep the colored gradient tile texture, remove all inside text/buttons/emojis
const replacement = `  const placeholderHtml = (r) => {
    return '<div class="ph ph-' + (hashNum(r.id) % 5) + ' ph-owner-tile"></div>';
  };

`;

app = app.substring(0, sIdx) + replacement + app.substring(eIdx);
fs.writeFileSync(appFile, app, 'utf8');
console.log('Successfully updated placeholderHtml to a clean colored tile!');
