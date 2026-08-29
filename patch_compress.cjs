const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiptScanner.tsx', 'utf8');

const targetUpload = `  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setCapturedImage(base64);
      stopCamera();
      processImage(base64);
    };
    reader.readAsDataURL(file);
    
    // Reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };`;

const replacementUpload = `  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1500;
        const MAX_HEIGHT = 1500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setCapturedImage(compressedBase64);
          stopCamera();
          processImage(compressedBase64);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
    
    // Reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };`;

const targetProcess = `      const res = await fetch('/api/ocr/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: 'image/jpeg' })
      });
      
      if (!res.ok) {
        throw new Error('Failed to parse image');
      }`;

const replacementProcess = `      const res = await fetch('/api/ocr/parse', {
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
      }`;

if (code.includes(targetUpload) && code.includes(targetProcess)) {
  code = code.replace(targetUpload, replacementUpload);
  code = code.replace(targetProcess, replacementProcess);
  fs.writeFileSync('src/components/ReceiptScanner.tsx', code);
  console.log("Success");
} else {
  console.log("Failed to find target blocks");
  if (!code.includes(targetUpload)) console.log("Missing upload block");
  if (!code.includes(targetProcess)) console.log("Missing process block");
}
