const fs = require('fs');

['t:/antigravity/mibees/hidden-food-gems/gems-client.js', 't:/antigravity/mibees/hidden-food-gems/public/gems-client.js'].forEach(p => {
  if (!fs.existsSync(p)) return;
  let code = fs.readFileSync(p, 'utf8');
  const sIdx = code.indexOf('const placeholderHtml = (r) => {');
  const eIdx = code.indexOf('const mediaHtml = (r,');
  if (sIdx !== -1 && eIdx !== -1) {
    const clean = 'const placeholderHtml = (r) => {\n    return \'<div class="ph ph-\' + (hashNum(r.id) % 5) + \' ph-owner-tile"></div>\';\n  };\n\n  ';
    code = code.substring(0, sIdx) + clean + code.substring(eIdx);
    fs.writeFileSync(p, code, 'utf8');
    console.log('Cleaned', p);
  } else {
    console.log('Could not find boundaries in', p);
  }
});
