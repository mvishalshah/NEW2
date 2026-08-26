import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  X,
  Send,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HeartHandshake,
  ShieldCheck
} from 'lucide-react';

export const PaymentReminderModal: React.FC = () => {
  const {
    isReminderModalOpen,
    closeReminderModal,
    activeReminderData,
    sendPaymentReminder,
    openMoneyExchange,
    showToast
  } = useApp();

  const [reminderMode, setReminderMode] = useState<'now' | 'tomorrow' | '3days'>('now');
  const [note, setNote] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isReminderModalOpen || !activeReminderData) return null;

  const { receiverUser, amount, groupId, settlementId } = activeReminderData;

  const handleSendReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const customMessage =
        note.trim() ||
        `Hey ${receiverUser.name?.split(' ')[0]}, friendly reminder to complete our ₹${amount} money exchange and honesty confirmation on SplitMate! 😊`;

      const result = await sendPaymentReminder({
        receiverId: receiverUser.id,
        amount,
        settlementId,
        groupId,
        note: customMessage
      });

      if (result.success) {
        closeReminderModal();
      }
    } catch (err) {
      showToast('Error sending reminder', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenExchangeDirectly = () => {
    closeReminderModal();
    openMoneyExchange({
      recipientUser: receiverUser,
      amount,
      groupId,
      existingSettlementId: settlementId
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-emerald-500/10 dark:from-amber-950/30 dark:to-emerald-950/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Payment Reminder & Honesty Request</h3>
              <p className="text-[11px] text-slate-500">Mutual agreement verification for money exchanges</p>
            </div>
          </div>

          <button
            onClick={closeReminderModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSendReminder} className="p-5 sm:p-6 space-y-4">
          {/* Target Student Info */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={receiverUser.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                alt={receiverUser.name}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-amber-400"
              />
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Recipient Member</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{receiverUser.name}</h4>
                <p className="text-[11px] text-slate-500 font-mono">@{receiverUser.username}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Pending Balance</span>
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                ₹{amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Honesty Mutual Verification Note */}
          <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
              When you send this reminder, {receiverUser.name.split(' ')[0]} will get a direct notification with an <strong>"Agree to Confirm Honesty"</strong> button to quickly verify the money exchange.
            </div>
          </div>

          {/* Reminder Schedule Mode */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Reminder Schedule
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'now', label: 'Ping Now', sub: 'Instant In-App' },
                { id: 'tomorrow', label: 'Tomorrow', sub: 'At 10:00 AM' },
                { id: '3days', label: 'In 3 Days', sub: 'Weekend ping' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setReminderMode(m.id as any)}
                  className={`p-2.5 rounded-xl text-center border transition-all ${
                    reminderMode === m.id
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20 font-bold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs">{m.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{m.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Note Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Custom Friendly Note (Optional)
            </label>
            <textarea
              rows={2}
              placeholder={`e.g. "Hey ${receiverUser.name?.split(' ')[0]}, let's settle the mess bill and click Agree on honesty confirmation!"`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="submit"
              disabled={isSending}
              id="send-payment-reminder-btn"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/30 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Sending Reminder...' : 'Send Honesty Reminder'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenExchangeDirectly}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              <span>Open Direct Money Exchange Modal Instead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
