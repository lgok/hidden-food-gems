const fs = require('fs');

const files = [
  't:/antigravity/mibees/hidden-food-gems/gems-client.js',
  't:/antigravity/mibees/hidden-food-gems/public/gems-client.js'
];

files.forEach(p => {
  let js = fs.readFileSync(p, 'utf8');

  // Only render curatedPhotos if verifiedPhoto or ownerVerified is explicitly true!
  // Otherwise, hide the unverified stock/AI photo trio strip entirely.
  const oldCondition = '${curatedPhotos.length ? `';
  const newCondition = '${(r.verifiedPhoto || r.ownerVerified) && curatedPhotos.length ? `';

  if (js.includes(oldCondition)) {
    js = js.replace(oldCondition, newCondition);
    fs.writeFileSync(p, js, 'utf8');
    console.log('Updated photo-trio condition in', p);
  } else {
    console.log('Condition not found in', p);
  }
});
