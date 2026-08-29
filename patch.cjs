const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiptScanner.tsx', 'utf8');

const target = `            </div>
            <button
              onClick={capturePhoto}
              disabled={isScanning || !stream}
              className="mt-2 w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/30 flex items-center justify-center shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 rounded-full border-2 border-white" />
            </button>
          </div>
        )}

        {step === 'review' && (`;

const replacement = `            </div>
            
            <div className="flex items-center justify-center gap-6 mt-2">
              <button
                onClick={capturePhoto}
                disabled={isScanning || !stream}
                className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/30 flex items-center justify-center shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Capture Photo"
              >
                <div className="w-12 h-12 rounded-full border-2 border-white" />
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700"
                title="Upload Receipt Image"
              >
                <Upload className="w-5 h-5" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {step === 'review' && (`;

if (code.includes(target)) {
  fs.writeFileSync('src/components/ReceiptScanner.tsx', code.replace(target, replacement));
  console.log("Success");
} else {
  console.log("Failed to find target block");
}
