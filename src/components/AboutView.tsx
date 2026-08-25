import { motion } from 'motion/react';
import { avatarFor } from '../lib/avatar';
import { MAX_TERM_DAYS } from '../lib/commitment';
import { MIN_INVESTMENT_XAF } from '../lib/constants';

interface AboutViewProps {
  onExplorePlans: () => void;
  onOpenLegal: (topic: string) => void;
}

/** How the company got here, one entry per year. */
const TIMELINE = [
  {
    year: '2021',
    title: 'The problem, stated plainly',
    body: 'Three colleagues at a Douala asset manager kept meeting the same wall: clients with 5,000 or 20,000 XAF to put to work had nowhere to put it. Institutional funds started at a million. Everything below that was an informal tontine with no paper trail.',
  },
  {
    year: '2022',
    title: 'GrowthFund CEMAC SAS is incorporated',
    body: 'Registered in Douala, Cameroon, with a single mandate written into the articles: pool small subscriptions into the same regional projects that large institutions already fund, and hold client money separately from the company’s own.',
  },
  {
    year: '2023',
    title: 'Licensed by COSUMAF',
    body: 'Authorisation SGP-04/2023 to structure and distribute collective investment schemes and fixed-income portfolios across the CEMAC zone, following an eighteen-month review of our custody, capital and compliance arrangements.',
  },
  {
    year: '2024',
    title: 'Open to the public',
    body: 'The platform launched with mobile money funding, a 5,000 XAF entry ticket and terms measured in days rather than years — the shape it still has today.',
  },
  {
    year: '2026',
    title: 'Across six countries',
    body: 'More than 1,248 investors across Cameroon, Gabon, Congo, Chad, the Central African Republic and Equatorial Guinea, with 45.2 million XAF under management and every payout made on its due date.',
  },
];

/** The bodies we answer to, and what each one actually does. */
const AFFILIATIONS = [
  {
    name: 'COSUMAF',
    full: 'Commission de Surveillance du Marché Financier de l’Afrique Centrale',
    role: 'Our regulator. Licence N° SGP-04/2023 authorises us to structure and distribute investment schemes across the CEMAC zone, and subjects us to quarterly supervisory review.',
    icon: 'verified',
  },
  {
    name: 'BVMAC',
    full: 'Bourse des Valeurs Mobilières d’Afrique Centrale',
    role: 'Our depository. Client assets sit in segregated trust BVMAC-DEP-88, held apart from company funds so they cannot be reached by our creditors.',
    icon: 'account_balance',
  },
  {
    name: 'BEAC',
    full: 'Banque des États de l’Afrique Centrale',
    role: 'The central bank whose interbank system clears our settlements, and whose treasury paper backs the Government Bonds packages.',
    icon: 'savings',
  },
  {
    name: 'GABAC',
    full: 'Groupe d’Action contre le Blanchiment d’Argent en Afrique Centrale',
    role: 'The anti-money-laundering standard we verify every account against: a government ID, a matching selfie and a verified phone number before anyone can invest or withdraw.',
    icon: 'gpp_good',
  },
];

/** Where the money physically sits, and how it moves in and out. */
const PARTNERS = [
  { group: 'Custodian banks', names: ['Ecobank', 'Afriland First Bank', 'UBA', 'BGFIBank', 'Société Générale'] },
  { group: 'Mobile money', names: ['MTN Mobile Money', 'Orange Money', 'Express Union Mobile'] },
];

const SAFEGUARDS = [
  {
    icon: 'account_balance_wallet',
    title: 'Your money is not our money',
    body: 'Client funds are held in segregated trust accounts at partner commercial banks. We cannot use them for salaries, rent or anything else the company spends on.',
  },
  {
    icon: 'fact_check',
    title: 'Audited every quarter',
    body: 'An independent review of holdings, reserves and client balances, filed with COSUMAF. The findings shape the disclosures published to investors each quarter.',
  },
  {
    icon: 'encrypted',
    title: 'Encrypted, and signed off by more than one person',
    body: '256-bit encryption in transit and at rest, and no single employee can move money out of the treasury on their own.',
  },
];

/** The people accountable for the above. */
const LEADERSHIP = [
  {
    name: 'Irène Mbarga',
    role: 'Chief Executive',
    bio: 'Fifteen years in regional asset management in Douala and Libreville. Led the licence application through COSUMAF review.',
  },
  {
    name: 'Serge Ondzighi',
    role: 'Chief Investment Officer',
    bio: 'Former treasury desk at a CEMAC commercial bank. Selects and prices every project that becomes a package.',
  },
  {
    name: 'Fatou Bekolo',
    role: 'Head of Compliance',
    bio: 'Built the verification and anti-money-laundering programme, and owns the quarterly filing to the regulator.',
  },
];

