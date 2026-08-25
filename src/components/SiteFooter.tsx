import { GrowthFundLogo } from './GrowthFundLogo';
import { View } from '../types';

interface SiteFooterProps {
  onOpenLegal: (topic: string) => void;
  onNavigate: (view: View) => void;
}

/**
 * Shared footer. It used to live inside HomeView, which meant every other page
 * ended abruptly with no legal links or regulator disclosure.
 */
export const SiteFooter: React.FC<SiteFooterProps> = ({ onOpenLegal, onNavigate }) => (
  <footer className="bg-emerald text-on-emerald w-full print-hide">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-12 py-12 w-full max-w-[1240px] mx-auto">
      <div className="col-span-2 space-y-4">
        <GrowthFundLogo size="md" variant="white" showTagline />
        <p className="text-xs text-on-emerald/70 max-w-md leading-relaxed">
          © 2026 GrowthFund CEMAC SAS. Regulated by COSUMAF (Commission de Surveillance du Marché
          Financier de l'Afrique Centrale). All investments carry market risk. Base currency: XAF (FCFA).
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-gold">
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
        <h2 className="text-[11px] uppercase font-extrabold text-gold mb-3 tracking-widest">Platform</h2>
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
        <h2 className="text-[11px] uppercase font-extrabold text-gold mb-3 tracking-widest">Legal</h2>
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
);
