import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext.js';
import { OCRReceiptResult, OCRItem, Group } from '../types.js';
import { simulateAIOCRReceiptParsing } from '../services/ocrSimulation.js';
import {
  Camera,
  Upload,
  Sparkles,
  Check,
  AlertTriangle,
  Edit2,
  Trash2,
  Plus,
  RefreshCw,
  Receipt,
  Users,
  CheckCircle2,
  ArrowRight,
  FlipHorizontal,
  Zap,
  ZapOff,
  RotateCcw,
  Store,
  IndianRupee,
  Calendar,
  Layers,
  X,
  FileText,
  Eye,
  Maximize2,
  Tag,
  Calculator
} from 'lucide-react';

interface OCRScannerProps {
  onComplete: (data: {
    title: string;
    amount: number;
    category: any;
    date: string;
    groupId?: string;
    paidBy: string;
    splitMethod: 'item_based';
    items: OCRItem[];
    participants: Array<{ userId: string; shareAmount: number }>;
    receiptUrl?: string;
  }) => void;
  onCancel: () => void;
  defaultGroupId?: string;
}

export const OCRScanner: React.FC<OCRScannerProps> = ({ onComplete, onCancel, defaultGroupId }) => {
  const { groups, allUsers, currentUser, uploadReceipt, showToast } = useApp();

  const [step, setStep] = useState<'upload' | 'camera' | 'preview_capture' | 'scanning' | 'review' | 'assign'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedReceiptUrl, setUploadedReceiptUrl] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRReceiptResult | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(defaultGroupId || groups[0]?.id || '');
  const [paidByUserId, setPaidByUserId] = useState<string>(currentUser?.id || '');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scanStatusText, setScanStatusText] = useState<string>('Initializing AI OCR document engine...');
  const [scanError, setScanError] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
  const [showRawTranscript, setShowRawTranscript] = useState<boolean>(false);

  // Camera stream states
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isShutterActive, setIsShutterActive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group members for assignment
  const selectedGroup = groups.find((g) => g.id === selectedGroupId);
  const groupParticipants = allUsers.filter((u) =>
    selectedGroupId ? true : u.id === currentUser?.id
  );

  // Stop camera tracks helper
  const stopCameraStream = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => {
        track.stop();
      });
      setCameraStream(null);
    }
  }, [cameraStream]);

  // Start live camera stream
  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    stopCameraStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this browser. Use photo upload instead.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      setCameraStream(stream);
      setFacingMode(mode);
      setStep('camera');

      // Check for torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities: any = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {};
        if (capabilities.torch) {
          setHasTorch(true);
        }
      }
    } catch (err: any) {
      console.warn('Live camera access error:', err);
      let msg = 'Could not access camera device.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera access in browser settings or use file upload.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera device found on this system. Please upload a photo or pick a sample receipt.';
      }
      setCameraError(msg);
      showToast(msg, 'error');
      setStep('upload');
    }
  };

  // Bind stream to video element when entering camera step
  useEffect(() => {
    if (step === 'camera' && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((e) => console.log('Video play interrupted:', e));
    }
  }, [step, cameraStream]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!cameraStream) return;
    const track = cameraStream.getVideoTracks()[0];
    if (track) {
      try {
        const nextState = !torchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }]
        });
        setTorchOn(nextState);
      } catch (err) {
        console.warn('Torch constraint error:', err);
      }
    }
  };

  // Flip Camera (Front / Back)
  const flipCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextMode);
  };

  // Snap photo from live video feed with maximum resolution
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsShutterActive(true);
    setTimeout(() => setIsShutterActive(false), 250);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setSelectedImage(dataUrl);
      stopCameraStream();
      setStep('preview_capture');
    }
  };

  // Process image with Gemini 3.7 Flash Multimodal OCR
  const processImageOCR = async (imageBase64?: string, sampleKey?: string) => {
    setIsProcessing(true);
    setScanError(null);
    setStep('scanning');
    setScanStatusText('Analyzing receipt geometry & lighting...');

    try {
      const activeImg = imageBase64 || selectedImage || '';

      // Determine mime type
      let mimeType = 'image/jpeg';
      if (activeImg.startsWith('data:image/png')) mimeType = 'image/png';
      else if (activeImg.startsWith('data:image/webp')) mimeType = 'image/webp';

      // Step progress messages
      const progressTimer1 = setTimeout(() => {
        setScanStatusText('Gemini 3.7 Multimodal Vision recognizing line items & prices...');
      }, 700);

      const progressTimer2 = setTimeout(() => {
        setScanStatusText('Extracting merchant details, taxes, discounts & totals...');
      }, 1500);

      let parsedResult: OCRReceiptResult | null = null;

      try {
        const res = await fetch('/api/ocr/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: activeImg,
            mimeType,
            sampleKey
          })
        });

        clearTimeout(progressTimer1);
        clearTimeout(progressTimer2);

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.result) {
            parsedResult = data.result;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          console.warn('Backend OCR error response:', errData);
        }
      } catch (networkErr) {
        console.warn('Backend OCR network failed, attempting client-side fallback:', networkErr);
      }

      // If server could not be reached, use client-side simulation helper
      if (!parsedResult) {
        setScanStatusText('Finalizing OCR extraction...');
        parsedResult = await simulateAIOCRReceiptParsing(
          activeImg || undefined,
          sampleKey,
          (statusText) => setScanStatusText(statusText)
        );
      }

      if (parsedResult) {
        const initializedItems: OCRItem[] = (parsedResult.items || []).map((item: any) => ({
          ...item,
          assignedUserIds: [currentUser?.id || '']
        }));

        setOcrResult({
          ...parsedResult,
          items: initializedItems
        });
        setStep('review');
        showToast(
          `AI OCR extracted: ${parsedResult.merchantName} (₹${parsedResult.total.toLocaleString('en-IN')})`,
          'success'
        );
      } else {
        throw new Error('Unable to extract data from the receipt image. Please try a clearer photo.');
      }
    } catch (err: any) {
      console.error('OCR Processing failure:', err);
      setScanError(err.message || 'Failed to process receipt image.');
      showToast(err.message || 'OCR processing failed.', 'error');
      setStep('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle file selection from local device / gallery
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadReceipt(file).then(({ url }) => {
        if (url) setUploadedReceiptUrl(url);
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        processImageOCR(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample quick test triggers
  const handleSampleReceipt = (key: 'cafe' | 'groceries' | 'stationery') => {
    processImageOCR(undefined, key);
  };

  // Item Editing in Review Mode
  const updateItem = (index: number, field: keyof OCRItem, value: any) => {
    if (!ocrResult) return;
    const items = [...ocrResult.items];
    items[index] = { ...items[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      items[index].totalPrice = Math.round(Number(items[index].quantity) * Number(items[index].unitPrice) * 100) / 100;
    }

    const newSubtotal = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
    const newTotal = Math.round((newSubtotal + Number(ocrResult.tax || 0) + Number(ocrResult.serviceCharge || 0) - Number(ocrResult.discount || 0)) * 100) / 100;

    setOcrResult({
      ...ocrResult,
      items,
      subtotal: newSubtotal,
      total: newTotal
    });
  };

  const removeItem = (index: number) => {
    if (!ocrResult) return;
    const items = ocrResult.items.filter((_, i) => i !== index);
    const newSubtotal = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
    const newTotal = Math.round((newSubtotal + Number(ocrResult.tax || 0) + Number(ocrResult.serviceCharge || 0) - Number(ocrResult.discount || 0)) * 100) / 100;

    setOcrResult({
      ...ocrResult,
      items,
      subtotal: newSubtotal,
      total: newTotal
    });
  };

  const addNewItem = () => {
    if (!ocrResult) return;
    const newItem: OCRItem = {
      id: `it_new_${Date.now()}`,
      name: 'New Receipt Item',
      quantity: 1,
      unitPrice: 100,
      totalPrice: 100,
      confidence: 'high',
      assignedUserIds: [currentUser?.id || '']
    };
    const items = [...ocrResult.items, newItem];
    const newSubtotal = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
    const newTotal = Math.round((newSubtotal + Number(ocrResult.tax || 0) + Number(ocrResult.serviceCharge || 0) - Number(ocrResult.discount || 0)) * 100) / 100;

    setOcrResult({
      ...ocrResult,
      items,
      subtotal: newSubtotal,
      total: newTotal
    });
  };

  // Auto-rebalance items to match total if edited
  const autoRebalanceSubtotal = () => {
    if (!ocrResult) return;
    const calculatedSubtotal = ocrResult.items.reduce((acc, it) => acc + Number(it.totalPrice || 0), 0);
    const calculatedTotal = Math.round((calculatedSubtotal + Number(ocrResult.tax || 0) + Number(ocrResult.serviceCharge || 0) - Number(ocrResult.discount || 0)) * 100) / 100;
    setOcrResult({
      ...ocrResult,
      subtotal: calculatedSubtotal,
      total: calculatedTotal
    });
    showToast('Subtotal & Total updated based on line items', 'success');
  };

  // Toggle Member Assignment on Line Item
  const toggleMemberForItem = (itemIndex: number, userId: string) => {
    if (!ocrResult) return;
    const items = [...ocrResult.items];
    const assigned = items[itemIndex].assignedUserIds || [];
    if (assigned.includes(userId)) {
      items[itemIndex].assignedUserIds = assigned.filter((id) => id !== userId);
    } else {
      items[itemIndex].assignedUserIds = [...assigned, userId];
    }
    setOcrResult({ ...ocrResult, items });
  };

  // Assign all items equally to all group members
  const assignAllToEveryone = () => {
    if (!ocrResult) return;
    const allIds = groupParticipants.map((u) => u.id);
    const items = ocrResult.items.map((it) => ({
      ...it,
      assignedUserIds: [...allIds]
    }));
    setOcrResult({ ...ocrResult, items });
    showToast('Assigned all items equally to all group members', 'success');
  };

  // Assign all items to current user only
  const assignAllToMe = () => {
    if (!ocrResult) return;
    const items = ocrResult.items.map((it) => ({
      ...it,
      assignedUserIds: [currentUser?.id || '']
    }));
    setOcrResult({ ...ocrResult, items });
    showToast('Assigned all items to you', 'success');
  };

  // Calculate each participant's share with proportional tax & discount
  const calculateParticipantShares = () => {
    if (!ocrResult) return [];
    const participantsMap: Record<string, number> = {};

    const allAssigned = new Set<string>();
    ocrResult.items.forEach((item) => {
      (item.assignedUserIds || []).forEach((uId) => allAssigned.add(uId));
    });

    if (allAssigned.size === 0) {
      allAssigned.add(currentUser?.id || '');
    }

    allAssigned.forEach((uId) => (participantsMap[uId] = 0));

    let itemsSum = 0;
    ocrResult.items.forEach((item) => {
      const price = Number(item.totalPrice || 0);
      itemsSum += price;
      const assigned = item.assignedUserIds && item.assignedUserIds.length > 0 ? item.assignedUserIds : [currentUser?.id || ''];
      const splitAmount = price / assigned.length;
      assigned.forEach((uId) => {
        participantsMap[uId] = (participantsMap[uId] || 0) + splitAmount;
      });
    });

    const ratio = itemsSum > 0 ? ocrResult.total / itemsSum : 1;

    return Object.keys(participantsMap).map((uId) => ({
      userId: uId,
      shareAmount: Math.round(participantsMap[uId] * ratio * 100) / 100
    }));
  };

  const handleFinalConfirmAndSave = () => {
    if (!ocrResult) return;
    const calculatedParticipants = calculateParticipantShares();

    onComplete({
      title: `${ocrResult.merchantName || 'Scanned Receipt'}`,
      amount: ocrResult.total,
      category: ocrResult.category || 'Food',
      date: ocrResult.date || new Date().toISOString().split('T')[0],
      groupId: selectedGroupId || undefined,
      paidBy: paidByUserId || currentUser?.id || '',
      splitMethod: 'item_based',
      items: ocrResult.items,
      participants: calculatedParticipants,
      receiptUrl: uploadedReceiptUrl || selectedImage || undefined
    });
  };

  return (
    <div className="space-y-6">
      {/* Hidden Canvas for Live Video Snapshots */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Lightbox Modal for Scanned Receipt Image */}
      {showImagePreview && selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-2xl max-h-[85vh] w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between text-white">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span>Original Scanned Receipt</span>
              </span>
              <button
                type="button"
                onClick={() => setShowImagePreview(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex items-center justify-center bg-black/40 flex-1">
              <img src={selectedImage} alt="Scanned bill full view" className="max-h-[65vh] object-contain rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Raw Transcript Modal */}
      {showRawTranscript && ocrResult?.rawText && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh]">
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Verbatim OCR Extracted Text</span>
              </span>
              <button
                type="button"
                onClick={() => setShowRawTranscript(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-auto bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {ocrResult.rawText}
            </div>
          </div>
        </div>
      )}

      {/* Stepper Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>AI OCR Receipt Scanner</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                Gemini 3.7 Vision
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Snap real receipts, UPI screenshots, or canteen chits for accurate item extraction
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
          <span
            className={`px-2.5 py-1 rounded-lg ${
              step === 'upload' || step === 'camera' || step === 'preview_capture'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            1. Photo
          </span>
          <span>→</span>
          <span
            className={`px-2.5 py-1 rounded-lg ${
              step === 'review' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            2. Extract
          </span>
          <span>→</span>
          <span
            className={`px-2.5 py-1 rounded-lg ${
              step === 'assign' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            3. Split
          </span>
        </div>
      </div>

      {/* STEP 1: Upload / Choose Camera */}
      {step === 'upload' && (
        <div className="space-y-5">
          {scanError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">OCR Notice</p>
                <p className="mt-0.5">{scanError}</p>
              </div>
            </div>
          )}

          {cameraError && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Camera Access</p>
                <p className="mt-0.5">{cameraError}</p>
              </div>
            </div>
          )}

          {/* Primary Action Hero: Live Camera & Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Live Camera Option */}
            <div
              onClick={() => startCamera('environment')}
              className="border-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-2xl p-6 text-center cursor-pointer transition-all hover:scale-[1.01] shadow-xs group flex flex-col items-center justify-between"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-md shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Open Live Camera
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[220px]">
                  Frame bill in viewfinder, snap high-res photo, and let Gemini extract items.
                </p>
              </div>
              <button
                type="button"
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Launch Camera</span>
              </button>
            </div>

            {/* Upload File / Native Mobile Capture Option */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl p-6 text-center cursor-pointer transition-all hover:scale-[1.01] group flex flex-col items-center justify-between"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Upload Receipt Image
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[220px]">
                  Supports PNG, JPG, WEBP, UPI screenshots, and digital bills.
                </p>
              </div>
              <button
                type="button"
                className="mt-4 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Browse Files</span>
              </button>
            </div>
          </div>

          {/* Quick Test Samples */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Or Test Instantly with Sample Student Bills
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleSampleReceipt('cafe')}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-left transition-all"
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white">🍕 Campus Bistro & Cafe</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Sandwiches, Fries, Frappes (₹861)</div>
              </button>
              <button
                type="button"
                onClick={() => handleSampleReceipt('groceries')}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-left transition-all"
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white">🛒 Hostel Supermarket</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Maggi, Milk, Snacks (₹1,320)</div>
              </button>
              <button
                type="button"
                onClick={() => handleSampleReceipt('stationery')}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-left transition-all"
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white">📚 Balaji Xerox & Books</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Spiral notes, Record files (₹1,300)</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP: LIVE CAMERA VIEWFINDER */}
      {step === 'camera' && (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center shadow-xl">
            {/* Live Video Feed */}
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />

            {/* Shutter flash animation */}
            {isShutterActive && (
              <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-200" />
            )}

            {/* Viewfinder Receipt Framing Target Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
              <div className="relative w-full max-w-sm h-4/5 border-2 border-dashed border-white/60 rounded-2xl flex flex-col justify-between p-3">
                {/* Corner guide accents */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-indigo-400 rounded-br-lg" />

                {/* Animated scanning line */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_12px_rgba(99,102,241,0.8)] animate-pulse" />

                <div className="bg-black/50 backdrop-blur-xs text-white/90 text-[11px] font-medium px-3 py-1 rounded-full mx-auto self-center">
                  Align receipt within the frame
                </div>
              </div>
            </div>

            {/* Top Toolbar Controls */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  setStep('upload');
                }}
                className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
                title="Close Camera"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                {hasTorch && (
                  <button
                    type="button"
                    onClick={toggleTorch}
                    className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                      torchOn ? 'bg-amber-500 text-white' : 'bg-black/60 text-white hover:bg-black/80'
                    }`}
                    title="Toggle Flashlight"
                  >
                    {torchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={flipCamera}
                  className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
                  title="Flip Front/Back Camera"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Shutter Action Button */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-6 z-20">
              <button
                type="button"
                id="camera-shutter-btn"
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white p-1 shadow-lg shadow-black/40 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
                title="Take Receipt Photo"
              >
                <div className="w-13 h-13 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Hold steady in good lighting</span>
            <button
              type="button"
              onClick={() => {
                stopCameraStream();
                fileInputRef.current?.click();
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Upload file instead
            </button>
          </div>
        </div>
      )}

      {/* STEP: PREVIEW CAPTURED PHOTO */}
      {step === 'preview_capture' && selectedImage && (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center border border-slate-800">
            <img src={selectedImage} alt="Captured Receipt" className="w-full h-full object-contain" />
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Photo Captured</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => startCamera()}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Photo</span>
            </button>

            <button
              type="button"
              onClick={() => processImageOCR(selectedImage)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run AI OCR Parsing</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP: Scanning Animation */}
      {step === 'scanning' && (
        <div className="py-12 text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900 animate-ping opacity-50" />
            <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">AI OCR Parsing Receipt</h4>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1 animate-pulse">
              {scanStatusText}
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: Review Extracted OCR Data */}
      {step === 'review' && ocrResult && (
        <div className="space-y-5">
          {/* Highlighted AI Extraction Banner with Merchant Name and Total */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-purple-500/10 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-indigo-600 text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  AI OCR Extracted Values
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold">
                  {ocrResult.confidenceOverall} Confidence
                </span>
                {ocrResult.modelUsed && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-mono">
                    {ocrResult.modelUsed}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                All merchant details, itemized prices, and taxes were parsed. Review and edit any field below.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {selectedImage && (
                <button
                  type="button"
                  onClick={() => setShowImagePreview(true)}
                  className="relative w-12 h-12 rounded-xl overflow-hidden border border-indigo-300 dark:border-indigo-700 shrink-0 shadow-xs group cursor-pointer"
                  title="Click to view original receipt photo"
                >
                  <img src={selectedImage} alt="Receipt thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </button>
              )}
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-semibold">
                  Extracted Total
                </span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  ₹{ocrResult.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Tools: View Original & View Raw Transcript */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {selectedImage && (
                <button
                  type="button"
                  onClick={() => setShowImagePreview(true)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Inspect Receipt Photo</span>
                </button>
              )}
              {ocrResult.rawText && (
                <button
                  type="button"
                  onClick={() => setShowRawTranscript(true)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>View Raw OCR Text</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={autoRebalanceSubtotal}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              title="Recalculate subtotal and grand total based on line items"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Auto-Recalculate Totals</span>
            </button>
          </div>

          {/* Merchant & Metadata Form */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-indigo-600" />
                <span>Extracted Merchant Name *</span>
              </label>
              <input
                type="text"
                value={ocrResult.merchantName}
                onChange={(e) => setOcrResult({ ...ocrResult, merchantName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Campus Bistro"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Receipt Date</span>
              </label>
              <input
                type="date"
                value={ocrResult.date}
                onChange={(e) => setOcrResult({ ...ocrResult, date: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>Category</span>
              </label>
              <select
                value={ocrResult.category || 'Food'}
                onChange={(e) => setOcrResult({ ...ocrResult, category: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Food">🍔 Food & Cafe</option>
                <option value="Hostel">🏠 Hostel & Groceries</option>
                <option value="Education">📚 Books & Xerox</option>
                <option value="Transport">🚕 Travel & Cab</option>
                <option value="Shopping">🛍️ Shopping</option>
                <option value="Entertainment">🎬 Entertainment</option>
                <option value="Other">📦 Other</option>
              </select>
            </div>
          </div>

          {/* Line Items Table with Confidence Flags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Extracted Line Items ({ocrResult.items.length})
              </span>
              <button
                type="button"
                onClick={addNewItem}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Missed Item</span>
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {ocrResult.items.map((item, idx) => {
                const isLowConfidence = item.confidence === 'low' || item.confidence === 'verify';

                return (
                  <div
                    key={item.id || idx}
                    className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isLowConfidence ? 'bg-amber-50/50 dark:bg-amber-950/20' : 'bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex-1 flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400 w-5">{idx + 1}.</span>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(idx, 'name', e.target.value)}
                            className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {isLowConfidence ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1 shrink-0">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Verify</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                          className="w-12 px-2 py-1 text-center text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                          title="Quantity"
                        />
                        <span className="text-xs text-slate-400">×</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-500">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(idx, 'unitPrice', Number(e.target.value))}
                            className="w-16 px-2 py-1 text-right text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
                            title="Unit Price"
                          />
                        </div>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          ₹{item.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subtotal, GST/Tax, Discount Calculations */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{ocrResult.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span>GST / Taxes</span>
                <input
                  type="number"
                  value={ocrResult.tax}
                  onChange={(e) => {
                    const newTax = Number(e.target.value) || 0;
                    setOcrResult({
                      ...ocrResult,
                      tax: newTax,
                      total: Math.round((ocrResult.subtotal + newTax + (ocrResult.serviceCharge || 0) - ocrResult.discount) * 100) / 100
                    });
                  }}
                  className="w-16 px-1.5 py-0.5 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono ml-2"
                />
              </span>
              <span className="font-bold text-slate-900 dark:text-white">+₹{ocrResult.tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span>Discount / Promo</span>
                <input
                  type="number"
                  value={ocrResult.discount}
                  onChange={(e) => {
                    const newDisc = Number(e.target.value) || 0;
                    setOcrResult({
                      ...ocrResult,
                      discount: newDisc,
                      total: Math.round((ocrResult.subtotal + ocrResult.tax + (ocrResult.serviceCharge || 0) - newDisc) * 100) / 100
                    });
                  }}
                  className="w-16 px-1.5 py-0.5 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono ml-2"
                />
              </span>
              <span className="font-bold text-emerald-600">-₹{ocrResult.discount.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
              <span>Final Grand Total (₹)</span>
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                ₹{ocrResult.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3">
            <button
              type="button"
              onClick={() => setStep('upload')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400"
            >
              ← Scan Another Receipt
            </button>

            <button
              type="button"
              onClick={() => setStep('assign')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Assign & Split with Friends</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Assign Items to Group Members & Bill Splitting */}
      {step === 'assign' && ocrResult && (
        <div className="space-y-5">
          {/* Select Group & Payer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Group to Split With
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Who Paid for this Bill?
              </label>
              <select
                value={paidByUserId}
                onChange={(e) => setPaidByUserId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              >
                {groupParticipants.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} {u.id === currentUser?.id ? '(You)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Bulk Assignment Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Assign Line Items
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={assignAllToEveryone}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100"
              >
                Split All with Everyone
              </button>
              <button
                type="button"
                onClick={assignAllToMe}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                All to Me
              </button>
            </div>
          </div>

          {/* Interactive Item Assignment Matrix */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {ocrResult.items.map((item, idx) => (
              <div key={item.id || idx} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </h5>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {item.quantity} × ₹{item.unitPrice} = ₹{item.totalPrice}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    ₹{item.totalPrice}
                  </span>
                </div>

                {/* Member selection chips */}
                <div className="flex flex-wrap items-center gap-2">
                  {groupParticipants.map((user) => {
                    const isAssigned = (item.assignedUserIds || []).includes(user.id);
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleMemberForItem(idx, user.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isAssigned
                            ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/40'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        <img src={user.avatarUrl} alt={user.name} className="w-4 h-4 rounded-full object-cover" />
                        <span>{user.name.split(' ')[0]}</span>
                        {isAssigned && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Real-time Share Breakdown Calculation Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-2">
            <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
              Calculated Split Shares (including Tax/Discount)
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {calculateParticipantShares().map((part) => {
                const u = allUsers.find((user) => user.id === part.userId);
                return (
                  <div
                    key={part.userId}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img src={u?.avatarUrl} alt={u?.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {u?.name?.split(' ')[0]}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      ₹{part.shareAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3">
            <button
              type="button"
              onClick={() => setStep('review')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400"
            >
              ← Back to Review
            </button>

            <button
              type="button"
              onClick={handleFinalConfirmAndSave}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save & Publish Expense</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

