const fs = require("fs");
const path = require("path");

const hfgDir = __dirname;
const genPath = path.join(hfgDir, "generate_seo_pages.js");
let genCode = fs.readFileSync(genPath, "utf8");

const resolverHelperCode = `
// ── Symmetric Funnel: Map every HFG City/ZIP to its Canonical LGOK /city/[slug] & Curated After-Dinner Outings ──
const LGOK_CITY_GUIDES = {
  "ontario|ca": {
    slug: "ontario",
    displayCity: "Ontario, CA",
    ideas: [
      {
        badge: "FREE · Library & Crafts",
        title: "Ovitt Family Community Library Kids Workshops & Storytimes",
        venue: "215 E C St, Ontario, CA 91764",
        desc: "Free afternoon and early-evening kids hand-stitching, art workshops, and family reading corners in Downtown Ontario.",
        url: "https://www.letsgetoutkids.com/events/evt-on-mon-nov2"
      },
      {
        badge: "FREE · Evening Stroll",
        title: "Ontario Town Square & Mule Car Park Family Walk",
        venue: "224 N Euclid Ave, Ontario, CA 91762",
        desc: "Stroll historic Euclid Avenue's tree-lined median, open lawn, and community events right after dinner.",
        url: "https://www.letsgetoutkids.com/city/ontario#today-events"
      },
      {
        badge: "FREE · Museum & Culture",
        title: "Ontario Museum of History & Art Family Discovery Exhibits",
        venue: "225 S Euclid Ave, Ontario, CA 91762",
        desc: "100% free admission hands-on local history and art exhibits for kids and parents along Euclid Avenue.",
        url: "https://www.letsgetoutkids.com/events/evt-048"
      }
    ]
  },
  "rancho cucamonga|ca": {
    slug: "rancho-cucamonga",
    displayCity: "Rancho Cucamonga, CA",
    ideas: [
      {
        badge: "FREE · Town Square & Lights",
        title: "Victoria Gardens Town Square & Cultural Center Evening Stroll",
        venue: "12505 Cultural Center Dr, Rancho Cucamonga, CA 91739",
        desc: "Pedestrian-friendly open-air town square, seasonal light displays, and kids train ride after eating at Haven City Market.",
        url: "https://www.letsgetoutkids.com/city/rancho-cucamonga#today-events"
      },
      {
        badge: "FREE · Featured Library",
        title: "Paul A. Biane Library Crafters Corner & Kids Discovery Zone",
        venue: "12505 Cultural Center Dr, Rancho Cucamonga, CA 91739",
        desc: "Free hands-on kids crafts, LEGO builders club, and interactive storytimes at Victoria Gardens.",
        url: "https://www.letsgetoutkids.com/events/evt-rc-biane-mon-nov2"
      },
      {
        badge: "FREE · Sunset Park Walk",
        title: "Central Park & Pacific Electric Trail Family Walk",
        venue: "11200 Base Line Rd, Rancho Cucamonga, CA 91701",
        desc: "Paved stroller-friendly sunset walking trail, playgrounds, and foothill views.",
        url: "https://www.letsgetoutkids.com/city/rancho-cucamonga#upcoming-events"
      }
    ]
  },
  "chino|ca": {
    slug: "chino",
    displayCity: "Chino, CA",
    ideas: [
      {
        badge: "FREE · Holiday Tradition",
        title: "Chino Youth Christmas Parade & Community Fair",
        venue: "Monte Vista Ave & Central Ave, Chino, CA 91710",
        desc: "Chino's signature hometown youth parade, marching bands, Santa visits, and family carnival booths.",
        url: "https://www.letsgetoutkids.com/events/evt-133"
      },
      {
        badge: "FREE · Library & STEM",
        title: "Chino Branch Library Family Storytime & Craft Lab",
        venue: "13180 Central Ave, Chino, CA 91710",
        desc: "Free drop-in kids crafts, reading programs, and family activity tables in Downtown Chino.",
        url: "https://www.letsgetoutkids.com/city/chino#today-events"
      },
      {
        badge: "FREE · Outdoor Park",
        title: "Ruben S. Ayala Park Playgrounds & Walking Loops",
        venue: "14225 Central Ave, Chino, CA 91710",
        desc: "Expansive lighted walking paths, shaded playgrounds, and open family lawns.",
        url: "https://www.letsgetoutkids.com/city/chino#upcoming-events"
      }
    ]
  },
  "claremont|ca": {
    slug: "claremont",
    displayCity: "Claremont, CA",
    ideas: [
      {
        badge: "FREE · Village Stroll",
        title: "Claremont Village & Pomona College Tree-Lined Evening Walk",
        venue: "Harvard Ave & Bonita Ave, Claremont, CA 91711",
        desc: "Walkable historic college lawns, public art murals, and family-friendly village plazas steps from your table.",
        url: "https://www.letsgetoutkids.com/city/claremont#today-events"
      },
      {
        badge: "FREE · Library Activity",
        title: "Claremont Helen Renwick Library Kids Reading & Craft Corner",
        venue: "208 N Harvard Ave, Claremont, CA 91711",
        desc: "Free family storytimes, youth book clubs, and hands-on craft workshops in the heart of Claremont Village.",
        url: "https://www.letsgetoutkids.com/city/claremont#upcoming-events"
      },
      {
        badge: "Outdoor · Nature Garden",
        title: "California Botanic Garden Family Nature Trails",
        venue: "1500 N College Ave, Claremont, CA 91711",
        desc: "86 acres of native California flora, butterfly pavilions, and kid-friendly nature discovery paths.",
        url: "https://www.letsgetoutkids.com/city/claremont#seasonal-festivals"
      }
    ]
  },
  "upland|ca": {
    slug: "upland",
    displayCity: "Upland, CA",
    ideas: [
      {
        badge: "FREE · Historic Stroll",
        title: "Euclid Avenue Bridle Path & Historic Downtown Upland Walk",
        venue: "Euclid Ave & N 2nd Ave, Upland, CA 91786",
        desc: "Shaded pepper-tree median trail and historic downtown gazebo perfect for an after-dinner family stroll.",
        url: "https://www.letsgetoutkids.com/city/upland#today-events"
      },
      {
        badge: "FREE · Library & Kids",
        title: "Upland Public Library Storytime & Youth Makerspace",
        venue: "450 N Euclid Ave, Upland, CA 91786",
        desc: "Free children's reading programs, afternoon craft workshops, and family game nights.",
        url: "https://www.letsgetoutkids.com/city/upland#upcoming-events"
      },
      {
        badge: "FREE · Community Park",
        title: "Memorial Park Playground & Foothill Sunset Lawn",
        venue: "1100 E Foothill Blvd, Upland, CA 91786",
        desc: "Spacious playgrounds, picnic pavilions, and paved stroller walking loops along Route 66.",
        url: "https://www.letsgetoutkids.com/city/upland#seasonal-festivals"
      }
    ]
  },
  "montclair|ca": {
    slug: "montclair",
    displayCity: "Montclair, CA",
    ideas: [
      {
        badge: "FREE · Library & Crafts",
        title: "Montclair Branch Library Kids Activity & Storytime Zone",
        venue: "9955 Fremont Ave, Montclair, CA 91763",
        desc: "Free after-school arts & crafts, toddler storytimes, and family reading tables next to the Civic Center.",
        url: "https://www.letsgetoutkids.com/city/montclair#today-events"
      },
      {
        badge: "FREE · Park & Playground",
        title: "Alma Hofman Park & Sunset Park Family Playgrounds",
        venue: "5201 Benito St, Montclair, CA 91763",
        desc: "Climbing structures, walking paths, and open green space for burning off energy after dinner.",
        url: "https://www.letsgetoutkids.com/city/montclair#upcoming-events"
      },
      {
        badge: "Seasonal · Holiday Lights",
        title: "Inland Empire Seasonal Festivals & Winter Light Walks",
        venue: "Montclair & Surrounding Inland Empire",
        desc: "Explore verified 100% alcohol-free holiday festivals, tree lightings, and winter wonderlands nearby.",
        url: "https://www.letsgetoutkids.com/city/montclair#seasonal-festivals"
      }
    ]
  },
  "pasadena|ca": {
    slug: "pasadena",
    displayCity: "Pasadena, CA",
    ideas: [
      {
        badge: "FREE · Civic Architecture Walk",
        title: "Pasadena City Hall Courtyard & Old Pasadena Family Stroll",
        venue: "100 N Garfield Ave, Pasadena, CA 91101",
        desc: "Iconic Spanish Renaissance courtyard gardens, fountain plaza, and walkable Old Pasadena alleys.",
        url: "https://www.letsgetoutkids.com/city/pasadena#today-events"
      },
      {
        badge: "Hands-On · Kids Museum",
        title: "Kidspace Children's Museum & Brookside Park Playgrounds",
        venue: "480 N Arroyo Blvd, Pasadena, CA 91103",
        desc: "Outdoor climbing towers, Arroyo Seco nature trails, and pirate-ship playgrounds at Brookside Park.",
        url: "https://www.letsgetoutkids.com/city/pasadena#upcoming-events"
      },
      {
        badge: "Seasonal · Light Walk",
        title: "Descanso Gardens Enchanted Forest of Light & Botanical Walks",
        venue: "1418 Descanso Dr, La Cañada Flintridge / Pasadena Area",
        desc: "Interactive nighttime botanical light installations and family garden trails.",
        url: "https://www.letsgetoutkids.com/city/pasadena#seasonal-festivals"
      }
    ]
  },
  "anaheim|ca": {
    slug: "anaheim",
    displayCity: "Anaheim, CA",
    ideas: [
      {
        badge: "FREE · Packing District Park",
        title: "Farmers Park Boardwalk & Lawn Next to Anaheim Packing House",
        venue: "412 S Anaheim Blvd, Anaheim, CA 92805",
        desc: "Terraced wooden boardwalks, olive groves, and open family lawn steps away from the Packing District.",
        url: "https://www.letsgetoutkids.com/city/anaheim#today-events"
      },
      {
        badge: "FREE · Nature Center",
        title: "Oak Canyon Nature Center Stream Trails & Wildlife Museum",
        venue: "6700 E Walnut Canyon Rd, Anaheim, CA 92807",
        desc: "Free oak woodland hiking trails, live native animal exhibits, and shaded creek bridges for kids.",
        url: "https://www.letsgetoutkids.com/city/anaheim#upcoming-events"
      },
      {
        badge: "FREE · Downtown Stroll",
        title: "Center Street Promenade & Muzeo Cultural Plaza",
        venue: "241 S Anaheim Blvd, Anaheim, CA 92805",
        desc: "Family art exhibits, seasonal pop-ups, and walkable downtown plazas.",
        url: "https://www.letsgetoutkids.com/city/anaheim#seasonal-festivals"
      }
    ]
  },
  "irvine|ca": {
    slug: "irvine",
    displayCity: "Irvine, CA",
    ideas: [
      {
        badge: "FREE · Great Park",
        title: "Orange County Great Park Carousel, Balloon & Kids Rock Playground",
        venue: "8000 Great Park Blvd, Irvine, CA 92618",
        desc: "Walkable aviation hangars, nature-themed playgrounds, and the iconic orange tethered helium balloon.",
        url: "https://www.letsgetoutkids.com/city/irvine#today-events"
      },
      {
        badge: "Interactive · Children's Museum",
        title: "Pretend City Children's Museum & Irvine Regional Park Train",
        venue: "29 Hubble, Irvine, CA 92618",
        desc: "Child-sized city exhibits, mini train rides, and paddle boats across Irvine's top family parks.",
        url: "https://www.letsgetoutkids.com/city/irvine#upcoming-events"
      },
      {
        badge: "FREE · Nature & Marsh",
        title: "San Joaquin Marsh Wildlife Sanctuary Family Boardwalk",
        venue: "5 Riparian View, Irvine, CA 92612",
        desc: "Free flat stroller-friendly duck pond trails and birdwatching loops.",
        url: "https://www.letsgetoutkids.com/city/irvine#seasonal-festivals"
      }
    ]
  },
  "torrance|ca": {
    slug: "torrance",
    displayCity: "Torrance, CA",
    ideas: [
      {
        badge: "FREE · Park & Train",
        title: "Charles H. Wilson Park Treehouse Playground & Live Steamers",
        venue: "2200 Crenshaw Blvd, Torrance, CA 90501",
        desc: "Universal treehouse playground, duck pond, and miniature train track right in Torrance.",
        url: "https://www.letsgetoutkids.com/city/torrance#today-events"
      },
      {
        badge: "FREE · Nature Preserve",
        title: "Madrona Marsh Preserve & Nature Center Family Discovery",
        venue: "3201 Plaza Del Amo, Torrance, CA 90503",
        desc: "100% free vernal marsh nature center with hands-on science exhibits and flat walking trails.",
        url: "https://www.letsgetoutkids.com/city/torrance#upcoming-events"
      },
      {
        badge: "FREE · Coastal Sunset",
        title: "Torrance Beach & Miramar Park Oceanfront Bluff Walk",
        venue: "387 Paseo De La Playa, Torrance, CA 90277",
        desc: "Family sunset stroll overlooking Palos Verdes with paved beach bike paths.",
        url: "https://www.letsgetoutkids.com/city/torrance#seasonal-festivals"
      }
    ]
  },
  "burbank|ca": {
    slug: "burbank",
    displayCity: "Burbank, CA",
    ideas: [
      {
        badge: "FREE · Bike & Stroll Path",
        title: "Chandler Bikeway Murals & Magnolia Park Vintage Stroll",
        venue: "Chandler Blvd & N Hollywood Way, Burbank, CA 91505",
        desc: "Car-free landscaped linear park path with public sculptures—right down the street from Porto's Bakery.",
        url: "https://www.letsgetoutkids.com/city/burbank#today-events"
      },
      {
        badge: "FREE · Park & Playground",
        title: "Johnny Carson Park Shade Structures & River Walk",
        venue: "400 Bob Hope Dr, Burbank, CA 91505",
        desc: "Creative pirate-ship and bridge playgrounds, shaded lawns, and paved walking bridges.",
        url: "https://www.letsgetoutkids.com/city/burbank#upcoming-events"
      },
      {
        badge: "FREE · Nature Center",
        title: "Stough Canyon Nature Center & Verdugo Foothill Overlook",
        venue: "2300E Walnut Ave, Burbank, CA 91501",
        desc: "Free nature exhibits and family-friendly foothill view trails.",
        url: "https://www.letsgetoutkids.com/city/burbank#seasonal-festivals"
      }
    ]
  },
  "glendale|ca": {
    slug: "glendale",
    displayCity: "Glendale, CA",
    ideas: [
      {
        badge: "FREE · Park & Library",
        title: "Brand Park Japanese Tea House, Gardens & Library",
        venue: "1601 W Mountain St, Glendale, CA 91201",
        desc: "Picturesque white mansion library, koi pond tea garden, and foothill picnic lawns.",
        url: "https://www.letsgetoutkids.com/city/glendale#today-events"
      },
      {
        badge: "FREE · Train & Carousel",
        title: "Griffith Park Travel Town Museum & Southern Railroad",
        venue: "5200 Zoo Dr, Glendale / Los Angeles Border",
        desc: "Free outdoor vintage locomotive museum and kid-sized train rides minutes from Downtown Glendale.",
        url: "https://www.letsgetoutkids.com/city/glendale#upcoming-events"
      },
      {
        badge: "FREE · Town Green",
        title: "Americana at Brand Fountain Shows & Kids Green Lawn",
        venue: "889 Americana Way, Glendale, CA 91210",
        desc: "Choreographed musical fountain shows, open turf lawn, and free electric trolley rides.",
        url: "https://www.letsgetoutkids.com/city/glendale#seasonal-festivals"
      }
    ]
  },
  "rowland heights|ca": {
    slug: "diamond-bar",
    displayCity: "Rowland Heights & Diamond Bar, CA",
    ideas: [
      {
        badge: "FREE · Nature & Arboretum",
        title: "Schabarum Regional Park & Trailside Playgrounds",
        venue: "17250 E Colima Rd, Rowland Heights, CA 91748",
        desc: "Shaded picnic groves, plum blossoms, paved family walking loops, and playgrounds right on Colima Rd.",
        url: "https://www.letsgetoutkids.com/city/diamond-bar#today-events"
      },
      {
        badge: "FREE · Library & STEM",
        title: "Rowland Heights Library Kids Storytime & Homework Makerspace",
        venue: "1850 Nogales St, Rowland Heights, CA 91748",
        desc: "Free bilingual storytimes, kids arts & crafts, and family reading lounges.",
        url: "https://www.letsgetoutkids.com/city/diamond-bar#upcoming-events"
      },
      {
        badge: "FREE · Adventure Playground",
        title: "Pantera Park & Sycamore Canyon Trails in Diamond Bar",
        venue: "738 Pantera Dr, Diamond Bar, CA 91765",
        desc: "Accessible playgrounds and scenic canyon trails 5 minutes from Rowland Heights.",
        url: "https://www.letsgetoutkids.com/city/walnut#today-events"
      }
    ]
  }
};

function resolveLgokAfterDinnerGuide(city, state, zip) {
  const cleanCity = String(city || "").trim().toLowerCase();
  const cleanState = String(state || "CA").trim().toLowerCase();
  const key = cleanCity + "|" + cleanState;

  if (LGOK_CITY_GUIDES[key]) {
    const g = LGOK_CITY_GUIDES[key];
    return {
      cityUrl: "https://www.letsgetoutkids.com/city/" + g.slug,
      displayCity: g.displayCity,
      slug: g.slug,
      ideas: g.ideas
    };
  }

  // Map LA neighborhoods (Downtown LA, Koreatown, Boyle Heights, Little Tokyo, North Hollywood, Studio City, Van Nuys) -> /city/los-angeles
  if (
    cleanState === "ca" &&
    (cleanCity.includes("los angeles") ||
      cleanCity === "koreatown" ||
      cleanCity === "boyle heights" ||
      cleanCity === "little tokyo" ||
      cleanCity === "north hollywood" ||
      cleanCity === "studio city" ||
      cleanCity === "van nuys")
  ) {
    return {
      cityUrl: "https://www.letsgetoutkids.com/city/los-angeles",
      displayCity: city + " (Los Angeles, CA)",
      slug: "los-angeles",
      ideas: [
        {
          badge: "FREE · Science & Space",
          title: "California Science Center & Exposition Park Rose Garden",
          venue: "700 Exposition Park Dr, Los Angeles, CA 90037",
          desc: "100% free permanent hands-on science galleries, kelp forest aquarium, and historic rose garden strolls.",
          url: "https://www.letsgetoutkids.com/city/los-angeles#today-events"
        },
        {
          badge: "FREE · Observatory & Views",
          title: "Griffith Observatory Lawn & Sunset Planetarium Walk",
          venue: "2800 E Observatory Rd, Los Angeles, CA 90027",
          desc: "Free public telescope viewing on clear evenings, Foucault pendulum, and panoramic LA basin views.",
          url: "https://www.letsgetoutkids.com/city/los-angeles#upcoming-events"
        },
        {
          badge: "FREE · Splash & Park",
          title: "Grand Park Playground & Central Library Storytimes",
          venue: "200 N Grand Ave, Los Angeles, CA 90012",
          desc: "Colorful shaded playground, interactive fountain plaza, and children's literature murals.",
          url: "https://www.letsgetoutkids.com/city/los-angeles#seasonal-festivals"
        }
      ]
    };
  }

  // Map San Diego & La Jolla -> /city/san-diego
  if (cleanState === "ca" && (cleanCity.includes("san diego") || cleanCity === "la jolla")) {
    return {
      cityUrl: "https://www.letsgetoutkids.com/city/san-diego",
      displayCity: city + ", CA",
      slug: "san-diego",
      ideas: [
        {
          badge: "FREE · Balboa Park",
          title: "Balboa Park Botanical Building, Gardens & Organ Pavilion",
          venue: "1549 El Prado, San Diego, CA 92101",
          desc: "Walkable Spanish Colonial plazas, lily pond, and free Resident Tuesday museum rotations.",
          url: "https://www.letsgetoutkids.com/city/san-diego#today-events"
        },
        {
          badge: "FREE · Oceanfront Cove",
          title: "La Jolla Cove Sea Lions & Children's Pool Coastal Walk",
          venue: "1100 Coast Blvd, La Jolla, CA 92037",
          desc: "Watch wild sea lions and harbor seals from the oceanfront seawall and Scripps Park lawn.",
          url: "https://www.letsgetoutkids.com/city/san-diego#upcoming-events"
        },
        {
          badge: "FREE · Waterfront Park",
          title: "Waterfront Park Adventure Slides & Civic Fountains",
          venue: "1600 Pacific Hwy, San Diego, CA 92101",
          desc: "12-acre bayfront park with embankment slides, climbing ropes, and shallow splash fountains.",
          url: "https://www.letsgetoutkids.com/city/san-diego#seasonal-festivals"
        }
      ]
    };
  }

  // Fallback for national metro guides (NY, NJ, TX, IL, DC, MD, VA) -> links to LGOK Cities + Holiday Festivals + Today
  return {
    cityUrl: "https://www.letsgetoutkids.com/cities",
    displayCity: city + ", " + (state || "CA"),
    slug: null,
    ideas: [
      {
        badge: "FREE · Today's Outings",
        title: "Free Library Storytimes, Community Parks & Kid Workshops",
        venue: city + ", " + (state || "CA") + " (" + zip + ")",
        desc: "Browse verified 100% alcohol-free family events, library crafts, and neighborhood park pop-ups.",
        url: "https://www.letsgetoutkids.com/today"
      },
      {
        badge: "Seasonal · Holiday Lights",
        title: "Autumn Harvest Festivals & Winter Holiday Light Walks",
        venue: city + " & Regional Family Destinations",
        desc: "Explore curated family-safe seasonal festivals, botanical light trails, and ice skating rinks.",
        url: "https://www.letsgetoutkids.com/holiday-festivals"
      },
      {
        badge: "20-Day Family Planner",
        title: "Next 20 Days Family Event Calendar & Weekend Guide",
        venue: "Updated Daily at LetsGetOutKids.com",
        desc: "Plan your upcoming weekend with free admission days, youth sports, and museum workshops.",
        url: "https://www.letsgetoutkids.com/next-20-days"
      }
    ]
  };
}

function renderAfterDinnerBlockHtml(city, state, zip, restaurantName) {
  const guide = resolveLgokAfterDinnerGuide(city, state, zip);
  const heading = restaurantName
    ? "🎡 What to Do After Dinner Near " + esc(restaurantName) + " in " + esc(city) + " (" + esc(zip) + ")"
    : "🎡 What to Do After Dinner in " + esc(city) + ", " + esc(state || "CA") + " (" + esc(zip) + ")";
  const intro = restaurantName
    ? "Turning your meal at <strong>" + esc(restaurantName) + "</strong> into a full family outing? Explore verified 100% alcohol-free parks, evening strolls, and kid-friendly events in <strong>" + esc(city) + " (" + esc(zip) + ")</strong> on our sister directory:"
    : "Turning dinner or coffee in <strong>" + esc(city) + "</strong> into a full family outing? Explore verified 100% alcohol-free parks, evening strolls, and kid-friendly events in <strong>" + esc(city) + " (" + esc(zip) + ")</strong> on our sister directory:";

  const cardsHtml = guide.ideas.map((item) => \`
        <article class="gem-card" style="background:rgba(15,23,42,0.55);border-color:rgba(52,211,153,0.28)">
          <div>
            <div style="font-size:0.75rem;color:var(--green);font-weight:800;text-transform:uppercase;letter-spacing:0.03em">\${esc(item.badge)}</div>
            <h3 style="margin:6px 0;font-size:1.05rem"><a href="\${esc(item.url)}" target="_blank" rel="noopener" style="color:var(--text)">\${esc(item.title)} ↗</a></h3>
            <p style="font-size:0.82rem;color:var(--gold);margin:4px 0 6px">📍 \${esc(item.venue)}</p>
            <p style="font-size:0.84rem;color:var(--muted);margin:0 0 12px">\${esc(item.desc)}</p>
          </div>
          <div>
            <a href="\${esc(item.url)}" target="_blank" rel="noopener" class="btn btn-outline" style="padding:7px 13px;font-size:0.8rem;border-color:rgba(52,211,153,0.45);color:var(--green)">View Outing Details ↗</a>
          </div>
        </article>\`).join("");

  const hubLinksHtml = guide.slug
    ? \`
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.08)">
        <a href="\${esc(guide.cityUrl)}" target="_blank" rel="noopener" class="btn">🎡 Open Full \${esc(city)} Family Guide on LetsGetOutKids.com ↗</a>
        <a href="\${esc(guide.cityUrl)}#today-events" target="_blank" rel="noopener" class="btn btn-outline">📅 Happening Today in \${esc(city)}</a>
        <a href="\${esc(guide.cityUrl)}#seasonal-festivals" target="_blank" rel="noopener" class="btn btn-outline">🎄 \${esc(city)} Seasonal Festivals</a>
        <a href="\${esc(guide.cityUrl)}#coming-soon" target="_blank" rel="noopener" class="btn btn-outline">🏗️ Coming Soon to \${esc(city)}</a>
      </div>\`
    : \`
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.08)">
        <a href="\${esc(guide.cityUrl)}" target="_blank" rel="noopener" class="btn">🎡 Explore All 58 City Family Guides on LetsGetOutKids.com ↗</a>
        <a href="https://www.letsgetoutkids.com/today" target="_blank" rel="noopener" class="btn btn-outline">📅 Today's Family Events</a>
        <a href="https://www.letsgetoutkids.com/holiday-festivals" target="_blank" rel="noopener" class="btn btn-outline">🎄 Holiday Light Festivals</a>
      </div>\`;

  return \`
    <section class="section-card" id="after-dinner-guide" style="background:linear-gradient(135deg,rgba(245,194,107,0.10),rgba(52,211,153,0.08));border-color:rgba(52,211,153,0.32)">
      <div class="pill-row" style="margin-bottom:8px">
        <span class="pill pill-green">🎡 Sister Community Directory · LetsGetOutKids.com</span>
        <span class="pill">100% Family-Safe &amp; Alcohol-Free</span>
      </div>
      <h2>\${heading}</h2>
      <p style="margin:0 0 16px;color:var(--muted)">\${intro}</p>
      <div class="gem-grid">
        \${cardsHtml}
      </div>
      \${hubLinksHtml}
    </section>\`;
}
`;

