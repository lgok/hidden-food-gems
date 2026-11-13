const fs = require("fs");
const path = require("path");
const vm = require("vm");

const publicDir = path.join(__dirname, "public");
const seedJsonPath = path.join(__dirname, "data", "seed.json");
const rawSeed = JSON.parse(fs.readFileSync(seedJsonPath, "utf8"));
const restaurants = Array.isArray(rawSeed) ? rawSeed : (rawSeed.restaurants || []);

if (!restaurants.length) {
  throw new Error("No restaurants loaded from data/seed.json");
}

// Build slimmed, minified client seed-data.js (~220 KB raw / ~55 KB Brotli instead of 936 KB)
const slimClientRestaurants = restaurants.map((r) => {
  const c = { ...r };
  delete c.weeklySchedule;
  delete c.meals;
  delete c.familyRoots;
  delete c.story;
  delete c.description;
  delete c.sample;
  delete c.isDailyFreshGem;
  delete c.addedDate;
  delete c.freshlyAdded;
  delete c.lat;
  delete c.lng;
  delete c.category;
  delete c.priceRange;
  delete c.rating;
  delete c.reviewCount;
  delete c.mustTry;
  delete c.images;
  delete c.analytics;
  delete c.destinationDish;
  delete c.socialMedia;
  delete c.driveFrom91761;
  delete c.opening_hour_minutes;
  delete c.closing_hour_minutes;
  delete c.timezone;
  if (c.healthPermit) {
    c.healthPermit = { grade: c.healthPermit.grade || "A", score: c.healthPermit.score || 98 };
  }
  if (!c.verifiedPhoto && !c.ownerVerified) {
    delete c.image;
    delete c.photos;
  }
  if (!c.media || !c.media.length) delete c.media;
  if (!c.ratings || !c.ratings.length) delete c.ratings;
  if (c.structuredMenu) {
    const items = [
      ...(c.structuredMenu.signatures || []),
      ...(c.structuredMenu.regionalClassics || []),
      ...(c.structuredMenu.sidesAndDrinks || [])
    ].slice(0, 3).map((i) => ({ name: i.name, price: i.price }));
    c.structuredMenu = { signatures: items };
  }
  return c;
});
const slimJsPayload = `window.SEED_RESTAURANTS=${JSON.stringify(slimClientRestaurants)};window.__HFG_OFFLINE_SEED__=window.SEED_RESTAURANTS;\n`;
fs.writeFileSync(path.join(publicDir, "seed-data.js"), slimJsPayload, "utf8");
fs.writeFileSync(path.join(__dirname, "seed-data.js"), slimJsPayload, "utf8");

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));

