// Hidden Food Gems — local (offline) server. No npm install required.
// Run:  node server.js   then open http://localhost:5177
// On your phone (same Wi-Fi), open the "Phone" address printed at startup.

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const GEO_CACHE = new Map();

const PORT = process.env.PORT || 5177;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const UPLOAD_DIR = path.join(ROOT, 'uploads');
const DATA_DIR = path.join(ROOT, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SEED_FILE = path.join(DATA_DIR, 'seed.json');

const LIMITS = { video: 150 * 1024 * 1024, menu: 20 * 1024 * 1024, photo: 20 * 1024 * 1024 };
const ALLOWED_EXT = {
  video: ['mp4', 'mov', 'webm', 'm4v'],
  menu: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'],
  photo: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'],
};
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.heic': 'image/heic', '.heif': 'image/heif',
  '.mp4': 'video/mp4', '.m4v': 'video/mp4', '.mov': 'video/quicktime', '.webm': 'video/webm',
  '.webmanifest': 'application/manifest+json',
};

for (const d of [UPLOAD_DIR, DATA_DIR]) fs.mkdirSync(d, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.copyFileSync(SEED_FILE, DB_FILE);

const loadDb = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const saveDb = (db) => {
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
};

const send = (res, status, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};

const readBody = (req, limit) => new Promise((resolve, reject) => {
  const chunks = []; let size = 0;
  req.on('data', (c) => {
    size += c.length;
    if (size > limit) { reject(Object.assign(new Error('File too large'), { status: 413 })); req.destroy(); return; }
    chunks.push(c);
  });
  req.on('end', () => resolve(Buffer.concat(chunks)));
  req.on('error', reject);
});
const readJson = async (req) => JSON.parse((await readBody(req, 1024 * 1024)).toString('utf8') || '{}');

const clean = (v, max = 500) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max);
const slug = (s) => clean(s, 60).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'gem';

// Static files with HTTP Range support (required for iPhone video playback).
function serveFile(req, res, filePath) {
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return send(res, 404, { error: 'Not found' });
    const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    const range = req.headers.range;
    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      let start = m && m[1] ? parseInt(m[1], 10) : 0;
      let end = m && m[2] ? parseInt(m[2], 10) : stat.size - 1;
      if (m && !m[1] && m[2]) { start = stat.size - parseInt(m[2], 10); end = stat.size - 1; }
      if (start >= stat.size || end >= stat.size || start > end) {
        res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }); return res.end();
      }
      res.writeHead(206, {
        'Content-Type': type, 'Accept-Ranges': 'bytes',
        'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end - start + 1,
      });
      return fs.createReadStream(filePath, { start, end }).pipe(res);
    }
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': stat.size,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

