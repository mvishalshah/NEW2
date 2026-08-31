const fs = require('fs');
let content = fs.readFileSync('src/lib/supabase.ts', 'utf-8');

// Fix owner status
content = content.replace("role: 'owner',\n        status: 'pending'", "role: 'owner',\n        status: 'active'");

// Fix joining member status
content = content.replace("role: 'member',\n      status: 'active'", "role: 'member',\n      status: 'pending'");

fs.writeFileSync('src/lib/supabase.ts', content);
