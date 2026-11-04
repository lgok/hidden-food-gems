// Client-side voting module for HiddenFoodGem.com

(function() {
  const CANDIDATES = ['momoka-ontario', 'fire-tiger-chino', 'spirit-of-texas-norco'];
  const STORAGE_KEY = 'hfg_voted_candidate_nov26';
  const DEVICE_ID_KEY = 'hfg_device_uuid_v1';

  function getDeviceId() {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  }

  function getStoredVote() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch(e) {
      return null;
    }
  }

  function setStoredVote(candidateId) {
    try {
      localStorage.setItem(STORAGE_KEY, candidateId);
    } catch(e) {}
  }

  // Update UI with vote percentages
  function applyVoteTallies(tallies, total) {
    const totalCount = total || Object.values(tallies).reduce((a, b) => a + b, 0) || 1;
    const totalEl = document.getElementById('vote-total-num');
    if (totalEl) totalEl.textContent = totalCount.toLocaleString();

    CANDIDATES.forEach(id => {
      const count = tallies[id] || 0;
      const pct = Math.round((count / totalCount) * 100);

      const countEl = document.getElementById(`vote-count-${id}`);
      const pctEl = document.getElementById(`vote-percent-${id}`);
      const barFill = document.getElementById(`bar-fill-${id}`);
      const wrap = document.getElementById(`result-wrap-${id}`);

      if (countEl) countEl.textContent = `${count.toLocaleString()} votes`;
      if (pctEl) pctEl.textContent = `${pct}%`;
      if (barFill) barFill.style.width = `${pct}%`;
      if (wrap) wrap.style.display = 'block';
    });
  }

  // Highlight if already voted
  function markCardAsVoted(candidateId) {
    const card = document.querySelector(`.vote-dish-card[data-candidate-id="${candidateId}"]`);
    if (card) {
      card.style.borderColor = '#22c55e';
      card.style.boxShadow = '0 0 20px rgba(34,197,94,0.35)';
      const stamp = document.getElementById(`stamp-${candidateId}`);
      if (stamp) stamp.style.display = 'flex';
      const btn = document.getElementById(`btn-vote-${candidateId}`);
      if (btn) {
        btn.style.background = '#22c55e';
        btn.style.color = '#fff';
        btn.style.borderColor = '#22c55e';
        btn.innerHTML = '<span>✓ Your Device Vote</span>';
      }
    }

    // Disable all other buttons
    CANDIDATES.forEach(id => {
      if (id !== candidateId) {
        const btn = document.getElementById(`btn-vote-${id}`);
        if (btn) {
          btn.disabled = true;
          btn.style.opacity = '0.5';
          btn.style.cursor = 'default';
          btn.innerHTML = '<span>Vote Recorded</span>';
        }
      }
    });

    const infoMsg = document.getElementById('vote-info-msg');
    if (infoMsg) {
      infoMsg.innerHTML = `🎉 <strong>Thank you! Your device vote has been recorded.</strong> Live results are updating below!`;
    }
  }

  // Fetch initial tallies
  async function loadVoteStatus() {
    try {
      const res = await fetch('/api/vote');
      if (res.ok) {
        const data = await res.json();
        if (data.votes) {
          applyVoteTallies(data.votes, data.totalVotes);
        }
      }
    } catch(err) {
      // Fallback local baseline
      applyVoteTallies({
        'momoka-ontario': 0,
        'fire-tiger-chino': 0,
        'spirit-of-texas-norco': 0
      }, 0);
    }

    const previousVote = getStoredVote();
    if (previousVote) {
      markCardAsVoted(previousVote);
    }
  }

  // Main vote handler triggered by dish card click
  window.selectVoteCandidate = async function(candidateId) {
    const existing = getStoredVote();
    if (existing) {
      alert('You have already cast your vote from this device for this month!');
      return;
    }

    if (navigator.vibrate) navigator.vibrate(50);

    const deviceId = getDeviceId();
    setStoredVote(candidateId);
    markCardAsVoted(candidateId);

    // Call API
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, deviceId })
      });
      const data = await res.json();
      if (data.votes) {
        applyVoteTallies(data.votes, data.totalVotes);
      }
    } catch(e) {
      console.warn('Offline tally update:', e);
    }
  };

  // Auto-init on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadVoteStatus);
  } else {
    loadVoteStatus();
  }
})();
