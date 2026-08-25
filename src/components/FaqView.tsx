import { useState } from 'react';
import {
  DAILY_CHECKIN_XAF,
  MIN_INVESTMENT_XAF,
  MIN_WITHDRAWAL_XAF,
  REFERRAL_REWARD_XAF,
  WITHDRAWAL_FEE_XAF,
  WITHDRAWAL_PRESETS,
  WITHDRAWAL_STEP_XAF,
} from '../lib/constants';
import { MAX_TERM_DAYS } from '../lib/commitment';
import { PageBackdrop } from './PageBackdrop';

interface FaqViewProps {
  onExplorePlans: () => void;
  onOpenSupport: () => void;
  onOpenLegal: (topic: string) => void;
}

interface Faq {
  q: string;
  a: string;
}

/**
 * The questions, grouped by what the reader is actually trying to do.
 *
 * Figures are read from the same constants the product enforces, so an answer
 * cannot quietly go stale when a rule changes.
 */
const GROUPS: { id: string; title: string; icon: string; faqs: Faq[] }[] = [
  {
    id: 'investing',
    title: 'Investing',
    icon: 'trending_up',
    faqs: [
      {
        q: 'What is the minimum amount to start?',
        a: `Every area starts with a ${MIN_INVESTMENT_XAF.toLocaleString()} XAF package that runs for 5 days. Bigger packages run longer and pay more — 10,000 XAF for 8 days, 15,000 XAF for 12 days, and so on — and nothing on the platform runs longer than ${MAX_TERM_DAYS} days.`,
      },
      {
        q: 'How do I choose what to invest in?',
        a: 'Open Invest, pick an area — Agriculture, Real Estate, Technology or Government Bonds — and you land on that area’s own page listing its packages, smallest first. Each package names what you put in, how many days it runs and what you collect, before you commit to anything.',
      },
      {
        q: 'Can I take my money out before the package finishes?',
        a: 'No. Money placed in a package stays in until its last day — that fixed term is what makes the profit possible. The longest any package runs is 30 days, and your money plus its profit lands back in your balance the moment the run finishes.',
      },
      {
        q: 'Are returns guaranteed?',
        a: 'No. The profit shown on a package is the target it is built to pay, based on the real assets behind it — building sites, export contracts, treasury bills. We hold reserves and run every project under supervision, but investing always carries risk, including the loss of capital.',
      },
      {
        q: 'What happens when a package finishes?',
        a: 'It shows as ready to collect under Investments in My money. Collecting moves your original amount and its profit into your available balance, where you can withdraw it or put it into another package.',
      },
    ],
  },
  {
    id: 'money',
    title: 'Deposits and withdrawals',
    icon: 'swap_horiz',
    faqs: [
      {
        q: 'How do I add money?',
        a: `Add money in XAF with MTN Mobile Money, Orange Money, Express Union Mobile or a bank transfer from Afriland, BGFIBank, Ecobank, UBA or Société Générale. The minimum deposit is ${MIN_INVESTMENT_XAF.toLocaleString()} XAF and deposits are free — what is charged to your wallet is exactly what lands in your balance.`,
      },
      {
        q: 'How do withdrawals work?',
        a: `Withdrawals start at ${MIN_WITHDRAWAL_XAF.toLocaleString()} XAF and go in steps of ${WITHDRAWAL_STEP_XAF.toLocaleString()} XAF — ${WITHDRAWAL_PRESETS.map((p) => p.toLocaleString()).join(', ')} and upward — straight back to your verified mobile money number or bank account. A flat ${WITHDRAWAL_FEE_XAF} XAF fee applies to each payout.`,
      },
      {
        q: 'Why can I not withdraw everything I have?',
        a: 'You can withdraw your available balance. Money currently inside a package is not part of that figure until the package finishes and you collect it — My money shows how much is still running and when the next one is due.',
      },
      {
        q: 'How long does a payout take?',
        a: 'Mobile money payouts are near-instant. Interbank transfers take one to two hours during business hours.',
      },
    ],
  },
  {
    id: 'rewards',
    title: 'Check-in and invites',
    icon: 'redeem',
    faqs: [
      {
        q: 'What is the daily check-in?',
        a: `Open the CheckIn tab in My money once a day and collect ${DAILY_CHECKIN_XAF} XAF straight into your available balance. One collection per calendar day — the button shows a countdown once you have taken today’s.`,
      },
      {
        q: 'How much is a referral worth?',
        a: `${REFERRAL_REWARD_XAF} XAF for every friend who signs up with your code and completes verification, credited to your balance. Your code and invite link are in the Invite & earn tab in My money.`,
      },
    ],
  },
  {
    id: 'account',
    title: 'Account and security',
    icon: 'shield',
    faqs: [
      {
        q: 'Why do I need to verify my identity?',
        a: 'Anti-money-laundering rules across the CEMAC zone require it before anyone can invest or withdraw. We need a government ID, a selfie matched against it, and a verified phone number. Verification usually completes in under 20 minutes.',
      },
      {
        q: 'How is my money protected?',
        a: 'Your money is held in separate trust accounts at CEMAC commercial banks and regional depositories. It is never mixed with the money GrowthFund runs on, and the separation is supervised by COSUMAF.',
      },
      {
        q: 'How do I keep my account secure?',
        a: 'Two-factor authentication is on by default and is required to authorise a withdrawal. You can switch between SMS codes and an authenticator app under Security & 2FA in your account menu.',
      },
    ],
  },
];

