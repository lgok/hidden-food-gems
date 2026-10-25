const fs = require('fs');
const appFile = 't:\\antigravity\\mibees\\hidden-food-gems\\public\\app.js';
let app = fs.readFileSync(appFile, 'utf8');

const sIdx = app.indexOf('  const placeholderHtml = (r) =>');
const eIdx = app.indexOf('  const tagHtml = (t) =>');

if (sIdx === -1 || eIdx === -1) {
  console.error('Could not find target boundaries');
  process.exit(1);
}

const replacement = `  const placeholderHtml = (r) => {
    const mailSubject = encodeURIComponent(r.name + ' - 3-Sec Video Submission');
    const mailBody = encodeURIComponent('Hi Hidden Food Gems team,\\n\\nI am the owner of ' + r.name + ' in ' + (r.city || '') + ', CA.\\nHere is our short 3-second phone video of our food / storefront for review.\\n\\nRestaurant: ' + r.name + '\\nAddress: ' + (r.address || '') + ', ' + (r.city || '') + ', CA\\nPhone: ' + (r.phone || '') + '\\n\\nThank you!');
    const mailto = 'mailto:letsgetoutkids@gmail.com?subject=' + mailSubject + '&body=' + mailBody;
    return '<div class="ph ph-' + (hashNum(r.id) % 5) + ' ph-owner-tile">' +
      '<span class="ph-badge-coming-soon">📷 Owner Verified Photo Coming Soon</span>' +
      '<div style="font-size:1.6rem;line-height:1;margin:3px 0 4px;filter:drop-shadow(0 2px 6px rgba(0,0,0,.4))">' + emojiFor(r) + '</div>' +
      '<a class="ph-claim-btn" href="' + mailto + '" data-claim-clip="' + esc(r.id) + '" title="Are you the owner? Email us your 3-second video clip to feature free!">' +
        '<span>🎥 Are you the owner? Send us your 3-sec clip</span>' +
      '</a>' +
      '<div class="ph-cuisine-sub">' + esc(r.cuisine || 'Family Kitchen') + ' · ' + esc(r.city || '') + '</div>' +
    '</div>';
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
        return '<img src="' + esc(img) + '" alt="' + esc(r.name) + ' food" ' + (eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"') + ' onerror="this.outerHTML=\\'' + placeholderHtml(r).replace(/'/g, '&#39;').replace(/"/g, '&quot;') + '\\'">';
      }
    }
    return placeholderHtml(r);
  };
`;

app = app.substring(0, sIdx) + replacement + app.substring(eIdx);

// Also add click handler prevention on data-claim-clip so clicking the claim button opens mailto directly without triggering the card detail modal
const clickTarget = "      const c = e.target.closest('[data-id]');";
const clickReplacement = `      const claimBtn = e.target.closest('[data-claim-clip]');
      if (claimBtn) {
        e.stopPropagation();
        return; // Allow native mailto link to open without bubbling into the card detail sheet
      }

      const c = e.target.closest('[data-id]');`;

if (!app.includes('data-claim-clip') && app.includes(clickTarget)) {
  app = app.replace(clickTarget, clickReplacement);
}

fs.writeFileSync(appFile, app, 'utf8');
console.log('Successfully updated app.js!');
