import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Sparkles,
  Camera,
  Users,
  HeartHandshake,
  Receipt,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  TrendingUp,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  DollarSign,
  Coffee,
  ShoppingBag,
  BookOpen,
  Split,
  Layers,
  GraduationCap,
  Play
} from 'lucide-react';

export const LandingHomeView: React.FC = () => {
  const { openAuthModal, loginUser, allUsers, showToast } = useApp();

  // Interactive Live Demo States
  const [activeDemoTab, setActiveDemoTab] = useState<'ocr' | 'split' | 'honesty' | 'groups'>('ocr');
  const [selectedReceiptKey, setSelectedReceiptKey] = useState<'cafe' | 'grocery' | 'xerox'>('cafe');
  const [splitBillAmount, setSplitBillAmount] = useState<number>(1800);
  const [splitRoommatesCount, setSplitRoommatesCount] = useState<number>(4);
  const [splitPaidBy, setSplitPaidBy] = useState<string>('Rahul');
  const [demoHonestyAgreed, setDemoHonestyAgreed] = useState<boolean>(false);

  const sampleReceipts = {
    cafe: {
      merchant: 'Campus Bistro & Cafe',
      category: 'Food',
      date: 'Today, 2:30 PM',
      total: 861,
      subtotal: 820,
      gst: 41,
      items: [
        { name: 'Veg Grilled Club Sandwich (x2)', price: 360, confidence: 'high' },
        { name: 'Crispy Peri Peri Fries (x1)', price: 160, confidence: 'high' },
        { name: 'Cold Hazelnut Frappe (x2)', price: 300, confidence: 'high' }
      ]
    },
    grocery: {
      merchant: 'Hostel 4 Supermart & Snacks',
      category: 'Hostel',
      date: 'Yesterday, 8:15 PM',
      total: 1320,
      subtotal: 1350,
      gst: 0,
      items: [
        { name: 'Maggi Family Pack (12x)', price: 320, confidence: 'high' },
        { name: 'Amul Taaza Milk 1L (x4)', price: 300, confidence: 'high' },
        { name: 'Nescafe Instant Jar 100g', price: 250, confidence: 'high' },
        { name: 'Room Freshener Spray', price: 200, confidence: 'medium' },
        { name: 'Aloo Bhujia 400g (x2)', price: 250, confidence: 'high' }
      ]
    },
    xerox: {
      merchant: 'Balaji Xerox & Books Mart',
      category: 'Education',
      date: '24 Aug 2026',
      total: 1300,
      subtotal: 1300,
      gst: 0,
      items: [
        { name: 'DBMS & OS Spiral Notes (x5)', price: 750, confidence: 'high' },
        { name: 'Engineering Lab Manual Record (x3)', price: 330, confidence: 'high' },
        { name: 'A4 Printing Paper 500 Sheets', price: 220, confidence: 'high' }
      ]
    }
  };

  const currentReceipt = sampleReceipts[selectedReceiptKey];

  // Quick 1-click demo 2-account login helper
  const handleQuickDemoTwoAccounts = () => {
    const rahul = allUsers.find((u) => u.id === 'user_rahul') || allUsers[0];
    const priya = allUsers.find((u) => u.id === 'user_priya') || allUsers[1];
    
    if (rahul) {
      loginUser(rahul);
      if (priya) {
        // also stage Priya as 2nd account
        setTimeout(() => {
          loginUser(priya);
          setTimeout(() => {
            loginUser(rahul);
            showToast('Ready! You have Rahul & Priya active. Click the 2-account tabs above to jump between them!', 'success');
          }, 300);
        }, 300);
      }
    }
  };

  return (
    <div className="space-y-12 pb-20 md:pb-12 animate-in fade-in duration-300">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-12 border border-indigo-800/60 shadow-2xl">
        {/* Subtle background glow effects */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-indigo-200 border border-white/15 shadow-sm">
            <GraduationCap className="w-4 h-4 text-indigo-300" />
            <span>Built for College Campuses, Hostels & Flatmates</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Split Student Expenses & Scan Receipts with{' '}
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              AI OCR
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-sm sm:text-base text-indigo-100/85 max-w-2xl mx-auto leading-relaxed">
            Stop arguing over hostel mess bills, cafe dinners, and xerox runs. Split bills with 
            camera OCR parsing, eliminate circular debts with smart simplification, and settle with 
            mutual honesty agreements during money exchanges.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              id="hero-signin-btn"
              onClick={() => openAuthModal('signin')}
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Sign In to Access All Features</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-signup-btn"
              onClick={() => openAuthModal('signup')}
              className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/20 active:bg-white/10 backdrop-blur-md text-white font-bold text-xs sm:text-sm border border-white/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span>Create Free Account</span>
            </button>

            <button
              id="hero-quick-demo-btn"
              onClick={handleQuickDemoTwoAccounts}
              className="px-5 py-3.5 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              title="Test with Rahul and Priya"
            >
              <Zap className="w-4 h-4" />
              <span>1-Click 2-Account Test</span>
            </button>
          </div>

          {/* Feature Highlights Pills */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-indigo-200">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Live AI OCR Parser</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>2-Account 1-Click Jumping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Mutual Honesty Confirmation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Smart Debt Minimization</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2-ACCOUNT JUMPING SHOWCASE BANNER */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-indigo-200 dark:border-indigo-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Zap className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              New: Dual Account Fast Switcher
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold">
              Max 2 Active Sessions
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            Sharing a device with a roommate? Jump between 2 accounts with 1 click
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            You can keep up to <strong>2 accounts signed in simultaneously</strong>. Switch active profiles instantly 
            by clicking their name in the top navigation bar without logging in and out.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleQuickDemoTwoAccounts}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-transform active:scale-95"
          >
            <span>Activate 2 Demo Accounts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* INTERACTIVE LIVE DEMOS SECTION (NO LOGIN REQUIRED TO EXPLORE) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-1">
              <Play className="w-3.5 h-3.5" />
              <span>Interactive Live Examples</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Test SplitMate in Action Before Signing In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Explore how AI OCR scanning, debt calculations, and mutual honesty settlements work right on this home page.
            </p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shrink-0">
            <button
              onClick={() => setActiveDemoTab('ocr')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeDemoTab === 'ocr'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              📷 AI OCR Scanner
            </button>
            <button
              onClick={() => setActiveDemoTab('split')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeDemoTab === 'split'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ⚖️ Roommate Split
            </button>
            <button
              onClick={() => setActiveDemoTab('honesty')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeDemoTab === 'honesty'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🤝 Money Exchange & Honesty
            </button>
            <button
              onClick={() => setActiveDemoTab('groups')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeDemoTab === 'groups'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              👥 Campus Groups
            </button>
          </div>
        </div>

        {/* DEMO TAB 1: AI OCR RECEIPT SCANNER */}
        {activeDemoTab === 'ocr' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
            {/* Sub-tabs for quick samples */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select a Sample Student Receipt to Parse:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReceiptKey('cafe')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedReceiptKey === 'cafe'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  ☕ Campus Cafe (₹861)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceiptKey('grocery')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedReceiptKey === 'grocery'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  🛒 Hostel Supermart (₹1,320)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceiptKey('xerox')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedReceiptKey === 'xerox'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  📚 Xerox & Notes (₹1,300)
                </button>
              </div>
            </div>

            {/* Simulated OCR Extraction Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Simulated Receipt Paper */}
              <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-3 relative overflow-hidden shadow-inner">
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                  OCR Scanned
                </div>
                <div className="text-center pb-2 border-b border-dashed border-slate-300 dark:border-slate-700">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase">
                    {currentReceipt.merchant}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Date: {currentReceipt.date}</p>
                </div>

                <div className="space-y-1.5 py-1">
                  {currentReceipt.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span className="truncate pr-2">{it.name}</span>
                      <span className="font-bold shrink-0">₹{it.price}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-dashed border-slate-300 dark:border-slate-700 space-y-1">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Subtotal</span>
                    <span>₹{currentReceipt.subtotal}</span>
                  </div>
                  {currentReceipt.gst > 0 && (
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>GST (5%)</span>
                      <span>₹{currentReceipt.gst}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white text-sm pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span>GRAND TOTAL</span>
                    <span className="text-indigo-600 dark:text-indigo-400">₹{currentReceipt.total}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Extraction Intelligence Matrix */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-bold text-xs text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                        Extracted Merchant & Total
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold">
                      99.4% Accuracy
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Merchant Name
                      </span>
                      <span className="text-sm font-black text-slate-900 dark:text-white truncate block">
                        {currentReceipt.merchant}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Total Amount
                      </span>
                      <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                        ₹{currentReceipt.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sign-in Gate Action Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Sign In to Save & Split Scanned Receipts</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Access your camera, upload custom photos, and assign itemized dishes to roommates.
                    </p>
                  </div>
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 shrink-0 flex items-center gap-1.5"
                  >
                    <span>Sign In Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEMO TAB 2: ROOMMATE SPLIT CALCULATOR */}
        {activeDemoTab === 'split' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Controls */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Split className="w-4 h-4 text-indigo-600" />
                  <span>Interactive Split Simulator</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Expense Amount: ₹{splitBillAmount}
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="5000"
                    step="100"
                    value={splitBillAmount}
                    onChange={(e) => setSplitBillAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹200 (Mess Snacks)</span>
                    <span>₹2,500 (Weekend Outing)</span>
                    <span>₹5,000 (Flat Groceries)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Number of Roommates: {splitRoommatesCount} People
                  </label>
                  <div className="flex gap-2">
                    {[2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => setSplitRoommatesCount(num)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          splitRoommatesCount === num
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Who Paid for the Bill?
                  </label>
                  <select
                    value={splitPaidBy}
                    onChange={(e) => setSplitPaidBy(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Rahul">Rahul Sharma (You)</option>
                    <option value="Priya">Priya Patel</option>
                    <option value="Aman">Aman Verma</option>
                    <option value="Sneha">Sneha Rao</option>
                  </select>
                </div>
              </div>

              {/* Real-time calculated shares */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/80 space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900 pb-3">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Calculated Equal Split Shares
                  </span>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                    ₹{(splitBillAmount / splitRoommatesCount).toFixed(0)} / person
                  </span>
                </div>

                <div className="space-y-2">
                  {Array.from({ length: splitRoommatesCount }).map((_, i) => {
                    const names = ['Rahul', 'Priya', 'Aman', 'Sneha', 'Rohan', 'Ananya'];
                    const person = names[i % names.length];
                    const isPayer = person === splitPaidBy;
                    const share = Math.round(splitBillAmount / splitRoommatesCount);

                    return (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-[10px]">
                            {person[0]}
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white">{person}</span>
                          {isPayer && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                              Paid Full
                            </span>
                          )}
                        </div>

                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {isPayer ? (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              +₹{splitBillAmount - share} (Gets Back)
                            </span>
                          ) : (
                            <span className="text-rose-600 dark:text-rose-400">
                              -₹{share} (Owes {splitPaidBy})
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => openAuthModal('signin')}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In to Track Real Roommate Balances</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DEMO TAB 3: MUTUAL HONESTY MONEY EXCHANGE DEMO */}
        {activeDemoTab === 'honesty' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
            <div className="max-w-xl mx-auto text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Mutual Honesty Agreement & Money Exchange
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  No automated third-party payment gateways needed. When money is exchanged (cash, handover, or direct), both members click "Agree" to verify and confirm honesty.
                </p>
              </div>

              {/* Interactive Honesty Verification Card */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 max-w-md mx-auto space-y-4 shadow-sm text-left">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <span className="text-xs font-bold uppercase text-slate-500">Live Exchange Demo</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    demoHonestyAgreed
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {demoHonestyAgreed ? '● Mutual Honesty Verified' : '○ Awaiting Roommate Agreement'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Payer (Rahul Sharma):</span>
                    <span className="font-bold text-emerald-600">✓ Agreed & Handed Cash (₹450)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Receiver (Priya Patel):</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {demoHonestyAgreed ? (
                        <span className="text-emerald-600">✓ Agreed & Confirmed Receipt</span>
                      ) : (
                        <span className="text-amber-600 font-semibold">Waiting for Agreement...</span>
                      )}
                    </span>
                  </div>
                </div>

                {!demoHonestyAgreed ? (
                  <button
                    onClick={() => {
                      setDemoHonestyAgreed(true);
                      showToast('Honesty Agreement Confirmed! Debt marked as settled 🎉', 'success');
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Click Agree to Confirm Honesty (as Priya)</span>
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Settlement 100% Complete & Verified!</span>
                    </span>
                    <button
                      onClick={() => setDemoHonestyAgreed(false)}
                      className="mt-2 text-[11px] text-slate-500 underline hover:text-slate-700 block mx-auto"
                    >
                      Reset Demo
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => openAuthModal('signin')}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 inline-flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In to Track Real Roommate Honesty Agreements</span>
              </button>
            </div>
          </div>
        )}

        {/* DEMO TAB 4: CAMPUS GROUPS SHOWCASE */}
        {activeDemoTab === 'groups' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pre-Configured Campus Group Templates
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Join or create specialized circles for flatmates, hackathon teams, and road trips.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🏠</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                    Hostel & Flat
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Flat 302 Roommates</h4>
                  <p className="text-xs text-slate-500 mt-1">4 Members • Rent, Wifi & Daily Groceries</p>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Pooled:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹14,250</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🏖️</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                    Road Trip
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Goa Roadtrip 2026</h4>
                  <p className="text-xs text-slate-500 mt-1">6 Members • Petrol, Villa Stay & Cafes</p>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Pooled:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹32,800</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🤖</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200">
                    Project & Club
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Robotics Lab Team</h4>
                  <p className="text-xs text-slate-500 mt-1">3 Members • Sensors, 3D Prints & Arduino</p>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Pooled:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹6,400</span>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => openAuthModal('signin')}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 inline-flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In to Create & Join Groups</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* CORE FEATURES GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Camera className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            AI Receipt OCR Scanner
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Snap photos with your live camera or upload canteen bills. Gemini OCR automatically identifies 
            the merchant, line items, and taxes with high-precision confidence flags.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Max 2-Account Fast Jumping
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Connect up to 2 active student accounts on a single browser session. Jump between roommates 
            in one click to verify splits and confirm settlements instantly.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Honesty Agreement & Money Exchange
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Trust-based exchanges where both payer and receiver explicitly click "Agree to Confirm Honesty". 
            Send friendly reminders when cash settlements are pending.
          </p>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="p-8 sm:p-12 rounded-3xl bg-indigo-600 dark:bg-indigo-950 text-white text-center space-y-6 shadow-xl border border-indigo-500/30">
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to Take the Stress Out of College Expenses?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90">
            Join students across campuses tracking flatmate rent, midnight snacks, and semester trips with SplitMate.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => openAuthModal('signin')}
            className="px-6 py-3 rounded-xl bg-white text-indigo-950 font-bold text-xs sm:text-sm shadow-md hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95"
          >
            Sign In to Your Account
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="px-6 py-3 rounded-xl bg-indigo-700/80 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all hover:scale-105 active:scale-95"
          >
            Create Free Student Account
          </button>
        </div>
      </section>
    </div>
  );
};
