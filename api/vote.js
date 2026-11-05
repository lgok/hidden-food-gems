// Vercel Serverless Function: /api/vote
// In-memory tally with device/client IP & device fingerprint enforcement

let voteTallies = {
  "klatch-coffee-rancho-cucamonga": 0,
  "qamaria-yemeni-coffee-rancho": 0,
  "mestiza-coffeehouse-ontario": 0,
  "iron-and-kin-coffee-claremont": 0
};

// Set of voted device fingerprints / IPs to prevent ballot stuffing
const votedDevices = new Set();

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const totalVotes = Object.values(voteTallies).reduce((a, b) => a + b, 0);
    return res.status(200).json({
      success: true,
      votes: voteTallies,
      totalVotes: totalVotes
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { candidateId, deviceId } = body;

      if (!candidateId || !voteTallies.hasOwnProperty(candidateId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid candidate selection.'
        });
      }

      const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
      const voterKey = deviceId ? `dev_${deviceId}` : `ip_${clientIp.split(',')[0].trim()}`;

      if (votedDevices.has(voterKey)) {
        const totalVotes = Object.values(voteTallies).reduce((a, b) => a + b, 0);
        return res.status(200).json({
          success: false,
          alreadyVoted: true,
          message: 'You have already cast your vote from this device!',
          votes: voteTallies,
          totalVotes: totalVotes
        });
      }

      votedDevices.add(voterKey);
      voteTallies[candidateId] = (voteTallies[candidateId] || 0) + 1;
      const totalVotes = Object.values(voteTallies).reduce((a, b) => a + b, 0);

      return res.status(200).json({
        success: true,
        alreadyVoted: false,
        message: 'Vote cast successfully!',
        votes: voteTallies,
        totalVotes: totalVotes
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to process vote: ' + err.message
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
