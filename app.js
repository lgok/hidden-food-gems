const http = require('http');

const INDEX_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#1f1612" />
  <meta name="description" content="Hidden Food Gems: discover verified independent family-run restaurants across the United States. Live menus, verified health grades, direct counter calling & turn-by-turn directions." />
  <title>Hidden Food Gems: Verified Independent Restaurants</title>
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="/styles.css?v=37" />
</head>
<body>
  <header class="topbar">
    <a href="#/" class="brand" aria-label="Hidden Food Gems home">
      <span class="brand-gem">💎</span>
      <span class="brand-text">Hidden <em>Food</em> Gems</span>
    </a>
    <div style="display:flex;gap:8px;align-items:center">
      <a href="#/add" class="btn btn-ghost btn-sm">📩 Contact Us</a>
    </div>
  </header>

  <main id="view"></main>

  <nav class="bottomnav" aria-label="Main">
    <a href="#/" data-nav="home"><span>🔎</span>Discover</a>
    <a href="#/add" data-nav="add"><span>📩</span>Contact Us</a>
  </nav>

  <div id="sheet" class="sheet" hidden>
    <div class="sheet-backdrop" data-close></div>
    <article class="sheet-panel" role="dialog" aria-modal="true">
      <button class="sheet-close" data-close aria-label="Close">✕</button>
      <div id="sheet-body"></div>
    </article>
  </div>

  <div id="lightbox" class="lightbox" hidden>
    <button class="sheet-close" data-close-lightbox aria-label="Close">✕</button>
    <img id="lightbox-img" alt="Menu" />
  </div>

  <div id="toast" class="toast" role="status" aria-live="polite"></div>

  <script src="/seed-data.js?v=37"></script>
  <script src="/gems-client.js?v=37"></script>
</body>
</html>`;

const handler = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=0, must-revalidate'
  });
  res.end(INDEX_HTML);
};

const server = http.createServer(handler);
server.listen(process.env.PORT || 3000);

module.exports = handler;
