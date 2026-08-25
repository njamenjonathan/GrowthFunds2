import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { UserProfile, ActiveInvestment, Transaction, ReferralRecord, DashboardTab } from '../types';
import { formatRemaining, lockStateFor } from '../lib/commitment';
import { STATUS_CHIP, currency } from '../lib/transactions';
import { canCheckIn } from '../lib/checkin';
import { CheckInPanel } from './CheckInPanel';
import { ReferralProgram } from './ReferralProgram';
import { TopReferrersLeaderboard } from './TopReferrersLeaderboard';
import { Tabs, TabItem, tabPanelProps } from './Tabs';

const PortfolioChart = lazy(() => import('./PortfolioChart'));

interface DashboardViewProps {
  user: UserProfile;
  activeInvestments: ActiveInvestment[];
  transactions: Transaction[];
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onExplorePlans: () => void;
  onViewHistory: () => void;
  onSelectTransaction: (tx: Transaction) => void;
  onReferralSuccess: (referral: ReferralRecord) => void;
  /** Pays out an investment that has finished its run. */
  onRedeemInvestment: (investmentId: string) => void;
  /** Credits today's daily check-in reward. */
  onCheckIn: () => void;
  /** Section to open on mount — lets the nav and notifications deep-link in. */
  initialTab?: DashboardTab;
  /** Reports the active section so it survives navigating away and back. */
  onTabChange?: (tab: DashboardTab) => void;
}

type ChartRange = '6M' | '1Y' | 'ALL';

/** How many monthly points each range shows. */
const RANGE_MONTHS: Record<ChartRange, number> = { '6M': 6, '1Y': 12, ALL: 24 };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sector colours, keyed off the plan a holding belongs to. */
const SECTOR_COLORS = ['var(--gf-accent)', 'var(--gf-gold-3)', 'var(--gf-info)', 'var(--gf-pos)'];

const buildTabs = (
  holdings: number,
  checkInReady: boolean,
  deposits: number,
  withdrawals: number,
  referrals: number
): TabItem<DashboardTab>[] => [
  { id: 'overview', label: 'Overview', icon: 'donut_large' },
  { id: 'holdings', label: 'Investments', icon: 'inventory_2', badge: holdings },
  // The badge is the nudge: a 1 sits on the tab until the day is collected.
  { id: 'checkin', label: 'CheckIn', icon: 'calendar_month', badge: checkInReady ? 1 : 0 },
  { id: 'deposits', label: 'Deposits', icon: 'arrow_downward', badge: deposits },
  { id: 'withdrawals', label: 'Withdrawals', icon: 'arrow_upward', badge: withdrawals },
  { id: 'invite', label: 'Invite & earn', icon: 'card_giftcard', badge: referrals },
];

/** Wording and colours that separate the two money-movement panels. */
const MOVEMENT_COPY = {
  deposits: {
    title: 'Deposits',
    subtitle: 'Every top-up into your GrowthFund wallet',
    icon: 'arrow_downward',
    actionLabel: 'New deposit',
    actionIcon: 'add_circle',
    totalLabel: 'Total deposited',
    emptyTitle: 'No deposits yet',
    emptyBody: 'Fund your wallet to start allocating capital.',
    accent: 'bg-pos-bg text-on-pos-bg',
    amountClass: 'text-pos',
    sign: '+',
  },
  withdrawals: {
    title: 'Withdrawals',
    subtitle: 'Every payout sent to your verified accounts',
    icon: 'arrow_upward',
    actionLabel: 'New withdrawal',
    actionIcon: 'outbox',
    totalLabel: 'Total withdrawn',
    emptyTitle: 'No withdrawals yet',
    emptyBody: 'Cash out to mobile money or your bank whenever you need to.',
    accent: 'bg-neg-bg text-neg',
    amountClass: 'text-ink',
    sign: '\u2212',
  },
} as const;

interface MovementPanelProps {
  kind: 'deposits' | 'withdrawals';
  entries: Transaction[];
  onAction: () => void;
  onSelectTransaction: (tx: Transaction) => void;
  onViewHistory: () => void;
}

