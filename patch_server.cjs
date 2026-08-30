const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');
content = content.replace(/from '\.\/server\/db\.js'/g, "from './server/db'");
content = content.replace(/from '\.\/server\/ocr\.js'/g, "from './server/ocr'");
fs.writeFileSync('server.ts', content);
