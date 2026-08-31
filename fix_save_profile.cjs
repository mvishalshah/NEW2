const fs = require('fs');
let content = fs.readFileSync('src/components/ProfileView.tsx', 'utf-8');

content = content.replace(
  "bio: bio.trim()",
  "bio: bio.trim(),\n      monthlyLimits"
);

fs.writeFileSync('src/components/ProfileView.tsx', content);
