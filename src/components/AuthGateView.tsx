import React from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Users,
  CreditCard,
  Layers,
  GraduationCap
} from 'lucide-react';

interface AuthGateViewProps {
  feature?: string;
}

export const AuthGateView: React.FC<AuthGateViewProps> = ({ feature = 'this feature' }) => {
  const { openAuthModal, setActiveView } = useApp();

  const featureLabels: Record<string, { title: string; description: string; icon: any }> = {
    groups: {
      title: 'Student Groups & Roommate Circles',
      description: 'Create private hostel, flatmate, or club groups to track group balances.',
      icon: Users
    },
    'group-detail': {
      title: 'Group Ledger & Settle Up',
      description: 'Manage itemized group expenses and settle debts directly via UPI.',
      icon: Users
    },
    expenses: {
      title: 'All Expenses & Receipt Ledger',
      description: 'Filter, search, and manage itemized campus expenses with OCR splits.',
      icon: Receipt
    },
    discover: {
      title: 'Discover Campus Groups',
      description: 'Explore and join public student groups, hackathon teams, and college societies.',
      icon: Sparkles
    },
    analytics: {
      title: 'Monthly Student Spending Analytics',
      description: 'Visualize your category spending, daily burn rate, and student budget limits.',
      icon: CreditCard
    },
    profile: {
      title: 'Student Profile & UPI ID',
      description: 'Configure your UPI VPA, QR code, avatar, and college details for instant settlements.',
      icon: GraduationCap
    },
    notifications: {
      title: 'Payment Alerts & Due Reminders',
      description: 'Receive real-time notifications when roommates settle debts or send reminders.',
      icon: ShieldCheck
    }
  };

  const featureInfo = featureLabels[feature] || {
    title: 'Student Expense Tracking Tools',
    description: 'Track campus bills, scan receipts with AI OCR, and settle via UPI.',
    icon: Lock
  };

  const FeatureIcon = featureInfo.icon;

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-16 px-4 pb-24 md:pb-12 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/70 dark:border-indigo-800/70 shadow-xs">
          <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Sign In Required</span>
        </div>

        {/* Feature Icon Header */}
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
          <FeatureIcon className="w-8 h-8" />
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2 max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In to Access {featureInfo.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {featureInfo.description} You are currently viewing SplitMate in <strong className="text-indigo-600 dark:text-indigo-400">Demo Preview Mode</strong>.
          </p>
        </div>

        {/* Feature Checklist Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
              <Receipt className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">AI OCR Receipt Scanner</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Itemize mess, restaurant & grocery bills automatically.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Instant UPI Deep-Links</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Settle with GPay, PhonePe, and Paytm with zero cuts.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Debt Simplification</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Minimizes total transactions between roommates.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Supabase Cloud Sync</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Real-time database sync across all your devices.</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-md mx-auto">
          <button
            id="auth-gate-signin-btn"
            onClick={() => openAuthModal('signin')}
            className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="auth-gate-signup-btn"
            onClick={() => openAuthModal('signup')}
            className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Back to Demo Home */}
        <div className="pt-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Back to Demo Home Screen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
