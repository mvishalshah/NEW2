const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiptScanner.tsx', 'utf8');

// Replace MAX_WIDTH and MAX_HEIGHT values
code = code.replace(/const MAX_WIDTH = 1500;/g, 'const MAX_WIDTH = 800;');
code = code.replace(/const MAX_HEIGHT = 1500;/g, 'const MAX_HEIGHT = 800;');

// Replace toDataURL quality values
code = code.replace(/canvas\.toDataURL\('image\/jpeg', 0\.8\)/g, "canvas.toDataURL('image/jpeg', 0.5)");

fs.writeFileSync('src/components/ReceiptScanner.tsx', code);
console.log("Success");
