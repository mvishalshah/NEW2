import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Sparkles,
  GraduationCap,
  CreditCard,
  Building,
  Check
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const {
    isOnboardingOpen,
    closeOnboarding,
    currentUser,
    updateProfile,
    showToast
  } = useApp();

  const [institution, setInstitution] = useState(currentUser?.institution || 'DTU Delhi');
  const [course, setCourse] = useState(currentUser?.course || 'B.Tech CS');
  const [upiId, setUpiId] = useState(currentUser?.upiId || `${currentUser?.username || 'student'}@okaxis`);
  const [city, setCity] = useState(currentUser?.city || 'New Delhi');

  if (!isOnboardingOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim()) {
      showToast('Please enter your UPI ID for payments', 'error');
      return;
    }

    await updateProfile({
      institution,
      course,
      upiId,
      city
    });

    closeOnboarding();
    showToast('Setup complete! Welcome to SplitMate 🎓', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-100 dark:shadow-none">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Welcome to SplitMate! 🎓
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Set up your student profile and UPI ID to receive automatic bill splits from peers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Your UPI ID (For incoming student payments) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. rahul@okaxis, 9876543210@paytm"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              College / University
            </label>
            <input
              type="text"
              placeholder="e.g. DTU Delhi / IIT Bombay"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Course / Major
              </label>
              <input
                type="text"
                placeholder="e.g. B.Tech CS"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hostel / City
              </label>
              <input
                type="text"
                placeholder="e.g. Hostel 4, Delhi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Get Started</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
