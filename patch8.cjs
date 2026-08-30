const fs = require('fs');
let content = fs.readFileSync('server/ocr.ts', 'utf-8');
content = content.replace(/gemini-3\.6-flash/g, "gemini-1.5-flash");
content = content.replace(/gemini-3\.7-flash/g, "gemini-1.5-flash");
content = content.replace(
  "      console.warn('gemini-1.5-flash call failed, attempting gemini-pro:', primaryErr.message);\n      modelUsed = 'gemini-pro';\n      response = await ai.models.generateContent({\n        model: 'gemini-pro',",
  "      console.warn('gemini-1.5-flash call failed, attempting gemini-1.5-pro:', primaryErr.message);\n      modelUsed = 'gemini-1.5-pro';\n      response = await ai.models.generateContent({\n        model: 'gemini-1.5-pro',"
);
fs.writeFileSync('server/ocr.ts', content);