function safeJoin(base, rel) {
  const p = path.normalize(path.join(base, decodeURIComponent(rel)));
  return p.startsWith(base) ? p : null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://local');
  const parts = url.pathname.split('/').filter(Boolean);
  try {
    // ---------- API ----------
    if (parts[0] === 'api') {
      // GET /api/restaurants
      if (req.method === 'GET' && parts[1] === 'restaurants' && parts.length === 2) {
        const activeOnly = loadDb().restaurants.filter((r) => r.is_active !== false);
        return send(res, 200, activeOnly);
      }
      // GET /api/cities — SELECT DISTINCT city, COUNT(id) AS spot_count FROM restaurants WHERE is_active = TRUE GROUP BY city HAVING COUNT(id) > 0 ORDER BY city ASC
      if (req.method === 'GET' && parts[1] === 'cities' && parts.length === 2) {
        const regionFilter = clean(url.searchParams.get('region') || '', 80);
        const mealFilter = clean(url.searchParams.get('meal') || '', 40);
        const counts = new Map();
        for (const r of loadDb().restaurants) {
          if (r.is_active === false || !r.city) continue;
          if (regionFilter && r.region !== regionFilter && r.county !== regionFilter) continue;
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
        return send(res, 200, result);
      }
      // GET /api/geocode?zip=20720 or ?q=Bowie, MD
      if (req.method === 'GET' && parts[1] === 'geocode' && parts.length === 2) {
        const rawZip = clean(url.searchParams.get('zip') || '', 10).trim();
        const rawQ = clean(url.searchParams.get('q') || '', 80).trim();
        const mZip = /^(\d{5})$/.exec(rawZip || rawQ);
        const zipKey = mZip ? mZip[1] : null;

        if (zipKey && GEO_CACHE.has(zipKey)) {
          return send(res, 200, GEO_CACHE.get(zipKey));
        }

        if (zipKey) {
          try {
            // First query Zippopotam.us
            const zippoRes = await fetch(`https://api.zippopotam.us/us/${zipKey}`);
            if (zippoRes.ok) {
              const data = await zippoRes.json();
              if (data && data.places && data.places.length > 0) {
                const place = data.places[0];
                const result = {
                  zip: zipKey,
                  city: place['place name'] || '',
                  state: place['state abbreviation'] || '',
                  stateFullName: place['state'] || '',
                  latitude: parseFloat(place.latitude),
                  longitude: parseFloat(place.longitude),
                  source: 'zippopotam'
                };
                GEO_CACHE.set(zipKey, result);
                return send(res, 200, result);
              }
            }
          } catch (e) {
            // fallback to OSM Nominatim below
          }

          try {
            // Fallback to OSM Nominatim
            const osmRes = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${zipKey}&country=US&format=json`, {
              headers: { 'User-Agent': 'HiddenFoodGemsGeocode/1.0' }
            });
            if (osmRes.ok) {
              const list = await osmRes.json();
              if (Array.isArray(list) && list.length > 0) {
                const it = list[0];
                const parts = (it.display_name || '').split(',').map((s) => s.trim());
                const result = {
                  zip: zipKey,
                  city: parts[1] || parts[0] || '',
                  state: parts[2] || '',
                  stateFullName: parts[2] || '',
                  latitude: parseFloat(it.lat),
                  longitude: parseFloat(it.lon),
                  source: 'nominatim'
                };
                GEO_CACHE.set(zipKey, result);
                return send(res, 200, result);
              }
            }
          } catch (e) {}

          return send(res, 404, { error: 'ZIP code not found' });
        }

        return send(res, 400, { error: 'Provide a 5-digit zip parameter' });
      }
      // POST /api/restaurants  (owner adds a new listing)
      if (req.method === 'POST' && parts[1] === 'restaurants' && parts.length === 2) {
        const b = await readJson(req);
        if (!clean(b.name) || !clean(b.address) || !clean(b.city)) return send(res, 400, { error: 'Name, address and city are required.' });
        const db = loadDb();
        const r = {
          id: `${slug(b.name)}-${crypto.randomBytes(3).toString('hex')}`,
          is_active: true,
          name: clean(b.name, 80), cuisine: clean(b.cuisine, 40) || 'Other',
          tags: Array.isArray(b.tags) ? b.tags.map((t) => clean(t, 30)).slice(0, 20) : [],
          price: Math.min(3, Math.max(1, parseInt(b.price, 10) || 1)),
          address: clean(b.address, 120), city: clean(b.city, 60), phone: clean(b.phone, 30),
          hours: clean(b.hours, 120), description: clean(b.description, 600), story: clean(b.story, 600),
          image: '', media: [], ratings: [], sample: false, createdAt: new Date().toISOString(),
        };
        db.restaurants.push(r); saveDb(db);
        return send(res, 201, r);
      }
      // POST /api/restaurants/:id/ratings
      if (req.method === 'POST' && parts[1] === 'restaurants' && parts[3] === 'ratings') {
        const b = await readJson(req);
        const stars = parseInt(b.stars, 10);
        if (!(stars >= 1 && stars <= 5)) return send(res, 400, { error: 'Pick 1 to 5 stars.' });
        const db = loadDb();
        const r = db.restaurants.find((x) => x.id === parts[2]);
        if (!r) return send(res, 404, { error: 'Restaurant not found' });
        const rating = { stars, name: clean(b.name, 40) || 'Anonymous', comment: clean(b.comment, 500), date: new Date().toISOString() };
        r.ratings.unshift(rating); saveDb(db);
        return send(res, 201, r);
      }
      // POST /api/restaurants/:id/track  (records call / direction clicks, cycle reset, or kitchen status)
      if (req.method === 'POST' && parts[1] === 'restaurants' && parts[3] === 'track') {
        const b = await readJson(req);
        const db = loadDb();
        const r = db.restaurants.find((x) => x.id === parts[2]);
        if (!r) return send(res, 404, { error: 'Restaurant not found' });
        if (!r.analytics) r.analytics = { ownerName: 'Owner', calls: 0, directions: 0, stripeUrl: 'https://buy.stripe.com/demo_renewal_10mo' };
        if (b.type === 'call') r.analytics.calls = (r.analytics.calls || 0) + 1;
        else if (b.type === 'direction') r.analytics.directions = (r.analytics.directions || 0) + 1;
        else if (b.type === 'reset') { r.analytics.calls = 0; r.analytics.directions = 0; }
        if (b.ownerName !== undefined) r.analytics.ownerName = clean(b.ownerName, 60);
        if (b.stripeUrl !== undefined) r.analytics.stripeUrl = clean(b.stripeUrl, 200);
        if (b.kitchenStatus) {
          r.kitchenStatus = clean(b.kitchenStatus, 30);
          if (b.statusLabel) r.statusLabel = clean(b.statusLabel, 120);
        }
        saveDb(db);
        return send(res, 200, r);
      }
      // POST /api/restaurants/:id/media?type=video|menu|photo&ext=mp4   (raw file body)
      if (req.method === 'POST' && parts[1] === 'restaurants' && parts[3] === 'media') {
        const type = url.searchParams.get('type');
        const ext = (url.searchParams.get('ext') || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!LIMITS[type]) return send(res, 400, { error: 'Unknown upload type' });
        if (!ALLOWED_EXT[type].includes(ext)) return send(res, 400, { error: `Allowed file types: ${ALLOWED_EXT[type].join(', ')}` });
        const db = loadDb();
        const r = db.restaurants.find((x) => x.id === parts[2]);
        if (!r) return send(res, 404, { error: 'Restaurant not found' });
        const buf = await readBody(req, LIMITS[type]);
        if (!buf.length) return send(res, 400, { error: 'Empty file' });
        const dir = path.join(UPLOAD_DIR, r.id);
        fs.mkdirSync(dir, { recursive: true });
        const name = `${type}-${Date.now()}.${ext}`;
        fs.writeFileSync(path.join(dir, name), buf);
        r.media.unshift({ type, file: `/uploads/${r.id}/${name}`, caption: clean(url.searchParams.get('caption'), 120), uploadedAt: new Date().toISOString() });
        if (type === 'photo' && !r.image) r.image = `/uploads/${r.id}/${name}`;
        saveDb(db);
        return send(res, 201, r);
      }
      return send(res, 404, { error: 'Unknown API route' });
    }

    // ---------- Uploaded files ----------
    if (parts[0] === 'uploads') {
      const p = safeJoin(UPLOAD_DIR, parts.slice(1).join('/'));
      return p ? serveFile(req, res, p) : send(res, 403, { error: 'Forbidden' });
    }

    // ---------- Site ----------
    const p = safeJoin(PUBLIC_DIR, url.pathname === '/' ? 'index.html' : url.pathname.slice(1));
    if (p && fs.existsSync(p) && fs.statSync(p).isFile()) return serveFile(req, res, p);
    return serveFile(req, res, path.join(PUBLIC_DIR, 'index.html'));
  } catch (e) {
    return send(res, e.status || 500, { error: e.message || 'Server error' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const lan = Object.values(os.networkInterfaces()).flat()
    .filter((i) => i && i.family === 'IPv4' && !i.internal).map((i) => i.address);
  console.log('\n  💎 Hidden Food Gems is running (offline / local only)\n');
  console.log(`  Computer: http://localhost:${PORT}`);
  lan.forEach((ip) => console.log(`  Phone:    http://${ip}:${PORT}   (same Wi-Fi)`));
  console.log('\n  Data:    data/db.json      Uploads: uploads/\n');
});
