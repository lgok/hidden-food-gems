const fs = require('fs');
const path = require('path');

const BUNDLED_ASSETS = [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'styles.css'),
    path.join(__dirname, 'seed-data.js'),
    path.join(__dirname, 'gems-client.js'),
    path.join(__dirname, 'icon.svg'),
    path.join(__dirname, 'manifest.webmanifest'),
    path.join(__dirname, 'business-card.html'),
    path.join(__dirname, 'img/addis-table.jpg'),
    path.join(__dirname, 'img/cluck-co.jpg'),
    path.join(__dirname, 'img/golden-wok.jpg'),
    path.join(__dirname, 'img/hero.jpg'),
    path.join(__dirname, 'img/island-breeze.jpg'),
    path.join(__dirname, 'img/mama-lupe.jpg'),
    path.join(__dirname, 'img/nonna-kitchen.jpg'),
    path.join(__dirname, 'img/pho-corner.jpg'),
    path.join(__dirname, 'img/smokehouse-sally.jpg'),
    path.join(__dirname, 'img/sunrise-griddle.jpg'),
    path.join(__dirname, 'img/taj-spice.jpg'),
    path.join(__dirname, 'img/batch1/bombay-1.jpg'),
    path.join(__dirname, 'img/batch1/bombay-2.jpg'),
    path.join(__dirname, 'img/batch1/bombay-3.jpg'),
    path.join(__dirname, 'img/batch1/calle-1.jpg'),
    path.join(__dirname, 'img/batch1/calle-2.jpg'),
    path.join(__dirname, 'img/batch1/calle-3.jpg'),
    path.join(__dirname, 'img/batch1/catrina-1.jpg'),
    path.join(__dirname, 'img/batch1/catrina-2.jpg'),
    path.join(__dirname, 'img/batch1/catrina-3.jpg'),
    path.join(__dirname, 'img/batch1/cebollines-1.jpg'),
    path.join(__dirname, 'img/batch1/cebollines-2.jpg'),
    path.join(__dirname, 'img/batch1/cebollines-3.jpg'),
    path.join(__dirname, 'img/batch1/changan-1.jpg'),
    path.join(__dirname, 'img/batch1/changan-2.jpg'),
    path.join(__dirname, 'img/batch1/changan-3.jpg'),
    path.join(__dirname, 'img/batch1/fortune-1.jpg'),
    path.join(__dirname, 'img/batch1/fortune-2.jpg'),
    path.join(__dirname, 'img/batch1/fortune-3.jpg'),
    path.join(__dirname, 'img/batch1/greenhills-1.jpg'),
    path.join(__dirname, 'img/batch1/greenhills-2.jpg'),
    path.join(__dirname, 'img/batch1/greenhills-3.jpg'),
    path.join(__dirname, 'img/batch1/joanne-1.jpg'),
    path.join(__dirname, 'img/batch1/joanne-2.jpg'),
    path.join(__dirname, 'img/batch1/joanne-3.jpg'),
    path.join(__dirname, 'img/batch1/nymk-1.jpg'),
    path.join(__dirname, 'img/batch1/nymk-2.jpg'),
    path.join(__dirname, 'img/batch1/nymk-3.jpg'),
    path.join(__dirname, 'img/batch1/phok-1.jpg'),
    path.join(__dirname, 'img/batch1/phok-2.jpg'),
    path.join(__dirname, 'img/batch1/phok-3.jpg'),
    path.join(__dirname, 'img/batch1/potrillos-1.jpg'),
    path.join(__dirname, 'img/batch1/potrillos-2.jpg'),
    path.join(__dirname, 'img/batch1/potrillos-3.jpg'),
    path.join(__dirname, 'img/batch1/tanya-1.jpg'),
    path.join(__dirname, 'img/batch1/tanya-2.jpg'),
    path.join(__dirname, 'img/batch1/tanya-3.jpg'),
    path.join(__dirname, 'img/batch1/thai-1.jpg'),
    path.join(__dirname, 'img/batch1/thai-2.jpg'),
    path.join(__dirname, 'img/batch1/thai-3.jpg'),
    path.join(__dirname, 'img/batch1/vinces-1.jpg'),
    path.join(__dirname, 'img/batch1/vinces-2.jpg'),
    path.join(__dirname, 'img/batch1/vinces-3.jpg'),
    path.join(__dirname, 'img/small/addis-table.jpg'),
    path.join(__dirname, 'img/small/cluck-co.jpg'),
    path.join(__dirname, 'img/small/golden-wok.jpg'),
    path.join(__dirname, 'img/small/hero.jpg'),
    path.join(__dirname, 'img/small/island-breeze.jpg'),
    path.join(__dirname, 'img/small/mama-lupe.jpg'),
    path.join(__dirname, 'img/small/nonna-kitchen.jpg'),
    path.join(__dirname, 'img/small/pho-corner.jpg'),
    path.join(__dirname, 'img/small/smokehouse-sally.jpg'),
    path.join(__dirname, 'img/small/sunrise-griddle.jpg'),
    path.join(__dirname, 'img/small/taj-spice.jpg'),
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json'
};

module.exports = (req, res) => {
  try {
    const urlPath = (req.url || '/').split('?')[0];
    const rel = urlPath === '/' ? 'index.html' : decodeURIComponent(urlPath.replace(/^\/+/, ''));
    const candidates = [
      path.normalize(path.join(__dirname, rel)),
      path.normalize(path.join(__dirname, 'public', rel))
    ];
    for (const full of candidates) {
      if (full.startsWith(__dirname) && fs.existsSync(full) && fs.statSync(full).isFile()) {
        const ext = path.extname(full).toLowerCase();
        res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
        res.statusCode = 200;
        return res.end(fs.readFileSync(full));
      }
    }
    const indexFull = path.join(__dirname, 'index.html');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.statusCode = 200;
    return res.end(fs.readFileSync(indexFull));
  } catch (e) {
    res.statusCode = 500;
    return res.end(String(e && e.message || e));
  }
};