const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const haversineMiles = (lat1, lon1, lat2, lon2) => {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

const avgStars = (r) => {
  if (!r.ratings || !r.ratings.length) return 4.9;
  const sum = r.ratings.reduce((a, x) => a + (Number(x.stars) || 5), 0);
  return Number((sum / r.ratings.length).toFixed(1));
};

const getDishName = (r) => {
  if (r.destinationDish && typeof r.destinationDish === "object") {
    return r.destinationDish.name || "House Specialties";
  }
  return r.destinationDish || r.structuredMenu?.signatures?.[0]?.name || "House Specialties";
};

const getSeoLaunchInfo = (r) => {
  if (!r) return null;
  const st = r.launchStatus || (r.comingSoon ? "opening_soon" : "");
  if (st === "soft_open") {
    const label = r.launchLabel || "🔥 Soft Open Now";
    return {
      stage: "soft_open",
      priority: 4,
      label,
      titleSuffix: "Soft Opening, Menu & Hours",
      metaPrefix: `🔥 SOFT OPEN NOW (${label.replace(/^[^\w]+/, "")}): `,
      pillHtml: `<span class="pill" style="background:rgba(249,115,22,0.22);color:#fdba74;border-color:#f97316">${esc(label)}</span>`,
      cardBadgeHtml: `<span style="background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;padding:2px 9px;border-radius:999px;font-weight:800;margin-right:6px;display:inline-block">${esc(label)}</span>`,
    };
  }
  if (st === "just_opened") {
    const label = r.launchLabel || "✨ Newly Opened";
    return {
      stage: "just_opened",
      priority: 3,
      label,
      titleSuffix: "Newly Opened Menu, Hours & Location",
      metaPrefix: `✨ NEWLY OPENED (${label.replace(/^[^\w]+/, "")}): `,
      pillHtml: `<span class="pill" style="background:rgba(52,211,153,0.2);color:#6ee7b7;border-color:#10b981">${esc(label)}</span>`,
      cardBadgeHtml: `<span style="background:rgba(16,185,129,0.25);color:#6ee7b7;border:1px solid #10b981;padding:2px 9px;border-radius:999px;font-weight:800;margin-right:6px;display:inline-block">${esc(label)}</span>`,
    };
  }
  if (st === "opening_soon" || r.comingSoon) {
    const label = r.launchLabel || r.comingSoonLabel || "⏳ Opening Soon";
    return {
      stage: "opening_soon",
      priority: 2,
      label,
      titleSuffix: "Opening Soon Sneak Peek, Menu & Location",
      metaPrefix: `⏳ OPENING SOON (${label.replace(/^[^\w]+/, "")}): `,
      pillHtml: `<span class="pill" style="background:rgba(245,158,11,0.22);color:#fbbf24;border-color:#f59e0b">${esc(label)}</span>`,
      cardBadgeHtml: `<span style="background:#f59e0b;color:#1a100a;padding:2px 9px;border-radius:999px;font-weight:800;margin-right:6px;display:inline-block">${esc(label)}</span>`,
    };
  }
  return null;
};

const LGOK_CANONICAL_CITY_SLUGS = {
  ontario: "ontario",
  "rancho cucamonga": "rancho-cucamonga",
  chino: "chino",
  claremont: "claremont",
  upland: "upland",
  montclair: "montclair",
  pasadena: "pasadena",
  anaheim: "anaheim",
  irvine: "irvine",
  torrance: "torrance",
  burbank: "burbank",
  glendale: "glendale",
  "rowland heights": "diamond-bar",
  "la jolla": "san-diego",
  "san diego": "san-diego",
  "downtown los angeles": "los-angeles",
  koreatown: "los-angeles",
  "boyle heights": "los-angeles",
  "little tokyo": "los-angeles",
  "north hollywood": "los-angeles",
  "studio city": "los-angeles",
  "van nuys": "los-angeles",
};

const resolveLgokCanonicalUrl = (city, state, zip) => {
  const c = String(city || "").trim().toLowerCase();
  const s = String(state || "CA").trim().toLowerCase();
  if (s === "ca" && LGOK_CANONICAL_CITY_SLUGS[c]) {
    return `https://www.letsgetoutkids.com/city/${LGOK_CANONICAL_CITY_SLUGS[c]}`;
  }
  return `https://www.letsgetoutkids.com/?zip=${encodeURIComponent(zip)}`;
};

// Build unique City + ZIP entries
const zipMap = new Map();
for (const r of restaurants) {
  const zip = String(r.zip || "").trim();
  if (!zip) continue;
  if (!zipMap.has(zip)) {
    const slug = `${slugify(r.city)}-${slugify(r.state || "ca")}-${zip}`;
    zipMap.set(zip, {
      zip,
      city: r.city,
      state: r.state || "CA",
      region: r.region || "Southern California",
      slug,
      latitude: r.latitude,
      longitude: r.longitude,
      directGems: [],
    });
  }
  zipMap.get(zip).directGems.push(r);
}

// Sort each ZIP code's directGems so Soft Opens (#1) & Newly Opened (#2) & Opening Soon (#3) always rank at the very top of the ZIP code!
for (const entry of zipMap.values()) {
  entry.directGems.sort((a, b) => {
    const aPrio = getSeoLaunchInfo(a)?.priority || 0;
    const bPrio = getSeoLaunchInfo(b)?.priority || 0;
    if (bPrio !== aPrio) return bPrio - aPrio;
    const aSpot = a.spotlightRank || 999;
    const bSpot = b.spotlightRank || 999;
    if (aSpot !== bSpot) return aSpot - bSpot;
    return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
  });
}

const cityZipEntries = Array.from(zipMap.values()).sort((a, b) =>
  a.city.localeCompare(b.city) || a.zip.localeCompare(b.zip)
);

const gemDir = path.join(publicDir, "gem");
const citiesDir = path.join(publicDir, "cities");
fs.mkdirSync(gemDir, { recursive: true });
fs.mkdirSync(citiesDir, { recursive: true });

// Canonical origin unified to www.hiddenfoodgem.com (matches Vercel 308 redirect from apex -> www)
const baseUrl = "https://www.hiddenfoodgem.com";
const todayISO = new Date().toISOString().split("T")[0];

const ga4AndOutboundScriptHtml = `  <script async src="https://www.googletagmanager.com/gtag/js?id=G-HFG202601"></script>
  <script id="ga4-outbound-tracking">
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-HFG202601', { page_path: window.location.pathname, send_page_view: true });
    (function initHfgOutboundClickTracking() {
      if (window.__hfgOutboundBound) return;
      window.__hfgOutboundBound = true;
      document.addEventListener('click', function(e) {
        var anchor = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!anchor) return;
        var href = anchor.getAttribute('href') || anchor.href || '';
        if (!href) return;
        var isTel = href.indexOf('tel:') === 0;
        var isExternal = /^https?:\\/\\//i.test(href) &&
          href.indexOf('hiddenfoodgem.com') === -1 &&
          href.indexOf('localhost') === -1;
        if (!isTel && !isExternal) return;
        var domain = isTel ? 'tel' : '';
        if (!isTel) {
          try { domain = new URL(href).hostname.replace(/^www\\./i, ''); } catch (_) { domain = href; }
        }
        var card = anchor.closest('article, .gem-card, .hero-card, .sheet-panel, section');
        var heading = card ? card.querySelector('h1, h2, h3') : null;
        var restaurantName = (heading && heading.textContent ? heading.textContent.trim() : '') || (anchor.textContent || '').trim() || domain;
        var isMaps = href.indexOf('google.com/maps') !== -1 || href.indexOf('maps.apple.com') !== -1;
        var linkType = isTel ? 'phone_call' : (isMaps ? 'directions' : 'external_website');
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'outbound_click', {
            event_category: 'outbound',
            event_label: restaurantName + ' (' + domain + ')',
            destination_url: href,
            destination_domain: domain,
            restaurant_name: restaurantName,
            link_type: linkType,
            page_path: window.location.pathname,
            transport_type: 'beacon'
          });
        }
        if (typeof window.va === 'function') {
          window.va('event', {
            name: 'outbound_click',
            data: { domain: domain, restaurant: restaurantName, type: linkType, url: href }
          });
        }
      }, true);
    })();
  </script>`;

const seoStyles = `
  :root {
    --bg: #140f0d;
    --card: #1f1713;
    --border: rgba(245, 194, 107, 0.18);
    --gold: #f5c26b;
    --amber: #e89b3c;
    --text: #f9f3eb;
    --muted: #c2b2a3;
    --green: #34d399;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
  }
  a { color: var(--gold); text-decoration: none; }
  a:hover { text-decoration: underline; }
  .wrap { max-width: 980px; margin: 0 auto; padding: 24px 16px 64px; }
  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px; background: #1a120f; border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 20;
  }
  .brand { font-weight: 800; font-size: 1.15rem; color: var(--text); display: flex; align-items: center; gap: 8px; }
  .brand em { color: var(--gold); font-style: normal; }
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 16px; border-radius: 999px; font-weight: 700; font-size: 0.9rem;
    background: linear-gradient(135deg, var(--gold), var(--amber));
    color: #1a110b; text-decoration: none !important; border: none; cursor: pointer;
  }
  .btn-outline {
    background: rgba(245, 194, 107, 0.1);
    color: var(--gold);
    border: 1px solid rgba(245, 194, 107, 0.35);
  }
  .hero-card, .section-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.35);
  }
  .pill-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
  .pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 11px; border-radius: 999px; font-size: 0.78rem; font-weight: 700;
    background: rgba(245, 194, 107, 0.12); color: var(--gold); border: 1px solid var(--border);
  }
  .pill-green {
    background: rgba(52, 211, 153, 0.14); color: var(--green); border-color: rgba(52, 211, 153, 0.35);
  }
  h1 { font-size: clamp(1.55rem, 3.5vw, 2.25rem); margin: 8px 0 10px; line-height: 1.2; }
  h2 { font-size: 1.25rem; margin: 0 0 14px; color: var(--gold); }
  .meta-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 14px; margin: 18px 0;
  }
  .meta-box {
    background: rgba(255,255,255,0.03); border: 1px solid var(--border);
    border-radius: 12px; padding: 12px 14px;
  }
  .meta-label { font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
  .meta-val { font-weight: 700; font-size: 0.95rem; margin-top: 3px; }
  .dish-list { display: grid; gap: 10px; }
  .dish-item {
    display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
    padding: 12px 14px; border-radius: 12px; background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
  }
  .dish-price { font-weight: 800; color: var(--gold); white-space: nowrap; }
  .gem-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;
  }
  .gem-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 16px;
    padding: 18px; display: flex; flex-direction: column; justify-content: space-between;
  }
  .breadcrumb { font-size: 0.85rem; color: var(--muted); margin-bottom: 14px; }
  .cta-bar { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
  footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--border); font-size: 0.85rem; color: var(--muted); }
`;

// 1. Generate Individual Restaurant Pages (/gem/[id].html)
for (const r of restaurants) {
  const hasRealRatings = Array.isArray(r.ratings) && r.ratings.length > 0;
  const stars = hasRealRatings ? avgStars(r) : null;
  const ratingCount = hasRealRatings ? r.ratings.length : 0;
  const priceStr = "$".repeat(r.price || 2);
  const fullAddr = `${r.address}, ${r.city}, ${r.state || "CA"} ${r.zip}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${fullAddr}`)}`;
  const interactiveUrl = `/?zip=${encodeURIComponent(r.zip)}&gem=${encodeURIComponent(r.id)}`;
  const cityEntry = zipMap.get(String(r.zip).trim());
  const cityPageUrl = cityEntry ? `/cities/${cityEntry.slug}` : `/?zip=${r.zip}`;
  const lgokUrl = resolveLgokCanonicalUrl(r.city, r.state || "CA", r.zip);

  const signatures = (r.structuredMenu && r.structuredMenu.signatures) || [];
  const classics = (r.structuredMenu && r.structuredMenu.regionalClassics) || [];
  const allDishes = [...signatures, ...classics].slice(0, 6);
  const launchInfo = getSeoLaunchInfo(r);

  const rLat = Number(r.latitude ?? r.lat) || 34.05;
  const rLng = Number(r.longitude ?? r.lng) || -117.65;
  let nearbyGems = restaurants
    .filter((other) => other.id !== r.id && other.state === r.state)
    .map((other) => {
      const oLat = Number(other.latitude ?? other.lat) || 34.05;
      const oLng = Number(other.longitude ?? other.lng) || -117.65;
      const rawDist = haversineMiles(rLat, rLng, oLat, oLng);
      return {
        other,
        dist: Number.isFinite(rawDist) ? rawDist : 999,
      };
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 6);

  if (nearbyGems.length < 6) {
    const existingIds = new Set([r.id, ...nearbyGems.map((x) => x.other.id)]);
    const fallbackNationwide = restaurants
      .filter((other) => !existingIds.has(other.id))
      .map((other) => {
        const oLat = Number(other.latitude ?? other.lat) || 34.05;
        const oLng = Number(other.longitude ?? other.lng) || -117.65;
        const rawDist = haversineMiles(rLat, rLng, oLat, oLng);
        return {
          other,
          dist: Number.isFinite(rawDist) ? rawDist : 999,
        };
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 6 - nearbyGems.length);
    nearbyGems = [...nearbyGems, ...fallbackNationwide];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Restaurant",
        "@id": `${baseUrl}/gem/${r.id}#restaurant`,
        name: r.name,
        description:
          (launchInfo ? `${launchInfo.metaPrefix}` : "") +
          (r.description || `${r.name} is a verified independent ${r.cuisine} restaurant in ${r.city}, ${r.state}. Signature dish: ${getDishName(r)}.`),
        url: `${baseUrl}/gem/${r.id}`,
        telephone: r.phone || "",
        servesCuisine: r.cuisine,
        priceRange: priceStr,
        address: {
          "@type": "PostalAddress",
          streetAddress: r.address,
          addressLocality: r.city,
          addressRegion: r.state || "CA",
          postalCode: String(r.zip),
          addressCountry: "US",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: rLat,
          longitude: rLng,
        },
        openingHours: r.hours,
        ...(hasRealRatings
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: stars,
                reviewCount: ratingCount,
                bestRating: 5,
                worstRating: 1,
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "HiddenFoodGem.com",
            item: `${baseUrl}/`,
          },
          ...(launchInfo
            ? [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Soft Openings & New Restaurants",
                  item: `${baseUrl}/new-openings`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: `${r.city}, ${r.state || "CA"} (${r.zip})`,
                  item: `${baseUrl}${cityPageUrl}`,
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: r.name,
                  item: `${baseUrl}/gem/${r.id}`,
                },
              ]
            : [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: `${r.city}, ${r.state || "CA"} (${r.zip})`,
                  item: `${baseUrl}${cityPageUrl}`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: r.name,
                  item: `${baseUrl}/gem/${r.id}`,
                },
              ]),
        ],
      },
    ],
  };

  const title = launchInfo
    ? `${r.name} (${r.city}, ${r.state || "CA"} ${r.zip}) — ${launchInfo.titleSuffix} | HiddenFoodGem.com`
    : `${r.name} (${r.city}, ${r.state || "CA"} ${r.zip}) — Menu, Hours & Health Grade | HiddenFoodGem.com`;
  const metaDesc = `${launchInfo ? launchInfo.metaPrefix : ""}Verified Hidden Food Gem in ${r.city}, ${r.state || "CA"} (${r.zip}): ${r.name} (${r.cuisine}). Must-try: ${getDishName(r)}. Hours: ${r.hours}. Address: ${fullAddr}.${r.phone ? ` Call counter directly: ${r.phone}.` : ""}`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(metaDesc)}" />
  <link rel="canonical" href="${baseUrl}/gem/${esc(r.id)}" />
  <meta property="og:type" content="restaurant.restaurant" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(metaDesc)}" />
  <meta property="og:url" content="${baseUrl}/gem/${esc(r.id)}" />
  <meta property="og:site_name" content="HiddenFoodGem.com" />
  <meta property="og:image" content="${baseUrl}/img/inland_empire_food_gems_poster.jpg" />
  <meta property="og:image:width" content="1080" />
  <meta property="og:image:height" content="1350" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${baseUrl}/img/inland_empire_food_gems_poster.jpg" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(metaDesc)}" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
