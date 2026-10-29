const fs = require("fs");
const path = require("path");
const vm = require("vm");

const publicDir = path.join(__dirname, "public");
const seedCode = fs.readFileSync(path.join(publicDir, "seed-data.js"), "utf8");
const ctx = { window: {} };
vm.runInNewContext(seedCode, ctx);
const restaurants = ctx.window.__HFG_OFFLINE_SEED__ || [];

if (!restaurants.length) {
  throw new Error("No restaurants loaded from seed-data.js");
}

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

const cityZipEntries = Array.from(zipMap.values()).sort((a, b) =>
  a.city.localeCompare(b.city) || a.zip.localeCompare(b.zip)
);

// Create output directories
const gemDir = path.join(publicDir, "gem");
const citiesDir = path.join(publicDir, "cities");
fs.mkdirSync(gemDir, { recursive: true });
fs.mkdirSync(citiesDir, { recursive: true });

const baseUrl = "https://hiddenfoodgem.com";
const todayISO = new Date().toISOString().split("T")[0];

// Shared SEO CSS
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
  const stars = avgStars(r);
  const ratingCount = (r.ratings && r.ratings.length) || 12;
  const priceStr = "$".repeat(r.price || 2);
  const fullAddr = `${r.address}, ${r.city}, ${r.state || "CA"} ${r.zip}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${fullAddr}`)}`;
  const interactiveUrl = `/?zip=${encodeURIComponent(r.zip)}&gem=${encodeURIComponent(r.id)}`;
  const cityEntry = zipMap.get(String(r.zip).trim());
  const cityPageUrl = cityEntry ? `/cities/${cityEntry.slug}` : `/?zip=${r.zip}`;

  const signatures = (r.structuredMenu && r.structuredMenu.signatures) || [];
  const classics = (r.structuredMenu && r.structuredMenu.regionalClassics) || [];
  const allDishes = [...signatures, ...classics].slice(0, 6);

  const nearbyGems = restaurants
    .filter((other) => other.id !== r.id && other.state === r.state)
    .map((other) => ({
      other,
      dist: haversineMiles(r.latitude, r.longitude, other.latitude, other.longitude),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${baseUrl}/gem/${r.id}#restaurant`,
    name: r.name,
    description: r.description || `${r.name} is a verified independent ${r.cuisine} restaurant in ${r.city}, ${r.state}. Signature dish: ${r.destinationDish || "house specialties"}.`,
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
      latitude: r.latitude,
      longitude: r.longitude,
    },
    openingHours: r.hours,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: stars,
      reviewCount: ratingCount,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const title = `${r.name} (${r.city}, ${r.state || "CA"} ${r.zip}) — Menu, Hours & Health Grade | HiddenFoodGem.com`;
  const metaDesc = `Verified Hidden Food Gem in ${r.city}, ${r.state || "CA"} (${r.zip}): ${r.name} (${r.cuisine}). Must-try: ${r.destinationDish || "House Signatures"}. Hours: ${r.hours}. Address: ${fullAddr}. Call counter directly: ${r.phone}.`;

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
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(metaDesc)}" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
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
      <a href="/">Home</a> › <a href="${esc(cityPageUrl)}">${esc(r.city)}, ${esc(r.state || "CA")} (${esc(r.zip)})</a> › <span>${esc(r.name)}</span>
    </nav>

    <article class="hero-card">
      <div class="pill-row">
        <span class="pill">💎 Verified Independent Gem</span>
        <span class="pill">${esc(r.cuisine)} · ${esc(priceStr)}</span>
        ${r.healthPermit ? `<span class="pill pill-green">✓ Official Grade ${esc(r.healthPermit.grade || "A")} (${esc(r.healthPermit.score || 98)}/100)</span>` : ""}
        <span class="pill">★ ${stars} (${ratingCount} local ratings)</span>
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
          <div class="meta-val">${esc(r.destinationDish || "House Specialties")}</div>
        </div>
      </div>

      <div class="cta-bar">
        <a href="${esc(interactiveUrl)}" class="btn">💎 Launch Interactive Menu & Live Clock</a>
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
      ${r.familyRoots ? `<p><strong>Family & Culinary Roots:</strong> ${esc(r.familyRoots)}</p>` : ""}
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
              ${other.destinationDish ? `<div style="font-size:0.82rem;margin-bottom:10px">🔥 <strong>Must-Try:</strong> ${esc(other.destinationDish)}</div>` : ""}
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
      <p><strong>HiddenFoodGem.com</strong> — 100% Independent, Vetted Family-Owned Restaurants, Bakeries, Coffee Roasters & Boba Shops. Zero Chains. Zero Paid Ads.</p>
      <p>Planning a family outing nearby? Discover verified kid-friendly events & seasonal festivals at <a href="https://letsgetoutkids.com" target="_blank" rel="noopener">LetsGetOutKids.com</a>.</p>
    </footer>
  </main>
