const fs = require('fs');
let content = fs.readFileSync('src/components/ReceiptScanner.tsx', 'utf-8');
content = content.replace(
  "errMsg = errJson.error || errJson.details || errMsg;",
  "errMsg = errJson.details || errJson.error || errMsg;"
).replace(
  "if (res.status === 413) errMsg = 'Image is too large. Please crop or compress it.';",
  "if (res.status === 413) errMsg = 'Image is too large. Please crop or compress it.';\n          if (res.status === 504) errMsg = 'Vercel timeout (10s limit reached). Please try again or upgrade hosting.';"
);
fs.writeFileSync('src/components/ReceiptScanner.tsx', content);
