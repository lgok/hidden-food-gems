const fs = require('fs');
const { execSync } = require('child_process');

try {
  const script = 'Get-ChildItem -Path C:\\Users\\mikic -Recurse -Include *.tsx,*.jsx,*.js,*.html -ErrorAction SilentlyContinue | Select-String -SimpleMatch "Explore Gems" | Select-Object -ExpandProperty Path';
  const out = execSync(`powershell -Command "${script}"`, { maxBuffer: 10 * 1024 * 1024 }).toString();
  console.log('Matches:\n' + out);
} catch(e) {
  console.log('Error:', e.message);
}
