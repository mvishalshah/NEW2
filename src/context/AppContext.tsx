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

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
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
  activeView: 'dashboard' | 'expenses' | 'groups' | 'group-detail' | 'discover' | 'analytics' | 'profile' | 'notifications';
  selectedGroupId: string | null;
  isAddExpenseModalOpen: boolean;
  initialAddExpenseMode: 'manual' | 'ocr';
  isUPIModalOpen: boolean;
  activeSettlementData: {
    recipientUser: User;
    amount: number;
    groupId?: string;
    note?: string;
  } | null;
  isReminderModalOpen: boolean;
  activeReminderData: {
    receiverUser: User;
    amount: number;
    groupId?: string;
  } | null;
  isOnboardingOpen: boolean;
  darkMode: boolean;

  // Actions
  setActiveView: (view: AppContextType['activeView'], groupId?: string) => void;
  openAddExpenseModal: (mode?: 'manual' | 'ocr', groupId?: string) => void;
  closeAddExpenseModal: () => void;
  openUPIPayment: (data: { recipientUser: User; amount: number; groupId?: string; note?: string }) => void;
  closeUPIPayment: () => void;
  openReminderModal: (data: { receiverUser: User; amount: number; groupId?: string }) => void;
  closeReminderModal: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  switchUser: (userId: string) => Promise<void>;
  googleLogin: (email?: string, name?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  refreshAllData: () => Promise<void>;
  createGroup: (data: any) => Promise<Group | null>;
  joinGroupWithCode: (code: string) => Promise<boolean>;
  recordSettlement: (data: any) => Promise<boolean>;
  confirmSettlement: (settlementId: string) => Promise<boolean>;
  sendPaymentReminder: (data: any) => Promise<{ success: boolean; message: string }>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  deleteExpense: (id: string) => Promise<boolean>;
  toggleDarkMode: () => void;
  closeOnboarding: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper for safe localStorage loading
function getStored<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(`splitmate_${key}`);
    return item ? JSON.parse(item) : defaultVal;
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
  const [currentUser, setCurrentUser] = useState<User>(() => getStored('current_user', initialUsers[0]));
  const [allUsers, setAllUsers] = useState<User[]>(() => getStored('all_users', initialUsers));
  const [groupsState, setGroupsState] = useState<Group[]>(() => getStored('groups', initialGroups));
  const [expenses, setExpenses] = useState<Expense[]>(() => getStored('expenses', initialExpenses));
  const [settlements, setSettlements] = useState<Settlement[]>(() => getStored('settlements', initialSettlements));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getStored('notifications', initialNotifications));
  
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeView, setActiveViewState] = useState<AppContextType['activeView']>('dashboard');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState<boolean>(false);
  const [initialAddExpenseMode, setInitialAddExpenseMode] = useState<'manual' | 'ocr'>('manual');
  const [isUPIModalOpen, setIsUPIModalOpen] = useState<boolean>(false);
  const [activeSettlementData, setActiveSettlementData] = useState<any | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false);
  const [activeReminderData, setActiveReminderData] = useState<any | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('splitmate_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Calculate dynamic debts & summary
  const myDebts = calculateDebtsClient(expenses, settlements).filter(
    (d) => d.fromUserId === currentUser.id || d.toUserId === currentUser.id
  );
  const financialSummary = calculateFinancialSummaryClient(currentUser.id, expenses, settlements);

  // Compute enriched groups with user role and individual balance
  const groups = groupsState.map((grp) => {
    const groupDebts = calculateDebtsClient(expenses, settlements, grp.id);
    let myBalance = 0;
    groupDebts.forEach((d) => {
      if (d.toUserId === currentUser.id) myBalance += d.amount;
      if (d.fromUserId === currentUser.id) myBalance -= d.amount;
    });
    return {
      ...grp,
      role: grp.ownerId === currentUser.id ? 'owner' : 'member',
      myBalance
    };
  });

  const publicGroups = groupsState.filter((g) => g.privacy === 'public');

  // Persistence helpers
  useEffect(() => {
    setStored('current_user', currentUser);
  }, [currentUser]);

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

  const setActiveView = useCallback((view: AppContextType['activeView'], groupId?: string) => {
    setActiveViewState(view);
    if (groupId) {
      setSelectedGroupId(groupId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Sync with backend if available
  const refreshAllData = useCallback(async () => {
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
      // Backend not running (e.g. GitHub Pages static export) - keep client state
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const switchUser = async (userId: string) => {
    const foundUser = allUsers.find((u) => u.id === userId);
    if (foundUser) {
      setCurrentUser(foundUser);
      showToast(`Switched account to ${foundUser.name} (@${foundUser.username})`, 'info');
    }

    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) setCurrentUser(data.user);
      }
    } catch {
      // Offline fallback already updated state
    }
  };

  const googleLogin = async (email?: string, name?: string) => {
    const targetEmail = email || `student_${Math.floor(100 + Math.random() * 900)}@college.edu`;
    const targetName = name || 'Student Member';

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
        upiId: `${targetEmail.split('@')[0]}@okaxis`,
        bio: 'College student & bill splitting enthusiast',
        createdAt: new Date().toISOString()
      };
      setAllUsers((prev) => [...prev, user!]);
    }

    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}! 👋`, 'success');
    setIsOnboardingOpen(true);

    try {
      await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: targetName,
          googleId: user.googleId,
          avatarUrl: user.avatarUrl
        })
      });
    } catch {
      // Offline fallback succeeded
    }
  };

  const logout = () => {
    showToast('Logged out of session', 'info');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    showToast('Profile updated successfully!', 'success');

    try {
      await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch {}
    return true;
  };

  const createGroup = async (data: any): Promise<Group | null> => {
    const newGroup: Group = {
      id: `grp_${Date.now()}`,
      name: data.name,
      description: data.description || '',
      category: data.category || 'college',
      institution: data.institution || currentUser.institution,
      city: data.city || currentUser.city,
      privacy: data.privacy || 'public',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80',
      ownerId: currentUser.id,
      groupCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      createdAt: new Date().toISOString(),
      memberCount: 1
    };

    setGroupsState((prev) => [newGroup, ...prev]);
    showToast(`Group "${newGroup.name}" created with code: ${newGroup.groupCode}! 🎉`, 'success');

    try {
      await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch {}

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

  const recordSettlement = async (data: any): Promise<boolean> => {
    const newSettlement: Settlement = {
      id: `set_${Date.now()}`,
      groupId: data.groupId,
      fromUserId: data.fromUserId || currentUser.id,
      toUserId: data.toUserId,
      amount: Number(data.amount),
      status: 'completed',
      paymentMethod: data.paymentMethod || 'upi',
      note: data.note,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString()
    };

    setSettlements((prev) => [newSettlement, ...prev]);
    showToast(`Payment of ₹${data.amount} recorded! 💸`, 'success');

    try {
      await fetch('/api/settlements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch {}

    return true;
  };

  const confirmSettlement = async (settlementId: string): Promise<boolean> => {
    setSettlements((prev) =>
      prev.map((s) => (s.id === settlementId ? { ...s, status: 'completed', paidAt: new Date().toISOString() } : s))
    );
    showToast('Settlement confirmed and marked complete! ✅', 'success');

    try {
      await fetch(`/api/settlements/${settlementId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch {}

    return true;
  };

  const sendPaymentReminder = async (data: any): Promise<{ success: boolean; message: string }> => {
    const receiver = allUsers.find((u) => u.id === data.receiverId);
    const msg = `Reminder for ₹${data.amount} sent to ${receiver?.name || 'student'}.`;
    
    // Add local notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: data.receiverId,
      type: 'payment_reminder',
      title: `Payment Reminder from ${currentUser.name}`,
      message: `${currentUser.name} sent a friendly reminder for ₹${data.amount} ${data.note ? `("${data.note}")` : ''}`,
      read: false,
      data: { amount: data.amount, fromUserId: currentUser.id, groupId: data.groupId },
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

    try {
      await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    } catch {}

    return true;
  };

  const openAddExpenseModal = (mode: 'manual' | 'ocr' = 'manual', groupId?: string) => {
    setInitialAddExpenseMode(mode);
    if (groupId) setSelectedGroupId(groupId);
    setIsAddExpenseModalOpen(true);
  };

  const closeAddExpenseModal = () => {
    setIsAddExpenseModalOpen(false);
  };

  const openUPIPayment = (data: { recipientUser: User; amount: number; groupId?: string; note?: string }) => {
    setActiveSettlementData(data);
    setIsUPIModalOpen(true);
  };

  const closeUPIPayment = () => {
    setIsUPIModalOpen(false);
    setActiveSettlementData(null);
  };

  const openReminderModal = (data: { receiverUser: User; amount: number; groupId?: string }) => {
    setActiveReminderData(data);
    setIsReminderModalOpen(true);
  };

  const closeReminderModal = () => {
    setIsReminderModalOpen(false);
    setActiveReminderData(null);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const closeOnboarding = () => {
    setIsOnboardingOpen(false);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
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
        activeView,
        selectedGroupId,
        isAddExpenseModalOpen,
        initialAddExpenseMode,
        isUPIModalOpen,
        activeSettlementData,
        isReminderModalOpen,
        activeReminderData,
        isOnboardingOpen,
        darkMode,
        setActiveView,
        openAddExpenseModal,
        closeAddExpenseModal,
        openUPIPayment,
        closeUPIPayment,
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
        recordSettlement,
        confirmSettlement,
        sendPaymentReminder,
        markNotificationRead,
        markAllNotificationsRead,
        deleteExpense,
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
