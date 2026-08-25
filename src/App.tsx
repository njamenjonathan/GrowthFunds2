import { useCallback, useEffect, useMemo, useState } from 'react';
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
  SubInvestment,
  AppNotification,
  View,
  DashboardTab,
} from './types';
import { lockStateFor, maturityDateInDays, payoutFor } from './lib/commitment';
import { DAILY_CHECKIN_XAF, REFERRAL_REWARD_XAF } from './lib/constants';
import { canCheckIn, nextStreak, todayKey } from './lib/checkin';
import { Route, hashForRoute, routeFromHash } from './lib/routing';
import {
  ThemeMode,
  readStoredMode,
  resolveTheme,
  storeMode,
} from './lib/theme';

import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { PlansView } from './components/PlansView';
import { PlanDetailView } from './components/PlanDetailView';
import { DashboardView } from './components/DashboardView';
import { TransactionHistoryView } from './components/TransactionHistoryView';
import { SecurityView } from './components/SecurityView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { SiteFooter } from './components/SiteFooter';
import { SignedOutNotice } from './components/SignedOutNotice';
import { DepositFlow } from './components/DepositFlow';
import { WithdrawalFlow } from './components/WithdrawalFlow';
import { KycVerificationModal } from './components/KycVerificationModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { SupportChatModal } from './components/SupportChatModal';
import { LegalModal } from './components/LegalModal';
import { AuthModal } from './components/AuthModal';

/** Views that require a signed-in investor. */
const PRIVATE_VIEWS: View[] = ['dashboard', 'referrals', 'checkin', 'history', 'security'];

const reference = (prefix: string) => `GF-${prefix}-${Math.floor(1000000 + Math.random() * 9000000)}`;

const auditTimestamp = () => new Date().toISOString().replace('T', ' ').substring(0, 19);

const formatLockRefusal = (daysRemaining: number) =>
  `investment still running for ${daysRemaining} more ${daysRemaining === 1 ? 'day' : 'days'}`;

