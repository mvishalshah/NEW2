import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Sparkles,
  Wallet,
  ArrowUpRight,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { financialSummary, expenses, currentUser, groups } = useApp();

  const [activeTab, setActiveTab] = useState<'category' | 'monthly' | 'group'>('category');

  const monthlyHistory = [
    { month: 'Oct 2025', spent: 4800, paid: 5200 },
    { month: 'Nov 2025', spent: 6300, paid: 6100 },
    { month: 'Dec 2025', spent: 7850, paid: 7500 },
    { month: 'Jan 2026', spent: 7100, paid: 7200 },
    { month: 'Feb 2026', spent: financialSummary?.totalSpending || 8450, paid: financialSummary?.youPaid || 5200 }
  ];

  const maxMonthly = Math.max(...monthlyHistory.map((m) => Math.max(m.spent, m.paid)), 10000);

  const categoryColors: Record<string, { bg: string; bar: string; text: string }> = {
    Food: { bg: 'bg-amber-100 dark:bg-amber-950', bar: 'bg-amber-500', text: 'text-amber-600' },
    Transport: { bg: 'bg-indigo-100 dark:bg-indigo-950', bar: 'bg-indigo-500', text: 'text-indigo-600' },
    Education: { bg: 'bg-emerald-100 dark:bg-emerald-950', bar: 'bg-emerald-500', text: 'text-emerald-600' },
    Shopping: { bg: 'bg-purple-100 dark:bg-purple-950', bar: 'bg-purple-500', text: 'text-purple-600' },
    Entertainment: { bg: 'bg-pink-100 dark:bg-pink-950', bar: 'bg-pink-500', text: 'text-pink-600' },
    Hostel: { bg: 'bg-blue-100 dark:bg-blue-950', bar: 'bg-blue-500', text: 'text-blue-600' },
    Other: { bg: 'bg-slate-100 dark:bg-slate-800', bar: 'bg-slate-500', text: 'text-slate-600' }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <span>Student Expense Analytics & Insights</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Visualize spending trends, peer splits, and campus budget metrics
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Average Expense Per Week</span>
            <Wallet className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            ₹{Math.round((financialSummary?.totalSpending || 8450) / 4).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">4.2 transactions/week</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Top Spending Category</span>
            <PieChart className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            Food & Canteen
          </div>
          <p className="text-[11px] text-slate-400 mt-1">42% of total expenditure</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Debt Settlement Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            94.8%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Mutual honesty agreement rate</p>
        </div>
      </div>

      {/* Visual Analytics Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Spending Breakdown</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span className="text-slate-500">Your Share</span>
            </span>
            <span className="flex items-center gap-1 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-300 dark:bg-indigo-700" />
              <span className="text-slate-500">You Paid</span>
            </span>
          </div>
        </div>

        {/* CSS-based responsive bar chart */}
        <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2">
          {monthlyHistory.map((item, idx) => {
            const spentHeight = Math.max(10, Math.round((item.spent / maxMonthly) * 100));
            const paidHeight = Math.max(10, Math.round((item.paid / maxMonthly) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  <div
                    className="w-4 sm:w-7 bg-indigo-600 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-500 relative"
                    style={{ height: `${spentHeight}%` }}
                    title={`Your Share: ₹${item.spent}`}
                  />
                  <div
                    className="w-4 sm:w-7 bg-indigo-300 dark:bg-indigo-700 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-200 relative"
                    style={{ height: `${paidHeight}%` }}
                    title={`You Paid: ₹${item.paid}`}
                  />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 truncate text-center">
                  {item.month.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Category breakdown matrix */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Category Breakdown
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {financialSummary?.categoryBreakdown?.map((cat) => {
              const style = categoryColors[cat.category] || categoryColors.Other;
              return (
                <div
                  key={cat.category}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{cat.category}</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      ₹{cat.amount.toLocaleString('en-IN')} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full ${style.bar} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, Math.max(8, cat.percentage))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Student AI Insights & Savings Recommendations */}
      <div className="p-6 rounded-2xl bg-indigo-950 text-white shadow-md border border-indigo-900 space-y-3">
        <div className="flex items-center gap-2 text-indigo-300">
          <Lightbulb className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Smart Student Budget Tips</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs text-indigo-100">
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="font-bold text-white block mb-0.5">📚 Save on Xerox & Stationery</span>
            Pool course assignments with your batch group to split book depot and bulk printout costs.
          </div>
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="font-bold text-white block mb-0.5">🏠 Bulk Hostel Grocery Runs</span>
            Ordering supermarket groceries as a 4-roommate mess group saves ~18% compared to single daily trips.
          </div>
        </div>
      </div>
    </div>
  );
};
