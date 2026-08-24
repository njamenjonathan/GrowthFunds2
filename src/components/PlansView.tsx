import React, { useState } from 'react';
import { InvestmentPlan, UserProfile } from '../types';

interface PlansViewProps {
  plans: InvestmentPlan[];
  user: UserProfile | null;
  onInvestInPlan: (plan: InvestmentPlan, amount: number) => void;
  onOpenDeposit: () => void;
  onOpenKyc: () => void;
}

export const PlansView: React.FC<PlansViewProps> = ({
  plans,
  user,
  onInvestInPlan,
  onOpenDeposit,
  onOpenKyc,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(0);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState(false);

  const handleOpenInvest = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setInvestAmount(plan.minInvestment);
    setAgreedTerms(false);
    setErrorMsg(null);
  };

  const handleConfirmInvestment = () => {
    if (!selectedPlan) return;
    if (!user) {
      setErrorMsg('Please login or create an account to start investing.');
      return;
    }
    if (user.kycStatus !== 'verified') {
      setErrorMsg('Your account requires KYC Identity Verification before allocating funds.');
      return;
    }
    if (investAmount < selectedPlan.minInvestment) {
      setErrorMsg(`Minimum investment for this fund is ${selectedPlan.minInvestment.toLocaleString()} XAF.`);
      return;
    }
    if (investAmount > user.availableBalance) {
      setErrorMsg(`Insufficient available balance (${user.availableBalance.toLocaleString()} XAF). Please deposit funds first.`);
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('Please review and acknowledge the investment prospectus risk disclosure.');
      return;
    }

    onInvestInPlan(selectedPlan, investAmount);
    setSuccessModal(true);
  };

  return (
    <div className="flex-1 p-4 md:p-12 bg-[#f8f9fa] flex flex-col min-h-screen relative overflow-hidden">
      {/* Subtle Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none pattern-bg"></div>

      <div className="max-w-[1200px] mx-auto w-full relative z-10 flex-grow">
        {/* Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fed65b]/20 text-[#735c00] text-xs font-bold mb-3">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            <span>COSUMAF Vetted Portfolios</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#191c1d] mb-2 tracking-tight">
            Explore Investment Plans
          </h2>
          <p className="text-sm sm:text-base text-[#404941] max-w-2xl leading-relaxed">
            Discover institutional-grade opportunities tailored to your risk profile and timeline. Our vetted funds provide transparent paths to regional growth.
          </p>
        </header>

        {/* User Quick Balance Widget if logged in */}
        {user && (
          <div className="mb-8 bg-white border border-[#c0c9be]/40 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#002c13]/10 flex items-center justify-center text-[#002c13]">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <div>
                <p className="text-xs text-[#717970] font-medium">Available Cash to Invest</p>
                <p className="text-xl font-bold text-[#002c13] font-mono">{user.availableBalance.toLocaleString()} XAF</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={onOpenDeposit}
                className="flex-1 sm:flex-initial bg-[#002c13] text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#014421] transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                Deposit XAF
              </button>
              {user.kycStatus !== 'verified' && (
                <button
                  onClick={onOpenKyc}
                  className="flex-1 sm:flex-initial bg-[#fed65b] text-[#241a00] text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#ffe088] transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Verify KYC
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bento Grid Layout for Plans (Matching Image 6) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const isMedium = plan.riskLevel === 'Medium';
            const isLow = plan.riskLevel === 'Low' || plan.riskLevel === 'Very Low';

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl border transition-all hover:shadow-md flex flex-col relative group overflow-hidden ${
                  isMedium
                    ? 'border-[#735c00]/40 shadow-[0px_2px_15px_rgba(115,92,0,0.08)]'
                    : 'border-[#c0c9be]/40 shadow-xs'
                }`}
              >
                {/* Decorative Top Accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    backgroundColor: plan.accentColor,
                  }}
                ></div>

                {isMedium && (
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#fed65b]/10 rounded-full blur-xl pointer-events-none"></div>
                )}

                <div className="p-6 flex-grow relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                        isLow
                          ? 'bg-[#b2f1bf] text-[#14512d]'
                          : isMedium
                          ? 'bg-[#fed65b] text-[#745c00]'
                          : 'bg-[#2c3c4a] text-[#d4e4f6]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isLow ? 'shield' : isMedium ? 'balance' : 'trending_up'}
                      </span>
                      {plan.riskLevel} Risk
                    </div>
                    <span
                      className="material-symbols-outlined text-3xl opacity-25"
                      style={{ color: plan.accentColor }}
                    >
                      {plan.iconName}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#191c1d] mb-1">{plan.name}</h3>
                  <p className="text-xs text-[#404941] mb-6 leading-relaxed">{plan.description}</p>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-end border-b border-[#e1e3e4] pb-2">
                      <span className="text-xs text-[#404941]">Projected Return</span>
                      <span
                        className="text-3xl font-extrabold"
                        style={{ color: isMedium ? '#735c00' : isLow ? '#002c13' : '#2c3c4a' }}
                      >
                        {plan.projectedReturn}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#404941]">Min. Investment</span>
                      <span className="font-bold text-[#191c1d] font-mono">
                        {plan.minInvestment.toLocaleString()} XAF
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#404941]">Term Length</span>
                      <span className="font-bold text-[#191c1d]">{plan.termMonths} Months</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#404941]">Management Fee</span>
                      <span className="font-semibold text-[#717970]">{plan.managementFeePercent}% / yr</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto relative z-10">
                  <button
                    onClick={() => handleOpenInvest(plan)}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-2 ${
                      isMedium
                        ? 'bg-[#002c13] text-white hover:bg-[#014421] shadow-xs'
                        : 'bg-white border border-[#c0c9be] text-[#191c1d] hover:bg-[#f3f4f5] hover:border-[#002c13] hover:text-[#002c13]'
                    }`}
                  >
                    <span>View Details &amp; Invest</span>
                    <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclosures Box (Matching Image 6) */}
        <div className="p-6 bg-white rounded-xl border border-[#c0c9be]/40 shadow-xs flex gap-4 items-start">
          <span className="material-symbols-outlined text-[#735c00] mt-0.5 text-xl">info</span>
          <div>
            <h4 className="text-xs font-bold text-[#191c1d] uppercase tracking-wider mb-1">Important Disclosure</h4>
            <p className="text-xs text-[#404941] leading-relaxed">
              Past performance does not guarantee future results. All investments carry risk, including the potential loss of principal. Projected returns are estimates supported by regional economic assessments and may be affected by market volatility in the CEMAC region. Please review the full prospectus before committing capital.
            </p>
          </div>
        </div>
      </div>

      {/* Invest Details & Allocation Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#c0c9be]/50 p-6 md:p-8">
            <div className="flex justify-between items-start pb-4 border-b border-[#e1e3e4]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#b2f1bf] text-[#14512d]">
                    {selectedPlan.riskLevel} Risk
                  </span>
                  <span className="text-xs font-mono text-[#717970]">{selectedPlan.category}</span>
                </div>
                <h3 className="text-2xl font-bold text-[#002c13] mt-1">{selectedPlan.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="p-1 text-[#717970] hover:text-[#191c1d] rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="py-4 space-y-4">
              <p className="text-xs text-[#404941] leading-relaxed">{selectedPlan.longDescription}</p>

              {/* Underlying Assets */}
              <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e1e3e4]">
                <h5 className="text-xs font-bold text-[#191c1d] uppercase tracking-wider mb-2">
                  Audited Asset Allocation
                </h5>
                <ul className="space-y-1.5">
                  {selectedPlan.underlyingAssets.map((asset, idx) => (
                    <li key={idx} className="text-xs text-[#404941] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#002c13]"></span>
                      {asset}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Historical Track Record */}
              <div>
                <h5 className="text-xs font-bold text-[#191c1d] uppercase tracking-wider mb-2">
                  Annual Realized Performance (Historical)
                </h5>
                <div className="grid grid-cols-3 gap-2">
                  {selectedPlan.historicalPerformance.map((hp) => (
                    <div key={hp.year} className="bg-white border border-[#c0c9be]/50 p-2.5 rounded-lg text-center">
                      <span className="text-[10px] text-[#717970] font-semibold">{hp.year}</span>
                      <p className="text-sm font-bold text-[#002c13]">+{hp.returnPct}%</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment Amount Input */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-[#191c1d] uppercase mb-1">
                  Commitment Amount (XAF)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-[#717970]">
                    FCFA
                  </span>
                  <input
                    type="number"
                    min={selectedPlan.minInvestment}
                    step={10000}
                    value={investAmount || ''}
                    onChange={(e) => setInvestAmount(Number(e.target.value))}
                    className="w-full pl-14 pr-4 py-3 rounded-lg border border-[#c0c9be] text-lg font-bold font-mono text-[#002c13] focus:border-[#002c13] focus:ring-1 focus:ring-[#002c13]"
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#717970] mt-1.5">
                  <span>Min: {selectedPlan.minInvestment.toLocaleString()} XAF</span>
                  {user && <span>Available: {user.availableBalance.toLocaleString()} XAF</span>}
                </div>
              </div>

              {/* Summary Calculations */}
              <div className="bg-[#002c13]/5 border border-[#002c13]/15 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#404941]">
                  <span>Lockup Term</span>
                  <span className="font-bold text-[#191c1d]">{selectedPlan.termMonths} Months</span>
                </div>
                <div className="flex justify-between text-[#404941]">
                  <span>Annual Target Return</span>
                  <span className="font-bold text-[#002c13]">+{selectedPlan.projectedReturn}% / yr</span>
                </div>
                <div className="flex justify-between text-[#404941]">
                  <span>Estimated Total Return at Maturity</span>
                  <span className="font-bold text-[#735c00] font-mono">
                    +{Math.round(investAmount * (selectedPlan.projectedReturn / 100) * (selectedPlan.termMonths / 12)).toLocaleString()} XAF
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#002c13] pt-2 border-t border-[#002c13]/10">
                  <span>Projected Value at Maturity</span>
                  <span className="font-mono">
                    {(
                      investAmount +
                      Math.round(investAmount * (selectedPlan.projectedReturn / 100) * (selectedPlan.termMonths / 12))
                    ).toLocaleString()}{' '}
                    XAF
                  </span>
                </div>
              </div>

              {/* Risk checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#002c13] focus:ring-[#002c13]"
                />
                <span className="text-xs text-[#404941]">
                  I acknowledge that returns are projected and not guaranteed, and that I have reviewed the COSUMAF prospectus risk disclosures.
                </span>
              </label>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-[#ffdad6] text-[#ba1a1a] text-xs font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#e1e3e4] flex gap-3">
              <button
                onClick={() => setSelectedPlan(null)}
                className="flex-1 py-3 border border-[#c0c9be] text-[#191c1d] rounded-lg text-xs font-bold hover:bg-[#f3f4f5]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmInvestment}
                className="flex-1 py-3 bg-[#002c13] text-white rounded-lg text-xs font-bold hover:bg-[#014421] shadow-xs flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Confirm &amp; Allocate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-[#c0c9be]/50">
            <div className="w-16 h-16 bg-[#b2f1bf] text-[#002c13] rounded-full flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h3 className="text-xl font-bold text-[#002c13]">Investment Successfully Allocated!</h3>
            <p className="text-xs text-[#404941] leading-relaxed">
              Your commitment of <strong className="font-mono text-[#002c13]">{investAmount.toLocaleString()} XAF</strong> into <strong className="text-[#002c13]">{selectedPlan?.name}</strong> has been secured in your portfolio.
            </p>
            <div className="bg-[#f8f9fa] p-3 rounded-lg border border-[#e1e3e4] text-left text-xs space-y-1">
              <p className="text-[#717970]">Transaction ID: <span className="font-mono font-bold text-[#191c1d]">GF-IV-{Math.floor(1000000 + Math.random() * 9000000)}</span></p>
              <p className="text-[#717970]">Status: <span className="font-bold text-[#306a43]">Active / Compounding</span></p>
              <p className="text-[#717970]">Maturity Term: <span className="font-bold text-[#191c1d]">{selectedPlan?.termMonths} Months</span></p>
            </div>
            <button
              onClick={() => {
                setSuccessModal(false);
                setSelectedPlan(null);
              }}
              className="w-full py-3 bg-[#002c13] text-white rounded-lg font-bold text-xs hover:bg-[#014421]"
            >
              Go to Portfolio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
