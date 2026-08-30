const fs = require('fs');
let content = fs.readFileSync('server/ocr.ts', 'utf-8');
content = content.replace(/gemini-3\.1-pro-preview/g, "gemini-3.1-flash-lite");
fs.writeFileSync('server/ocr.ts', content);