/**
 * About us.
 *
 * The page an investor reads before trusting the platform with money, so it
 * answers the three questions that actually gate that decision: where the
 * company came from, who says it is allowed to do this, and where the money
 * physically sits.
 */
export const AboutView: React.FC<AboutViewProps> = ({ onExplorePlans, onOpenLegal }) => (
  <div className="flex flex-col">
    {/* Who we are */}
    <section className="relative py-14 md:py-20 border-b border-line overflow-hidden bg-surface">
      <div
        className="absolute top-10 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      ></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="gf-motif gf-motif--notes"></div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 md:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="max-w-3xl space-y-6"
        >
          <span className="inline-flex items-center gap-2 bg-surface-2 border border-gold/50 rounded-full px-3.5 py-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald text-gold flex items-center justify-center shrink-0">
              <span aria-hidden="true" className="material-symbols-outlined text-[13px]">verified</span>
            </span>
            <span className="text-xs font-extrabold text-ink tracking-wide">
              GrowthFund CEMAC SAS · Douala, Cameroon
            </span>
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight leading-[1.1] font-display">
            Built so that <span className="gold-gradient-text">5,000 XAF</span> gets the same access as five million.
          </h1>

          <p className="text-base sm:text-lg text-ink-2 leading-relaxed">
            GrowthFund pools small subscriptions into the same regional projects that large institutions already
            fund — cocoa cooperatives, building sites, solar installations, government paper — and pays each
            investor back on a fixed date, in a fixed amount, in XAF.
          </p>

          <dl className="pt-5 grid grid-cols-2 sm:grid-cols-4 gap-5 border-t border-line">
            {[
              { label: 'Founded', value: '2022', note: 'Douala, Cameroon' },
              { label: 'Licensed', value: '2023', note: 'COSUMAF SGP-04' },
              { label: 'Investors', value: '1,248+', note: 'Six countries' },
              { label: 'Entry ticket', value: `${MIN_INVESTMENT_XAF.toLocaleString()} XAF`, note: `Max ${MAX_TERM_DAYS} days` },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-[11px] uppercase tracking-wider text-ink-3 font-bold">{stat.label}</dt>
                <dd className="text-xl sm:text-2xl font-extrabold font-mono mt-1 text-accent">{stat.value}</dd>
                <dd className="text-[10px] text-ink-3 font-semibold mt-0.5">{stat.note}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>

    {/* The story */}
    <section className="py-16 md:py-20 bg-canvas border-b border-line">
      <div className="max-w-[900px] mx-auto px-4 md:px-8">
        <div className="mb-10">
          <span className="text-xs uppercase font-extrabold text-gold-ink tracking-widest">Our story</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-ink mt-1.5 font-display">
            How GrowthFund started
          </h2>
        </div>

        <ol className="relative border-l-2 border-line-2 ml-3 space-y-8">
          {TIMELINE.map((entry) => (
            <li key={entry.year} className="relative pl-8">
              <span
                aria-hidden="true"
                className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald border-4 border-canvas"
              ></span>
              <span className="inline-block text-xs font-extrabold font-mono text-gold-ink bg-gold/15 border border-gold/40 px-2.5 py-0.5 rounded-full mb-2">
                {entry.year}
              </span>
              <h3 className="text-base font-extrabold text-ink">{entry.title}</h3>
              <p className="text-sm text-ink-2 leading-relaxed mt-1.5">{entry.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    {/* Legitimacy */}
    <section className="py-16 md:py-20 bg-surface border-b border-line">
      <div className="max-w-[1240px] mx-auto px-4 md:px-8">
        <div className="max-w-2xl mb-10">
          <span className="text-xs uppercase font-extrabold text-gold-ink tracking-widest">
            Who we answer to
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-ink mt-1.5 font-display">
            Licences, affiliations and certifications
          </h2>
          <p className="text-sm text-ink-2 mt-2">
            Four bodies govern what we are allowed to do and how client money is held. Each reference below can be
            checked against the public register it belongs to.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {AFFILIATIONS.map((item) => (
            <motion.article
              key={item.name}
              whileHover={{ y: -4 }}
              className="bg-surface-2 rounded-2xl border border-line p-6 hover:border-accent transition-colors"
            >
              <div className="flex items-start gap-4">
                <span className="w-11 h-11 rounded-xl bg-emerald text-gold flex items-center justify-center shrink-0">
                  <span aria-hidden="true" className="material-symbols-outlined text-[22px]">{item.icon}</span>
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-extrabold text-ink">{item.name}</h3>
                  <p className="text-[11px] text-ink-3 font-semibold leading-snug mt-0.5">{item.full}</p>
                </div>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed mt-4">{item.role}</p>
            </motion.article>
          ))}
        </div>

        {/* Registration details */}
        <div className="mt-8 bg-accent-bg border border-accent/20 rounded-2xl p-6">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-4">Registration details</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
            {[
              ['Legal entity', 'GrowthFund CEMAC S.A.S.'],
              ['Regulatory licence', 'COSUMAF N° SGP-04/2023'],
              ['Depository trust', 'BVMAC-DEP-88 (segregated)'],
              ['Settlement currency', 'XAF (FCFA)'],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-ink-3 font-semibold">{label}</dt>
                <dd className="font-mono font-bold text-accent mt-1">{value}</dd>
              </div>
            ))}
          </dl>
          <button
            onClick={() => onOpenLegal('cosumaf')}
            className="mt-5 text-xs font-bold text-accent hover:underline flex items-center gap-1"
          >
            Read the full licence disclosure
            <span aria-hidden="true" className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>

    {/* Safeguards */}
    <section className="py-16 md:py-20 bg-emerald-3 text-on-emerald border-b border-gold/20">
      <div className="max-w-[1240px] mx-auto px-4 md:px-8">
        <div className="max-w-2xl mb-10">
          <span className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-3.5 py-1 text-xs font-bold text-gold">
            <span aria-hidden="true" className="material-symbols-outlined text-sm">lock</span>
            How client money is protected
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display mt-4">
            The three rules we cannot break
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAFEGUARDS.map((item) => (
            <div key={item.title} className="bg-white/5 border border-white/15 p-6 rounded-2xl backdrop-blur-md">
              <span className="w-11 h-11 rounded-xl bg-gold text-on-gold flex items-center justify-center mb-4">
                <span aria-hidden="true" className="material-symbols-outlined text-[22px]">{item.icon}</span>
              </span>
              <h3 className="text-base font-bold">{item.title}</h3>
              <p className="text-xs text-on-emerald/75 mt-2 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div className="mt-10 pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {PARTNERS.map((group) => (
            <div key={group.group}>
              <h3 className="text-[11px] uppercase font-extrabold text-gold tracking-widest mb-3">
                {group.group}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.names.map((name) => (
                  <li
                    key={name}
                    className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-xs font-semibold"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Leadership */}
    <section className="relative py-16 md:py-20 bg-canvas border-b border-line">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="gf-motif gf-motif--coins"></div>
      </div>

      <div className="relative max-w-[1240px] mx-auto px-4 md:px-8">
        <div className="max-w-2xl mb-10">
          <span className="text-xs uppercase font-extrabold text-gold-ink tracking-widest">Accountable</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-ink mt-1.5 font-display">
            Who runs GrowthFund
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LEADERSHIP.map((person) => (
            <figure key={person.name} className="bg-surface rounded-2xl border border-line p-6 shadow-sm">
              <img
                src={avatarFor(person.name)}
                alt=""
                className="w-14 h-14 rounded-xl object-cover mb-4"
              />
              <figcaption>
                <p className="text-base font-extrabold text-ink">{person.name}</p>
                <p className="text-xs font-bold text-accent mt-0.5">{person.role}</p>
              </figcaption>
              <p className="text-xs text-ink-2 leading-relaxed mt-3">{person.bio}</p>
            </figure>
          ))}
        </div>
      </div>
    </section>

    {/* Close */}
    <section className="py-16 md:py-20 bg-surface">
      <div className="max-w-[900px] mx-auto px-4 md:px-8 text-center">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-ink font-display">
          Start with {MIN_INVESTMENT_XAF.toLocaleString()} XAF
        </h2>
        <p className="text-sm text-ink-2 mt-3 max-w-xl mx-auto leading-relaxed">
          Every package names what you put in, how many days it runs and what you collect, before you commit.
          Nothing runs longer than {MAX_TERM_DAYS} days.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExplorePlans}
            className="bg-emerald text-on-emerald font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg hover:bg-emerald-2 transition-colors flex items-center justify-center gap-2.5"
          >
            See the packages
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </motion.button>
          <button
            onClick={() => onOpenLegal('risk')}
            className="border border-line bg-surface text-ink font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-surface-2 transition-colors"
          >
            Read the risk disclosure
          </button>
        </div>
        <p className="text-[11px] text-ink-3 mt-6 max-w-lg mx-auto leading-relaxed">
          Investing carries risk, including the loss of capital. Profit figures are the target each package is
          built to pay, not a guarantee.
        </p>
      </div>
    </section>
  </div>
);
