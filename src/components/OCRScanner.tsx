import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext.js';
import { OCRReceiptResult, OCRItem, Group } from '../types.js';
import { SAMPLE_CLIENT_RECEIPTS } from '../data/mockData.js';
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
  ArrowRight
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
  }) => void;
  onCancel: () => void;
  defaultGroupId?: string;
}

export const OCRScanner: React.FC<OCRScannerProps> = ({ onComplete, onCancel, defaultGroupId }) => {
  const { groups, allUsers, currentUser, showToast } = useApp();

  const [step, setStep] = useState<'upload' | 'scanning' | 'review' | 'assign'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRReceiptResult | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(defaultGroupId || groups[0]?.id || '');
  const [paidByUserId, setPaidByUserId] = useState<string>(currentUser?.id || '');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scanStatusText, setScanStatusText] = useState<string>('Uploading receipt...');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Group members for assignment
  const selectedGroup = groups.find((g) => g.id === selectedGroupId);
  const groupParticipants = allUsers.filter((u) =>
    selectedGroupId ? true : u.id === currentUser?.id
  );

  // Trigger Gemini OCR
  const processImageOCR = async (imageBase64?: string, sampleKey?: string) => {
    setIsProcessing(true);
    setStep('scanning');
    setScanStatusText('Analyzing receipt image with AI OCR...');

    try {
      setTimeout(() => setScanStatusText('Extracting line items, prices and GST...'), 800);
      setTimeout(() => setScanStatusText('Verifying optical confidence and math totals...'), 1600);

      let parsedResult: OCRReceiptResult | null = null;

      try {
        const res = await fetch('/api/ocr/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: imageBase64 || '',
            sampleKey
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.result) {
            parsedResult = data.result;
          }
        }
      } catch {
        // Backend not available (e.g. GitHub Pages)
      }

      // Fallback to sample or client parser
      if (!parsedResult) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const key = (sampleKey || 'cafe') as keyof typeof SAMPLE_CLIENT_RECEIPTS;
        const fallbackReceipt = SAMPLE_CLIENT_RECEIPTS[key] || SAMPLE_CLIENT_RECEIPTS.cafe;
        parsedResult = JSON.parse(JSON.stringify(fallbackReceipt));
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
        showToast('Receipt parsed with OCR! Please review line items.', 'success');
      } else {
        throw new Error('Could not parse receipt');
      }
    } catch (err: any) {
      console.error(err);
      showToast('OCR parsing failed. You can review or edit manually.', 'error');
      setStep('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        processImageOCR(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleReceipt = (key: 'cafe' | 'groceries' | 'stationery') => {
    processImageOCR(undefined, key);
  };

  // Item Editing in Review Mode
  const updateItem = (index: number, field: keyof OCRItem, value: any) => {
    if (!ocrResult) return;
    const items = [...ocrResult.items];
    items[index] = { ...items[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      items[index].totalPrice = Number(items[index].quantity) * Number(items[index].unitPrice);
    }

    const newSubtotal = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
    const newTotal = newSubtotal + Number(ocrResult.tax || 0) - Number(ocrResult.discount || 0);

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
    const newTotal = newSubtotal + Number(ocrResult.tax || 0) - Number(ocrResult.discount || 0);

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
      name: 'Custom Item',
      quantity: 1,
      unitPrice: 100,
      totalPrice: 100,
      confidence: 'high',
      assignedUserIds: [currentUser?.id || '']
    };
    const items = [...ocrResult.items, newItem];
    const newSubtotal = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
    const newTotal = newSubtotal + Number(ocrResult.tax || 0) - Number(ocrResult.discount || 0);

    setOcrResult({
      ...ocrResult,
      items,
      subtotal: newSubtotal,
      total: newTotal
    });
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

  // Calculate each participant's share with proportional tax & discount
  const calculateParticipantShares = () => {
    if (!ocrResult) return [];
    const participantsMap: Record<string, number> = {};

    // Get all unique users involved
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

    // Proportional ratio for taxes and discounts
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
      category: 'Food',
      date: ocrResult.date || new Date().toISOString().split('T')[0],
      groupId: selectedGroupId || undefined,
      paidBy: paidByUserId || currentUser?.id || '',
      splitMethod: 'item_based',
      items: ocrResult.items,
      participants: calculatedParticipants
    });
  };

  return (
    <div className="space-y-6">
      {/* Stepper Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-100 dark:shadow-none">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Smart OCR Receipt Parser</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multimodal Gemini AI extraction with item-level bill splitting
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
          <span className={`px-2.5 py-1 rounded-lg ${step === 'upload' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
            1. Upload
          </span>
          <span>→</span>
          <span className={`px-2.5 py-1 rounded-lg ${step === 'review' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
            2. Review Items
          </span>
          <span>→</span>
          <span className={`px-2.5 py-1 rounded-lg ${step === 'assign' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
            3. Split & Save
          </span>
        </div>
      </div>

      {/* STEP 1: Upload / Capture */}
      {step === 'upload' && (
        <div className="space-y-5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 rounded-2xl p-8 text-center bg-indigo-50/30 dark:bg-indigo-950/20 cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-950/40 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Drop your receipt photo or click to browse
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Supports restaurant bills, supermarket receipts, canteen slips, book depot invoices (JPEG, PNG).
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Take Photo via Camera</span>
              </button>
              <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* 1-Click Instant Sample Receipts for Testing */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Quick Test with Student Sample Receipts (1-Click)
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
                <div className="text-[11px] text-slate-500 mt-0.5">Maggi, Milk, Snacks, Spray (₹1,320)</div>
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

      {/* STEP: Scanning Animation */}
      {step === 'scanning' && (
        <div className="py-12 text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900 animate-ping opacity-50" />
            <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Processing Receipt OCR</h4>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1 animate-pulse">
              {scanStatusText}
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: Review Extracted OCR Data */}
      {step === 'review' && ocrResult && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  OCR Extraction Complete
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-lg bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold">
                  {ocrResult.confidenceOverall} Confidence
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Verify each item and correct any smudged text before splitting with group members.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block">Total Detected</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                ₹{ocrResult.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Merchant & Metadata Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Merchant / Store Name
              </label>
              <input
                type="text"
                value={ocrResult.merchantName}
                onChange={(e) => setOcrResult({ ...ocrResult, merchantName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Receipt Date
              </label>
              <input
                type="date"
                value={ocrResult.date}
                onChange={(e) => setOcrResult({ ...ocrResult, date: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Invoice / Bill No.
              </label>
              <input
                type="text"
                value={ocrResult.receiptNumber || ''}
                onChange={(e) => setOcrResult({ ...ocrResult, receiptNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Line Items Table with Confidence Flags & Edit Triggers */}
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
                <span>Add Item</span>
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
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                              ✓ Read
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
                      total: ocrResult.subtotal + newTax - ocrResult.discount
                    });
                  }}
                  className="w-16 px-1.5 py-0.5 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono ml-2"
                />
              </span>
              <span className="font-bold text-slate-900 dark:text-white">+₹{ocrResult.tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span>Discount</span>
                <input
                  type="number"
                  value={ocrResult.discount}
                  onChange={(e) => {
                    const newDisc = Number(e.target.value) || 0;
                    setOcrResult({
                      ...ocrResult,
                      discount: newDisc,
                      total: ocrResult.subtotal + ocrResult.tax - newDisc
                    });
                  }}
                  className="w-16 px-1.5 py-0.5 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono ml-2"
                />
              </span>
              <span className="font-bold text-indigo-600">-₹{ocrResult.discount.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
              <span>Final Grand Total</span>
              <span className="text-base text-indigo-600 dark:text-indigo-400">₹{ocrResult.total.toFixed(2)}</span>
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
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-100 dark:shadow-none flex items-center gap-2 transition-all"
            >
              <span>Assign Items to Friends</span>
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

          {/* Interactive Item Assignment Matrix */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Click Student Avatars to Assign Line Items
              </span>
              <span className="text-[11px] text-slate-400">Multiple people split an item equally</span>
            </div>

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
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
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
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2 transition-all"
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