${ga4AndOutboundScriptHtml}
  <script defer src="/_vercel/insights/script.js"></script>
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <style>${seoStyles}</style>
</head>
<body>
  <header class="topbar">
    <a href="/" class="brand"><span>💎</span><span>Hidden <em>Food</em> Gem.com</span></a>
    <div style="display:flex;gap:8px;align-items:center">
      <a href="${esc(interactiveUrl)}" class="btn">🔎 Open Live View (${esc(r.zip)})</a>
    </div>
  </header>

  <main class="wrap">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a> › ${launchInfo ? `<a href="/new-openings">🔥 Soft Opens &amp; New</a> › ` : ""}<a href="${esc(cityPageUrl)}">${esc(r.city)}, ${esc(r.state || "CA")} (${esc(r.zip)})</a> › <span>${esc(r.name)}</span>
    </nav>

    <article class="hero-card">
      <div class="pill-row">
        <span class="pill">💎 Verified Independent Gem</span>
        ${launchInfo ? launchInfo.pillHtml : ""}
        <span class="pill">${esc(r.cuisine)} · ${esc(priceStr)}</span>
        ${r.healthPermit ? `<span class="pill pill-green">✓ Official Grade ${esc(r.healthPermit.grade || "A")} (${esc(r.healthPermit.score || 98)}/100)</span>` : ""}
        ${hasRealRatings ? `<span class="pill">★ ${stars} (${ratingCount} local ratings)</span>` : `<span class="pill">✓ 100% Independent Family-Run</span>`}
      </div>

      <h1>${esc(r.name)}</h1>
      <p style="font-size:1.05rem;color:var(--muted);margin:0 0 14px">${esc(r.regionalIdentity || r.cuisine)} — ${esc(r.city)}, ${esc(r.state || "CA")} ${esc(r.zip)}</p>
      <p>${esc(r.description || "")}</p>
      ${r.story ? `<p style="color:var(--muted);font-size:0.95rem">${esc(r.story)}</p>` : ""}

      <div class="meta-grid">
        <div class="meta-box">
          <div class="meta-label">📍 Verified Street Address</div>
          <div class="meta-val">${esc(fullAddr)}</div>
        </div>
        <div class="meta-box">
          <div class="meta-label">🕒 Verified Operating Hours</div>
          <div class="meta-val">${esc(r.hours)}</div>
        </div>
        <div class="meta-box">
          <div class="meta-label">📞 Direct Counter Phone (Zero App Markup)</div>
          <div class="meta-val"><a href="tel:${esc((r.phone || "").replace(/[^0-9+]/g, ""))}">${esc(r.phone || "See venue")}</a></div>
        </div>
        <div class="meta-box">
          <div class="meta-label">🔥 Destination Signature Dish</div>
          <div class="meta-val">${esc(getDishName(r))}</div>
        </div>
      </div>

      <div class="cta-bar">
        <a href="${esc(interactiveUrl)}" class="btn">💎 Launch Interactive Menu &amp; Live Clock</a>
        ${r.phone ? `<a href="tel:${esc(r.phone.replace(/[^0-9+]/g, ""))}" class="btn btn-outline">📞 Call ${esc(r.phone)}</a>` : ""}
        <a href="${esc(mapsUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">🗺️ Turn-by-Turn Directions</a>
        ${r.healthPermit && r.healthPermit.InspectorUrl ? `<a href="${esc(r.healthPermit.InspectorUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">🛡️ Verify ${esc(r.healthPermit.agency || "County")} Health Permit</a>` : ""}
      </div>
    </article>

    ${allDishes.length ? `
    <section class="section-card">
      <h2>🔥 Must-Try Signature Dishes at ${esc(r.name)}</h2>
      <div class="dish-list">
        ${allDishes.map((d) => `
          <div class="dish-item">
            <div>
              <div style="font-weight:700">${esc(d.name)}</div>
              ${d.description ? `<div style="font-size:0.88rem;color:var(--muted);margin-top:2px">${esc(d.description)}</div>` : ""}
            </div>
            ${d.price ? `<div class="dish-price">${esc(d.price)}</div>` : ""}
          </div>
        `).join("")}
      </div>
    </section>` : ""}

    ${r.familyRoots || r.scratchCommitment ? `
    <section class="section-card">
      <h2>👨‍🍳 Why Locals Love ${esc(r.name)}</h2>
      ${r.familyRoots ? `<p><strong>Family &amp; Culinary Roots:</strong> ${esc(r.familyRoots)}</p>` : ""}
      ${r.scratchCommitment ? `<p><strong>Scratch Kitchen Commitment:</strong> ${esc(r.scratchCommitment)}</p>` : ""}
    </section>` : ""}

    <section class="section-card">
      <h2>🧭 More Verified Hidden Food Gems Near ${esc(r.city)}, ${esc(r.state || "CA")}</h2>
      <div class="gem-grid">
        ${nearbyGems.map(({ other, dist }) => `
          <div class="gem-card">
            <div>
              <div style="font-size:0.78rem;color:var(--gold);font-weight:700">${esc(other.cuisine)} · ${dist.toFixed(1)} mi away</div>
              <h3 style="margin:6px 0;font-size:1.05rem"><a href="/gem/${esc(other.id)}">${esc(other.name)}</a></h3>
              <p style="font-size:0.86rem;color:var(--muted);margin:4px 0 10px">${esc(other.address)}, ${esc(other.city)}, ${esc(other.state || "CA")} ${esc(other.zip)}</p>
              <div style="font-size:0.82rem;margin-bottom:10px">🔥 <strong>Must-Try:</strong> ${esc(getDishName(other))}</div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <a href="/gem/${esc(other.id)}" class="btn btn-outline" style="padding:6px 12px;font-size:0.8rem">View Gem →</a>
              <a href="/?zip=${esc(other.zip)}&gem=${esc(other.id)}" class="btn" style="padding:6px 12px;font-size:0.8rem">Live Hours</a>
            </div>
          </div>
        `).join("")}
      </div>
    </section>

    <footer>
      <p><strong>HiddenFoodGem.com</strong> — 110+ Independent, Vetted Family-Owned Restaurants, Bakeries, Coffee Roasters &amp; Boba Shops across 65 ZIP Codes. Zero Chains. Zero Paid Ads.</p>
      <p>Planning a family outing nearby? Discover verified kid-friendly events &amp; seasonal festivals at <a href="${esc(lgokUrl)}" target="_blank" rel="noopener">LetsGetOutKids.com</a>.</p>
    </footer>
  </main>
