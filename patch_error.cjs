const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiptScanner.tsx', 'utf8');

const targetProcess = `      const res = await fetch('/api/ocr/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: 'image/jpeg' })
      });
      
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        let errMsg = 'Failed to parse image (Server Error)';
        try {
          const errJson = JSON.parse(errText);
          errMsg = errJson.error || errJson.details || errMsg;
        } catch(e) {
          if (res.status === 413) errMsg = 'Image is too large. Please crop or compress it.';
        }
        throw new Error(errMsg);
      }
      
      const data = await res.json();`;

const replacementProcess = `      const res = await fetch('/api/ocr/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: 'image/jpeg' })
      });
      
      const rawText = await res.text();
      
      if (rawText.includes('__cookie_check') || rawText.includes('aistudio_auth_flow')) {
        throw new Error('Please click the "Open in new tab" icon at the top right of this preview. Third-party cookies are blocking the AI scanner.');
      }
      
      if (!res.ok) {
        let errMsg = \`Server Error (\${res.status})\`;
        try {
          const errJson = JSON.parse(rawText);
          errMsg = errJson.error || errJson.details || errMsg;
        } catch(e) {
          if (res.status === 413) errMsg = 'Image is too large. Please crop or compress it further.';
          else errMsg = \`Failed to parse image (HTTP \${res.status})\`;
        }
        throw new Error(errMsg);
      }
      
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (err) {
        throw new Error('Invalid response from server. Please try again.');
      }`;

if (code.includes(targetProcess)) {
  fs.writeFileSync('src/components/ReceiptScanner.tsx', code.replace(targetProcess, replacementProcess));
  console.log("Success");
} else {
  console.log("Failed to find target block");
}
