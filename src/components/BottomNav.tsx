import React from 'react';
import { useApp } from '../context/AppContext.js';
import { Layers, Users, Plus, Compass, User as UserIcon } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, openAddExpenseModal } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2">
      <div className="flex items-center justify-around">
        <button
          id="mobile-nav-home"
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
            activeView === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          id="mobile-nav-groups"
          onClick={() => setActiveView('groups')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
            activeView === 'groups' || activeView === 'group-detail'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Groups</span>
        </button>

        {/* Visually Prominent Centered + Add Button */}
        <div className="relative -top-4">
          <button
            id="mobile-nav-add-btn"
            onClick={() => openAddExpenseModal('manual')}
            className="w-13 h-13 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-transform"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        <button
          id="mobile-nav-discover"
          onClick={() => setActiveView('discover')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
            activeView === 'discover'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Discover</span>
        </button>

        <button
          id="mobile-nav-profile"
          onClick={() => setActiveView('profile')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
            activeView === 'profile'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </div>
    </div>
  );
};
