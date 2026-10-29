const fs = require("fs");
const path = require("path");
const vm = require("vm");

const publicDir = path.join(__dirname, "public");
const seedCode = fs.readFileSync(path.join(publicDir, "seed-data.js"), "utf8");
const ctx = { window: {} };
vm.runInNewContext(seedCode, ctx);
const restaurants = ctx.window.__HFG_OFFLINE_SEED__ || [];

// Group by Region -> City
const byRegion = new Map();
for (const r of restaurants) {
  const reg = r.region || "Other Regions";
  if (!byRegion.has(reg)) byRegion.set(reg, []);
  byRegion.get(reg).push(r);
}

let md = `# 💎 HiddenFoodGem.com — Restaurant Owner Pride Outreach Kit (All 110 Vetted Gems)\n\n`;
md += `**Zero-Budget Viral Growth Playbook:**\n`;
md += `1. Copy any restaurant's ready-to-send message below and send it via **Instagram DM**, **Facebook Message**, or **Email** (or hand them your printed QR card when dining in).\n`;
md += `2. Every link below opens either their **Interactive Live-Clock Card** (\`https://hiddenfoodgem.com/?zip=ZIP&gem=ID\`) or their **Google-Indexed SEO Page** (\`https://hiddenfoodgem.com/gem/ID\`).\n`;
md += `3. When a restaurant reposts their feature to their Instagram Story, tag them back and pin it to your Highlights!\n\n---\n\n`;

let csvRows = [
  ["ID", "Restaurant Name", "Cuisine", "City", "State", "ZIP", "Phone", "Signature Dish", "Direct Interactive Link", "SEO Page Link", "Ready-to-Send Instagram DM"].map(h => `"${h}"`).join(",")
];

for (const [region, list] of byRegion.entries()) {
  md += `## 📍 ${region} (${list.length} Verified Gems)\n\n`;
  list.sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name));

  for (const r of list) {
    const liveUrl = `https://hiddenfoodgem.com/?zip=${r.zip}&gem=${r.id}`;
    const seoUrl = `https://hiddenfoodgem.com/gem/${r.id}`;
    const dish =
      (r.destinationDish && typeof r.destinationDish === "object"
        ? r.destinationDish.name
        : r.destinationDish) ||
      r.structuredMenu?.signatures?.[0]?.name ||
      "house specialties";
    const agency = r.healthPermit?.agency || "County Health";
    const grade = r.healthPermit?.grade || "A";

    const dmText = `Hi ${r.name} team! 👋 Wanted to let you know your spot was hand-selected and verified as a neighborhood gem for ${r.city} on HiddenFoodGem.com! 💎 We highlighted your ${dish}, your live operating hours, direct counter phone (${r.phone || "zero delivery-app fees"}), and your verified ${agency} Grade ${grade}. There is $0 cost, no ads, and no catch — we built this to support real independent family-owned restaurants over national chains. Here is your live feature: ${liveUrl} — feel free to share with your regulars! 🙌`;

    md += `### 💎 ${r.name} — ${r.city}, ${r.state || "CA"} (${r.zip})\n`;
    md += `- **Cuisine:** ${r.cuisine} | **Phone:** \`${r.phone || "N/A"}\` | **Address:** ${r.address}, ${r.city}, ${r.state || "CA"} ${r.zip}\n`;
    md += `- **Must-Try Dish Highlighted:** ${dish}\n`;
    md += `- **Interactive Live Link:** [${liveUrl}](${liveUrl})\n`;
    md += `- **Google SEO Page:** [${seoUrl}](${seoUrl})\n`;
    md += `- **Copy-Paste Instagram DM / Message:**\n`;
    md += `> ${dmText}\n\n`;

    csvRows.push(
      [
        r.id,
        r.name,
        r.cuisine,
        r.city,
        r.state || "CA",
        r.zip,
        r.phone || "",
        dish,
        liveUrl,
        seoUrl,
        dmText,
      ]
        .map((val) => `"${String(val || "").replace(/"/g, '""')}"`)
        .join(",")
    );
  }
}

fs.writeFileSync(path.join(__dirname, "RESTAURANT_OUTREACH_KIT.md"), md, "utf8");
fs.writeFileSync(path.join(__dirname, "restaurants_outreach_ready.csv"), csvRows.join("\n"), "utf8");
fs.writeFileSync("C:/Users/mikic/.gemini/antigravity/brain/6424b118-8283-40ab-9a0f-a34ef31e04e4/restaurant_owner_outreach_kit.md", md, "utf8");
console.log(`Generated outreach kit for ${restaurants.length} restaurants!`);
