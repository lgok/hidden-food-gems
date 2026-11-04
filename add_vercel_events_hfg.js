const fs = require('fs');

// Add Vercel Web Analytics script to HiddenFoodGem.com index.html
const htmlPath = 't:/antigravity/mibees/hidden-food-gems/public/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const vercelScript = '  <!-- Vercel Web Analytics & Custom Events Tracking -->\n  <script defer src="/_vercel/insights/script.js"></script>\n</head>';

if (!html.includes('/_vercel/insights/script.js')) {
  html = html.replace('</head>', vercelScript);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Added Vercel Analytics script to HiddenFoodGem.com index.html!');
}

// In gems-client.js and public/gems-client.js:
// dispatch window.va('event', { name: eventType, data: { ... } }) when someone clicks a call or direction button
const targets = [
  't:/antigravity/mibees/hidden-food-gems/gems-client.js',
  't:/antigravity/mibees/hidden-food-gems/public/gems-client.js'
];

targets.forEach(p => {
  let js = fs.readFileSync(p, 'utf8');
  const oldFunc = 'function recordClickEvent(id, type) {';
  const newSnippet = `function recordClickEvent(id, type) {
    try {
      if (typeof window !== 'undefined' && typeof window.va === 'function') {
        window.va('event', { name: type === 'call' ? 'restaurant_call_click' : 'restaurant_directions_click', data: { restaurantId: id } });
      }
    } catch {}`;
  if (js.includes(oldFunc) && !js.includes('restaurant_call_click')) {
    js = js.replace(oldFunc, newSnippet);
    fs.writeFileSync(p, js, 'utf8');
    console.log('Added Vercel custom event dispatch to', p);
  }
});
