const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiptScanner.tsx', 'utf8');

if (!code.includes('Sparkles')) {
  code = code.replace(/import \{ Camera/g, 'import { Camera, Sparkles');
}

const target = `              {isScanning ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 text-white z-10 backdrop-blur-sm">
                  <RefreshCw className="w-10 h-10 animate-spin text-indigo-400 mb-4" />
                  <p className="font-medium animate-pulse">Extracting products & prices...</p>
                </div>
              ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              )}
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Camera overlay guide */}
              {!isScanning && (`;

const replacement = `              {capturedImage ? (
                <img src={capturedImage} alt="Receipt Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              )}

              {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/70 text-white z-10 backdrop-blur-sm p-6 text-center">
                  <div className="relative w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/40">
                    <div className="absolute inset-0 bg-indigo-400 rounded-2xl animate-ping opacity-30"></div>
                    <Sparkles className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Analyzing Receipt</h3>
                  <p className="text-sm text-indigo-200 font-medium">Gemini AI is extracting items...</p>
                  
                  <div className="w-full max-w-[200px] h-1.5 bg-slate-800 rounded-full mt-8 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-2/3 animate-pulse"></div>
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
              
              {/* Camera overlay guide */}
              {!isScanning && !capturedImage && (`;

if (code.includes(target)) {
  fs.writeFileSync('src/components/ReceiptScanner.tsx', code.replace(target, replacement));
  console.log("Success");
} else {
  console.log("Failed to find target");
}