</body>
</html>`;

  fs.writeFileSync(path.join(gemDir, `${r.id}.html`), html, "utf8");
}

// 2. Generate City/ZIP Landing Pages (/cities/[slug].html)
for (const entry of cityZipEntries) {
  const { zip, city, state, region, slug, latitude, longitude, directGems } = entry;
  const lgokUrl = resolveLgokCanonicalUrl(city, state, zip);
  const nearbyInState = restaurants
    .filter((r) => String(r.zip).trim() !== zip && (r.state || "CA") === state)
    .map((r) => ({
      r,
      dist: haversineMiles(latitude, longitude, r.latitude, r.longitude),
    }))
    .filter((x) => x.dist <= 15)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 8);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best Hidden Food Gems & Independent Restaurants in ${city}, ${state} (${zip})`,
    description: `Verified independent family-owned restaurants, coffee roasters, bakeries, and boba shops in ${city}, ${state} ${zip} (${region}).`,
    url: `${baseUrl}/cities/${slug}`,
    numberOfItems: directGems.length + nearbyInState.length,
    itemListElement: [
      ...directGems.map((r, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Restaurant",
          name: r.name,
          url: `${baseUrl}/gem/${r.id}`,
          servesCuisine: r.cuisine,
          telephone: r.phone,
          address: `${r.address}, ${r.city}, ${r.state || "CA"} ${r.zip}`,
        },
      })),
    ],
  };

  const title = `Best Hidden Food Gems in ${city}, ${state} (${zip}) — Verified Independent Restaurants | HiddenFoodGem.com`;
  const metaDesc = `Discover ${directGems.length} verified independent restaurants, bakeries, coffee roasters & boba spots in ${city}, ${state} ${zip} (${directGems.map((g) => g.name).join(", ")}). Live operating hours, signature dishes & official health grades.`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(metaDesc)}" />
  <link rel="canonical" href="${baseUrl}/cities/${esc(slug)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(metaDesc)}" />
  <meta property="og:url" content="${baseUrl}/cities/${esc(slug)}" />
  <meta property="og:site_name" content="HiddenFoodGem.com" />
  <meta property="og:image" content="${baseUrl}/img/inland_empire_food_gems_poster.jpg" />
  <meta property="og:image:width" content="1080" />
  <meta property="og:image:height" content="1350" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${baseUrl}/img/inland_empire_food_gems_poster.jpg" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
${ga4AndOutboundScriptHtml}
  <script defer src="/_vercel/insights/script.js"></script>
  <script type="application/ld+json">${JSON.stringify(itemListJsonLd)}</script>
  <style>${seoStyles}</style>
</head>
<body>
  <header class="topbar">
    <a href="/" class="brand"><span>💎</span><span>Hidden <em>Food</em> Gem.com</span></a>
    <a href="/?zip=${esc(zip)}" class="btn">🔎 Filter Map to ${esc(zip)}</a>
  </header>

  <main class="wrap">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a> › <span>${esc(region)}</span> › <span>${esc(city)}, ${esc(state)} (${esc(zip)})</span>
    </nav>

    <section class="hero-card">
      <div class="pill-row">
        <span class="pill">📍 ZIP Code ${esc(zip)}</span>
        <span class="pill">${esc(region)}</span>
        <span class="pill pill-green">✓ ${directGems.length} Verified Local Gems</span>
      </div>
      <h1>Hidden Food Gems in ${esc(city)}, ${esc(state)} (${esc(zip)})</h1>
      <p>Skip the national chains and 30% delivery app markups. Every independent restaurant, bakery, coffee roaster, and boba shop below in <strong>${esc(city)}, ${esc(state)} (${esc(zip)})</strong> is hand-vetted with verified operating hours, signature dishes, and official County Health Inspection links.</p>
      <div class="cta-bar">
        <a href="/?zip=${esc(zip)}" class="btn">💎 Open Interactive ${esc(city)} (${esc(zip)}) Finder</a>
        <a href="${esc(lgokUrl)}" target="_blank" rel="noopener" class="btn btn-outline">🎡 Family Events in ${esc(city)} (${esc(zip)}) ↗</a>
      </div>
    </section>

    <section class="section-card">
      <h2>🏆 Verified Independent Gems in ${esc(city)} (${esc(zip)})</h2>
      <div class="gem-grid">
        ${directGems.map((r) => {
          const lInfo = getSeoLaunchInfo(r);
          return `
          <article class="gem-card"${lInfo ? ` style="border-color:rgba(249,115,22,0.5);box-shadow:0 8px 24px rgba(249,115,22,0.14)"` : ""}>
            <div>
              <div style="font-size:0.78rem;color:var(--gold);font-weight:700">${lInfo ? lInfo.cardBadgeHtml : ""}${esc(r.cuisine)} · ${"$".repeat(r.price || 2)}</div>
              <h3 style="margin:6px 0;font-size:1.15rem"><a href="/gem/${esc(r.id)}">${esc(r.name)}</a></h3>
              <p style="font-size:0.86rem;color:var(--muted);margin:4px 0 8px">📍 ${esc(r.address)}, ${esc(r.city)}, ${esc(r.state || "CA")} ${esc(r.zip)}</p>
              <p style="font-size:0.84rem;color:var(--muted);margin:4px 0 8px">🕒 ${esc(r.hours)}</p>
              <p style="font-size:0.86rem;margin:6px 0 12px">🔥 <strong>Must-Try:</strong> ${esc(getDishName(r))}</p>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <a href="/gem/${esc(r.id)}" class="btn">Full Menu &amp; Details</a>
              <a href="/?zip=${esc(zip)}&gem=${esc(r.id)}" class="btn btn-outline">Live Status</a>
            </div>
          </article>
        `;
        }).join("")}
      </div>
    </section>

    ${nearbyInState.length ? `
    <section class="section-card">
      <h2>🚗 More Verified Food Gems Within 15 Miles of ${esc(city)} (${esc(zip)})</h2>
      <div class="gem-grid">
        ${nearbyInState.map(({ r, dist }) => `
          <article class="gem-card">
            <div>
              <div style="font-size:0.78rem;color:var(--gold);font-weight:700">${esc(r.cuisine)} · ${dist.toFixed(1)} mi from ${esc(zip)}</div>
              <h3 style="margin:6px 0;font-size:1.05rem"><a href="/gem/${esc(r.id)}">${esc(r.name)}</a></h3>
              <p style="font-size:0.85rem;color:var(--muted);margin:4px 0 8px">${esc(r.address)}, ${esc(r.city)}, ${esc(r.state || "CA")} ${esc(r.zip)}</p>
              <p style="font-size:0.83rem;margin:4px 0 10px">🔥 <strong>Must-Try:</strong> ${esc(getDishName(r))}</p>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <a href="/gem/${esc(r.id)}" class="btn btn-outline" style="padding:6px 12px;font-size:0.8rem">View Gem →</a>
              <a href="/cities/${esc(zipMap.get(String(r.zip).trim())?.slug || "")}" class="btn btn-outline" style="padding:6px 12px;font-size:0.8rem">${esc(r.city)} (${esc(r.zip)})</a>
            </div>
          </article>
        `).join("")}
      </div>
    </section>` : ""}

    <footer>
      <p><a href="/">← Back to All 120 Verified Gems on HiddenFoodGem.com</a> · <a href="${esc(lgokUrl)}" target="_blank" rel="noopener">🎡 Family Events in ${esc(city)}, ${esc(state)} on LetsGetOutKids.com ↗</a></p>
    </footer>
  </main>
