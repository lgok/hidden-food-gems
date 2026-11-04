const fs = require('fs');

const targets = [
  't:/antigravity/mibees/hidden-food-gems/gems-client.js',
  't:/antigravity/mibees/hidden-food-gems/public/gems-client.js'
];

targets.forEach(p => {
  let js = fs.readFileSync(p, 'utf8');
  const targetLine = 'function recordClickEvent(restaurantId, type, extra = {}) {';
  const addition = `function recordClickEvent(restaurantId, type, extra = {}) {
    try {
      if (typeof window !== 'undefined' && typeof window.va === 'function') {
        window.va('event', { name: type === 'call' ? 'restaurant_call_click' : 'restaurant_directions_click', data: { restaurantId: String(restaurantId) } });
      }
    } catch {}`;
  if (js.includes(targetLine) && !js.includes('restaurant_call_click')) {
    js = js.replace(targetLine, addition);
    fs.writeFileSync(p, js, 'utf8');
    console.log('Added event tracking to', p);
  }
});
