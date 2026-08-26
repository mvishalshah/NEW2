import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Receipt,
  Users,
  Compass,
  BarChart3,
  Bell,
  User as UserIcon,
  Plus,
  ChevronDown,
  Camera,
  CheckCheck,
  LogOut,
  Moon,
  Sun,
  Layers,
  Sparkles,
  CreditCard,
  Zap,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    signedInAccounts,
    allUsers,
    jumpToAccount,
    removeAccount,
    logoutAll,
    openAccountSwitcher,
    activeView,
    setActiveView,
    openAddExpenseModal,
    openAuthModal,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    darkMode,
    toggleDarkMode,
    googleLogin,
    logout
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'expenses', label: 'My Expenses', icon: Receipt },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: UserIcon }
  ];

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const safeSignedInAccounts = Array.isArray(signedInAccounts) ? signedInAccounts : [];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button
              id="brand-logo-btn"
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
                <div className="w-4 h-4 border-2 border-white rotate-45 rounded-sm" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">SplitMate</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                    Student
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 hidden sm:block leading-normal mt-0.5">
                  Smart Split & OCR Parser
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => setActiveView(item.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-800'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Add Expense Action Button */}
            <div className="flex items-center gap-1.5">
              <button
                id="btn-quick-add-ocr"
                onClick={() => openAddExpenseModal('ocr')}
                title="Scan Receipt with AI OCR"
                className="hidden lg:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60 border border-indigo-200/70 dark:border-indigo-800/70 transition-all shadow-xs active:scale-95"
              >
                <Camera className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Scan Receipt</span>
              </button>

              <button
                id="btn-quick-add-expense"
                onClick={() => openAddExpenseModal('manual')}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md shadow-indigo-600/20 dark:shadow-none transition-all hover:shadow-lg active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden xs:inline">Add Expense</span>
                <span className="xs:hidden">Add</span>
              </button>
            </div>

            {/* Subtle Divider */}
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block" />

            {/* Utility Controls Group */}
            <div className="flex items-center gap-1.5">
              {/* Dark Mode Toggle */}
              <button
                id="theme-toggle-btn"
                onClick={toggleDarkMode}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 border border-slate-200/70 dark:border-slate-700/70 transition-all shadow-xs focus:outline-none active:scale-95 shrink-0"
                title="Toggle Dark Mode"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Notifications Popover */}
              <div className="relative" ref={notifRef}>
                <button
                  id="notifications-bell-btn"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  aria-label="View notifications"
                  title={`Notifications (${unreadNotificationCount} unread)`}
                  className={`relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all shadow-xs focus:outline-none active:scale-95 shrink-0 ${
                    isNotifOpen
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-600 dark:bg-indigo-950 dark:border-indigo-700 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                      : 'bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/70 dark:border-slate-700/70 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/70'
                  }`}
                >
                  <Bell className="w-4 h-4 shrink-0" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-indigo-600 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm animate-pulse">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2.5 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                        {unreadNotificationCount > 0 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            {unreadNotificationCount} new
                          </span>
                        )}
                      </div>
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={() => markAllNotificationsRead()}
                          className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold flex items-center gap-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                      {safeNotifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-xs">
                          No notifications yet. You are all caught up! ✨
                        </div>
                      ) : (
                        safeNotifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                              !n.read ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 mt-0.5 shrink-0">
                                <Bell className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {n.title}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                                  {n.message}
                                </p>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 2-Account Jump Switcher Bar or Sign In / Sign Up */}
              {safeSignedInAccounts.length > 0 && currentUser ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Account Jump Pills (Max 2) */}
                  <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-0.5 sm:p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                    {safeSignedInAccounts.map((account, idx) => {
                      const isActive = account.id === currentUser.id;
                      return (
                        <button
                          key={account.id}
                          id={`nav-jump-account-${account.username}`}
                          onClick={() => {
                            if (!isActive) {
                              jumpToAccount(account.id);
                            }
                          }}
                          title={
                            isActive
                              ? `Active: ${account.name} (Slot ${idx + 1})`
                              : `Click to Jump to ${account.name} (Slot ${idx + 1})`
                          }
                          className={`flex items-center gap-1.5 h-8 px-2 sm:px-2.5 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-white dark:bg-slate-900 text-indigo-900 dark:text-indigo-200 shadow-xs ring-1 ring-indigo-500/30'
                              : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 active:scale-95'
                          }`}
                        >
                          <div className="relative shrink-0">
                            <img
                              src={account.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                              alt={account.name}
                              className="w-5 h-5 rounded-md object-cover ring-1 ring-indigo-500/20"
                            />
                            {isActive && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            )}
                          </div>
                          <span className="hidden sm:inline-block truncate max-w-[70px] md:max-w-[85px]">
                            {account.name.split(' ')[0]}
                          </span>
                          {!isActive && (
                            <span className="hidden md:inline-flex items-center gap-0.5 text-[9px] px-1 py-0.2 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded font-black">
                              <Zap className="w-2.5 h-2.5" />
                              <span>Jump</span>
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {/* If only 1 account signed in, show button to add 2nd account */}
                    {signedInAccounts.length === 1 && (
                      <button
                        id="nav-add-second-account-btn"
                        onClick={() => openAuthModal('signin')}
                        title="Add 2nd Student Account (Max 2)"
                        className="flex items-center gap-1 h-8 px-2 rounded-xl text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">2nd Account</span>
                      </button>
                    )}
                  </div>

                  {/* Profile Menu Dropdown Button */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      id="user-profile-menu-btn"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      aria-label="Open student profile and switcher"
                      title="Profile & Dual Account Manager"
                      className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all border shadow-xs active:scale-95 shrink-0 ${
                        isUserMenuOpen || activeView === 'profile'
                          ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/20'
                          : 'bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 border-slate-200/70 dark:border-slate-700/70'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2.5 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                        {/* Current Active User Profile Header */}
                        <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                          <img
                            src={currentUser.avatarUrl}
                            alt={currentUser.name}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/40 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {currentUser.name}
                              </h4>
                              <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-black">
                                Active
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                            <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                              🤝 Honesty Verified
                            </span>
                          </div>
                        </div>

                        {/* Dual Account Fast Switcher (Max 2) */}
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-black tracking-wider text-slate-400 uppercase">
                              Active Accounts ({safeSignedInAccounts.length}/2 Max)
                            </span>
                            <button
                              onClick={() => {
                                setIsUserMenuOpen(false);
                                openAccountSwitcher();
                              }}
                              className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                            >
                              Manage
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            {safeSignedInAccounts.map((acc, i) => {
                              const isSelected = acc.id === currentUser.id;
                              return (
                                <div
                                  key={acc.id}
                                  className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                                    isSelected
                                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-semibold ring-1 ring-indigo-400/40'
                                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40'
                                  }`}
                                >
                                  <div
                                    onClick={() => {
                                      if (!isSelected) {
                                        jumpToAccount(acc.id);
                                        setIsUserMenuOpen(false);
                                      }
                                    }}
                                    className="flex items-center gap-2.5 truncate flex-1 cursor-pointer"
                                  >
                                    <img
                                      src={acc.avatarUrl}
                                      alt={acc.name}
                                      className="w-7 h-7 rounded-lg object-cover shrink-0"
                                    />
                                    <div className="truncate min-w-0">
                                      <span className="block truncate font-bold text-xs">{acc.name}</span>
                                      <span className="text-[10px] text-slate-400 block truncate">
                                        Slot {i + 1} • {acc.course || 'Student'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    {isSelected ? (
                                      <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                                        Active
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          jumpToAccount(acc.id);
                                          setIsUserMenuOpen(false);
                                        }}
                                        className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-xs"
                                      >
                                        <Zap className="w-2.5 h-2.5" />
                                        <span>Jump</span>
                                      </button>
                                    )}

                                    <button
                                      onClick={() => removeAccount(acc.id)}
                                      title="Sign out this account"
                                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                    >
                                      <LogOut className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}

                            {signedInAccounts.length < 2 && (
                              <button
                                onClick={() => {
                                  setIsUserMenuOpen(false);
                                  openAuthModal('signin');
                                }}
                                className="w-full py-2 px-3 border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 flex items-center justify-center gap-1.5 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add 2nd Account (Roommate)</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Navigation and Sign Out options */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 px-2 space-y-1">
                          <button
                            onClick={() => {
                              setActiveView('profile');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <UserIcon className="w-4 h-4 text-slate-500" />
                            <span>View Profile & Settings</span>
                          </button>

                          <button
                            onClick={() => {
                              logout();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            <span>Sign Out Active Account</span>
                          </button>

                          <button
                            onClick={() => {
                              logoutAll();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <LogOut className="w-4 h-4 text-slate-400" />
                            <span>Sign Out All Accounts</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    id="nav-signin-btn"
                    onClick={() => openAuthModal('signin')}
                    className="h-9 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/70 dark:border-slate-700/70"
                  >
                    Sign In
                  </button>
                  <button
                    id="nav-signup-btn"
                    onClick={() => openAuthModal('signup')}
                    className="h-9 px-3 sm:px-3.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/30 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
