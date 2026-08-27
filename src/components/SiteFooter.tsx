import { GrowthFundLogo } from './GrowthFundLogo';
import { View } from '../types';

interface SiteFooterProps {
  onOpenLegal: (topic: string) => void;
  onNavigate: (view: View) => void;
}

/**
 * Shared footer. It used to live inside HomeView, which meant every other page
 * ended abruptly with no legal links or regulator disclosure.
 *
 * It is a pane of glass resting on the page, not the page's bottom band: the
 * gutter below and to either side keeps the green clear of the two bottom
 * corners, which is what lets it read as a separate surface with the canvas
 * continuing underneath.
 */
export const SiteFooter: React.FC<SiteFooterProps> = ({ onOpenLegal, onNavigate }) => (
  <div className="relative px-3 pt-8 pb-3 sm:px-5 sm:pt-12 sm:pb-5 print-hide">
    {/* What the glass has to bend. A footer at the end of the document has
        nothing but flat canvas behind it, and a blur of nothing is
        indistinguishable from a flat fill — the material only shows when
        there is structure under it to displace. */}
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-50 pattern-bg"></div>
      <div className="absolute -bottom-32 left-[6%] w-[28rem] h-[28rem] rounded-full bg-emerald-base/25 blur-3xl"></div>
      <div className="absolute -top-24 right-[8%] w-[24rem] h-[24rem] rounded-full bg-gold/15 blur-3xl"></div>
    </div>

    <footer className="gf-glass-float bg-emerald-glass text-on-emerald relative w-full max-w-[1240px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-12 py-12 w-full">
        <div className="col-span-2 space-y-4">
          <GrowthFundLogo size="md" variant="white" showTagline />
          <p className="text-xs text-on-emerald/80 max-w-md leading-relaxed">
            © 2026 GrowthFund CEMAC SAS. Regulated by COSUMAF (Commission de Surveillance du Marché
            Financier de l'Afrique Centrale). All investments carry market risk. Base currency: XAF (FCFA).
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-gold-on-emerald">
            <span className="flex items-center gap-1">
              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">lock</span> 256-bit SSL
            </span>
            <span aria-hidden="true">•</span>
            <span>BEAC interbank cleared</span>
            <span aria-hidden="true">•</span>
            <span>COSUMAF supervised</span>
          </div>
        </div>

        <nav aria-label="Platform">
          <h2 className="text-[11px] uppercase font-extrabold text-gold-on-emerald mb-3 tracking-widest">Platform</h2>
          {/* The pages, mirroring the header. Check-in and Invite & earn are
              sections of My money and are reached from its tab strip, so they
              are not listed again here. */}
          <ul className="space-y-2 text-xs text-on-emerald/80">
            {(
              [
                ['plans', 'Invest'],
                ['dashboard', 'My money'],
                ['history', 'Transactions'],
                ['about', 'About us'],
                ['faq', 'FAQ'],
                ['security', 'Security & 2FA'],
              ] as [View, string][]
            ).map(([view, label]) => (
              <li key={view}>
                <button onClick={() => onNavigate(view)} className="hover:text-on-emerald hover:underline">
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal and compliance">
          <h2 className="text-[11px] uppercase font-extrabold text-gold-on-emerald mb-3 tracking-widest">Legal</h2>
          <ul className="space-y-2 text-xs text-on-emerald/80">
            <li>
              <button onClick={() => onOpenLegal('terms')} className="hover:text-on-emerald hover:underline">
                Terms &amp; conditions
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal('risk')} className="hover:text-on-emerald hover:underline">
                Risk disclosure
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal('fees')} className="hover:text-on-emerald hover:underline">
                Fee schedule
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal('kyc')} className="hover:text-on-emerald hover:underline">
                KYC &amp; AML policy
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal('cosumaf')} className="hover:text-on-emerald hover:underline">
                COSUMAF licence
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  </div>
);
