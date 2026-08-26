import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext.js';
import { supabase, isSupabaseConfigured } from './lib/supabase.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { BottomNav } from './components/BottomNav.js';
import { LandingHomeView } from './components/LandingHomeView.js';
import { PersonalDashboard } from './components/PersonalDashboard.js';
import { ExpensesListView } from './components/ExpensesListView.js';
import { GroupsList } from './components/GroupsList.js';
import { GroupDetails } from './components/GroupDetails.js';
import { DiscoverGroups } from './components/DiscoverGroups.js';
import { AnalyticsView } from './components/AnalyticsView.js';
import { ProfileView } from './components/ProfileView.js';
import { AuthView } from './components/AuthView.js';
import { AddExpenseModal } from './components/AddExpenseModal.js';
import { MoneyExchangeModal } from './components/MoneyExchangeModal.js';
import { PaymentReminderModal } from './components/PaymentReminderModal.js';
import { OnboardingModal } from './components/OnboardingModal.js';
import { AuthModal } from './components/AuthModal.js';
import { AuthGateView } from './components/AuthGateView.js';
import { AccountSwitcherModal } from './components/AccountSwitcherModal.js';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    currentUser,
    activeView,
    selectedGroupId,
    toasts,
    removeToast,
    groups,
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    setActiveView
  } = useApp();

  // Guard private pages with supabase.auth.getSession() -> redirect to /login if no session
  useEffect(() => {
    const privateViews = ['expenses', 'groups', 'group-detail', 'analytics', 'profile'];
    if (privateViews.includes(activeView)) {
      const verifySession = async () => {
        if (isSupabaseConfigured()) {
          const { data } = await supabase.auth.getSession();
          if (!data?.session) {
            window.history.pushState({}, '', '/login');
            setActiveView('auth');
          }
        } else if (!currentUser) {
          window.history.pushState({}, '', '/login');
          setActiveView('auth');
        }
      };
      verifySession();
    }
  }, [activeView, currentUser, setActiveView]);

  const renderActiveView = () => {
    // When not signed in:
    if (!currentUser) {
      if (activeView === 'auth') {
        return <AuthView />;
      }
      if (activeView === 'dashboard') {
        return <LandingHomeView />;
      }
      if (activeView === 'discover') {
        return <DiscoverGroups />;
      }
      // For any other private feature attempt without session, redirect to /login (AuthView)
      return <AuthView />;
    }

    // When signed in:
    switch (activeView) {
      case 'dashboard':
        return <PersonalDashboard />;
      case 'expenses':
        return <ExpensesListView />;
      case 'groups':
        return <GroupsList />;
      case 'group-detail':
        return <GroupDetails groupId={selectedGroupId || groups[0]?.id || 'grp_1'} />;
      case 'discover':
        return <DiscoverGroups />;
      case 'analytics':
        return <AnalyticsView />;
      case 'profile':
        return <ProfileView />;
      case 'auth':
        return <AuthView />;
      default:
        return <PersonalDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 w-full overflow-x-hidden">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderActiveView()}
      </main>

      <Footer />

      <BottomNav />

      {/* Global Modals */}
      <AddExpenseModal />
      <MoneyExchangeModal />
      <PaymentReminderModal />
      <OnboardingModal />
      <AccountSwitcherModal />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />

      {/* Floating Toast Notifications */}
      {toasts.length > 0 && (
        <div className="fixed bottom-16 md:bottom-5 right-4 sm:right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-[calc(100vw-2rem)] sm:w-auto">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-center justify-between gap-3 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 ${
                toast.type === 'success'
                  ? 'bg-indigo-950 text-white border-indigo-800 shadow-indigo-950/20'
                  : toast.type === 'error'
                  ? 'bg-rose-600 text-white border-rose-500 shadow-rose-950/20'
                  : 'bg-slate-900 text-white border-slate-800 shadow-slate-950/20'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-200 shrink-0" />}
                {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-300 shrink-0" />}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg hover:bg-white/20 text-white/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
