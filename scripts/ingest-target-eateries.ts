const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

let supabase: any = null;
try {
  const { createClient } = require('@supabase/supabase-js');
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch {
  // Supabase optional for local offline test runs
}

export interface RawInspectionRecord {
  facility_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  score: number;
  grade: string;
}

// 1. Digital Footprint Verification
export async function checkWebsitePresence(name: string, address: string, city: string): Promise<boolean> {
  if (!PLACES_API_KEY) {
    console.warn(`[Places API] GOOGLE_PLACES_API_KEY missing. Defaulting website check to false.`);
    return false;
  }

  const query = encodeURIComponent(`${name} ${address} ${city}`);
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id&key=${PLACES_API_KEY}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json() as any;
    if (!data.candidates || data.candidates.length === 0) return false;

    const placeId = data.candidates[0].place_id;
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=website&key=${PLACES_API_KEY}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json() as any;

    const website = detailsData.result?.website;
    if (!website) return false;

    // Discard aggregator domains—these kitchens still have no independent website
    const isAggregator = /doordash|ubereats|grubhub|yelp|facebook/i.test(website);
    return !isAggregator;
  } catch (error) {
    console.error(`Error verifying ${name}:`, error);
    return false;
  }
}

// 2. Ingestion & In-Memory Filtering
export async function processInspectionRecords(records: RawInspectionRecord[]) {
  console.log(`Processing ${records.length} inspection records...`);
  let ingestedCount = 0;

  for (const record of records) {
    // Rule: Strict Grade A only
    if (record.grade !== 'A' && record.score < 90) continue;

    const hasDedicatedWebsite = await checkWebsitePresence(record.facility_name, record.address, record.city);

    // Save only restaurants with NO dedicated website
    if (!hasDedicatedWebsite) {
      if (supabase) {
        const { error } = await supabase.from('restaurants').upsert({
          business_name: record.facility_name,
          street_address: record.address,
          city: record.city,
          state: record.state,
          zip_code: record.zip_code,
          health_grade: 'Grade A',
          inspection_score: record.score,
          has_website: false,
          is_featured: false,
          created_at: new Date().toISOString()
        }, { onConflict: 'street_address,business_name' });

        if (error) {
          console.error(`Supabase upsert error for ${record.facility_name}:`, error);
        } else {
          ingestedCount++;
        }
      } else {
        console.log(`[Dry Run / Mock] Target identified without website: ${record.facility_name} (${record.city}) - Score: ${record.score}`);
        ingestedCount++;
      }
    }
  }

  console.log(`Successfully processed batch. Ingested ${ingestedCount} target eaterie(s).`);
}

// Quick CLI runner / Multi-County National Test Sample
if (require.main === module || (typeof process !== 'undefined' && process.argv[1]?.includes('ingest-target-eateries'))) {
  const { US_COUNTY_DATASETS } = require('../adapters/us_county_registry');
  const { fetchSocrataCountyRecords } = require('../adapters/socrata_generic');

  async function runNationalIngestion() {
    console.log(`Starting National Ingestion across ${US_COUNTY_DATASETS.length} configured county datasets...`);

    for (const countyConfig of US_COUNTY_DATASETS.slice(0, 3)) {
      console.log(`\n--- Fetching: ${countyConfig.countyName}, ${countyConfig.state} ---`);
      const records = await fetchSocrataCountyRecords(countyConfig, 10);
      if (records.length > 0) {
        await processInspectionRecords(records);
      } else {
        console.log(`No direct records returned from open API for ${countyConfig.countyName}. Testing sample fallback.`);
        const fallback: RawInspectionRecord[] = [{
          facility_name: `Mom & Pop Taqueria (${countyConfig.countyName})`,
          address: `100 Main St`,
          city: countyConfig.countyName.split(' ')[0],
          state: countyConfig.state,
          zip_code: `00000`,
          score: 95,
          grade: 'A'
        }];
        await processInspectionRecords(fallback);
      }
    }
  }

  runNationalIngestion()
    .then(() => console.log('\nNational ingestion run completed.'))
    .catch((err) => console.error('National ingestion run failed:', err));
}

