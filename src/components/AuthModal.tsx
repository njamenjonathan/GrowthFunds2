import { useState } from 'react';
import { UserProfile } from '../types';
import { Modal, ModalHeader } from './Modal';
import { avatarFor } from '../lib/avatar';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

const COUNTRIES = [
  { value: 'Cameroon', label: '🇨🇲 Cameroon' },
  { value: 'Gabon', label: '🇬🇦 Gabon' },
  { value: 'Congo', label: '🇨🇬 Republic of the Congo' },
  { value: 'Chad', label: '🇹🇩 Chad' },
  { value: 'Central African Republic', label: '🇨🇫 Central African Republic' },
  { value: 'Equatorial Guinea', label: '🇬🇶 Equatorial Guinea' },
  { value: 'Diaspora (International)', label: '🌐 Diaspora / international' },
];

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('Cameroon');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const switchMode = (next: 'login' | 'register') => {
    setMode(next);
    setErrorMsg(null);
    setNotice(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg(null);
    setNotice(null);

    if (mode === 'register') {
      if (!fullName.trim()) {
        setErrorMsg('Enter your full legal name, matching your government ID.');
        return;
      }
      if (!acceptedTerms) {
        setErrorMsg('Please accept the terms and investor disclosures to continue.');
        return;
      }
    }
    if (password.length < 8) {
      setErrorMsg('Your password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);

      if (mode === 'register') {
        const name = fullName.trim();
        onAuthSuccess({
          id: `usr_${Math.floor(100000 + Math.random() * 900000)}`,
          name,
          email: email.trim(),
          phone: phone.trim(),
          country,
          kycStatus: 'pending',
          twoFactorEnabled: true,
          twoFactorMethod: 'sms',
          availableBalance: 0,
          investedBalance: 0,
          lifetimeEarnings: 0,
          createdAt: new Date().toISOString().split('T')[0],
          avatarUrl: avatarFor(name),
          referralCode: `GF-${name.slice(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
          referralEarnings: 0,
          referralCount: 0,
          referralList: [],
        });
        return;
      }

      const name = fullName.trim() || 'Samuel E. Nguema';
      onAuthSuccess({
        id: 'usr_882931',
        name,
        email: email.trim() || 'samuel.nguema@investor.cm',
        phone: phone.trim() || '+237 678 920 145',
        country,
        kycStatus: 'verified',
        idDocumentType: 'National ID',
        idNumber: 'CM-10928374-2024',
        expiryDate: '2029-11-15',
        twoFactorEnabled: true,
        twoFactorMethod: 'sms',
        availableBalance: 2450000,
        investedBalance: 1250000,
        lifetimeEarnings: 168450,
        createdAt: '2024-01-15',
        avatarUrl: avatarFor(name),
        referralCode: 'GF-SAM882',
        referralEarnings: 3000,
        referralCount: 3,
        referralList: [],
      });
    }, 600);
  };

  const field =
    'w-full pl-10 pr-4 py-2.5 rounded-xl border border-line text-xs font-semibold focus:border-accent outline-none transition-colors';
  const labelClass = 'block text-[11px] font-bold uppercase tracking-wider text-ink mb-1.5';
  const iconClass = 'material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-ink-3 pointer-events-none';

  return (
    <Modal onClose={onClose} label={mode === 'login' ? 'Sign in' : 'Create an account'}>
      <ModalHeader
        icon={mode === 'login' ? 'lock' : 'person_add'}
        title={mode === 'login' ? 'Sign in' : 'Create your account'}
        subtitle="COSUMAF regulated · 256-bit SSL"
        onClose={onClose}
      />

      <div className="p-2 bg-surface-2 mx-6 mt-5 rounded-xl flex gap-1 border border-line shrink-0">
        {(['login', 'register'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => switchMode(option)}
            aria-pressed={mode === option}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
              mode === option ? 'bg-surface text-accent shadow-xs' : 'text-ink-3 hover:text-ink'
            }`}
          >
            {option === 'login' ? 'Sign in' : 'Create account'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
        {errorMsg && (
          <p
            role="alert"
            className="p-3 bg-neg-bg border border-neg/30 text-on-neg-bg rounded-xl text-xs flex items-center gap-2"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-base">error</span>
            {errorMsg}
          </p>
        )}

        {notice && (
          <p
            role="status"
            className="p-3 bg-accent-bg border border-accent/25 text-accent rounded-xl text-xs flex items-center gap-2"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-base">mark_email_read</span>
            {notice}
          </p>
        )}

        {mode === 'register' && (
          <>
            <div>
              <label htmlFor="auth-name" className={labelClass}>
                Full legal name
              </label>
              <div className="relative">
                <span className={iconClass}>badge</span>
                <input
                  id="auth-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="As shown on your government ID"
                  className={field}
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-country" className={labelClass}>
                Country of residence
              </label>
              <div className="relative">
                <span className={iconClass}>public</span>
                <select
                  id="auth-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={field}
                >
                  {COUNTRIES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        <div>
          <label htmlFor="auth-phone" className={labelClass}>
            Mobile number
          </label>
          <div className="relative">
            <span className={iconClass}>smartphone</span>
            <input
              id="auth-phone"
              type="tel"
              required
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+237 6XX XXX XXX"
              className={`${field} font-mono`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="auth-email" className={labelClass}>
            Email address
          </label>
          <div className="relative">
            <span className={iconClass}>mail</span>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={field}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 gap-2">
            <label htmlFor="auth-password" className={`${labelClass} mb-0`}>
              Password
            </label>
            {mode === 'login' && (
              <button
                type="button"
                onClick={() =>
                  setNotice(
                    email.trim()
                      ? `If an account exists for ${email.trim()}, a reset link is on its way.`
                      : 'Enter your email address above and we’ll send you a reset link.'
                  )
                }
                className="text-[11px] text-accent hover:underline font-semibold"
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <span className={iconClass}>key</span>
            <input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={`${field} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {mode === 'register' && (
          <label className="flex items-start gap-2.5 text-xs text-ink-2 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 accent-[var(--gf-accent)]"
            />
            <span className="leading-relaxed">
              I agree to the COSUMAF-regulated terms of service, the AML/CFT policy and the investor disclosure
              agreement.
            </span>
          </label>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-emerald text-on-emerald rounded-xl text-xs font-bold hover:bg-emerald-2 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 gf-press"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              Signing you in…
            </>
          ) : (
            <>
              {mode === 'login' ? 'Sign in' : 'Open my account'}
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </>
          )}
        </button>

        <p className="pt-2 border-t border-line-2 flex items-center gap-1.5 text-[11px] text-ink-3">
          <span aria-hidden="true" className="material-symbols-outlined text-[14px] text-pos">verified_user</span>
          Funds held in custody with BEAC-cleared commercial banks
        </p>
      </form>
    </Modal>
  );
};
