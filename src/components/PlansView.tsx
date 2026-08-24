import { useEffect, useState } from 'react';
import { InvestmentPlan, RiskLevel, SubInvestment, UserProfile } from '../types';
import { MIN_INVESTMENT_XAF } from '../lib/constants';
import { Modal, ModalHeader } from './Modal';

interface PlansViewProps {
  plans: InvestmentPlan[];
  user: UserProfile | null;
  /** Plan chosen elsewhere (e.g. the home page) to open straight away. */
  planToOpen: InvestmentPlan | null;
  onPlanOpened: () => void;
  onInvestInPlan: (plan: InvestmentPlan, amount: number, sub: SubInvestment) => string | undefined;
  onOpenDeposit: () => void;
  onOpenKyc: () => void;
  onOpenAuth: () => void;
  onViewPortfolio: () => void;
}

/** Badge styling per risk band, shared by the cards and the prospectus dialog. */
const riskStyles = (risk: RiskLevel) => {
  if (risk === 'Low' || risk === 'Very Low') return { className: 'bg-pos-bg text-on-pos-bg', icon: 'shield' };
  if (risk === 'Medium') return { className: 'bg-gold text-on-gold', icon: 'balance' };
  return { className: 'bg-info text-on-info', icon: 'trending_up' };
};

/** Return at maturity for a commitment, using the chosen opportunity's own terms. */
const projectedGain = (amount: number, sub: SubInvestment) =>
  Math.round(amount * (sub.projectedReturn / 100) * (sub.termMonths / 12));

