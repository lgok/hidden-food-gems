/* HiddenFoodGem.com: front-end (no frameworks, works fully offline or on local network) */
(() => {
  'use strict';

  // ---------- Config ----------
  const MEAL_TABS = [
    ['', 'All Meals', '🍽️'],
    ['open_now', 'Open Right Now', '🟢'],
    ['breakfast', 'Breakfast', '☀️'],
    ['brunch', 'Brunch', '🥞'],
    ['lunch', 'Lunch', '🥪'],
    ['dinner', 'Dinner', '🌙'],
  ];

  const CHIPS = [
    ['chicken', 'Chicken', '🍗'], ['beef', 'Beef', '🥩'], ['pork', 'Pork', '🥓'], ['seafood', 'Seafood', '🦐'],
    ['vegetarian-only', 'Vegetarian only', '🥗'], ['vegan', 'Vegan', '🌱'], ['kosher', 'Kosher', '✡️'], ['halal', 'Halal', '☪️'],
    ['chinese', 'Chinese', '🥡'], ['mexican', 'Mexican', '🌮'], ['country', 'Country', '🤠'], ['southern', 'Southern', '🍽️'],
    ['bbq', 'BBQ', '🔥'], ['korean', 'Korean', '🍲'], ['vietnamese', 'Vietnamese', '🍜'], ['filipino', 'Filipino', '🍢'],
    ['ethiopian', 'Ethiopian', '🫓'], ['italian', 'Italian', '🍝'], ['indian', 'Indian', '🍛'], ['cajun', 'Cajun', '🦞'], ['thai', 'Thai', '🌶️'],
  ];
  const TAG_LABEL = Object.fromEntries([...MEAL_TABS.slice(1), ...CHIPS].map(([k, l]) => [k, l]));
  Object.assign(TAG_LABEL, { 'open_now': 'Open Right Now (Within 5 Miles)', 'vegetarian-options': 'Veggie options', american: 'American', 'late-night': 'Late night', mediterranean: 'Mediterranean' });
  const CUISINES = ['American', 'BBQ', 'Breakfast', 'Cajun', 'Chinese', 'Country', 'Cuban', 'Ethiopian', 'Filipino', 'French', 'Greek', 'Himalayan', 'Indian', 'Italian', 'Japanese',
    'Korean', 'Lebanese', 'Mediterranean', 'Mexican', 'Peruvian', 'Polish', 'Portuguese', 'Salvadoran', 'Seafood', 'Southern', 'Taiwanese', 'Thai', 'Vegetarian', 'Vietnamese', 'Other'];
  const FORM_TAGS = ['breakfast', 'brunch', 'lunch', 'dinner', 'chicken', 'beef', 'pork', 'seafood', 'vegetarian-only', 'vegetarian-options', 'vegan', 'kosher', 'halal', 'bbq', 'late-night'];
  const CUISINE_EMOJI = { chinese: '🥡', mexican: '🌮', country: '🤠', southern: '🍗', breakfast: '🍳', vegetarian: '🥗', korean: '🍲',
    filipino: '🍢', ethiopian: '🫓', vietnamese: '🍜', italian: '🍝', indian: '🍛', seafood: '🐟', cajun: '🦞', bbq: '🔥', thai: '🌶️', american: '🍔', mediterranean: '🥙',
    peruvian: '🍗', japanese: '🍱', greek: '🫒', french: '🥐', taiwanese: '🧋', salvadoran: '🫓', cuban: '🥪', lebanese: '🥙', himalayan: '🥟', portuguese: '🥧', polish: '🥟' };
  const GEM_MAX_RATINGS = 25;

  const MENU_CAT_META = [
    ['signatures', '🔥 Signatures', 'The Signatures (Top 3 Must-Order Dishes)'],
    ['regionalClassics', '🏺 Regional Classics', 'Regional Classics'],
    ['combosAndTrays', '🍱 Family Trays', 'Combos & Family Trays (High Average Order Value)'],
    ['sidesAndDrinks', '🥤 Sides & Drinks', 'Housemade Sides & Drinks'],
  ];

  const SOCAL_REGIONS = [
    { id: 'Inland Empire', label: '🌄 Inland Empire (San Bernardino & Riverside)' },
    { id: 'San Gabriel Valley', label: '🥢 San Gabriel Valley (SGV)' },
    { id: 'Los Angeles Metro', label: '🌆 Los Angeles Metro & East LA' },
    { id: 'South Bay & Long Beach', label: '⚓ South Bay & Long Beach' },
    { id: 'Orange County', label: '🍊 Orange County' },
    { id: 'San Diego County', label: '🌊 San Diego County' },
    { id: 'San Fernando Valley', label: '☀️ San Fernando Valley' },
    { id: 'New York Metro', label: '🗽 New York Metro (NY)' },
    { id: 'Maryland Capital Region', label: '🦀 Maryland Capital Region (MD)' },
    { id: 'Washington Metro', label: '🏛️ Washington, DC' },
    { id: 'Northern New Jersey', label: '🏙️ Northern New Jersey (NJ)' },
    { id: 'Dallas-Fort Worth Metro', label: '🤠 Dallas-Fort Worth (TX)' },
    { id: 'Central Texas', label: '🎸 Central Texas & Austin (TX)' },
    { id: 'Chicago Metro', label: '🏙️ Chicago Metro (IL)' }
  ];

  const geocodedZipCache = new Map();

  const state = {
    restaurants: [],
    q: '',
    mealTab: '',
    radiusMiles: 0,
    chips: new Set(),
    prices: new Set(),
    region: '',
    city: '',
    cuisine: '',
    gradeAOnly: false,
    sort: 'gem',
    limit: 24,
    userGpsCoords: null, // [latitude, longitude] when "Near Me" GPS is active
    userGpsLabel: '', // e.g. "Current Location" or reverse geocoded city
    geocodedInfo: null, // { zip, city, state, latitude, longitude }
    cardMenuCat: {}, // { [restaurantId]: 'signatures' | 'regionalClassics' | 'combosAndTrays' | 'sidesAndDrinks' }
    selectedAnalyticsId: 'changan-kitchen-ontario',
    customBiz: {
      name: "Bella Napoli Pizzeria & Trattoria",
      ownerName: "Tony",
      phone: "(909) 555-0194",
      address: "412 N Euclid Ave, Ontario, CA 91762",
      calls: 28,
      directions: 41,
      stripeUrl: "https://buy.stripe.com/demo_renewal_10mo"
    },
    base: '#/'
  };
  const $ = (s, el = document) => el.querySelector(s);
  const view = $('#view'), sheet = $('#sheet'), sheetBody = $('#sheet-body');

  // ---------- Helpers ----------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const avg = (r) => (r.ratings.length ? r.ratings.reduce((a, x) => a + x.stars, 0) / r.ratings.length : 0);
  const starsTxt = (n) => '★★★★★'.slice(0, Math.round(n)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(n));
  const price = (p) => '$'.repeat(p || 1);
  const timeAgo = (d) => {
    const s = (Date.now() - new Date(d)) / 1000;
    if (s < 60) return 'just now';
    const units = [[31536000, 'y'], [2592000, 'mo'], [604800, 'w'], [86400, 'd'], [3600, 'h'], [60, 'm']];
    for (const [sec, u] of units) if (s >= sec) return `${Math.floor(s / sec)}${u} ago`;
    return '';
  };
  const badge = (r) => {
    const a = avg(r), n = r.ratings.length;
    if (!n) return { cls: 'new', txt: '🌱 Be the first to rate' };
    if (a >= 4.5 && n < GEM_MAX_RATINGS) return { cls: 'gem', txt: '💎 Hidden Gem' };
    if (a >= 4.5) return { cls: 'fav', txt: '⭐ Local Favorite' };
    return null;
  };
  const gemScore = (r) => {
    const b = badge(r);
    const feat = r.featured ? 5000 : 0;
    const hasMedia = coverImage(r) ? 30 : 0;
    const hScore = r.healthPermit?.score ? r.healthPermit.score * 0.2 : 0;
    return feat + (b?.cls === 'gem' ? 1000 : b?.cls === 'new' ? 500 : 0) + hasMedia + hScore + avg(r) * 10 - r.ratings.length * 0.1;
  };
  const hashNum = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const emojiFor = (r) => {
    const c = (r.cuisine || '').toLowerCase();
    for (const [k, v] of Object.entries(CUISINE_EMOJI)) if (c.includes(k)) return v;
    for (const t of r.tags || []) if (CUISINE_EMOJI[t]) return CUISINE_EMOJI[t];
    return '🍽️';
  };
  const IS_FILE_PROTO = location.protocol === 'file:';
  const normImg = (u) => {
    if (!u) return '';
    if (IS_FILE_PROTO) return u.startsWith('/img/') ? './public' + u : u;
    return u.replace(/^\.\/public\/img\//, '/img/');
  };
  const coverImage = (r) => normImg(r.image || (r.photos && r.photos[0] && r.photos[0].file) || ((r.media || []).find((m) => m.type === 'photo') || {}).file || '');
  const placeholderHtml = (r) => {
    return '<div class="ph ph-' + (hashNum(r.id) % 5) + ' ph-owner-tile"></div>';
  };

  const mediaHtml = (r, owner = false, eager = false) => {
    const videoSrc = normImg(r.video || (r.media && (r.media.find((m) => m.type === 'video') || {}).file) || '');
    if (videoSrc) {
      return '<div style="position:relative;width:100%;height:100%">' +
        '<video src="' + esc(videoSrc) + '" autoplay muted loop playsinline disablepictureinpicture preload="metadata"></video>' +
        '<span class="video-reel-badge">▶ 3s Clip</span>' +
      '</div>';
    }
    if (r.verifiedPhoto || r.ownerVerified) {
      const img = coverImage(r);
      if (img) {
        return '<img src="' + esc(img) + '" alt="' + esc(r.name) + ' food" ' + (eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"') + ' onerror="this.outerHTML=\'' + placeholderHtml(r).replace(/'/g, '&#39;').replace(/"/g, '&quot;') + '\'">';
      }
    }
    return placeholderHtml(r);
  };
  const tagHtml = (t) => `<span class="tag ${/veg/.test(t) ? 'veg' : ''}">${esc(TAG_LABEL[t] || t)}</span>`;

  // Strip any legacy promo/discount fields from restaurant objects
  function stripPromoFields(r) {
    if (!r || typeof r !== 'object') return r;
    delete r.slow_day_active;
    delete r.discount_code;
    delete r.perk_banner;
    return r;
  }

  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 3200);
  }

  // ---------- Persistent Click Analytics ("The 2 Numbers That Prove Value") ----------
  const IS_STANDALONE = IS_FILE_PROTO || Boolean(window.__HFG_OFFLINE_SEED__);
  const LS_KEY = 'hfg_offline_restaurants_v13';
  const ANALYTICS_LS_KEY = 'cs_business_ad_analytics';

  function loadLocalAnalyticsMap() {
    try { return JSON.parse(localStorage.getItem(ANALYTICS_LS_KEY) || '{}') || {}; } catch { return {}; }
  }
  function saveLocalAnalyticsMap(map) {
    try { localStorage.setItem(ANALYTICS_LS_KEY, JSON.stringify(map)); } catch {}
  }

  function getAnalytics(r) {
    const localMap = loadLocalAnalyticsMap();
    const override = localMap[r.id];
    const base = r.analytics || { ownerName: 'Owner', calls: 28, directions: 41, stripeUrl: 'https://buy.stripe.com/demo_renewal_10mo' };
    return {
      ownerName: override?.ownerName ?? base.ownerName ?? 'Owner',
      calls: typeof override?.calls === 'number' ? override.calls : (base.calls ?? 28),
      directions: typeof override?.directions === 'number' ? override.directions : (base.directions ?? 41),
      stripeUrl: override?.stripeUrl ?? base.stripeUrl ?? 'https://buy.stripe.com/demo_renewal_10mo',
      kitchenStatus: override?.kitchenStatus ?? r.kitchenStatus ?? 'open',
      statusLabel: override?.statusLabel ?? r.statusLabel ?? 'Open Now • Closing at 8:30 PM'
    };
  }

  async function recordClickEvent(restaurantId, type, extra = {}) {
    if (restaurantId === '__custom__') {
      if (type === 'call') state.customBiz.calls++;
      else if (type === 'direction') state.customBiz.directions++;
      else if (type === 'reset') { state.customBiz.calls = 0; state.customBiz.directions = 0; }
      return state.customBiz;
    }
    const r = state.restaurants.find((x) => x.id === restaurantId);
    if (!r) return null;
    if (type === 'call' || type === 'direction') {
      state.selectedAnalyticsId = r.id;
    }
    const cur = getAnalytics(r);
    if (type === 'call') cur.calls += 1;
    else if (type === 'direction') cur.directions += 1;
    else if (type === 'reset') { cur.calls = 0; cur.directions = 0; }
    if (extra.ownerName !== undefined) cur.ownerName = extra.ownerName;
    if (extra.stripeUrl !== undefined) cur.stripeUrl = extra.stripeUrl;
    if (extra.kitchenStatus) {
      cur.kitchenStatus = extra.kitchenStatus;
      cur.statusLabel = extra.statusLabel || cur.statusLabel;
      r.kitchenStatus = cur.kitchenStatus;
      r.statusLabel = cur.statusLabel;
    }
    r.analytics = { ownerName: cur.ownerName, calls: cur.calls, directions: cur.directions, stripeUrl: cur.stripeUrl };

    const localMap = loadLocalAnalyticsMap();
    localMap[r.id] = cur;
    saveLocalAnalyticsMap(localMap);

    if (!IS_STANDALONE) {
      fetch(`/api/restaurants/${encodeURIComponent(r.id)}/track`, {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...extra })
      }).catch(() => {});
    } else {
      try { localStorage.setItem(LS_KEY, JSON.stringify(state.restaurants)); } catch {}
    }
    updateTopAnalyticsBadge();
    return cur;
  }

  function updateTopAnalyticsBadge() {}

  // ---------- Distance & Schedule Helpers (5-Mile Open Right Now + Mon/Tue Closure Exclusion) ----------
  const CITY_COORDS = {
    'Ontario': [34.0535, -117.6412],
    'Montclair': [34.0775, -117.6898],
    'Upland': [34.0975, -117.6484],
    'Chino': [34.0122, -117.6889],
    'Rancho Cucamonga': [34.1064, -117.5931],
    'Fontana': [34.0922, -117.4350],
    'Redlands': [34.0556, -117.1825],
    'San Bernardino': [34.1083, -117.2898],
    'Riverside': [33.9806, -117.3755],
    'Corona': [33.8753, -117.5664],
    'Moreno Valley': [33.9425, -117.2297],
    'Temecula': [33.4936, -117.1484],
    'Monterey Park': [34.0625, -118.1228],
    'Alhambra': [34.0953, -118.1270],
    'San Gabriel': [34.0961, -118.1058],
    'Arcadia': [34.1397, -118.0353],
    'Rosemead': [34.0806, -118.0728],
    'Rowland Heights': [33.9761, -117.9053],
    'Hacienda Heights': [33.9931, -117.9687],
    'Pasadena': [34.1478, -118.1445],
    'West Covina': [34.0686, -117.9390],
    'Temple City': [34.1072, -118.0578],
    'Downtown Los Angeles': [34.0407, -118.2468],
    'Boyle Heights': [34.0297, -118.2117],
    'East Los Angeles': [34.0224, -118.1670],
    'Koreatown': [34.0579, -118.3009],
    'Glendale': [34.1425, -118.2551],
    'Burbank': [34.1808, -118.3090],
    'Echo Park': [34.0782, -118.2606],
    'Torrance': [33.8358, -118.3406],
    'Gardena': [33.8883, -118.3090],
    'Long Beach': [33.7701, -118.1937],
    'San Pedro': [33.7361, -118.2922],
    'Carson': [33.8317, -118.2817],
    'Whittier': [33.9792, -118.0328],
    'Anaheim': [33.8366, -117.9143],
    'Santa Ana': [33.7455, -117.8677],
    'Westminster': [33.7592, -117.9897],
    'Garden Grove': [33.7743, -117.9380],
    'Fullerton': [33.8704, -117.9242],
    'Irvine': [33.6846, -117.8265],
    'Costa Mesa': [33.6412, -117.9187],
    'Orange': [33.7879, -117.8531],
    'San Diego': [32.7157, -117.1611],
    'Chula Vista': [32.6401, -117.0842],
    'National City': [32.6781, -117.0992],
    'Oceanside': [33.1959, -117.3795],
    'Escondido': [33.1192, -117.0864],
    'Van Nuys': [34.1899, -118.4514],
    'North Hollywood': [34.1722, -118.3780],
    'Reseda': [34.2011, -118.5365],
    'Canoga Park': [34.2011, -118.6009],
    // Multi-State Metro Hubs
    'New York': [40.7128, -74.0060],
    'New York City': [40.7128, -74.0060],
    'Manhattan': [40.7831, -73.9712],
    'Brooklyn': [40.6782, -73.9442],
    'Silver Spring': [38.9907, -77.0261],
    'Rockville': [39.0840, -77.1528],
    'Bethesda': [38.9847, -77.0947],
    'Bowie': [38.9458, -76.7340],
    'Washington': [38.9072, -77.0369],
    'Jersey City': [40.7178, -74.0431],
    'Newark': [40.7357, -74.1724],
    'Paterson': [40.9168, -74.1718],
    'Flushing': [40.7674, -73.8331],
    'Jackson Heights': [40.7557, -73.8831],
    'Wheaton': [39.0398, -77.0544],
    'Carrollton': [32.9537, -96.8903],
    'Richardson': [32.9483, -96.7299],
    'Fort Worth': [32.7555, -97.3308],
    'Austin': [30.2672, -97.7431],
    'Chicago': [41.8781, -87.6298],
    'Astoria': [40.7644, -73.9235],
    'Annandale': [38.8304, -77.1964],
    'Dallas': [32.7767, -96.7970]
  };

  const ZIP_COORDS = {
    '91761': [34.0395, -117.6190], '91762': [34.0560, -117.6610], '91764': [34.0695, -117.5980],
    '91763': [34.0725, -117.6850], '91786': [34.0910, -117.6480], '91710': [34.0180, -117.6820],
    '91709': [33.9890, -117.7320], '91730': [34.0920, -117.5930], '91701': [34.1280, -117.5910],
    '92335': [34.0922, -117.4350], '92336': [34.1420, -117.4550], '92373': [34.0390, -117.1850],
    '92374': [34.0750, -117.1750], '92401': [34.1083, -117.2898], '92408': [34.0740, -117.2790],
    '92501': [33.9806, -117.3755], '92503': [33.9150, -117.4600], '92506': [33.9480, -117.3960],
    '92507': [33.9760, -117.3300], '92879': [33.8820, -117.5420], '92882': [33.8680, -117.5880],
    '92553': [33.9240, -117.2420], '92557': [33.9620, -117.2320], '92590': [33.5120, -117.1680],
    '92591': [33.5240, -117.1450], '91754': [34.0520, -118.1340], '91755': [34.0625, -118.1120],
    '91801': [34.0953, -118.1270], '91803': [34.0780, -118.1480], '91775': [34.1080, -118.0980],
    '91776': [34.0880, -118.0980], '91006': [34.1397, -118.0353], '91007': [34.1250, -118.0520],
    '91770': [34.0720, -118.0728], '91748': [33.9761, -117.9053], '91745': [33.9931, -117.9687],
    '91101': [34.1478, -118.1445], '91103': [34.1650, -118.1650], '91106': [34.1440, -118.1240],
    '91790': [34.0686, -117.9390], '91791': [34.0720, -117.9050], '91780': [34.1072, -118.0578],
    '90012': [34.0610, -118.2380], '90013': [34.0440, -118.2420], '90014': [34.0430, -118.2520],
    '90015': [34.0390, -118.2660], '90033': [34.0480, -118.2080], '90023': [34.0240, -118.2020],
    '90022': [34.0224, -118.1670], '90005': [34.0590, -118.3090], '90010': [34.0610, -118.3120],
    '90020': [34.0660, -118.3080], '91201': [34.1680, -118.2880], '91204': [34.1320, -118.2580],
    '91205': [34.1380, -118.2420], '91502': [34.1808, -118.3090], '91505': [34.1680, -118.3450],
    '90026': [34.0782, -118.2606], '90501': [33.8358, -118.3180], '90503': [33.8390, -118.3540],
    '90505': [33.8050, -118.3480], '90247': [33.8920, -118.3020], '90248': [33.8720, -118.2880],
    '90802': [33.7701, -118.1937], '90804': [33.7820, -118.1520], '90807': [33.8320, -118.1850],
    '90815': [33.7950, -118.1220], '90731': [33.7361, -118.2922], '90745': [33.8317, -118.2817],
    '90601': [33.9950, -118.0420], '90602': [33.9720, -118.0328], '90240': [33.9520, -118.1320],
    '90241': [33.9380, -118.1280], '92801': [33.8480, -117.9420], '92804': [33.8220, -117.9580],
    '92805': [33.8366, -117.9050], '92701': [33.7520, -117.8580], '92703': [33.7540, -117.9050],
    '92704': [33.7220, -117.9050], '92683': [33.7592, -117.9897], '92840': [33.7860, -117.9380],
    '92843': [33.7620, -117.9380], '92844': [33.7680, -117.9680], '92831': [33.8780, -117.8950],
    '92832': [33.8704, -117.9242], '92604': [33.6980, -117.7920], '92606': [33.6880, -117.8220],
    '92614': [33.6800, -117.8380], '92626': [33.6780, -117.9080], '92627': [33.6412, -117.9187],
    '92866': [33.7879, -117.8531], '92868': [33.7850, -117.8850], '92104': [32.7420, -117.1300],
    '92111': [32.8080, -117.1680], '92113': [32.6960, -117.1220], '91910': [32.6401, -117.0680],
    '91911': [32.6080, -117.0620], '91950': [32.6781, -117.0992], '92054': [33.1959, -117.3795],
    '92025': [33.1192, -117.0864], '91401': [34.1820, -118.4320], '91405': [34.2020, -118.4480],
    '91335': [34.2011, -118.5365], '91303': [34.1980, -118.5980], '91304': [34.2220, -118.6120],
    // New York, NY
    '10001': [40.7501, -73.9961], '10002': [40.7157, -73.9863], '10003': [40.7315, -73.9892],
    // Maryland
    '20901': [39.0157, -77.0142], '20902': [39.0348, -77.0506], '20850': [39.0840, -77.1528], '20716': [38.9458, -76.7340],
    // Washington, DC
    '20001': [38.9108, -77.0199], '20002': [38.9004, -76.9854], '20005': [38.9051, -77.0317],
    // New Jersey
    '07302': [40.7178, -74.0431], '07307': [40.7487, -74.0476], '07102': [40.7357, -74.1724],
    // Dallas, TX
    '75201': [32.7877, -96.7995], '75202': [32.7801, -96.8048], '75204': [32.7986, -96.7915]
  };

  // US National Centroid Prefix Lookup (Covers all 50 states + DC + PR)
  // Maps 2-digit and key 3-digit postal prefixes to approximate centroid coordinates and state abbreviation.
  // Enables 0ms synchronous, 100% offline geolocation resolution for any US ZIP code.
  const US_PREFIX_COORDS = {
    // 3-digit high-density / border overrides
    '941': ['CA', 37.77, -122.42, 'San Francisco, CA'],
    '207': ['MD', 38.98, -76.78, 'Bowie / Laurel, MD'],
    '208': ['MD', 39.08, -77.15, 'Rockville / Bethesda, MD'],
    '209': ['MD', 39.01, -77.02, 'Silver Spring, MD'],
    '200': ['DC', 38.90, -77.03, 'Washington, DC'],
    '201': ['VA', 38.85, -77.40, 'Northern Virginia'],
    '202': ['DC', 38.89, -77.03, 'Washington, DC'],
    '203': ['DC', 38.86, -76.99, 'Washington, DC'],
    '204': ['DC', 38.89, -77.03, 'Washington, DC'],
    '205': ['DC', 38.89, -77.03, 'Washington, DC'],
    '206': ['MD', 38.45, -76.85, 'Southern Maryland'],
    '210': ['MD', 39.20, -76.70, 'Columbia / Ellicott City, MD'],
    '211': ['MD', 39.10, -76.60, 'Glen Burnie / Pasadena, MD'],
    '212': ['MD', 39.29, -76.61, 'Baltimore, MD'],
    '214': ['MD', 38.98, -76.49, 'Annapolis, MD'],
    // 2-digit National US Centroid Prefixes
    '00': ['PR', 18.22, -66.59, 'Puerto Rico'],
    '01': ['MA', 42.36, -71.79, 'Massachusetts'],
    '02': ['MA', 42.12, -71.12, 'Massachusetts'],
    '03': ['NH', 43.19, -71.57, 'New Hampshire'],
    '04': ['ME', 44.52, -69.55, 'Maine'],
    '05': ['VT', 44.04, -72.71, 'Vermont'],
    '06': ['CT', 41.60, -72.70, 'Connecticut'],
    '07': ['NJ', 40.73, -74.17, 'New Jersey'],
    '08': ['NJ', 39.83, -74.87, 'New Jersey'],
    '09': ['AE', 40.00, -75.00, 'Military / Overseas'],
    '10': ['NY', 40.71, -73.99, 'New York, NY'],
    '11': ['NY', 40.72, -73.79, 'Long Island / Queens, NY'],
    '12': ['NY', 42.65, -73.76, 'Albany, NY'],
    '13': ['NY', 43.05, -76.15, 'Syracuse, NY'],
    '14': ['NY', 42.89, -78.88, 'Buffalo, NY'],
    '15': ['PA', 40.44, -79.99, 'Pittsburgh, PA'],
    '16': ['PA', 41.41, -75.66, 'Scranton, PA'],
    '17': ['PA', 40.27, -76.88, 'Harrisburg, PA'],
    '18': ['PA', 40.60, -75.47, 'Allentown, PA'],
    '19': ['PA', 39.95, -75.17, 'Philadelphia, PA'],
    '20': ['DC', 38.91, -77.04, 'Washington, DC / MD'],
    '21': ['MD', 39.29, -76.61, 'Maryland'],
    '22': ['VA', 38.80, -77.10, 'Northern Virginia'],
    '23': ['VA', 37.54, -77.44, 'Richmond, VA'],
    '24': ['VA', 37.27, -79.94, 'Roanoke, VA'],
    '25': ['WV', 38.35, -81.63, 'Charleston, WV'],
    '26': ['WV', 39.63, -79.96, 'Morgantown, WV'],
    '27': ['NC', 35.78, -78.64, 'Raleigh, NC'],
    '28': ['NC', 35.23, -80.84, 'Charlotte, NC'],
    '29': ['SC', 34.00, -81.04, 'Columbia, SC'],
    '30': ['GA', 33.75, -84.39, 'Atlanta, GA'],
    '31': ['GA', 32.08, -81.10, 'Savannah, GA'],
    '32': ['FL', 30.33, -81.66, 'Jacksonville, FL'],
    '33': ['FL', 25.76, -80.19, 'Miami, FL'],
    '34': ['FL', 27.95, -82.46, 'Tampa, FL'],
    '35': ['AL', 33.52, -86.81, 'Birmingham, AL'],
    '36': ['AL', 32.38, -86.31, 'Montgomery, AL'],
    '37': ['TN', 36.16, -86.78, 'Nashville, TN'],
    '38': ['TN', 35.15, -90.05, 'Memphis, TN'],
    '39': ['MS', 32.30, -90.18, 'Jackson, MS'],
    '40': ['KY', 38.25, -85.76, 'Louisville, KY'],
    '41': ['KY', 38.04, -84.50, 'Lexington, KY'],
    '42': ['KY', 37.03, -87.12, 'Western Kentucky'],
    '43': ['OH', 39.96, -83.00, 'Columbus, OH'],
    '44': ['OH', 41.50, -81.69, 'Cleveland, OH'],
    '45': ['OH', 39.10, -84.51, 'Cincinnati, OH'],
    '46': ['IN', 39.77, -86.16, 'Indianapolis, IN'],
    '47': ['IN', 41.08, -85.14, 'Fort Wayne, IN'],
    '48': ['MI', 42.33, -83.05, 'Detroit, MI'],
    '49': ['MI', 42.96, -85.67, 'Grand Rapids, MI'],
    '50': ['IA', 41.59, -93.61, 'Des Moines, IA'],
    '51': ['IA', 41.26, -95.86, 'Council Bluffs, IA'],
    '52': ['IA', 42.01, -91.67, 'Cedar Rapids, IA'],
    '53': ['WI', 43.04, -87.91, 'Milwaukee, WI'],
    '54': ['WI', 43.07, -89.40, 'Madison, WI'],
    '55': ['MN', 44.98, -93.27, 'Minneapolis, MN'],
    '56': ['MN', 46.81, -95.84, 'Detroit Lakes, MN'],
    '57': ['SD', 43.55, -96.73, 'Sioux Falls, SD'],
    '58': ['ND', 46.88, -96.79, 'Fargo, ND'],
    '59': ['MT', 46.60, -112.03, 'Helena, MT'],
    '60': ['IL', 41.88, -87.63, 'Chicago, IL'],
    '61': ['IL', 40.69, -89.59, 'Peoria, IL'],
    '62': ['IL', 39.80, -89.65, 'Springfield, IL'],
    '63': ['MO', 38.63, -90.20, 'St. Louis, MO'],
    '64': ['MO', 39.10, -94.58, 'Kansas City, MO'],
    '65': ['MO', 37.21, -93.29, 'Springfield, MO'],
    '66': ['KS', 39.06, -95.69, 'Topeka, KS'],
    '67': ['KS', 37.69, -97.34, 'Wichita, KS'],
    '68': ['NE', 41.26, -95.94, 'Omaha, NE'],
    '69': ['NE', 41.87, -103.66, 'Scottsbluff, NE'],
    '70': ['LA', 29.95, -90.07, 'New Orleans, LA'],
    '71': ['LA', 32.53, -93.75, 'Shreveport, LA'],
    '72': ['AR', 34.75, -92.29, 'Little Rock, AR'],
    '73': ['OK', 35.47, -97.52, 'Oklahoma City, OK'],
    '74': ['OK', 36.15, -95.99, 'Tulsa, OK'],
    '75': ['TX', 32.78, -96.80, 'Dallas, TX'],
    '76': ['TX', 32.75, -97.33, 'Fort Worth, TX'],
    '77': ['TX', 29.76, -95.37, 'Houston, TX'],
    '78': ['TX', 29.42, -98.49, 'San Antonio, TX'],
    '79': ['TX', 31.76, -106.49, 'El Paso, TX'],
    '80': ['CO', 39.74, -104.99, 'Denver, CO'],
    '81': ['CO', 39.06, -108.55, 'Grand Junction, CO'],
    '82': ['WY', 41.14, -104.82, 'Cheyenne, WY'],
    '83': ['ID', 43.62, -116.20, 'Boise, ID'],
    '84': ['UT', 40.76, -111.89, 'Salt Lake City, UT'],
    '85': ['AZ', 33.45, -112.07, 'Phoenix, AZ'],
    '86': ['AZ', 35.20, -111.65, 'Flagstaff, AZ'],
    '87': ['NM', 35.08, -106.65, 'Albuquerque, NM'],
    '88': ['NM', 32.32, -106.78, 'Las Cruces, NM'],
    '89': ['NV', 36.17, -115.14, 'Las Vegas, NV'],
    '90': ['CA', 34.05, -118.24, 'Los Angeles, CA'],
    '91': ['CA', 34.05, -117.64, 'Ontario / Inland Empire, CA'],
    '92': ['CA', 33.84, -117.91, 'Orange County / Anaheim, CA'],
    '93': ['CA', 35.37, -119.02, 'Bakersfield / Central CA'],
    '94': ['CA', 37.77, -122.42, 'San Francisco Bay Area, CA'],
    '95': ['CA', 38.58, -121.49, 'Sacramento, CA'],
    '96': ['CA', 40.59, -122.39, 'Redding / Northern CA'],
    '97': ['OR', 45.52, -122.68, 'Portland, OR'],
    '98': ['WA', 47.61, -122.33, 'Seattle, WA'],
    '99': ['WA', 47.66, -117.43, 'Spokane, WA']
  };

  function haversineMiles(lat1, lon1, lat2, lon2) {
    const toRad = (d) => (d * Math.PI) / 180;
    const R = 3958.8;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function getZipPrefixInfo(zipStr) {
    if (!zipStr || zipStr.length < 2) return null;
    const p3 = zipStr.slice(0, 3);
    if (US_PREFIX_COORDS[p3]) {
      const [st, lat, lng, name] = US_PREFIX_COORDS[p3];
      return { zip: zipStr, city: name.split(',')[0].trim(), state: st, stateFullName: name, latitude: lat, longitude: lng, source: 'prefix_p3' };
    }
    const p2 = zipStr.slice(0, 2);
    if (US_PREFIX_COORDS[p2]) {
      const [st, lat, lng, name] = US_PREFIX_COORDS[p2];
      return { zip: zipStr, city: name.split(',')[0].trim(), state: st, stateFullName: name, latitude: lat, longitude: lng, source: 'prefix_p2' };
    }
    return null;
  }

  async function resolveZipGeocode(zipStr, signal = null) {
    if (!/^\d{5}$/.test(zipStr)) return null;
    if (geocodedZipCache.has(zipStr)) return geocodedZipCache.get(zipStr);

    // Check localStorage cache first
    try {
      const cached = localStorage.getItem(`hfg_geo_${zipStr}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed.latitude === 'number') {
          geocodedZipCache.set(zipStr, parsed);
          return parsed;
        }
      }
    } catch {}

    // Check if in known local California coordinates dictionary
    if (ZIP_COORDS[zipStr]) {
      const matchRest = state.restaurants.find((r) => r.zip === zipStr);
      const info = {
        zip: zipStr,
        city: matchRest?.city || 'Local Area',
        state: 'CA',
        latitude: ZIP_COORDS[zipStr][0],
        longitude: ZIP_COORDS[zipStr][1],
        source: 'static_ca'
      };
      geocodedZipCache.set(zipStr, info);
      return info;
    }

    // Try backend geocoding endpoint (local server proxy to Zippopotam)
    try {
      const res = await fetch(`/api/geocode?zip=${encodeURIComponent(zipStr)}`, { signal });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.latitude === 'number') {
          geocodedZipCache.set(zipStr, data);
          try { localStorage.setItem(`hfg_geo_${zipStr}`, JSON.stringify(data)); } catch {}
          return data;
        }
      }
    } catch (e) {
      if (e.name === 'AbortError') throw e;
    }

    // Fallback: Direct client fetch to Zippopotam (works if standalone or server offline)
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zipStr}`, { signal });
      if (res.ok) {
        const data = await res.json();
        const p = data.places && data.places[0];
        if (p) {
          const info = {
            zip: zipStr,
            city: p['place name'],
            state: p['state abbreviation'],
            stateFullName: p['state'],
            latitude: parseFloat(p.latitude),
            longitude: parseFloat(p.longitude),
            source: 'zippopotam_client'
          };
          geocodedZipCache.set(zipStr, info);
          try { localStorage.setItem(`hfg_geo_${zipStr}`, JSON.stringify(info)); } catch {}
          return info;
        }
      }
    } catch (e) {
      if (e.name === 'AbortError') throw e;
    }

    // Instant Synchronous National US Prefix Centroid Fallback
    const pInfo = getZipPrefixInfo(zipStr);
    if (pInfo) {
      geocodedZipCache.set(zipStr, pInfo);
      return pInfo;
    }

    return null;
  }

  function resolveZipCentroid(zipStr) {
    if (geocodedZipCache.has(zipStr)) {
      const info = geocodedZipCache.get(zipStr);
      if (info && typeof info.latitude === 'number') return [info.latitude, info.longitude];
    }
    if (ZIP_COORDS[zipStr]) return ZIP_COORDS[zipStr];
    const matchRest = state.restaurants.find((r) => r.zip === zipStr);
    if (matchRest) {
      if (typeof matchRest.latitude === 'number' && typeof matchRest.longitude === 'number') {
        return [matchRest.latitude, matchRest.longitude];
      }
      if (CITY_COORDS[matchRest.city]) return CITY_COORDS[matchRest.city];
    }
    const pInfo = getZipPrefixInfo(zipStr);
    if (pInfo) return [pInfo.latitude, pInfo.longitude];
    return null;
  }

  function getActiveZipQuery() {
    const qTrim = (state.q || '').trim();
    // Capture 5-digit ZIP code even if surrounded by spaces or in a formatted query like "Bowie 20720" or "20720-1234"
    const mZip = /\b(\d{5})\b/.exec(qTrim);
    return mZip ? mZip[1] : null;
  }

  function getActiveCenterCoords() {
    if (state.userGpsCoords) {
      return state.userGpsCoords;
    }
    const zip = getActiveZipQuery();
    if (zip) {
      const coords = resolveZipCentroid(zip);
      if (coords) return coords;
      // If ZIP is entered but not resolved yet, do NOT fall back to Ontario CA
      return null;
    }
    if (state.city && CITY_COORDS[state.city]) {
      return CITY_COORDS[state.city];
    }
    return ZIP_COORDS['91761']; // Default anchor: 91761 (Ontario, CA)
  }

  function getRestaurantCoords(r) {
    if (typeof r.latitude === 'number' && typeof r.longitude === 'number') {
      return [r.latitude, r.longitude];
    }
    const base = ZIP_COORDS[r.zip] || CITY_COORDS[r.city] || ZIP_COORDS['91761'];
    const h = hashNum(r.id || r.name || 'gem');
    const latOffset = (((h % 100) - 50) / 50) * 0.011;
    const lngOffset = ((((h >> 7) % 100) - 50) / 50) * 0.013;
    return [base[0] + latOffset, base[1] + lngOffset];
  }

  function getDistanceMiles(r) {
    const center = getActiveCenterCoords();
    if (!center) return Infinity; // Out-of-region or unmapped ZIP
    const [cLat, cLon] = center;
    const [rLat, rLon] = getRestaurantCoords(r);
    const d = haversineMiles(cLat, cLon, rLat, rLon);
    return Math.max(0.2, Math.round(d * 10) / 10);
  }

  function getDriveMinutes(distMiles) {
    if (!isFinite(distMiles) || distMiles > 500) return 999;
    return Math.max(3, Math.round(distMiles * 2.1 + 2));
  }

  // ---------- Meal Qualification & Schedule Validation Rules ----------
  function parseEarliestOpeningMinutes(hoursStr) {
    const h = String(hoursStr || '').replace(/\([^)]*\)/g, '');
    const regex = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*[–-]/gi;
    let m;
    let earliest = 9999;
    while ((m = regex.exec(h)) !== null) {
      let hr = parseInt(m[1], 10);
      const mn = parseInt(m[2] || '0', 10);
      const ap = m[3].toLowerCase();
      if (ap === 'pm' && hr !== 12) hr += 12;
      if (ap === 'am' && hr === 12) hr = 0;
      const tot = hr * 60 + mn;
      if (tot < earliest) earliest = tot;
    }
    return earliest === 9999 ? 660 : earliest;
  }

  // Hide any restaurant that is closed on Monday or Tuesday so they do not feature
  function isClosedMonOrTue(r) {
    const h = (r.hours || '').toLowerCase();
    return /closed\s*(on\s*)?(mon|tue)/i.test(h);
  }

  function isClosedToday(r, now = new Date()) {
    if (isClosedMonOrTue(r)) return true;
    const an = getAnalytics(r);
    const st = an.kitchenStatus || r.kitchenStatus || 'open';
    if (st === 'sold_out') return true;
    const h = (r.hours || '').toLowerCase();
    const dayIdx = now.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    const dayTokens = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayTok = dayTokens[dayIdx];
    if (new RegExp(`closed\\s*[^·]*\\b${todayTok}`, 'i').test(h)) return true;
    return false;
  }

  function isOpenRightNow(r, now = new Date()) {
    if (isClosedToday(r, now)) return false;
    const h = (r.hours || '').toLowerCase();
    const curMin = now.getHours() * 60 + now.getMinutes();
    if (curMin >= 15 * 60 + 15 && /3:00\s*pm/.test(h) && !/8:|9:|10:|11:/.test(h)) {
      return false;
    }
    return true;
  }

  // Two-Part Meal Validation Rule:
  // Every restaurant record carries an explicit `meal_types` array (e.g., ['breakfast', 'lunch', 'dinner'] or ['brunch', 'lunch']).
  // For 'breakfast':
  //   a) Must have 'breakfast' in r.meal_types AND r.serves_breakfast === true, AND
  //   b) Primary opening must be strictly before 10:00 AM (< 600 minutes; 10:00 AM openers like Calle Ocho Cuban Cafecito are ['brunch', 'lunch']), AND
  //   c) Must be open today.
  function qualifiesForMealTab(r, mealTab, now = new Date()) {
    if (!mealTab) return true;
    if (mealTab === 'open_now') return isOpenRightNow(r, now);

    const mealTypesArr = Array.isArray(r.meal_types)
      ? r.meal_types
      : Array.isArray(r.meals)
        ? r.meals
        : (r.tags || []);
    const openMin = typeof r.opening_hour_minutes === 'number'
      ? r.opening_hour_minutes
      : parseEarliestOpeningMinutes(r.hours);

    if (mealTab === 'breakfast') {
      const hasBreakfastTag = mealTypesArr.includes('breakfast') && r.serves_breakfast !== false;
      const opensBefore10AM = openMin < 600; // Must open before 10:00 AM (7am, 8am, or 9am); 10:00 AM openers go to Brunch/Lunch
      return hasBreakfastTag && opensBefore10AM && !isClosedToday(r, now);
    }

    if (mealTab === 'brunch') {
      const hasBrunchTag = mealTypesArr.includes('brunch') || (r.tags || []).includes('brunch');
      return hasBrunchTag && openMin <= 690 && !isClosedToday(r, now);
    }

    if (mealTab === 'dinner') {
      const hasDinnerTag = mealTypesArr.includes('dinner') || (r.tags || []).includes('dinner');
      const closesEarlyAt3PM = /3:00\s*pm/i.test(r.hours || '') && !/8:|9:|10:|11:/i.test(r.hours || '');
      return hasDinnerTag && !closesEarlyAt3PM && !isClosedToday(r, now);
    }

    return mealTypesArr.includes(mealTab) && !isClosedToday(r, now);
  }

  // ---------- Operational Status Pill & Today's Live Hours Helper ----------
  function formatTimeRangeClean(rawRange) {
    return rawRange
      .replace(/(\d{1,2}(?::\d{2})?)\s*(am|pm)/gi, (_, t, ap) => {
        const cleanT = t.includes(':') ? t : `${t}:00`;
        return `${cleanT} ${ap.toUpperCase()}`;
      })
      .replace(/\s*[–-]\s*/g, ' – ')
      .trim();
  }

  function getTodayHoursSummary(r, now = new Date()) {
    const full = (r.hours || 'Daily 11:00am–8:30pm').trim();
    if (isClosedToday(r, now)) {
      return { todayText: 'Today: Closed', fullSchedule: full, hasWeeklyBreakdown: true };
    }
    const parenMatch = full.match(/\(([^)]+)\)/);
    const parenNote = parenMatch ? parenMatch[1].trim() : '';
    const stripped = full.replace(/\([^)]*\)/g, '').trim();
    const parts = stripped.split(/\s*[·•]\s*/).filter((p) => p && !/^closed/i.test(p));
    const dayIdx = now.getDay(); // 0=Sun..6=Sat
    const dayMap = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

    const exprMatchesDay = (exprStr) => {
      const s = exprStr.toLowerCase();
      if (s.includes('daily')) return true;
      const rangeRegex = /(sun|mon|tue|wed|thu|fri|sat)\s*[–-]\s*(sun|mon|tue|wed|thu|fri|sat)/g;
      let rm;
      let matchedAnyRange = false;
      while ((rm = rangeRegex.exec(s)) !== null) {
        matchedAnyRange = true;
        const start = dayMap[rm[1]];
        const end = dayMap[rm[2]];
        if (start <= end ? (dayIdx >= start && dayIdx <= end) : (dayIdx >= start || dayIdx <= end)) {
          return true;
        }
      }
      const singleRegex = /\b(sun|mon|tue|wed|thu|fri|sat)\b/g;
      let sm;
      while ((sm = singleRegex.exec(s)) !== null) {
        if (!matchedAnyRange && dayMap[sm[1]] === dayIdx) return true;
        if (s.includes('&') && dayMap[sm[1]] === dayIdx) return true;
      }
      return false;
    };

    const matchesDay = (seg) => {
      const s = seg.toLowerCase();
      if (s.includes('daily')) return true;
      const tokMatch = s.match(/^([a-z–\-&\s]+?)\s+\d/);
      if (!tokMatch) return false;
      return exprMatchesDay(tokMatch[1]);
    };

    const matchedSeg = parts.find(matchesDay) || parts[0] || stripped;
    const timeMatch = matchedSeg.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)\s*[–-]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
    const todayRange = timeMatch ? formatTimeRangeClean(timeMatch[1]) : '11:00 AM – 8:30 PM';

    // Check if parenthetical breakfast note (e.g. "Silog Breakfast Sat–Sun 9–11am") applies to today
    let specialTodayNote = '';
    if (parenNote && exprMatchesDay(parenNote)) {
      specialTodayNote = parenNote.replace(/\b(sun|mon|tue|wed|thu|fri|sat)(\s*[–-]\s*(sun|mon|tue|wed|thu|fri|sat))?\s*/gi, '').trim();
    }

    const hasWeeklyBreakdown = parts.length > 1 || Boolean(parenNote) || /closed/i.test(full);

    return {
      todayText: specialTodayNote ? `Today: ${todayRange} (${specialTodayNote})` : `Today: ${todayRange}`,
      fullSchedule: full,
      hasWeeklyBreakdown
    };
  }

  function getOperationalPill(r) {
    const an = getAnalytics(r);
    const st = an.kitchenStatus || r.kitchenStatus || 'open';
    if (st === 'low_prep') {
      return { cls: 'low_prep', dot: '🟡', text: 'Low on Prep' };
    }
    if (st === 'sold_out' || isClosedToday(r)) {
      return { cls: 'sold_out', dot: '🔴', text: 'Closed Today' };
    }
    return { cls: 'open', dot: '🟢', text: 'Open Now' };
  }

  // ---------- Directions URL Helper ----------
  function getMapsUrl(r) {
    const dest = `${r.name}, ${r.address}, ${r.city}, ${r.state || 'CA'} ${r.zip || ''}`.trim();
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
  }

  async function api(path, opts = {}) {
    if (!IS_STANDALONE) {
      try {
        const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...opts });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Something went wrong');
        return data;
      } catch (e) {
        if (!window.__HFG_OFFLINE_SEED__) throw e;
      }
    }
    let list = [];
    try { list = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch {}
    const offlineSeed = window.__HFG_OFFLINE_SEED__;
    // Auto-migrate or sync if localStorage has older/fewer restaurants than the bundled offline seed
    if (!Array.isArray(list) || !list.length || (Array.isArray(offlineSeed) && offlineSeed.length !== list.length)) {
      list = JSON.parse(JSON.stringify(offlineSeed || []));
      try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
    }
    if (path === '/api/restaurants' && (!opts.method || opts.method === 'GET')) return list;
    if (path === '/api/restaurants' && opts.method === 'POST') {
      const b = JSON.parse(opts.body || '{}');
      const r = {
        id: `${(b.name || 'gem').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`,
        name: b.name, cuisine: b.cuisine || 'Other', tags: b.tags || [], price: +b.price || 1,
        address: b.address, city: b.city, phone: b.phone || '', hours: b.hours || 'Daily 11:00am–8:30pm',
        kitchenStatus: 'open', statusLabel: 'Open Now • Closing at 8:30 PM', pricesVerified: 'October 2026',
        analytics: { ownerName: b.ownerName || 'Owner', calls: 1, directions: 1, stripeUrl: 'https://buy.stripe.com/demo_renewal_10mo' },
        description: b.description || '', story: b.story || '', image: '', photos: [], media: [], ratings: [],
        sample: false, createdAt: new Date().toISOString()
      };
      list.push(r);
      try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
      return r;
    }
    const mRate = /^\/api\/restaurants\/([^/]+)\/ratings$/.exec(path);
    if (mRate && opts.method === 'POST') {
      const id = decodeURIComponent(mRate[1]);
      const b = JSON.parse(opts.body || '{}');
      const r = list.find((x) => x.id === id);
      if (!r) throw new Error('Restaurant not found');
      r.ratings.unshift({ stars: +b.stars, name: b.name || 'Anonymous', comment: b.comment || '', date: new Date().toISOString() });
      try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
      return r;
    }
    throw new Error('Offline mode action');
  }

  const replaceRestaurant = (r) => {
    const i = state.restaurants.findIndex((x) => x.id === r.id);
    if (i >= 0) state.restaurants[i] = r; else state.restaurants.push(r);
    if (IS_STANDALONE) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(state.restaurants)); } catch {}
    }
  };
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text }); document.body.append(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove(); return ok;
    }
  }

  // ---------- Multi-Filter Intersection (Strict AND Logic + Haversine Proximity Sorting) ----------
  function filtered() {
    const now = new Date();
    const q = state.q.trim().toLowerCase();
    const activeZip = getActiveZipQuery();
    const isGpsActive = Boolean(state.userGpsCoords);
    // If Open Right Now or Near Me GPS is active, default radius is 5 miles; if a 5-digit ZIP is entered, default proximity radius is 10 miles (or user-selected radius)
    const activeRadius = state.mealTab === 'open_now'
      ? (state.radiusMiles || 5)
      : isGpsActive
        ? (state.radiusMiles || 5)
        : state.radiusMiles > 0
          ? state.radiusMiles
          : activeZip
            ? 10
            : 0;

    let list = state.restaurants.filter((r) => {
      // 0. Hide any inactive listing or restaurant closed on Monday/Tuesday or closed today
      if (r.is_active === false || isClosedMonOrTue(r) || isClosedToday(r, now)) return false;

      // 1. Active Meal Tab (strict 2-part Breakfast validation: serves_breakfast && opens <= 10:00 AM)
      if (!qualifiesForMealTab(r, state.mealTab, now)) return false;

      // 2. Active Region / County
      if (state.region && r.region !== state.region && r.county !== state.region) return false;

      // 3. Active City ("All SoCal Cities" when empty)
      if (state.city && r.city !== state.city) return false;

      // 4. Active Cuisine / Dietary / Protein Category
      if (state.cuisine) {
        const cLow = state.cuisine.toLowerCase();
        const cuisineMatch = (r.cuisine || '').toLowerCase().includes(cLow);
        const tagMatch = (r.tags || []).some((t) => String(t).toLowerCase() === cLow || String(t).toLowerCase().includes(cLow));
        if (!cuisineMatch && !tagMatch) return false;
      }

      // 5. Grade-A Health Permit Filter
      if (state.gradeAOnly && (!r.healthPermit || r.healthPermit.grade !== 'A' || (r.healthPermit.score && r.healthPermit.score < 90))) return false;

      // 6. Selected Price Tiers
      if (state.prices.size && !state.prices.has(r.price)) return false;

      // 7. Selected Dietary / Dish Chips
      for (const c of state.chips) {
        if (!(r.tags || []).includes(c) && !(r.cuisine || '').toLowerCase().includes(c)) return false;
      }

      // 8. Haversine Proximity Filter (when Open Right Now, Near Me GPS, radius dropdown, or 5-digit ZIP code is active)
      if (activeRadius > 0) {
        if (getDistanceMiles(r) > activeRadius) return false;
      }

      // 9. Keyword Search (when q is NOT a 5-digit ZIP code; 5-digit ZIP codes are resolved via lat/long Haversine above)
      if (q && !activeZip) {
        const menuText = r.structuredMenu
          ? Object.values(r.structuredMenu).flat().map((i) => `${i.name} ${i.desc}`).join(' ')
          : '';
        const hay = `${r.name} ${r.cuisine} ${r.regionalIdentity || ''} ${r.city} ${r.county || ''} ${r.region || ''} ${r.zip || ''} ${r.destinationDish?.name || ''} ${menuText} ${(r.tags || []).join(' ')} ${r.address}`.toLowerCase();
        if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
      }

      return true;
    });

    // If GPS location, a 5-digit ZIP code, active Meal Tab, or proximity radius is active, order strictly by nearest distance first (ORDER BY distance ASC)
    const sortByProximityFirst = isGpsActive || Boolean(activeZip) || Boolean(state.mealTab) || state.radiusMiles > 0;

    const sorters = {
      gem: (a, b) => {
        if (sortByProximityFirst) {
          return getDistanceMiles(a) - getDistanceMiles(b) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || gemScore(b) - gemScore(a);
        }
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || getDistanceMiles(a) - getDistanceMiles(b) || gemScore(b) - gemScore(a);
      },
      health: (a, b) => (b.healthPermit?.score || 0) - (a.healthPermit?.score || 0) || getDistanceMiles(a) - getDistanceMiles(b),
      top: (a, b) => avg(b) - avg(a) || getDistanceMiles(a) - getDistanceMiles(b),
      hidden: (a, b) => a.ratings.length - b.ratings.length || getDistanceMiles(a) - getDistanceMiles(b),
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      az: (a, b) => a.name.localeCompare(b.name),
    };
    return list.sort(sorters[state.sort] || sorters.gem);
  }

  // ---------- Card Front Menu Builder (Signatures Only + Dotted Leader Price Alignment) ----------
  function renderCardMenuSection(r) {
    const sm = r.structuredMenu;
    if (!sm) return '';
    const availableCats = MENU_CAT_META.filter(([key]) => Array.isArray(sm[key]) && sm[key].length > 0);
    if (!availableCats.length) return '';

    let items = [...(sm.signatures || [])];
    if (items.length < 3) {
      for (const [k] of availableCats) {
        if (k === 'signatures') continue;
        for (const it of (sm[k] || [])) {
          if (items.length < 3) items.push(it);
        }
      }
    }
    items = items.slice(0, 3);

    return `
      <div class="card-menu-box" data-menu-box="${esc(r.id)}">
        <div class="card-cat-tabs" aria-label="Signatures">
          <span class="card-cat-tab active" style="cursor:default">🔥 Signatures</span>
        </div>
        <div class="card-price-list">
          ${items.map((it) => `
            <div class="card-price-row">
              <span class="card-price-name" title="${esc(it.name)}">${esc(it.name)}</span>
              <span class="card-price-dots" aria-hidden="true"></span>
              <span class="card-price-val">${esc(it.price || '')}</span>
            </div>`).join('')}
        </div>
        <div class="verified-price-stamp">
          <span>✓ Prices verified direct with kitchen: ${esc(r.pricesVerified || 'October 2026')}</span>
        </div>
      </div>`;
  }

  // ---------- Dynamic City Dropdown (SELECT DISTINCT city, COUNT(id) AS spot_count WHERE is_active = TRUE HAVING COUNT(id) > 0 ORDER BY city ASC) ----------
  function getActiveCityCounts(now = new Date()) {
    const counts = new Map();
    for (const r of state.restaurants) {
      if (r.is_active === false || !r.city) continue;
      if (isClosedMonOrTue(r) || isClosedToday(r, now)) continue;
      if (!qualifiesForMealTab(r, state.mealTab, now)) continue;
      if (state.region && r.region !== state.region && r.county !== state.region) continue;
      if (state.cuisine) {
        const cLow = state.cuisine.toLowerCase();
        const cuisineMatch = (r.cuisine || '').toLowerCase().includes(cLow);
        const tagMatch = (r.tags || []).some((t) => String(t).toLowerCase() === cLow || String(t).toLowerCase().includes(cLow));
        if (!cuisineMatch && !tagMatch) continue;
      }
      if (state.gradeAOnly && (!r.healthPermit || r.healthPermit.grade !== 'A' || (r.healthPermit.score && r.healthPermit.score < 90))) continue;
      if (state.prices.size && !state.prices.has(r.price)) continue;
      let chipMatch = true;
      for (const c of state.chips) {
        if (!(r.tags || []).includes(c) && !(r.cuisine || '').toLowerCase().includes(c)) {
          chipMatch = false;
          break;
        }
      }
      if (!chipMatch) continue;
      counts.set(r.city, (counts.get(r.city) || 0) + 1);
    }
    return [...counts.entries()]
      .filter(([, spot_count]) => spot_count > 0)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([city, spot_count]) => ({ city, spot_count }));
  }

  function syncCityDropdown(now = new Date()) {
    const cityEl = $('#city');
    if (!cityEl) return;
    const cityCounts = getActiveCityCounts(now);
    const totalSpots = cityCounts.reduce((acc, x) => acc + x.spot_count, 0);
    if (state.city && !cityCounts.some((x) => x.city === state.city)) {
      state.city = '';
    }
    const defaultLabel = state.region
      ? `📍 All Cities in ${state.region} (${totalSpots})`
      : `📍 All Verified Cities (${totalSpots})`;
    cityEl.innerHTML =
      `<option value="">${esc(defaultLabel)}</option>` +
      cityCounts
        .map(({ city, spot_count }) => `<option value="${esc(city)}" ${city === state.city ? 'selected' : ''}>${esc(city)} (${spot_count})</option>`)
        .join('');
    cityEl.value = state.city;
  }

  const DIETARY_OPTIONS = [
    ['vegetarian-only', '🥗 Vegetarian Only'],
    ['vegan', '🌱 Vegan'],
    ['halal', '☪️ Halal'],
    ['kosher', '✡️ Kosher'],
  ];
  const PROTEIN_OPTIONS = [
    ['chicken', '🍗 Chicken'],
    ['beef', '🥩 Beef'],
    ['pork', '🥓 Pork'],
    ['seafood', '🦐 Seafood'],
    ['bbq', '🔥 BBQ'],
  ];

  // ---------- Home ----------
  function renderHome() {
    const cityCounts = getActiveCityCounts();
    const totalActiveCitySpots = cityCounts.reduce((acc, x) => acc + x.spot_count, 0);
    const availableCuisines = [...new Set(state.restaurants.filter((r) => r.is_active !== false).map((r) => r.cuisine))].filter(Boolean).sort();
    const visibleCount = state.restaurants.filter((r) => r.is_active !== false && !isClosedMonOrTue(r) && !isClosedToday(r)).length;
    const hasSecondaryFilters = Boolean(state.region || state.radiusMiles || state.gradeAOnly || state.prices.size || state.sort !== 'gem');
    view.innerHTML = `
      <section class="hero">
        <div class="hero-inner">
          <span class="eyebrow">💎 Verified Independent Culinary Roster · United States</span>
          <h1>Great food,<br><span>hiding in plain sight.</span></h1>
          <p>${visibleCount.toLocaleString()} independent mom-and-pop kitchens verified from official public health inspection records—with live kitchen status, verified menu prices, direct calling, and turn-by-turn navigation.</p>
          <form class="search" id="search-form" role="search">
            <input id="q" type="search" placeholder="Search dish, cuisine, city, or 5-digit ZIP (e.g. 91761, birria, pho)…" value="${esc(state.q)}" autocomplete="off" />
            <button class="btn btn-near-me" id="btn-near-me" type="button" title="Use current GPS location to find nearest open gems">
              <span class="gps-icon">📍</span>
              <span>Near Me</span>
            </button>
            <button class="btn" type="submit">Find gems</button>
          </form>
        </div>
      </section>
      <section class="filters" aria-label="Filters">
        <div class="filters-inner">
          <div class="meal-tabs-wrap">
            <div class="meal-tabs" id="meal-tabs" role="tablist" aria-label="Filter by Meal Time">
              ${MEAL_TABS.map(([k, l, emo]) => `
                <button type="button" role="tab" class="meal-tab ${state.mealTab === k ? 'active' : ''}" data-meal="${k}" aria-selected="${state.mealTab === k}">
                  <span>${emo}</span><span>${l}${k === 'open_now' ? ' (5 mi)' : ''}</span>
                </button>`).join('')}
            </div>
          </div>
          <div class="filter-bar">
            <div class="filter-primary-row">
              <select class="select" id="cuisineSelect" aria-label="Cuisines, Dietary & Proteins">
                <option value="">🍽️ All Cuisines & Categories</option>
                <optgroup label="🥗 Dietary & Faith">
                  ${DIETARY_OPTIONS.map(([val, lbl]) => `<option value="${esc(val)}" ${val === state.cuisine ? 'selected' : ''}>${esc(lbl)}</option>`).join('')}
                </optgroup>
                <optgroup label="🥩 Proteins & BBQ">
                  ${PROTEIN_OPTIONS.map(([val, lbl]) => `<option value="${esc(val)}" ${val === state.cuisine ? 'selected' : ''}>${esc(lbl)}</option>`).join('')}
                </optgroup>
                <optgroup label="🌎 Cuisines (A–Z)">
                  ${availableCuisines.map((c) => `<option value="${esc(c)}" ${c === state.cuisine ? 'selected' : ''}>${ emojiFor({ cuisine: c }) } ${esc(c)}</option>`).join('')}
                </optgroup>
              </select>
              <button type="button" class="mobile-filter-btn ${state.mobileFiltersOpen || hasSecondaryFilters ? 'active' : ''}" id="mobileFilterToggle" aria-expanded="${Boolean(state.mobileFiltersOpen || hasSecondaryFilters)}">
                ⚙️ <span>Filters</span>
              </button>
            </div>
            <div class="filter-secondary-row ${state.mobileFiltersOpen || hasSecondaryFilters ? 'open' : ''}" id="filterSecondary">
              <select class="select" id="radiusSelect" aria-label="Distance Radius">
                <option value="0" ${!state.radiusMiles ? 'selected' : ''}>📏 All Distances</option>
                <option value="5" ${state.radiusMiles === 5 ? 'selected' : ''}>📍 Within 5 Miles (Default Open Now)</option>
                <option value="10" ${state.radiusMiles === 10 ? 'selected' : ''}>📍 Within 10 Miles</option>
                <option value="15" ${state.radiusMiles === 15 ? 'selected' : ''}>📍 Within 15 Miles</option>
                <option value="25" ${state.radiusMiles === 25 ? 'selected' : ''}>📍 Within 25 Miles</option>
              </select>
              <select class="select" id="region" aria-label="Region or Market">
                <option value="">🌎 All Regions / Metros</option>
                ${SOCAL_REGIONS.map((reg) => `<option value="${reg.id}" ${reg.id === state.region ? 'selected' : ''}>${reg.label}</option>`).join('')}
              </select>
              <select class="select" id="sort" aria-label="Sort">
                <option value="gem">📌 Featured & Hidden Gems First</option>
                <option value="health">🛡️ Highest Health Score (100 → 90)</option>
                <option value="top">⭐ Top Rated</option>
                <option value="hidden">🕵️ Most Hidden (Fewest Ratings)</option>
                <option value="az">A–Z</option>
              </select>
              <div class="price-toggle" role="group" aria-label="Price">
                ${[1, 2, 3].map((p) => `<button data-price="${p}" aria-pressed="${state.prices.has(p)}">${price(p)}</button>`).join('')}
              </div>
              <button class="clear-link" id="clear">Clear All</button>
            </div>
          </div>
        </div>
      </section>
      <div class="wrap">
        <div class="results-head"><h2 id="results-title">Verified gems across the United States</h2><span id="results-count"></span></div>
        <div class="community-notice-banner" role="note">
          <span class="notice-icon">💡</span>
          <p><b>Please Note:</b> Before visiting, please double-check the restaurant, neighborhood, current hours, and recent ratings directly on the restaurant's official website, social media, or phone. Information and ratings can change quickly!</p>
        </div>
        <div class="grid" id="grid"></div>
        <div class="load-more-wrap" id="load-more-container" hidden>
          <button type="button" class="btn-load-more" id="btn-load-more">
            <span>Show More Gems ⬇️</span>
          </button>
        </div>
        <div class="cta-band">
          <div class="bg-emo">👩‍🍳</div>
          <h3>Own a small restaurant?</h3>
          <p>Contact us to inquire about getting your restaurant listed.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <a class="btn btn-gold" href="#/add">📩 Contact Us</a>
          </div>
        </div>
      </div>`;

    if ($('#sort')) $('#sort').value = state.sort;
    if ($('#region')) $('#region').value = state.region;
    if ($('#city')) $('#city').value = state.city;
    if ($('#cuisineSelect')) $('#cuisineSelect').value = state.cuisine;
    if ($('#radiusSelect')) $('#radiusSelect').value = String(state.radiusMiles || 0);

    const mobToggle = $('#mobileFilterToggle');
    const secRow = $('#filterSecondary');
    if (mobToggle && secRow) {
      mobToggle.addEventListener('click', () => {
        state.mobileFiltersOpen = !secRow.classList.contains('open');
        secRow.classList.toggle('open', state.mobileFiltersOpen);
        mobToggle.classList.toggle('active', state.mobileFiltersOpen);
        mobToggle.setAttribute('aria-expanded', String(state.mobileFiltersOpen));
      });
    }

    $('#meal-tabs').addEventListener('click', (e) => {
      const b = e.target.closest('[data-meal]'); if (!b) return;
      state.mealTab = b.dataset.meal;
      if (state.mealTab === 'open_now') {
        state.radiusMiles = 5;
      } else if (state.radiusMiles === 5) {
        state.radiusMiles = 0;
      }
      if ($('#radiusSelect')) $('#radiusSelect').value = String(state.radiusMiles || 0);
      state.limit = 24;
      $('#meal-tabs').querySelectorAll('.meal-tab').forEach((el) => {
        const on = el.dataset.meal === state.mealTab;
        el.classList.toggle('active', on);
        el.setAttribute('aria-selected', on);
      });
      renderResults();
    });

    $('#radiusSelect').addEventListener('change', (e) => {
      state.radiusMiles = +e.target.value || 0;
      state.limit = 24;
      renderResults();
    });
    let activeGeocodeAbortController = null;
    let qDebounceTimer = null;

    async function handleSearchInput(scroll = false) {
      state.limit = 24;
      const mZip = getActiveZipQuery();
      if (mZip) {
        // Clear region and city dropdowns when querying an explicit ZIP
        if (state.region) {
          state.region = '';
          if ($('#region')) $('#region').value = '';
        }
        if (state.city) {
          state.city = '';
          if ($('#city')) $('#city').value = '';
        }

        // Cancel previous pending fetch if any
        if (activeGeocodeAbortController) {
          activeGeocodeAbortController.abort();
          activeGeocodeAbortController = null;
        }

        // 1. Immediately apply synchronous cached or prefix coordinates for 0ms rendering
        const initialInfo = geocodedZipCache.get(mZip) || getZipPrefixInfo(mZip) || null;
        if (!state.geocodedInfo || state.geocodedInfo.zip !== mZip) {
          state.geocodedInfo = initialInfo;
        }
        renderResults(scroll);

        // 2. Asynchronously enrich fine-grained city and coordinates (with abort support)
        const controller = new AbortController();
        activeGeocodeAbortController = controller;
        try {
          const enrichedGeo = await resolveZipGeocode(mZip, controller.signal);
          if (enrichedGeo && getActiveZipQuery() === mZip) {
            state.geocodedInfo = enrichedGeo;
            renderResults(false);
          }
        } catch (e) {
          if (e.name !== 'AbortError') console.error('Geocode error:', e);
        } finally {
          if (activeGeocodeAbortController === controller) {
            activeGeocodeAbortController = null;
          }
        }
      } else {
        // Reset location filter state cleanly if input is not a 5-digit ZIP
        if (activeGeocodeAbortController) {
          activeGeocodeAbortController.abort();
          activeGeocodeAbortController = null;
        }
        state.geocodedInfo = null;
        renderResults(scroll);
      }
    }

    // Near Me GPS Button
    const nearMeBtn = $('#btn-near-me');
    if (nearMeBtn) {
      if (state.userGpsCoords) {
        nearMeBtn.classList.add('active');
        nearMeBtn.title = 'GPS active (Tap to refresh or reset)';
      }
      nearMeBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
          toast('⚠️ Geolocation is not supported by your browser.');
          return;
        }
        nearMeBtn.classList.add('loading');
        nearMeBtn.querySelector('span:last-child').textContent = 'Locating…';

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            nearMeBtn.classList.remove('loading');
            nearMeBtn.classList.add('active');
            nearMeBtn.querySelector('span:last-child').textContent = 'Near Me';

            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            state.userGpsCoords = [lat, lng];
            state.userGpsLabel = 'Current Location';
            state.radiusMiles = 5; // Default 5 miles for immediate driving vicinity
            state.mealTab = 'open_now'; // Auto-filter to Open Right Now for drivers!
            state.limit = 24;

            // Clear text query & region so nearest GPS results take top priority
            state.q = '';
            state.region = '';
            state.city = '';
            if ($('#q')) $('#q').value = '';
            if ($('#region')) $('#region').value = '';
            if ($('#radiusSelect')) $('#radiusSelect').value = '5';

            // Sync meal tabs visually
            $('#meal-tabs').querySelectorAll('.meal-tab').forEach((el) => {
              const on = el.dataset.meal === 'open_now';
              el.classList.toggle('active', on);
              el.setAttribute('aria-selected', on);
            });

            toast('📍 Location found! Showing open gems within 5 miles.');
            renderResults(true);
          },
          (err) => {
            nearMeBtn.classList.remove('loading');
            console.warn('Geolocation error:', err);
            let msg = 'Could not get location. Check browser location permissions.';
            if (err.code === 1) msg = 'Location permission denied. Please allow location access.';
            toast(`⚠️ ${msg}`);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
        );
      });
    }

    // Auto-Trigger on 5 Digits / Input Listener
    $('#q').addEventListener('input', (e) => {
      const rawVal = e.target.value;
      state.q = rawVal;
      clearTimeout(qDebounceTimer);

      const trimmed = (rawVal || '').trim();
      const isExact5Zip = /^\d{5}$/.test(trimmed);

      // Guard: If user cleared input or length < 5 digits, cancel pending fetches and reset cleanly
      if (!trimmed || trimmed.length < 5) {
        if (activeGeocodeAbortController) {
          activeGeocodeAbortController.abort();
          activeGeocodeAbortController = null;
        }
        if (state.geocodedInfo) {
          state.geocodedInfo = null;
          state.limit = 24;
          renderResults(false);
          return;
        }
      }

      if (isExact5Zip) {
        // Auto-Trigger immediately upon completing 5 numeric digits!
        // Instant synchronous render (0ms) + debounced 200ms API enrich guard
        const immediateInfo = geocodedZipCache.get(trimmed) || getZipPrefixInfo(trimmed) || null;
        state.geocodedInfo = immediateInfo;
        state.limit = 24;
        renderResults(false);
        qDebounceTimer = setTimeout(() => handleSearchInput(false), 200);
      } else {
        const zipQuery = getActiveZipQuery();
        if (zipQuery) {
          state.geocodedInfo = geocodedZipCache.get(zipQuery) || getZipPrefixInfo(zipQuery) || null;
          state.limit = 24;
          renderResults(false);
          qDebounceTimer = setTimeout(() => handleSearchInput(false), 250);
        } else {
          state.geocodedInfo = null;
          state.limit = 24;
          qDebounceTimer = setTimeout(() => renderResults(false), 150);
        }
      }
    });

    $('#search-form').addEventListener('submit', (e) => {
      e.preventDefault();
      clearTimeout(qDebounceTimer);
      $('#q').blur();
      handleSearchInput(true);
    });

    $('#region').addEventListener('change', (e) => {
      state.region = e.target.value;
      state.city = '';
      state.limit = 24;
      renderHome();
    });
    if ($('#city')) $('#city').addEventListener('change', (e) => { state.city = e.target.value; state.limit = 24; renderResults(); });
    $('#cuisineSelect').addEventListener('change', (e) => { state.cuisine = e.target.value; state.limit = 24; renderResults(); });
    $('#sort').addEventListener('change', (e) => { state.sort = e.target.value; renderResults(); });
    const gradeABtn = $('#gradeAToggle');
    if (gradeABtn) {
      gradeABtn.addEventListener('click', (e) => {
        state.gradeAOnly = !state.gradeAOnly;
        e.currentTarget.classList.toggle('active', state.gradeAOnly);
        state.limit = 24;
        renderResults();
      });
    }
    $('.price-toggle').addEventListener('click', (e) => {
      const b = e.target.closest('[data-price]'); if (!b) return;
      const p = +b.dataset.price; state.prices.has(p) ? state.prices.delete(p) : state.prices.add(p);
      b.setAttribute('aria-pressed', state.prices.has(p)); state.limit = 24; renderResults();
    });
    $('#clear').addEventListener('click', () => {
      Object.assign(state, { q: '', mealTab: '', radiusMiles: 0, region: '', city: '', cuisine: '', gradeAOnly: false, sort: 'gem', limit: 24, mobileFiltersOpen: false, userGpsCoords: null, userGpsLabel: '' });
      state.chips.clear(); state.prices.clear(); renderHome();
    });
    const loadMoreBtn = $('#btn-load-more');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        state.limit = (state.limit || 24) + 24;
        renderResults();
      });
    }

    // Card interactions: Weekly hours toggle, Call tracking, Route Directions tracking, or Detail open
    $('#grid').addEventListener('click', async (e) => {
      const hrsBtn = e.target.closest('[data-hours-toggle]');
      if (hrsBtn) {
        e.stopPropagation();
        const cardEl = hrsBtn.closest('.card');
        const pop = cardEl ? cardEl.querySelector('.weekly-hours-popover') : null;
        if (pop) {
          pop.hidden = !pop.hidden;
          hrsBtn.setAttribute('aria-expanded', String(!pop.hidden));
        }
        return;
      }

      const catBtn = e.target.closest('[data-card-cat]');
      if (catBtn) {
        e.stopPropagation();
        const restId = catBtn.dataset.restId;
        state.cardMenuCat[restId] = catBtn.dataset.cardCat;
        const r = state.restaurants.find((x) => x.id === restId);
        const box = catBtn.closest('[data-menu-box]');
        if (r && box) {
          box.outerHTML = renderCardMenuSection(r);
        }
        return;
      }

      const callBtn = e.target.closest('[data-track-call]');
      if (callBtn) {
        e.stopPropagation();
        const restId = callBtn.dataset.trackCall;
        recordClickEvent(restId, 'call');
        return; // Allow native tel: link to dial and silently record click in backend
      }

      const mapBtn = e.target.closest('[data-track-map]');
      if (mapBtn) {
        e.stopPropagation();
        const restId = mapBtn.dataset.trackMap;
        recordClickEvent(restId, 'direction');
        return; // Allow native Maps link to open and silently record route in backend
      }

      const c = e.target.closest('[data-id]');
      if (c) location.hash = `#/r/${c.dataset.id}`;
    });

    $('#grid').addEventListener('keydown', (e) => {
      const c = e.target.closest('[data-id]');
      if (c && e.target === c && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        location.hash = `#/r/${c.dataset.id}`;
      }
    });
    renderResults();
  }

  function renderResults(scroll = false) {
    const grid = $('#grid'); if (!grid) return;
    syncCityDropdown();
    const list = filtered();
    const activeZip = getActiveZipQuery();
    const isGpsActive = Boolean(state.userGpsCoords);
    const activeRadius = state.mealTab === 'open_now'
      ? (state.radiusMiles || 5)
      : isGpsActive
        ? (state.radiusMiles || 5)
        : state.radiusMiles > 0
          ? state.radiusMiles
          : activeZip
            ? 10
            : 0;
    const geo = state.geocodedInfo;
    const geoLabel = isGpsActive
      ? (state.userGpsLabel || 'Current Location')
      : geo && geo.city && geo.state
        ? `${geo.city}, ${geo.state} (${geo.zip})`
        : activeZip
          ? `ZIP ${activeZip}`
          : '';

    const active = [
      ...(state.mealTab === 'open_now'
        ? [`🟢 Open Right Now (Within ${activeRadius} Miles)`]
        : state.mealTab
          ? [TAG_LABEL[state.mealTab]]
          : []),
      ...(isGpsActive
        ? [`📍 Near Your Location (Within ${activeRadius} Miles · Closest First)`]
        : activeZip
          ? [`📍 Near ${geoLabel} (Within ${activeRadius} Miles · Nearest First)`]
          : activeRadius > 0 && state.mealTab !== 'open_now'
            ? [`📍 Within ${activeRadius} Miles`]
            : []),
      ...[...state.chips].map((c) => TAG_LABEL[c])
    ];

    let scopeLabel = 'Verified gems across the United States';
    if (isGpsActive) {
      scopeLabel = `Verified gems near your current location`;
    } else if (geo && geo.state && geo.state !== 'CA') {
      scopeLabel = geo.city ? `Verified gems near ${geo.city}, ${geo.state}` : `Verified gems near ${geo.state} (${activeZip})`;
    } else if (geo && geo.city && geo.state) {
      scopeLabel = `Verified gems near ${geo.city}, ${geo.state}`;
    } else if (activeZip) {
      scopeLabel = `Verified gems near ${activeZip}`;
    } else if (state.city) {
      scopeLabel = `Verified gems in ${state.city}`;
    } else if (state.region) {
      scopeLabel = `Verified gems in ${state.region}`;
    }

    if (isGpsActive) {
      const radiusPrefix = ` (Within ${activeRadius} Miles · Closest First)`;
      const otherChips = [...state.chips].map((c) => TAG_LABEL[c]);
      const mealPrefix = state.mealTab && state.mealTab !== 'open_now' ? [TAG_LABEL[state.mealTab]] : [];
      const parts = [...mealPrefix, ...otherChips];
      $('#results-title').textContent = parts.length
        ? `📍 ${scopeLabel}${radiusPrefix} · ${parts.join(' + ')}`
        : `📍 ${scopeLabel}${radiusPrefix}`;
    } else if (activeZip) {
      const radiusPrefix = activeRadius > 0 ? ` (Within ${activeRadius} Miles · Nearest First)` : '';
      const otherChips = [...state.chips].map((c) => TAG_LABEL[c]);
      const mealPrefix = state.mealTab && state.mealTab !== 'open_now' ? [TAG_LABEL[state.mealTab]] : [];
      const parts = [...mealPrefix, ...otherChips];
      $('#results-title').textContent = parts.length
        ? `📍 ${scopeLabel}${radiusPrefix} · ${parts.join(' + ')}`
        : `📍 ${scopeLabel}${radiusPrefix}`;
    } else {
      $('#results-title').textContent = active.length ? `${active.join(' + ')} · ${scopeLabel}` : scopeLabel;
    }

    const PAGE_SIZE = 24;
    const currentLimit = state.limit || PAGE_SIZE;
    const pageItems = list.slice(0, currentLimit);

    $('#results-count').textContent = `Showing ${pageItems.length} of ${list.length.toLocaleString()} ${list.length === 1 ? 'spot' : 'spots'}`;

    const loadMoreContainer = $('#load-more-container');
    const loadMoreBtn = $('#btn-load-more');
    if (loadMoreContainer) {
      if (list.length > pageItems.length) {
        loadMoreContainer.hidden = false;
        if (loadMoreBtn) loadMoreBtn.querySelector('span').textContent = `Load More Gems (${(list.length - pageItems.length).toLocaleString()} remaining) ⬇️`;
      } else {
        loadMoreContainer.hidden = true;
      }
    }

    if (!list.length) {
      if (activeZip && geo && geo.city && geo.state) {
        const placeName = `${geo.city}, ${geo.state} (${geo.zip || activeZip})`;
        const isOutState = geo.state !== 'CA';
        grid.innerHTML = `
          <div class="empty" style="grid-column:1/-1">
            <div class="big">📍</div>
            <h3>No verified gems within ${activeRadius} miles of ${esc(placeName)}</h3>
            <p>${isOutState ? "We haven't ingested this county's public health inspection records yet. We are expanding nationally soon!" : "Try expanding the distance radius or searching an adjacent city or ZIP code."}</p>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:14px;flex-wrap:wrap">
              <button class="btn btn-gold" onclick="document.getElementById('clear').click()">Reset to All Gems</button>
              ${isOutState ? `<a class="btn btn-ghost" href="#/add">📩 Request Ingestion for ${esc(geo.city)}, ${esc(geo.state)}</a>` : ''}
            </div>
          </div>`;
      } else if (activeZip) {
        grid.innerHTML = `
          <div class="empty" style="grid-column:1/-1">
            <div class="big">🍽️</div>
            <h3>No verified gems within ${activeRadius} miles of ${esc(geoLabel || activeZip)}</h3>
            <p>Try expanding the distance radius or searching an adjacent city or ZIP code.</p>
            <button class="btn btn-gold" onclick="document.getElementById('clear').click()">Reset to All Gems</button>
          </div>`;
      } else {
        grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="big">🍽️</div><h3>No gems match that filter</h3><p>Try expanding the distance radius, switching meal tabs, or clearing a filter chip above.</p><button class="btn" onclick="document.getElementById('clear').click()">Reset filters</button></div>`;
      }
      return;
    }

    const refZipLabel = isGpsActive
      ? (state.userGpsLabel || 'Your Location')
      : (geo && geo.city && geo.state) ? `${geo.city}, ${geo.state}` : (activeZip || 'Ontario, CA');

    grid.innerHTML = pageItems.map((r, i) => {
      const b = badge(r), a = avg(r) || 5.0;
      const hp = r.healthPermit;
      const op = getOperationalPill(r);
      const hrs = getTodayHoursSummary(r);
      const distMi = getDistanceMiles(r);
      const driveMins = getDriveMinutes(distMi);
      const cleanTel = (r.phone || '').replace(/[^\d+]/g, '');
      const mapsUrl = getMapsUrl(r);

      return `
        <article class="card ${r.featured ? 'featured-card' : ''}" data-id="${esc(r.id)}" tabindex="0" style="animation-delay:${Math.min(i, 8) * 35}ms" aria-label="${esc(r.name)}">
          <div class="card-media">
            ${mediaHtml(r, false, i < 6)}
            ${b ? `<span class="badge ${b.cls}">${b.txt}</span>` : ''}
            <div class="media-flags">
              <span>${r.featured
                ? `<span class="flag pinned">📌 Featured · ${distMi.toFixed(1)} mi (${driveMins} min from ${esc(refZipLabel)})</span>`
                : `<span class="flag">📍 ${distMi.toFixed(1)} mi · ${driveMins} min from ${esc(refZipLabel)}</span>`}</span>
            </div>
          </div>
          <div class="card-body">
            ${r.regionalIdentity ? `<div class="regional-sub">${esc(r.regionalIdentity)}</div>` : ''}
            <div class="card-title">
              <h3>${esc(r.name)}</h3>
              <div class="rating-grade-row">
                ${hp ? `<span class="grade-inline-pill" title="Health Grade ${esc(hp.grade)}">Grade ${esc(hp.grade)}</span>` : ''}
                <span class="rating-pill" title="${a.toFixed(1)} Star Rating"><span class="stars-sym">${starsTxt(a)}</span> ${a.toFixed(1)}</span>
              </div>
            </div>
            <div class="meta">${emojiFor(r)} ${esc(r.cuisine)} · ${price(r.price)} · ${esc(r.city)}</div>

            <!-- 1. Dynamic Operational Status Pill & Today's Live Hours (Single Compact Line + Weekly Tooltip/Popover) -->
            <div class="op-status-box">
              <span class="op-pill ${op.cls}">${op.dot} ${esc(op.text)}</span>
              <span class="op-hours" title="Full Weekly Hours: ${esc(hrs.fullSchedule)}">
                <span>🕒 ${esc(hrs.todayText)}</span>
                ${hrs.hasWeeklyBreakdown ? `<button type="button" class="hours-info-btn" data-hours-toggle="${esc(r.id)}" title="Full Weekly Schedule: ${esc(hrs.fullSchedule)}" aria-expanded="false">ⓘ Weekly</button>` : ''}
              </span>
            </div>
            ${hrs.hasWeeklyBreakdown ? `<div class="weekly-hours-popover" hidden>📅 <b>Weekly Hours:</b> ${esc(hrs.fullSchedule)}</div>` : ''}

            <!-- 2. Scratch-Made Line Only (Full Sentence, No Ellipsis) -->
            ${r.scratchCommitment ? `
              <div class="roots-scratch-block">
                <div class="roots-scratch-line">⏱️ <b>Scratch-Made:</b> ${esc(r.scratchCommitment)}</div>
              </div>
            ` : ''}

            <!-- 3. Legible Front-of-Card Non-PDF Price List + Dotted Leader Price Alignment -->
            ${renderCardMenuSection(r)}

            <!-- 4. Direct Call & Route Directions (Silently tracked in backend across all 1,214 cards) -->
            <div class="ec-ad-box">
              <div class="ec-action-grid">
                <a class="ec-tab-btn call-btn" href="tel:${esc(cleanTel)}" data-track-call="${esc(r.id)}" title="Tap to call">
                  <span>📞 Call</span>
                  <small>${esc(r.phone || '(909) 555-0199')}</small>
                </a>
                <a class="ec-tab-btn map-btn" href="${esc(mapsUrl)}" target="_blank" rel="noopener" data-track-map="${esc(r.id)}" title="Open turn-by-turn GPS directions in Maps">
                  <span>📍 Route Directions</span>
                  <small>${esc(r.city)}, ${esc(r.state || 'CA')} ${esc(r.zip || '')}</small>
                </a>
              </div>
            </div>
          </div>
        </article>`;
    }).join('');
    if (scroll) $('.results-head').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- Analytics & End-of-Month Renewal Proof Page (#/analytics) ----------
  function renderAnalytics() {
    const top12 = state.restaurants.slice(0, 12);
    const isCustom = state.selectedAnalyticsId === '__custom__';
    const selectedRest = isCustom
      ? null
      : (state.restaurants.find((x) => x.id === state.selectedAnalyticsId) || state.restaurants[0]);

    const bizName = isCustom ? state.customBiz.name : (selectedRest?.name || 'Changan Kitchen');
    const ownerName = isCustom ? state.customBiz.ownerName : (getAnalytics(selectedRest).ownerName || 'Owner');
    const phone = isCustom ? state.customBiz.phone : (selectedRest?.phone || '(909) 477-8971');
    const address = isCustom ? state.customBiz.address : `${selectedRest?.address || ''}, ${selectedRest?.city || ''}, CA ${selectedRest?.zip || ''}`;
    const calls = isCustom ? state.customBiz.calls : getAnalytics(selectedRest).calls;
    const directions = isCustom ? state.customBiz.directions : getAnalytics(selectedRest).directions;
    const stripeUrl = isCustom ? state.customBiz.stripeUrl : getAnalytics(selectedRest).stripeUrl;
    const kitchenStatus = isCustom ? 'open' : (getAnalytics(selectedRest).kitchenStatus || 'open');

    const totalSent = calls + directions;
    const costPerCustomer = totalSent > 0 ? (10 / totalSent).toFixed(2) : '0.00';

    const smsText = `Hi ${ownerName}, for your $10 ad this month on HiddenFoodGem.com, your listing (${bizName}) generated:\n• ${calls} direct calls to your counter*\n• ${directions} turn-by-turn navigation routes to your storefront*\nCost per customer sent: ~$${costPerCustomer} Here is the link to renew your featured spot for next month: ${stripeUrl}`;

    // Aggregate totals across flagship 12
    const allCalls = top12.reduce((sum, r) => sum + getAnalytics(r).calls, 0);
    const allDirs = top12.reduce((sum, r) => sum + getAnalytics(r).directions, 0);

    view.innerHTML = `
      <section class="analytics-hero">
        <div class="analytics-hero-inner">
          <span class="eyebrow">📊 The 2 Numbers That Prove Value · $10/mo Featured Pin</span>
          <h1 style="font-family:var(--display);font-size:clamp(1.8rem,5vw,2.7rem);margin:10px 0 6px">Owner Click Tracker &amp; End-of-Month Renewal Proof</h1>
          <p style="margin:0;color:rgba(255,255,255,.85);max-width:680px">Every time a diner taps <b>📞 Call</b> or <b>📍 Route Directions</b> on any restaurant card, their click is recorded automatically below so you can text or hand-deliver undeniable monthly proof to the owner.</p>
        </div>
      </section>

      <div class="wrap">
        <div class="proof-generator-card" id="adminLeadsModal">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:14px">
            <div>
              <span class="heritage-pill" style="background:#1e3a8a">📊 End-of-Month Proof &amp; Renewal Generator</span>
              <h2 style="font-family:var(--display);font-size:1.55rem;margin:4px 0 2px">${esc(bizName)}</h2>
              <div class="meta">👤 Owner: <b>${esc(ownerName)}</b> · 📞 ${esc(phone)} · 📍 ${esc(address)}</div>
            </div>
            <div style="min-width:260px">
              <label style="font-size:.78rem;font-weight:800;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:4px">Select Restaurant Preset:</label>
              <select class="select" id="analytics-preset" style="width:100%">
                <optgroup label="Flagship 12 Verified Spots (Near 91761)">
                  ${top12.map((r) => {
                    const an = getAnalytics(r);
                    return `<option value="${esc(r.id)}" ${r.id === state.selectedAnalyticsId ? 'selected' : ''}>${esc(r.name)} (${an.calls} calls · ${an.directions} routes)</option>`;
                  }).join('')}
                </optgroup>
                <optgroup label="Custom Restaurant / Storefront">
                  <option value="__custom__" ${isCustom ? 'selected' : ''}>✨ Custom Local Restaurant (Configure Any Owner)</option>
                </optgroup>
              </select>
            </div>
          </div>

          ${isCustom ? `
            <div class="section" style="margin:0 0 14px;background:var(--cream)">
              <h4 style="margin-bottom:10px">✨ Custom Restaurant Configuration</h4>
              <div class="two">
                <label style="font-size:.82rem;font-weight:700">Restaurant Name<input class="input" id="cust-name" value="${esc(state.customBiz.name)}" /></label>
                <label style="font-size:.82rem;font-weight:700">Owner First Name<input class="input" id="cust-owner" value="${esc(state.customBiz.ownerName)}" /></label>
              </div>
              <div class="two" style="margin-top:8px">
                <label style="font-size:.82rem;font-weight:700">Phone<input class="input" id="cust-phone" value="${esc(state.customBiz.phone)}" /></label>
                <label style="font-size:.82rem;font-weight:700">Stripe Renewal Link<input class="input" id="cust-stripe" value="${esc(state.customBiz.stripeUrl)}" /></label>
              </div>
            </div>
          ` : `
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;background:var(--cream);padding:10px 14px;border-radius:14px;border:1px solid var(--line);margin-bottom:14px">
              <span style="font-size:.82rem;font-weight:800">Live Card Operational Pill:</span>
              <button type="button" class="chip ${kitchenStatus === 'open' ? 'active' : ''}" data-set-status="open" aria-pressed="${kitchenStatus === 'open'}">🟢 Open Now</button>
              <button type="button" class="chip ${kitchenStatus === 'low_prep' ? 'active' : ''}" data-set-status="low_prep" aria-pressed="${kitchenStatus === 'low_prep'}">🟡 Kitchen Low on Prep</button>
              <button type="button" class="chip ${kitchenStatus === 'sold_out' ? 'active' : ''}" data-set-status="sold_out" aria-pressed="${kitchenStatus === 'sold_out'}">🔴 Sold Out for Today</button>
            </div>
          `}

          <!-- Live Scorecard KPI Cards -->
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-lbl">📞 Direct Calls</div>
              <div class="kpi-val" style="color:#15803d">${calls}</div>
              <div class="kpi-sub">Tapped to dial counter directly</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-lbl">📍 Navigation Routes</div>
              <div class="kpi-val" style="color:#1d4ed8">${directions}</div>
              <div class="kpi-sub">Turn-by-turn GPS to storefront</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-lbl">👥 High-Intent Customers Sent</div>
              <div class="kpi-val">${totalSent}</div>
              <div class="kpi-sub">Total calls + driving routes</div>
            </div>
            <div class="kpi-card" style="background:#fffdf6;border-color:var(--saffron)">
              <div class="kpi-lbl">💰 Cost Per Customer Sent</div>
              <div class="kpi-val" style="color:var(--chili)">~$${costPerCustomer}</div>
              <div class="kpi-sub">For a $10/mo ad ($10 / ${totalSent || 1} = $${costPerCustomer})</div>
            </div>
          </div>

          <div style="margin-top:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
              <b style="font-size:.9rem">💬 Automated End-of-Month Renewal Text Message:</b>
              <span class="hint">Ready to text or print for ${esc(ownerName)}</span>
            </div>
            <div class="sms-preview-box" id="sms-preview-text">${esc(smsText)}</div>
          </div>

          <!-- 1-Click Admin Controls -->
          <div class="admin-btn-row">
            <button type="button" class="btn btn-gold btn-sm" id="btn-copy-sms">📋 Copy Text Message</button>
            <a class="btn btn-sm" id="btn-open-sms" href="sms:${esc(phone.replace(/[^\d+]/g, ''))}?body=${encodeURIComponent(smsText)}" style="background:#15803d">💬 Open SMS App</a>
            <button type="button" class="btn btn-light btn-sm" id="btn-print-proof">🖨️ Print / Download 1-Page Report</button>
            <button type="button" class="btn btn-light btn-sm" id="btn-test-call">⚡ +1 Test Call</button>
            <button type="button" class="btn btn-light btn-sm" id="btn-test-route">⚡ +1 Test Route</button>
            <button type="button" class="btn btn-light btn-sm" id="btn-reset-cycle" style="color:var(--chili)">🔄 Reset Cycle</button>
          </div>
        </div>

        <!-- All Restaurants Click Leaderboard -->
        <div class="results-head" style="margin-top:26px">
          <h2>📈 Monthly Click Leaderboard (Flagship 12 Near 91761)</h2>
          <span>Total Across 12 Spots: <b>${allCalls} Calls</b> · <b>${allDirs} Map Routes</b> (<b>${allCalls + allDirs} Customers Sent</b>)</span>
        </div>
        <div class="analytics-table-wrap">
          <table class="analytics-table">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>Owner</th>
                <th>Live Status Pill</th>
                <th>📞 Direct Calls</th>
                <th>📍 Map Routes</th>
                <th>👥 Total Sent</th>
                <th>💰 Cost / Customer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${top12.map((r) => {
                const an = getAnalytics(r);
                const tot = an.calls + an.directions;
                const cpc = tot > 0 ? (10 / tot).toFixed(2) : '0.00';
                const op = getOperationalPill(r);
                return `
                  <tr style="${r.id === state.selectedAnalyticsId ? 'background:#fff6e3;font-weight:700' : ''}">
                    <td><b>${esc(r.name)}</b><br><small class="meta">${esc(r.address)}, ${esc(r.city)}</small></td>
                    <td>${esc(an.ownerName)}</td>
                    <td><span class="op-pill ${op.cls}" style="font-size:.7rem">${op.dot} ${esc(op.text.split('•')[0])}</span></td>
                    <td style="color:#15803d;font-weight:800">${an.calls}</td>
                    <td style="color:#1d4ed8;font-weight:800">${an.directions}</td>
                    <td><b>${tot}</b></td>
                    <td style="color:var(--chili);font-weight:800">~$${cpc}</td>
                    <td><button type="button" class="ec-proof-btn" data-select-proof="${esc(r.id)}">Load Proof →</button></td>
                  </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;

    $('#analytics-preset').addEventListener('change', (e) => {
      state.selectedAnalyticsId = e.target.value;
      updateTopAnalyticsBadge();
      renderAnalytics();
    });

    if (isCustom) {
      ['cust-name', 'cust-owner', 'cust-phone', 'cust-stripe'].forEach((id) => {
        const el = $(`#${id}`);
        if (el) el.addEventListener('input', () => {
          state.customBiz.name = $('#cust-name').value;
          state.customBiz.ownerName = $('#cust-owner').value;
          state.customBiz.phone = $('#cust-phone').value;
          state.customBiz.stripeUrl = $('#cust-stripe').value;
          renderAnalytics();
        });
      });
    } else {
      view.querySelectorAll('[data-set-status]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const st = btn.dataset.setStatus;
          const statusMap = {
            open: 'Open Now • Closing at 8:30 PM',
            low_prep: 'Kitchen Low on Prep • Calling Ahead Recommended',
            sold_out: 'Sold Out for Today • Reopens Tomorrow at 11:00 AM'
          };
          await recordClickEvent(state.selectedAnalyticsId, 'status', { kitchenStatus: st, statusLabel: statusMap[st] });
          toast(`Updated live card status to: ${statusMap[st]}`);
          renderAnalytics();
        });
      });
    }

    $('#btn-copy-sms').addEventListener('click', async () => {
      await copyText(smsText);
      toast(`📋 Renewal SMS for ${ownerName} copied to clipboard!`);
    });

    $('#btn-test-call').addEventListener('click', async () => {
      const updated = await recordClickEvent(state.selectedAnalyticsId, 'call');
      toast(`📞 Dialing direct line — Call recorded (#${updated.calls})`);
      renderAnalytics();
    });

    $('#btn-test-route').addEventListener('click', async () => {
      const updated = await recordClickEvent(state.selectedAnalyticsId, 'direction');
      toast(`📍 Opening navigation in Maps — Driving route recorded (#${updated.directions})`);
      renderAnalytics();
    });

    $('#btn-reset-cycle').addEventListener('click', async () => {
      await recordClickEvent(state.selectedAnalyticsId, 'reset');
      toast(`🔄 Monthly click counters reset to 0 for ${bizName}`);
      renderAnalytics();
    });

    $('#btn-print-proof').addEventListener('click', () => {
      const w = window.open('', '_blank');
      if (!w) return window.print();
      w.document.write(`<!doctype html><html><head><title>Monthly Ad Proof - ${esc(bizName)}</title>
        <style>
          body{font-family:system-ui,-apple-system,sans-serif;padding:40px;color:#1f1612;max-width:740px;margin:0 auto}
          .box{border:2px solid #1f1612;border-radius:18px;padding:28px}
          .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:20px 0}
          .kpi{border:1px solid #d6c7b2;border-radius:12px;padding:14px;text-align:center}
          .kpi b{font-size:1.8rem;display:block}
          .msg{background:#f6ebdd;padding:16px;border-radius:12px;white-space:pre-wrap;font-family:monospace;line-height:1.5}
        </style></head><body>
        <div class="box">
          <div style="font-size:.8rem;font-weight:800;text-transform:uppercase;color:#d9381e">💎 HiddenFoodGem.com · Monthly Featured Pin Proof ($10/mo)</div>
          <h1 style="margin:6px 0 4px">${esc(bizName)}</h1>
          <div>Prepared for: <b>${esc(ownerName)}</b> · ${esc(address)} · ${esc(phone)}</div>
          <div class="kpis">
            <div class="kpi"><b>${calls}</b>Direct Calls</div>
            <div class="kpi"><b>${directions}</b>Map Routes</div>
            <div class="kpi"><b>${totalSent}</b>Customers Sent</div>
            <div class="kpi"><b>~$${costPerCustomer}</b>Cost / Customer</div>
          </div>
          <h3>Renewal Summary</h3>
          <div class="msg">${esc(smsText)}</div>
        </div>
        <script>window.onload=()=>window.print();<\/script>
      </body></html>`);
      w.document.close();
    });

    view.querySelectorAll('[data-select-proof]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedAnalyticsId = btn.dataset.selectProof;
        updateTopAnalyticsBadge();
        renderAnalytics();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // ---------- Detail sheet ----------
  function openSheet(html) {
    sheetBody.innerHTML = html; sheet.hidden = false; document.body.style.overflow = 'hidden';
    $('.sheet-panel').scrollTop = 0;
  }
  function closeSheet() {
    sheet.hidden = true; document.body.style.overflow = ''; sheetBody.innerHTML = '';
  }

  function renderStructuredMenu(sm) {
    if (!sm) return '';
    return MENU_CAT_META.map(([key, , title]) => {
      const items = sm[key];
      if (!Array.isArray(items) || !items.length) return '';
      return `
        <div class="menu-group">
          <h5 class="menu-group-title">${title}</h5>
          ${items.map((it) => `
            <div class="menu-item">
              <div class="menu-item-head"><span>${esc(it.name)}</span><span class="menu-item-price">${esc(it.price || '')}</span></div>
              ${it.desc ? `<p>${esc(it.desc)}</p>` : ''}
            </div>`).join('')}
        </div>`;
    }).join('');
  }

  function renderDetail(r) {
    const a = avg(r), n = r.ratings.length, b = badge(r);
    const hp = r.healthPermit;
    const curatedPhotos = (r.photos || []).filter((p) => p && p.file && !p.file.includes('hero.')).slice(0, 3);
    const op = getOperationalPill(r);
    const hrs = getTodayHoursSummary(r);
    const cleanTel = (r.phone || '').replace(/[^\d+]/g, '');
    const mapsUrl = getMapsUrl(r);
    const submitMailSubject = `Photo / Menu Submission: ${r.name} (${r.city})`;
    const submitMailBody = `Hello HiddenFoodGem.com Team,\n\nI am the owner or representative of ${r.name} in ${r.city}. Please find attached our verified dish photo and menu.\n\nRestaurant: ${r.name}\nAddress: ${r.address}, ${r.city}\nPhone: ${r.phone || ''}`;
    const submitMailtoUrl = `mailto:letsgetoutkids@gmail.com?subject=${encodeURIComponent(submitMailSubject)}&body=${encodeURIComponent(submitMailBody)}`;

    openSheet(`
      <div class="detail-media" id="detail-hero-media">
        ${mediaHtml(r, true, true)}
        ${b ? `<span class="badge ${b.cls}">${b.txt}</span>` : ''}
      </div>
      <div class="detail-body">
        ${r.regionalIdentity ? `<div class="regional-sub">${esc(r.regionalIdentity)}</div>` : ''}
        <div class="detail-rating">
          <h2>${esc(r.name)}</h2>
          <div class="rating-grade-row">
            ${hp ? `<span class="grade-inline-pill" title="Health Grade ${esc(hp.grade)}">Grade ${esc(hp.grade)}</span>` : ''}
            <span class="rating-pill" title="${a ? a.toFixed(1) + ' star rating' : '5.0 star rating'}"><span class="stars-sym">${starsTxt(a || 5)}</span> ${(a || 5).toFixed(1)}</span>
          </div>
        </div>
        <div class="meta">${emojiFor(r)} ${esc(r.cuisine)} · ${price(r.price)} · ${esc(r.city)}, ${esc(r.state || 'CA')} ${esc(r.zip || '')} ${r.driveFrom91761 ? `· 🚗 ${esc(r.driveFrom91761)}` : ''}</div>

        <!-- Single-Line Operational Status & Today's Live Hours + Weekly Tooltip/Popover -->
        <div class="op-status-box">
          <span class="op-pill ${op.cls}">${op.dot} ${esc(op.text)}</span>
          <div class="op-hours" title="Full Weekly Hours: ${esc(hrs.fullSchedule)}">
            <span>🕒 ${esc(hrs.todayText)}</span>
            ${hrs.hasWeeklyBreakdown ? `<button type="button" class="hours-info-btn" data-detail-hours-toggle title="Full Weekly Schedule: ${esc(hrs.fullSchedule)}" aria-expanded="false">ⓘ Weekly</button>` : ''}
          </div>
        </div>
        ${hrs.hasWeeklyBreakdown ? `<div class="weekly-hours-popover" id="detail-weekly-hours" hidden>📅 <b>Weekly Hours:</b> ${esc(hrs.fullSchedule)}</div>` : ''}

        <!-- Community Verification Reminder -->
        <div class="community-notice-banner" style="margin: 8px 0 10px; font-size: 0.78rem;">
          <span class="notice-icon">💡</span>
          <p><b>Helpful Tip:</b> Please double-check with the restaurant directly (by calling or checking their official website) to confirm their latest hours, current menu items, and neighborhood details before heading out!</p>
        </div>

        <!-- Scratch-Made Line Only (Full Sentence, No Ellipsis) -->
        ${r.scratchCommitment ? `
          <div class="roots-scratch-block">
            <div class="roots-scratch-line">⏱️ <b>Scratch-Made:</b> ${esc(r.scratchCommitment)}</div>
          </div>
        ` : ''}

        ${curatedPhotos.length ? `
          <div class="photo-trio" aria-label="3 Signature Dish Photos">
            ${curatedPhotos.map((p) => {
              const pUrl = normImg(p.file);
              return `
              <button type="button" data-zoom="${esc(pUrl)}" title="Tap to enlarge: ${esc(p.label)}" onclick="if(this.querySelector('img').dataset.failed) return false;">
                <img src="${esc(pUrl)}" alt="${esc(p.label)}" loading="lazy" onerror="this.dataset.failed=1; this.closest('button').style.display='none';" />
                <span>${esc(p.label)}</span>
              </button>`;
            }).join('')}
          </div>
        ` : ''}

        <!-- Interactive Compact Menu Tabs (3 items max, fits on 1 screen) -->
        ${renderCardMenuSection(r)}

        <!-- Secure Verified Submission Row: Contact Us to Upload Menu / Photo -->
        <div class="owner-menu-upload-row">
          <span>📸 Want to update your menu or dish photo?</span>
          <a class="owner-upload-pill" href="${esc(submitMailtoUrl)}">
            📩 Contact Us
          </a>
        </div>

        <!-- Direct Call & Route Directions (Silently tracked in backend) -->
        <div class="ec-ad-box" style="margin-top:2px">
          <div class="ec-action-grid">
            <a class="ec-tab-btn call-btn" href="tel:${esc(cleanTel)}" data-detail-call="${esc(r.id)}">
              <span>📞 Call</span>
              <small>${esc(r.phone || '(909) 555-0199')}</small>
            </a>
            <a class="ec-tab-btn map-btn" href="${esc(mapsUrl)}" target="_blank" rel="noopener" data-detail-map="${esc(r.id)}">
              <span>📍 Route Directions</span>
              <small>${esc(r.address)}, ${esc(r.city)}</small>
            </a>
          </div>
        </div>
      </div>`);
    wireDetail(r);
  }

  function wireDetail(r) {
    const hrsToggle = sheetBody.querySelector('[data-detail-hours-toggle]');
    if (hrsToggle) {
      hrsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const pop = sheetBody.querySelector('#detail-weekly-hours');
        if (pop) {
          pop.hidden = !pop.hidden;
          hrsToggle.setAttribute('aria-expanded', String(!pop.hidden));
        }
      });
    }

    // Wire interactive menu category tabs inside the detail sheet
    sheetBody.querySelectorAll('[data-card-cat]').forEach((tabBtn) => {
      tabBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.cardMenuCat[r.id] = tabBtn.dataset.cardCat;
        renderDetail(r);
      });
    });

    const callBtn = sheetBody.querySelector('[data-detail-call]');
    if (callBtn) {
      callBtn.addEventListener('click', () => {
        recordClickEvent(r.id, 'call');
      });
    }

    const mapBtn = sheetBody.querySelector('[data-detail-map]');
    if (mapBtn) {
      mapBtn.addEventListener('click', () => {
        recordClickEvent(r.id, 'direction');
      });
    }

    sheetBody.querySelectorAll('[data-zoom]').forEach((b) => b.addEventListener('click', () => {
      $('#lightbox-img').src = b.dataset.zoom; $('#lightbox').hidden = false;
    }));
    sheetBody.querySelectorAll('[data-upload]').forEach((inp) => inp.addEventListener('change', () => {
      const file = inp.files[0]; inp.value = '';
      if (file) upload(r, inp.dataset.upload, file);
    }));
  }

  async function upload(r, type, file) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const bar = $('#progress', sheetBody), txt = $('#progress-txt', sheetBody);
    bar.hidden = false; txt.textContent = 'Uploading…';

    if (IS_STANDALONE) {
      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          bar.firstElementChild.style.width = pct + '%'; txt.textContent = `Saving… ${pct}%`;
        }
      };
      reader.onload = () => {
        const dataUrl = reader.result;
        r.media.unshift({ type, file: dataUrl, uploadedAt: new Date().toISOString() });
        if (type === 'photo' && !r.image) r.image = dataUrl;
        replaceRestaurant(r); renderDetail(r); renderResults();
        toast(type === 'menu' ? 'Menu posted! 📋' : 'Photo posted! 📸');
      };
      reader.readAsDataURL(file);
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/restaurants/${encodeURIComponent(r.id)}/media?type=${type}&ext=${encodeURIComponent(ext)}`);
    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const pct = Math.round((e.loaded / e.total) * 100);
      bar.firstElementChild.style.width = pct + '%'; txt.textContent = `Uploading… ${pct}%`;
    };
    xhr.onload = () => {
      let data = {}; try { data = JSON.parse(xhr.responseText); } catch {}
      if (xhr.status >= 200 && xhr.status < 300) {
        replaceRestaurant(data); renderDetail(data); renderResults();
        toast(type === 'menu' ? 'Menu posted! 📋' : 'Photo posted! 📸');
      } else { bar.hidden = true; txt.textContent = ''; toast(data.error || 'Upload failed'); }
    };
    xhr.onerror = () => { bar.hidden = true; txt.textContent = ''; toast('Upload failed. Is the server still running?'); };
    xhr.send(file);
  }

  // ---------- Contact Us / Restaurant Inquiry ----------
  function renderAdd() {
    openSheet(`
      <div class="form-head">
        <span class="eyebrow" style="color:var(--chili);background:#fdeae4;border-color:#f6c9bd">📩 Contact Us</span>
        <h2>Own a small restaurant?</h2>
        <p>Contact us to inquire about getting your restaurant listed. Fill out the form below or email us directly at <a href="mailto:letsgetoutkids@gmail.com?subject=Restaurant%20Listing%20Inquiry%20-%20Hidden%20Food%20Gems" style="color:var(--chili);font-weight:800;text-decoration:underline">letsgetoutkids@gmail.com</a>.</p>
      </div>
      <form class="form detail-body" id="add-form">
        <div class="two">
          <label>Restaurant name *<input class="input" name="name" required maxlength="80" placeholder="e.g. Tía Rosa's Kitchen" /></label>
          <label>Your name *<input class="input" name="ownerName" required maxlength="50" placeholder="e.g. Rosa Martinez" /></label>
        </div>
        <div class="two">
          <label>Email address *<input class="input" name="email" type="email" required maxlength="80" placeholder="you@example.com" /></label>
          <label>Phone number *<input class="input" name="phone" type="tel" required maxlength="30" placeholder="(909) 555-0199" /></label>
        </div>
        <div class="two">
          <label>Street address *<input class="input" name="address" required maxlength="120" placeholder="123 N Euclid Ave" /></label>
          <label>City *<input class="input" name="city" required maxlength="60" placeholder="Ontario" /></label>
        </div>
        <div class="two">
          <label>Regional Cuisine<select name="cuisine">${CUISINES.map((c) => `<option>${c}</option>`).join('')}</select></label>
          <label>Hours<input class="input" name="hours" maxlength="120" placeholder="Tue–Sun 11am–9pm" /></label>
        </div>
        <label>Message / Tell us about your restaurant<textarea class="textarea" name="description" maxlength="600" placeholder="Tell us about your signature dishes or any questions about getting your restaurant listed..."></textarea></label>
        <button class="btn btn-block" type="submit">📩 Send Inquiry to LetsGetOutKids</button>
      </form>`);
    $('#add-form', sheetBody).addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const name = fd.get('name') || '';
      const ownerName = fd.get('ownerName') || '';
      const email = fd.get('email') || '';
      const phone = fd.get('phone') || '';
      const address = fd.get('address') || '';
      const city = fd.get('city') || '';
      const cuisine = fd.get('cuisine') || '';
      const hours = fd.get('hours') || '';
      const msg = fd.get('description') || '';

      const subject = encodeURIComponent(`Restaurant Listing Inquiry: ${name} (${city})`);
      const bodyLines = [
        `Hello LetsGetOutKids Team,`,
        ``,
        `I would like to inquire about getting my restaurant listed on HiddenFoodGem.com:`,
        ``,
        `• Restaurant Name: ${name}`,
        `• Contact Name: ${ownerName}`,
        `• Email: ${email}`,
        `• Phone: ${phone}`,
        `• Address: ${address}, ${city}`,
        `• Cuisine: ${cuisine}`,
        hours ? `• Hours: ${hours}` : null,
        msg ? `\nMessage / Details:\n${msg}` : null
      ].filter((x) => x !== null).join('\n');

      window.location.href = `mailto:letsgetoutkids@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyLines)}`;
      toast('📩 Opening email to LetsGetOutKids (letsgetoutkids@gmail.com)…');
      setTimeout(() => { location.hash = state.base || '#/'; }, 600);
    });
  }

  // ---------- URL Parameter Handling & Router ----------
  function applyUrlParams() {
    const searchParams = new URLSearchParams(location.search || '');
    const hashStr = location.hash || '#/';
    const qIdx = hashStr.indexOf('?');
    const hashParams = qIdx >= 0 ? new URLSearchParams(hashStr.slice(qIdx + 1)) : new URLSearchParams();

    const getParam = (key) => searchParams.get(key) || hashParams.get(key);
    const rawCity = getParam('city');
    const rawMeal = getParam('meal');
    const rawZip = getParam('zip');
    const rawRegion = getParam('region');

    if (rawMeal && MEAL_TABS.some(([k]) => k === rawMeal.toLowerCase())) {
      state.mealTab = rawMeal.toLowerCase();
    }
    if (rawZip && /^\d{5}$/.test(rawZip.trim())) {
      state.q = rawZip.trim();
    }
    if (rawRegion && SOCAL_REGIONS.some((r) => r.id.toLowerCase() === rawRegion.trim().toLowerCase())) {
      const matchedReg = SOCAL_REGIONS.find((r) => r.id.toLowerCase() === rawRegion.trim().toLowerCase());
      state.region = matchedReg.id;
    }

    if (rawCity) {
      const requestedCity = rawCity.trim();
      const activeCities = getActiveCityCounts();
      const matched = activeCities.find((x) => x.city.toLowerCase() === requestedCity.toLowerCase());
      if (matched && matched.spot_count > 0) {
        state.city = matched.city;
      } else {
        // Zero-result city (e.g. ?city=Downey): cleanly redirect/fall back to All Southern California
        state.city = '';
        state.region = '';
        if (location.search.includes('city=')) {
          searchParams.delete('city');
          const cleanSearch = searchParams.toString();
          history.replaceState(null, '', location.pathname + (cleanSearch ? `?${cleanSearch}` : '') + (qIdx >= 0 ? hashStr.slice(0, qIdx) : hashStr));
        } else if (qIdx >= 0) {
          hashParams.delete('city');
          const cleanHashQ = hashParams.toString();
          history.replaceState(null, '', location.pathname + location.search + hashStr.slice(0, qIdx) + (cleanHashQ ? `?${cleanHashQ}` : ''));
        }
        setTimeout(() => {
          toast(`📍 No active listings in "${requestedCity}" — showing All Southern California.`);
        }, 120);
      }
    }
  }

  function route() {
    applyUrlParams();
    const h = (location.hash || '#/').split('?')[0];
    const [, page, id] = h.split('/');
    document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('active',
      (page === 'analytics' && a.dataset.nav === 'analytics') ||
      (page === 'add' && a.dataset.nav === 'add') ||
      (!['analytics', 'add'].includes(page) && a.dataset.nav === 'home')));

    if (page === 'analytics') {
      closeSheet();
      state.base = '#/analytics';
      renderAnalytics();
      return;
    }

    if (page === '' || page === undefined) state.base = '#/';
    if (!$('#grid')) renderHome();
    else {
      if ($('#q')) $('#q').value = state.q;
      if ($('#region')) $('#region').value = state.region;
      renderResults();
    }

    const initZip = getActiveZipQuery();
    if (initZip && (!state.geocodedInfo || state.geocodedInfo.zip !== initZip)) {
      resolveZipGeocode(initZip).then((geo) => {
        state.geocodedInfo = geo;
        renderResults();
      });
    }

    if (page === 'r') {
      const r = state.restaurants.find((x) => x.id === decodeURIComponent(id || ''));
      if (r) renderDetail(r); else { closeSheet(); toast('Restaurant not found'); }
    } else if (page === 'add') renderAdd();
    else closeSheet();
  }

  sheet.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) location.hash = state.base; });
  $('#lightbox').addEventListener('click', () => { $('#lightbox').hidden = true; });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!$('#lightbox').hidden) $('#lightbox').hidden = true; else if (!sheet.hidden) location.hash = state.base;
  });
  window.addEventListener('hashchange', route);

  // ---------- Boot ----------
  api('/api/restaurants')
    .then((list) => {
      // In offline/standalone mode, prioritize the bundled offline seed if list from old storage is stale
      if (window.__HFG_OFFLINE_SEED__ && Array.isArray(list) && list.length < window.__HFG_OFFLINE_SEED__.length) {
        list = window.__HFG_OFFLINE_SEED__;
        try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
      }
      state.restaurants = (list || []).map(stripPromoFields);
      updateTopAnalyticsBadge();
      route();
    })
    .catch(() => {
      if (window.__HFG_OFFLINE_SEED__) {
        state.restaurants = (window.__HFG_OFFLINE_SEED__ || []).map(stripPromoFields);
        try { localStorage.setItem(LS_KEY, JSON.stringify(state.restaurants)); } catch {}
        updateTopAnalyticsBadge();
        route();
      } else {
        view.innerHTML = `<div class="empty"><div class="big">🔌</div><h3>Can't reach the local server</h3><p>Start it with <code>node server.js</code> in the hidden-food-gems folder, or open <code>HiddenFoodGems_Offline.html</code>.</p></div>`;
      }
    });
})();
