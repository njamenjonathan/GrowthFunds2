import { useState } from 'react';
import { motion } from 'motion/react';
import { InvestmentPlan, RiskLevel } from '../types';

interface HomeViewProps {
  plans: InvestmentPlan[];
  onSelectPlan: (plan: InvestmentPlan) => void;
  onExplorePlans: () => void;
  onOpenDeposit: () => void;
  onOpenLegal: (topic: string) => void;
}

const TICKER_ITEMS = [
  { label: 'BVMAC Composite', value: '1,482.30', change: '+1.45%' },
  { label: 'BEAC policy rate', value: '5.00%', change: 'Stable' },
  { label: 'Cocoa & agri yield', value: '+14.2% YTD', change: '+2.1%' },
  { label: 'Douala prime RE', value: '+11.8% YTD', change: '+0.8%' },
  { label: 'CEMAC sovereign 5Y', value: '7.60%', change: '+0.4%' },
  { label: 'EUR / XAF', value: '655.957', change: 'Fixed peg' },
];

const PARTNERS = [
  { name: 'COSUMAF', role: 'Regulator', icon: 'verified' },
  { name: 'BEAC', role: 'Interbank clearing', icon: 'account_balance' },
  { name: 'Ecobank', role: 'Custodian bank', icon: 'security' },
  { name: 'Afriland First', role: 'Asset depository', icon: 'account_balance_wallet' },
  { name: 'MTN MoMo', role: 'Direct settlement', icon: 'smartphone' },
  { name: 'Orange Money', role: 'Instant funding', icon: 'payments' },
];

const STEPS = [
  {
    title: 'Fund your account in XAF',
    body: 'Deposit with MTN Mobile Money, Orange Money, Express Union, or a direct bank transfer. Capital is credited instantly with no hidden entry charges.',
    note: 'Instant confirmation',
    icon: 'bolt',
  },
  {
    title: 'Choose a strategy',
    body: 'Allocate across vetted portfolios — cocoa agro-export, commercial real estate, sovereign bonds — matched to your risk profile and holding horizon.',
    note: '6.5% – 18% projected yields',
    icon: 'trending_up',
    featured: true,
  },
  {
    title: 'Collect audited returns',
    body: 'Track live performance with downloadable receipts. At maturity, withdraw principal and yield to your phone or bank within minutes.',
    note: 'Direct payouts',
    icon: 'account_balance_wallet',
  },
];

const TESTIMONIALS = [
  {
    name: 'Dr. Martin Mbarga',
    role: 'Chief medical officer',
    location: 'Douala, Cameroon',
    amount: '3,500,000 XAF',
    yieldEarned: '+420,000 XAF',
    comment:
      'As a busy medical professional, GrowthFund gives me the peace of mind of COSUMAF-supervised institutional asset backing. Withdrawals to my MTN MoMo wallet land within a minute.',
  },
  {
    name: 'Jeanne-Marie Nguesso',
    role: 'Managing director, logistics',
    location: 'Libreville, Gabon',
    amount: '5,000,000 XAF',
    yieldEarned: '+710,000 XAF',
    comment:
      'The transparency is unmatched in CEMAC. Every portfolio asset is physically audited, and quarterly returns match the prospectus figures with no hidden charges.',
  },
  {
    name: 'Christian Kouassi',
    role: 'Senior software engineer',
    location: 'Yaoundé & diaspora',
    amount: '1,800,000 XAF',
    yieldEarned: '+136,800 XAF',
    comment:
      'Investing in local infrastructure from abroad used to be full of uncertainty. GrowthFund makes regional wealth building modern, secure and fully compliant.',
  },
];

const SAFEGUARDS = [
  {
    icon: 'account_balance',
    title: 'Ring-fenced trust accounts',
    body: 'Assets are held in segregated custody with partner commercial banks (Ecobank, Afriland First, UBA), never co-mingled with operating funds.',
  },
  {
    icon: 'encrypted',
    title: '256-bit AES & hardware HSM keys',
    body: 'End-to-end encryption in transit and at rest, with mandatory multi-signature authorisation on every treasury movement.',
  },
  {
    icon: 'gavel',
    title: 'Quarterly compliance audits',
    body: 'Continuous supervisory review under COSUMAF oversight, with transparent investor disclosures each quarter.',
  },
];

