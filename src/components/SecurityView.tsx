import { useState } from 'react';
import { PageBackdrop } from './PageBackdrop';
import { UserProfile } from '../types';
import { ThemeMode, THEME_OPTIONS } from '../lib/theme';

interface SecurityViewProps {
  user: UserProfile;
  onUpdateSecurity: (settings: Partial<UserProfile>) => void;
  onOpenKyc: () => void;
  theme?: 'light' | 'dark';
  themeMode: ThemeMode;
  onSetThemeMode: (mode: ThemeMode) => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({
  user,
  onUpdateSecurity,
  onOpenKyc,
  theme = 'light',
  themeMode,
  onSetThemeMode,
}) => {
  const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled);
  const [method, setMethod] = useState<'sms' | 'authenticator'>(user.twoFactorMethod || 'sms');
  const [biometrics, setBiometrics] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateSecurity({
      twoFactorEnabled: twoFactor,
      twoFactorMethod: method,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex-1 p-4 md:p-10 bg-canvas relative">
      <PageBackdrop />

      <div className="max-w-[1000px] mx-auto w-full relative z-10 space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Security &amp; Regulatory Compliance
          </h2>
          <p className="text-xs sm:text-sm text-ink-3 mt-0.5">
            Manage your cryptographic safeguards, two-factor authentication, and compliance certificates.
          </p>
        </div>

        {/* 2FA Card */}
        <div className="bg-surface rounded-2xl border border-line/40 p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald/10 text-accent rounded-xl">
                <span aria-hidden="true" className="material-symbols-outlined text-2xl">phonelink_lock</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-ink">Two-Factor Authentication (2FA)</h3>
                <p className="text-xs text-ink-3">
                  Required for authorizing capital withdrawals and sensitive account changes.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-3 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-on-emerald/40 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-line after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald"></div>
            </label>
          </div>

          {twoFactor && (
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setMethod('sms')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  method === 'sms'
                    ? 'border-accent bg-emerald/5 ring-1 ring-accent'
                    : 'border-line/50 hover:bg-surface-2'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-accent">sms</span>
                  <p className="text-xs font-bold text-ink">SMS Verification Code</p>
                </div>
                <p className="text-[11px] text-ink-3">
                  Dispatched instantly to verified phone: <strong className="font-mono text-accent">{user.phone}</strong>
                </p>
              </div>

              <div
                onClick={() => setMethod('authenticator')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  method === 'authenticator'
                    ? 'border-accent bg-emerald/5 ring-1 ring-accent'
                    : 'border-line/50 hover:bg-surface-2'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-accent">key</span>
                  <p className="text-xs font-bold text-ink">Authenticator App (TOTP)</p>
                </div>
                <p className="text-[11px] text-ink-3">
                  Google Authenticator, Microsoft Authenticator, or 1Password.
                </p>
              </div>
            </div>
          )}

          {/* Biometrics */}
          <div className="pt-4 border-t border-line-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-surface-2 text-ink-2 rounded-xl">
                <span aria-hidden="true" className="material-symbols-outlined text-2xl">fingerprint</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-ink">Biometric Quick Unlock</h4>
                <p className="text-xs text-ink-3">Use FaceID or Fingerprint on supported mobile devices</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={biometrics}
                onChange={(e) => setBiometrics(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-3 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-on-emerald/40 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-line after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald"></div>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess && (
              <span className="text-xs font-bold text-pos flex items-center gap-1">
                <span aria-hidden="true" className="material-symbols-outlined text-sm">check_circle</span> Settings Saved Successfully
              </span>
            )}
            <button
              onClick={handleSave}
              className="ml-auto bg-emerald text-on-emerald px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-2 transition-all shadow-xs"
            >
              Save Security Preferences
            </button>
          </div>
        </div>

        {/* Regulatory & Encryption Verification Card */}
        <div className="bg-surface rounded-2xl border border-line/40 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-line-2">
            <div className="p-2.5 bg-gold/30 text-gold-ink rounded-xl">
              <span aria-hidden="true" className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-accent">Institutional Regulatory Credentials</h3>
              <p className="text-xs text-ink-3">COSUMAF License Reference &amp; Custody Framework</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-surface-2 rounded-xl border border-line-2">
              <span className="text-ink-3">Supervisory Regulator</span>
              <p className="font-bold text-ink mt-0.5">COSUMAF (Commission de Surveillance du Marché Financier)</p>
              <p className="font-mono text-[11px] text-gold-ink mt-1">License Ref: N° SGP-04/2023</p>
            </div>

            <div className="p-3.5 bg-surface-2 rounded-xl border border-line-2">
              <span className="text-ink-3">Regional Exchange Clearing</span>
              <p className="font-bold text-ink mt-0.5">BVMAC (Bourse des Valeurs Mobilières d'Afrique Centrale)</p>
              <p className="font-mono text-[11px] text-pos mt-1">Depository Trust: Segregated BVMAC-DEP-88</p>
            </div>
          </div>

          <div className="p-3.5 bg-emerald/5 rounded-xl border border-accent/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="material-symbols-outlined text-accent">shield</span>
              <span className="text-ink-2">Identity check: <strong className="text-accent">Verified</strong></span>
            </div>
            <button
              onClick={onOpenKyc}
              className="text-accent font-bold underline hover:text-accent"
            >
              Manage ID Documents
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-surface rounded-2xl border border-line p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent-bg text-accent rounded-xl">
              <span aria-hidden="true" className="material-symbols-outlined text-2xl">
                {theme === 'dark' ? 'dark_mode' : 'light_mode'}
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Appearance</h3>
              <p className="text-xs text-ink-3">
                Choose a light or dark palette, or follow your device setting automatically.
              </p>
            </div>
          </div>

          <div role="radiogroup" aria-label="Theme" className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                role="radio"
                aria-checked={themeMode === option.value}
                onClick={() => onSetThemeMode(option.value)}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  themeMode === option.value
                    ? 'border-accent bg-accent-bg ring-1 ring-accent'
                    : 'border-line hover:bg-surface-2'
                }`}
              >
                <span className="flex items-center gap-2 mb-1">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-accent">
                    {option.icon}
                  </span>
                  <span className="text-xs font-bold text-ink">{option.label}</span>
                  {themeMode === option.value && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-accent">
                      Active
                    </span>
                  )}
                </span>
                <span className="block text-[11px] text-ink-3">
                  {option.value === 'light'
                    ? 'Always use the light palette.'
                    : option.value === 'dark'
                    ? 'Always use the high-contrast dark palette.'
                    : `Follow your device (currently ${theme}).`}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
