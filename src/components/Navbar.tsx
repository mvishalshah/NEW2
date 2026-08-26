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
  CreditCard
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    allUsers,
    switchUser,
    activeView,
    setActiveView,
    openAddExpenseModal,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    darkMode,
    toggleDarkMode,
    googleLogin
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
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-xs">
                          No notifications yet. You are all caught up! ✨
                        </div>
                      ) : (
                        notifications.map((n) => (
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

              {/* Student Switcher & Profile Button */}
              <div className="relative" ref={userMenuRef}>
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="Open student profile and switcher"
                  title="Profile & Account Switcher"
                  className={`flex items-center gap-2 h-9 pl-1 pr-2 sm:pr-2.5 rounded-xl transition-all border shadow-xs active:scale-95 shrink-0 ${
                    isUserMenuOpen || activeView === 'profile'
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/20'
                      : 'bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 border-slate-200/70 dark:border-slate-700/70'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={currentUser?.name || 'User'}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/40"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white dark:ring-slate-900" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none truncate max-w-[85px] md:max-w-[100px]">
                      {currentUser?.name?.split(' ')[0] || 'Profile'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2.5 w-72 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* Current Active User Profile Header */}
                    <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                      <img
                        src={currentUser?.avatarUrl}
                        alt={currentUser?.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/40"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentUser?.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
                        <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                          UPI: {currentUser?.upiId || 'Not set'}
                        </span>
                      </div>
                    </div>

                    {/* Switch Active Student Account */}
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                          Switch Student Account
                        </span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                          Live Multi-User Test
                        </span>
                      </div>
                      <div className="space-y-1">
                        {allUsers.map((u) => {
                          const isSelected = u.id === currentUser?.id;
                          return (
                            <button
                              key={u.id}
                              id={`switch-user-${u.username}`}
                              onClick={() => {
                                switchUser(u.id);
                                setIsUserMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                                isSelected
                                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-semibold ring-1 ring-indigo-400/40'
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <img src={u.avatarUrl} alt={u.name} className="w-6 h-6 rounded-lg object-cover" />
                                <div className="truncate">
                                  <span className="block truncate">{u.name}</span>
                                  <span className="text-[10px] text-slate-400 block truncate">{u.course}</span>
                                </div>
                              </div>
                              {isSelected && <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-bold">Active</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 px-2 space-y-1">
                      <button
                        onClick={() => {
                          setActiveView('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-500" />
                        <span>View Full Profile & UPI</span>
                      </button>
                      <button
                        onClick={() => {
                          googleLogin();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        <span>Sign In with New Google Profile</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
