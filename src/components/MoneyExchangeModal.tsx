import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  X,
  CheckCircle2,
  HandCoins,
  ShieldCheck,
  Clock,
  Send,
  Sparkles,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  HeartHandshake
} from 'lucide-react';

export const MoneyExchangeModal: React.FC = () => {
  const {
    isMoneyExchangeOpen,
    closeMoneyExchange,
    activeSettlementData,
    currentUser,
    recordSettlement,
    agreeToHonesty,
    settlements,
    signedInAccounts,
    jumpToAccount,
    showToast
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'direct' | 'bank_transfer' | 'money_exchange'>('cash');
  const [honestyChecked, setHonestyChecked] = useState(true);
  const [exchangeNote, setExchangeNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isMoneyExchangeOpen || !activeSettlementData) return null;

  const { recipientUser, amount, groupId, existingSettlementId } = activeSettlementData;
  const payerUser = currentUser || { id: 'user_rahul', name: 'You', username: 'student', avatarUrl: '' };

  // Check if there is an existing pending settlement between these two users
  const activeExistingSettlement = existingSettlementId
    ? settlements.find((s) => s.id === existingSettlementId)
    : settlements.find(
        (s) =>
          ((s.fromUserId === payerUser.id && s.toUserId === recipientUser.id) ||
            (s.toUserId === payerUser.id && s.fromUserId === recipientUser.id)) &&
          s.status !== 'completed' &&
          s.status !== 'rejected'
      );

  const isCurrentPayer = activeExistingSettlement
    ? activeExistingSettlement.fromUserId === payerUser.id
    : true;

  const isCurrentReceiver = activeExistingSettlement
    ? activeExistingSettlement.toUserId === payerUser.id
    : false;

  const payerHasAgreed = activeExistingSettlement ? activeExistingSettlement.payerAgreed : false;
  const receiverHasAgreed = activeExistingSettlement ? activeExistingSettlement.receiverAgreed : false;

  const canAgreeNow = activeExistingSettlement
    ? (isCurrentPayer && !payerHasAgreed) || (isCurrentReceiver && !receiverHasAgreed)
    : true;

  const handleConfirmExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!honestyChecked) {
      showToast('Please check the honesty pledge to proceed with money exchange.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (activeExistingSettlement) {
        // Agree to existing settlement
        await agreeToHonesty(activeExistingSettlement.id);
        closeMoneyExchange();
      } else {
        // Record brand new money exchange with honesty pledge
        await recordSettlement({
          groupId,
          fromUserId: payerUser.id,
          toUserId: recipientUser.id,
          amount,
          paymentMethod,
          payerAgreed: true,
          receiverAgreed: false,
          honestyDeclaration: `I (${payerUser.name}) confirm I have handed over ₹${amount} in cash/direct exchange to ${recipientUser.name}.`,
          note: exchangeNote.trim() || `Money exchange: Handed over ₹${amount}`
        });
        closeMoneyExchange();
      }
    } catch (err) {
      showToast('Error recording money exchange', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAgree = async () => {
    if (!activeExistingSettlement) return;
    setIsSubmitting(true);
    try {
      await agreeToHonesty(activeExistingSettlement.id);
      closeMoneyExchange();
    } catch (err) {
      showToast('Error confirming honesty', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if second account matches recipient for easy test jumping
  const otherAccount = signedInAccounts.find((acc) => acc.id === recipientUser.id);

  return (
    <div
      id="money-exchange-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 dark:from-emerald-950/30 dark:to-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Money Exchange & Honesty Agreement
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Peer-to-peer verification • Both members agree to settle
              </p>
            </div>
          </div>

          <button
            onClick={closeMoneyExchange}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleConfirmExchange} className="p-6 space-y-5">
          {/* Members in Exchange Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Exchange Parties
            </div>
            <div className="flex items-center justify-between">
              {/* Payer */}
              <div className="flex items-center gap-3">
                <img
                  src={payerUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={payerUser.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500"
                />
                <div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                    Giving Cash / Payer
                  </span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {payerUser.name}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">@{payerUser.username}</span>
                </div>
              </div>

              <div className="flex flex-col items-center px-2">
                <ArrowRight className="w-5 h-5 text-emerald-500" />
                <span className="text-[10px] text-slate-400 font-bold">₹{amount}</span>
              </div>

              {/* Receiver */}
              <div className="flex items-center gap-3 text-right">
                <div>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase">
                    Receiving / Payee
                  </span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {recipientUser.name}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">@{recipientUser.username}</span>
                </div>
                <img
                  src={recipientUser.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                  alt={recipientUser.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Amount Badge */}
          <div className="text-center py-2 px-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              Amount to be Exchanged & Confirmed
            </span>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
              ₹{amount.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Exchange Method */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Exchange Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cash', label: '💵 Cash Handover', desc: 'In-person physical' },
                { id: 'direct', label: '🤝 Direct Exchange', desc: 'Hostel / Canteen' },
                { id: 'bank_transfer', label: '🏦 Bank / IMPS', desc: 'Direct account' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    paymentMethod === m.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 font-bold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs">{m.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dual-Member Agreement Honesty Status */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Mutual Honesty Confirmation System</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              To eliminate financial disputes, <strong>both students must click Agree</strong> to confirm honesty.
              Once both confirm, the debt is automatically marked settled in all group sheets.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  payerHasAgreed || honestyChecked
                    ? 'bg-emerald-100/70 dark:bg-emerald-900/30 border-emerald-400 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-500'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
                  {payerHasAgreed || honestyChecked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="text-[11px] leading-tight">
                  <div className="font-bold">{payerUser.name.split(' ')[0]} (Payer)</div>
                  <div className="text-[10px] opacity-80">
                    {payerHasAgreed || honestyChecked ? 'Agreed & Pledged ✅' : 'Needs Agreement ⏳'}
                  </div>
                </div>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  receiverHasAgreed
                    ? 'bg-emerald-100/70 dark:bg-emerald-900/30 border-emerald-400 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-100/70 dark:bg-amber-900/30 border-amber-400 text-amber-800 dark:text-amber-300'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
                  {receiverHasAgreed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                  )}
                </div>
                <div className="text-[11px] leading-tight">
                  <div className="font-bold">{recipientUser.name.split(' ')[0]} (Payee)</div>
                  <div className="text-[10px] opacity-80">
                    {receiverHasAgreed ? 'Agreed & Verified ✅' : 'Awaiting Agreement ⏳'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Honesty Oath Checkbox */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              id="honesty-pledge-checkbox"
              checked={honestyChecked}
              onChange={(e) => setHonestyChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600"
            />
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-bold text-slate-900 dark:text-white">Honesty Pledge:</span> I confirm on my
              honor that ₹{amount} has been accurately exchanged with {recipientUser.name} in good faith without
              discrepancies.
            </div>
          </label>

          {/* Optional Note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Exchange Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Handed over cash near canteen during lunch"
              value={exchangeNote}
              onChange={(e) => setExchangeNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Quick Account Switch Helper if testing with dual accounts */}
          {otherAccount && (
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
                <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>{otherAccount.name}</strong> is signed in as Slot 2!
                </span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  closeMoneyExchange();
                  await jumpToAccount(otherAccount.id);
                  showToast(`Jumped to ${otherAccount.name} to confirm honesty from payee side!`, 'info');
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-colors"
              >
                Jump to Agree
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={closeMoneyExchange}
              className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !honestyChecked}
              id="confirm-money-exchange-btn"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Recording Exchange...'
                  : activeExistingSettlement
                  ? 'Agree & Confirm Honesty'
                  : 'Record Exchange & Request Honesty'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
