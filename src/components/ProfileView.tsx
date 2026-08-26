import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  GraduationCap,
  Building,
  Calendar,
  MapPin,
  Home,
  Phone,
  CreditCard,
  Mail,
  User as UserIcon,
  FileText,
  Edit2,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Database,
  Camera,
  LogOut,
  Plus
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    openAuthModal,
    logout,
    uploadAvatar,
    isSupabaseConnected,
    showToast
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [institution, setInstitution] = useState(currentUser?.institution || '');
  const [course, setCourse] = useState(currentUser?.course || '');
  const [yearOfStudy, setYearOfStudy] = useState(currentUser?.yearOfStudy || currentUser?.year || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [upiId, setUpiId] = useState(currentUser?.upiId || '');
  const [bio, setBio] = useState(currentUser?.bio || '');

  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setUsername(currentUser.username || '');
      setInstitution(currentUser.institution || '');
      setCourse(currentUser.course || '');
      setYearOfStudy(currentUser.yearOfStudy || currentUser.year || '');
      setAddress(currentUser.address || '');
      setCity(currentUser.city || '');
      setPhone(currentUser.phone || '');
      setUpiId(currentUser.upiId || '');
      setBio(currentUser.bio || '');
    }
  }, [currentUser]);

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
      name: name.trim(),
      username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      institution: institution.trim(),
      course: course.trim(),
      year: yearOfStudy.trim(),
      yearOfStudy: yearOfStudy.trim(),
      address: address.trim(),
      city: city.trim(),
      phone: phone.trim(),
      upiId: upiId.trim(),
      bio: bio.trim()
    });
    if (ok) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    if (currentUser) {
      setName(currentUser.name || '');
      setUsername(currentUser.username || '');
      setInstitution(currentUser.institution || '');
      setCourse(currentUser.course || '');
      setYearOfStudy(currentUser.yearOfStudy || currentUser.year || '');
      setAddress(currentUser.address || '');
      setCity(currentUser.city || '');
      setPhone(currentUser.phone || '');
      setUpiId(currentUser.upiId || '');
      setBio(currentUser.bio || '');
    }
    setIsEditing(false);
  };

  const isProfileIncomplete = !currentUser?.institution || !(currentUser?.yearOfStudy || currentUser?.year) || !currentUser?.address;

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
            Your verified student identity, university details, hostel address, and bill-split settings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="edit-profile-btn"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isEditing
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
          <button
            id="profile-logout-btn"
            onClick={logout}
            className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Incomplete Profile Prompt Banner (if details missing) */}
      {isProfileIncomplete && !isEditing && (
        <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-teal-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Complete your student details
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Add your current university, study year, and hostel address to easily discover and join campus groups.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Fill Details</span>
          </button>
        </div>
      )}

      {/* Supabase Status Banner */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-200 dark:shadow-none">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Supabase Backend & Profile Sync
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
              Secure authentication, profile storage synchronization, and receipts/avatar storage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => openAuthModal('signin')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm shrink-0 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Switch / Sign In</span>
          </button>
        </div>
      </div>

      {/* Student ID Card Layout */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                alt={currentUser?.name || 'Student Avatar'}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-indigo-500/40 shadow-xl bg-slate-800"
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-white text-[10px] font-bold cursor-pointer"
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
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Student Account</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {currentUser?.name || <span className="text-slate-400 italic">Student</span>}
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                @{currentUser?.username || 'username'}
              </p>
              <p className="text-xs text-slate-400">
                {currentUser?.email || ''}
              </p>
            </div>
          </div>

          {/* Honesty Status Pill */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-left sm:text-right space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
              Honesty Status
            </span>
            <span className="text-sm sm:text-base font-bold text-white flex items-center sm:justify-end gap-1.5">
              <span>🤝 100% Mutual Honesty</span>
            </span>
            <span className="text-[10px] text-slate-300">Requires dual confirmation on settlements</span>
          </div>
        </div>

        {/* Student Meta Details Grid - Strict No-Dummy Policy */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-5 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] flex items-center gap-1">
              <Building className="w-3 h-3 text-indigo-400" />
              <span>University / College</span>
            </span>
            <span className="font-bold text-white mt-1 block truncate">
              {currentUser?.institution ? (
                currentUser.institution
              ) : (
                <span className="text-slate-500 font-normal italic">Not specified</span>
              )}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-indigo-400" />
              <span>Year of Study</span>
            </span>
            <span className="font-bold text-white mt-1 block">
              {(currentUser?.yearOfStudy || currentUser?.year) ? (
                currentUser.yearOfStudy || currentUser.year
              ) : (
                <span className="text-slate-500 font-normal italic">Not specified</span>
              )}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-indigo-400" />
              <span>Degree / Major</span>
            </span>
            <span className="font-bold text-white mt-1 block truncate">
              {currentUser?.course ? (
                currentUser.course
              ) : (
                <span className="text-slate-500 font-normal italic">Not specified</span>
              )}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-400" />
              <span>City / Campus Area</span>
            </span>
            <span className="font-bold text-white mt-1 block truncate">
              {currentUser?.city ? (
                currentUser.city
              ) : (
                <span className="text-slate-500 font-normal italic">Not specified</span>
              )}
            </span>
          </div>

          {/* Extended Details: Address, Phone, UPI ID, Bio */}
          <div className="col-span-2">
            <span className="text-slate-400 block text-[11px] flex items-center gap-1">
              <Home className="w-3 h-3 text-indigo-400" />
              <span>Address / Hostel & Room No.</span>
            </span>
            <span className="font-medium text-slate-200 mt-1 block truncate">
              {currentUser?.address ? (
                currentUser.address
              ) : (
                <span className="text-slate-500 font-normal italic">Not provided</span>
              )}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-indigo-400" />
              <span>UPI ID (For Settlements)</span>
            </span>
            <span className="font-mono text-emerald-400 mt-1 block truncate">
              {currentUser?.upiId ? (
                currentUser.upiId
              ) : (
                <span className="text-slate-500 font-normal italic">Not linked</span>
              )}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] flex items-center gap-1">
              <Phone className="w-3 h-3 text-indigo-400" />
              <span>Phone Number</span>
            </span>
            <span className="font-medium text-slate-200 mt-1 block truncate">
              {currentUser?.phone ? (
                currentUser.phone
              ) : (
                <span className="text-slate-500 font-normal italic">Not linked</span>
              )}
            </span>
          </div>
        </div>

        {/* Bio Section */}
        {currentUser?.bio && (
          <div className="mt-4 pt-4 border-t border-white/10 text-xs">
            <span className="text-slate-400 block text-[11px]">About / Bio:</span>
            <p className="text-slate-200 mt-0.5 leading-relaxed">{currentUser.bio}</p>
          </div>
        )}
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form
          id="profile-edit-form"
          onSubmit={handleSaveProfile}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-indigo-600" />
                <span>Edit Student Profile & Details</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your university name, study year, hostel address, contact number and UPI handle
              </p>
            </div>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Username (@handle)
              </label>
              <input
                type="text"
                placeholder="e.g. rahul_tech"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* University / College (Currently study in which university) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Currently Study in Which University / College
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Delhi Technological University / IIT Bombay / Stanford"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Which Year */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Which Year of Study
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. 1st Year, 2nd Year, 3rd Year, 4th Year, Final Year, Masters, PhD"
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  list="year-suggestions"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <datalist id="year-suggestions">
                  <option value="1st Year" />
                  <option value="2nd Year" />
                  <option value="3rd Year" />
                  <option value="4th Year" />
                  <option value="5th Year" />
                  <option value="Final Year" />
                  <option value="Postgraduate / Masters" />
                  <option value="PhD Scholar" />
                </datalist>
              </div>
            </div>

            {/* Degree / Program / Major */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Course / Major / Degree
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. B.Tech Computer Science / B.Com / MBA"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* City / State */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                City / State
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. New Delhi, Bengaluru, Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Address / Hostel Details */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Address / Hostel, Block & Room Details
              </label>
              <div className="relative">
                <Home className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <textarea
                  rows={2}
                  placeholder="e.g. Hostel Block B, Room 204, North Campus, Delhi"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* UPI ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                UPI ID for QR & Direct Debt Settlement
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. rahul@okaxis / 9876543210@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Bio / About Me
              </label>
              <textarea
                rows={2}
                placeholder="Share a short bio or student note with your roommates and peers..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Student Profile</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
