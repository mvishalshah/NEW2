import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Compass,
  Search,
  Users,
  MapPin,
  Building,
  KeyRound,
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';

export const DiscoverGroups: React.FC = () => {
  const {
    publicGroups,
    joinGroupWithCode,
    setActiveView,
    currentUser
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [joinCodeInput, setJoinCodeInput] = useState('');

  const categories = ['all', 'College', 'Hostel', 'Trip', 'Project', 'Mess', 'Flatmates'];

  const filteredGroups = publicGroups.filter((g) => {
    const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      g.name.toLowerCase().includes(q) ||
      (g.description && g.description.toLowerCase().includes(q)) ||
      (g.institution && g.institution.toLowerCase().includes(q)) ||
      (g.city && g.city.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCodeInput.trim()) {
      await joinGroupWithCode(joinCodeInput.trim().toUpperCase());
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-indigo-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-800">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200">
            <Compass className="w-3.5 h-3.5" />
            <span>Campus Discovery & Social Circles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Discover Campus & Hostel Circles
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            Find open student groups from your university, batch, flatmates, or join private groups instantly with their unique 6-character code.
          </p>
        </div>
      </div>

      {/* Quick Join With Code Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleJoinByCode} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Have a private group code?</h3>
              <p className="text-xs text-slate-500">Enter the 6-character code shared by your friends</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. HSTL01"
              maxLength={10}
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              className="w-36 sm:w-44 px-3.5 py-2 text-center text-xs font-mono font-bold tracking-wider uppercase rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 dark:shadow-none transition-all"
            >
              Join Group
            </button>
          </div>
        </form>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by college, campus, city, or group name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Public Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-500">No public groups found matching your search</p>
          </div>
        ) : (
          filteredGroups.map((grp) => (
            <div
              key={grp.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {grp.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Code: <span className="font-bold text-slate-700 dark:text-slate-300">{grp.groupCode}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={grp.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400'}
                    alt={grp.name}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                      {grp.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-indigo-500" />
                        <span className="truncate">{grp.institution || 'College'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {grp.description || 'Public student group.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{grp.memberCount} members</span>
                </div>

                <button
                  onClick={() => joinGroupWithCode(grp.groupCode)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 transition-colors"
                >
                  <span>Join Group</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
