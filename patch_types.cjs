const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');

if (!content.includes('monthlyLimits?: Record<string, number>;')) {
  content = content.replace('createdAt: string;', 'createdAt: string;\n  monthlyLimits?: Record<string, number>;');
}

if (!content.includes("'spending_limit_warning'")) {
  content = content.replace("| 'ocr_complete'", "| 'ocr_complete'\n    | 'spending_limit_warning'");
}

fs.writeFileSync('src/types.ts', content);
