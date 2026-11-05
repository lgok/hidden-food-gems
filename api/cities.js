const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const seedPath = path.join(process.cwd(), 'data', 'seed.json');
  const raw = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  const restaurants = Array.isArray(raw.restaurants) ? raw.restaurants : [];
  const mealFilter = String(req.query.meal || '').toLowerCase();
  const counts = new Map();

  for (const r of restaurants) {
    if (r.is_active === false || !r.city) continue;
    if (mealFilter) {
      const meals = Array.isArray(r.meal_types) ? r.meal_types : (Array.isArray(r.meals) ? r.meals : []);
      if (mealFilter === 'breakfast') {
        const openMin = typeof r.opening_hour_minutes === 'number' ? r.opening_hour_minutes : 660;
        if (!meals.includes('breakfast') || r.serves_breakfast === false || openMin >= 600) continue;
      } else if (mealFilter !== 'open_now' && !meals.includes(mealFilter)) {
        continue;
      }
    }
    counts.set(r.city, (counts.get(r.city) || 0) + 1);
  }

  const result = [...counts.entries()]
    .filter(([, spot_count]) => spot_count > 0)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([city, spot_count]) => ({ city, spot_count }));

  return res.status(200).send(JSON.stringify(result));
};