</body>
</html>`;

  fs.writeFileSync(path.join(citiesDir, `${slug}.html`), html, "utf8");
}

// 2b. Generate public/new-openings.html (Dedicated SEO Authority Hub for Soft Openings, Newly Opened & Opening Soon)
const softOpenGems = restaurants.filter((r) => getSeoLaunchInfo(r)?.stage === "soft_open");
const justOpenedGems = restaurants.filter((r) => getSeoLaunchInfo(r)?.stage === "just_opened");
const openingSoonGems = restaurants.filter((r) => getSeoLaunchInfo(r)?.stage === "opening_soon");
const allLaunchGems = [...softOpenGems, ...justOpenedGems, ...openingSoonGems];

const renderLaunchGrid = (list) =>
  list
    .map((r) => {
      const lInfo = getSeoLaunchInfo(r);
      const cEntry = zipMap.get(String(r.zip).trim());
      const cUrl = cEntry ? `/cities/${cEntry.slug}` : `/?zip=${encodeURIComponent(r.zip)}`;
      return `
        <article class="gem-card" style="border-color:rgba(249,115,22,0.45);box-shadow:0 8px 24px rgba(0,0,0,0.35)">
          <div>
            <div style="margin-bottom:8px">${lInfo ? lInfo.cardBadgeHtml : ""}</div>
            <div style="font-size:0.78rem;color:var(--gold);font-weight:700">${esc(r.cuisine)} · ${esc(r.city)}, ${esc(r.state || "CA")} ${esc(r.zip)}</div>
            <h3 style="margin:6px 0;font-size:1.15rem"><a href="/gem/${esc(r.id)}">${esc(r.name)}</a></h3>
            <p style="font-size:0.86rem;color:var(--muted);margin:4px 0 8px">📍 ${esc(r.address)}, ${esc(r.city)}, ${esc(r.state || "CA")} ${esc(r.zip)}</p>
            <p style="font-size:0.84rem;color:var(--muted);margin:4px 0 8px">🕒 ${esc(r.hours)}</p>
            <p style="font-size:0.86rem;margin:6px 0 12px">🔥 <strong>Signature Must-Try:</strong> ${esc(getDishName(r))}</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <a href="/gem/${esc(r.id)}" class="btn">Soft Open Menu &amp; Hours</a>
            <a href="${esc(cUrl)}" class="btn btn-outline">${esc(r.city)} (${esc(r.zip)})</a>
          </div>
        </article>`;
    })
    .join("");

const newOpeningsTitle = "New Restaurant Soft Openings, Grand Openings & Coming Soon Gems (2026) | HiddenFoodGem.com";
const newOpeningsDesc = `Discover ${allLaunchGems.length} verified independent restaurant soft openings, grand openings, newly opened cafes, and coming-soon kitchens across the U.S. before they hit mainstream maps. Zero chains, 100% alcohol-free family-friendly gems.`;
const newOpeningsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Verified Independent Restaurant Soft Openings, Grand Openings & Coming Soon Gems",
  description: newOpeningsDesc,
  url: `${baseUrl}/new-openings`,
  numberOfItems: allLaunchGems.length,
  itemListElement: allLaunchGems.map((r, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    item: {
      "@type": "Restaurant",
      name: r.name,
      url: `${baseUrl}/gem/${r.id}`,
      servesCuisine: r.cuisine,
      description: `${getSeoLaunchInfo(r)?.label || "New Opening"} — ${r.description || getDishName(r)}`,
      address: `${r.address}, ${r.city}, ${r.state || "CA"} ${r.zip}`,
    },
  })),
};

const newOpeningsHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(newOpeningsTitle)}</title>
  <meta name="description" content="${esc(newOpeningsDesc)}" />
  <link rel="canonical" href="${baseUrl}/new-openings" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(newOpeningsTitle)}" />
  <meta property="og:description" content="${esc(newOpeningsDesc)}" />
  <meta property="og:url" content="${baseUrl}/new-openings" />
  <meta property="og:site_name" content="HiddenFoodGem.com" />
  <meta property="og:image" content="${baseUrl}/img/inland_empire_food_gems_poster.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(newOpeningsTitle)}" />
  <meta name="twitter:description" content="${esc(newOpeningsDesc)}" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
${ga4AndOutboundScriptHtml}
  <script defer src="/_vercel/insights/script.js"></script>
  <script type="application/ld+json">${JSON.stringify(newOpeningsJsonLd)}</script>
  <style>${seoStyles}</style>
</head>
<body>
  <header class="topbar">
    <a href="/" class="brand"><span>💎</span><span>Hidden <em>Food</em> Gem.com</span></a>
    <div style="display:flex;gap:8px;align-items:center">
      <a href="/?meal=soft_open" class="btn">🔥 Open Interactive Soft Opens Map</a>
    </div>
  </header>

  <main class="wrap">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a> › <span>🔥 New Restaurant Soft Openings, Grand Openings &amp; Coming Soon</span>
    </nav>

    <section class="hero-card">
      <div class="pill-row">
        <span class="pill" style="background:rgba(249,115,22,0.22);color:#fdba74;border-color:#f97316">🔥 ${softOpenGems.length} Soft Open Now</span>
        <span class="pill pill-green">✨ ${justOpenedGems.length} Newly Opened</span>
        <span class="pill" style="background:rgba(245,158,11,0.22);color:#fbbf24;border-color:#f59e0b">⏳ ${openingSoonGems.length} Opening Soon</span>
      </div>
      <h1>New Restaurant Soft Openings, Grand Openings &amp; Coming Soon Gems</h1>
      <p>Google Maps and Yelp often lag 3 to 8 weeks behind independent restaurant soft openings. <strong>HiddenFoodGem.com</strong> tracks verified, family-owned scratch kitchens, specialty coffeehouses, and artisanal bakeries during their <strong>Soft Opening (Days 1–14)</strong>, <strong>Newly Opened (Days 15–45)</strong>, and <strong>Opening Soon</strong> stages — 100% independent, zero corporate chains, and strictly family-friendly.</p>
      <div class="cta-bar">
        <a href="/?meal=soft_open" class="btn">🔥 View Soft Openings Tab</a>
        <a href="/?meal=opening_soon" class="btn btn-outline">🚀 View New Food &amp; Cafes Opening Soon Tab</a>
        <a href="/contact" class="btn btn-outline">📩 Submit a Soft Opening or Coming Soon Spot</a>
      </div>
    </section>

    <section class="section-card">
      <h2>🔥 Soft Open &amp; Grand Opening Right Now (Days 1–14)</h2>
      <p style="color:var(--muted);margin-top:-6px;margin-bottom:16px">Be the first in your neighborhood to support these independent kitchens and specialty coffee bars during their soft-opening week.</p>
      <div class="gem-grid">${renderLaunchGrid(softOpenGems)}</div>
    </section>

    <section class="section-card">
      <h2>✨ Newly Opened Independent Gems (Days 15–45)</h2>
      <p style="color:var(--muted);margin-top:-6px;margin-bottom:16px">Freshly opened neighborhood favorites in their first month of service.</p>
      <div class="gem-grid">${renderLaunchGrid(justOpenedGems)}</div>
    </section>

    <section class="section-card">
      <h2>⏳ Opening Soon Radar (Pre-Opening Sneak Peeks)</h2>
      <p style="color:var(--muted);margin-top:-6px;margin-bottom:16px">Upcoming independent restaurants, specialty coffee flagships, and bakeries preparing to open their doors.</p>
      <div class="gem-grid">${renderLaunchGrid(openingSoonGems)}</div>
    </section>

    <footer>
      <p><a href="/">← Back to All ${restaurants.length} Verified Gems on HiddenFoodGem.com</a> · <a href="/contact">📩 Nominate a Soft Opening in Your ZIP Code</a></p>
    </footer>
  </main>
</body>
</html>`;
fs.writeFileSync(path.join(publicDir, "new-openings.html"), newOpeningsHtml, "utf8");
fs.writeFileSync(path.join(__dirname, "new-openings.html"), newOpeningsHtml, "utf8");