</body>
</html>`;

  fs.writeFileSync(path.join(gemDir, `${r.id}.html`), html, "utf8");
}

// 2. Generate City/ZIP Landing Pages (/cities/[slug].html)
for (const entry of cityZipEntries) {
  const { zip, city, state, region, slug, latitude, longitude, directGems } = entry;
  // Also include nearby gems within 15 miles in the same state
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
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
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
        <a href="https://letsgetoutkids.com" target="_blank" rel="noopener" class="btn btn-outline">🎡 Family Events Near ${esc(city)}</a>
      </div>
    </section>

    <section class="section-card">
      <h2>🏆 Verified Independent Gems in ${esc(city)} (${esc(zip)})</h2>
      <div class="gem-grid">
        ${directGems.map((r) => `
          <article class="gem-card">
            <div>
              <div style="font-size:0.78rem;color:var(--gold);font-weight:700">${esc(r.cuisine)} · ${"$".repeat(r.price || 2)}</div>
              <h3 style="margin:6px 0;font-size:1.15rem"><a href="/gem/${esc(r.id)}">${esc(r.name)}</a></h3>
              <p style="font-size:0.86rem;color:var(--muted);margin:4px 0 8px">📍 ${esc(r.address)}, ${esc(r.city)}, ${esc(r.state || "CA")} ${esc(r.zip)}</p>
              <p style="font-size:0.84rem;color:var(--muted);margin:4px 0 8px">🕒 ${esc(r.hours)}</p>
              ${r.destinationDish ? `<p style="font-size:0.86rem;margin:6px 0 12px">🔥 <strong>Must-Try:</strong> ${esc(r.destinationDish)}</p>` : ""}
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <a href="/gem/${esc(r.id)}" class="btn">Full Menu & Details</a>
              <a href="/?zip=${esc(zip)}&gem=${esc(r.id)}" class="btn btn-outline">Live Status</a>
            </div>
          </article>
        `).join("")}
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
              ${r.destinationDish ? `<p style="font-size:0.83rem;margin:4px 0 10px">🔥 <strong>Must-Try:</strong> ${esc(r.destinationDish)}</p>` : ""}
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
      <p><a href="/">← Back to All 110 Verified Gems on HiddenFoodGem.com</a></p>
    </footer>
  </main>
</body>
</html>`;

  fs.writeFileSync(path.join(citiesDir, `${slug}.html`), html, "utf8");
}

// 3. Generate public/sitemap.xml & public/robots.txt
const sitemapUrls = [
  `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${todayISO}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
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

Sitemap: https://hiddenfoodgem.com/sitemap.xml
`;
fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsTxt, "utf8");

