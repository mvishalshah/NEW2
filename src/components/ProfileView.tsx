import React, { useState, useRef } from 'react';
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
  ShieldCheck,
  Database,
  Cloud,
  Lock,
  Camera,
  Upload,
  LogOut
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    allUsers,
    switchUser,
    updateProfile,
    googleLogin,
    openAuthModal,
    logout,
    uploadAvatar,
    isSupabaseConnected,
    showToast
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [institution, setInstitution] = useState(currentUser?.institution || '');
  const [course, setCourse] = useState(currentUser?.course || '');
  const [yearOfStudy, setYearOfStudy] = useState(currentUser?.yearOfStudy || '');
  const [city, setCity] = useState(currentUser?.city || '');

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    showToast('Uploading profile avatar...', 'info');

    try {
      const { url, error } = await uploadAvatar(file);
      if (url) {
        await updateProfile({ avatarUrl: url });
        showToast('Avatar updated to Supabase Storage! 📸', 'success');
      } else if (error) {
        // Fallback to local base64 for instant preview
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          await updateProfile({ avatarUrl: base64 });
          showToast('Avatar updated locally (Supabase storage not connected yet)', 'info');
        };
        reader.readAsDataURL(file);
      }
    } catch {
      showToast('Failed to upload avatar', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateProfile({
      name,
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <span>Student Profile & Identity</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Your student identity card, campus information, and honesty verification settings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
          <button
            onClick={logout}
            className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Supabase Status Banner */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-200 dark:shadow-none">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Supabase Backend Integration
              </h3>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                isSupabaseConnected
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
              }`}>
                {isSupabaseConnected ? '● Connected & Active' : '○ Ready for Credentials'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Supports Google OAuth authentication, PostgreSQL database synchronization, and receipts/avatars storage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => openAuthModal('signin')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm shrink-0 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Sign In / Sign Up</span>
          </button>

          <button
            onClick={() => showToast('Direct Google Login is Coming Soon! Please sign in with email and password.', 'info')}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-2 shadow-sm shrink-0 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Coming Soon
            </span>
          </button>
        </div>
      </div>

      {/* Student ID Card Layout */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                alt={currentUser?.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-indigo-500/40 shadow-xl"
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-white text-[10px] font-bold cursor-pointer"
                title="Change Avatar (Uploads to Supabase Storage)"
              >
                <Camera className="w-5 h-5" />
                <span>Upload</span>
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

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

          {/* Honesty Status Pill */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-left sm:text-right space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
              Honesty Status
            </span>
            <span className="text-sm sm:text-base font-bold text-white flex items-center sm:justify-end gap-1.5">
              <span>🤝 100% Mutual Honesty</span>
            </span>
            <span className="text-[10px] text-slate-300">Requires dual confirmation on settlements</span>
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
                City / Hostel
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
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
