import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext.js';
import { OCRScanner } from './OCRScanner.js';
import { SplitMethod, ExpenseItem, OCRReceiptResult } from '../types.js';
import {
  X,
  Camera,
  PenTool,
  Receipt,
  Users,
  Check,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  PieChart,
  RefreshCw,
  Zap,
  ZapOff,
  FlipHorizontal,
  RotateCcw,
  CheckCircle2,
  Store,
  IndianRupee,
  AlertCircle,
  FileText,
  Upload
} from 'lucide-react';

export const AddExpenseModal: React.FC = () => {
  const {
    isAddExpenseModalOpen,
    closeAddExpenseModal,
    initialAddExpenseMode,
    groups,
    allUsers,
    currentUser,
    selectedGroupId: contextGroupId,
    addExpense,
    refreshAllData,
    showToast
  } = useApp();

  const [mode, setMode] = useState<'manual' | 'ocr'>(initialAddExpenseMode || 'manual');

  // Manual Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'Food' | 'Transport' | 'Education' | 'Shopping' | 'Entertainment' | 'Hostel' | 'Other'>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState<string>(contextGroupId || groups[0]?.id || '');
  const [paidBy, setPaidBy] = useState<string>(currentUser?.id || '');
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('equal');

  // Camera & Gemini Quick Scan State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isGeminiScanning, setIsGeminiScanning] = useState<boolean>(false);
  const [geminiStatusText, setGeminiStatusText] = useState<string>('Connecting to camera...');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isShutterActive, setIsShutterActive] = useState<boolean>(false);
  const [scannedReceiptPreview, setScannedReceiptPreview] = useState<string | null>(null);
  const [aiExtractedBanner, setAiExtractedBanner] = useState<{
    merchant: string;
    amount: number;
    date: string;
    category?: string;
    model?: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  // Selected participants for manual split
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    allUsers.slice(0, 4).map((u) => u.id)
  );

  // Split details: percentages or exact amounts
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const [exactAmounts, setExactAmounts] = useState<Record<string, number>>({});

  // Custom line items for manual item-based split
  const [manualItems, setManualItems] = useState<ExpenseItem[]>([
    { id: 'item_1', name: 'Item 1', quantity: 1, unitPrice: 0, totalPrice: 0, assignedUserIds: [currentUser?.id || ''] }
  ]);

  // Clean up camera stream
  const stopCameraStream = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  // Start live camera stream
  const startCamera = async (modeToUse: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    stopCameraStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser. Please use photo upload.');
      }

      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: modeToUse },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      setCameraStream(stream);
      setFacingMode(modeToUse);

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities: any = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {};
        if (capabilities.torch) {
          setHasTorch(true);
        }
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      let msg = 'Could not access camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission denied. Please allow camera permissions in your browser or upload a receipt photo.';
      } else if (err.name === 'NotFoundError') {
        msg = 'No camera device found on this system. Please upload a receipt photo.';
      }
      setCameraError(msg);
      showToast(msg, 'error');
      setIsCameraActive(false);
    }
  };

  // Close camera
  const closeCamera = () => {
    stopCameraStream();
    setIsCameraActive(false);
    setCameraError(null);
  };

  // Bind video element
  useEffect(() => {
    if (isCameraActive && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((e) => console.log('Video play interrupted:', e));
    }
  }, [isCameraActive, cameraStream]);

  // Clean up camera on unmount or modal close
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

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
        console.warn('Torch error:', err);
      }
    }
  };

  // Flip Camera Front / Back
  const flipCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextMode);
  };

  // Parse receipt image base64 with Gemini API
  const parseWithGeminiAPI = async (imageBase64: string) => {
    setIsGeminiScanning(true);
    setGeminiStatusText('Gemini 3.7 Flash Vision analyzing receipt...');

    try {
      let mimeType = 'image/jpeg';
      if (imageBase64.startsWith('data:image/png')) mimeType = 'image/png';
      else if (imageBase64.startsWith('data:image/webp')) mimeType = 'image/webp';

      const res = await fetch('/api/ocr/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType
        })
      });

      if (!res.ok) {
        throw new Error('Server failed to parse receipt with Gemini API.');
      }

      const data = await res.json();
      if (!data.success || !data.result) {
        throw new Error(data.error || 'Gemini API was unable to parse receipt details.');
      }

      const parsed: OCRReceiptResult = data.result;

      // Extract Merchant, Total Amount, Date and Category
      const extractedMerchant = parsed.merchantName || 'Scanned Receipt';
      const extractedTotal = Number(parsed.total || 0);
      const extractedDate = parsed.date || new Date().toISOString().split('T')[0];
      const extractedCategory = (parsed.category as any) || 'Food';

      // Auto-fill the form fields
      setTitle(extractedMerchant);
      if (extractedTotal > 0) {
        setAmount(extractedTotal.toString());
      }
      if (extractedDate) {
        setDate(extractedDate);
      }
      if (extractedCategory) {
        setCategory(extractedCategory);
      }

      // If line items exist, update manual items too
      if (parsed.items && parsed.items.length > 0) {
        setManualItems(
          parsed.items.map((it, idx) => ({
            id: `item_${Date.now()}_${idx}`,
            name: it.name,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            totalPrice: it.totalPrice,
            assignedUserIds: [currentUser?.id || '']
          }))
        );
      }

      setScannedReceiptPreview(imageBase64);
      setAiExtractedBanner({
        merchant: extractedMerchant,
        amount: extractedTotal,
        date: extractedDate,
        category: extractedCategory,
        model: parsed.modelUsed || 'Gemini 3.7 Flash'
      });

      showToast(`✨ Gemini parsed: ${extractedMerchant} (₹${extractedTotal.toLocaleString('en-IN')}) on ${extractedDate}!`, 'success');
    } catch (err: any) {
      console.error('Gemini OCR error:', err);
      showToast(err.message || 'Gemini OCR failed to extract receipt details', 'error');
    } finally {
      setIsGeminiScanning(false);
    }
  };

  // Capture photo from live camera & trigger Gemini parsing
  const capturePhotoAndScan = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsShutterActive(true);
    setTimeout(() => setIsShutterActive(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      closeCamera();
      parseWithGeminiAPI(dataUrl);
    }
  };

  // Handle Quick File Upload fallback
  const handleQuickFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        parseWithGeminiAPI(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAddExpenseModalOpen) return null;

  // Toggle user participant
  const toggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      if (selectedUserIds.length <= 1) {
        showToast('At least one participant required', 'error');
        return;
      }
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  // Handle OCR Completion (Full Scanner component)
  const handleOCRComplete = async (data: any) => {
    try {
      const saved = await addExpense({
        ...data,
        source: 'ocr'
      });
      if (saved) {
        await refreshAllData();
        closeAddExpenseModal();
      }
    } catch (err) {
      showToast('Error saving OCR expense', 'error');
    }
  };

  // Handle Manual Save
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!title.trim()) {
      showToast('Please enter an expense title', 'error');
      return;
    }
    if (!numAmount || numAmount <= 0) {
      showToast('Please enter a valid expense amount', 'error');
      return;
    }

    // Build participants array based on splitMethod
    let participantsPayload: any[] = [];

    if (splitMethod === 'equal') {
      const perHead = Math.round((numAmount / selectedUserIds.length) * 100) / 100;
      participantsPayload = selectedUserIds.map((uId) => ({
        userId: uId,
        shareAmount: perHead
      }));
    } else if (splitMethod === 'percentage') {
      let totalPct = 0;
      selectedUserIds.forEach((uId) => (totalPct += percentages[uId] || 0));
      if (Math.abs(totalPct - 100) > 1) {
        showToast(`Percentages must add up to 100% (currently ${totalPct}%)`, 'error');
        return;
      }
      participantsPayload = selectedUserIds.map((uId) => ({
        userId: uId,
        percentage: percentages[uId] || 0,
        shareAmount: Math.round((numAmount * ((percentages[uId] || 0) / 100)) * 100) / 100
      }));
    } else if (splitMethod === 'exact') {
      let totalExact = 0;
      selectedUserIds.forEach((uId) => (totalExact += exactAmounts[uId] || 0));
      if (Math.abs(totalExact - numAmount) > 1) {
        showToast(`Exact amounts sum (₹${totalExact}) must match total amount (₹${numAmount})`, 'error');
        return;
      }
      participantsPayload = selectedUserIds.map((uId) => ({
        userId: uId,
        exactAmount: exactAmounts[uId] || 0,
        shareAmount: exactAmounts[uId] || 0
      }));
    } else if (splitMethod === 'item_based') {
      participantsPayload = selectedUserIds.map((uId) => ({
        userId: uId
      }));
    }

    try {
      const saved = await addExpense({
        title,
        amount: numAmount,
        category,
        date,
        description,
        groupId: groupId || undefined,
        paidBy: paidBy || currentUser?.id,
        source: scannedReceiptPreview ? 'ocr' : 'manual',
        splitMethod,
        items: splitMethod === 'item_based' ? manualItems : undefined,
        participants: participantsPayload,
        receiptUrl: scannedReceiptPreview || undefined
      });

      if (saved) {
        await refreshAllData();
        closeAddExpenseModal();
      }
    } catch (err) {
      showToast('Error saving expense', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      {/* Hidden canvas for capturing video frames */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden quick file input */}
      <input
        type="file"
        ref={quickFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleQuickFileUpload}
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                id="tab-manual-expense-btn"
                onClick={() => setMode('manual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'manual'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>✍️ Add Expense</span>
              </button>

              <button
                type="button"
                id="tab-ocr-expense-btn"
                onClick={() => setMode('ocr')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'ocr'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-indigo-600" />
                <span>Full Item Splitter</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              closeCamera();
              closeAddExpenseModal();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {mode === 'ocr' ? (
            <OCRScanner
              defaultGroupId={groupId}
              onComplete={handleOCRComplete}
              onCancel={closeAddExpenseModal}
            />
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              {/* LIVE CAMERA OVERLAY (When user clicks Scan with Camera) */}
              {isCameraActive && (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center shadow-xl border-2 border-indigo-500 animate-in zoom-in-95 duration-150">
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

                  {/* Viewfinder Framing Guide */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                    <div className="relative w-full max-w-sm h-4/5 border-2 border-dashed border-white/70 rounded-2xl flex flex-col justify-between p-3">
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg" />
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-indigo-400 rounded-br-lg" />

                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_12px_rgba(99,102,241,0.8)] animate-pulse" />

                      <div className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-3 py-1 rounded-full mx-auto self-center flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>Center bill • Gemini will extract merchant, total & date</span>
                      </div>
                    </div>
                  </div>

                  {/* Camera Top Controls */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
                    <button
                      type="button"
                      onClick={closeCamera}
                      className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
                      title="Cancel Camera"
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

                  {/* Camera Bottom Shutter Snap Button */}
                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-6 z-20">
                    <button
                      type="button"
                      id="snap-receipt-camera-btn"
                      onClick={capturePhotoAndScan}
                      className="w-16 h-16 rounded-full bg-white p-1 shadow-lg shadow-black/40 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
                      title="Snap Receipt Photo"
                    >
                      <div className="w-13 h-13 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-white">
                        <Camera className="w-6 h-6" />
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* GEMINI OCR SCANNING PROGRESS LOADER */}
              {isGeminiScanning && (
                <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center space-y-3 animate-in fade-in duration-150">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-md shadow-indigo-600/30">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Gemini API Parsing Receipt</span>
                    </h4>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium mt-1">
                      {geminiStatusText}
                    </p>
                  </div>
                </div>
              )}

              {/* CAMERA SCANNER HERO BANNER / TRIGGER */}
              {!isCameraActive && !isGeminiScanning && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-lg shadow-indigo-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          Scan Receipt with Camera
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-mono font-bold tracking-wide">
                          Gemini 3.7 AI
                        </span>
                      </div>
                      <p className="text-xs text-indigo-100 mt-0.5">
                        Triggers camera to auto-parse Merchant, Total Amount & Date instantly
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      id="trigger-camera-scan-btn"
                      onClick={() => startCamera('environment')}
                      className="px-4 py-2 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-indigo-600" />
                      <span>Launch Camera</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => quickFileInputRef.current?.click()}
                      className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition-colors"
                      title="Upload image from device"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* SUCCESSFUL GEMINI PARSED BANNER */}
              {aiExtractedBanner && !isCameraActive && !isGeminiScanning && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 truncate">
                        <span>Extracted: {aiExtractedBanner.merchant}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-mono">
                          ₹{aiExtractedBanner.amount}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 truncate">
                        Date: {aiExtractedBanner.date} • {aiExtractedBanner.category} • Parsed by {aiExtractedBanner.model}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAiExtractedBanner(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Core Details (Title, Amount, Category) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Expense / Merchant Name *
                    </label>
                    <button
                      type="button"
                      onClick={() => startCamera('environment')}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Scan with Camera</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Campus Bistro, Domino's Pizza, Xerox"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Total Amount (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Group, Category, Date, Paid By */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Group
                  </label>
                  <select
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="">Personal Expense (No Group)</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Food">🍕 Food & Canteen</option>
                    <option value="Transport">🚗 Travel & Transport</option>
                    <option value="Education">📚 Education & Xerox</option>
                    <option value="Shopping">🛍️ Shopping</option>
                    <option value="Entertainment">🎬 Entertainment & Movies</option>
                    <option value="Hostel">🏠 Hostel & Groceries</option>
                    <option value="Other">✨ Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Paid By
                  </label>
                  <select
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} {u.id === currentUser?.id ? '(You)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Split Method Tabs */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Select Split Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'equal', label: 'Equal Split', desc: '₹1,000 / 4 = ₹250 each' },
                    { id: 'percentage', label: 'Percentage %', desc: '40% / 30% / 30%' },
                    { id: 'exact', label: 'Exact Amount', desc: '₹500 / ₹300 / ₹200' },
                    { id: 'item_based', label: 'Item-Based', desc: 'Line item assignment' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSplitMethod(s.id as SplitMethod)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        splitMethod === s.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs">{s.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Participants Selector & Method Customization */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Participants Involved ({selectedUserIds.length})
                  </span>
                  <span className="text-[11px] text-slate-400">Click avatar to include/exclude</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {allUsers.map((u) => {
                    const isSelected = selectedUserIds.includes(u.id);
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => toggleUser(u.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/40'
                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <img src={u.avatarUrl} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                        <span>{u.name.split(' ')[0]}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>

                {/* Percentage Inputs */}
                {splitMethod === 'percentage' && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Set Percentages</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedUserIds.map((uId) => {
                        const u = allUsers.find((user) => user.id === uId);
                        return (
                          <div key={uId} className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate flex-1">{u?.name?.split(' ')[0]}</span>
                            <input
                              type="number"
                              placeholder="%"
                              value={percentages[uId] || ''}
                              onChange={(e) => setPercentages({ ...percentages, [uId]: Number(e.target.value) })}
                              className="w-14 px-2 py-1 text-xs text-right rounded-lg bg-slate-100 dark:bg-slate-800 border font-mono font-bold"
                            />
                            <span className="text-xs text-slate-400">%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Exact Amount Inputs */}
                {splitMethod === 'exact' && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Set Exact Amounts (₹)</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedUserIds.map((uId) => {
                        const u = allUsers.find((user) => user.id === uId);
                        return (
                          <div key={uId} className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate flex-1">{u?.name?.split(' ')[0]}</span>
                            <span className="text-xs text-slate-400">₹</span>
                            <input
                              type="number"
                              placeholder="0"
                              value={exactAmounts[uId] || ''}
                              onChange={(e) => setExactAmounts({ ...exactAmounts, [uId]: Number(e.target.value) })}
                              className="w-20 px-2 py-1 text-xs text-right rounded-lg bg-slate-100 dark:bg-slate-800 border font-mono font-bold"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    closeCamera();
                    closeAddExpenseModal();
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="submit-manual-expense-btn"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Expense</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
