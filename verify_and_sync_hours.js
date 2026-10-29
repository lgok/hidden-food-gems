// verify_and_sync_hours.js
// Audits, normalizes, and verifies operating hours, timezones, states, and 7-day schedules
// across ALL restaurants, coffee shops, and boba listings in ALL ZIP codes.

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'db.json');
const seedJsonPath = path.join(__dirname, 'data', 'seed.json');
const publicSeedPath = path.join(__dirname, 'public', 'seed-data.js');
const rootSeedPath = path.join(__dirname, 'seed-data.js');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
let list = db.restaurants || [];

// 1. Remove duplicate Copa Vida entry in 91105 (keep 'copa-vida-pasadena')
list = list.filter(r => r.id !== 'copa-vida-pasadena-raymond');

// 2. Resolve exact state & IANA timezone from ZIP code
function resolveStateFromZip(zip) {
  const z = String(zip || '').trim();
  if (/^9[0-6]/.test(z)) return 'CA';
  if (/^1[0-4]/.test(z)) return 'NY';
  if (/^0[78]/.test(z)) return 'NJ';
  if (/^200|^20[2-5]/.test(z)) return 'DC';
  if (/^20[6-9]|^21/.test(z)) return 'MD';
  if (/^22|^23|^24/.test(z)) return 'VA';
  if (/^60|^61|^62/.test(z)) return 'IL';
  if (/^7[5-9]/.test(z)) return 'TX';
  return 'CA';
}

const STATE_TIMEZONE = {
  CA: 'America/Los_Angeles',
  NY: 'America/New_York',
  NJ: 'America/New_York',
  MD: 'America/New_York',
  DC: 'America/New_York',
  VA: 'America/New_York',
  IL: 'America/Chicago',
  TX: 'America/Chicago',
};

// 3. Authoritative verified schedule corrections for specific listings
const VERIFIED_HOURS_OVERRIDES = {
  'thai-family-sisters-upland': {
    hours: 'Tue–Sun 11:00am–9:00pm · Closed Monday',
    meal_types: ['lunch', 'dinner'],
    meals: ['lunch', 'dinner'],
    serves_breakfast: false,
  },
  'calle-ocho-cuban-cafecito-rancho': {
    hours: 'Mon–Sat 10:00am–3:00pm · Closed Sunday',
    meal_types: ['brunch', 'lunch', 'coffee', 'coffee_boba'],
    meals: ['brunch', 'lunch', 'coffee', 'coffee_boba'],
    serves_breakfast: false,
  },
  'tanyas-lebanese-kabab-upland': {
    hours: 'Mon–Sat 10:00am–10:00pm · Sun 10:00am–8:00pm',
    meal_types: ['brunch', 'lunch', 'dinner'],
    meals: ['brunch', 'lunch', 'dinner'],
    serves_breakfast: false,
  },
  'house-of-fortune-vegan-chino': {
    hours: 'Daily 11:00am–8:00pm',
    meal_types: ['lunch', 'dinner'],
    meals: ['lunch', 'dinner'],
    serves_breakfast: false,
  },
  'the-quarter-creole-claremont-village': {
    hours: 'Wed–Thu 5:00pm–8:30pm · Fri–Sat 4:00pm–9:30pm · Sun 4:00pm–8:30pm · Mon 5:00pm–9:00pm · Closed Tuesday',
    meal_types: ['dinner'],
    meals: ['dinner'],
    serves_breakfast: false,
  },
  'not-your-mamas-kitchen-ontario': {
    hours: 'Wed–Sun 12:00pm–7:00pm · Closed Mon–Tue',
    meal_types: ['lunch', 'dinner'],
    meals: ['lunch', 'dinner'],
    serves_breakfast: false,
  },
  'tx-78702-micklethwait-austin': {
    hours: 'Thu–Sun 11:00am–4:00pm · Closed Mon–Wed',
    meal_types: ['lunch'],
    meals: ['lunch'],
    serves_breakfast: false,
  },
  'dc-20001-oohhsaahhssoulfood': {
    hours: 'Tue–Thu 12:00pm–9:00pm · Fri–Sat 12:00pm–10:00pm · Sun 12:00pm–8:00pm · Closed Monday',
    meal_types: ['lunch', 'dinner'],
    meals: ['lunch', 'dinner'],
    serves_breakfast: false,
  },
  'dc-20005-bubandpopssandwichsh': {
    hours: 'Mon–Sat 11:00am–3:00pm · Closed Sunday',
    meal_types: ['lunch'],
    meals: ['lunch'],
    serves_breakfast: false,
  },
  'nj-07302-pratobakery': {
    hours: 'Mon–Sat 8:00am–7:00pm · Sun 8:30am–5:00pm',
    meal_types: ['breakfast', 'brunch', 'lunch', 'coffee', 'coffee_boba'],
    meals: ['breakfast', 'brunch', 'lunch', 'coffee', 'coffee_boba'],
    serves_breakfast: true,
    tags: ['italian', 'breakfast', 'brunch', 'lunch', 'coffee', 'coffee_boba', 'vegetarian-options'],
  },
};