/**
 * Frequently asked questions, on their own page.
 *
 * These used to sit at the bottom of the home page, where they competed with
 * everything above them for a first-time visitor's attention. On a page of
 * their own they can be grouped by intent and answered in full.
 */
export const FaqView: React.FC<FaqViewProps> = ({ onExplorePlans, onOpenSupport, onOpenLegal }) => {
  /** Which answer is open, keyed `groupId:index` so one is open at a time. */
  const [openKey, setOpenKey] = useState<string | null>('investing:0');

  return (
    <div className="flex-1 p-4 md:p-10 bg-canvas relative">
      <PageBackdrop pair="fan" />

      <div className="max-w-[900px] mx-auto w-full relative z-10">
        <header className="mb-8">
          <span className="text-xs uppercase font-extrabold text-gold-ink tracking-widest">Investor clarity</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink mt-1.5 mb-2 tracking-tight font-display">
            Frequently asked questions
          </h1>
          <p className="text-sm text-ink-2 max-w-2xl leading-relaxed">
            Everything about putting money in, waiting out a package and taking it back out again. If your question
            is not here, an advisor can answer it directly.
          </p>
        </header>

        {/* Jump links: the page is long enough that four groups deserve an index. */}
        <nav aria-label="Question topics" className="flex flex-wrap gap-2 mb-8">
          {GROUPS.map((group) => (
            <a
              key={group.id}
              href={`#faq-${group.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-line text-xs font-bold text-ink hover:border-accent hover:text-accent transition-colors"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">{group.icon}</span>
              {group.title}
            </a>
          ))}
        </nav>

        <div className="space-y-8">
          {GROUPS.map((group) => (
            <section key={group.id} id={`faq-${group.id}`} className="scroll-mt-24">
              <h2 className="flex items-center gap-2.5 text-sm font-bold text-ink uppercase tracking-wider mb-3">
                <span className="w-8 h-8 rounded-lg bg-accent-bg text-accent flex items-center justify-center shrink-0">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">{group.icon}</span>
                </span>
                {group.title}
              </h2>

              <div className="space-y-2.5">
                {group.faqs.map((faq, index) => {
                  const key = `${group.id}:${index}`;
                  const open = openKey === key;
                  return (
                    <div key={faq.q} className="bg-surface rounded-2xl border border-line overflow-hidden shadow-sm">
                      <h3>
                        <button
                          onClick={() => setOpenKey(open ? null : key)}
                          aria-expanded={open}
                          className="w-full p-5 text-left flex justify-between items-center gap-4 font-bold text-sm text-ink hover:text-accent transition-colors"
                        >
                          {faq.q}
                          <span
                            aria-hidden="true"
                            className={`material-symbols-outlined text-ink-3 transition-transform shrink-0 ${
                              open ? 'rotate-180' : ''
                            }`}
                          >
                            expand_more
                          </span>
                        </button>
                      </h3>
                      {open && (
                        <p className="px-5 pb-5 text-xs text-ink-2 leading-relaxed border-t border-line-2 pt-3">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Still stuck */}
        <aside className="mt-10 bg-surface rounded-2xl border border-line shadow-sm p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h2 className="text-base font-extrabold text-ink">Still have a question?</h2>
            <p className="text-xs text-ink-2 mt-1 leading-relaxed max-w-md">
              Talk to an advisor, or read the full risk disclosure and fee schedule.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={onOpenSupport}
              className="flex-1 sm:flex-initial bg-emerald text-on-emerald text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-emerald-2 transition-colors flex items-center justify-center gap-1.5 gf-press"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">support_agent</span>
              Ask an advisor
            </button>
            <button
              onClick={() => onOpenLegal('risk')}
              className="flex-1 sm:flex-initial bg-surface border border-line text-ink text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-surface-2 transition-colors"
            >
              Risk disclosure
            </button>
            <button
              onClick={onExplorePlans}
              className="flex-1 sm:flex-initial bg-surface border border-line text-ink text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-surface-2 transition-colors"
            >
              See the packages
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
