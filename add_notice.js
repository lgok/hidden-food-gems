const fs = require('fs');

// 1. Update public/styles.css to add styling for notice banners
const cssPath = 't:/antigravity/mibees/hidden-food-gems/public/styles.css';
let css = fs.readFileSync(cssPath, 'utf8');

const noticeStyles = `
/* Community Notice Callout */
.community-notice-banner {
  background: #fff9ed;
  border: 1px solid #fed7aa;
  border-left: 4px solid var(--saffron);
  border-radius: 12px;
  padding: 10px 14px;
  margin: 10px 0 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  color: var(--ink);
  line-height: 1.35;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.community-notice-banner .notice-icon {
  font-size: 1.35rem;
  flex-shrink: 0;
}
.community-notice-banner p {
  margin: 0;
}
.community-notice-banner b {
  color: #c2410c;
}
.card-notice-note {
  background: #fffaf0;
  border-top: 1px dashed #fcd34d;
  padding: 5px 8px;
  margin-top: 4px;
  border-radius: 6px;
  font-size: 0.68rem;
  color: #78350f;
  display: flex;
  align-items: center;
  gap: 5px;
  line-height: 1.25;
}
`;

if (!css.includes('.community-notice-banner')) {
  css += '\n' + noticeStyles + '\n';
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Appended notice styles to styles.css');
}

// 2. Update gems-client.js and public/gems-client.js
const targets = [
  't:/antigravity/mibees/hidden-food-gems/gems-client.js',
  't:/antigravity/mibees/hidden-food-gems/public/gems-client.js'
];

targets.forEach((p) => {
  let js = fs.readFileSync(p, 'utf8');

  // Add the banner above the grid in renderHome
  const bannerHtml = `<div class="community-notice-banner" role="note">
          <span class="notice-icon">💡</span>
          <p><b>Please Note:</b> Before visiting, please double-check the restaurant, neighborhood, current hours, and recent ratings directly on the restaurant's official website, social media, or phone.</p>
        </div>`;

  if (!js.includes('community-notice-banner')) {
    js = js.replace(
      '<div class="results-head"><h2 id="results-title">Verified gems across the United States</h2><span id="results-count"></span></div>',
      '<div class="results-head"><h2 id="results-title">Verified gems across the United States</h2><span id="results-count"></span></div>\n        ' + bannerHtml
    );
  }

  // Also add a friendly verification reminder inside the detail sheet (renderDetail)
  const detailReminder = `<!-- Community Verification Reminder -->
        <div class="community-notice-banner" style="margin: 8px 0 10px; font-size: 0.78rem;">
          <span class="notice-icon">💡</span>
          <p><b>Helpful Tip:</b> Please double-check with the restaurant directly (by calling or checking their official website) to confirm their latest hours, current menu items, and neighborhood details before heading out!</p>
        </div>`;

  if (!js.includes('Helpful Tip:</b> Please double-check with the restaurant directly') && js.includes('<!-- Scratch-Made Line Only')) {
    js = js.replace(
      '<!-- Scratch-Made Line Only',
      detailReminder + '\n\n        <!-- Scratch-Made Line Only'
    );
  }

  fs.writeFileSync(p, js, 'utf8');
  console.log('Updated', p);
});
