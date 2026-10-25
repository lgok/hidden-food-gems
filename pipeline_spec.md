# Pipeline Specification: Zero-Website Grade-A Restaurant Ingestion

## 1. Goal
Ingest certified Grade-A food facilities nationwide from county/state public health data portals that have no active website, formatting them directly into the directory schema.

## 2. Ingestion Filters (Strict Public Health Criteria)
- Current Inspection Grade: 'A' (Score >= 90 or county equivalent pass/A rating).
- Facility Type: Food Facility (Restaurant, Taqueria, Cafe, Bakery, Diner).
- Exclude: Non-dining facilities (schools, temporary events, convenience stores, gas stations).

## 3. Digital Footprint Verification Logic
For every candidate facility:
1. Query Google Places API / Search Places using `name + street_address + city`.
2. Extract the `website` attribute.
3. Verification Rules:
   - If `website` is NULL or empty string -> MARK AS TARGET (`has_website = false`).
   - If `website` redirects solely to a DoorDash/UberEats/Yelp page -> MARK AS TARGET (`has_website = false`).
   - If `website` is a dedicated custom domain (e.g. `.com`, `.net`, `.org`) -> DISCARD.

## 4. National Adaptability Architecture
- Use a county-level adapter pattern:
  - `adapters/socrata_generic.ts` (Handles Socrata open data portals used by hundreds of US counties: LA County, Chicago, NYC, Dallas, King County, etc.).
  - `adapters/ezop_san_bernardino.ts` (Direct parser for EZOP portal).
  - `adapters/rivco_eh.ts` (Direct parser for Riverside DEH).
