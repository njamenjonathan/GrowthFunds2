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
                All deposits, investments, payouts and withdrawals are denominated exclusively in Central African CFA Franc (XAF / FCFA), backed by the Bank of Central African States (BEAC).
              </p>
              <h4 className="text-sm font-bold text-ink">3. Investment Terms</h4>
              <p>
                Every package runs for a fixed number of days, from 5 days on the smallest package up to a platform maximum of 30 days. Money placed in a package cannot be withdrawn before the package finishes; on its finish date the amount invested and its stated profit are returned to your available balance.
              </p>
              <h4 className="text-sm font-bold text-ink">4. Withdrawals</h4>
              <p>
                Withdrawals start at 5,000 XAF and are dispatched in multiples of 5,000 XAF. A flat processing fee of 250 XAF applies to each payout; deposits are free.
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
                GrowthFund does not guarantee returns. The profit stated on a package is the target it is built to pay, modelled on the real assets behind it across Central African agricultural, real estate, technology and fixed income projects.
              </p>
              <h4 className="text-sm font-bold text-ink">2. Regional Economic Factors</h4>
              <p>
                Investments may be influenced by regional commodity price movements (cocoa, coffee, timber), government bond markets, and local inflation across CEMAC member states.
              </p>
            </div>
          )}

          {topic === 'fees' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-ink">Transparent Fee Architecture</h4>
              <p>
                There are only two numbers on this page, and neither is a percentage:
              </p>
              <div className="bg-surface-2 rounded-xl p-4 border border-line-2 space-y-2">
                <div className="flex justify-between border-b border-line-2 pb-2">
                  <span className="font-bold text-ink">Deposits</span>
                  <span className="font-mono font-bold text-pos">0 XAF (Free)</span>
                </div>
                <div className="flex justify-between border-b border-line-2 pb-2">
                  <span className="font-bold text-ink">Investing in a package</span>
                  <span className="font-mono font-bold text-pos">0 XAF (Free)</span>
                </div>
                <div className="flex justify-between border-b border-line-2 pb-2">
                  <span className="font-bold text-ink">Withdrawal</span>
                  <span className="font-mono font-bold text-accent">250 XAF Flat</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-ink">Account maintenance</span>
                  <span className="font-mono font-bold text-pos">0 XAF (Free)</span>
                </div>
              </div>
            </div>
          )}

          {topic === 'kyc' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-ink">Anti-Money Laundering (AML) &amp; KYC Directive</h4>
              <p>
                In compliance with GABAC (Groupe d'Action contre le blanchiment d'argent en Afrique Centrale) standards, every account is verified before it can invest or withdraw:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>A verified mobile number.</li>
                <li>A government ID scan — national ID, passport, driver licence or resident permit.</li>
                <li>A selfie, matched against the ID photo.</li>
              </ul>
              <p>Verification usually completes in under 20 minutes.</p>
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
