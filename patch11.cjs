const fs = require('fs');
let content = fs.readFileSync('server/app.ts', 'utf-8');
content = content.replace(/from '\.\/server\/db'/g, "from './db'");
content = content.replace(/from '\.\/server\/ocr'/g, "from './ocr'");
fs.writeFileSync('server/app.ts', content);