const FAQS = [
  {
    q: 'How are investor funds protected and custodied?',
    a: 'Client capital is held in segregated trust accounts at premier CEMAC commercial banks and regional depositories. GrowthFund cannot co-mingle investor capital with operational expenses, ensuring full segregation and legal ring-fencing under COSUMAF oversight.',
  },
  {
    q: 'How do deposits and withdrawals work?',
    a: 'Fund your portfolio instantly in XAF using MTN Mobile Money, Orange Money, Express Union, or direct bank transfer (Ecobank, UBA, Afriland). Withdrawals at maturity are processed within 5–15 minutes back to your verified mobile number or bank account.',
  },
  {
    q: 'What is the minimum amount to start?',
    a: 'You can begin with 25,000 XAF in the CEMAC Sovereign Bond Fund, or allocate larger amounts across the agricultural and real estate portfolios with no entry penalties.',
  },
  {
    q: 'Are returns guaranteed?',
    a: 'No. Under COSUMAF market regulations, returns are projections based on vetted regional assets — real estate leases, export contracts, treasury bills — and verified quarterly audits. We maintain strict risk management and emergency liquidity reserves, but capital is at risk.',
  },
];

const riskBadge = (risk: RiskLevel) => {
  if (risk === 'Low' || risk === 'Very Low') return { className: 'bg-pos-bg text-on-pos-bg', icon: 'shield' };
  if (risk === 'Medium') return { className: 'bg-gold text-on-gold', icon: 'balance' };
  return { className: 'bg-info text-on-info', icon: 'trending_up' };
};