export default function App() {
  // ---------------------------------------------------------------- theme
  const [themeMode, setThemeMode] = useState<ThemeMode>(readStoredMode);
  /** Bumped when the OS preference flips, so `system` re-resolves live. */
  const [systemTick, setSystemTick] = useState(0);

  const theme = useMemo(() => resolveTheme(themeMode), [themeMode, systemTick]);

  useEffect(() => {
    storeMode(themeMode);
    document.documentElement.classList.toggle('dark', resolveTheme(themeMode) === 'dark');
  }, [themeMode, systemTick]);

  // While on `system`, follow the OS instead of pinning whatever it reported
  // when the page first loaded.
  useEffect(() => {
    if (themeMode !== 'system') return;
    let query: MediaQueryList;
    try {
      query = window.matchMedia('(prefers-color-scheme: dark)');
    } catch {
      return;
    }
    const onChange = () => setSystemTick((tick) => tick + 1);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [themeMode]);

  const handleSetThemeMode = useCallback((mode: ThemeMode) => setThemeMode(mode), []);

  /** Header shortcut: flip to the opposite of what is currently on screen. */
  const handleToggleTheme = useCallback(
    () => setThemeMode(resolveTheme(themeMode) === 'dark' ? 'light' : 'dark'),
    [themeMode]
  );

  // ----------------------------------------------------------- navigation
  /** The page on screen, read from the address so every page can be linked. */
  const [route, setRoute] = useState<Route>(
    () => routeFromHash(window.location.hash) ?? { view: 'home' }
  );
  const currentView = route.view;
  const [isAdmin, setIsAdmin] = useState(false);

  // ------------------------------------------------------------- app data
  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);
  const [plans] = useState<InvestmentPlan[]>(INITIAL_PLANS);
  const [activeInvestments, setActiveInvestments] = useState<ActiveInvestment[]>(INITIAL_ACTIVE_INVESTMENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const [adminDeposits, setAdminDeposits] = useState(INITIAL_ADMIN_DEPOSITS);
  const [adminWithdrawals, setAdminWithdrawals] = useState(INITIAL_ADMIN_WITHDRAWALS);
  const [kycApplications, setKycApplications] = useState(INITIAL_KYC_APPLICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // --------------------------------------------------------------- modals
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [legalModalTopic, setLegalModalTopic] = useState<string | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);
  /** Last dashboard section viewed, so navigating away and back keeps context. */
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('overview');

  /**
   * Opens a page: the address changes, so the browser's back button walks back
   * through the pages visited rather than leaving the site.
   */
  const goTo = useCallback((next: Route) => {
    setRoute(next);
    const hash = hashForRoute(next);
    if (window.location.hash !== hash) window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigate = useCallback((view: View) => goTo({ view }), [goTo]);

  /** Sends the investor to a plan's own page, where its packages are listed. */
  const openPlanPage = useCallback(
    (plan: InvestmentPlan) => goTo({ view: 'plan', planId: plan.id }),
    [goTo]
  );

  /** The plan whose packages page is open, taken from the address. */
  const openPlan = useMemo(
    () => (route.view === 'plan' ? plans.find((plan) => plan.id === route.planId) ?? null : null),
    [plans, route]
  );

  // Back and forward move between pages instead of leaving the site. Addresses
  // that are not pages — the `#main` skip link — are left to the browser.
  useEffect(() => {
    const syncFromAddress = () => {
      const next = routeFromHash(window.location.hash);
      if (next) setRoute(next);
    };
    window.addEventListener('hashchange', syncFromAddress);
    return () => window.removeEventListener('hashchange', syncFromAddress);
  }, []);

  // A first visit with no address of its own still gets one, so going back to
  // it later lands on the page it was opened at.
  useEffect(() => {
    if (!routeFromHash(window.location.hash)) {
      window.history.replaceState(null, '', hashForRoute({ view: 'home' }));
    }
    // Runs once, for the address the app was opened at.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDeposit = useCallback(() => setShowDepositModal(true), []);
  const openWithdraw = useCallback(() => setShowWithdrawModal(true), []);
  const openKyc = useCallback(() => setShowKycModal(true), []);
  const openSupport = useCallback(() => setShowSupportModal(true), []);

  const pushAudit = useCallback((entry: Omit<AuditLog, 'id' | 'timestamp'>) => {
    setAuditLogs((prev) => [
      { id: `log_${Date.now()}`, timestamp: auditTimestamp(), ...entry },
      ...prev,
    ]);
  }, []);

  const pushNotification = useCallback((notif: Omit<AppNotification, 'id' | 'timestamp' | 'timeAgo' | 'read'>) => {
    setNotifications((prev) => [
      { id: `notif_${Date.now()}`, timestamp: Date.now(), timeAgo: 'Just now', read: false, ...notif },
      ...prev,
    ]);
  }, []);

  // --------------------------------------------------- notification state
  const handleMarkNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const handleMarkAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleClearNotifications = useCallback(() => setNotifications([]), []);

  // ------------------------------------------------------------- deposits
  const handleDepositSuccess = useCallback(
    (amount: number, method: PaymentMethodType, phone: string, refCode: string) => {
      if (!user) return;

      setTransactions((prev) => [
        {
          id: `tx_${Date.now()}`,
          type: 'deposit',
          amount,
          fee: 0,
          netAmount: amount,
          status: 'completed',
          method,
          reference: refCode,
          date: 'Just now',
          timestamp: Date.now(),
          destinationOrSource: phone,
          notes: `Mobile deposit authorized via ${method}.`,
        },
        ...prev,
      ]);

      setUser({ ...user, availableBalance: user.availableBalance + amount });

      pushNotification({
        title: 'Deposit successful',
        message: `${amount.toLocaleString()} XAF deposited via ${method} has been credited to your available balance.`,
        type: 'deposit',
        amount,
        reference: refCode,
        targetView: 'dashboard',
      });

      setAdminDeposits((prev) => [
        {
          id: `dp_adm_${Date.now()}`,
          user: user.name,
          amount,
          status: 'APPROVED' as const,
          date: 'Just now',
          method,
        },
        ...prev,
      ]);

      pushAudit({
        actor: user.name,
        action: `Deposit cleared (${amount.toLocaleString()} XAF)`,
        target: `Wallet ${user.id}`,
        ipAddress: '41.202.219.14',
        status: 'SUCCESS',
      });
    },
    [user, pushAudit, pushNotification]
  );

  // ---------------------------------------------------------- withdrawals
  const handleWithdrawSuccess = useCallback(
    (amount: number, fee: number, method: PaymentMethodType, account: string, refCode: string) => {
      if (!user) return;

      setTransactions((prev) => [
        {
          id: `tx_${Date.now()}`,
          type: 'withdrawal',
          amount,
          fee,
          netAmount: Math.max(0, amount - fee),
          status: 'completed',
          method,
          reference: refCode,
          date: 'Just now',
          timestamp: Date.now(),
          destinationOrSource: account,
          notes: `Payout dispatched to verified account ${account}.`,
        },
        ...prev,
      ]);

      setUser({ ...user, availableBalance: user.availableBalance - amount });

      pushNotification({
        title: 'Withdrawal dispatched',
        message: `${amount.toLocaleString()} XAF withdrawal to ${account} via ${method} is processing.`,
        type: 'withdrawal',
        amount,
        reference: refCode,
        targetView: 'history',
      });

      setAdminWithdrawals((prev) => [
        {
          id: `wd_adm_${Date.now()}`,
          user: user.name,
          amount,
          status: 'APPROVED' as const,
          date: 'Just now',
          method,
          account,
        },
        ...prev,
      ]);

      pushAudit({
        actor: user.name,
        action: `Withdrawal dispatched (${amount.toLocaleString()} XAF)`,
        target: `${method} (${account})`,
        ipAddress: '41.202.219.14',
        status: 'SUCCESS',
      });
    },
    [user, pushAudit, pushNotification]
  );

  // ---------------------------------------------------------- investments
  const handleInvestInPlan = useCallback(
    (plan: InvestmentPlan, sub: SubInvestment) => {
      if (!user) return;
      const refCode = reference('IV');
      // A package is fixed on all three sides — the stake, the number of days
      // and the profit are read straight off the catalogue entry, so what the
      // investor was shown before confirming is exactly what gets written here.
      const amount = sub.amount;
      const payout = payoutFor(sub);
      const startDate = new Date();

      const investment: ActiveInvestment = {
        id: `inv_${Date.now()}`,
        planId: plan.id,
        planName: plan.name,
        subInvestmentId: sub.id,
        subInvestmentName: sub.name,
        amountInvested: amount,
        startDate: startDate.toISOString().split('T')[0],
        maturityDate: maturityDateInDays(sub.durationDays, startDate),
        durationDays: sub.durationDays,
        profit: sub.profit,
        maturityValue: payout,
        status: 'active',
      };

      setActiveInvestments((prev) => [investment, ...prev]);

      setTransactions((prev) => [
        {
          id: `tx_${Date.now()}`,
          type: 'investment',
          amount,
          fee: 0,
          netAmount: amount,
          status: 'completed',
          method: 'GrowthFund Wallet',
          reference: refCode,
          date: 'Just now',
          timestamp: Date.now(),
          planName: plan.name,
          subInvestmentName: sub.name,
          notes: `${amount.toLocaleString()} XAF placed in ${sub.name} for ${sub.durationDays} days, paying out ${payout.toLocaleString()} XAF on ${investment.maturityDate}.`,
        },
        ...prev,
      ]);

      setUser({
        ...user,
        availableBalance: user.availableBalance - amount,
        investedBalance: user.investedBalance + amount,
      });

      pushNotification({
        title: 'Investment placed',
        message: `${amount.toLocaleString()} XAF is now in ${sub.name} for ${sub.durationDays} days. You collect ${payout.toLocaleString()} XAF on ${investment.maturityDate}.`,
        type: 'investment',
        amount,
        reference: refCode,
        targetView: 'dashboard',
      });

      pushAudit({
        actor: user.name,
        action: `Invested in ${sub.name} — ${plan.name} (${amount.toLocaleString()} XAF, ${sub.durationDays} days)`,
        target: `Investment #${investment.id}`,
        ipAddress: '41.202.219.14',
        status: 'SUCCESS',
      });

      return refCode;
    },
    [user, pushAudit, pushNotification]
  );

  // ------------------------------------------------------------- payouts
  /**
   * Pay out an investment once its run has finished.
   *
   * The guard is not just presentational: the button is disabled while an
   * investment is still running, but the same check runs here so a stale
   * render or a replayed click cannot release money early.
   */
  const handleRedeemInvestment = useCallback(
    (investmentId: string) => {
      if (!user) return;
      const holding = activeInvestments.find((inv) => inv.id === investmentId);
      if (!holding) return;

      const lock = lockStateFor(holding);
      if (lock.locked) {
        pushAudit({
          actor: user.name,
          action: `Early payout refused — ${formatLockRefusal(lock.daysRemaining)}`,
          target: `Investment #${holding.id}`,
          ipAddress: '41.202.219.14',
          status: 'BLOCKED',
        });
        return;
      }
      if (holding.status === 'liquidated') return;

      const refCode = reference('PO');
      const payout = holding.maturityValue;
      const profit = Math.max(0, payout - holding.amountInvested);

      setActiveInvestments((prev) =>
        prev.map((inv) =>
          inv.id === investmentId
            ? { ...inv, status: 'liquidated' }
            : inv
        )
      );

      setTransactions((prev) => [
        {
          id: `tx_${Date.now()}`,
          type: 'payout',
          amount: payout,
          fee: 0,
          netAmount: payout,
          status: 'completed',
          method: 'GrowthFund Wallet',
          reference: refCode,
          date: 'Just now',
          timestamp: Date.now(),
          planName: holding.planName,
          subInvestmentName: holding.subInvestmentName,
          notes: `Finished its ${holding.durationDays}-day run. Your money and ${profit.toLocaleString()} XAF profit went back into your available balance.`,
        },
        ...prev,
      ]);

      setUser({
        ...user,
        availableBalance: user.availableBalance + payout,
        investedBalance: Math.max(0, user.investedBalance - holding.amountInvested),
        lifetimeEarnings: user.lifetimeEarnings + profit,
      });

      pushNotification({
        title: 'Investment paid out',
        message: `${holding.subInvestmentName ?? holding.planName} finished its ${holding.durationDays}-day run. ${payout.toLocaleString()} XAF (including ${profit.toLocaleString()} XAF profit) is now in your balance.`,
        type: 'maturity',
        amount: payout,
        reference: refCode,
        targetView: 'dashboard',
      });

      pushAudit({
        actor: user.name,
        action: `Collected finished investment (+${payout.toLocaleString()} XAF)`,
        target: `Investment #${holding.id}`,
        ipAddress: '41.202.219.14',
        status: 'SUCCESS',
      });
    },
    [user, activeInvestments, pushAudit, pushNotification]
  );

  // ------------------------------------------------------------ referrals
  const handleReferralSuccess = useCallback(
    (newReferral: ReferralRecord) => {
      if (!user) return;
      const reward = newReferral.giftAmount || REFERRAL_REWARD_XAF;
      const refCode = reference('RF');

      setTransactions((prev) => [
        {
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
          destinationOrSource: `Referral bonus: ${newReferral.name}`,
          notes: `${reward.toLocaleString()} XAF invite reward credited for a friend sign-up (${newReferral.name}).`,
        },
        ...prev,
      ]);

      setUser({
        ...user,
        availableBalance: user.availableBalance + reward,
        referralCount: (user.referralCount ?? 0) + 1,
        referralEarnings: (user.referralEarnings ?? 0) + reward,
        referralList: [newReferral, ...(user.referralList ?? [])],
      });

      pushNotification({
        title: 'Referral reward credited',
        message: `${newReferral.name} registered with your code ${user.referralCode ?? ''}. ${reward.toLocaleString()} XAF has been added to your wallet.`,
        type: 'referral',
        amount: reward,
        reference: refCode,
        targetView: 'referrals',
      });

      pushAudit({
        actor: 'System (referral engine)',
        action: `Referral gift credited (+${reward.toLocaleString()} XAF)`,
        target: `Referee: ${newReferral.name}`,
        ipAddress: '10.0.8.44',
        status: 'SUCCESS',
      });
    },
    [user, pushAudit, pushNotification]
  );

  // ------------------------------------------------------------ check-in
  /**
   * Credit today's daily reward.
   *
   * The once-a-day rule lives in `canCheckIn`, and it is enforced here rather
   * than only on the button, so a stale render or a double click cannot pay
   * the reward twice in one day.
   */
  const handleDailyCheckIn = useCallback(() => {
    if (!user) return;
    if (!canCheckIn(user.lastCheckInDate)) return;

    const refCode = reference('CI');
    const streak = nextStreak(user.lastCheckInDate, user.checkInStreak);

    setUser({
      ...user,
      availableBalance: user.availableBalance + DAILY_CHECKIN_XAF,
      lastCheckInDate: todayKey(),
      checkInStreak: streak,
      checkInEarnings: (user.checkInEarnings ?? 0) + DAILY_CHECKIN_XAF,
    });

    setTransactions((prev) => [
      {
        id: `tx_${Date.now()}`,
        type: 'daily_checkin',
        amount: DAILY_CHECKIN_XAF,
        fee: 0,
        netAmount: DAILY_CHECKIN_XAF,
        status: 'completed',
        method: 'GrowthFund Wallet',
        reference: refCode,
        date: 'Just now',
        timestamp: Date.now(),
        destinationOrSource: 'Daily check-in',
        notes: `Daily check-in reward credited. Day ${streak} in a row.`,
      },
      ...prev,
    ]);

    pushNotification({
      title: 'Check-in collected',
      message: `${DAILY_CHECKIN_XAF} XAF added to your balance. That's ${streak} ${
        streak === 1 ? 'day' : 'days'
      } in a row — come back tomorrow for the next one.`,
      type: 'checkin',
      amount: DAILY_CHECKIN_XAF,
      reference: refCode,
      targetView: 'checkin',
    });

    pushAudit({
      actor: user.name,
      action: `Daily check-in collected (+${DAILY_CHECKIN_XAF} XAF)`,
      target: `Wallet ${user.id}`,
      ipAddress: '41.202.219.14',
      status: 'SUCCESS',
    });
  }, [user, pushAudit, pushNotification]);

  // ------------------------------------------------------------------ kyc
  const handleKycComplete = useCallback((updatedFields: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  }, []);

  // -------------------------------------------------------- admin actions
  const handleApproveDeposit = (id: string) =>
    setAdminDeposits((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'APPROVED' } : d)));
  const handleRejectDeposit = (id: string) =>
    setAdminDeposits((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'REJECTED' } : d)));
  const handleApproveWithdrawal = (id: string) =>
    setAdminWithdrawals((prev) => prev.map((w) => (w.id === id ? { ...w, status: 'APPROVED' } : w)));
  const handleRejectWithdrawal = (id: string) =>
    setAdminWithdrawals((prev) => prev.map((w) => (w.id === id ? { ...w, status: 'REJECTED' } : w)));
  const handleApproveKyc = (id: string) =>
    setKycApplications((prev) => prev.filter((k) => k.id !== id));
  const handleRejectKyc = (id: string) =>
    setKycApplications((prev) => prev.filter((k) => k.id !== id));

  const handleLogout = useCallback(() => {
    setUser(null);
    navigate('home');
  }, [navigate]);

  // A signed-out visitor on a private view gets an explicit prompt rather than
  // the blank screen the old routing produced.
  const needsAuth = !user && PRIVATE_VIEWS.includes(currentView);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-3 focus:left-3 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-emerald focus:text-gold focus:text-sm focus:font-bold"
      >
        Skip to main content
      </a>

      <Navbar
        currentView={currentView}
        onNavigate={navigate}
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin((prev) => !prev)}
        user={user}
        theme={theme}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
        onSetThemeMode={handleSetThemeMode}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onClearNotifications={handleClearNotifications}
        onOpenAuth={setAuthModalMode}
        onOpenDeposit={openDeposit}
        onOpenWithdraw={openWithdraw}
        onLogout={handleLogout}
      />

      <main id="main" className="flex-1 flex flex-col">
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
        ) : needsAuth ? (
          <SignedOutNotice
            onLogin={() => setAuthModalMode('login')}
            onRegister={() => setAuthModalMode('register')}
            onExplorePlans={() => navigate('plans')}
          />
        ) : (
          <>
            {currentView === 'home' && (
              <HomeView
                plans={plans}
                onSelectPlan={openPlanPage}
                onExplorePlans={() => navigate('plans')}
                onOpenDeposit={openDeposit}
                onOpenLegal={setLegalModalTopic}
              />
            )}

            {currentView === 'plans' && (
              <PlansView
                plans={plans}
                user={user}
                onOpenPlan={openPlanPage}
                onOpenDeposit={openDeposit}
                onOpenKyc={openKyc}
              />
            )}

            {/* A plan's own page, listing the packages inside it. Falling back
                to the catalogue keeps the route honest if it is reached
                without a plan selected. */}
            {currentView === 'plan' &&
              (openPlan ? (
                <PlanDetailView
                  plan={openPlan}
                  user={user}
                  onBack={() => navigate('plans')}
                  onInvestInPlan={handleInvestInPlan}
                  onOpenDeposit={openDeposit}
                  onOpenKyc={openKyc}
                  onOpenAuth={() => setAuthModalMode('login')}
                  onViewPortfolio={() => navigate('dashboard')}
                />
              ) : (
                <PlansView
                  plans={plans}
                  user={user}
                  onOpenPlan={openPlanPage}
                  onOpenDeposit={openDeposit}
                  onOpenKyc={openKyc}
                />
              ))}

            {(currentView === 'dashboard' ||
              currentView === 'referrals' ||
              currentView === 'checkin') &&
              user && (
                <DashboardView
                  initialTab={
                    currentView === 'referrals'
                      ? 'invite'
                      : currentView === 'checkin'
                      ? 'checkin'
                      : dashboardTab
                  }
                  onTabChange={setDashboardTab}
                  user={user}
                  activeInvestments={activeInvestments}
                  transactions={transactions}
                  onOpenDeposit={openDeposit}
                  onOpenWithdraw={openWithdraw}
                  onExplorePlans={() => navigate('plans')}
                  onViewHistory={() => navigate('history')}
                  onSelectTransaction={setSelectedTransaction}
                  onReferralSuccess={handleReferralSuccess}
                  onRedeemInvestment={handleRedeemInvestment}
                  onCheckIn={handleDailyCheckIn}
                />
              )}

            {currentView === 'history' && (
              <TransactionHistoryView
                transactions={transactions}
                onSelectTransaction={setSelectedTransaction}
                onOpenDeposit={openDeposit}
                onOpenWithdraw={openWithdraw}
              />
            )}

            {currentView === 'security' && user && (
              <SecurityView
                user={user}
                theme={theme}
                themeMode={themeMode}
                onSetThemeMode={handleSetThemeMode}
                onUpdateSecurity={(settings) => setUser({ ...user, ...settings })}
                onOpenKyc={openKyc}
              />
            )}
          </>
        )}
      </main>

      {!isAdmin && <SiteFooter onOpenLegal={setLegalModalTopic} onNavigate={navigate} />}

      {/* Support launcher — the single entry point to the helpdesk. */}
      <button
        onClick={openSupport}
        className="fixed bottom-5 right-5 z-40 bg-emerald text-gold pl-3.5 pr-4 py-3 rounded-full shadow-lg hover:bg-emerald-2 transition-all flex items-center gap-2 border border-gold/30 hover:scale-105 active:scale-95 print-hide"
        title="Chat with a GrowthFund advisor"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[22px]">support_agent</span>
        <span className="text-xs font-bold hidden sm:inline">Support</span>
      </button>

      {showDepositModal && user && (
        <DepositFlow user={user} onClose={() => setShowDepositModal(false)} onDepositSuccess={handleDepositSuccess} />
      )}

      {showWithdrawModal && user && (
        <WithdrawalFlow
          user={user}
          activeInvestments={activeInvestments}
          onClose={() => setShowWithdrawModal(false)}
          onWithdrawSuccess={handleWithdrawSuccess}
          onOpenKyc={() => {
            setShowWithdrawModal(false);
            setShowKycModal(true);
          }}
        />
      )}

      {showKycModal && user && (
        <KycVerificationModal user={user} onClose={() => setShowKycModal(false)} onKycComplete={handleKycComplete} />
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

      {showSupportModal && <SupportChatModal onClose={() => setShowSupportModal(false)} />}

      {legalModalTopic && <LegalModal initialTopic={legalModalTopic} onClose={() => setLegalModalTopic(null)} />}

      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onAuthSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setAuthModalMode(null);
            navigate('dashboard');
          }}
        />
      )}
    </div>
  );
}
