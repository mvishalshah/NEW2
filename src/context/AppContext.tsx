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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Array<Group & { role: string; myBalance: number }>>([]);
  const [publicGroups, setPublicGroups] = useState<Group[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [financialSummary, setFinancialSummary] = useState<UserFinancialSummary | null>(null);
  const [myDebts, setMyDebts] = useState<DebtEdge[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeView, setActiveViewState] = useState<AppContextType['activeView']>('dashboard');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState<boolean>(false);
  const [initialAddExpenseMode, setInitialAddExpenseMode] = useState<'manual' | 'ocr'>('manual');
  const [isUPIModalOpen, setIsUPIModalOpen] = useState<boolean>(false);
  const [activeSettlementData, setActiveSettlementData] = useState<any | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false);
  const [activeReminderData, setActiveReminderData] = useState<any | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

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

  const refreshAllData = useCallback(async () => {
    try {
      const [meRes, usersRes, dashRes, discoverRes, expRes, notifRes] = await Promise.all([
        fetch('/api/auth/me').then((r) => r.json()),
        fetch('/api/users').then((r) => r.json()),
        fetch('/api/dashboard/summary').then((r) => r.json()),
        fetch('/api/groups/discover').then((r) => r.json()),
        fetch('/api/expenses').then((r) => r.json()),
        fetch('/api/notifications').then((r) => r.json())
      ]);

      if (meRes.user) setCurrentUser(meRes.user);
      if (usersRes.users) setAllUsers(usersRes.users);
      if (dashRes.groups) setGroups(dashRes.groups);
      if (dashRes.summary) setFinancialSummary(dashRes.summary);
      if (dashRes.debts) setMyDebts(dashRes.debts);
      if (discoverRes.groups) setPublicGroups(discoverRes.groups);
      if (expRes.expenses) setExpenses(expRes.expenses);
      if (notifRes.notifications) setNotifications(notifRes.notifications);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const switchUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        await refreshAllData();
        showToast(`Switched account to ${data.user.name} (@${data.user.username})`, 'info');
      }
    } catch (err) {
      showToast('Failed to switch user', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (email?: string, name?: string) => {
    setIsLoading(true);
    try {
      const targetEmail = email || `student_${Math.floor(100 + Math.random() * 900)}@college.edu`;
      const targetName = name || 'Student Member';
      const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: targetName,
          googleId: `google_${Date.now()}`,
          avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        await refreshAllData();
        showToast(`Welcome back, ${data.user.name}! 👋`, 'success');
        setIsOnboardingOpen(true); // Open onboarding so they can confirm institution/UPI
      }
    } catch (err) {
      showToast('Google login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    showToast('Logged out of session', 'info');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success && json.user) {
        setCurrentUser(json.user);
        showToast('Profile updated successfully!', 'success');
        return true;
      }
      return false;
    } catch (err) {
      showToast('Error updating profile', 'error');
      return false;
    }
  };

  const createGroup = async (data: any): Promise<Group | null> => {
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success && json.group) {
        showToast(`Group "${json.group.name}" created with code: ${json.group.groupCode}! 🎉`, 'success');
        await refreshAllData();
        return json.group;
      }
      showToast(json.error || 'Failed to create group', 'error');
      return null;
    } catch (err) {
      showToast('Failed to create group', 'error');
      return null;
    }
  };

  const joinGroupWithCode = async (code: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/groups/join-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message, 'success');
        await refreshAllData();
        if (json.group) {
          setActiveView('group-detail', json.group.id);
        }
        return true;
      }
      showToast(json.message || json.error || 'Failed to join group', 'error');
      return false;
    } catch (err) {
      showToast('Failed to join group', 'error');
      return false;
    }
  };

  const recordSettlement = async (data: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/settlements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Payment of ₹${data.amount} recorded! 💸`, 'success');
        await refreshAllData();
        return true;
      }
      showToast(json.error || 'Failed to record settlement', 'error');
      return false;
    } catch (err) {
      showToast('Failed to record settlement', 'error');
      return false;
    }
  };

  const confirmSettlement = async (settlementId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/settlements/${settlementId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const json = await res.json();
      if (json.success) {
        showToast('Settlement confirmed and marked complete! ✅', 'success');
        await refreshAllData();
        return true;
      }
      showToast(json.error || 'Failed to confirm settlement', 'error');
      return false;
    } catch (err) {
      showToast('Failed to confirm settlement', 'error');
      return false;
    }
  };

  const sendPaymentReminder = async (data: any): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/reminders/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message, 'success');
        return { success: true, message: json.message };
      }
      showToast(json.message || json.error || 'Could not send reminder', 'error');
      return { success: false, message: json.message || json.error };
    } catch (err) {
      showToast('Failed to send reminder', 'error');
      return { success: false, message: 'Server error sending reminder' };
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      showToast('All notifications marked as read', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteExpense = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast('Expense deleted successfully', 'info');
        await refreshAllData();
        return true;
      }
      showToast(json.error || 'Failed to delete expense', 'error');
      return false;
    } catch (err) {
      showToast('Failed to delete expense', 'error');
      return false;
    }
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
