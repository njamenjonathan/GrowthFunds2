import { useState } from 'react';
import { Modal, ModalHeader } from './Modal';

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
    <Modal onClose={onClose} size="max-w-2xl" label="Legal and regulatory disclosures">
      <ModalHeader
        icon="gavel"
        title="Legal & regulatory disclosures"
        subtitle="COSUMAF compliance & CEMAC investor protections"
        onClose={onClose}
      />

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 p-3 shrink-0 bg-surface border-b border-line-2 overflow-x-auto hide-scrollbar">
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
                  ? 'bg-emerald text-on-emerald shadow-xs'
                  : 'bg-surface-2 text-ink-3 hover:bg-surface-3 hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-ink-2 leading-relaxed">
          {topic === 'terms' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-ink">1. Master Investment Terms &amp; Conditions</h4>
              <p>
                By opening an account with GrowthFund (GrowthFund CEMAC SAS), you enter into a binding fiduciary custody agreement subject to the harmonized laws of the CEMAC monetary zone and the regulations of the Commission de Surveillance du Marché Financier de l'Afrique Centrale (COSUMAF).
              </p>
              <h4 className="text-sm font-bold text-ink">2. Settlement Currency</h4>
              <p>
                All account transactions, deposits, valuations, dividend distributions, and withdrawal requests are denominated exclusively in Central African CFA Franc (XAF / FCFA), backed by the Bank of Central African States (BEAC).
              </p>
              <h4 className="text-sm font-bold text-ink">3. Liquidity and Lockup Periods</h4>
              <p>
                Each investment strategy maintains a distinct maturity timeline (ranging from 6 to 24 months). Early redemptions prior to contractual maturity may be subject to a secondary market liquidity discount of up to 1.5% to preserve collective fund stability.
              </p>
            </div>
          )}

          {topic === 'risk' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-gold/20 border border-gold/50 rounded-xl text-gold-ink font-semibold">
                <span className="font-bold">Important Statutory Warning:</span> All investment plans carry risk of capital loss. Past performance is no guarantee of future returns.
              </div>
              <h4 className="text-sm font-bold text-ink">1. Projected vs. Guaranteed Yields</h4>
              <p>
                GrowthFund strictly prohibits guarantees of absolute returns. All projected annual yields (e.g. 8%, 12%, 18%) reflect actuarial modeling and historic asset yields across Central African agricultural, real estate, and fixed income markets.
              </p>
              <h4 className="text-sm font-bold text-ink">2. Regional Economic Factors</h4>
              <p>
                Investments may be influenced by regional commodity price fluctuations (cocoa, coffee, timber), sovereign bond yield adjustments, and local inflation rates across CEMAC member states.
              </p>
            </div>
          )}

          {topic === 'fees' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-ink">Transparent Fee Architecture</h4>
              <p>
                GrowthFund adheres to zero-hidden-fee transparency. Our revenue is aligned strictly with performance and management integrity:
              </p>
              <div className="bg-surface-2 rounded-xl p-4 border border-line-2 space-y-2">
                <div className="flex justify-between border-b border-line-2 pb-2">
                  <span className="font-bold text-ink">Annual Fund Management Fee</span>
                  <span className="font-mono font-bold text-accent">0.50% - 1.00% / yr</span>
                </div>
                <div className="flex justify-between border-b border-line-2 pb-2">
                  <span className="font-bold text-ink">Mobile Money Deposit Processing</span>
                  <span className="font-mono font-bold text-accent">0.50% (Telecom Pass-through)</span>
                </div>
                <div className="flex justify-between border-b border-line-2 pb-2">
                  <span className="font-bold text-ink">Standard Withdrawal Interbank Fee</span>
                  <span className="font-mono font-bold text-accent">250 XAF Flat</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-ink">Account Custody &amp; Maintenance</span>
                  <span className="font-mono font-bold text-pos">0 XAF (Free)</span>
                </div>
              </div>
            </div>
          )}

          {topic === 'kyc' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-ink">Anti-Money Laundering (AML) &amp; KYC Directive</h4>
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
              <h4 className="text-sm font-bold text-ink">COSUMAF License &amp; Custody Oversight</h4>
              <div className="p-4 bg-emerald/5 border border-accent/20 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-ink-3">Entity Name</span>
                  <span className="font-bold text-accent">GrowthFund CEMAC S.A.S.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-3">Regulatory License</span>
                  <span className="font-mono font-bold text-accent">COSUMAF N° SGP-04/2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-3">Depository Custodian</span>
                  <span className="font-bold text-ink">BVMAC Segregated Trust</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-3">Jurisdiction</span>
                  <span>Cameroon, Gabon, Congo, Chad, CAR, Eq. Guinea</span>
                </div>
              </div>
            </div>
          )}
        </div>

      <div className="p-4 border-t border-line-2 bg-surface-2 flex justify-end shrink-0">
        <button
          onClick={onClose}
          className="bg-emerald text-on-emerald px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-2 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};
