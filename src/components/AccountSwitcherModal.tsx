import React from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Users,
  X,
  Check,
  Zap,
  LogOut,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  GraduationCap
} from 'lucide-react';

export const AccountSwitcherModal: React.FC = () => {
  const {
    isAccountSwitcherOpen,
    closeAccountSwitcher,
    currentUser,
    signedInAccounts,
    allUsers,
    jumpToAccount,
    removeAccount,
    logoutAll,
    openAuthModal,
    loginUser,
    showToast
  } = useApp();

  if (!isAccountSwitcherOpen) return null;

  const safeAccounts = Array.isArray(signedInAccounts) ? signedInAccounts : [];
  const safeAllUsers = Array.isArray(allUsers) ? allUsers : [];

  const handleAddSecondAccount = () => {
    closeAccountSwitcher();
    openAuthModal('signin');
    showToast('Sign in to connect your 2nd student account (max 2).', 'info');
  };

  const handleQuickAddDemoAccount = (userKey: string) => {
    const target = allUsers.find((u) => u.id === userKey);
    if (target) {
      loginUser(target);
      closeAccountSwitcher();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={closeAccountSwitcher}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Dual Account Manager
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                {signedInAccounts.length} / 2 Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Jump between up to 2 active student accounts with a single click.
            </p>
          </div>
        </div>

        {/* Account Slots List */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
            Connected Accounts
          </span>

          {safeAccounts.map((account, index) => {
            const isActive = account.id === currentUser?.id;
            return (
              <div
                key={account.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700/80 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/70 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={account.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={account.name}
                      className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/30"
                    />
                    {isActive && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {account.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                        Slot {index + 1}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {account.email}
                    </p>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate mt-0.5">
                      {account.course || 'Student'} • {account.institution || 'Campus'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isActive ? (
                    <span className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs">
                      Active Now
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        jumpToAccount(account.id);
                        closeAccountSwitcher();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Jump</span>
                    </button>
                  )}

                  <button
                    onClick={() => removeAccount(account.id)}
                    title={`Sign out ${account.name}`}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* If less than 2 accounts connected, show Slot 2 empty state */}
          {signedInAccounts.length < 2 && (
            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-center space-y-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Slot 2 is Available (Roommate or Secondary Account)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Connect a second account to jump between sessions with zero password re-prompts.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  onClick={handleAddSecondAccount}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Sign In 2nd Account</span>
                </button>

                {/* Quick prefill demo user */}
                {!signedInAccounts.some((u) => u.id === 'user_priya') && (
                  <button
                    onClick={() => handleQuickAddDemoAccount('user_priya')}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold"
                  >
                    + Add Priya (Demo)
                  </button>
                )}
                {!signedInAccounts.some((u) => u.id === 'user_rahul') && (
                  <button
                    onClick={() => handleQuickAddDemoAccount('user_rahul')}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold"
                  >
                    + Add Rahul (Demo)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Demo Pre-fills for Testing */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
            1-Click Sample Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            {safeAllUsers.slice(0, 4).map((user) => {
              const isAlreadySignedIn = safeAccounts.some((u) => u.id === user.id);
              const isActive = currentUser?.id === user.id;

              return (
                <button
                  key={user.id}
                  onClick={() => {
                    jumpToAccount(user.id);
                    closeAccountSwitcher();
                  }}
                  className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-400 text-indigo-900 dark:text-indigo-200 font-bold'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <span className="block text-[11px] font-bold truncate">{user.name.split(' ')[0]}</span>
                    <span className="block text-[9px] text-slate-400 truncate">@{user.username}</span>
                  </div>
                  {isAlreadySignedIn && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              logoutAll();
              closeAccountSwitcher();
            }}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 p-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out All Accounts</span>
          </button>

          <button
            onClick={closeAccountSwitcher}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