export const HomeView: React.FC<HomeViewProps> = ({
  plans,
  onSelectPlan,
  onExplorePlans,
  onOpenDeposit,
  onOpenLegal,
}) => {
  const [calcAmount, setCalcAmount] = useState(250000);
  const [calcMonths, setCalcMonths] = useState(12);
  const [calcPlanId, setCalcPlanId] = useState(plans[1]?.id ?? plans[0]?.id ?? '');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const activeCalcPlan = plans.find((p) => p.id === calcPlanId) ?? plans[0];
  const projectedGain = Math.round(calcAmount * ((activeCalcPlan.projectedReturn / 100) * (calcMonths / 12)));
  const estimatedTotal = calcAmount + projectedGain;
  const monthlyPayout = Math.round(projectedGain / calcMonths);

  return (
    <div className="flex flex-col">
      {/* Market ticker */}
      <div className="bg-emerald-3 text-gold py-2 border-b border-gold/20 overflow-hidden text-xs">
        <div className="flex items-center gap-6 whitespace-nowrap overflow-x-auto hide-scrollbar px-4">
          <span className="flex items-center gap-2 font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-tint animate-pulse"></span>
            <span className="uppercase tracking-widest text-[10px]">Live CEMAC index</span>
          </span>
          {TICKER_ITEMS.map((item) => (
            <span key={item.label} className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
              <span className="text-on-emerald/60">{item.label}</span>
              <span className="text-on-emerald font-bold">{item.value}</span>
              <span className="text-emerald-tint font-semibold bg-emerald-2 px-1.5 py-0.5 rounded text-[10px]">
                {item.change}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-14 md:py-20 border-b border-line overflow-hidden bg-surface">
        <div
          className="absolute top-10 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        ></div>
        <div
          className="absolute bottom-0 left-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        ></div>

        <div className="max-w-[1240px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="inline-flex items-center gap-2 bg-surface-2 border border-gold/50 rounded-full px-3.5 py-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald text-gold flex items-center justify-center shrink-0">
                <span aria-hidden="true" className="material-symbols-outlined text-[13px]">verified</span>
              </span>
              <span className="text-xs font-extrabold text-ink tracking-wide">
                COSUMAF regulated · Licence SGP-04/2023
              </span>
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight leading-[1.1] font-display">
              Grow your wealth with{' '}
              <span className="gold-gradient-text">institutional precision.</span>
            </h1>

            <p className="text-base sm:text-lg text-ink-2 max-w-xl leading-relaxed">
              Central Africa's asset management gateway. Seamless XAF deposits via mobile money and banks,
              high-yield regional funds, and transparent COSUMAF-supervised governance.
            </p>

            <div className="pt-1 flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenDeposit}
                className="bg-emerald text-on-emerald font-bold text-sm px-7 py-4 rounded-xl shadow-lg hover:bg-emerald-2 transition-colors flex items-center justify-center gap-2.5 group relative overflow-hidden"
              >
                <span className="absolute inset-0 shimmer-badge pointer-events-none opacity-30" aria-hidden="true"></span>
                <span>Start investing in XAF</span>
                <span aria-hidden="true" className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExplorePlans}
                className="border border-line bg-surface text-ink font-bold text-sm px-6 py-4 rounded-xl hover:bg-surface-2 transition-colors flex items-center justify-center gap-2"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-gold-ink">insights</span>
                <span>Explore funds</span>
              </motion.button>
            </div>

            <dl className="pt-5 grid grid-cols-3 gap-5 border-t border-line">
              {[
                { label: 'Assets in custody', value: '45.2M XAF', note: '100% segregated', tone: 'text-accent' },
                { label: 'Active investors', value: '1,248+', note: 'CEMAC region', tone: 'text-accent' },
                { label: 'Avg. historical yield', value: '12.4% / yr', note: 'Net of all fees', tone: 'text-gold-ink' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[11px] uppercase tracking-wider text-ink-3 font-bold">{stat.label}</dt>
                  <dd className={`text-xl sm:text-2xl font-extrabold font-mono mt-1 ${stat.tone}`}>{stat.value}</dd>
                  <dd className="text-[10px] text-pos font-semibold mt-0.5">{stat.note}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Portfolio preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="lg:col-span-5"
            aria-hidden="true"
          >
            <div className="relative w-full rounded-3xl border border-gold/40 shadow-2xl bg-surface p-5 lg:p-6 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald via-gold to-emerald"></div>

              <div className="flex justify-between items-center pb-4 border-b border-line-2 mt-1.5">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-emerald text-gold flex items-center justify-center font-bold text-sm">
                    SN
                  </span>
                  <div>
                    <p className="text-xs font-bold text-ink">Samuel E. Nguema</p>
                    <p className="text-[10px] text-pos flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-pos"></span>
                      Verified · Tier 2
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-accent-bg border border-accent/15 px-2.5 py-1 rounded-full text-accent font-bold">
                  BVMAC
                </span>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald to-emerald-2 text-on-emerald relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gold/10 blur-xl"></div>
                <div className="flex justify-between items-start gap-3 relative">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gold tracking-wider">
                      Total portfolio value
                    </span>
                    <p className="text-2xl sm:text-3xl font-extrabold font-mono mt-1">2,450,000 XAF</p>
                  </div>
                  <span className="px-2 py-1 bg-gold/20 border border-gold/40 rounded-lg text-[10px] font-bold text-gold shrink-0">
                    +14.8% YTD
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs relative">
                  <div>
                    <span className="text-on-emerald/60 text-[10px]">Available</span>
                    <p className="font-bold font-mono">1,200,000 XAF</p>
                  </div>
                  <div>
                    <span className="text-on-emerald/60 text-[10px]">Invested</span>
                    <p className="font-bold font-mono text-gold">1,250,000 XAF</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-ink">Compound performance</span>
                  <span className="text-pos font-bold">+168,450 XAF paid out</span>
                </div>
                <div className="h-28 w-full bg-surface-2 rounded-xl p-2 border border-line-2">
                  <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none" role="img">
                    <defs>
                      <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--gf-accent)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--gf-accent)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,85 Q40,75 80,60 T160,45 T240,25 T300,8 L300,100 L0,100 Z" fill="url(#heroGrad)" />
                    <path
                      d="M0,85 Q40,75 80,60 T160,45 T240,25 T300,8"
                      fill="none"
                      stroke="var(--gf-accent)"
                      strokeWidth="2.5"
                    />
                    <circle cx="160" cy="45" r="3" fill="var(--gf-gold)" stroke="var(--gf-accent)" strokeWidth="1.5" />
                    <circle cx="240" cy="25" r="3" fill="var(--gf-gold)" stroke="var(--gf-accent)" strokeWidth="1.5" />
                    <circle cx="296" cy="9" r="4" fill="var(--gf-pos)" stroke="var(--gf-surface)" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-line-2 flex justify-between items-center gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-gold/30 text-gold-ink flex items-center justify-center font-bold text-xs shrink-0">
                    M
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-ink truncate">MTN Mobile Money cleared</p>
                    <p className="text-[9px] text-ink-3 font-mono">GF-DP-882910</p>
                  </div>
                </div>
                <span className="font-bold font-mono text-pos bg-pos-bg px-2 py-0.5 rounded text-xs shrink-0">
                  +100,000
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-8 bg-surface-2 border-b border-line">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <h2 className="text-center text-xs font-bold uppercase tracking-widest text-ink-3 mb-6">
            Banking, custody &amp; clearing partners
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="p-3 rounded-xl border border-line bg-surface flex flex-col items-center justify-center text-center hover:border-accent transition-colors group"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-accent group-hover:scale-110 transition-transform">
                  {partner.icon}
                </span>
                <p className="text-xs font-extrabold text-ink mt-1 truncate w-full">{partner.name}</p>
                <p className="text-[10px] text-ink-3 truncate w-full">{partner.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 bg-canvas border-b border-line">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold text-gold-ink tracking-widest">How it works</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-ink mt-1.5 font-display">
              Three steps to build wealth
            </h2>
            <p className="text-sm text-ink-2 mt-2">
              From an instant mobile money deposit to institutional asset growth and flexible redemption.
            </p>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, index) => (
              <motion.li
                key={step.title}
                whileHover={{ y: -4 }}
                className={`bg-surface p-7 rounded-3xl shadow-sm hover:shadow-xl transition-all relative flex flex-col justify-between ${
                  step.featured ? 'border-2 border-gold' : 'border border-line'
                }`}
              >
                <div>
                  <span className="w-12 h-12 bg-emerald text-gold rounded-2xl flex items-center justify-center mb-5 font-bold text-lg">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-extrabold text-ink mb-2">{step.title}</h3>
                  <p className="text-sm text-ink-2 leading-relaxed">{step.body}</p>
                </div>
                <p
                  className={`mt-6 pt-4 border-t border-line-2 text-[11px] font-bold flex items-center gap-1.5 ${
                    step.featured ? 'text-gold-ink' : 'text-accent'
                  }`}
                >
                  {step.note}
                  <span aria-hidden="true" className="material-symbols-outlined text-[14px]">{step.icon}</span>
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Featured plans */}
      <section className="py-16 md:py-20 bg-surface border-b border-line">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-gold-ink">
                Institutional due diligence
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-ink mt-1.5 font-display">
                Curated regional portfolios
              </h2>
              <p className="text-sm text-ink-2 mt-1.5">
                Asset-backed allocations vetted under COSUMAF investor protection standards.
              </p>
            </div>
            <button
              onClick={onExplorePlans}
              className="text-xs font-bold text-accent flex items-center gap-1.5 group bg-surface-2 px-4 py-2.5 rounded-xl border border-line hover:bg-surface-3 transition-colors shrink-0"
            >
              View all {plans.length} portfolios
              <span aria-hidden="true" className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.slice(0, 3).map((plan) => {
              const badge = riskBadge(plan.riskLevel);
              return (
                <motion.article
                  whileHover={{ y: -6 }}
                  key={plan.id}
                  className="bg-surface-2 rounded-3xl border border-line p-6 flex flex-col justify-between hover:border-accent transition-all hover:shadow-xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 inset-x-0 h-1.5" style={{ backgroundColor: plan.accentColor }}></div>

                  <div>
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${badge.className}`}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[14px]">{badge.icon}</span>
                        {plan.riskLevel} risk
                      </span>
                      <span aria-hidden="true" className="material-symbols-outlined text-2xl text-accent group-hover:scale-110 transition-transform">
                        {plan.iconName}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-ink mb-1.5">{plan.name}</h3>
                    <p className="text-xs text-ink-2 mb-5">{plan.description}</p>

                    <dl className="space-y-3 mb-6 bg-surface p-4 rounded-2xl border border-line-2">
                      <div className="flex justify-between items-baseline">
                        <dt className="text-xs text-ink-3 font-semibold">Projected yield</dt>
                        <dd className="text-2xl font-extrabold text-accent font-mono">
                          {plan.projectedReturn}%
                          <span className="text-xs font-normal text-ink-3"> / yr</span>
                        </dd>
                      </div>
                      <div className="flex justify-between text-xs pt-1 border-t border-line-2">
                        <dt className="text-ink-3">Minimum</dt>
                        <dd className="font-bold text-ink font-mono">{plan.minInvestment.toLocaleString()} XAF</dd>
                      </div>
                      <div className="flex justify-between text-xs">
                        <dt className="text-ink-3">Term</dt>
                        <dd className="font-bold text-ink">{plan.termMonths} months</dd>
                      </div>
                    </dl>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectPlan(plan)}
                    className="w-full py-3 bg-surface border border-accent text-accent rounded-xl text-xs font-extrabold hover:bg-emerald hover:text-on-emerald hover:border-emerald transition-colors flex items-center justify-center gap-2"
                  >
                    View prospectus
                    <span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </motion.button>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Return simulator */}
      <section id="simulator" className="py-16 md:py-20 bg-canvas border-b border-line">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="bg-surface rounded-3xl border border-line p-6 md:p-10 shadow-sm">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-extrabold uppercase tracking-widest text-gold-ink">
                Return simulator
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-ink mt-1.5 font-display">
                Model your returns
              </h2>
              <p className="text-sm text-ink-2 mt-2">
                Forecast compound outcomes in XAF from historical regional fund yields and holding periods.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-7">
                <fieldset>
                  <legend className="block text-xs font-extrabold text-ink mb-2.5 uppercase tracking-wider">
                    Target strategy
                  </legend>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {plans.map((plan) => (
                      <label
                        key={plan.id}
                        className={`p-3.5 rounded-2xl border text-left text-xs cursor-pointer transition-colors ${
                          calcPlanId === plan.id
                            ? 'border-emerald bg-emerald text-on-emerald'
                            : 'border-line bg-surface text-ink hover:bg-surface-2'
                        }`}
                      >
                        <input
                          type="radio"
                          name="calc-plan"
                          value={plan.id}
                          checked={calcPlanId === plan.id}
                          onChange={() => setCalcPlanId(plan.id)}
                          className="sr-only"
                        />
                        <span className="block font-bold truncate">{plan.name}</span>
                        <span
                          className={`block text-[11px] mt-0.5 font-bold ${
                            calcPlanId === plan.id ? 'text-gold' : 'text-gold-ink'
                          }`}
                        >
                          {plan.projectedReturn}% projected
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <div className="flex justify-between items-center mb-2 gap-3">
                    <label htmlFor="calc-amount" className="text-xs font-extrabold text-ink uppercase tracking-wider">
                      Initial capital
                    </label>
                    <output
                      htmlFor="calc-amount"
                      className="text-base font-extrabold text-accent font-mono bg-accent-bg px-3 py-1 rounded-lg"
                    >
                      {calcAmount.toLocaleString()} XAF
                    </output>
                  </div>
                  <input
                    id="calc-amount"
                    type="range"
                    min={50000}
                    max={10000000}
                    step={50000}
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="w-full h-2.5 bg-surface-3 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-ink-3 mt-1 font-mono font-semibold">
                    <span>50k</span>
                    <span>5M</span>
                    <span>10M</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2 gap-3">
                    <label htmlFor="calc-months" className="text-xs font-extrabold text-ink uppercase tracking-wider">
                      Holding term
                    </label>
                    <output
                      htmlFor="calc-months"
                      className="text-base font-extrabold text-accent font-mono bg-accent-bg px-3 py-1 rounded-lg"
                    >
                      {calcMonths} months
                    </output>
                  </div>
                  <input
                    id="calc-months"
                    type="range"
                    min={6}
                    max={36}
                    step={6}
                    value={calcMonths}
                    onChange={(e) => setCalcMonths(Number(e.target.value))}
                    className="w-full h-2.5 bg-surface-3 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-ink-3 mt-1 font-mono font-semibold">
                    <span>6</span>
                    <span>18</span>
                    <span>36</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-emerald to-emerald-3 text-on-emerald p-6 rounded-3xl border border-gold/40 shadow-xl relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-2xl pointer-events-none"
                  aria-hidden="true"
                ></div>

                <div className="relative">
                  <span className="text-[11px] uppercase font-bold text-gold tracking-widest">
                    Projected value at maturity
                  </span>
                  <p className="text-3xl sm:text-4xl font-extrabold mt-1.5 font-mono">
                    {estimatedTotal.toLocaleString()} XAF
                  </p>

                  <dl className="mt-6 pt-5 border-t border-white/15 space-y-2.5 text-xs">
                    <div className="flex justify-between text-on-emerald/80 gap-3">
                      <dt>Initial principal</dt>
                      <dd className="font-mono font-bold text-on-emerald">{calcAmount.toLocaleString()} XAF</dd>
                    </div>
                    <div className="flex justify-between text-gold font-bold gap-3">
                      <dt>Estimated yield (+{activeCalcPlan.projectedReturn}%)</dt>
                      <dd className="font-mono">+{projectedGain.toLocaleString()} XAF</dd>
                    </div>
                    <div className="flex justify-between text-on-emerald/70 gap-3">
                      <dt>Monthly run-rate</dt>
                      <dd className="font-mono">~{monthlyPayout.toLocaleString()} XAF</dd>
                    </div>
                    <div className="flex justify-between text-on-emerald/50 text-[11px] pt-1 gap-3">
                      <dt>Management fee</dt>
                      <dd>{activeCalcPlan.managementFeePercent}% / yr (factored in)</dd>
                    </div>
                  </dl>

                  <div className="mt-7 pt-5 border-t border-white/15">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectPlan(activeCalcPlan)}
                      className="w-full py-3.5 bg-gold text-on-gold font-extrabold text-xs rounded-xl hover:bg-gold-2 transition-colors flex items-center justify-center gap-2"
                    >
                      Invest in {activeCalcPlan.name}
                      <span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </motion.button>
                    <p className="text-[10px] text-on-emerald/60 text-center mt-2.5">
                      Projections follow COSUMAF financial modelling guidelines and are not guarantees.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-surface border-b border-line">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold text-gold-ink tracking-widest">Investor voices</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-ink mt-1.5 font-display">
              Trusted across Central Africa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial) => (
              <motion.figure
                key={testimonial.name}
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl border border-line bg-surface-2 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <figcaption className="flex items-center gap-3.5 mb-4">
                    <span className="w-11 h-11 rounded-full bg-emerald text-gold flex items-center justify-center font-bold text-sm shrink-0">
                      {testimonial.name
                        .split(' ')
                        .slice(-2)
                        .map((part) => part[0])
                        .join('')}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold text-ink truncate">{testimonial.name}</span>
                      <span className="block text-xs text-ink-3 truncate">{testimonial.role}</span>
                      <span className="block text-[10px] text-accent font-bold truncate">{testimonial.location}</span>
                    </span>
                  </figcaption>

                  <blockquote className="text-xs text-ink-2 leading-relaxed italic mb-5">
                    “{testimonial.comment}”
                  </blockquote>
                </div>

                <dl className="p-3 bg-surface rounded-2xl border border-line-2 text-[11px] space-y-1">
                  <div className="flex justify-between text-ink-3 gap-2">
                    <dt>Allocated</dt>
                    <dd className="font-bold text-ink font-mono">{testimonial.amount}</dd>
                  </div>
                  <div className="flex justify-between text-pos font-bold gap-2">
                    <dt>Realised</dt>
                    <dd className="font-mono">{testimonial.yieldEarned}</dd>
                  </div>
                </dl>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-16 md:py-20 bg-emerald-3 text-on-emerald border-b border-gold/20">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-3.5 py-1 text-xs font-bold text-gold">
              <span aria-hidden="true" className="material-symbols-outlined text-sm">lock</span>
              Four layers of capital protection
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
              Bank-grade security &amp; legal segregation
            </h2>

            <p className="text-sm text-on-emerald/80 leading-relaxed">
              Every franc of your capital is isolated from operating funds, protected by strong cryptography, and
              audited under CEMAC market directives.
            </p>

            <ul className="space-y-4 pt-1">
              {SAFEGUARDS.map((item) => (
                <li key={item.title} className="flex items-start gap-4">
                  <span className="w-9 h-9 rounded-xl bg-gold text-on-gold flex items-center justify-center shrink-0">
                    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </span>
                  <div>
                    <h3 className="text-sm font-bold">{item.title}</h3>
                    <p className="text-xs text-on-emerald/70 mt-0.5 leading-relaxed">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 bg-white/5 border border-white/15 p-7 rounded-3xl backdrop-blur-md">
            <span className="w-16 h-16 rounded-2xl bg-gold text-on-gold flex items-center justify-center mb-5">
              <span aria-hidden="true" className="material-symbols-outlined text-3xl">verified_user</span>
            </span>
            <h3 className="text-xl font-bold">COSUMAF accredited asset manager</h3>
            <p className="text-xs text-on-emerald/70 mt-2 leading-relaxed">
              Licence registration SGP-04/2023. Authorised to structure and distribute collective investment schemes
              and fixed-income portfolios across Central Africa.
            </p>
            <dl className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
                <dd className="text-base font-extrabold text-gold font-mono">100%</dd>
                <dt className="text-[10px] text-on-emerald/70">Capital segregation</dt>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
                <dd className="text-base font-extrabold text-gold font-mono">0.0%</dd>
                <dt className="text-[10px] text-on-emerald/70">Historical default rate</dt>
              </div>
            </dl>
            <button
              onClick={() => onOpenLegal('cosumaf')}
              className="mt-5 text-xs font-bold text-gold hover:underline flex items-center gap-1"
            >
              Read the licence details
              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-canvas">
        <div className="max-w-[900px] mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-extrabold text-gold-ink tracking-widest">Investor clarity</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-ink mt-1.5 font-display">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <div key={faq.q} className="bg-surface rounded-2xl border border-line overflow-hidden">
                <h3>
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    aria-expanded={activeFaq === index}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 font-bold text-sm text-ink hover:text-accent transition-colors"
                  >
                    {faq.q}
                    <span aria-hidden="true"
                      className={`material-symbols-outlined text-ink-3 transition-transform shrink-0 ${
                        activeFaq === index ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                </h3>
                {activeFaq === index && (
                  <p className="px-5 pb-5 text-xs text-ink-2 leading-relaxed border-t border-line-2 pt-3">{faq.a}</p>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-ink-3 mt-8">
            Still have questions?{' '}
            <button onClick={() => onOpenLegal('risk')} className="text-accent font-bold hover:underline">
              Read the full risk disclosure
            </button>
          </p>
        </div>
      </section>
    </div>
  );
};