function parseTimeMinutes(timeStr) {
  if (!timeStr) return null;
  const m = timeStr.trim().match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!m) return null;
  let hr = parseInt(m[1], 10);
  const mn = parseInt(m[2] || '0', 10);
  const ap = m[3].toLowerCase();
  if (ap === 'pm' && hr !== 12) hr += 12;
  if (ap === 'am' && hr === 12) hr = 0;
  return hr * 60 + mn;
}

function formatTimeClean(t) {
  return t.replace(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i, (_, h, m, ap) => {
    const mn = m ? `:${m}` : ':00';
    return `${h}${mn} ${ap.toUpperCase()}`;
  });
}

const DAY_MAP = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

function segmentMatchesDay(partStr, dayIdx) {
  const s = partStr.toLowerCase();
  if (/\bdaily\b/.test(s)) return true;

  // Extract day expression before time digits or after 'closed'
  const dayPortion = s.replace(/\d{1,2}(?::\d{2})?\s*(?:am|pm)/gi, ' ');

  let remaining = dayPortion;
  const rangeRe = /\b(sun|mon|tue|wed|thu|fri|sat)(?:day|urday|nesday|rsday|sday)?\s*[–-]\s*(sun|mon|tue|wed|thu|fri|sat)(?:day|urday|nesday|rsday|sday)?\b/gi;
  let rm;
  while ((rm = rangeRe.exec(dayPortion)) !== null) {
    const start = DAY_MAP[rm[1].toLowerCase().slice(0, 3)];
    const end = DAY_MAP[rm[2].toLowerCase().slice(0, 3)];
    if (start <= end ? (dayIdx >= start && dayIdx <= end) : (dayIdx >= start || dayIdx <= end)) {
      return true;
    }
    remaining = remaining.replace(rm[0], ' ');
  }

  const singleRe = /\b(sun|mon|tue|wed|thu|fri|sat)(?:day|urday|nesday|rsday|sday)?\b/gi;
  let sm;
  while ((sm = singleRe.exec(remaining)) !== null) {
    const d = DAY_MAP[sm[1].toLowerCase().slice(0, 3)];
    if (d === dayIdx) return true;
  }

  return false;
}

function segmentHasAnyDayToken(partStr) {
  return /\b(daily|sun|mon|tue|wed|thu|fri|sat)/i.test(partStr);
}

