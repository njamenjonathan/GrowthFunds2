import { useEffect, useState } from 'react';
import { InvestmentPlan, RiskLevel, UserProfile } from '../types';
import { Modal, ModalHeader } from './Modal';

interface PlansViewProps {
  plans: InvestmentPlan[];
  user: UserProfile | null;
  /** Plan chosen elsewhere (e.g. the home page) to open straight away. */
  planToOpen: InvestmentPlan | null;
  onPlanOpened: () => void;
  onInvestInPlan: (plan: InvestmentPlan, amount: number) => string | undefined;
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

const projectedGain = (amount: number, plan: InvestmentPlan) =>
  Math.round(amount * (plan.projectedReturn / 100) * (plan.termMonths / 12));

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
  const [investAmount, setInvestAmount] = useState(0);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  /** Set once on success so the confirmation shows the real ledger reference. */
  const [confirmation, setConfirmation] = useState<{ plan: InvestmentPlan; amount: number; reference: string } | null>(
    null
  );

  const openPlan = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setInvestAmount(plan.minInvestment);
    setAgreedTerms(false);
    setErrorMsg(null);
  };

  // Honour a plan pre-selected from the home page's simulator or featured cards.
  useEffect(() => {
    if (!planToOpen) return;
    openPlan(planToOpen);
    onPlanOpened();
  }, [planToOpen, onPlanOpened]);

  const handleConfirmInvestment = () => {
    if (!selectedPlan) return;
    if (!user) {
      setErrorMsg('Sign in or create an account to start investing.');
      return;
    }
    if (user.kycStatus !== 'verified') {
      setErrorMsg('Your account needs identity verification before you can allocate funds.');
      return;
    }
    if (!Number.isFinite(investAmount) || investAmount < selectedPlan.minInvestment) {
      setErrorMsg(`The minimum for this fund is ${selectedPlan.minInvestment.toLocaleString()} XAF.`);
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

    const reference = onInvestInPlan(selectedPlan, investAmount);
    setConfirmation({ plan: selectedPlan, amount: investAmount, reference: reference ?? '—' });
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
            regional assets.
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
                      <dt className="text-ink-2">Minimum</dt>
                      <dd className="font-bold text-ink font-mono">{plan.minInvestment.toLocaleString()} XAF</dd>
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
                    View prospectus &amp; invest
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
                Commitment amount
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-ink-3 pointer-events-none">
                  FCFA
                </span>
                <input
                  id="invest-amount"
                  type="number"
                  inputMode="numeric"
                  min={selectedPlan.minInvestment}
                  step={10000}
                  value={investAmount || ''}
                  onChange={(e) => setInvestAmount(Number(e.target.value))}
                  className="w-full pl-14 pr-4 py-3 rounded-lg border border-line text-lg font-bold font-mono text-accent focus:border-accent outline-none"
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-ink-3 mt-1.5">
                <span>Min {selectedPlan.minInvestment.toLocaleString()} XAF</span>
                {user && <span>Available {user.availableBalance.toLocaleString()} XAF</span>}
              </div>
            </div>

            <dl className="bg-accent-bg border border-accent/20 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-ink-2">Lock-up term</dt>
                <dd className="font-bold text-ink">{selectedPlan.termMonths} months</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-2">Annual target return</dt>
                <dd className="font-bold text-accent">+{selectedPlan.projectedReturn}% / yr</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-2">Estimated return at maturity</dt>
                <dd className="font-bold text-gold-ink font-mono">
                  +{projectedGain(investAmount, selectedPlan).toLocaleString()} XAF
                </dd>
              </div>
              <div className="flex justify-between font-bold text-sm text-accent pt-2 border-t border-accent/15">
                <dt>Projected value at maturity</dt>
                <dd className="font-mono">
                  {(investAmount + projectedGain(investAmount, selectedPlan)).toLocaleString()} XAF
                </dd>
              </div>
            </dl>

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
              <strong className="text-accent">{confirmation.plan.name}</strong> is now active.
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
                <dd className="font-bold text-ink">{confirmation.plan.termMonths} months</dd>
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