// 3. Generate public/contact.html (so /contact returns HTTP 200 and renders a full Contact / Nominate / Partner page)
const contactTitle = "Contact Us & Nominate a Local Restaurant | HiddenFoodGem.com";
const contactDesc = "Contact HiddenFoodGem.com to feature your independent family-owned restaurant, bakery, coffeehouse, or boba shop, or nominate a neighborhood gem in your ZIP code.";
const contactHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(contactTitle)}</title>
  <meta name="description" content="${esc(contactDesc)}" />
  <link rel="canonical" href="${baseUrl}/contact" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(contactTitle)}" />
  <meta property="og:description" content="${esc(contactDesc)}" />
  <meta property="og:url" content="${baseUrl}/contact" />
  <meta property="og:site_name" content="HiddenFoodGem.com" />
  <meta property="og:image" content="${baseUrl}/img/inland_empire_food_gems_poster.jpg" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
${ga4AndOutboundScriptHtml}
  <script defer src="/_vercel/insights/script.js"></script>
  <style>${seoStyles}
    .form-grid { display: grid; gap: 14px; max-width: 620px; margin-top: 16px; }
    .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; }
    .form-grid label { display: block; font-size: 0.86rem; font-weight: 700; color: var(--text); margin-bottom: 6px; }
    .form-grid input, .form-grid select, .form-grid textarea {
      width: 100%; padding: 12px 14px; border-radius: 10px; background: #140f0d;
      border: 1px solid rgba(245, 194, 107, 0.35); color: var(--text); font: inherit; font-size: 0.95rem;
    }
  </style>
</head>
<body>
  <header class="topbar">
    <a href="/" class="brand"><span>💎</span><span>Hidden <em>Food</em> Gem.com</span></a>
    <div style="display:flex;gap:8px;align-items:center">
      <a href="/" class="btn btn-outline">🔎 Browse All Gems</a>
    </div>
  </header>

  <main class="wrap">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a> › <span>Contact Us &amp; Restaurant Inquiries</span>
    </nav>

    <section class="hero-card">
      <div class="pill-row">
        <span class="pill">📩 Direct Curation Team</span>
        <span class="pill pill-green">✓ 100% Independent &amp; Family-Owned Only</span>
      </div>
      <h1>Contact HiddenFoodGem.com</h1>
      <p>Own an independent restaurant, specialty coffeehouse, bakery, or boba shop? Or want us to unlock your ZIP code next? Send us a note below or email our curation team directly at <a href="mailto:letsgetoutkids@gmail.com?subject=Restaurant%20Listing%20Inquiry%20-%20HiddenFoodGem.com"><strong>letsgetoutkids@gmail.com</strong></a>.</p>

      <form class="form-grid" onsubmit="handleContactSubmit(event)">
        <div class="form-row">
          <div>
            <label for="c-name">Restaurant or Cafe Name *</label>
            <input id="c-name" name="name" required placeholder="e.g. Molinos Coffee or 'Unlock My ZIP'" />
          </div>
          <div>
            <label for="c-owner">Your Name *</label>
            <input id="c-owner" name="ownerName" required placeholder="e.g. Diana" />
          </div>
        </div>
        <div class="form-row">
          <div>
            <label for="c-email">Email Address *</label>
            <input id="c-email" name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div>
            <label for="c-phone">Phone or Instagram Handle</label>
            <input id="c-phone" name="phone" placeholder="(909) 555-0199 or @yourcafe" />
          </div>
        </div>
        <div class="form-row">
          <div>
            <label for="c-city">City, State &amp; ZIP Code *</label>
            <input id="c-city" name="city" required placeholder="e.g. Chino, CA 91710" />
          </div>
          <div>
            <label for="c-dish">Signature Dish or Seasonal Drink</label>
            <input id="c-dish" name="dish" placeholder="e.g. Iced Mazapán Latte or Birria Tacos" />
          </div>
        </div>
        <div>
          <label for="c-msg">How can we help? (Listing update, seasonal menu spotlight, video clip, or new ZIP request)</label>
          <textarea id="c-msg" name="message" rows="4" placeholder="Tell us about your signature dishes, seasonal coffee drinks, or which ZIP code you want us to add next..."></textarea>
        </div>
        <div>
          <button type="submit" class="btn" style="padding:13px 24px;font-size:1rem">📩 Send Message to Curation Team</button>
        </div>
      </form>
    </section>

    <footer>
      <p><a href="/">← Back to All Verified Gems on HiddenFoodGem.com</a> · <a href="https://www.letsgetoutkids.com" target="_blank" rel="noopener">🎡 Family Events on LetsGetOutKids.com ↗</a></p>
    </footer>
  </main>

  <script>
    function handleContactSubmit(e) {
      e.preventDefault();
      var name = document.getElementById('c-name').value || '';
      var owner = document.getElementById('c-owner').value || '';
      var email = document.getElementById('c-email').value || '';
      var phone = document.getElementById('c-phone').value || '';
      var city = document.getElementById('c-city').value || '';
      var dish = document.getElementById('c-dish').value || '';
      var msg = document.getElementById('c-msg').value || '';
      var subject = encodeURIComponent('HiddenFoodGem.com Inquiry: ' + name + ' (' + city + ')');
      var body = encodeURIComponent(
        'Hello HiddenFoodGem.com Team,\\n\\n' +
        '• Restaurant / Topic: ' + name + '\\n' +
        '• Contact Name: ' + owner + '\\n' +
        '• Email: ' + email + '\\n' +
        '• Phone / IG: ' + phone + '\\n' +
        '• City & ZIP: ' + city + '\\n' +
        (dish ? '• Signature Dish / Drink: ' + dish + '\\n' : '') +
        (msg ? '\\nDetails:\\n' + msg + '\\n' : '')
      );
      window.location.href = 'mailto:letsgetoutkids@gmail.com?subject=' + subject + '&body=' + body;
    }
  </script>
