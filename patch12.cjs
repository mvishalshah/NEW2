const fs = require('fs');
let content = fs.readFileSync('server/ocr.ts', 'utf-8');
content = content.replace(/gemini-1\.5-flash/g, "gemini-3.7-flash");
content = content.replace(/gemini-1\.5-pro/g, "gemini-3.1-pro-preview");
fs.writeFileSync('server/ocr.ts', content);