if (!genCode.includes("resolveLgokAfterDinnerGuide")) {
  genCode = genCode.replace(
    "// 1. Generate Individual Restaurant Pages (/gem/[id].html)",
    resolverHelperCode + "\n// 1. Generate Individual Restaurant Pages (/gem/[id].html)"
  );
}

genCode = genCode.replace(
  'const lgokUrl = `https://www.letsgetoutkids.com/?zip=${encodeURIComponent(r.zip)}`;',
  'const lgokGuide = resolveLgokAfterDinnerGuide(r.city, r.state || "CA", r.zip);\n  const lgokUrl = lgokGuide.cityUrl;'
);

genCode = genCode.replace(
  /<section class="section-card" style="background:linear-gradient\(135deg,rgba\(245,194,107,0\.09\),rgba\(52,211,153,0\.06\)\)">\r?\n\s*<h2>🎡 What to Do Before or After Eating[\s\S]*?<\/section>/,
  "${renderAfterDinnerBlockHtml(r.city, r.state || 'CA', r.zip, r.name)}"
);

genCode = genCode.replace(
  'const lgokUrl = `https://www.letsgetoutkids.com/?zip=${encodeURIComponent(zip)}`;',
  'const lgokGuide = resolveLgokAfterDinnerGuide(city, state, zip);\n  const lgokUrl = lgokGuide.cityUrl;'
);

