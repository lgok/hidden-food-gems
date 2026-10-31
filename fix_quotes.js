// fix_quotes.js
const fs = require('fs');
let s = fs.readFileSync('add_vetted_listings.js', 'utf8');

// Replace erroneous trailing quotes on key names like callout": or description":
s = s.replace(/(\b[a-zA-Z0-9_]+)":\s*/g, '$1: ');

fs.writeFileSync('add_vetted_listings.js', s, 'utf8');
console.log('Fixed quotes successfully.');
