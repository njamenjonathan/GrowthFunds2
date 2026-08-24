import React, { useState, useEffect } from 'react';
import {
  INITIAL_PLANS,
  INITIAL_USER,
  INITIAL_ACTIVE_INVESTMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_ADMIN_DEPOSITS,
  INITIAL_ADMIN_WITHDRAWALS,
  INITIAL_KYC_APPLICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import {
  InvestmentPlan,
  UserProfile,
  ActiveInvestment,
  Transaction,
  PaymentMethodType,
  AuditLog,
  ReferralRecord,
  AppNotification,
} from './types';

import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { PlansView } from './components/PlansView';
import { DashboardView } from './components/DashboardView';
import { TransactionHistoryView } from './components/TransactionHistoryView';
import { SecurityView } from './components/SecurityView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { DepositFlow } from './components/DepositFlow';
import { WithdrawalFlow } from './components/WithdrawalFlow';
import { KycVerificationModal } from './components/KycVerificationModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { SupportChatModal } from './components/SupportChatModal';
import { LegalModal } from './components/LegalModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  // Theme State (Light vs High-Contrast Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem('growthfund_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // ignore
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('growthfund_theme', theme);
    } catch {
      // ignore
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Main Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Core Data State
  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);
  const [plans] = useState<InvestmentPlan[]>(INITIAL_PLANS);
  const [activeInvestments, setActiveInvestments] = useState<ActiveInvestment[]>(INITIAL_ACTIVE_INVESTMENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Notification Handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Admin Data State
  const [adminDeposits, setAdminDeposits] = useState(INITIAL_ADMIN_DEPOSITS);
  const [adminWithdrawals, setAdminWithdrawals] = useState(INITIAL_ADMIN_WITHDRAWALS);
  const [kycApplications, setKycApplications] = useState(INITIAL_KYC_APPLICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Modals
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [showKycModal, setShowKycModal] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [legalModalTopic, setLegalModalTopic] = useState<string | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);

  // Deposit Handler
  const handleDepositSuccess = (amount: number, method: PaymentMethodType, phone: string) => {
    if (!user) return;
    const fee = Math.round(amount * 0.005);
    const refCode = `GF-DP-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'deposit',
      amount: amount,
      fee: fee,
      netAmount: amount,
      status: 'completed',
      method: method,
      reference: refCode,
      date: 'Just now',
      timestamp: Date.now(),
      destinationOrSource: phone,
      notes: `Mobile deposit authorized via ${method}.`,
    };

    setUser({
      ...user,
      availableBalance: user.availableBalance + amount,
    });
    setTransactions([newTx, ...transactions]);

    // Push new notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Deposit Successful',
      message: `${amount.toLocaleString()} XAF deposited via ${method} has been credited to your available balance.`,
      timestamp: Date.now(),
      timeAgo: 'Just now',
      type: 'deposit',
      read: false,
      amount: amount,
      reference: refCode,
      targetView: 'dashboard',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Add to Admin Deposits & Audit
    setAdminDeposits([
      {
        id: `dp_adm_${Date.now()}`,
        user: user.name,
        amount: amount,
        status: 'APPROVED',
        date: 'Just now',
        method: method,
      },
      ...adminDeposits,
    ]);

    setAuditLogs([
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: user.name,
        action: `Deposit Cleared (${amount.toLocaleString()} XAF)`,
        target: `Wallet ${user.id}`,
        ipAddress: '41.202.219.14',
        status: 'SUCCESS',
      },
      ...auditLogs,
    ]);
  };

  // Withdrawal Handler
  const handleWithdrawSuccess = (amount: number, fee: number, method: PaymentMethodType, account: string) => {
    if (!user) return;
    const netAmount = Math.max(0, amount - fee);
    const refCode = `GF-WD-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'withdrawal',
      amount: amount,
      fee: fee,
      netAmount: netAmount,
      status: 'completed',
      method: method,
      reference: refCode,
      date: 'Just now',
      timestamp: Date.now(),
      destinationOrSource: account,
      notes: `Payout dispatched to verified account ${account}.`,
    };

    setUser({
      ...user,
      availableBalance: user.availableBalance - amount,
    });
    setTransactions([newTx, ...transactions]);

    // Push new notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Withdrawal Dispatched',
      message: `${amount.toLocaleString()} XAF withdrawal to ${account} via ${method} is processing.`,
      timestamp: Date.now(),
      timeAgo: 'Just now',
      type: 'withdrawal',
      read: false,
      amount: amount,
      reference: refCode,
      targetView: 'history',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setAdminWithdrawals([
      {
        id: `wd_adm_${Date.now()}`,
        user: user.name,
        amount: amount,
        status: 'APPROVED',
        date: 'Just now',
        method: method,
        account: account,
      },
      ...adminWithdrawals,
    ]);

    setAuditLogs([
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: user.name,
        action: `Withdrawal Dispatched (${amount.toLocaleString()} XAF)`,
        target: `${method} (${account})`,
        ipAddress: '41.202.219.14',
        status: 'SUCCESS',
      },
      ...auditLogs,
    ]);
  };

  // Investment Allocation Handler
  const handleInvestInPlan = (plan: InvestmentPlan, amount: number) => {
    if (!user) return;
    const refCode = `GF-IV-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newInv: ActiveInvestment = {
      id: `inv_${Date.now()}`,
      planId: plan.id,
      planName: plan.name,
      amountInvested: amount,
      startDate: new Date().toISOString().split('T')[0],
      maturityDate: new Date(Date.now() + plan.termMonths * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      projectedReturn: plan.projectedReturn,
      accruedEarnings: 0,
      currentValuation: amount,
      status: 'active',
    };

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'investment',
      amount: amount,
      fee: 0,
      netAmount: amount,
      status: 'completed',
      method: 'Express Union Mobile',
      reference: refCode,
      date: 'Just now',
      timestamp: Date.now(),
      planName: plan.name,
      notes: `Capital committed to ${plan.name} (${plan.termMonths} Months lockup).`,
    };

    setUser({
      ...user,
      availableBalance: user.availableBalance - amount,
      investedBalance: user.investedBalance + amount,
    });
    setActiveInvestments([newInv, ...activeInvestments]);
    setTransactions([newTx, ...transactions]);

    // Push new notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Investment Active & Earning',
      message: `Subscribed ${amount.toLocaleString()} XAF to ${plan.name} (${plan.termMonths} Months, ${plan.projectedReturn}% projected return).`,
      timestamp: Date.now(),
      timeAgo: 'Just now',
      type: 'investment',
      read: false,
      amount: amount,
      reference: refCode,
      targetView: 'investments',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setAuditLogs([
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: user.name,
        action: `Subscribed to ${plan.name} (${amount.toLocaleString()} XAF)`,
        target: `Portfolio #${newInv.id}`,
        ipAddress: '41.202.219.14',
        status: 'SUCCESS',
      },
      ...auditLogs,
    ]);
  };

  // Referral Gift Handler (1,000 XAF Gift per successful referral)
  const handleReferralSuccess = (newReferral: ReferralRecord) => {
    if (!user) return;
    const reward = newReferral.giftAmount || 1000;
    const refCode = `GF-RF-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'referral_gift',
      amount: reward,
      fee: 0,
      netAmount: reward,
      status: 'completed',
      method: 'GrowthFund Wallet',
      reference: refCode,
      date: 'Just now',
      timestamp: Date.now(),
      destinationOrSource: `Referral Bonus: ${newReferral.name}`,
      notes: `1,000 XAF invite reward credited for friend sign-up (${newReferral.name}).`,
    };

    const currentList = user.referralList || [];
    const updatedList = [newReferral, ...currentList];
    const updatedCount = (user.referralCount || 0) + 1;
    const updatedEarnings = (user.referralEarnings || 0) + reward;

    setUser({
      ...user,
      availableBalance: user.availableBalance + reward,
      referralCount: updatedCount,
      referralEarnings: updatedEarnings,
      referralList: updatedList,
    });

    setTransactions([newTx, ...transactions]);

    // Push new notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Referral Reward Credited',
      message: `${newReferral.name} registered with your code ${user.referralCode || 'GF-SAM882'}. 1,000 XAF cash gift has been added to your wallet!`,
      timestamp: Date.now(),
      timeAgo: 'Just now',
      type: 'referral',
      read: false,
      amount: reward,
      reference: refCode,
      targetView: 'dashboard',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setAuditLogs([
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: 'System (Referral Engine)',
        action: `Referral Gift Credited (+${reward.toLocaleString()} XAF)`,
        target: `Referee: ${newReferral.name} (Code: ${user.referralCode || 'GF-USER'})`,
        ipAddress: '10.0.8.44',
        status: 'SUCCESS',
      },
      ...auditLogs,
    ]);
  };

  // KYC Update Handler
  const handleKycComplete = (updatedFields: Partial<UserProfile>) => {
    if (!user) return;
    setUser({
      ...user,
      ...updatedFields,
    });
  };

  // Admin Actions
  const handleApproveDeposit = (id: string) => {
    setAdminDeposits(adminDeposits.map((d) => (d.id === id ? { ...d, status: 'APPROVED' } : d)));
  };
  const handleRejectDeposit = (id: string) => {
    setAdminDeposits(adminDeposits.map((d) => (d.id === id ? { ...d, status: 'REJECTED' } : d)));
  };
  const handleApproveWithdrawal = (id: string) => {
    setAdminWithdrawals(adminWithdrawals.map((w) => (w.id === id ? { ...w, status: 'APPROVED' } : w)));
  };
  const handleRejectWithdrawal = (id: string) => {
    setAdminWithdrawals(adminWithdrawals.map((w) => (w.id === id ? { ...w, status: 'REJECTED' } : w)));
  };
  const handleApproveKyc = (id: string) => {
    setKycApplications(kycApplications.filter((k) => k.id !== id));
  };
  const handleRejectKyc = (id: string) => {
    setKycApplications(kycApplications.filter((k) => k.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-[#191c1d]">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        user={user}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onClearNotifications={handleClearNotifications}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        onOpenKyc={() => setShowKycModal(true)}
        onOpenDeposit={() => setShowDepositModal(true)}
        onOpenWithdraw={() => setShowWithdrawModal(true)}
        onOpenSupport={() => setShowSupportModal(true)}
        onLogout={() => setUser(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {isAdmin ? (
          <AdminDashboardView
            deposits={adminDeposits}
            withdrawals={adminWithdrawals}
            kycList={kycApplications}
            auditLogs={auditLogs}
            onApproveDeposit={handleApproveDeposit}
            onRejectDeposit={handleRejectDeposit}
            onApproveWithdrawal={handleApproveWithdrawal}
            onRejectWithdrawal={handleRejectWithdrawal}
            onApproveKyc={handleApproveKyc}
            onRejectKyc={handleRejectKyc}
          />
        ) : (
          <>
            {currentView === 'home' && (
              <HomeView
                plans={plans}
                onSelectPlan={() => {
                  setCurrentView('plans');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExplorePlans={() => {
                  setCurrentView('plans');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenDeposit={() => setShowDepositModal(true)}
                onOpenKyc={() => setShowKycModal(true)}
                onOpenLegal={(topic) => setLegalModalTopic(topic)}
              />
            )}

            {currentView === 'plans' && (
              <PlansView
                plans={plans}
                user={user}
                onInvestInPlan={handleInvestInPlan}
                onOpenDeposit={() => setShowDepositModal(true)}
                onOpenKyc={() => setShowKycModal(true)}
              />
            )}

            {currentView === 'calculator' && (
              <div className="py-6">
                <HomeView
                  plans={plans}
                  onSelectPlan={() => {
                    setCurrentView('plans');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onExplorePlans={() => {
                    setCurrentView('plans');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenDeposit={() => setShowDepositModal(true)}
                  onOpenKyc={() => setShowKycModal(true)}
                  onOpenLegal={(topic) => setLegalModalTopic(topic)}
                />
              </div>
            )}

            {currentView === 'dashboard' && user && (
              <DashboardView
                user={user}
                activeInvestments={activeInvestments}
                transactions={transactions}
                onOpenDeposit={() => setShowDepositModal(true)}
                onOpenWithdraw={() => setShowWithdrawModal(true)}
                onExplorePlans={() => setCurrentView('plans')}
                onOpenKyc={() => setShowKycModal(true)}
                onSelectTransaction={(tx) => setSelectedTransaction(tx)}
                onReferralSuccess={handleReferralSuccess}
              />
            )}

            {currentView === 'history' && (
              <TransactionHistoryView
                transactions={transactions}
                onSelectTransaction={(tx) => setSelectedTransaction(tx)}
                onOpenDeposit={() => setShowDepositModal(true)}
                onOpenWithdraw={() => setShowWithdrawModal(true)}
              />
            )}

            {currentView === 'security' && user && (
              <SecurityView
                user={user}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onUpdateSecurity={(settings) => setUser({ ...user, ...settings })}
                onOpenKyc={() => setShowKycModal(true)}
              />
            )}

            {currentView === 'legal' && (
              <div className="flex-1 p-6 md:p-12 max-w-[1000px] mx-auto w-full">
                <LegalModal initialTopic="terms" onClose={() => setCurrentView('home')} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Support Button on Desktop */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowSupportModal(true)}
          className="bg-[#002c13] text-[#fed65b] p-3.5 rounded-full shadow-lg hover:bg-[#014421] transition-all flex items-center gap-2 border-2 border-[#fed65b]/40 hover:scale-105 active:scale-95"
          title="Chat with CEMAC Investment Advisor"
        >
          <span className="material-symbols-outlined text-[24px]">support_agent</span>
          <span className="text-xs font-bold hidden sm:inline pr-1 text-white">Live Advisory</span>
        </button>
      </div>

      {/* Modals */}
      {showDepositModal && (
        <DepositFlow
          user={user}
          onClose={() => setShowDepositModal(false)}
          onDepositSuccess={handleDepositSuccess}
        />
      )}

      {showWithdrawModal && user && (
        <WithdrawalFlow
          user={user}
          onClose={() => setShowWithdrawModal(false)}
          onWithdrawSuccess={handleWithdrawSuccess}
          onOpenKyc={() => {
            setShowWithdrawModal(false);
            setShowKycModal(true);
          }}
        />
      )}

      {showKycModal && user && (
        <KycVerificationModal
          user={user}
          onClose={() => setShowKycModal(false)}
          onKycComplete={handleKycComplete}
        />
      )}

      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onOpenSupport={() => {
            setSelectedTransaction(null);
            setShowSupportModal(true);
          }}
        />
      )}

      {showSupportModal && (
        <SupportChatModal
          onClose={() => setShowSupportModal(false)}
          onOpenDeposit={() => {
            setShowSupportModal(false);
            setShowDepositModal(true);
          }}
          onOpenWithdraw={() => {
            setShowSupportModal(false);
            setShowWithdrawModal(true);
          }}
        />
      )}

      {legalModalTopic && (
        <LegalModal
          initialTopic={legalModalTopic}
          onClose={() => setLegalModalTopic(null)}
        />
      )}

      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onAuthSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setAuthModalMode(null);
            setCurrentView('dashboard');
          }}
        />
      )}
    </div>
  );
}

