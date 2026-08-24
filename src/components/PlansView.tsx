import { InvestmentPlan, UserProfile } from '../types';
import { MIN_INVESTMENT_XAF } from '../lib/constants';
import { MAX_TERM_DAYS, payoutFor } from '../lib/commitment';
import { currency } from '../lib/transactions';

interface PlansViewProps {
  plans: InvestmentPlan[];
  user: UserProfile | null;
  /** Opens the plan's own page, where the packages inside it are chosen. */
  onOpenPlan: (plan: InvestmentPlan) => void;
  onOpenDeposit: () => void;
  onOpenKyc: () => void;
}

/**
 * The catalogue: one card per plan, nothing else.
 *
 * Picking a plan here is a navigation, not a dialog — the packages inside it
 * live on the plan's own page, so choosing what to invest in is two taps:
 * the plan, then the package.
 */
export const PlansView: React.FC<PlansViewProps> = ({
  plans,
  user,
  onOpenPlan,
  onOpenDeposit,
  onOpenKyc,
}) => (
  <div className="flex-1 p-4 md:p-10 bg-canvas relative">
    <div className="absolute inset-0 opacity-40 pointer-events-none pattern-bg" aria-hidden="true"></div>

    <div className="max-w-[1200px] mx-auto w-full relative z-10">
      <header className="mb-7">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink mb-2 tracking-tight font-display">
          Where do you want to invest?
        </h1>
        <p className="text-sm text-ink-2 max-w-2xl leading-relaxed">
          Pick an area, then pick a package inside it. Every package tells you exactly what you put in, how many
          days it runs, and what you collect at the end. Investments start at{' '}
          <strong className="text-pos font-mono">{currency(MIN_INVESTMENT_XAF)}</strong> and never run longer than{' '}
          <strong className="text-ink">{MAX_TERM_DAYS} days</strong>.
        </p>
      </header>

      {user && (
        <div className="mb-7 bg-surface border border-line rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-accent-bg flex items-center justify-center text-accent shrink-0">
              <span aria-hidden="true" className="material-symbols-outlined">account_balance_wallet</span>
            </span>
            <div>
              <p className="text-xs text-ink-3 font-medium">Available to invest</p>
              <p className="text-xl font-bold text-accent font-mono">{currency(user.availableBalance)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onOpenDeposit}
              className="flex-1 sm:flex-initial bg-emerald text-on-emerald text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-emerald-2 transition-colors flex items-center justify-center gap-1.5"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">add_circle</span>
              Deposit
            </button>
            {user.kycStatus !== 'verified' && (
              <button
                onClick={onOpenKyc}
                className="flex-1 sm:flex-initial bg-gold text-on-gold text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-gold-2 transition-colors flex items-center justify-center gap-1.5"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">verified</span>
                Verify identity
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {plans.map((plan) => {
          const cheapest = plan.subInvestments[0];
          const largest = plan.subInvestments[plan.subInvestments.length - 1];
          return (
            <article
              key={plan.id}
              className={`bg-surface rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-0.5 flex flex-col relative overflow-hidden ${
                plan.isPopular ? 'border-gold shadow-md' : 'border-line shadow-sm'
              }`}
            >
              <div className="absolute top-0 inset-x-0 h-1" style={{ backgroundColor: plan.accentColor }}></div>

              {plan.isPopular && (
                <span className="absolute top-3 right-3 bg-gold text-on-gold text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Popular
                </span>
              )}

              <button
                onClick={() => onOpenPlan(plan)}
                className="p-6 pb-4 flex-grow text-left w-full"
                aria-label={`Open ${plan.name} packages`}
              >
                <span className="w-11 h-11 rounded-xl bg-accent-bg text-accent flex items-center justify-center mb-4">
                  <span aria-hidden="true" className="material-symbols-outlined text-[24px]">{plan.iconName}</span>
                </span>

                <h2 className="text-lg font-bold text-ink mb-1">{plan.name}</h2>
                <p className="text-xs text-ink-2 leading-relaxed mb-4">{plan.description}</p>

                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <dt className="text-ink-2">Starts at</dt>
                    <dd className="font-bold text-pos font-mono">{currency(cheapest.amount)}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-ink-2">Shortest run</dt>
                    <dd className="font-bold text-ink">{cheapest.durationDays} days</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-ink-2">Packages</dt>
                    <dd className="font-bold text-ink">
                      {plan.subInvestments.length}, up to {currency(largest.amount)}
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 pt-3 border-t border-line-2 text-[11px] text-ink-3">
                  Smallest package: put in {currency(cheapest.amount)}, collect{' '}
                  <strong className="text-pos font-mono">{currency(payoutFor(cheapest))}</strong> after{' '}
                  {cheapest.durationDays} days.
                </p>
              </button>

              <div className="p-6 pt-0 mt-auto">
                <button
                  onClick={() => onOpenPlan(plan)}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-colors flex justify-center items-center gap-2 ${
                    plan.isPopular
                      ? 'bg-emerald text-on-emerald hover:bg-emerald-2'
                      : 'bg-surface border border-line text-ink hover:bg-surface-2 hover:border-accent hover:text-accent'
                  }`}
                >
                  See the {plan.subInvestments.length} packages
                  <span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <aside className="mt-7 p-5 sm:p-6 bg-surface rounded-2xl border border-line shadow-sm flex gap-4 items-start">
        <span aria-hidden="true" className="material-symbols-outlined text-gold-ink mt-0.5 shrink-0">info</span>
        <div>
          <h2 className="text-xs font-bold text-ink uppercase tracking-wider mb-1">Before you invest</h2>
          <p className="text-xs text-ink-2 leading-relaxed">
            Money placed in a package stays in until its last day — that is what makes the profit possible. Your
            money and its profit land back in your balance the moment the run finishes, ready to withdraw or
            reinvest.
          </p>
        </div>
      </aside>
    </div>
  </div>
);
