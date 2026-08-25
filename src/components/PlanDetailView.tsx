import { useState } from 'react';
import { InvestmentPlan, SubInvestment, UserProfile } from '../types';
import { MAX_TERM_DAYS, maturityDateInDays, payoutFor } from '../lib/commitment';
import { currency } from '../lib/transactions';
import { Modal, ModalHeader } from './Modal';
import { PageBackdrop } from './PageBackdrop';

interface PlanDetailViewProps {
  plan: InvestmentPlan;
  user: UserProfile | null;
  onBack: () => void;
  onInvestInPlan: (plan: InvestmentPlan, sub: SubInvestment) => string | undefined;
  onOpenDeposit: () => void;
  onOpenKyc: () => void;
  onOpenAuth: () => void;
  onViewPortfolio: () => void;
}

/**
 * A plan's own page: every package inside it, smallest first.
 *
 * The ordering is the whole point — reading down the page, the amount goes up,
 * the run gets longer and the profit grows, so the trade an investor is making
 * is visible without opening anything. Tapping a package opens the one
 * confirmation dialog that stands between them and a committed investment.
 */
export const PlanDetailView: React.FC<PlanDetailViewProps> = ({
  plan,
  user,
  onBack,
  onInvestInPlan,
  onOpenDeposit,
  onOpenKyc,
  onOpenAuth,
  onViewPortfolio,
}) => {
  const [pending, setPending] = useState<SubInvestment | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  /** Set once the investment is placed, so the receipt shows the real reference. */
  const [confirmation, setConfirmation] = useState<{
    sub: SubInvestment;
    reference: string;
    collectOn: string;
  } | null>(null);

  // Packages arrive ordered, but sorting here means a badly ordered plan can
  // never break the promise the page makes about reading smallest to biggest.
  const packages = [...plan.subInvestments].sort((a, b) => a.amount - b.amount);

  const openPackage = (sub: SubInvestment) => {
    setPending(sub);
    setErrorMsg(null);
  };

  const handleConfirm = () => {
    if (!pending) return;
    if (!user) {
      setErrorMsg('Sign in or create an account to start investing.');
      return;
    }
    if (user.kycStatus !== 'verified') {
      setErrorMsg('Verify your identity before placing money in a package.');
      return;
    }
    if (pending.amount > user.availableBalance) {
      setErrorMsg(
        `You have ${currency(user.availableBalance)} available. Deposit ${currency(
          pending.amount - user.availableBalance
        )} more to take this package.`
      );
      return;
    }

    const reference = onInvestInPlan(plan, pending);
    setConfirmation({
      sub: pending,
      reference: reference ?? '—',
      collectOn: maturityDateInDays(pending.durationDays),
    });
    setPending(null);
  };

  return (
    <div className="flex-1 p-4 md:p-10 bg-canvas relative">
      <PageBackdrop pair="sheet" />

      <div className="max-w-[900px] mx-auto w-full relative z-10">
        <button
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_back</span>
          All investment areas
        </button>

        <header className="bg-surface border border-line rounded-2xl p-5 sm:p-6 shadow-sm mb-5">
          <div className="flex items-start gap-4">
            <span
              className="w-12 h-12 rounded-xl flex items-center justify-center text-on-emerald shrink-0"
              style={{ backgroundColor: plan.accentColor }}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[26px]">{plan.iconName}</span>
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight font-display">
                {plan.name}
              </h1>
              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed mt-1.5">{plan.longDescription}</p>
            </div>
          </div>

          {user && (
            <div className="mt-5 pt-4 border-t border-line-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs text-ink-3">
                Available to invest:{' '}
                <strong className="font-mono text-accent text-sm">{currency(user.availableBalance)}</strong>
              </p>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={onOpenDeposit}
                  className="flex-1 sm:flex-initial bg-emerald text-on-emerald text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-emerald-2 transition-colors gf-press"
                >
                  Deposit
                </button>
                {user.kycStatus !== 'verified' && (
                  <button
                    onClick={onOpenKyc}
                    className="flex-1 sm:flex-initial bg-gold text-on-gold text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-gold-2 transition-colors"
                  >
                    Verify identity
                  </button>
                )}
              </div>
            </div>
          )}
        </header>

        <h2 className="text-sm font-bold text-ink uppercase tracking-wider mb-1">
          Choose a package — smallest first
        </h2>
        <p className="text-xs text-ink-3 mb-4">
          The more you put in, the longer it runs and the more you collect. Nothing runs longer than {MAX_TERM_DAYS}{' '}
          days.
        </p>

        <ol className="space-y-3">
          {packages.map((sub, index) => {
            const affordable = !user || sub.amount <= user.availableBalance;
            return (
              <li key={sub.id}>
                <button
                  onClick={() => openPackage(sub)}
                  className="w-full text-left bg-surface border border-line rounded-2xl p-4 sm:p-5 shadow-sm hover:border-accent hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-4 group"
                >
                  <span className="flex items-center gap-3 min-w-0 sm:w-[38%]">
                    <span className="w-10 h-10 rounded-xl bg-surface-2 text-ink-3 group-hover:bg-accent-bg group-hover:text-accent flex items-center justify-center shrink-0 transition-colors">
                      <span aria-hidden="true" className="material-symbols-outlined text-[20px]">{sub.iconName}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-ink-3 font-mono">#{index + 1}</span>
                        <span className="text-sm font-bold text-ink truncate">{sub.name}</span>
                      </span>
                      <span className="block text-[11px] text-ink-2 leading-relaxed mt-0.5">{sub.description}</span>
                    </span>
                  </span>

                  <dl className="grid grid-cols-3 gap-2 flex-1 text-center">
                    <div className="bg-surface-2 rounded-xl py-2 px-1 border border-line-2">
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-3">You put in</dt>
                      <dd className="text-sm font-extrabold font-mono text-ink mt-0.5">
                        {sub.amount.toLocaleString()}
                      </dd>
                    </div>
                    <div className="bg-surface-2 rounded-xl py-2 px-1 border border-line-2">
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Runs for</dt>
                      <dd className="text-sm font-extrabold text-gold-ink mt-0.5">{sub.durationDays} days</dd>
                    </div>
                    <div className="bg-pos-bg rounded-xl py-2 px-1 border border-pos/25">
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-on-pos-bg">You collect</dt>
                      <dd className="text-sm font-extrabold font-mono text-on-pos-bg mt-0.5">
                        {payoutFor(sub).toLocaleString()}
                      </dd>
                      {/* The profit, spelled out: it grows with every rung, and
                          that is the trade this page is asking about. */}
                      <dd className="text-[10px] font-bold font-mono text-on-pos-bg/80">
                        +{sub.profit.toLocaleString()} profit
                      </dd>
                    </div>
                  </dl>

                  <span
                    className={`shrink-0 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors text-center ${
                      affordable
                        ? 'bg-emerald text-on-emerald group-hover:bg-emerald-2'
                        : 'bg-surface-2 text-ink-3 border border-line'
                    }`}
                  >
                    {affordable ? 'Invest' : 'Top up'}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Confirm the package */}
      {pending && (
        <Modal onClose={() => setPending(null)} size="max-w-md" label={`Invest in ${pending.name}`}>
          <ModalHeader
            icon={pending.iconName}
            title={pending.name}
            subtitle={plan.name}
            onClose={() => setPending(null)}
          />

          <div className="p-6 space-y-4 overflow-y-auto">
            <p className="text-xs text-ink-2 leading-relaxed">{pending.description}</p>

            <dl className="bg-accent-bg border border-accent/20 rounded-xl p-4 space-y-2.5 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-2">You put in</dt>
                <dd className="font-bold text-ink font-mono">{currency(pending.amount)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-2">It runs for</dt>
                <dd className="font-bold text-ink">{pending.durationDays} days</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-2">Ready to collect on</dt>
                <dd className="font-bold text-ink font-mono">{maturityDateInDays(pending.durationDays)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-2">Profit</dt>
                <dd className="font-bold text-gold-ink font-mono">+{currency(pending.profit)}</dd>
              </div>
              <div className="flex justify-between font-bold text-sm text-accent pt-2.5 border-t border-accent/15">
                <dt>You collect</dt>
                <dd className="font-mono">{currency(payoutFor(pending))}</dd>
              </div>
            </dl>

            <p className="flex items-start gap-2 p-3 rounded-lg bg-gold/15 border border-gold/40 text-[11px] text-gold-ink leading-relaxed">
              <span aria-hidden="true" className="material-symbols-outlined text-[15px] shrink-0 mt-px">lock</span>
              <span>
                This money stays in for the full {pending.durationDays} days. You cannot take it out before{' '}
                <strong className="font-mono">{maturityDateInDays(pending.durationDays)}</strong>.
              </span>
            </p>

            {errorMsg && (
              <p role="alert" className="p-3 rounded-lg bg-neg-bg text-on-neg-bg text-xs font-medium flex items-center gap-2">
                <span aria-hidden="true" className="material-symbols-outlined text-sm">error</span>
                {errorMsg}
              </p>
            )}
          </div>

          <div className="p-5 border-t border-line-2 flex gap-3 shrink-0">
            {!user ? (
              <button
                onClick={onOpenAuth}
                className="flex-1 py-3 bg-emerald text-on-emerald rounded-lg text-xs font-bold hover:bg-emerald-2 transition-colors gf-press"
              >
                Sign in to invest
              </button>
            ) : (
              <>
                <button
                  onClick={() => setPending(null)}
                  className="flex-1 py-3 border border-line text-ink rounded-lg text-xs font-bold hover:bg-surface-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-emerald text-on-emerald rounded-lg text-xs font-bold hover:bg-emerald-2 transition-colors flex items-center justify-center gap-1.5 gf-press"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[16px]">check_circle</span>
                  Invest {currency(pending.amount)}
                </button>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Receipt */}
      {confirmation && (
        <Modal onClose={() => setConfirmation(null)} size="max-w-md" label="Investment placed">
          <div className="p-7 text-center space-y-4">
            <div className="w-16 h-16 bg-pos-bg text-on-pos-bg rounded-full flex items-center justify-center mx-auto">
              <span aria-hidden="true" className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h2 className="text-xl font-bold text-accent">You're invested</h2>
            <p className="text-xs text-ink-2 leading-relaxed">
              <strong className="font-mono text-accent">{currency(confirmation.sub.amount)}</strong> is now in{' '}
              <strong className="text-accent">{confirmation.sub.name}</strong> for{' '}
              {confirmation.sub.durationDays} days.
            </p>

            <dl className="bg-surface-2 p-4 rounded-lg border border-line-2 text-left text-xs space-y-1.5">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">Reference</dt>
                <dd className="font-mono font-bold text-ink">{confirmation.reference}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">Collect on</dt>
                <dd className="font-bold text-ink font-mono">{confirmation.collectOn}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">You collect</dt>
                <dd className="font-bold text-gold-ink font-mono">{currency(payoutFor(confirmation.sub))}</dd>
              </div>
            </dl>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setConfirmation(null)}
                className="flex-1 py-3 border border-line text-ink rounded-lg text-xs font-bold hover:bg-surface-2 transition-colors"
              >
                Keep browsing
              </button>
              <button
                onClick={() => {
                  setConfirmation(null);
                  onViewPortfolio();
                }}
                className="flex-1 py-3 bg-emerald text-on-emerald rounded-lg text-xs font-bold hover:bg-emerald-2 transition-colors"
              >
                My investments
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