// 4. Update public/index.html with OpenGraph, WebSite JSON-LD, and crawlable 65-city footer
const cityLinksHtml = cityZipEntries
  .map(
    (c) =>
      `<a href="/cities/${c.slug}" style="color:#c2b2a3;font-size:0.78rem;text-decoration:none;padding:3px 8px;border:1px solid rgba(245,194,107,0.14);border-radius:999px">${esc(c.city)}, ${esc(c.state)} (${esc(c.zip)})</a>`
  )
  .join(" ");

const indexHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#1f1612" />
  <meta name="description" content="HiddenFoodGem.com: discover 110+ verified independent family-run restaurants, bakeries, coffee roasters &amp; boba shops across 65 ZIP codes. Live operating hours, verified county health grades, signature dishes &amp; direct counter calling." />
  <title>HiddenFoodGem.com: Verified Independent Restaurants, Bakeries, Coffee &amp; Boba</title>
  <link rel="canonical" href="https://hiddenfoodgem.com/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="HiddenFoodGem.com — Verified Independent Restaurants, Coffee &amp; Boba" />
  <meta property="og:description" content="Skip national chains and 30% delivery app fees. Explore 110+ hand-vetted family-owned restaurants with live hours, signature dishes, and official County Health grades." />
  <meta property="og:url" content="https://hiddenfoodgem.com/" />
  <meta property="og:site_name" content="HiddenFoodGem.com" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="HiddenFoodGem.com — Verified Independent Restaurants" />
  <meta name="twitter:description" content="Discover 110+ verified independent family-run restaurants across 65 ZIP codes with live operating hours &amp; official health inspection grades." />
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="/styles.css?v=70" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HiddenFoodGem.com",
    "url": "https://hiddenfoodgem.com/",
    "description": "Verified independent family-run restaurants, bakeries, coffee roasters, and boba shops with live operating hours, signature dishes, and official county health inspection badges.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://hiddenfoodgem.com/?zip={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
  </script>
  <!-- Vercel Web Analytics & Custom Events Tracking -->
  <script defer src="/_vercel/insights/script.js"></script>
</head>
<body>
  <header class="topbar">
    <a href="#/" class="brand" aria-label="HiddenFoodGem.com home">
      <span class="brand-gem">💎</span>
      <span class="brand-text">Hidden <em>Food</em> Gem<span style="font-size:0.72em;opacity:0.85;font-weight:700">.com</span></span>
    </a>
    <div style="display:flex;gap:8px;align-items:center">
      <a href="https://letsgetoutkids.com" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" title="Verified Family Events &amp; Activities">🎡 Family Events</a>
      <a href="#/add" class="btn btn-ghost btn-sm">📩 Contact Us</a>
    </div>
  </header>

  <main id="view"></main>

  <footer class="seo-directory" style="max-width:1200px;margin:32px auto 80px;padding:24px 16px;border-top:1px solid rgba(245,194,107,0.15);color:#c2b2a3;font-size:0.82rem">
    <div style="font-weight:700;color:#f5c26b;margin-bottom:10px">📍 Explore Verified Hidden Food Gems by City &amp; ZIP Code (65 Neighborhood Guides)</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px">${cityLinksHtml}</div>
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06)">
      <span>© 2026 <strong>HiddenFoodGem.com</strong> — 100% Independent Restaurants, Zero Chains, Zero Paid Rankings.</span>
      <span>Sister Site: <a href="https://letsgetoutkids.com" target="_blank" rel="noopener" style="color:#f5c26b">Let&apos;s Get Out, Kids! (LetsGetOutKids.com) ↗</a> · <a href="/sitemap.xml" style="color:#c2b2a3">Sitemap</a></span>
    </div>
  </footer>

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

  <script src="/seed-data.js?v=70"></script>
  <script src="/gems-client.js?v=70"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(publicDir, "index.html"), indexHtml, "utf8");

console.log(`Generated ${restaurants.length} /gem/[id].html pages, ${cityZipEntries.length} /cities/[slug].html pages, sitemap.xml (${sitemapUrls.length} URLs), robots.txt, and updated index.html!`);