</body>
</html>`;
fs.writeFileSync(path.join(publicDir, "contact.html"), contactHtml, "utf8");
fs.writeFileSync(path.join(__dirname, "contact.html"), contactHtml, "utf8");

// 3b. Generate public/sitemap.xml & public/robots.txt (Unified on https://www.hiddenfoodgem.com)
const sitemapUrls = [
  `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${todayISO}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
  `  <url>\n    <loc>${baseUrl}/new-openings</loc>\n    <lastmod>${todayISO}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.95</priority>\n  </url>`,
  `  <url>\n    <loc>${baseUrl}/contact</loc>\n    <lastmod>${todayISO}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
  ...cityZipEntries.map(
    (c) =>
      `  <url>\n    <loc>${baseUrl}/cities/${c.slug}</loc>\n    <lastmod>${todayISO}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`
  ),
  ...restaurants.map(
    (r) =>
      `  <url>\n    <loc>${baseUrl}/gem/${r.id}</loc>\n    <lastmod>${todayISO}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>`
  ),
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf8");

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsTxt, "utf8");

// 4. Create public/llms.txt for AI Search Engines (ChatGPT, Perplexity, Claude, Gemini)
const llmsTxt = `# HiddenFoodGem.com — Verified Independent Restaurants & Soft Openings Directory
> Discover ${restaurants.length}+ verified independent, family-owned restaurants, bakeries, coffee roasters, and boba shops across ${cityZipEntries.length} ZIP codes in CA, TX, NY, NJ, MD, DC, VA, CO, TN, IL, and MI. Zero national chains. Zero alcohol. Zero paid rankings.

## Key Features
- Soft Opening & Pre-Opening Radar (${baseUrl}/new-openings): Tracks independent restaurant soft openings (Days 1–14), newly opened kitchens (Days 15–45), and coming-soon neighborhood cafes before mainstream map platforms index them.
- Every restaurant listing includes verified operating hours, direct counter phone numbers (zero delivery-app markup), signature dishes with prices verified directly with the kitchen, and official County Health Department inspection grades.
- Sister Family Events Platform: https://www.letsgetoutkids.com (Verified kid-friendly events, seasonal festivals, and upcoming family attractions).

## Featured Soft Openings & Newly Opened Gems
${allLaunchGems.map((r) => `- ${r.name} (${r.city}, ${r.state || "CA"} ${r.zip}) [${getSeoLaunchInfo(r)?.label || "New"}]: ${baseUrl}/gem/${r.id}`).join("\n")}

## Primary Entry Points
- Homepage & Interactive ZIP Finder: ${baseUrl}/
- New Restaurant Soft Openings & Coming Soon Hub: ${baseUrl}/new-openings
- Full XML Sitemap (${sitemapUrls.length} URLs): ${baseUrl}/sitemap.xml
- Featured Neighborhood Guides:
${cityZipEntries.slice(0, 30).map((c) => `  - ${c.city}, ${c.state} (${c.zip}): ${baseUrl}/cities/${c.slug}`).join("\n")}
`;
fs.writeFileSync(path.join(publicDir, "llms.txt"), llmsTxt, "utf8");

// 5. Pre-render featured listings directly inside <main id="view"> of index.html & app.js
// Feature Soft Opens, Grand Openings, and newest independent food gems right on the front page
const sortedForPrerender = [...restaurants].sort((a, b) => {
  const aSpot = a.spotlightRank || 999;
  const bSpot = b.spotlightRank || 999;
  if (aSpot !== bSpot) return aSpot - bSpot;
  const aPrio = getSeoLaunchInfo(a)?.priority || 0;
  const bPrio = getSeoLaunchInfo(b)?.priority || 0;
  if (bPrio !== aPrio) return bPrio - aPrio;
  const aDate = String(a.createdAt || '');
  const bDate = String(b.createdAt || '');
  return bDate.localeCompare(aDate);
});
const featuredPrerender = sortedForPrerender.slice(0, 24);
const prerenderCardsHtml = featuredPrerender
  .map(
    (r) => {
      const lInfo = getSeoLaunchInfo(r);
      return `
      <article style="background:#1f1713;border:1px solid rgba(245,194,107,0.18);border-radius:16px;padding:16px">
        <div style="font-size:0.76rem;color:#f5c26b;font-weight:700">${lInfo ? lInfo.cardBadgeHtml : ""}${esc(r.cuisine)} · ${esc(r.city)}, ${esc(r.state || "CA")} ${esc(r.zip)}</div>
        <h2 style="margin:6px 0;font-size:1.1rem"><a href="/gem/${esc(r.id)}" style="color:#f9f3eb;text-decoration:none">${esc(r.name)}</a></h2>
        <p style="font-size:0.85rem;color:#c2b2a3;margin:4px 0">📍 ${esc(r.address)}, ${esc(r.city)}, ${esc(r.state || "CA")} ${esc(r.zip)} · 📞 ${esc(r.phone || "")}</p>
        <p style="font-size:0.84rem;color:#c2b2a3;margin:4px 0">🕒 ${esc(r.hours)}</p>
        <p style="font-size:0.85rem;color:#f9f3eb;margin:6px 0">🔥 <strong>Must-Try:</strong> ${esc(getDishName(r))}</p>
      </article>`;
    }
  )
  .join("");

const cityLinksHtml = cityZipEntries
  .map(
    (c) =>
      `<a href="/cities/${c.slug}" style="color:#c2b2a3;font-size:0.78rem;text-decoration:none;padding:3px 8px;border:1px solid rgba(245,194,107,0.14);border-radius:999px">${esc(c.city)}, ${esc(c.state)} (${esc(c.zip)})</a>`
  )
  .join(" ");

const allGemLinksHtml = [...restaurants]
  .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
  .map(
    (r) =>
      `<a href="/gem/${esc(r.id)}" style="color:#c2b2a3;font-size:0.76rem;text-decoration:none;padding:3px 8px;border:1px solid rgba(245,194,107,0.12);border-radius:999px">${esc(r.name)} (${esc(r.city)}, ${esc(r.state || "CA")})</a>`
  )
  .join(" ");

const homeSchemaJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "HiddenFoodGem.com",
      url: `${baseUrl}/`,
      description: "Verified independent family-run restaurants, bakeries, coffee roasters, and boba shops across 73 ZIP codes with live operating hours, signature dishes, and official county health inspection badges.",
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/?zip={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "ItemList",
      name: "Featured Verified Independent Restaurants on HiddenFoodGem.com",
      numberOfItems: featuredPrerender.length,
      itemListElement: featuredPrerender.map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${baseUrl}/gem/${r.id}`,
        name: `${r.name} (${r.city}, ${r.state || "CA"} ${r.zip})`,
      })),
    },
  ],
};

const indexHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#1f1612" />
  <meta name="description" content="HiddenFoodGem.com: discover 155+ verified independent family-run restaurants, bakeries, coffee roasters &amp; boba shops across 73 ZIP codes. Live operating hours, verified county health grades, signature dishes &amp; direct counter calling." />
  <title>HiddenFoodGem.com: Verified Independent Restaurants, Bakeries, Coffee &amp; Boba</title>
  <link rel="canonical" href="${baseUrl}/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="HiddenFoodGem.com — Verified Independent Restaurants, Coffee &amp; Boba" />
  <meta property="og:description" content="Skip national chains and 30% delivery app fees. Explore 155+ hand-vetted family-owned restaurants with live hours, signature dishes, and official County Health grades." />
  <meta property="og:url" content="${baseUrl}/" />
  <meta property="og:site_name" content="HiddenFoodGem.com" />
  <meta property="og:image" content="${baseUrl}/img/inland_empire_food_gems_poster.jpg" />
  <meta property="og:image:width" content="1080" />
  <meta property="og:image:height" content="1350" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${baseUrl}/img/inland_empire_food_gems_poster.jpg" />
  <meta name="twitter:title" content="HiddenFoodGem.com — Verified Independent Restaurants" />
  <meta name="twitter:description" content="Discover 155+ verified independent family-run restaurants across 73 ZIP codes with live operating hours &amp; official health inspection grades." />
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="/styles.css?v=106" />
  <script type="application/ld+json">${JSON.stringify(homeSchemaJsonLd)}</script>