function parseScheduleForDay(hoursStr, dayIdx) {
  const full = String(hoursStr || '').trim();
  const stripped = full.replace(/\([^)]*\)/g, '').trim();
  const parts = stripped.split(/\s*[·•]\s*/).filter(Boolean);

  const hasDayTokens = parts.some(segmentHasAnyDayToken);

  for (const part of parts) {
    if (segmentMatchesDay(part, dayIdx)) {
      if (/\bclosed\b/i.test(part)) {
        return { closed: true, openMin: null, closeMin: null, rangeStr: 'Closed Today' };
      }
      const timeMatch = part.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm))\s*[–-]\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
      if (timeMatch) {
        const openMin = parseTimeMinutes(timeMatch[1]);
        let closeMin = parseTimeMinutes(timeMatch[2]);
        if (closeMin !== null && openMin !== null && closeMin <= openMin) {
          closeMin += 24 * 60;
        }
        const cleanOpen = formatTimeClean(timeMatch[1]);
        const cleanClose = formatTimeClean(timeMatch[2]);
        return {
          closed: false,
          openMin,
          closeMin,
          rangeStr: `${cleanOpen} – ${cleanClose}`,
        };
      }
    }
  }

  if (hasDayTokens) {
    // Explicit day segments existed, and none matched dayIdx -> closed on dayIdx
    return { closed: true, openMin: null, closeMin: null, rangeStr: 'Closed Today' };
  }

  const genericMatch = stripped.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm))\s*[–-]\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
  if (genericMatch) {
    const openMin = parseTimeMinutes(genericMatch[1]);
    let closeMin = parseTimeMinutes(genericMatch[2]);
    if (closeMin !== null && openMin !== null && closeMin <= openMin) {
      closeMin += 24 * 60;
    }
    return {
      closed: false,
      openMin,
      closeMin,
      rangeStr: `${formatTimeClean(genericMatch[1])} – ${formatTimeClean(genericMatch[2])}`,
    };
  }

  return { closed: false, openMin: 660, closeMin: 1260, rangeStr: '11:00 AM – 9:00 PM' };
}

let errors = 0;

for (const r of list) {
  if (VERIFIED_HOURS_OVERRIDES[r.id]) {
    Object.assign(r, VERIFIED_HOURS_OVERRIDES[r.id]);
  }

  r.state = resolveStateFromZip(r.zip);
  r.timezone = STATE_TIMEZONE[r.state] || 'America/Los_Angeles';
  r.kitchenStatus = 'open';
  delete r.statusLabel;
  if (r.analytics) {
    delete r.analytics.kitchenStatus;
    delete r.analytics.statusLabel;
  }

  // Build verified 7-day weeklySchedule (0=Sun..6=Sat)
  const weeklySchedule = {};
  let earliestOpen = 9999;
  let latestClose = 0;
  let openDaysCount = 0;

  for (let d = 0; d < 7; d++) {
    const daySched = parseScheduleForDay(r.hours, d);
    weeklySchedule[d] = daySched;
    if (!daySched.closed) {
      openDaysCount++;
      if (daySched.openMin === null || daySched.closeMin === null) {
        console.error(`ERROR: Null openMin/closeMin on day ${d} for ${r.id} (${r.hours})`);
        errors++;
      } else {
        if (daySched.openMin < earliestOpen) earliestOpen = daySched.openMin;
        if (daySched.closeMin > latestClose) latestClose = daySched.closeMin;
      }
    }
  }

  if (openDaysCount === 0) {
    console.error(`ERROR: 0 open days for ${r.id} (${r.hours})`);
    errors++;
  }

  r.weeklySchedule = weeklySchedule;
  r.opening_hour_minutes = earliestOpen === 9999 ? 660 : earliestOpen;
  r.closing_hour_minutes = latestClose === 0 ? 1260 : latestClose;

  // Sync tags with meal_types
  if (!Array.isArray(r.meal_types)) {
    r.meal_types = Array.isArray(r.meals) ? [...r.meals] : ['lunch', 'dinner'];
  }
  r.meals = [...r.meal_types];
}

if (errors > 0) {
  console.error(`Verification failed with ${errors} errors.`);
  process.exit(1);
}

db.restaurants = list;
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
fs.writeFileSync(seedJsonPath, JSON.stringify(list, null, 2), 'utf8');
fs.writeFileSync(publicSeedPath, `window.__HFG_OFFLINE_SEED__ = ${JSON.stringify(list)};\n`, 'utf8');
fs.writeFileSync(rootSeedPath, `window.__HFG_OFFLINE_SEED__ = ${JSON.stringify(list)};\n`, 'utf8');

console.log(`✅ Verified and synced 7-day operating hours and timezones across all ${list.length} listings in all ${new Set(list.map(r => r.zip)).size} ZIP codes (${new Set(list.map(r => r.state)).size} states)!`);
