const GEO_CACHE = new Map();

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const rawZip = String(req.query.zip || req.query.q || '').trim();
  const mZip = /^(\d{5})$/.exec(rawZip);
  const zipKey = mZip ? mZip[1] : null;

  if (!zipKey) {
    return res.status(400).send(JSON.stringify({ error: 'Provide a 5-digit zip parameter' }));
  }

  if (GEO_CACHE.has(zipKey)) {
    return res.status(200).send(JSON.stringify(GEO_CACHE.get(zipKey)));
  }

  try {
    const zippoRes = await fetch(`https://api.zippopotam.us/us/${zipKey}`);
    if (zippoRes.ok) {
      const data = await zippoRes.json();
      if (data && data.places && data.places.length > 0) {
        const place = data.places[0];
        const result = {
          zip: zipKey,
          city: place['place name'] || '',
          state: place['state abbreviation'] || '',
          stateFullName: place['state'] || '',
          latitude: parseFloat(place.latitude),
          longitude: parseFloat(place.longitude),
          source: 'zippopotam'
        };
        GEO_CACHE.set(zipKey, result);
        return res.status(200).send(JSON.stringify(result));
      }
    }
  } catch (e) {}

  try {
    const osmRes = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${zipKey}&country=US&format=json`, {
      headers: { 'User-Agent': 'HiddenFoodGemsGeocode/1.0' }
    });
    if (osmRes.ok) {
      const list = await osmRes.json();
      if (Array.isArray(list) && list.length > 0) {
        const it = list[0];
        const parts = (it.display_name || '').split(',').map((s) => s.trim());
        const result = {
          zip: zipKey,
          city: parts[1] || parts[0] || '',
          state: parts[2] || '',
          stateFullName: parts[2] || '',
          latitude: parseFloat(it.lat),
          longitude: parseFloat(it.lon),
          source: 'nominatim'
        };
        GEO_CACHE.set(zipKey, result);
        return res.status(200).send(JSON.stringify(result));
      }
    }
  } catch (e) {}

  return res.status(404).send(JSON.stringify({ error: 'ZIP code not found' }));
};