${ga4AndOutboundScriptHtml}
  <script defer src="/_vercel/insights/script.js"></script>
</head>
<body>
  <header class="topbar">
    <a href="#/" class="brand" aria-label="HiddenFoodGem.com home">
      <span class="brand-gem">💎</span>
      <span class="brand-text">Hidden <em>Food</em> Gem<span style="font-size:0.72em;opacity:0.85;font-weight:700">.com</span></span>
    </a>
    <div style="display:flex;gap:8px;align-items:center">
      <a href="/new-openings" class="btn btn-ghost btn-sm" title="New Restaurant Soft Openings, Grand Openings &amp; Coming Soon">🔥 Soft Opens</a>
      <a href="https://www.letsgetoutkids.com" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" title="Verified Family Events &amp; Activities">🎡 Family Events</a>
      <a href="/contact" onclick="if(window.location.pathname==='/'){location.hash='#/add';return false;}" class="btn btn-ghost btn-sm">📩 Contact Us</a>
    </div>
  </header>

  <main id="view">
    <section style="max-width:1200px;margin:0 auto;padding:24px 16px">
      <h1 style="font-size:1.8rem;margin:0 0 8px">Verified Independent Family-Run Restaurants, Soft Openings, Bakeries, Coffee &amp; Boba</h1>
      <p style="color:#c2b2a3;margin:0 0 18px">Explore ${restaurants.length}+ hand-vetted independent neighborhood gems across ${cityZipEntries.length} ZIP codes — featuring exclusive <a href="/new-openings" style="color:#f5c26b;font-weight:700">Soft Openings &amp; Grand Openings</a>, live operating hours, kitchen-verified signature dish prices, and official County Health inspection grades.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">${prerenderCardsHtml}</div>
    </section>
  </main>

  <footer style="max-width:1200px;margin:40px auto 30px;padding:24px 16px;border-top:1px solid rgba(245,194,107,0.18);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;color:#c2b2a3;font-size:0.86rem">
    <div style="display:flex;align-items:center;gap:8px">
      <span style="font-size:1.1rem">💎</span>
      <span><strong>Hidden Food Gem</strong> · 100% Verified Independent Culinary Guide</span>
    </div>
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
      <a href="/new-openings" style="color:#f5c26b;text-decoration:none;font-weight:600">🔥 New &amp; Soft Openings</a>
      <a href="https://www.letsgetoutkids.com" target="_blank" rel="noopener" style="color:#f5c26b;text-decoration:none;font-weight:600">🎡 Let's Get Out, Kids!</a>
      <a href="/contact" onclick="if(window.location.pathname==='/'){location.hash='#/add';return false;}" style="color:#f5c26b;text-decoration:none;font-weight:600">📩 Partner / Contact Us</a>
    </div>
  </footer>

  <nav class="bottomnav" aria-label="Main">
    <a href="#/" data-nav="home"><span>🔎</span>Discover</a>
    <a href="/contact" onclick="if(window.location.pathname==='/'){location.hash='#/add';return false;}" data-nav="add"><span>📩</span>Contact Us</a>
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

  <script defer src="/seed-data.js?v=109"></script>
  <script defer src="/gems-client.js?v=109"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(publicDir, "index.html"), indexHtml, "utf8");
fs.writeFileSync(path.join(__dirname, "index.html"), indexHtml, "utf8");

// 6. Generate public/404.html and update app.js to serve real HTTP 404 on unknown routes
const notFoundHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>404 — Page Not Found | HiddenFoodGem.com</title>
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <style>${seoStyles}</style>
</head>
<body>
  <header class="topbar">
    <a href="/" class="brand"><span>💎</span><span>Hidden <em>Food</em> Gem.com</span></a>
    <a href="/" class="btn">🔎 Back to All Gems</a>
  </header>
  <main class="wrap" style="text-align:center;padding-top:64px">
    <section class="hero-card">
      <div style="font-size:3rem;margin-bottom:8px">🍽️</div>
      <h1>404 — Hidden Gem Not Found</h1>
      <p style="color:var(--muted);max-width:520px;margin:0 auto 20px">We couldn&apos;t find a restaurant or city guide at that address. Explore all 180+ verified independent restaurants across 79 ZIP codes below.</p>
      <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap">
        <a href="/" class="btn">💎 Explore All Verified Gems</a>
        <a href="/contact" class="btn btn-outline">📩 Contact Us / Request a ZIP</a>
        <a href="https://www.letsgetoutkids.com" class="btn btn-outline">🎡 Browse Family Events</a>
      </div>
    </section>
  </main>
</body>
</html>
`;
fs.writeFileSync(path.join(publicDir, "404.html"), notFoundHtml, "utf8");
fs.writeFileSync(path.join(__dirname, "404.html"), notFoundHtml, "utf8");

// Update app.js so "/" serves indexHtml (200), "/new-openings" serves newOpeningsHtml (200), "/contact" serves contactHtml (200) with edge caching + CSP, and any unmatched path returns HTTP 404
const appJsCode = `const http = require("http");

const INDEX_HTML = ${JSON.stringify(indexHtml)};
const NEW_OPENINGS_HTML = ${JSON.stringify(newOpeningsHtml)};
const CONTACT_HTML = ${JSON.stringify(contactHtml)};
const NOT_FOUND_HTML = ${JSON.stringify(notFoundHtml)};
const CSP_VALUE = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' data: blob:; connect-src 'self' https://api.zippopotam.us https://nominatim.openstreetmap.org https://abacus.jasoncameron.dev https://www.google-analytics.com https://analytics.google.com https://vitals.vercel-insights.com; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self' mailto:;";

const handler = (req, res) => {
  const rawUrl = req.url || "/";
  const pathname = rawUrl.split("?")[0].replace(/\\/+$/, "") || "/";
  if (pathname === "/" || pathname === "/index.html") {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": CSP_VALUE,
      "Cache-Control": "public, max-age=60, s-maxage=600, stale-while-revalidate=86400"
    });
    res.end(INDEX_HTML);
    return;
  }
  if (pathname === "/new-openings" || pathname === "/new-openings.html") {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": CSP_VALUE,
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
    });
    res.end(NEW_OPENINGS_HTML);
    return;
  }
  if (pathname === "/contact" || pathname === "/contact.html") {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": CSP_VALUE,
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
    });
    res.end(CONTACT_HTML);
    return;
  }
  res.writeHead(404, {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Security-Policy": CSP_VALUE,
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "public, max-age=0, must-revalidate"
  });
  res.end(NOT_FOUND_HTML);
};

if (!process.env.VERCEL) {
  const server = http.createServer(handler);
  server.listen(process.env.PORT || 3000);
}

module.exports = handler;
`;
fs.writeFileSync(path.join(__dirname, "app.js"), appJsCode, "utf8");

// Sync public/gems-client.js -> root gems-client.js
fs.copyFileSync(path.join(publicDir, "gems-client.js"), path.join(__dirname, "gems-client.js"));

console.log("Successfully generated all SEO pages, unified www origin, pre-rendered homepage HTML, and added real HTTP 404 handling!");
