import { CountySourceConfig } from './socrata_generic';

export const US_COUNTY_DATASETS: CountySourceConfig[] = [
  // California
  {
    countyName: 'Los Angeles County',
    state: 'CA',
    domain: 'data.lacounty.gov',
    datasetId: '6arr-wq3d',
    facilityNameField: 'facility_name',
    addressField: 'facility_address',
    cityField: 'facility_city',
    zipField: 'facility_zip',
    gradeField: 'grade',
    scoreField: 'score',
    whereClause: "grade = 'A' OR score >= 90",
  },
  {
    countyName: 'San Francisco',
    state: 'CA',
    domain: 'data.sfgov.org',
    datasetId: 'pyih-qa8i',
    facilityNameField: 'business_name',
    addressField: 'business_address',
    cityField: 'business_city',
    zipField: 'business_postal_code',
    scoreField: 'inspection_score',
    whereClause: 'inspection_score >= 90',
  },

  // New York
  {
    countyName: 'New York City',
    state: 'NY',
    domain: 'data.cityofnewyork.us',
    datasetId: '43nn-pn8j',
    facilityNameField: 'dba',
    addressField: 'building',
    cityField: 'boro',
    zipField: 'zipcode',
    gradeField: 'grade',
    scoreField: 'score',
    whereClause: "grade = 'A'",
  },

  // Illinois
  {
    countyName: 'Cook County (Chicago)',
    state: 'IL',
    domain: 'data.cityofchicago.org',
    datasetId: '4ijn-s7e5',
    facilityNameField: 'aka_name',
    addressField: 'address',
    cityField: 'city',
    zipField: 'zip',
    gradeField: 'results',
    whereClause: "results = 'Pass'",
  },

  // Texas
  {
    countyName: 'Travis County (Austin)',
    state: 'TX',
    domain: 'data.austintexas.gov',
    datasetId: 'ecmv-9xre',
    facilityNameField: 'restaurant_name',
    addressField: 'address',
    cityField: 'city',
    zipField: 'zip_code',
    scoreField: 'score',
    whereClause: 'score >= 90',
  },
  {
    countyName: 'Dallas County',
    state: 'TX',
    domain: 'www.dallasopendata.com',
    datasetId: 'dri5-wcct',
    facilityNameField: 'restaurant_name',
    addressField: 'street_address',
    cityField: 'city',
    zipField: 'zip_code',
    scoreField: 'inspection_score',
    whereClause: 'inspection_score >= 90',
  },

  // Washington
  {
    countyName: 'King County (Seattle)',
    state: 'WA',
    domain: 'data.kingcounty.gov',
    datasetId: 'f29t-928x',
    facilityNameField: 'name',
    addressField: 'address',
    cityField: 'city',
    zipField: 'zip_code',
    gradeField: 'inspection_result',
    scoreField: 'inspection_score',
    whereClause: "inspection_result = 'Satisfactory' OR inspection_score <= 10",
  },

  // Maryland / Washington DC Metro
  {
    countyName: 'Montgomery County',
    state: 'MD',
    domain: 'data.montgomerycountymd.gov',
    datasetId: '575k-gpvg',
    facilityNameField: 'establishment_name',
    addressField: 'address',
    cityField: 'city',
    zipField: 'zip',
    gradeField: 'inspection_results',
    whereClause: "inspection_results = 'Passed'",
  },

  // Ohio
  {
    countyName: 'Franklin County (Columbus)',
    state: 'OH',
    domain: 'data.columbus.gov',
    datasetId: 'b75m-m86n',
    facilityNameField: 'facility_name',
    addressField: 'address',
    cityField: 'city',
    zipField: 'zip',
    gradeField: 'standard_status',
  },

  // Colorado
  {
    countyName: 'Denver County',
    state: 'CO',
    domain: 'denvergov.org',
    datasetId: 'food-inspections',
    facilityNameField: 'establishment_name',
    addressField: 'address',
    cityField: 'city',
    zipField: 'zip',
    gradeField: 'grade',
  },

  // Florida
  {
    countyName: 'Miami-Dade County',
    state: 'FL',
    domain: 'opendata.miamidade.gov',
    datasetId: 'food-safety',
    facilityNameField: 'business_name',
    addressField: 'street_address',
    cityField: 'city',
    zipField: 'zip',
    gradeField: 'disposition',
  },

  // Pennsylvania
  {
    countyName: 'Allegheny County (Pittsburgh)',
    state: 'PA',
    domain: 'data.alleghenycounty.us',
    datasetId: 'food-inspections',
    facilityNameField: 'facility_name',
    addressField: 'address',
    cityField: 'city',
    zipField: 'zip',
    gradeField: 'rating',
  }
];
