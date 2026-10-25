const fs = require('fs');
const path = require('path');

let cachedRestaurants = null;

function getRestaurants() {
  if (cachedRestaurants) return cachedRestaurants;
  const seedPath = path.join(process.cwd(), 'data', 'seed.json');
  const raw = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  const list = Array.isArray(raw.restaurants) ? raw.restaurants : [];
  cachedRestaurants = list
    .filter((r) => r && r.is_active !== false)
    .map((r) => {
      const copy = { ...r };
      delete copy.slow_day_active;
      delete copy.discount_code;
      delete copy.perk_banner;
      return copy;
    });
  return cachedRestaurants;
}

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  if (req.method === 'GET') {
    return res.status(200).send(JSON.stringify(getRestaurants()));
  }
  if (req.method === 'POST') {
    return res.status(200).send(JSON.stringify({ ok: true }));
  }
  return res.status(405).send(JSON.stringify({ error: 'Method not allowed' }));
};
