import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  X,
  CreditCard,
  QrCode,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Smartphone
} from 'lucide-react';

export const UPIPaymentModal: React.FC = () => {
  const {
    isUPIModalOpen,
    closeUPIPayment,
    activeSettlementData,
    currentUser,
    recordSettlement,
    showToast
  } = useApp();

  const [paymentMode, setPaymentMode] = useState<'qr' | 'intent' | 'manual'>('qr');
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [txnNote, setTxnNote] = useState(activeSettlementData?.note || 'SplitMate bill settlement');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessBlast, setShowSuccessBlast] = useState(false);

  if (!isUPIModalOpen || !activeSettlementData) return null;

  const { recipientUser, amount, groupId } = activeSettlementData;
  const recipientUPI = recipientUser.upiId || `${recipientUser.username}@okaxis`;

  // Standard UPI URI format: upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...
  const encodedName = encodeURIComponent(recipientUser.name);
  const encodedNote = encodeURIComponent(txnNote);
  const upiIntentUri = `upi://pay?pa=${recipientUPI}&pn=${encodedName}&am=${amount}&cu=INR&tn=${encodedNote}`;

  // Direct QR code API using quickchart or standard qr api
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiIntentUri)}&margin=10`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(recipientUPI);
    setCopiedUPI(true);
    showToast(`UPI ID ${recipientUPI} copied! 📋`, 'info');
    setTimeout(() => setCopiedUPI(false), 2000);
  };

  const handleConfirmPaid = async () => {
    setIsSubmitting(true);
    try {
      const success = await recordSettlement({
        groupId,
        fromUserId: currentUser?.id,
        toUserId: recipientUser.id,
        amount,
        paymentMethod: 'upi',
        status: 'initiated', // Initiated until recipient marks confirmed
        note: txnNote
      });

      if (success) {
        setShowSuccessBlast(true);
        setTimeout(() => {
          setShowSuccessBlast(false);
          closeUPIPayment();
        }, 2200);
      }
    } catch (err) {
      showToast('Failed to record payment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative">
        {/* Confetti / Success Overlay */}
        {showSuccessBlast && (
          <div className="absolute inset-0 z-20 bg-indigo-600 text-white flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-white text-indigo-600 flex items-center justify-center mb-3 shadow-lg animate-bounce">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold">Payment Initiated! 🎉</h3>
            <p className="text-xs text-indigo-100 mt-1 max-w-xs">
              ₹{amount} recorded for {recipientUser.name}. A notification has been sent to confirm receipt.
            </p>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-100 dark:shadow-none">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pay via UPI</h3>
              <p className="text-[11px] text-slate-500">GPay, PhonePe, Paytm, BHIM</p>
            </div>
          </div>

          <button
            onClick={closeUPIPayment}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Recipient & Amount Card */}
          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={recipientUser.avatarUrl}
                alt={recipientUser.name}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-400"
              />
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Paying to</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{recipientUser.name}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] font-mono text-indigo-700 dark:text-indigo-400 font-semibold">
                    {recipientUPI}
                  </span>
                  <button
                    onClick={handleCopyUPI}
                    className="p-0.5 text-slate-400 hover:text-slate-600"
                    title="Copy UPI ID"
                  >
                    {copiedUPI ? <Check className="w-3 h-3 text-indigo-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Amount</span>
              <span className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
                ₹{amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* QR Code Scan View */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="inline-block p-3 rounded-xl bg-white shadow-sm border border-slate-200">
              <img
                src={qrCodeUrl}
                alt="UPI QR Code"
                className="w-44 h-44 sm:w-48 sm:h-48 mx-auto"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Scan with any UPI App (Google Pay / PhonePe / Paytm / BHIM)
            </p>

            {/* Mobile App Deep-Link Intent Trigger */}
            <div className="pt-1">
              <a
                href={upiIntentUri}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md hover:opacity-90 transition-opacity"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open UPI App on this Device</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Verification & Action Trigger */}
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300">
              💡 <span className="font-semibold">Two-Tier Settlement:</span> Clicking "I Have Paid" records this payment as initiated. {recipientUser.name} will be notified to confirm receipt.
            </div>

            <button
              onClick={handleConfirmPaid}
              disabled={isSubmitting}
              id="confirm-upi-paid-btn"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording Settlement...' : `I Have Paid ₹${amount}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
