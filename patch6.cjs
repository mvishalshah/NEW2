const fs = require('fs');
const content = fs.readFileSync('src/components/AddExpenseModal.tsx', 'utf-8');
const searchString = `source: scannedReceiptPreview ? 'ocr' : 'manual',`;
const replacement = `source: editExpenseData ? editExpenseData.source : (scannedReceiptPreview ? 'ocr' : 'manual'),`;
const newContent = content.replace(searchString, replacement);
fs.writeFileSync('src/components/AddExpenseModal.tsx', newContent);