genCode = genCode.replace(
  /<section class="section-card" style="background:linear-gradient\(135deg,rgba\(245,194,107,0\.09\),rgba\(52,211,153,0\.06\)\)">\r?\n\s*<h2>🎡 What to Do After Eating[\s\S]*?<\/section>/,
  "${renderAfterDinnerBlockHtml(city, state, zip, null)}"
);

fs.writeFileSync(genPath, genCode, "utf8");
console.log("1. Updated generate_seo_pages.js");

// Also update public/gems-client.js so the interactive app & HiddenFoodGems_Offline.html show the "What to Do After Dinner in {City}" block!
const clientPath = path.join(hfgDir, "public", "gems-client.js");
let clientCode = fs.readFileSync(clientPath, "utf8");

const clientHelper = `
  function getLgokCityCanonicalUrl(city, state) {
    const c = String(city || '').trim().toLowerCase();
    const s = String(state || 'CA').trim().toLowerCase();
    if (s !== 'ca') return 'https://www.letsgetoutkids.com/cities';
    const directMap = {
      'ontario': 'ontario',
      'rancho cucamonga': 'rancho-cucamonga',
      'chino': 'chino',
      'claremont': 'claremont',
      'upland': 'upland',
      'montclair': 'montclair',
      'pasadena': 'pasadena',
      'anaheim': 'anaheim',
      'irvine': 'irvine',
      'torrance': 'torrance',
      'burbank': 'burbank',
      'glendale': 'glendale',
      'rowland heights': 'diamond-bar',
      'la jolla': 'san-diego',
      'san diego': 'san-diego',
      'downtown los angeles': 'los-angeles',
      'koreatown': 'los-angeles',
      'boyle heights': 'los-angeles',
      'little tokyo': 'los-angeles',
      'north hollywood': 'los-angeles',
      'studio city': 'los-angeles',
      'van nuys': 'los-angeles'
    };
    const slug = directMap[c] || 'los-angeles';
    return 'https://www.letsgetoutkids.com/city/' + slug;
  }
`;

