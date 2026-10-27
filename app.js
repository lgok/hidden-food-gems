const http = require("http");

const INDEX_HTML = "<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\" />\n  <meta name=\"theme-color\" content=\"#1f1612\" />\n  <meta name=\"description\" content=\"HiddenFoodGem.com: discover verified independent family-run restaurants across the United States. Live menus, verified health grades, direct counter calling & turn-by-turn directions.\" />\n  <title>HiddenFoodGem.com: Verified Independent Restaurants</title>\n  <link rel=\"manifest\" href=\"/manifest.webmanifest\" />\n  <link rel=\"icon\" href=\"/icon.svg\" type=\"image/svg+xml\" />\n  <link rel=\"stylesheet\" href=\"/styles.css?v=68\" />\n  <!-- Vercel Web Analytics & Custom Events Tracking -->\n  <script defer src=\"/_vercel/insights/script.js\"></script>\n</head>\n<body>\n  <header class=\"topbar\">\n    <a href=\"#/\" class=\"brand\" aria-label=\"HiddenFoodGem.com home\">\n      <span class=\"brand-gem\">💎</span>\n      <span class=\"brand-text\">Hidden <em>Food</em> Gem<span style=\"font-size:0.72em;opacity:0.85;font-weight:700\">.com</span></span>\n    </a>\n    <div style=\"display:flex;gap:8px;align-items:center\">\n      <a href=\"#/add\" class=\"btn btn-ghost btn-sm\">📩 Contact Us</a>\n    </div>\n  </header>\n\n  <main id=\"view\"></main>\n\n  <nav class=\"bottomnav\" aria-label=\"Main\">\n    <a href=\"#/\" data-nav=\"home\"><span>🔎</span>Discover</a>\n    <a href=\"#/add\" data-nav=\"add\"><span>📩</span>Contact Us</a>\n  </nav>\n\n  <div id=\"sheet\" class=\"sheet\" hidden>\n    <div class=\"sheet-backdrop\" data-close></div>\n    <article class=\"sheet-panel\" role=\"dialog\" aria-modal=\"true\">\n      <button class=\"sheet-close\" data-close aria-label=\"Close\">✕</button>\n      <div id=\"sheet-body\"></div>\n    </article>\n  </div>\n\n  <div id=\"lightbox\" class=\"lightbox\" hidden>\n    <button class=\"sheet-close\" data-close-lightbox aria-label=\"Close\">✕</button>\n    <img id=\"lightbox-img\" alt=\"Menu\" />\n  </div>\n\n  <div id=\"toast\" class=\"toast\" role=\"status\" aria-live=\"polite\"></div>\n\n  <script src=\"/seed-data.js?v=67\"></script>\n  <script src=\"/gems-client.js?v=68\"></script>\n</body>\n</html>\n";

const handler = (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "public, max-age=0, must-revalidate"
  });
  res.end(INDEX_HTML);
};

const server = http.createServer(handler);
server.listen(process.env.PORT || 3000);

module.exports = handler;
