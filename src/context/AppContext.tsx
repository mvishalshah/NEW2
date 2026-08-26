import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  Group,
  Expense,
  Settlement,
  AppNotification,
  UserFinancialSummary,
  DebtEdge
} from '../types.js';
import {
  initialUsers,
  initialGroups,
  initialExpenses,
  initialSettlements,
  initialNotifications,
  calculateDebtsClient,
  calculateFinancialSummaryClient
} from '../data/mockData.js';
import {
  supabase,
  isSupabaseConfigured,
  fetchProfileFromSupabase,
  upsertProfileToSupabase,
  fetchGroupsFromSupabase,
  insertGroupToSupabase,
  fetchExpensesFromSupabase,
  insertExpenseToSupabase,
  deleteExpenseFromSupabase,
  fetchSettlementsFromSupabase,
  insertSettlementToSupabase,
  fetchNotificationsFromSupabase,
  uploadReceiptToSupabase,
  uploadAvatarToSupabase
} from '../lib/supabase.js';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  signedInAccounts: User[];
  allUsers: User[];
  groups: Array<Group & { role: string; myBalance: number }>;
  publicGroups: Group[];
  expenses: Expense[];
  notifications: AppNotification[];
  unreadNotificationCount: number;
  financialSummary: UserFinancialSummary | null;
  myDebts: DebtEdge[];
  toasts: Toast[];
  isLoading: boolean;
  isSupabaseConnected: boolean;
  activeView: 'dashboard' | 'expenses' | 'groups' | 'group-detail' | 'discover' | 'analytics' | 'profile' | 'notifications' | 'auth';
  selectedGroupId: string | null;
  isAddExpenseModalOpen: boolean;
  initialAddExpenseMode: 'manual' | 'ocr';
  isMoneyExchangeOpen: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  isAccountSwitcherOpen: boolean;
  activeSettlementData: {
    recipientUser: User;
    amount: number;
    groupId?: string;
    note?: string;
    existingSettlementId?: string;
    isPayer?: boolean;
  } | null;
  isReminderModalOpen: boolean;
  activeReminderData: {
    receiverUser: User;
    amount: number;
    groupId?: string;
    settlementId?: string;
  } | null;
  isOnboardingOpen: boolean;
  darkMode: boolean;

  // Actions
  loginUser: (user: User) => void;
  jumpToAccount: (userId: string) => Promise<void>;
  removeAccount: (userId: string) => Promise<void>;
  logoutAll: () => Promise<void>;
  openAccountSwitcher: () => void;
  closeAccountSwitcher: () => void;
  setActiveView: (view: AppContextType['activeView'], groupId?: string) => void;
  openAddExpenseModal: (mode?: 'manual' | 'ocr', groupId?: string) => void;
  closeAddExpenseModal: () => void;
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  openMoneyExchange: (data: { recipientUser: User; amount: number; groupId?: string; note?: string; existingSettlementId?: string; isPayer?: boolean }) => void;
  closeMoneyExchange: () => void;
  openReminderModal: (data: { receiverUser: User; amount: number; groupId?: string; settlementId?: string }) => void;
  closeReminderModal: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  switchUser: (userId: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  refreshAllData: () => Promise<void>;
  createGroup: (data: any) => Promise<Group | null>;
  joinGroupWithCode: (code: string) => Promise<boolean>;
  addExpense: (data: any) => Promise<Expense | null>;
  recordSettlement: (data: any) => Promise<boolean>;
  confirmSettlement: (settlementId: string) => Promise<boolean>;
  agreeToHonesty: (settlementId: string) => Promise<boolean>;
  rejectSettlement: (settlementId: string) => Promise<boolean>;
  sendPaymentReminder: (data: any) => Promise<{ success: boolean; message: string }>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  deleteExpense: (id: string) => Promise<boolean>;
  uploadReceipt: (file: File | Blob) => Promise<{ url: string | null; error: string | null }>;
  uploadAvatar: (file: File | Blob) => Promise<{ url: string | null; error: string | null }>;
  toggleDarkMode: () => void;
  closeOnboarding: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper for safe localStorage loading
function getStored<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(`splitmate_${key}`);
    if (!item || item === 'undefined' || item === 'null') return defaultVal;
    const parsed = JSON.parse(item);
    if (parsed === null || parsed === undefined) return defaultVal;
    if (Array.isArray(defaultVal) && !Array.isArray(parsed)) return defaultVal;
    return parsed;
  } catch (e) {
    return defaultVal;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`splitmate_${key}`, JSON.stringify(value));
  } catch (e) {
    // Ignore storage quota errors
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signedInAccounts, setSignedInAccounts] = useState<User[]>(() => getStored<User[]>('signed_in_accounts', []));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = getStored<User | null>('current_user', null);
    const savedAccounts = getStored<User[]>('signed_in_accounts', []);
    if (savedUser && savedUser.id) return savedUser;
    if (Array.isArray(savedAccounts) && savedAccounts.length > 0) return savedAccounts[0];
    return null;
  });
  const [allUsers, setAllUsers] = useState<User[]>(() => getStored<User[]>('all_users', initialUsers));
  const [groupsState, setGroupsState] = useState<Group[]>(() => getStored<Group[]>('groups', initialGroups));
  const [expenses, setExpenses] = useState<Expense[]>(() => getStored<Expense[]>('expenses', initialExpenses));
  const [settlements, setSettlements] = useState<Settlement[]>(() => getStored<Settlement[]>('settlements', initialSettlements));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getStored<AppNotification[]>('notifications', initialNotifications));
  
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeView, setActiveViewState] = useState<AppContextType['activeView']>('dashboard');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState<boolean>(false);
  const [initialAddExpenseMode, setInitialAddExpenseMode] = useState<'manual' | 'ocr'>('manual');
  const [isMoneyExchangeOpen, setIsMoneyExchangeOpen] = useState<boolean>(false);
  const [activeSettlementData, setActiveSettlementData] = useState<any | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false);
  const [activeReminderData, setActiveReminderData] = useState<any | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const isSupabaseConnected = isSupabaseConfigured();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('splitmate_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  const safeExpenses = Array.isArray(expenses) ? expenses : initialExpenses;
  const safeSettlements = Array.isArray(settlements) ? settlements : initialSettlements;
  const safeGroups = Array.isArray(groupsState) ? groupsState : initialGroups;
  const safeNotifications = Array.isArray(notifications) ? notifications : initialNotifications;

  // Calculate dynamic debts & summary: when signed in, calculate for currentUser; in demo preview (no account), calculate for initial demo user 'u1'
  const myDebts = currentUser
    ? calculateDebtsClient(safeExpenses, safeSettlements).filter(
        (d) => d && (d.fromUserId === currentUser.id || d.toUserId === currentUser.id)
      )
    : calculateDebtsClient(safeExpenses, safeSettlements).filter(
        (d) => d && (d.fromUserId === 'u1' || d.toUserId === 'u1')
      );

  const financialSummary = currentUser
    ? calculateFinancialSummaryClient(currentUser.id, safeExpenses, safeSettlements)
    : calculateFinancialSummaryClient('u1', safeExpenses, safeSettlements);

  // Compute enriched groups with user role and individual balance
  const groups = safeGroups.map((grp) => {
    const groupDebts = calculateDebtsClient(safeExpenses, safeSettlements, grp.id);
    let myBalance = 0;
    if (currentUser) {
      (groupDebts || []).forEach((d) => {
        if (!d) return;
        if (d.toUserId === currentUser.id) myBalance += (d.amount || 0);
        if (d.fromUserId === currentUser.id) myBalance -= (d.amount || 0);
      });
    }
    return {
      ...grp,
      role: currentUser ? (grp.ownerId === currentUser.id ? 'owner' : 'member') : 'member',
      myBalance
    };
  });

  const publicGroups = safeGroups.filter((g) => g && g.privacy === 'public');

  // Persistence helpers
  useEffect(() => {
    if (currentUser) {
      setStored('current_user', currentUser);
    } else {
      try {
        localStorage.removeItem('splitmate_current_user');
      } catch {}
    }
  }, [currentUser]);

  useEffect(() => {
    setStored('signed_in_accounts', signedInAccounts);
  }, [signedInAccounts]);

  useEffect(() => {
    setStored('all_users', allUsers);
  }, [allUsers]);

  useEffect(() => {
    setStored('groups', groupsState);
  }, [groupsState]);

  useEffect(() => {
    setStored('expenses', expenses);
  }, [expenses]);

  useEffect(() => {
    setStored('settlements', settlements);
  }, [settlements]);

  useEffect(() => {
    setStored('notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('splitmate_dark_mode', String(darkMode));
      if (darkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    } catch {}
  }, [darkMode]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Strict 2-Account session manager
  const loginUser = useCallback((user: User) => {
    setSignedInAccounts((prev) => {
      let updated: User[];
      const alreadyExists = prev.some((u) => u.id === user.id);
      if (alreadyExists) {
        updated = prev.map((u) => (u.id === user.id ? user : u));
      } else if (prev.length < 2) {
        updated = [...prev, user];
      } else {
        // Capped at 2: Replace the currently inactive account slot (or slot 2)
        const activeIdx = prev.findIndex((u) => u.id === currentUser?.id);
        if (activeIdx === 0) {
          updated = [prev[0], user];
        } else if (activeIdx === 1) {
          updated = [user, prev[1]];
        } else {
          updated = [prev[0], user];
        }
      }
      setStored('signed_in_accounts', updated);
      return updated;
    });

    setCurrentUser(user);
    setStored('current_user', user);
    setAllUsers((prev) => (prev.some((u) => u.id === user.id) ? prev.map((u) => (u.id === user.id ? user : u)) : [...prev, user]));
    setActiveViewState('dashboard');
    showToast(`Signed in as ${user.name}! 🎓`, 'success');
  }, [currentUser?.id, showToast]);

  // Fast 1-click jump between active accounts
  const jumpToAccount = useCallback(async (userId: string) => {
    const target = allUsers.find((u) => u.id === userId) || signedInAccounts.find((u) => u.id === userId);
    if (!target) {
      showToast('Account not found', 'error');
      return;
    }

    setSignedInAccounts((prev) => {
      if (prev.some((u) => u.id === target.id)) {
        return prev;
      }
      let updated: User[];
      if (prev.length < 2) {
        updated = [...prev, target];
      } else {
        // Keep active account, replace other slot
        const activeUser = prev.find((u) => u.id === currentUser?.id);
        updated = activeUser ? [activeUser, target] : [prev[0], target];
      }
      setStored('signed_in_accounts', updated);
      return updated;
    });

    setCurrentUser(target);
    setStored('current_user', target);
    showToast(`⚡ Jumped to ${target.name} (@${target.username})`, 'info');

    try {
      await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: target.id })
      });
    } catch {}
  }, [allUsers, signedInAccounts, currentUser?.id, showToast]);

  const switchUser = useCallback(async (userId: string) => {
    await jumpToAccount(userId);
  }, [jumpToAccount]);

  const removeAccount = useCallback(async (userId: string) => {
    const target = signedInAccounts.find((u) => u.id === userId);
    const remaining = signedInAccounts.filter((u) => u.id !== userId);
    setSignedInAccounts(remaining);
    setStored('signed_in_accounts', remaining);

    if (currentUser?.id === userId) {
      if (remaining.length > 0) {
        setCurrentUser(remaining[0]);
        setStored('current_user', remaining[0]);
        showToast(`Signed out ${target?.name || 'account'}. Active: ${remaining[0].name}`, 'info');
      } else {
        setCurrentUser(null);
        try {
          localStorage.removeItem('splitmate_current_user');
        } catch {}
        setActiveViewState('dashboard');
        showToast(`Signed out ${target?.name || 'account'}. Viewing Home preview.`, 'info');
      }
    } else {
      showToast(`Signed out ${target?.name || 'account'}.`, 'info');
    }
  }, [signedInAccounts, currentUser?.id, showToast]);

  const logoutAll = useCallback(async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    setSignedInAccounts([]);
    setStored('signed_in_accounts', []);
    setCurrentUser(null);
    try {
      localStorage.removeItem('splitmate_current_user');
    } catch {}
    setActiveViewState('dashboard');
    showToast('Signed out of all accounts. Viewing home screen.', 'info');
  }, [showToast]);

  const logout = useCallback(async () => {
    if (currentUser) {
      await removeAccount(currentUser.id);
    } else {
      await logoutAll();
    }
  }, [currentUser, removeAccount, logoutAll]);

  const openAccountSwitcher = () => setIsAccountSwitcherOpen(true);
  const closeAccountSwitcher = () => setIsAccountSwitcherOpen(false);

  const setActiveView = useCallback((view: AppContextType['activeView'], groupId?: string) => {
    setActiveViewState(view);
    if (groupId) {
      setSelectedGroupId(groupId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Sync Supabase Auth session & Supabase Database
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // Listen to Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const authUser = session.user;
        let profile = await fetchProfileFromSupabase(authUser.id);
        if (!profile) {
          profile = {
            id: authUser.id,
            googleId: authUser.user_metadata?.sub || authUser.id,
            name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Student',
            username: (authUser.email?.split('@')[0] || `user_${Date.now()}`).toLowerCase().replace(/[^a-z0-9_]/g, '_'),
            email: authUser.email || '',
            avatarUrl: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            institution: 'Delhi Technological University',
            course: 'B.Tech Engineering',
            year: '3rd Year',
            city: 'New Delhi',
            bio: 'Student & SplitMate user',
            createdAt: new Date().toISOString()
          };
          await upsertProfileToSupabase(profile);
        }
        setCurrentUser(profile);
        setAllUsers((prev) => (prev.some((u) => u.id === profile!.id) ? prev.map((u) => (u.id === profile!.id ? profile! : u)) : [...prev, profile!]));
        showToast(`Authenticated as ${profile.name} via Supabase Google Auth! ✨`, 'success');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [showToast]);

  // Sync with Supabase / Backend database
  const refreshAllData = useCallback(async () => {
    if (isSupabaseConfigured()) {
      setIsLoading(true);
      try {
        const [sbGroups, sbExpenses, sbSettlements] = await Promise.all([
          fetchGroupsFromSupabase(),
          fetchExpensesFromSupabase(),
          fetchSettlementsFromSupabase()
        ]);

        if (sbGroups.length > 0) setGroupsState(sbGroups);
        if (sbExpenses.length > 0) setExpenses(sbExpenses);
        if (sbSettlements.length > 0) setSettlements(sbSettlements);
        if (currentUser?.id) {
          const sbNotifs = await fetchNotificationsFromSupabase(currentUser.id);
          if (sbNotifs.length > 0) setNotifications(sbNotifs);
        }
      } catch (err) {
        console.warn('Supabase sync warning:', err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Backend / Local sync fallback
    try {
      const res = await fetch('/api/auth/me');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const meRes = await res.json();
        if (meRes.user) setCurrentUser(meRes.user);

        const [usersRes, dashRes, expRes, notifRes] = await Promise.all([
          fetch('/api/users').then((r) => r.json()).catch(() => null),
          fetch('/api/dashboard/summary').then((r) => r.json()).catch(() => null),
          fetch('/api/expenses').then((r) => r.json()).catch(() => null),
          fetch('/api/notifications').then((r) => r.json()).catch(() => null)
        ]);

        if (usersRes?.users) setAllUsers(usersRes.users);
        if (dashRes?.groups) setGroupsState(dashRes.groups);
        if (expRes?.expenses) setExpenses(expRes.expenses);
        if (notifRes?.notifications) setNotifications(notifRes.notifications);
      }
    } catch {
      // Backend not running - client-state remains active
    }
  }, [currentUser?.id]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const googleLogin = async () => {
    if (isSupabaseConfigured()) {
      showToast('Redirecting to Google Sign-In via Supabase...', 'info');
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) {
          showToast(`Google Login error: ${error.message}`, 'error');
        }
        return;
      } catch (err: any) {
        showToast(`Google Login error: ${err.message}`, 'error');
      }
    }

    // Demo Mode Google Login Simulation
    const targetEmail = `student_${Math.floor(100 + Math.random() * 900)}@college.edu`;
    const targetName = 'Student Member';

    let user = allUsers.find((u) => u.email.toLowerCase() === targetEmail.toLowerCase());
    if (!user) {
      user = {
        id: `user_${Date.now()}`,
        googleId: `google_${Date.now()}`,
        name: targetName,
        username: targetEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        email: targetEmail,
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        institution: 'Delhi Technological University',
        course: 'B.Tech Engineering',
        year: '3rd Year',
        city: 'New Delhi',
        bio: 'College student & bill splitting enthusiast',
        createdAt: new Date().toISOString()
      };
      setAllUsers((prev) => [...prev, user!]);
    }

    loginUser(user);
    setIsOnboardingOpen(true);
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!currentUser) return false;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    showToast('Profile updated successfully!', 'success');

    if (isSupabaseConfigured()) {
      await upsertProfileToSupabase(updated);
    } else {
      try {
        await fetch('/api/users/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch {}
    }
    return true;
  };

  const createGroup = async (data: any): Promise<Group | null> => {
    const ownerId = currentUser?.id || 'u1';
    const newGroup: Group = {
      id: `grp_${Date.now()}`,
      name: data.name,
      description: data.description || '',
      category: data.category || 'college',
      institution: data.institution || currentUser?.institution || '',
      city: data.city || currentUser?.city || '',
      privacy: data.privacy || 'public',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80',
      ownerId,
      groupCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      createdAt: new Date().toISOString(),
      memberCount: 1
    };

    setGroupsState((prev) => [newGroup, ...prev]);
    showToast(`Group "${newGroup.name}" created with code: ${newGroup.groupCode}! 🎉`, 'success');

    if (isSupabaseConfigured()) {
      await insertGroupToSupabase(newGroup);
    } else {
      try {
        await fetch('/api/groups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch {}
    }

    return newGroup;
  };

  const joinGroupWithCode = async (code: string): Promise<boolean> => {
    const cleaned = code.trim().toUpperCase();
    const found = groupsState.find((g) => g.groupCode?.toUpperCase() === cleaned);
    if (found) {
      showToast(`Joined ${found.name} successfully! 🚀`, 'success');
      setActiveView('group-detail', found.id);
      return true;
    }

    try {
      const res = await fetch('/api/groups/join-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleaned })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          showToast(json.message, 'success');
          if (json.group) {
            setGroupsState((prev) => (prev.some((g) => g.id === json.group.id) ? prev : [json.group, ...prev]));
            setActiveView('group-detail', json.group.id);
          }
          return true;
        }
      }
    } catch {}

    showToast('Invalid group join code. Please verify code.', 'error');
    return false;
  };

  const addExpense = async (data: any): Promise<Expense | null> => {
    const paidBy = data.paidBy || currentUser?.id || 'u1';
    const newExpense: Expense = {
      id: `exp_${Date.now()}`,
      groupId: data.groupId || undefined,
      groupName: data.groupName || undefined,
      title: data.title,
      description: data.description,
      amount: Number(data.amount),
      category: data.category || 'Food',
      date: data.date || new Date().toISOString().split('T')[0],
      paidBy,
      createdBy: currentUser?.id || 'u1',
      receiptUrl: data.receiptUrl,
      source: data.source || 'manual',
      splitMethod: data.splitMethod || 'equal',
      items: data.items || [],
      participants: data.participants || [],
      createdAt: new Date().toISOString()
    };

    setExpenses((prev) => [newExpense, ...prev]);
    showToast(`Expense of ₹${newExpense.amount} added! 🧾`, 'success');

    if (isSupabaseConfigured()) {
      await insertExpenseToSupabase(newExpense);
    } else {
      try {
        await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch {}
    }

    return newExpense;
  };

  const recordSettlement = async (data: any): Promise<boolean> => {
    const fromUserId = data.fromUserId || currentUser?.id || 'user_rahul';
    const toUserId = data.toUserId;
    const isCurrentPayer = currentUser ? currentUser.id === fromUserId : true;
    const isCurrentReceiver = currentUser ? currentUser.id === toUserId : false;

    // Both parties have to agree to confirm honesty:
    const payerAgreed = data.payerAgreed !== undefined ? Boolean(data.payerAgreed) : isCurrentPayer;
    const receiverAgreed = data.receiverAgreed !== undefined ? Boolean(data.receiverAgreed) : isCurrentReceiver;
    const isFullyAgreed = payerAgreed && receiverAgreed;

    const fromUserObj = allUsers.find((u) => u.id === fromUserId);
    const toUserObj = allUsers.find((u) => u.id === toUserId);

    const status: Settlement['status'] = isFullyAgreed
      ? 'completed'
      : payerAgreed
      ? 'awaiting_receiver'
      : 'awaiting_payer';

    const newSettlement: Settlement = {
      id: data.id || `set_${Date.now()}`,
      groupId: data.groupId,
      fromUserId,
      toUserId,
      amount: Number(data.amount),
      status,
      paymentMethod: data.paymentMethod || 'money_exchange',
      note: data.note,
      payerAgreed,
      payerAgreedAt: payerAgreed ? new Date().toISOString() : undefined,
      receiverAgreed,
      receiverAgreedAt: receiverAgreed ? new Date().toISOString() : undefined,
      honestyDeclaration:
        data.honestyDeclaration ||
        `Honesty pledge recorded for ₹${data.amount} money exchange between ${fromUserObj?.name || 'payer'} and ${toUserObj?.name || 'receiver'}.`,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      completedAt: isFullyAgreed ? new Date().toISOString() : undefined,
      fromUser: fromUserObj,
      toUser: toUserObj
    };

    setSettlements((prev) => [newSettlement, ...prev.filter((s) => s.id !== newSettlement.id)]);

    if (isFullyAgreed) {
      showToast(`🤝 Mutual Honesty Verified! ₹${data.amount} exchange completed!`, 'success');
      
      const confirmNotifA: AppNotification = {
        id: `notif_${Date.now()}_a`,
        userId: fromUserId,
        type: 'honesty_confirmed',
        title: 'Money Exchange Verified 🤝',
        message: `Both parties agreed in honesty! ₹${data.amount} exchange is fully settled.`,
        read: false,
        data: { amount: data.amount, settlementId: newSettlement.id },
        createdAt: new Date().toISOString()
      };
      const confirmNotifB: AppNotification = {
        id: `notif_${Date.now()}_b`,
        userId: toUserId,
        type: 'honesty_confirmed',
        title: 'Money Exchange Verified 🤝',
        message: `Both parties agreed in honesty! ₹${data.amount} exchange is fully settled.`,
        read: false,
        data: { amount: data.amount, settlementId: newSettlement.id },
        createdAt: new Date().toISOString()
      };
      setNotifications((prev) => [confirmNotifA, confirmNotifB, ...prev]);
    } else if (payerAgreed) {
      showToast(`Honesty oath signed! Sent exchange reminder to ${toUserObj?.name || 'roommate'}.`, 'info');
      
      // Auto dispatch honesty request notification to the receiver
      const requestNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        userId: toUserId,
        type: 'honesty_agreement_request',
        title: `Honesty Agreement Request: ${fromUserObj?.name || 'Roommate'}`,
        message: `${fromUserObj?.name || 'Roommate'} confirmed handing over ₹${data.amount}. Please click Agree to confirm honesty and complete settlement.`,
        read: false,
        data: { amount: data.amount, fromUserId, settlementId: newSettlement.id, groupId: data.groupId },
        createdAt: new Date().toISOString()
      };
      setNotifications((prev) => [requestNotif, ...prev]);
    } else if (receiverAgreed) {
      showToast(`Honesty verified! Waiting for ${fromUserObj?.name || 'roommate'} to click Agree.`, 'info');
    }

    if (isSupabaseConfigured()) {
      await insertSettlementToSupabase(newSettlement);
    } else {
      try {
        await fetch('/api/settlements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSettlement)
        });
      } catch {}
    }

    return true;
  };

  const agreeToHonesty = async (settlementId: string): Promise<boolean> => {
    let completedSet: Settlement | null = null;

    setSettlements((prev) =>
      prev.map((s) => {
        if (s.id !== settlementId) return s;

        const isPayer = currentUser ? s.fromUserId === currentUser.id : false;
        const isReceiver = currentUser ? s.toUserId === currentUser.id : false;

        const payerAgreed = isPayer ? true : s.payerAgreed;
        const receiverAgreed = isReceiver ? true : s.receiverAgreed;
        const bothAgreed = payerAgreed && receiverAgreed;

        const updated: Settlement = {
          ...s,
          payerAgreed,
          payerAgreedAt: isPayer ? new Date().toISOString() : s.payerAgreedAt,
          receiverAgreed,
          receiverAgreedAt: isReceiver ? new Date().toISOString() : s.receiverAgreedAt,
          status: bothAgreed ? 'completed' : isPayer ? 'awaiting_receiver' : 'awaiting_payer',
          completedAt: bothAgreed ? new Date().toISOString() : s.completedAt
        };

        if (bothAgreed) {
          completedSet = updated;
        }
        return updated;
      })
    );

    if (completedSet) {
      const setObj: Settlement = completedSet;
      showToast(`🤝 Mutual Honesty Verified! ₹${setObj.amount} exchange completed!`, 'success');

      const notifA: AppNotification = {
        id: `notif_${Date.now()}_a`,
        userId: setObj.fromUserId,
        type: 'honesty_confirmed',
        title: 'Money Exchange Verified 🤝',
        message: `Both parties agreed in honesty! ₹${setObj.amount} exchange is fully settled.`,
        read: false,
        data: { amount: setObj.amount, settlementId: setObj.id },
        createdAt: new Date().toISOString()
      };
      const notifB: AppNotification = {
        id: `notif_${Date.now()}_b`,
        userId: setObj.toUserId,
        type: 'honesty_confirmed',
        title: 'Money Exchange Verified 🤝',
        message: `Both parties agreed in honesty! ₹${setObj.amount} exchange is fully settled.`,
        read: false,
        data: { amount: setObj.amount, settlementId: setObj.id },
        createdAt: new Date().toISOString()
      };
      setNotifications((prev) => [notifA, notifB, ...prev]);
    } else {
      showToast('Your honesty agreement was registered! Waiting for the other member to agree.', 'info');
    }

    try {
      await fetch(`/api/settlements/${settlementId}/agree`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser?.id })
      });
    } catch {}

    return true;
  };

  const rejectSettlement = async (settlementId: string): Promise<boolean> => {
    setSettlements((prev) =>
      prev.map((s) => (s.id === settlementId ? { ...s, status: 'rejected' } : s))
    );
    showToast('Money exchange marked as disputed/cancelled.', 'info');
    try {
      await fetch(`/api/settlements/${settlementId}/reject`, { method: 'POST' });
    } catch {}
    return true;
  };

  const confirmSettlement = async (settlementId: string): Promise<boolean> => {
    return agreeToHonesty(settlementId);
  };

  const sendPaymentReminder = async (data: any): Promise<{ success: boolean; message: string }> => {
    const receiver = allUsers.find((u) => u.id === data.receiverId);
    const senderName = currentUser?.name || 'Student';
    const msg = `Payment reminder & honesty pledge sent to ${receiver?.name || 'roommate'}.`;

    // If an existing settlement was referenced or create one
    let targetSettlementId = data.settlementId;
    if (!targetSettlementId) {
      const existing = settlements.find(
        (s) =>
          ((s.fromUserId === currentUser?.id && s.toUserId === data.receiverId) ||
            (s.toUserId === currentUser?.id && s.fromUserId === data.receiverId)) &&
          s.status !== 'completed' &&
          s.status !== 'rejected'
      );
      targetSettlementId = existing?.id;
    }

    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: data.receiverId,
      type: 'honesty_agreement_request',
      title: `Payment Reminder & Honesty Request: ${senderName}`,
      message: `${senderName} sent a friendly reminder for ₹${data.amount} ${
        data.note ? `("${data.note}")` : ''
      }. Please confirm honesty to complete settlement.`,
      read: false,
      data: {
        amount: data.amount,
        fromUserId: currentUser?.id,
        settlementId: targetSettlementId,
        groupId: data.groupId
      },
      createdAt: new Date().toISOString()
    };

    setNotifications((prev) => [newNotif, ...prev]);
    showToast(msg, 'success');

    try {
      await fetch('/api/reminders/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch {}

    return { success: true, message: msg };
  };

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    } catch {}
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
    try {
      await fetch('/api/notifications/read-all', { method: 'PATCH' });
    } catch {}
  };

  const deleteExpense = async (id: string): Promise<boolean> => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Expense deleted successfully', 'info');

    if (isSupabaseConfigured()) {
      await deleteExpenseFromSupabase(id);
    } else {
      try {
        await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      } catch {}
    }

    return true;
  };

  const uploadReceipt = async (file: File | Blob) => {
    return uploadReceiptToSupabase(file);
  };

  const uploadAvatar = async (file: File | Blob) => {
    if (!currentUser) return { url: null, error: 'User not authenticated' };
    return uploadAvatarToSupabase(file, currentUser.id);
  };

  const openAddExpenseModal = (mode: 'manual' | 'ocr' = 'manual', groupId?: string) => {
    if (!currentUser) {
      openAuthModal('signin');
      showToast('Please sign in or sign up to add expenses & scan receipts', 'info');
      return;
    }
    setInitialAddExpenseMode(mode);
    if (groupId) setSelectedGroupId(groupId);
    setIsAddExpenseModalOpen(true);
  };

  const closeAddExpenseModal = () => {
    setIsAddExpenseModalOpen(false);
  };

  const openMoneyExchange = (data: {
    recipientUser: User;
    amount: number;
    groupId?: string;
    note?: string;
    existingSettlementId?: string;
    isPayer?: boolean;
  }) => {
    if (!currentUser) {
      openAuthModal('signin');
      showToast('Please sign in or sign up to record money exchanges & confirm honesty', 'info');
      return;
    }
    setActiveSettlementData(data);
    setIsMoneyExchangeOpen(true);
  };

  const closeMoneyExchange = () => {
    setIsMoneyExchangeOpen(false);
    setActiveSettlementData(null);
  };

  const openReminderModal = (data: { receiverUser: User; amount: number; groupId?: string; settlementId?: string }) => {
    if (!currentUser) {
      openAuthModal('signin');
      showToast('Please sign in or sign up to send payment reminders', 'info');
      return;
    }
    setActiveReminderData(data);
    setIsReminderModalOpen(true);
  };

  const closeReminderModal = () => {
    setIsReminderModalOpen(false);
    setActiveReminderData(null);
  };

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const closeOnboarding = () => {
    setIsOnboardingOpen(false);
  };

  const unreadNotificationCount = currentUser
    ? notifications.filter((n) => !n.read && (n.userId === currentUser.id || n.userId === 'all')).length
    : 0;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        signedInAccounts,
        allUsers,
        groups,
        publicGroups,
        expenses,
        notifications,
        unreadNotificationCount,
        financialSummary,
        myDebts,
        toasts,
        isLoading,
        isSupabaseConnected,
        activeView,
        selectedGroupId,
        isAddExpenseModalOpen,
        initialAddExpenseMode,
        isMoneyExchangeOpen,
        isAuthModalOpen,
        authModalMode,
        isAccountSwitcherOpen,
        activeSettlementData,
        isReminderModalOpen,
        activeReminderData,
        isOnboardingOpen,
        darkMode,
        loginUser,
        jumpToAccount,
        removeAccount,
        logoutAll,
        openAccountSwitcher,
        closeAccountSwitcher,
        setActiveView,
        openAddExpenseModal,
        closeAddExpenseModal,
        openAuthModal,
        closeAuthModal,
        openMoneyExchange,
        closeMoneyExchange,
        openReminderModal,
        closeReminderModal,
        showToast,
        removeToast,
        switchUser,
        googleLogin,
        logout,
        updateProfile,
        refreshAllData,
        createGroup,
        joinGroupWithCode,
        addExpense,
        recordSettlement,
        confirmSettlement,
        agreeToHonesty,
        rejectSettlement,
        sendPaymentReminder,
        markNotificationRead,
        markAllNotificationsRead,
        deleteExpense,
        uploadReceipt,
        uploadAvatar,
        toggleDarkMode,
        closeOnboarding
      }}
    >
      <div className={darkMode ? 'dark bg-slate-950 text-slate-100 min-h-screen' : 'bg-slate-50 text-slate-900 min-h-screen'}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