export const PlansView: React.FC<PlansViewProps> = ({
  plans,
  user,
  planToOpen,
  onPlanOpened,
  onInvestInPlan,
  onOpenDeposit,
  onOpenKyc,
  onOpenAuth,
  onViewPortfolio,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  /** Which opportunity inside the open plan the capital is headed for. */
  const [selectedSub, setSelectedSub] = useState<SubInvestment | null>(null);
  const [investAmount, setInvestAmount] = useState(0);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  /** Set once on success so the confirmation shows the real ledger reference. */
  const [confirmation, setConfirmation] = useState<{
    plan: InvestmentPlan;
    sub: SubInvestment;
    amount: number;
    reference: string;
  } | null>(null);

  /** Opens a plan's prospectus with its first opportunity pre-selected. */
  const openPlan = (plan: InvestmentPlan, sub?: SubInvestment) => {
    const target = sub ?? plan.subInvestments[0] ?? null;
    setSelectedPlan(plan);
    setSelectedSub(target);
    setInvestAmount(target?.minInvestment ?? plan.minInvestment);
    setAgreedTerms(false);
    setErrorMsg(null);
  };

  /** Switching opportunity resets the amount to that opportunity's entry ticket
      only while the investor is still sitting on the previous minimum. */
  const chooseSub = (sub: SubInvestment) => {
    setInvestAmount((amount) => (amount === (selectedSub?.minInvestment ?? 0) ? sub.minInvestment : amount));
    setSelectedSub(sub);
    setErrorMsg(null);
  };

  // Honour a plan pre-selected from the home page's simulator or featured cards.
  useEffect(() => {
    if (!planToOpen) return;
    openPlan(planToOpen);
    onPlanOpened();
  }, [planToOpen, onPlanOpened]);

  const handleConfirmInvestment = () => {
    if (!selectedPlan || !selectedSub) return;
    if (!user) {
      setErrorMsg('Sign in or create an account to start investing.');
      return;
    }
    if (user.kycStatus !== 'verified') {
      setErrorMsg('Your account needs identity verification before you can allocate funds.');
      return;
    }
    if (!Number.isFinite(investAmount) || investAmount < selectedSub.minInvestment) {
      setErrorMsg(`${selectedSub.name} starts from ${selectedSub.minInvestment.toLocaleString()} XAF.`);
      return;
    }
    if (investAmount > user.availableBalance) {
      setErrorMsg(
        `That exceeds your available balance of ${user.availableBalance.toLocaleString()} XAF. Deposit funds first.`
      );
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('Please acknowledge the prospectus risk disclosure.');
      return;
    }

    const reference = onInvestInPlan(selectedPlan, investAmount, selectedSub);
    setConfirmation({ plan: selectedPlan, sub: selectedSub, amount: investAmount, reference: reference ?? '—' });
    setSelectedPlan(null);
  };

  return (
    <div className="flex-1 p-4 md:p-10 bg-canvas relative">
      <div className="absolute inset-0 opacity-40 pointer-events-none pattern-bg" aria-hidden="true"></div>

      <div className="max-w-[1200px] mx-auto w-full relative z-10">
        <header className="mb-7">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold-ink text-xs font-bold mb-3">
            <span aria-hidden="true" className="material-symbols-outlined text-[14px]">shield</span>
            COSUMAF-vetted portfolios
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink mb-2 tracking-tight font-display">
            Investment plans
          </h1>
          <p className="text-sm text-ink-2 max-w-2xl leading-relaxed">
            Institutional-grade opportunities matched to your risk profile and timeline, each backed by audited
            regional assets. Every plan breaks down into specific opportunities you can back individually — all of
            them opening from{' '}
            <strong className="text-pos font-mono">{MIN_INVESTMENT_XAF.toLocaleString()} XAF</strong>.
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
                <p className="text-xl font-bold text-accent font-mono">
                  {user.availableBalance.toLocaleString()} XAF
                </p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-7">
          {plans.map((plan) => {
            const risk = riskStyles(plan.riskLevel);
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

                <div className="p-6 flex-grow">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 w-fit mb-4 ${risk.className}`}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[14px]">{risk.icon}</span>
                    {plan.riskLevel} risk
                  </span>

                  <h2 className="text-xl font-bold text-ink mb-1">{plan.name}</h2>
                  <p className="text-xs text-ink-2 mb-5 leading-relaxed">{plan.description}</p>

                  <dl className="space-y-3">
                    <div className="flex justify-between items-end border-b border-line-2 pb-2">
                      <dt className="text-xs text-ink-2">Projected return</dt>
                      <dd className="text-3xl font-extrabold text-accent font-mono">{plan.projectedReturn}%</dd>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <dt className="text-ink-2">Minimum entry</dt>
                      <dd className="font-bold text-pos font-mono">
                        From {plan.minInvestment.toLocaleString()} XAF
                      </dd>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <dt className="text-ink-2">Term</dt>
                      <dd className="font-bold text-ink">{plan.termMonths} months</dd>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <dt className="text-ink-2">Management fee</dt>
                      <dd className="font-semibold text-ink-3">{plan.managementFeePercent}% / yr</dd>
                    </div>
                  </dl>

                  {/* The concrete opportunities inside the plan — an investor
                      picks one of these rather than buying the category. */}
                  <div className="mt-5 pt-4 border-t border-line-2">
                    <h3 className="text-[11px] font-bold text-ink uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <span aria-hidden="true" className="material-symbols-outlined text-[15px] text-accent">
                        account_tree
                      </span>
                      {plan.subInvestments.length} ways to invest
                    </h3>
                    <ul className="space-y-1.5">
                      {plan.subInvestments.map((sub) => (
                        <li key={sub.id}>
                          <button
                            onClick={() => openPlan(plan, sub)}
                            className="w-full flex items-center justify-between gap-2 text-left px-2.5 py-2 rounded-lg bg-surface-2 border border-line-2 hover:border-accent hover:bg-accent-bg transition-colors group"
                          >
                            <span className="flex items-center gap-2 min-w-0">
                              <span
                                aria-hidden="true"
                                className="material-symbols-outlined text-[16px] text-ink-3 group-hover:text-accent shrink-0"
                              >
                                {sub.iconName}
                              </span>
                              <span className="text-[11px] font-semibold text-ink truncate">{sub.name}</span>
                            </span>
                            <span className="text-[11px] font-bold text-accent font-mono shrink-0">
                              {sub.projectedReturn}%
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <button
                    onClick={() => openPlan(plan)}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition-colors flex justify-center items-center gap-2 ${
                      plan.isPopular
                        ? 'bg-emerald text-on-emerald hover:bg-emerald-2'
                        : 'bg-surface border border-line text-ink hover:bg-surface-2 hover:border-accent hover:text-accent'
                    }`}
                  >
                    View prospectus &amp; choose
                    <span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="p-5 sm:p-6 bg-surface rounded-2xl border border-line shadow-sm flex gap-4 items-start">
          <span aria-hidden="true" className="material-symbols-outlined text-gold-ink mt-0.5 shrink-0">info</span>
          <div>
            <h2 className="text-xs font-bold text-ink uppercase tracking-wider mb-1">Important disclosure</h2>
            <p className="text-xs text-ink-2 leading-relaxed">
              Past performance does not guarantee future results. All investments carry risk, including the potential
              loss of principal. Projected returns are estimates supported by regional economic assessments and may be
              affected by market volatility in the CEMAC region. Review the full prospectus before committing capital.
            </p>
          </div>
        </aside>
      </div>

      {/* Prospectus & allocation */}
      {selectedPlan && (
        <Modal onClose={() => setSelectedPlan(null)} size="max-w-xl" label={`${selectedPlan.name} prospectus`}>
          <ModalHeader
            icon={selectedPlan.iconName}
            title={selectedPlan.name}
            subtitle={`${selectedPlan.category} • ${selectedPlan.riskLevel} risk`}
            onClose={() => setSelectedPlan(null)}
          />

          <div className="p-6 space-y-4 overflow-y-auto">
            <p className="text-xs text-ink-2 leading-relaxed">{selectedPlan.longDescription}</p>

            {/* Pick the opportunity first: it sets the term, the target return
                and the minimum the amount field is validated against. */}
            <fieldset>
              <legend className="text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span aria-hidden="true" className="material-symbols-outlined text-[15px] text-accent">account_tree</span>
                Choose what to invest in
              </legend>
              <div className="space-y-2">
                {selectedPlan.subInvestments.map((sub) => {
                  const chosen = selectedSub?.id === sub.id;
                  return (
                    <label
                      key={sub.id}
                      className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        chosen
                          ? 'border-accent bg-accent-bg shadow-2xs'
                          : 'border-line-2 bg-surface-2 hover:border-accent/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sub-investment"
                        value={sub.id}
                        checked={chosen}
                        onChange={() => chooseSub(sub)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`material-symbols-outlined text-[20px] mt-0.5 shrink-0 ${
                          chosen ? 'text-accent' : 'text-ink-3'
                        }`}
                      >
                        {sub.iconName}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                          <span className="text-xs font-bold text-ink">{sub.name}</span>
                          <span className="text-xs font-extrabold text-accent font-mono">
                            +{sub.projectedReturn}% / yr
                          </span>
                        </span>
                        <span className="block text-[11px] text-ink-2 leading-relaxed mt-1">{sub.description}</span>
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] font-bold text-ink-3 uppercase tracking-wider">
                          <span>{sub.termMonths} month term</span>
                          <span className="text-pos">From {sub.minInvestment.toLocaleString()} XAF</span>
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="bg-surface-2 p-4 rounded-xl border border-line-2">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-2">Underlying assets</h3>
              <ul className="space-y-1.5">
                {selectedPlan.underlyingAssets.map((asset) => (
                  <li key={asset} className="text-xs text-ink-2 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0"></span>
                    {asset}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-2">Historical performance</h3>
              <div className="grid grid-cols-3 gap-2">
                {selectedPlan.historicalPerformance.map((hp) => (
                  <div key={hp.year} className="bg-surface border border-line p-2.5 rounded-lg text-center">
                    <span className="text-[10px] text-ink-3 font-semibold">{hp.year}</span>
                    <p className="text-sm font-bold text-pos">+{hp.returnPct}%</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <label htmlFor="invest-amount" className="block text-xs font-bold text-ink uppercase mb-1.5">
                Commitment amount{selectedSub ? ` — ${selectedSub.name}` : ''}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-ink-3 pointer-events-none">
                  FCFA
                </span>
                <input
                  id="invest-amount"
                  type="number"
                  inputMode="numeric"
                  min={selectedSub?.minInvestment ?? selectedPlan.minInvestment}
                  step={MIN_INVESTMENT_XAF}
                  value={investAmount || ''}
                  onChange={(e) => setInvestAmount(Number(e.target.value))}
                  className="w-full pl-14 pr-4 py-3 rounded-lg border border-line text-lg font-bold font-mono text-accent focus:border-accent outline-none"
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-ink-3 mt-1.5">
                <span>Min {(selectedSub?.minInvestment ?? selectedPlan.minInvestment).toLocaleString()} XAF</span>
                {user && <span>Available {user.availableBalance.toLocaleString()} XAF</span>}
              </div>
            </div>

            {selectedSub && (
              <dl className="bg-accent-bg border border-accent/20 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-2">Selected opportunity</dt>
                  <dd className="font-bold text-ink text-right">{selectedSub.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-2">Lock-up term</dt>
                  <dd className="font-bold text-ink">{selectedSub.termMonths} months</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-2">Annual target return</dt>
                  <dd className="font-bold text-accent">+{selectedSub.projectedReturn}% / yr</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-2">Estimated return at maturity</dt>
                  <dd className="font-bold text-gold-ink font-mono">
                    +{projectedGain(investAmount, selectedSub).toLocaleString()} XAF
                  </dd>
                </div>
                <div className="flex justify-between font-bold text-sm text-accent pt-2 border-t border-accent/15">
                  <dt>Projected value at maturity</dt>
                  <dd className="font-mono">
                    {(investAmount + projectedGain(investAmount, selectedSub)).toLocaleString()} XAF
                  </dd>
                </div>
              </dl>
            )}

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 accent-[var(--gf-accent)]"
              />
              <span className="text-xs text-ink-2 leading-relaxed">
                I acknowledge that returns are projected, not guaranteed, and that I have reviewed the COSUMAF
                prospectus risk disclosures.
              </span>
            </label>

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
                className="flex-1 py-3 bg-emerald text-on-emerald rounded-lg text-xs font-bold hover:bg-emerald-2 transition-colors"
              >
                Sign in to invest
              </button>
            ) : (
              <>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 py-3 border border-line text-ink rounded-lg text-xs font-bold hover:bg-surface-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmInvestment}
                  className="flex-1 py-3 bg-emerald text-on-emerald rounded-lg text-xs font-bold hover:bg-emerald-2 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[16px]">check_circle</span>
                  Confirm &amp; allocate
                </button>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Confirmation */}
      {confirmation && (
        <Modal onClose={() => setConfirmation(null)} size="max-w-md" label="Investment confirmed">
          <div className="p-7 text-center space-y-4">
            <div className="w-16 h-16 bg-pos-bg text-on-pos-bg rounded-full flex items-center justify-center mx-auto">
              <span aria-hidden="true" className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h2 className="text-xl font-bold text-accent">Investment allocated</h2>
            <p className="text-xs text-ink-2 leading-relaxed">
              Your commitment of{' '}
              <strong className="font-mono text-accent">{confirmation.amount.toLocaleString()} XAF</strong> to{' '}
              <strong className="text-accent">{confirmation.sub.name}</strong> ({confirmation.plan.name}) is now
              active.
            </p>

            <dl className="bg-surface-2 p-4 rounded-lg border border-line-2 text-left text-xs space-y-1.5">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">Reference</dt>
                <dd className="font-mono font-bold text-ink">{confirmation.reference}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">Status</dt>
                <dd className="font-bold text-pos">Active / compounding</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">Term</dt>
                <dd className="font-bold text-ink">{confirmation.sub.termMonths} months</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">Target return</dt>
                <dd className="font-bold text-accent">+{confirmation.sub.projectedReturn}% / yr</dd>
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
                Go to portfolio
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
