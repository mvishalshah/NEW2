import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  User,
  Building,
  GraduationCap,
  CreditCard,
  Mail,
  MapPin,
  Edit2,
  Check,
  Sparkles,
  Users,
  ShieldCheck
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    allUsers,
    switchUser,
    updateProfile,
    googleLogin,
    showToast
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [upiId, setUpiId] = useState(currentUser?.upiId || '');
  const [institution, setInstitution] = useState(currentUser?.institution || '');
  const [course, setCourse] = useState(currentUser?.course || '');
  const [yearOfStudy, setYearOfStudy] = useState(currentUser?.yearOfStudy || '');
  const [city, setCity] = useState(currentUser?.city || '');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateProfile({
      name,
      upiId,
      institution,
      course,
      yearOfStudy,
      city
    });
    if (ok) {
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <span>Student Profile & UPI ID</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Your student identity card, campus information, and settlement configurations
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Student ID Card Layout */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
              alt={currentUser?.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-indigo-500/40 shadow-xl"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Student Member</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">{currentUser?.name}</h2>
              <p className="text-xs text-slate-300 font-mono">@{currentUser?.username}</p>
              <p className="text-xs text-slate-400">{currentUser?.email}</p>
            </div>
          </div>

          {/* Quick UPI Pill */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-left sm:text-right space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 block">
              Default UPI VPA
            </span>
            <span className="text-sm sm:text-base font-mono font-bold text-white block">
              {currentUser?.upiId || 'No UPI ID Added'}
            </span>
            <span className="text-[10px] text-slate-300">Ready for instant peer settlement</span>
          </div>
        </div>

        {/* Student Meta Details Grid */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">College / Campus</span>
            <span className="font-bold text-white mt-0.5 block truncate">
              {currentUser?.institution || 'DTU Delhi'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Degree / Major</span>
            <span className="font-bold text-white mt-0.5 block truncate">
              {currentUser?.course || 'B.Tech Computer Science'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Year of Study</span>
            <span className="font-bold text-white mt-0.5 block">
              {currentUser?.yearOfStudy || '3rd Year'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">City / Hostel</span>
            <span className="font-bold text-white mt-0.5 block">
              {currentUser?.city || 'New Delhi'}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Edit Student Profile Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                UPI ID (e.g. yourname@okaxis, 9876543210@paytm)
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Institution / University
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Course / Program
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Year of Study
              </label>
              <input
                type="text"
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                City / Hostel
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 dark:shadow-none flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Switch Demo Student Accounts */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Switch Student Account (Multi-Party Testing)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Seamlessly toggle between peers to verify real-time settlements, group debts, and bill splits
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allUsers.map((u) => {
            const isCurrent = u.id === currentUser?.id;
            return (
              <div
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={u.avatarUrl} alt={u.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{u.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{u.course}</p>
                    <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 block truncate">
                      {u.upiId}
                    </span>
                  </div>
                </div>

                {isCurrent && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
