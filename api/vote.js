// Vercel Serverless Function: /api/vote
// Backed by persistent cloud counter (abacus.jasoncameron.dev)
// Never resets on cold start or redeployments!

const https = require('https');

const CANDIDATES = [
  'klatch-coffee-rancho-cucamonga',
  'qamaria-yemeni-coffee-rancho',
  'mestiza-coffeehouse-ontario',
  'iron-and-kin-coffee-claremont'
];

const NAMESPACE = 'hiddenfoodgem-coffee-nov26';

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'HiddenFoodGem-Sync/1.0' }, timeout: 4000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function getPersistentVotes() {
  const tallies = {};
  const promises = CANDIDATES.map(async (cid) => {
    const res = await fetchJson(`https://abacus.jasoncameron.dev/get/${NAMESPACE}/${cid}`);
    tallies[cid] = (res && typeof res.value === 'number') ? res.value : 0;
  });
  await Promise.all(promises);
  return tallies;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const votes = await getPersistentVotes();
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    return res.status(200).json({
      success: true,
      votes,
      totalVotes
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { candidateId } = body;

      if (!candidateId || !CANDIDATES.includes(candidateId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid candidate selection.'
        });
      }

      // Increment in persistent cloud storage
      await fetchJson(`https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${candidateId}`);

      const votes = await getPersistentVotes();
      const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

      return res.status(200).json({
        success: true,
        message: 'Vote cast and saved to cloud!',
        votes,
        totalVotes
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to record vote: ' + err.message
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
