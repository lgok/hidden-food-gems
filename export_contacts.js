const fs = require('fs');
const raw = JSON.parse(fs.readFileSync('t:/antigravity/mibees/hidden-food-gems/data/db.json', 'utf8'));
const list = raw.restaurants;

// Generate CSV of restaurants with contact fields
const headers = ['ID', 'Restaurant Name', 'Cuisine', 'Address', 'City', 'State', 'ZIP', 'Phone', 'Health Grade', 'Estimated Email Handle (Domain / Contact)'];

const rows = list.map(r => {
  const cleanPhone = (r.phone || '').replace(/[^\d+]/g, '');
  const slug = r.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return [
    `"${r.id}"`,
    `"${(r.name || '').replace(/"/g, '""')}"`,
    `"${(r.cuisine || '').replace(/"/g, '""')}"`,
    `"${(r.address || '').replace(/"/g, '""')}"`,
    `"${(r.city || '').replace(/"/g, '""')}"`,
    `"${r.state || 'CA'}"`,
    `"${r.zip || ''}"`,
    `"${r.phone || ''}"`,
    `"${(r.healthPermit && r.healthPermit.grade) || 'A'}"`,
    `"info@${slug}.com (or contact form)"`
  ].join(',');
});

const csv = [headers.join(','), ...rows].join('\n');
fs.writeFileSync('t:/antigravity/mibees/hidden-food-gems/restaurants_contact_list.csv', csv, 'utf8');
console.log('Saved CSV with', rows.length, 'records to restaurants_contact_list.csv');
