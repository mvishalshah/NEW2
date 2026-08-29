import React, { useState, useRef, useEffect } from 'react';
import { Camera, Sparkles, Trash2, Plus, Check, RefreshCw, X, Upload } from 'lucide-react';

interface ScannedItem {
  id: string;
  name: string;
  price: number;
}

interface ReceiptScannerProps {
  onComplete: (items: ScannedItem[], total: number) => void;
  onCancel: () => void;
}

export const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onComplete, onCancel }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [step, setStep] = useState<'camera' | 'review'>('camera');
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Camera access denied or unavailable.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (step === 'camera') {
      startCamera();
    }
    return () => stopCamera();
  }, [step]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const MAX_WIDTH = 500;
      const MAX_HEIGHT = 500;
      let width = video.videoWidth;
      let height = video.videoHeight;

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
        ctx.drawImage(video, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', 0.4);
        setCapturedImage(base64);
        stopCamera();
        processImage(base64);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
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
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.4);
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
  };

  const processImage = async (base64: string) => {
    setIsScanning(true);
    setError(null);
    try {
      const res = await fetch('/api/ocr/parse', {
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
      
      const data = await res.json();
      if (data.success && data.result && data.result.items) {
        const parsedItems = data.result.items.map((item: any, idx: number) => ({
          id: Date.now().toString() + idx,
          name: item.name || '',
          price: Number(item.unitPrice || item.price || item.totalPrice || 0)
        }));
        setItems(parsedItems);
        setStep('review');
      } else {
        throw new Error('No items found in receipt');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while scanning.');
      setStep('camera');
      setCapturedImage(null);
    } finally {
      setIsScanning(false);
    }
  };

  const updateItem = (index: number, field: keyof ScannedItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', price: 0 }]);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  };

  const handleConfirm = () => {
    onComplete(items, calculateTotal());
  };

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 w-full max-w-2xl mx-auto shadow-xl">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-indigo-600" />
          Receipt Scanner
        </h2>
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium border border-rose-200">
            {error}
          </div>
        )}

        {step === 'camera' && (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-sm aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-inner">
              {capturedImage ? (
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
              {!isScanning && !capturedImage && (
                <div className="absolute inset-0 pointer-events-none border-2 border-white/20 m-6 rounded-xl border-dashed">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 text-sm font-medium text-center">
                    Align receipt<br/>within frame
                  </div>
                </div>
              )}
            </div>

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

        {step === 'review' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Extracted Products
              </h3>
              <button 
                onClick={addItem}
                className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:text-indigo-700"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden overflow-x-auto shadow-sm">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3 text-right">Price (₹)</th>
                    <th className="px-4 py-3 text-center w-16">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(idx, 'name', e.target.value)}
                          className="font-medium text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none w-full min-w-[150px]"
                          placeholder="Item name"
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={item.price || ''}
                          onChange={(e) => updateItem(idx, 'price', Number(e.target.value))}
                          className="font-bold font-mono text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none w-24 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => removeItem(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                        No items found. Try scanning again or add manually.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-700 dark:text-slate-300">Total Calculation</span>
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                ₹{calculateTotal().toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setStep('camera');
                  setCapturedImage(null);
                  setItems([]);
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Retake Photo
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Confirm & Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