if (!clientCode.includes("getLgokCityCanonicalUrl")) {
  clientCode = clientCode.replace(
    "  function renderDetail(r) {",
    clientHelper + "\n  function renderDetail(r) {"
  );

  clientCode = clientCode.replace(
    `            <a class="ec-tab-btn map-btn" href="\${esc(mapsUrl)}" target="_blank" rel="noopener" data-detail-map="\${esc(r.id)}">
              <span>📍 Route Directions</span>
              <small>\${esc(r.address)}, \${esc(r.city)}</small>
            </a>
          </div>
        </div>
      </div>\`);`,
    `            <a class="ec-tab-btn map-btn" href="\${esc(mapsUrl)}" target="_blank" rel="noopener" data-detail-map="\${esc(r.id)}">
              <span>📍 Route Directions</span>
              <small>\${esc(r.address)}, \${esc(r.city)}</small>
            </a>
          </div>
        </div>

        <!-- Symmetric Funnel: What to Do After Dinner in {City} -->
        <div style="margin-top:14px;padding:14px 16px;border-radius:14px;background:linear-gradient(135deg,rgba(245,194,107,0.14),rgba(52,211,153,0.10));border:1px solid rgba(52,211,153,0.35)">
          <div style="font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;color:#15803d;margin-bottom:4px">🎡 Sister Family Directory · 100% Alcohol-Free</div>
          <div style="font-weight:800;font-size:0.98rem;margin-bottom:4px">What to Do After Dinner in \${esc(r.city)} (\${esc(r.zip || '')})</div>
          <div style="font-size:0.82rem;opacity:0.88;margin-bottom:10px">Explore free parks, library workshops, evening strolls &amp; seasonal family events near <b>\${esc(r.name)}</b>.</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            <a href="\${esc(getLgokCityCanonicalUrl(r.city, r.state))}" target="_blank" rel="noopener" class="btn btn-sm" style="text-decoration:none">🎡 Open \${esc(r.city)} Family Guide ↗</a>
            <a href="\${esc(getLgokCityCanonicalUrl(r.city, r.state))}#today-events" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" style="text-decoration:none">📅 Happening Today</a>
          </div>
        </div>
      </div>\`);`
  );

  fs.writeFileSync(clientPath, clientCode, "utf8");
  console.log("2. Updated public/gems-client.js");
}
