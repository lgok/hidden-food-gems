const fs = require('fs');

const p = 'C:/Users/mikic/iehome-events/lib/analytics.ts';
let code = fs.readFileSync(p, 'utf8');

// Add import { track } from "@vercel/analytics"; at top if not present
if (!code.includes('import { track } from "@vercel/analytics"')) {
  code = 'import { track } from "@vercel/analytics";\n' + code;
}

// Add Vercel track call inside trackEvent
const targetPoint = '// Forward to Google Analytics (GA4 / gtag.js) if loaded';

const vercelTrackingSnippet = `// Forward custom event to Vercel Analytics Dashboard
    try {
      track(eventType, {
        path,
        city,
        ...(details?.brandOrTitle ? { label: String(details.brandOrTitle).slice(0, 50) } : {}),
        ...(details?.category ? { category: String(details.category).slice(0, 50) } : {}),
      });
    } catch {}

    // Forward to Google Analytics (GA4 / gtag.js) if loaded`;

if (code.includes(targetPoint) && !code.includes('// Forward custom event to Vercel Analytics Dashboard')) {
  code = code.replace(targetPoint, vercelTrackingSnippet);
  fs.writeFileSync(p, code, 'utf8');
  console.log('Updated lib/analytics.ts with Vercel custom event tracking!');
} else {
  console.log('Snippet already added or targetPoint not found');
}
