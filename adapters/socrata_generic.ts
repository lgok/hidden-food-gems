import { RawInspectionRecord } from '../scripts/ingest-target-eateries';

export interface CountySourceConfig {
  countyName: string;
  state: string;
  domain: string;
  datasetId: string;
  facilityNameField: string;
  addressField: string;
  cityField: string;
  zipField: string;
  gradeField?: string;
  scoreField?: string;
  facilityTypeField?: string;
  whereClause?: string;
}

export async function fetchSocrataCountyRecords(config: CountySourceConfig, limit = 100): Promise<RawInspectionRecord[]> {
  const where = config.whereClause ? `&$where=${encodeURIComponent(config.whereClause)}` : '';
  const url = `https://${config.domain}/resource/${config.datasetId}.json?$limit=${limit}${where}`;

  try {
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      console.warn(`[Socrata Adapter] ${config.countyName}, ${config.state} returned non-JSON response (status: ${res.status}, type: ${contentType})`);
      return [];
    }
    const rows = (await res.json()) as any[];
    if (!Array.isArray(rows)) return [];

    return rows.map((r) => {
      const scoreNum = config.scoreField && r[config.scoreField] ? parseInt(r[config.scoreField], 10) : 95;
      const gradeVal = config.gradeField && r[config.gradeField] ? String(r[config.gradeField]).toUpperCase() : (scoreNum >= 90 ? 'A' : 'B');

      return {
        facility_name: String(r[config.facilityNameField] || '').trim(),
        address: String(r[config.addressField] || '').trim(),
        city: String(r[config.cityField] || config.countyName).trim(),
        state: config.state,
        zip_code: String(r[config.zipField] || '').trim().slice(0, 5),
        score: isNaN(scoreNum) ? 90 : scoreNum,
        grade: gradeVal,
      };
    }).filter((item) => item.facility_name && item.address);
  } catch (err) {
    console.error(`[Socrata Adapter] Error fetching ${config.countyName}, ${config.state}:`, err);
    return [];
  }
}