/**
 * Deposits and withdrawals read the same way — a settled total, what is still
 * in flight, and the receipts behind both — so they share one panel rather
 * than two near-identical copies.
 */
const MovementPanel: React.FC<MovementPanelProps> = ({
  kind,
  entries,
  onAction,
  onSelectTransaction,
  onViewHistory,
}) => {
  const copy = MOVEMENT_COPY[kind];

  const settled = entries.filter((tx) => tx.status === 'completed');
  const inFlight = entries.filter((tx) => tx.status === 'processing' || tx.status === 'pending');
  const settledTotal = settled.reduce((sum, tx) => sum + tx.amount, 0);
  const inFlightTotal = inFlight.reduce((sum, tx) => sum + tx.amount, 0);
  const feesTotal = settled.reduce((sum, tx) => sum + tx.fee, 0);

  const summary = [
    { label: copy.totalLabel, value: currency(settledTotal), caption: `${settled.length} settled` },
    { label: 'Awaiting settlement', value: currency(inFlightTotal), caption: `${inFlight.length} in progress` },
    { label: 'Fees charged', value: currency(feesTotal), caption: 'Deducted at settlement' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summary.map((item) => (
          <div key={item.label} className="bg-surface p-5 rounded-2xl border border-line shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-3">{item.label}</p>
            <p className="text-lg xl:text-xl font-extrabold font-mono text-ink mt-1.5">{item.value}</p>
            <p className="text-[11px] text-ink-3 mt-1">{item.caption}</p>
          </div>
        ))}
      </div>

      <section className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-line-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${copy.accent}`}>
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">{copy.icon}</span>
            </span>
            <div>
              <h2 className="text-lg font-bold text-ink">{copy.title}</h2>
              <p className="text-xs text-ink-3">{copy.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onAction}
              className="flex-1 sm:flex-initial bg-emerald text-on-emerald text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-emerald-2 transition-colors flex items-center justify-center gap-1.5"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">{copy.actionIcon}</span>
              {copy.actionLabel}
            </button>
            <button onClick={onViewHistory} className="text-xs font-bold text-accent hover:underline shrink-0">
              Full ledger
            </button>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="p-12 text-center">
            <span aria-hidden="true" className="material-symbols-outlined text-3xl text-ink-3">{copy.icon}</span>
            <p className="text-sm font-bold text-ink mt-2">{copy.emptyTitle}</p>
            <p className="text-xs text-ink-3 mt-1">{copy.emptyBody}</p>
            <button onClick={onAction} className="text-xs font-bold text-accent hover:underline mt-3">
              {copy.actionLabel}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-2 border-b border-line-2 text-[11px] font-bold uppercase tracking-wider text-ink-3">
                  <th scope="col" className="p-4">Date</th>
                  <th scope="col" className="p-4">Method</th>
                  <th scope="col" className="p-4">{kind === 'deposits' ? 'Source' : 'Destination'}</th>
                  <th scope="col" className="p-4">Amount</th>
                  <th scope="col" className="p-4">Fee</th>
                  <th scope="col" className="p-4">Net</th>
                  <th scope="col" className="p-4">Status</th>
                  <th scope="col" className="p-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-2 text-xs">
                {entries.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-2 transition-colors">
                    <td className="p-4 text-ink-2 whitespace-nowrap">{tx.date}</td>
                    <td className="p-4 font-bold text-ink whitespace-nowrap">{tx.method}</td>
                    <td className="p-4 text-ink-2 max-w-[220px] truncate">{tx.destinationOrSource ?? '—'}</td>
                    <td className={`p-4 font-mono font-bold whitespace-nowrap ${copy.amountClass}`}>
                      {copy.sign}
                      {tx.amount.toLocaleString()} XAF
                    </td>
                    <td className="p-4 font-mono text-ink-3 whitespace-nowrap">{tx.fee.toLocaleString()}</td>
                    <td className="p-4 font-mono text-ink whitespace-nowrap">{tx.netAmount.toLocaleString()}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          STATUS_CHIP[tx.status]
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onSelectTransaction(tx)}
                        className="text-xs font-bold text-accent hover:underline whitespace-nowrap"
                      >
                        {tx.reference}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  activeInvestments,
  transactions,
  onOpenDeposit,
  onOpenWithdraw,
  onExplorePlans,
  onViewHistory,
  onSelectTransaction,
  onReferralSuccess,
  onRedeemInvestment,
  onCheckIn,
  initialTab = 'overview',
  onTabChange,
}) => {
  const [range, setRange] = useState<ChartRange>('6M');
  const [tab, setTab] = useState<DashboardTab>(initialTab);

  // Follow deep links that arrive while the dashboard is already mounted, e.g.
  // tapping "Invite & earn" in the nav or opening a referral notification.
  // Reporting it upward too means arriving that way counts as choosing the
  // section, so navigating away and back returns to it.
  useEffect(() => {
    setTab(initialTab);
    onTabChange?.(initialTab);
    // Only react to a new deep-link target, not to callback identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTab]);

  const totalNetWorth = user.availableBalance + user.investedBalance;

  /**
   * Back-cast the current invested balance over the selected window. Real data
   * would come from the ledger; this at least tracks the range the user picked
   * instead of ignoring it, which is what the old fixed six-point series did.
   */
  const chartData = useMemo(() => {
    const points = RANGE_MONTHS[range];
    const now = new Date();
    return Array.from({ length: points }, (_, index) => {
      const monthsAgo = points - 1 - index;
      const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
      const progress = (index + 1) / points;
      // Ease-in curve so growth compounds toward the present rather than being linear.
      const factor = progress ** 1.6;
      return {
        month: `${MONTHS[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`,
        invested: Math.round(user.investedBalance * factor),
        yield: Math.round(user.lifetimeEarnings * factor),
      };
    });
  }, [range, user.investedBalance, user.lifetimeEarnings]);

  /**
   * Where the invested money sits, by plan. The bar is drawn from each plan's
   * share of the total, but the figure printed next to it is the amount in
   * XAF — the number an investor can act on.
   */
  const allocation = useMemo(() => {
    const byPlan = new Map<string, number>();
    for (const inv of activeInvestments) {
      if (inv.status === 'liquidated') continue;
      byPlan.set(inv.planName, (byPlan.get(inv.planName) ?? 0) + inv.amountInvested);
    }
    const total = [...byPlan.values()].reduce((sum, value) => sum + value, 0);
    if (total === 0) return [];
    return [...byPlan.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount], index) => ({
        name,
        amount,
        share: (amount / total) * 100,
        color: SECTOR_COLORS[index % SECTOR_COLORS.length],
      }));
  }, [activeInvestments]);

  const runningCount = activeInvestments.filter((inv) => inv.status !== 'liquidated').length;

  /** What is still running, what is ready to collect, and when the next one is. */
  const lockSummary = useMemo(() => {
    const held = activeInvestments.filter((inv) => inv.status !== 'liquidated');
    const states = held.map((inv) => ({ inv, lock: lockStateFor(inv) }));
    const stillLocked = states.filter(({ lock }) => lock.locked);
    return {
      lockedTotal: stillLocked.reduce((sum, { inv }) => sum + inv.amountInvested, 0),
      redeemableTotal: states
        .filter(({ lock }) => !lock.locked)
        .reduce((sum, { inv }) => sum + inv.maturityValue, 0),
      nextUnlock: stillLocked.length
        ? Math.min(...stillLocked.map(({ lock }) => lock.daysRemaining))
        : null,
    };
  }, [activeInvestments]);

  const deposits = useMemo(() => transactions.filter((tx) => tx.type === 'deposit'), [transactions]);
  const withdrawals = useMemo(() => transactions.filter((tx) => tx.type === 'withdrawal'), [transactions]);

  const TABS = useMemo(
    () =>
      buildTabs(
        activeInvestments.filter((inv) => inv.status !== 'liquidated').length,
        canCheckIn(user.lastCheckInDate),
        deposits.length,
        withdrawals.length,
        user.referralList?.length ?? 0
      ),
    [
      activeInvestments,
      user.lastCheckInDate,
      deposits.length,
      withdrawals.length,
      user.referralList?.length,
    ]
  );

  const stats = [
    {
      label: 'Total money',
      value: currency(totalNetWorth),
      caption: 'Your balance plus everything invested',
      icon: 'account_balance_wallet',
      accent: 'text-accent',
      chip: 'bg-accent-bg text-accent',
      featured: true,
    },
    {
      label: 'Available balance',
      value: currency(user.availableBalance),
      caption: 'Ready to withdraw or invest',
      icon: 'payments',
      accent: 'text-ink',
      chip: 'bg-surface-2 text-ink-2',
    },
    {
      label: 'Currently invested',
      value: currency(user.investedBalance),
      caption:
        lockSummary.nextUnlock != null
          ? `Next payout in ${formatRemaining(lockSummary.nextUnlock)}`
          : `${runningCount} ${runningCount === 1 ? 'investment' : 'investments'} running`,
      icon: 'domain',
      accent: 'text-gold-ink',
      chip: 'bg-gold/25 text-gold-ink',
    },
    {
      label: 'Profit earned',
      value: `+${currency(user.lifetimeEarnings)}`,
      caption: 'Paid into your balance so far',
      icon: 'savings',
      accent: 'text-pos',
      chip: 'bg-pos-bg text-on-pos-bg',
    },
  ];

  return (
    <div className="flex-1 p-4 md:p-10 bg-canvas relative">
      <div className="absolute inset-0 opacity-40 pointer-events-none pattern-bg" aria-hidden="true"></div>

      <div className="max-w-[1200px] mx-auto w-full relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-5 sm:p-6 rounded-2xl border border-line shadow-sm">
          <div className="flex items-center gap-4">
            <img src={user.avatarUrl} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-ink">{user.name}</h1>
                <span className="bg-pos-bg text-on-pos-bg text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span aria-hidden="true" className="material-symbols-outlined text-[13px]">verified</span>
                  Verified
                </span>
              </div>
              <p className="text-xs text-ink-3 mt-1 flex flex-wrap items-center gap-x-2">
                <span>{user.phone}</span>
                <span aria-hidden="true">•</span>
                <span>{user.country}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenDeposit}
              className="flex-1 sm:flex-initial bg-emerald text-on-emerald text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-emerald-2 transition-colors flex items-center justify-center gap-1.5"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">add_circle</span>
              Deposit
            </button>
            <button
              onClick={onOpenWithdraw}
              className="flex-1 sm:flex-initial bg-surface border border-line text-ink text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-surface-2 transition-colors flex items-center justify-center gap-1.5"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">outbox</span>
              Withdraw
            </button>
            <button
              onClick={onExplorePlans}
              className="hidden lg:flex bg-gold text-on-gold text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-gold-2 transition-colors items-center gap-1.5"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">trending_up</span>
              Invest
            </button>
          </div>
        </div>

        {/* Key figures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-surface p-5 rounded-2xl border shadow-sm flex flex-col gap-3 ${
                stat.featured ? 'border-accent/40' : 'border-line'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-3">{stat.label}</span>
                <span className={`p-1.5 rounded-lg ${stat.chip}`}>
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">{stat.icon}</span>
                </span>
              </div>
              <div>
                <p className={`text-xl xl:text-2xl font-extrabold font-mono ${stat.accent}`}>{stat.value}</p>
                <p className="text-[11px] text-ink-3 mt-1">{stat.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sections — one at a time, so the page shows a single subject rather
            than every subject stacked on top of each other. */}
        <Tabs
          tabs={TABS}
          active={tab}
          onChange={(next) => {
            setTab(next);
            onTabChange?.(next);
          }}
          label="Dashboard sections"
        />

        {tab === 'invite' && (
        <div {...tabPanelProps('invite')} className="space-y-5 outline-none">
          {/* One invite surface and one demo control for the whole tab: the
              referral card owns copying the code, sharing it and simulating a
              sign-up, and the leaderboard points back at it rather than
              carrying its own second copy of both. */}
          <div id="referral-programme">
            <ReferralProgram user={user} onReferralSuccess={onReferralSuccess} showBanner showDemoControls />
          </div>

          <TopReferrersLeaderboard
            currentUser={user}
            onInviteFriend={() =>
              document.getElementById('referral-programme')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          />
        </div>
        )}

        {tab === 'overview' && (
        <div {...tabPanelProps('overview')} className="grid grid-cols-1 lg:grid-cols-12 gap-5 outline-none">
          <section className="lg:col-span-8 bg-surface p-5 sm:p-6 rounded-2xl border border-line shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-line-2">
              <div>
                <h2 className="text-base font-extrabold text-ink">Money growth</h2>
                <p className="text-xs text-ink-3">What you have invested, and the profit it has paid</p>
              </div>
              <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-xl text-[11px] font-bold">
                {(Object.keys(RANGE_MONTHS) as ChartRange[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setRange(option)}
                    aria-pressed={range === option}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      range === option ? 'bg-emerald text-gold' : 'text-ink-3 hover:text-ink'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full">
              <Suspense
                fallback={
                  <div className="h-full w-full rounded-xl bg-surface-2 animate-pulse" aria-label="Loading chart" />
                }
              >
                <PortfolioChart data={chartData} />
              </Suspense>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
                <span className="font-bold text-ink">Invested {currency(user.investedBalance)}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-3"></span>
                <span className="font-medium text-gold-ink">Profit +{currency(user.lifetimeEarnings)}</span>
              </span>
            </div>
          </section>

          <section className="lg:col-span-4 bg-surface p-5 sm:p-6 rounded-2xl border border-line shadow-sm flex flex-col">
            <h2 className="text-base font-bold text-ink">Where your money is</h2>
            <p className="text-xs text-ink-3 mb-4">Split across the areas you invested in</p>

            {allocation.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <span aria-hidden="true" className="material-symbols-outlined text-3xl text-ink-3">donut_large</span>
                <p className="text-xs font-bold text-ink mt-2">Nothing invested yet</p>
                <button onClick={onExplorePlans} className="text-xs font-bold text-accent hover:underline mt-1">
                  Browse the packages
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 flex-1">
                {allocation.map((slice) => (
                  <div key={slice.name}>
                    <div className="flex justify-between items-baseline text-xs font-semibold mb-1.5 gap-2">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: slice.color }}
                        ></span>
                        <span className="truncate text-ink">{slice.name}</span>
                      </span>
                      <span className="font-mono text-ink-2 shrink-0">{currency(slice.amount)}</span>
                    </div>
                    <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-[width] duration-500"
                        style={{ width: `${slice.share}%`, backgroundColor: slice.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-line-2">
              <div className="bg-surface-2 border border-line-2 p-3.5 rounded-xl">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-ink">Ready to collect</span>
                  <span className="font-mono font-bold text-pos">{currency(lockSummary.redeemableTotal)}</span>
                </div>
                <p className="text-[11px] text-ink-3 mt-1">
                  {lockSummary.redeemableTotal > 0
                    ? 'Collect it from the Investments tab to move it into your balance.'
                    : lockSummary.nextUnlock != null
                    ? `Nothing yet — the next one finishes in ${formatRemaining(lockSummary.nextUnlock)}.`
                    : 'Nothing running right now.'}
                </p>
              </div>
            </div>
          </section>
        </div>
        )}

        {tab === 'holdings' && (
        <section {...tabPanelProps('holdings')} className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden outline-none">
          <div className="p-5 sm:p-6 border-b border-line-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-lg font-bold text-ink">My investments</h2>
              <p className="text-xs text-ink-3">
                {lockSummary.lockedTotal > 0
                  ? `${currency(lockSummary.lockedTotal)} still running${
                      lockSummary.nextUnlock != null
                        ? ` • next one finishes in ${formatRemaining(lockSummary.nextUnlock)}`
                        : ''
                    }`
                  : 'Nothing is running — everything has been collected'}
              </p>
            </div>
            <button
              onClick={onExplorePlans}
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">add</span> New investment
            </button>
          </div>

          {lockSummary.redeemableTotal > 0 && (
            <div className="px-5 sm:px-6 py-3 bg-pos-bg border-b border-pos/25 flex items-center gap-2.5 text-xs">
              <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-on-pos-bg">lock_open</span>
              <p className="text-on-pos-bg">
                <strong>{currency(lockSummary.redeemableTotal)}</strong> has finished. Collect it to move your money
                and its profit into your available balance.
              </p>
            </div>
          )}

          {activeInvestments.length === 0 ? (
            <div className="p-12 text-center">
              <span aria-hidden="true" className="material-symbols-outlined text-3xl text-ink-3">inventory_2</span>
              <p className="text-sm font-bold text-ink mt-2">Nothing invested yet</p>
              <p className="text-xs text-ink-3 mt-1">Pick a package to start earning.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-2 border-b border-line-2 text-[11px] font-bold uppercase tracking-wider text-ink-3">
                    <th scope="col" className="p-4">Package</th>
                    <th scope="col" className="p-4">You put in</th>
                    <th scope="col" className="p-4">Time left</th>
                    <th scope="col" className="p-4">You collect</th>
                    <th scope="col" className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-2 text-xs">
                  {activeInvestments.map((inv) => {
                    const lock = lockStateFor(inv);
                    const released = inv.status === 'liquidated';
                    return (
                      <tr key={inv.id} className="hover:bg-surface-2 transition-colors">
                        <td className="p-4 whitespace-nowrap">
                          <span className="block font-bold text-ink">{inv.subInvestmentName ?? inv.planName}</span>
                          <span className="block text-[11px] text-ink-3">{inv.planName}</span>
                        </td>
                        <td className="p-4 font-mono text-ink">{currency(inv.amountInvested)}</td>

                        <td className="p-4 min-w-[190px]">
                          {released ? (
                            <span className="text-[11px] text-ink-3">Collected</span>
                          ) : (
                            <>
                              <span className="flex items-center justify-between gap-2 text-[11px] mb-1.5">
                                <span className={`font-bold ${lock.locked ? 'text-gold-ink' : 'text-pos'}`}>
                                  {lock.locked ? `${formatRemaining(lock.daysRemaining)} left` : 'Ready to collect'}
                                </span>
                                <span className="text-ink-3 font-mono">{inv.durationDays}d</span>
                              </span>
                              <span className="block w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
                                <span
                                  className={`block h-full rounded-full ${lock.locked ? 'bg-gold-3' : 'bg-pos'}`}
                                  style={{ width: `${Math.max(3, lock.progressPercent)}%` }}
                                ></span>
                              </span>
                              <span className="block text-[10px] text-ink-3 mt-1">Finishes {inv.maturityDate}</span>
                            </>
                          )}
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <span className="block font-mono font-bold text-ink">{currency(inv.maturityValue)}</span>
                          <span className="block text-[11px] font-mono text-pos">
                            +{currency(inv.maturityValue - inv.amountInvested)} profit
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          {released ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-surface-3 text-ink-2">
                              collected
                            </span>
                          ) : lock.locked ? (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase bg-gold text-on-gold"
                              title={`Available on ${inv.maturityDate}`}
                            >
                              <span aria-hidden="true" className="material-symbols-outlined text-[13px]">schedule</span>
                              Running
                            </span>
                          ) : (
                            <button
                              onClick={() => onRedeemInvestment(inv.id)}
                              className="inline-flex items-center gap-1.5 bg-emerald text-on-emerald text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-2 transition-colors"
                            >
                              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">savings</span>
                              Collect
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
        )}

        {tab === 'checkin' && (
          <div {...tabPanelProps('checkin')} className="outline-none">
            <CheckInPanel user={user} onCheckIn={onCheckIn} />
          </div>
        )}

        {tab === 'deposits' && (
          <div {...tabPanelProps('deposits')} className="outline-none">
            <MovementPanel
              kind="deposits"
              entries={deposits}
              onAction={onOpenDeposit}
              onSelectTransaction={onSelectTransaction}
              onViewHistory={onViewHistory}
            />
          </div>
        )}

        {tab === 'withdrawals' && (
          <div {...tabPanelProps('withdrawals')} className="outline-none">
            <MovementPanel
              kind="withdrawals"
              entries={withdrawals}
              onAction={onOpenWithdraw}
              onSelectTransaction={onSelectTransaction}
              onViewHistory={onViewHistory}
            />
          </div>
        )}

      </div>
    </div>
  );
};
