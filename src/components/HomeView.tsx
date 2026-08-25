import { useState } from 'react';
import { motion } from 'motion/react';
import { InvestmentPlan } from '../types';
import { MAX_TERM_DAYS, STAKE_LADDER, TERM_DAYS_LADDER, payoutFor, profitForRung } from '../lib/commitment';
import { DAILY_CHECKIN_XAF, MIN_INVESTMENT_XAF, REFERRAL_REWARD_XAF } from '../lib/constants';
import { currency } from '../lib/transactions';

interface HomeViewProps {
  plans: InvestmentPlan[];
  onSelectPlan: (plan: InvestmentPlan) => void;
  onExplorePlans: () => void;
  onOpenDeposit: () => void;
  onOpenLegal: (topic: string) => void;
}

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
    body: 'Open an area — agriculture, real estate, technology, government bonds — and pick a package. Each one names the amount, the number of days and the profit up front.',
    note: 'From 5,000 XAF',
    icon: 'trending_up',
    featured: true,
  },
  {
    title: 'Collect audited returns',
    body: 'When the days are up, your money and its profit go back into your balance. Withdraw to your phone or bank from 5,000 XAF.',
    note: 'In 30 days or less',
    icon: 'account_balance_wallet',
  },
];

const TESTIMONIALS = [
  {
    name: 'Dr. Martin Mbarga',
    role: 'Chief medical officer',
    location: 'Douala, Cameroon',
    amount: '25,000 XAF package',
    yieldEarned: '+4,000 XAF in 20 days',
    comment:
      'I knew the exact day my money was coming back and exactly how much. It landed in my MTN MoMo wallet the same afternoon I asked for it.',
  },
  {
    name: 'Jeanne-Marie Nguesso',
    role: 'Managing director, logistics',
    location: 'Libreville, Gabon',
    amount: '15,000 XAF package',
    yieldEarned: '+1,800 XAF in 12 days',
    comment:
      'No small print and no percentages to work out. The page told me what I put in and what I collect, and that is exactly what happened.',
  },
  {
    name: 'Christian Kouassi',
    role: 'Senior software engineer',
    location: 'Yaoundé & diaspora',
    amount: '5,000 XAF package',
    yieldEarned: '+400 XAF in 5 days',
    comment:
      'I started with the smallest package to see if it was real. Five days later the money was back with its profit, so now I run one every week.',
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
    q: 'How is my money protected?',
    a: 'Your money is held in separate trust accounts at CEMAC commercial banks and regional depositories. It is never mixed with the money GrowthFund runs on, and the separation is supervised by COSUMAF.',
  },
  {
    q: 'How do deposits and withdrawals work?',
    a: 'Add money in XAF with MTN Mobile Money, Orange Money, Express Union or a bank transfer. Withdrawals start at 5,000 XAF and go in steps of 5,000 — 5,000, 10,000, 15,000, 20,000, 25,000 — straight back to your verified number or bank account.',
  },
  {
    q: 'What is the minimum amount to start?',
    a: 'Every area starts with a 5,000 XAF package that runs for 5 days. Bigger packages run longer and pay more — 10,000 XAF for 8 days, 15,000 XAF for 12 days, and so on — and nothing on the platform runs longer than 30 days.',
  },
  {
    q: 'Are returns guaranteed?',
    a: 'No. The profit shown on a package is the target it is built to pay, based on the real assets behind it — building sites, export contracts, treasury bills. We hold reserves and run every project under supervision, but investing always carries risk.',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  plans,
  onSelectPlan,
  onExplorePlans,
  onOpenDeposit,
  onOpenLegal,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <div className="flex flex-col">
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="gf-motif gf-motif--notes"></div>
        </div>

        <div className="max-w-[1240px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="inline-flex items-center gap-2 bg-surface-2 border border-gold/50 rounded-full px-3.5 py-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald text-gold-on-emerald flex items-center justify-center shrink-0">
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
              Put in from 5,000 XAF, wait a set number of days, and collect your money with its profit. Every
              package tells you all three numbers before you commit — nothing to work out, nothing hidden.
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
                { label: 'Start from', value: '5,000 XAF', note: 'Back in 5 days', tone: 'text-accent' },
                { label: 'Active investors', value: '1,248+', note: 'CEMAC region', tone: 'text-accent' },
                { label: 'Longest wait', value: `${MAX_TERM_DAYS} days`, note: 'Never longer', tone: 'text-gold-ink' },
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
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-2 via-gold to-emerald-2"></div>

              <div className="flex justify-between items-center pb-4 border-b border-line-2 mt-1.5">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-emerald text-gold-on-emerald flex items-center justify-center font-bold text-sm">
                    SN
                  </span>
                  <div>
                    <p className="text-xs font-bold text-ink">Samuel E. Nguema</p>
                    <p className="text-[10px] text-pos flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-pos"></span>
                      Verified
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-accent-bg border border-accent/15 px-2.5 py-1 rounded-full text-accent font-bold">
                  BVMAC
                </span>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald to-emerald-2 text-on-emerald relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-tint/10 blur-xl"></div>
                <div className="flex justify-between items-start gap-3 relative">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gold-on-emerald tracking-wider">
                      Total portfolio value
                    </span>
                    <p className="text-2xl sm:text-3xl font-extrabold font-mono mt-1">127,500 XAF</p>
                  </div>
                  <span className="px-2 py-1 bg-gold-on-emerald/15 border border-gold-on-emerald/35 rounded-lg text-[10px] font-bold text-gold-on-emerald shrink-0">
                    +12,400 earned
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-on-emerald/15 grid grid-cols-2 gap-2 text-xs relative">
                  <div>
                    <span className="text-on-emerald/80 text-[10px]">Available</span>
                    <p className="font-bold font-mono">82,500 XAF</p>
                  </div>
                  <div>
                    <span className="text-on-emerald/80 text-[10px]">Invested</span>
                    <p className="font-bold font-mono text-gold-on-emerald">45,000 XAF</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-ink">Profit paid out</span>
                  <span className="text-pos font-bold">+12,400 XAF</span>
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
                  +50,000
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
                  <span className="w-12 h-12 bg-emerald text-gold-on-emerald rounded-2xl flex items-center justify-center mb-5 font-bold text-lg">
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
                Where your money goes
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-ink mt-1.5 font-display">
                Pick an area, then a package
              </h2>
              <p className="text-sm text-ink-2 mt-1.5">
                Real projects across Central Africa, each broken into packages you can take on their own.
              </p>
            </div>
            <button
              onClick={onExplorePlans}
              className="text-xs font-bold text-accent flex items-center gap-1.5 group bg-surface-2 px-4 py-2.5 rounded-xl border border-line hover:bg-surface-3 transition-colors shrink-0"
            >
              View all {plans.length} areas
              <span aria-hidden="true" className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.slice(0, 3).map((plan) => {
              // Smallest first here too: the card quotes the entry package, so
              // it has to be the entry package whatever order the data is in.
              const packages = [...plan.subInvestments].sort((a, b) => a.amount - b.amount);
              const entry = packages[0];
              return (
                <motion.article
                  whileHover={{ y: -6 }}
                  key={plan.id}
                  className="bg-surface-2 rounded-3xl border border-line p-6 flex flex-col justify-between hover:border-accent transition-all hover:shadow-xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 inset-x-0 h-1.5" style={{ backgroundColor: plan.accentColor }}></div>

                  <div>
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 bg-accent-bg text-accent">
                        <span aria-hidden="true" className="material-symbols-outlined text-[14px]">inventory_2</span>
                        {packages.length} packages
                      </span>
                      <span aria-hidden="true" className="material-symbols-outlined text-2xl text-accent group-hover:scale-110 transition-transform">
                        {plan.iconName}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-ink mb-1.5">{plan.name}</h3>
                    <p className="text-xs text-ink-2 mb-5">{plan.description}</p>

                    {/* The smallest package, stated in full: the three numbers
                        an investor actually decides on. */}
                    <dl className="space-y-3 mb-6 bg-surface p-4 rounded-2xl border border-line-2">
                      <div className="flex justify-between items-baseline">
                        <dt className="text-xs text-ink-3 font-semibold">Starts at</dt>
                        <dd className="text-2xl font-extrabold text-accent font-mono">
                          {entry.amount.toLocaleString()}
                          <span className="text-xs font-normal text-ink-3"> XAF</span>
                        </dd>
                      </div>
                      <div className="flex justify-between text-xs pt-1 border-t border-line-2">
                        <dt className="text-ink-3">Runs for</dt>
                        <dd className="font-bold text-ink">{entry.durationDays} days</dd>
                      </div>
                      <div className="flex justify-between text-xs">
                        <dt className="text-ink-3">You collect</dt>
                        <dd className="font-bold text-pos font-mono">{currency(payoutFor(entry))}</dd>
                      </div>
                    </dl>

                    {/* Name the opportunities inside the plan, so the category
                        reads as something concrete before the prospectus opens. */}
                    <ul className="flex flex-wrap gap-1.5 mb-6">
                      {packages.slice(0, 4).map((sub) => (
                        <li
                          key={sub.id}
                          className="px-2.5 py-1 rounded-full bg-surface border border-line-2 text-[10px] font-bold text-ink-2"
                        >
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectPlan(plan)}
                    className="w-full py-3 bg-surface border border-accent text-accent rounded-xl text-xs font-extrabold hover:bg-emerald hover:text-on-emerald hover:border-emerald transition-colors flex items-center justify-center gap-2"
                  >
                    See the packages
                    <span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </motion.button>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* The ladder — the one rule that governs every package on the platform */}
      <section id="ladder" className="py-16 md:py-20 bg-canvas border-b border-line">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="bg-surface rounded-3xl border border-line p-6 md:p-10 shadow-sm">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-extrabold uppercase tracking-widest text-gold-ink">
                How much, how long, how much back
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-ink mt-1.5 font-display">
                The whole rule, one line each
              </h2>
              <p className="text-sm text-ink-2 mt-2">
                Put in more and it runs longer and pays more. That is the entire system — the same in every area of
                the platform, and nothing runs past {MAX_TERM_DAYS} days.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[520px]">
                <thead>
                  <tr className="bg-surface-2 border-b border-line-2 text-[11px] font-bold uppercase tracking-wider text-ink-3">
                    <th scope="col" className="p-4">You put in</th>
                    <th scope="col" className="p-4">It runs for</th>
                    <th scope="col" className="p-4">Profit</th>
                    <th scope="col" className="p-4 text-right">You collect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-2 text-sm">
                  {STAKE_LADDER.map((stake, index) => {
                    const profit = profitForRung(index, stake);
                    return (
                      <tr key={stake} className="hover:bg-surface-2 transition-colors">
                        <td className="p-4 font-mono font-bold text-ink">{stake.toLocaleString()} XAF</td>
                        <td className="p-4 font-bold text-gold-ink">{TERM_DAYS_LADDER[index]} days</td>
                        <td className="p-4 font-mono text-pos font-semibold">+{profit.toLocaleString()} XAF</td>
                        <td className="p-4 text-right font-mono font-extrabold text-accent">
                          {(stake + profit).toLocaleString()} XAF
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: 'savings',
                  title: `Start at ${MIN_INVESTMENT_XAF.toLocaleString()} XAF`,
                  body: 'The smallest package finishes in five days, so you can watch a whole cycle before committing more.',
                },
                {
                  icon: 'calendar_month',
                  title: `${DAILY_CHECKIN_XAF} XAF every day`,
                  body: 'Open the Check-in tab once a day and collect it. It lands in your balance immediately.',
                },
                {
                  icon: 'card_giftcard',
                  title: `${REFERRAL_REWARD_XAF} XAF per friend`,
                  body: 'Share your invite code. Every friend who joins and verifies pays you a gift.',
                },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-2xl border border-line bg-surface-2">
                  <span className="w-10 h-10 rounded-xl bg-emerald text-gold-on-emerald flex items-center justify-center mb-3">
                    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </span>
                  <h3 className="text-sm font-extrabold text-ink">{item.title}</h3>
                  <p className="text-xs text-ink-2 mt-1 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-line-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-ink-3 max-w-md">
                Profit figures are the target each package is built to pay. Investing carries risk, and money stays
                in until the package finishes.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExplorePlans}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald text-on-emerald font-extrabold text-xs rounded-xl hover:bg-emerald-2 transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                Browse every package
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </motion.button>
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
                    <span className="w-11 h-11 rounded-full bg-emerald text-gold-on-emerald flex items-center justify-center font-bold text-sm shrink-0">
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
      <section className="py-16 md:py-20 bg-emerald-3 text-on-emerald border-b border-on-emerald/15">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 bg-gold-on-emerald/15 border border-gold-on-emerald/35 rounded-full px-3.5 py-1 text-xs font-bold text-gold-on-emerald">
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
                  <span className="w-9 h-9 rounded-xl bg-gold-on-emerald text-gold-2 flex items-center justify-center shrink-0">
                    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </span>
                  <div>
                    <h3 className="text-sm font-bold">{item.title}</h3>
                    <p className="text-xs text-on-emerald/80 mt-0.5 leading-relaxed">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 bg-on-emerald/5 border border-on-emerald/15 p-7 rounded-3xl backdrop-blur-md">
            <span className="w-16 h-16 rounded-2xl bg-gold-on-emerald text-gold-2 flex items-center justify-center mb-5">
              <span aria-hidden="true" className="material-symbols-outlined text-3xl">verified_user</span>
            </span>
            <h3 className="text-xl font-bold">COSUMAF accredited asset manager</h3>
            <p className="text-xs text-on-emerald/80 mt-2 leading-relaxed">
              Licence registration SGP-04/2023. Authorised to structure and distribute collective investment schemes
              and fixed-income portfolios across Central Africa.
            </p>
            <dl className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-3 bg-on-emerald/10 rounded-xl border border-on-emerald/10 text-center">
                <dd className="text-base font-extrabold text-gold-on-emerald font-mono">Separate</dd>
                <dt className="text-[10px] text-on-emerald/80">Trust accounts, never mixed</dt>
              </div>
              <div className="p-3 bg-on-emerald/10 rounded-xl border border-on-emerald/10 text-center">
                <dd className="text-base font-extrabold text-gold-on-emerald font-mono">Every payout</dd>
                <dt className="text-[10px] text-on-emerald/80">Made on its due date</dt>
              </div>
            </dl>
            <button
              onClick={() => onOpenLegal('cosumaf')}
              className="mt-5 text-xs font-bold text-gold-on-emerald hover:underline flex items-center gap-1"
            >
              Read the licence details
              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-16 md:py-20 bg-canvas">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="gf-motif gf-motif--coins"></div>
        </div>

        <div className="relative max-w-[900px] mx-auto px-4 md:px-8">
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
