import React, { useState } from 'react';

interface LegalModalProps {
  initialTopic?: string;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  initialTopic = 'terms',
  onClose,
}) => {
  const [topic, setTopic] = useState<string>(initialTopic);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#c0c9be]/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#e1e3e4] flex justify-between items-center bg-[#f8f9fa]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#002c13] text-[#fed65b] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">gavel</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#002c13]">Legal &amp; Regulatory Disclosures</h3>
              <p className="text-xs text-[#717970]">COSUMAF Compliance &amp; CEMAC Investor Protections</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#717970] hover:text-[#191c1d] rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 p-3 bg-white border-b border-[#e1e3e4] overflow-x-auto hide-scrollbar">
          {[
            { id: 'terms', label: 'Terms of Service' },
            { id: 'risk', label: 'Risk Disclosure' },
            { id: 'fees', label: 'Fee Schedule' },
            { id: 'kyc', label: 'AML & KYC Policy' },
            { id: 'cosumaf', label: 'COSUMAF License' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTopic(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                topic === t.id
                  ? 'bg-[#002c13] text-white shadow-xs'
                  : 'bg-[#f8f9fa] text-[#717970] hover:bg-[#f3f4f5] hover:text-[#191c1d]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#404941] leading-relaxed">
          {topic === 'terms' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#191c1d]">1. Master Investment Terms &amp; Conditions</h4>
              <p>
                By opening an account with GrowthFund (GrowthFund CEMAC SAS), you enter into a binding fiduciary custody agreement subject to the harmonized laws of the CEMAC monetary zone and the regulations of the Commission de Surveillance du Marché Financier de l'Afrique Centrale (COSUMAF).
              </p>
              <h4 className="text-sm font-bold text-[#191c1d]">2. Settlement Currency</h4>
              <p>
                All account transactions, deposits, valuations, dividend distributions, and withdrawal requests are denominated exclusively in Central African CFA Franc (XAF / FCFA), backed by the Bank of Central African States (BEAC).
              </p>
              <h4 className="text-sm font-bold text-[#191c1d]">3. Liquidity and Lockup Periods</h4>
              <p>
                Each investment strategy maintains a distinct maturity timeline (ranging from 6 to 24 months). Early redemptions prior to contractual maturity may be subject to a secondary market liquidity discount of up to 1.5% to preserve collective fund stability.
              </p>
            </div>
          )}

          {topic === 'risk' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-[#fed65b]/20 border border-[#fed65b]/50 rounded-xl text-[#735c00] font-semibold">
                <span className="font-bold">Important Statutory Warning:</span> All investment plans carry risk of capital loss. Past performance is no guarantee of future returns.
              </div>
              <h4 className="text-sm font-bold text-[#191c1d]">1. Projected vs. Guaranteed Yields</h4>
              <p>
                GrowthFund strictly prohibits guarantees of absolute returns. All projected annual yields (e.g. 8%, 12%, 18%) reflect actuarial modeling and historic asset yields across Central African agricultural, real estate, and fixed income markets.
              </p>
              <h4 className="text-sm font-bold text-[#191c1d]">2. Regional Economic Factors</h4>
              <p>
                Investments may be influenced by regional commodity price fluctuations (cocoa, coffee, timber), sovereign bond yield adjustments, and local inflation rates across CEMAC member states.
              </p>
            </div>
          )}

          {topic === 'fees' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#191c1d]">Transparent Fee Architecture</h4>
              <p>
                GrowthFund adheres to zero-hidden-fee transparency. Our revenue is aligned strictly with performance and management integrity:
              </p>
              <div className="bg-[#f8f9fa] rounded-xl p-4 border border-[#e1e3e4] space-y-2">
                <div className="flex justify-between border-b border-[#e1e3e4] pb-2">
                  <span className="font-bold text-[#191c1d]">Annual Fund Management Fee</span>
                  <span className="font-mono font-bold text-[#002c13]">0.50% - 1.00% / yr</span>
                </div>
                <div className="flex justify-between border-b border-[#e1e3e4] pb-2">
                  <span className="font-bold text-[#191c1d]">Mobile Money Deposit Processing</span>
                  <span className="font-mono font-bold text-[#002c13]">0.50% (Telecom Pass-through)</span>
                </div>
                <div className="flex justify-between border-b border-[#e1e3e4] pb-2">
                  <span className="font-bold text-[#191c1d]">Standard Withdrawal Interbank Fee</span>
                  <span className="font-mono font-bold text-[#002c13]">250 XAF Flat</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-[#191c1d]">Account Custody &amp; Maintenance</span>
                  <span className="font-mono font-bold text-[#306a43]">0 XAF (Free)</span>
                </div>
              </div>
            </div>
          )}

          {topic === 'kyc' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#191c1d]">Anti-Money Laundering (AML) &amp; KYC Directive</h4>
              <p>
                In compliance with GABAC (Groupe d'Action contre le blanchiment d'argent en Afrique Centrale) standards, all accounts must satisfy tiered customer due diligence:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tier 1:</strong> Mobile number verification &amp; basic ID. Cumulative limit: 1,000,000 XAF.</li>
                <li><strong>Tier 2:</strong> Government ID scan, selfie liveness match, and proof of address. Cumulative limit: 10,000,000 XAF.</li>
                <li><strong>Tier 3 (Institutional):</strong> Articles of incorporation and beneficial ownership registry. Unlimited tier.</li>
              </ul>
            </div>
          )}

          {topic === 'cosumaf' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#191c1d]">COSUMAF License &amp; Custody Oversight</h4>
              <div className="p-4 bg-[#002c13]/5 border border-[#002c13]/20 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#717970]">Entity Name</span>
                  <span className="font-bold text-[#002c13]">GrowthFund CEMAC S.A.S.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717970]">Regulatory License</span>
                  <span className="font-mono font-bold text-[#002c13]">COSUMAF N° SGP-04/2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717970]">Depository Custodian</span>
                  <span className="font-bold text-[#191c1d]">BVMAC Segregated Trust</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717970]">Jurisdiction</span>
                  <span>Cameroon, Gabon, Congo, Chad, CAR, Eq. Guinea</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e1e3e4] bg-[#f8f9fa] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#002c13] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#014421]"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};
