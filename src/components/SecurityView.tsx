import React, { useState } from 'react';
import { UserProfile } from '../types';

interface SecurityViewProps {
  user: UserProfile;
  onUpdateSecurity: (settings: Partial<UserProfile>) => void;
  onOpenKyc: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({
  user,
  onUpdateSecurity,
  onOpenKyc,
  theme = 'light',
  onToggleTheme,
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
    <div className="flex-1 p-4 md:p-12 bg-[#f8f9fa] min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none pattern-bg"></div>

      <div className="max-w-[1000px] mx-auto w-full relative z-10 space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191c1d] tracking-tight">
            Security &amp; Regulatory Compliance
          </h2>
          <p className="text-xs sm:text-sm text-[#717970] mt-0.5">
            Manage your cryptographic safeguards, two-factor authentication, and compliance certificates.
          </p>
        </div>

        {/* 2FA Card */}
        <div className="bg-white rounded-2xl border border-[#c0c9be]/40 p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#002c13]/10 text-[#002c13] rounded-xl">
                <span className="material-symbols-outlined text-2xl">phonelink_lock</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#191c1d]">Two-Factor Authentication (2FA)</h3>
                <p className="text-xs text-[#717970]">
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
              <div className="w-11 h-6 bg-[#e1e3e4] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#c0c9be] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002c13]"></div>
            </label>
          </div>

          {twoFactor && (
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setMethod('sms')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  method === 'sms'
                    ? 'border-[#002c13] bg-[#002c13]/5 ring-1 ring-[#002c13]'
                    : 'border-[#c0c9be]/50 hover:bg-[#f8f9fa]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[18px] text-[#002c13]">sms</span>
                  <p className="text-xs font-bold text-[#191c1d]">SMS Verification Code</p>
                </div>
                <p className="text-[11px] text-[#717970]">
                  Dispatched instantly to verified phone: <strong className="font-mono text-[#002c13]">{user.phone}</strong>
                </p>
              </div>

              <div
                onClick={() => setMethod('authenticator')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  method === 'authenticator'
                    ? 'border-[#002c13] bg-[#002c13]/5 ring-1 ring-[#002c13]'
                    : 'border-[#c0c9be]/50 hover:bg-[#f8f9fa]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[18px] text-[#002c13]">key</span>
                  <p className="text-xs font-bold text-[#191c1d]">Authenticator App (TOTP)</p>
                </div>
                <p className="text-[11px] text-[#717970]">
                  Google Authenticator, Microsoft Authenticator, or 1Password.
                </p>
              </div>
            </div>
          )}

          {/* Biometrics */}
          <div className="pt-4 border-t border-[#e1e3e4] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#f3f4f5] text-[#404941] rounded-xl">
                <span className="material-symbols-outlined text-2xl">fingerprint</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#191c1d]">Biometric Quick Unlock</h4>
                <p className="text-xs text-[#717970]">Use FaceID or Fingerprint on supported mobile devices</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={biometrics}
                onChange={(e) => setBiometrics(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#e1e3e4] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#c0c9be] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002c13]"></div>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess && (
              <span className="text-xs font-bold text-[#306a43] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span> Settings Saved Successfully
              </span>
            )}
            <button
              onClick={handleSave}
              className="ml-auto bg-[#002c13] text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-[#014421] transition-all shadow-xs"
            >
              Save Security Preferences
            </button>
          </div>
        </div>

        {/* Regulatory & Encryption Verification Card */}
        <div className="bg-white rounded-2xl border border-[#c0c9be]/40 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#e1e3e4]">
            <div className="p-2.5 bg-[#fed65b]/30 text-[#735c00] rounded-xl">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#002c13]">Institutional Regulatory Credentials</h3>
              <p className="text-xs text-[#717970]">COSUMAF License Reference &amp; Custody Framework</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#f8f9fa] rounded-xl border border-[#e1e3e4]">
              <span className="text-[#717970]">Supervisory Regulator</span>
              <p className="font-bold text-[#191c1d] mt-0.5">COSUMAF (Commission de Surveillance du Marché Financier)</p>
              <p className="font-mono text-[11px] text-[#735c00] mt-1">License Ref: N° SGP-04/2023</p>
            </div>

            <div className="p-3.5 bg-[#f8f9fa] rounded-xl border border-[#e1e3e4]">
              <span className="text-[#717970]">Regional Exchange Clearing</span>
              <p className="font-bold text-[#191c1d] mt-0.5">BVMAC (Bourse des Valeurs Mobilières d'Afrique Centrale)</p>
              <p className="font-mono text-[11px] text-[#306a43] mt-1">Depository Trust: Segregated BVMAC-DEP-88</p>
            </div>
          </div>

          <div className="p-3.5 bg-[#002c13]/5 rounded-xl border border-[#002c13]/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#002c13]">shield</span>
              <span className="text-[#404941]">Current KYC Status: <strong className="text-[#002c13]">Tier {user.kycTier} Verified</strong></span>
            </div>
            <button
              onClick={onOpenKyc}
              className="text-[#002c13] font-bold underline hover:text-[#014421]"
            >
              Manage ID Documents
            </button>
          </div>
        </div>

        {/* Display & Low-Light Theme Card */}
        <div className="bg-white rounded-2xl border border-[#c0c9be]/40 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#002c13]/10 text-[#002c13] rounded-xl">
                <span className="material-symbols-outlined text-2xl">
                  {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#191c1d]">Display & Theme Mode</h3>
                <p className="text-xs text-[#717970]">
                  Switch between standard day view and high-contrast dark mode for low-light trading.
                </p>
              </div>
            </div>
            <button
              onClick={onToggleTheme}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-[#fed65b] text-[#002c13] border-[#fed65b] shadow-xs'
                  : 'bg-[#002c13] text-white border-[#002c13] hover:bg-[#014421]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
