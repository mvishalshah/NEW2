import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Users,
  Plus,
  Compass,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';

export const GroupsList: React.FC = () => {
  const {
    groups,
    setActiveView,
    joinGroupWithCode,
    createGroup,
    currentUser,
    showToast
  } = useApp();

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  // Create Group Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'College' | 'Hostel' | 'Trip' | 'Project' | 'Mess' | 'Flatmates' | 'Other'>('Hostel');
  const [institution, setInstitution] = useState(currentUser?.institution || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');

  const handleJoinCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      showToast('Please enter a 6-character group code', 'error');
      return;
    }
    const success = await joinGroupWithCode(joinCode.trim().toUpperCase());
    if (success) {
      setIsJoinModalOpen(false);
      setJoinCode('');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Group name is required', 'error');
      return;
    }
    const group = await createGroup({
      name,
      description,
      category,
      institution,
      city,
      privacy,
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800'
    });

    if (group) {
      setIsCreateModalOpen(false);
      setName('');
      setDescription('');
      setActiveView('group-detail', group.id);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>My Student Groups</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Hostels, mess circles, project teams, and campus roommates
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="open-join-code-modal-btn"
            onClick={() => setIsJoinModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
            <span>Join with Code</span>
          </button>

          <button
            id="open-create-group-modal-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Group</span>
          </button>
        </div>
      </div>

      {/* Groups Grid */}
      {groups.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">You haven't joined any groups yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create a hostel or college group or enter your friend's 6-digit group code to start splitting bills.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs"
            >
              Enter Group Code
            </button>
            <button
              onClick={() => setActiveView('discover')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Discover Campus Groups
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((grp) => (
            <div
              key={grp.id}
              onClick={() => setActiveView('group-detail', grp.id)}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {grp.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-500">
                    <span>Code:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      {grp.groupCode}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={grp.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400'}
                    alt={grp.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                      {grp.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {grp.institution || 'College Campus'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {grp.description || 'Active student expense sharing circle.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{grp.memberCount} members</span>
                </div>

                <div>
                  {grp.myBalance > 0 ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      You are owed ₹{grp.myBalance}
                    </span>
                  ) : grp.myBalance < 0 ? (
                    <span className="text-xs font-bold text-red-500">
                      You owe ₹{Math.abs(grp.myBalance)}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Settled ✓</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* JOIN GROUP WITH CODE MODAL */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Join Group via Code</h3>
                <p className="text-xs text-slate-500">Ask your friend or roommate for their 6-character code</p>
              </div>
            </div>

            <form onSubmit={handleJoinCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter 6-Character Code
                </label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  placeholder="e.g. HSTL01, BISTRO"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 text-center text-lg font-mono font-bold uppercase tracking-widest rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-100 dark:shadow-none"
                >
                  Join Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW GROUP MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Student Group</h3>
                <p className="text-xs text-slate-500">A unique join code will be generated automatically</p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hostel 4 Room 204, BCA Project Batch, Goa Trip 2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    <option value="Hostel">🏠 Hostel & Roommates</option>
                    <option value="College">🎓 College & Classmates</option>
                    <option value="Mess">🍲 Mess & Canteen</option>
                    <option value="Project">💻 Project Team</option>
                    <option value="Trip">🏖️ Trip & Outing</option>
                    <option value="Flatmates">🛋️ Flatmates</option>
                    <option value="Other">✨ Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Privacy
                  </label>
                  <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    <option value="public">🌐 Public (Discoverable by College)</option>
                    <option value="private">🔒 Private (Code / Invite Only)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DTU Delhi"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. New Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional brief description of group purpose"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-100 dark:shadow-none"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
