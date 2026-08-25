
interface GrowthFundLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'light' | 'white';
  showTagline?: boolean;
}

export const GrowthFundLogo: React.FC<GrowthFundLogoProps> = ({
  size = 'md',
  variant = 'full',
  showTagline = false,
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const isLight = variant === 'light' || variant === 'white';

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* GrowthFund Emblem: Upward ascending growth bar & geometric gold crest */}
      <div
        className={`relative ${sizeClasses[size]} rounded-xl p-1.5 flex items-center justify-center shadow-xs transition-transform hover:scale-105 ${
          isLight ? 'bg-white/10 ring-1 ring-white/20' : 'bg-emerald ring-1 ring-gold/30'
        }`}
      >
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Gold Sun / Financial Ring */}
          <circle cx="24" cy="24" r="20" stroke="var(--gf-gold)" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
          
          {/* Ascending Fund Columns */}
          <rect x="10" y="28" width="5" height="10" rx="2" fill="var(--gf-emerald-tint)" />
          <rect x="18" y="22" width="5" height="16" rx="2" fill="#c8ead6" />
          <rect x="26" y="16" width="5" height="22" rx="2" fill="var(--gf-gold-3)" />
          <rect x="34" y="10" width="5" height="28" rx="2" fill="var(--gf-gold)" />

          {/* Dynamic Growth Trendline & Arrowhead */}
          <path
            d="M8 32L18 24L26 20L36 10M36 10H28M36 10V18"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-0.5 leading-none">
            <span
              className={`font-extrabold tracking-tight ${textClasses[size]} ${
                isLight ? 'text-on-emerald' : 'text-ink'
              }`}
            >
              Growth<span className={isLight ? 'text-gold' : 'text-gold-ink'}>Fund</span>
            </span>
          </div>
          {showTagline && (
            <span
              className={`text-[10px] tracking-wider uppercase font-semibold mt-0.5 ${
                isLight ? 'text-on-emerald/70' : 'text-ink-3'
              }`}
            >
              Central Africa • CEMAC
            </span>
          )}
        </div>
      )}
    </div>
  );
};
