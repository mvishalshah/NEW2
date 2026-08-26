import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  Camera,
  Plus,
  Users,
  Send,
  HeartHandshake,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Calendar,
  UserCheck,
  CreditCard
} from 'lucide-react';

export const PersonalDashboard: React.FC = () => {
  const {
    currentUser,
    financialSummary,
    groups,
    myDebts,
    expenses,
    settlements,
    openAddExpenseModal,
    openMoneyExchange,
    agreeToHonesty,
    openReminderModal,
    openAuthModal,
    setActiveView
  } = useApp();

  const [timeframeTab, setTimeframeTab] = useState<'today' | 'week' | 'month'>('month');

  // Filter pending debts (if guest, use sample user 'u1' for interactive demo preview)
  const effectiveUserId = currentUser?.id || 'u1';
  const safeDebts = Array.isArray(myDebts) ? myDebts : [];
  const debtsIOwe = safeDebts.filter((d) => d && d.fromUserId === effectiveUserId);
  const debtsOwedToMe = safeDebts.filter((d) => d && d.toUserId === effectiveUserId);
  const safeSettlements = Array.isArray(settlements) ? settlements : [];
  const pendingAgreements = safeSettlements.filter(
    (s) =>
      s &&
      s.status !== 'completed' &&
      s.status !== 'rejected' &&
      ((s.toUserId === effectiveUserId && !s.receiverAgreed) ||
        (s.fromUserId === effectiveUserId && !s.payerAgreed))
  );

  const categoryColors: Record<string, { bg: string; text: string; bar: string }> = {
    Food: { bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300', bar: 'bg-amber-500' },
    Transport: { bg: 'bg-indigo-100 dark:bg-indigo-950/60', text: 'text-indigo-700 dark:text-indigo-300', bar: 'bg-indigo-500' },
    Education: { bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300', bar: 'bg-emerald-500' },
    Shopping: { bg: 'bg-purple-100 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-300', bar: 'bg-purple-500' },
    Entertainment: { bg: 'bg-pink-100 dark:bg-pink-950/60', text: 'text-pink-700 dark:text-pink-300', bar: 'bg-pink-500' },
    Hostel: { bg: 'bg-blue-100 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300', bar: 'bg-blue-500' },
    Other: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', bar: 'bg-slate-500' }
  };

  const timeframeSpending =
    timeframeTab === 'today'
      ? financialSummary?.todaySpending || 0
      : timeframeTab === 'week'
      ? financialSummary?.weekSpending || 0
      : financialSummary?.monthSpending || 0;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Demo Notice Banner for First-Time Viewers */}
      {!currentUser && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-amber-500/30">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Interactive Demo Mode
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[10px] font-extrabold">
                  No Account Connected
                </span>
              </div>
              <p className="text-xs text-amber-900/80 dark:text-amber-200/80 mt-0.5">
                You are viewing sample shared bill data. Sign in or create an account to manage your personal expenses & groups.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openAuthModal('signin')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/30"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-indigo-600 dark:bg-indigo-950 p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/10 border border-indigo-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/15 backdrop-blur-md text-xs font-semibold text-indigo-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentUser ? (currentUser.institution || 'Shared Expenses') : 'SmartSplitMate Demo'}</span>
              <span>•</span>
              <span>{currentUser ? (currentUser.course || 'Everyone') : 'AI OCR & Bill Splitting'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {currentUser ? `Hey, ${currentUser.name?.split(' ')[0]} 👋` : 'SmartSplitMate for Everyone ✨'}
            </h1>
            <p className="text-sm text-indigo-100/90 max-w-xl">
              {currentUser
                ? 'Track bills, scan receipts with AI OCR, and settle via money exchange with mutual honesty agreement.'
                : 'Track shared bills, scan receipts with Gemini OCR, and settle through honesty-verified money exchanges.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dashboard-scan-receipt-btn"
              onClick={() => openAddExpenseModal('ocr')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs sm:text-sm shadow-md hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4 text-indigo-600" />
              <span>Scan Receipt (OCR)</span>
            </button>
            <button
              id="dashboard-manual-expense-btn"
              onClick={() => openAddExpenseModal('manual')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-700/60 hover:bg-indigo-700/80 backdrop-blur-md border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Manual Expense</span>
            </button>
          </div>
        </div>

        {/* Geometric accent */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 border border-white/10 rounded-3xl rotate-12 pointer-events-none" />
      </div>

      {/* 4 Financial Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Spending */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Spending</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              ₹{(financialSummary?.totalSpending || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Your net share of expenses</p>
          </div>
        </div>

        {/* You Paid */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">You Paid</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              ₹{(financialSummary?.youPaid || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Out of pocket total</p>
          </div>
        </div>

        {/* You Owe */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-500">You Owe</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-red-500 tracking-tight">
              ₹{(financialSummary?.youOwe || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              {debtsIOwe.length > 0 ? `${debtsIOwe.length} pending settlement` : 'All clear! 🎉'}
            </p>
          </div>
        </div>

        {/* You Are Owed */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">You Are Owed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
              ₹{(financialSummary?.youAreOwed || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              {debtsOwedToMe.length > 0 ? `From ${debtsOwedToMe.length} peers` : 'No incoming dues'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Settlements + Spending Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Settlements & Recent Expenses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Settlements / Action Cards */}
          {(debtsIOwe.length > 0 || debtsOwedToMe.length > 0) && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Money Exchanges & Honesty Status</h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {debtsIOwe.length + debtsOwedToMe.length} pending
                </span>
              </div>

              {/* Pending Honesty Action Card if there is an active agreement waiting for this user */}
              {pendingAgreements.length > 0 && (
                <div className="mb-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Action Required: Roommate Honesty Agreement</span>
                  </div>
                  {pendingAgreements.map((s) => {
                    const otherUser = s.fromUserId === effectiveUserId ? s.toUser : s.fromUser;
                    return (
                      <div
                        key={s.id}
                        className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                      >
                          <div className="text-xs">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {otherUser?.name || 'Roommate'}
                            </span>{' '}
                            exchanged <strong>₹{s.amount}</strong> ({s.paymentMethod?.replace('_', ' ') || 'cash'}).
                            <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                              Click Agree to verify receipt and complete the settlement.
                            </div>
                          </div>
                          <button
                            onClick={() => agreeToHonesty(s.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0"
                          >
                            <HeartHandshake className="w-3.5 h-3.5" />
                            <span>Agree & Confirm Honesty</span>
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}

              <div className="space-y-3">
                {/* Money I Owe to Others */}
                {debtsIOwe.map((debt, idx) => (
                  <div
                    key={`owe_${idx}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={debt.toUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={debt.toUser?.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-rose-300 dark:ring-rose-800"
                      />
                      <div>
                        <div className="text-xs text-rose-700 dark:text-rose-300 font-medium">You owe</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{debt.toUser?.name}</div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          @{debt.toUser?.username || 'member'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-rose-100 dark:border-rose-900/30">
                      <div className="text-right">
                        <span className="text-base font-black text-rose-600 dark:text-rose-400 font-mono">
                          ₹{debt.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {debt.toUser && (
                        <button
                          id={`exchange-money-btn-${debt.toUserId}`}
                          onClick={() =>
                            openMoneyExchange({
                              recipientUser: debt.toUser!,
                              amount: debt.amount,
                              note: 'Cash / direct handover money exchange'
                            })
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                        >
                          <HeartHandshake className="w-3.5 h-3.5" />
                          <span>Exchange & Agree</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Money Others Owe to Me */}
                {debtsOwedToMe.map((debt, idx) => (
                  <div
                    key={`owed_${idx}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={debt.fromUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={debt.fromUser?.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-300 dark:ring-emerald-800"
                      />
                      <div>
                        <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Owes you</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{debt.fromUser?.name}</div>
                        <span className="text-[11px] text-slate-500 font-mono">@{debt.fromUser?.username}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-100 dark:border-emerald-900/30">
                      <div className="text-right">
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                          ₹{debt.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {debt.fromUser && (
                        <button
                          id={`send-reminder-btn-${debt.fromUserId}`}
                          onClick={() =>
                            openReminderModal({
                              receiverUser: debt.fromUser!,
                              amount: debt.amount
                            })
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm shadow-amber-500/30 flex items-center gap-1.5 transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Honesty Reminder</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeframe Spending Tabs (Today / This Week / This Month) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>Spending Overview</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Keep track of daily and monthly student budget
                </p>
              </div>

              {/* Timeframe toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(['today', 'week', 'month'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTimeframeTab(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                      timeframeTab === tab
                        ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {tab === 'today' ? "Today's" : tab === 'week' ? "This Week's" : "This Month's"}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {timeframeTab === 'today' ? "Today's Expenses" : timeframeTab === 'week' ? 'Past 7 Days' : 'February 2026 Total'}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                  ₹{timeframeSpending.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>On Budget</span>
                </span>
              </div>
            </div>

            {/* Category breakdown visual progress */}
            <div className="mt-5 space-y-3">
              <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Category Distribution</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {financialSummary?.categoryBreakdown?.map((cat) => {
                  const style = categoryColors[cat.category] || categoryColors.Other;
                  return (
                    <div
                      key={cat.category}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{cat.category}</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          ₹{cat.amount.toLocaleString('en-IN')} ({cat.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full ${style.bar} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(100, Math.max(5, cat.percentage))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Expenses List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-600" />
                <span>Recent Expenses</span>
              </h3>
              <button
                onClick={() => setActiveView('expenses')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {(() => {
              const safeList = Array.isArray(expenses) ? expenses : [];
              const userFiltered = safeList.filter((exp) => {
                if (!exp) return false;
                if (!currentUser) return true;
                const isPayer = exp.paidBy === currentUser.id;
                const isCreator = exp.createdBy === currentUser.id;
                const isParticipant = exp.participants?.some((p) => p.userId === currentUser.id);
                const isInMyGroup = exp.groupId && groups.some((g) => g.id === exp.groupId);
                return isPayer || isCreator || isParticipant || isInMyGroup;
              });

              const sortedRecent = [...userFiltered].sort((a, b) => {
                const timeA = new Date(a.date || a.createdAt || 0).getTime();
                const timeB = new Date(b.date || b.createdAt || 0).getTime();
                return timeB - timeA;
              });

              if (sortedRecent.length === 0) {
                return (
                  <div className="py-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-3">
                      <Receipt className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No recent expenses yet</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                      Add a personal expense or scan a receipt with AI OCR to start tracking real-time spending.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <button
                        onClick={() => openAddExpenseModal('ocr')}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Scan Receipt</span>
                      </button>
                      <button
                        onClick={() => openAddExpenseModal('manual')}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Expense</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {sortedRecent.slice(0, 5).map((exp) => {
                    const userParticipant = exp.participants?.find((p) => p.userId === currentUser?.id);
                    const isPayer = exp.paidBy === currentUser?.id;
                    const catStyle = categoryColors[exp.category] || categoryColors.Other;

                    return (
                      <div key={exp.id} className="py-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl ${catStyle.bg} ${catStyle.text} flex items-center justify-center font-bold text-xs shrink-0`}>
                            {exp.category?.[0] || '₹'}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                              {exp.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              <span>{exp.groupName || (exp.groupId ? 'Group' : 'Personal')}</span>
                              <span>•</span>
                              <span>{new Date(exp.date || exp.createdAt || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                              <span>•</span>
                              <span className="capitalize">{(exp.splitMethod || 'equal').replace('_', ' ')} split</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                            ₹{Number(exp.amount || 0).toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] font-medium mt-0.5">
                            {isPayer ? (
                              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">You paid full</span>
                            ) : userParticipant ? (
                              <span className="text-red-500 font-semibold">
                                Your share: ₹{userParticipant.shareAmount}
                              </span>
                            ) : (
                              <span className="text-slate-400">Not involved</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right 1 Col: My Active Groups & Quick Tools */}
        <div className="space-y-6">
          {/* Active Groups Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>My Active Groups</span>
              </h3>
              <button
                onClick={() => setActiveView('groups')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
              >
                <span>All ({groups.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {groups.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No groups yet. Join a college or hostel group!
                </div>
              ) : (
                groups.slice(0, 4).map((grp) => (
                  <div
                    key={grp.id}
                    onClick={() => setActiveView('group-detail', grp.id)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={grp.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400'}
                        alt={grp.name}
                        className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{grp.name}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {grp.memberCount} members • Code: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{grp.groupCode}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {grp.myBalance > 0 ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                          +₹{grp.myBalance}
                        </span>
                      ) : grp.myBalance < 0 ? (
                        <span className="text-xs font-bold text-red-500 block">
                          -₹{Math.abs(grp.myBalance)}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 block">Settled</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => setActiveView('discover')}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
              >
                + Join / Create Group
              </button>
            </div>
          </div>

          {/* Budget Tips & Insights */}
          <div className="bg-indigo-950 rounded-2xl p-5 text-white shadow-md border border-indigo-900 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-indigo-300">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wider uppercase">Smart Insights</span>
            </div>
            <p className="text-xs text-indigo-100 leading-relaxed">
              💡 <span className="font-semibold text-white">Domino's Pizza & Canteen</span> was your top expense this week. Settle group dues via money exchange and confirm honesty to keep balances accurate!
            </p>
            <div className="mt-4 pt-3 border-t border-indigo-900/80 flex items-center justify-between text-[11px] text-indigo-300">
              <span>Mutual Honesty Agreement</span>
              <span className="font-mono">100% Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
