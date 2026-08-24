import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { UserProfile, ActiveInvestment, Transaction, ReferralRecord, DashboardTab } from '../types';
import { ReferralProgram, referralLinkFor } from './ReferralProgram';
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

const currency = (value: number) => `${value.toLocaleString()} XAF`;

const buildTabs = (holdings: number, activity: number, referrals: number): TabItem<DashboardTab>[] => [
  { id: 'overview', label: 'Overview', icon: 'donut_large' },
  { id: 'holdings', label: 'Holdings', icon: 'inventory_2', badge: holdings },
  { id: 'activity', label: 'Activity', icon: 'receipt_long', badge: activity },
  { id: 'invite', label: 'Invite & earn', icon: 'card_giftcard', badge: referrals },
];

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

  /** Allocation computed from real holdings rather than a hard-coded 80/20 split. */
  const allocation = useMemo(() => {
    const byPlan = new Map<string, number>();
    for (const inv of activeInvestments) {
      byPlan.set(inv.planName, (byPlan.get(inv.planName) ?? 0) + inv.amountInvested);
    }
    const total = [...byPlan.values()].reduce((sum, value) => sum + value, 0);
    if (total === 0) return [];
    return [...byPlan.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount], index) => ({
        name,
        amount,
        percent: (amount / total) * 100,
        color: SECTOR_COLORS[index % SECTOR_COLORS.length],
      }));
  }, [activeInvestments]);

  const recentTransactions = transactions.slice(0, 5);

  const TABS = useMemo(
    () => buildTabs(activeInvestments.length, transactions.length, user.referralList?.length ?? 0),
    [activeInvestments.length, transactions.length, user.referralList?.length]
  );

  const stats = [
    {
      label: 'Total portfolio value',
      value: currency(totalNetWorth),
      caption: 'Available cash plus invested capital',
      icon: 'account_balance_wallet',
      accent: 'text-accent',
      chip: 'bg-accent-bg text-accent',
      featured: true,
    },
    {
      label: 'Available liquidity',
      value: currency(user.availableBalance),
      caption: 'Ready to withdraw or allocate',
      icon: 'payments',
      accent: 'text-ink',
      chip: 'bg-surface-2 text-ink-2',
    },
    {
      label: 'Capital invested',
      value: currency(user.investedBalance),
      caption: `${activeInvestments.length} active ${activeInvestments.length === 1 ? 'holding' : 'holdings'}`,
      icon: 'domain',
      accent: 'text-gold-ink',
      chip: 'bg-gold/25 text-gold-ink',
    },
    {
      label: 'Lifetime net yield',
      value: `+${currency(user.lifetimeEarnings)}`,
      caption: 'Realised dividends credited',
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
                  Tier {user.kycTier} verified
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
        <ReferralProgram user={user} onReferralSuccess={onReferralSuccess} showBanner showDemoControls />

        <TopReferrersLeaderboard
          currentUser={user}
          onInviteFriend={() => navigator.clipboard?.writeText(referralLinkFor(user)).catch(() => {})}
          onSimulateSignup={() =>
            onReferralSuccess({
              id: `ref_${Date.now()}`,
              name: 'Demo invitee',
              phoneOrEmail: 'demo@growthfund.africa',
              joinedDate: 'Today, just now',
              status: 'rewarded',
              giftAmount: 1000,
            })
          }
        />

        </div>
        )}

        {tab === 'overview' && (
        <div {...tabPanelProps('overview')} className="grid grid-cols-1 lg:grid-cols-12 gap-5 outline-none">
          <section className="lg:col-span-8 bg-surface p-5 sm:p-6 rounded-2xl border border-line shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-line-2">
              <div>
                <h2 className="text-base font-extrabold text-ink">Capital growth</h2>
                <p className="text-xs text-ink-3">Invested balance and accrued yield over time</p>
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
                <span className="font-medium text-gold-ink">Yield +{currency(user.lifetimeEarnings)}</span>
              </span>
            </div>
          </section>

          <section className="lg:col-span-4 bg-surface p-5 sm:p-6 rounded-2xl border border-line shadow-sm flex flex-col">
            <h2 className="text-base font-bold text-ink">Asset allocation</h2>
            <p className="text-xs text-ink-3 mb-4">Split of your active capital</p>

            {allocation.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <span aria-hidden="true" className="material-symbols-outlined text-3xl text-ink-3">donut_large</span>
                <p className="text-xs font-bold text-ink mt-2">Nothing invested yet</p>
                <button onClick={onExplorePlans} className="text-xs font-bold text-accent hover:underline mt-1">
                  Browse investment plans
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
                      <span className="font-mono text-ink-2 shrink-0">{slice.percent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-[width] duration-500"
                        style={{ width: `${slice.percent}%`, backgroundColor: slice.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tier-based withdrawal ceiling — a COSUMAF compliance figure the
                investor needs alongside their allocation. */}
            <div className="mt-5 pt-4 border-t border-line-2">
              <div className="bg-surface-2 border border-line-2 p-3.5 rounded-xl">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-ink">Daily liquidity cap</span>
                  <span className="font-mono font-bold text-accent">10,000,000 XAF</span>
                </div>
                <p className="text-[11px] text-ink-3 mt-1">
                  Tier {user.kycTier} verified account limit under COSUMAF guidelines.
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
              <h2 className="text-lg font-bold text-ink">Active holdings</h2>
              <p className="text-xs text-ink-3">Instruments currently compounding</p>
            </div>
            <button
              onClick={onExplorePlans}
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">add</span> Add investment
            </button>
          </div>

          {activeInvestments.length === 0 ? (
            <div className="p-12 text-center">
              <span aria-hidden="true" className="material-symbols-outlined text-3xl text-ink-3">inventory_2</span>
              <p className="text-sm font-bold text-ink mt-2">No active holdings</p>
              <p className="text-xs text-ink-3 mt-1">Allocate capital to a plan to start earning.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-2 border-b border-line-2 text-[11px] font-bold uppercase tracking-wider text-ink-3">
                    <th scope="col" className="p-4">Fund</th>
                    <th scope="col" className="p-4">Invested</th>
                    <th scope="col" className="p-4">Yield</th>
                    <th scope="col" className="p-4">Accrued</th>
                    <th scope="col" className="p-4">Valuation</th>
                    <th scope="col" className="p-4">Matures</th>
                    <th scope="col" className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-2 text-xs">
                  {activeInvestments.map((inv) => (
                    <tr key={inv.id} className="hover:bg-surface-2 transition-colors">
                      <td className="p-4 font-bold text-ink whitespace-nowrap">{inv.planName}</td>
                      <td className="p-4 font-mono text-ink">{currency(inv.amountInvested)}</td>
                      <td className="p-4 font-bold text-accent whitespace-nowrap">+{inv.projectedReturn}% / yr</td>
                      <td className="p-4 font-mono font-bold text-pos">+{currency(inv.accruedEarnings)}</td>
                      <td className="p-4 font-mono font-bold text-ink">{currency(inv.currentValuation)}</td>
                      <td className="p-4 text-ink-3 whitespace-nowrap">{inv.maturityDate}</td>
                      <td className="p-4 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inv.status === 'active' ? 'bg-pos-bg text-on-pos-bg' : 'bg-gold text-on-gold'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        )}

        {tab === 'activity' && (
        <section {...tabPanelProps('activity')} className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden outline-none">
          <div className="p-5 sm:p-6 border-b border-line-2 flex justify-between items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-ink">Recent activity</h2>
              <p className="text-xs text-ink-3">Select any entry to open its receipt</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {recentTransactions.length > 0 && (
                <button
                  onClick={() => onSelectTransaction(recentTransactions[0])}
                  className="text-xs font-bold text-accent hover:underline"
                >
                  Latest receipt
                </button>
              )}
              <button onClick={onViewHistory} className="text-xs font-bold text-accent hover:underline">
                View all
              </button>
            </div>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <span aria-hidden="true" className="material-symbols-outlined text-3xl text-ink-3">receipt_long</span>
              <p className="text-sm font-bold text-ink mt-2">No transactions yet</p>
              <p className="text-xs text-ink-3 mt-1">Your deposits and returns will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-line-2">
              {recentTransactions.map((tx) => {
                const isCredit = tx.type === 'deposit' || tx.type === 'dividend' || tx.type === 'referral_gift';
                return (
                  <button
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-surface-2 transition-colors"
                  >
                    <span className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          tx.type === 'withdrawal' ? 'bg-neg-bg text-neg' : isCredit ? 'bg-pos-bg text-on-pos-bg' : 'bg-surface-3 text-ink-2'
                        }`}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                          {tx.type === 'deposit'
                            ? 'arrow_downward'
                            : tx.type === 'withdrawal'
                            ? 'arrow_upward'
                            : tx.type === 'dividend'
                            ? 'payments'
                            : tx.type === 'referral_gift'
                            ? 'redeem'
                            : 'show_chart'}
                        </span>
                      </span>

                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-ink truncate">
                          {tx.type === 'referral_gift'
                            ? 'Referral gift'
                            : `${tx.method} ${tx.type.replace('_', ' ')}`}
                        </span>
                        <span className="flex items-center gap-2 mt-0.5 text-[11px] text-ink-3">
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${
                              tx.status === 'completed'
                                ? 'bg-pos-bg text-on-pos-bg'
                                : tx.status === 'processing' || tx.status === 'pending'
                                ? 'bg-gold text-on-gold'
                                : 'bg-neg-bg text-neg'
                            }`}
                          >
                            {tx.status}
                          </span>
                          <span className="truncate">{tx.date}</span>
                        </span>
                      </span>
                    </span>

                    <span className="text-right shrink-0">
                      <span className={`text-sm font-bold font-mono block ${isCredit ? 'text-pos' : 'text-ink'}`}>
                        {isCredit ? '+' : '−'}
                        {tx.amount.toLocaleString()} XAF
                      </span>
                      <span className="text-[10px] text-ink-3 font-mono">{tx.reference}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>
        )}
      </div>
    </div>
  );
};
