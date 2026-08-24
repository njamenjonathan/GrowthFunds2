import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [phone, setPhone] = useState('+237 678 920 145');
  const [fullName, setFullName] = useState('Samuel E. Nguema');
  const [email, setEmail] = useState('samuel.nguema@investor.cm');
  const [password, setPassword] = useState('Investor@2026');
  const [country, setCountry] = useState('Cameroon');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'register' && !acceptedTerms) {
      setErrorMsg('Please accept the regulated terms and conditions.');
      return;
    }

    if (mode === 'register' && !fullName.trim()) {
      setErrorMsg('Please enter your full legal name matching your government ID.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // Check if registering a new fresh account
      if (mode === 'register') {
        const newRegisteredUser: UserProfile = {
          id: `usr_${Math.floor(100000 + Math.random() * 900000)}`,
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          country: country,
          kycStatus: 'pending',
          kycTier: 1,
          twoFactorEnabled: true,
          twoFactorMethod: 'sms',
          availableBalance: 0,
          investedBalance: 0,
          lifetimeEarnings: 0,
          createdAt: new Date().toISOString().split('T')[0],
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=002c13&textColor=fed65b`,
          referralCode: `GF-${fullName.slice(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
          referralEarnings: 0,
          referralCount: 0,
          referralList: [],
        };
        onAuthSuccess(newRegisteredUser);
      } else {
        // Sign in to existing verified portfolio or custom email
        const loggedInUser: UserProfile = {
          id: 'usr_882931',
          name: fullName || 'Samuel E. Nguema',
          email: email || 'samuel.nguema@investor.cm',
          phone: phone || '+237 678 920 145',
          country: country || 'Cameroon',
          kycStatus: 'verified',
          kycTier: 2,
          idDocumentType: 'National ID',
          idNumber: 'CM-10928374-2024',
          expiryDate: '2029-11-15',
          twoFactorEnabled: true,
          twoFactorMethod: 'sms',
          availableBalance: 2450000,
          investedBalance: 1250000,
          lifetimeEarnings: 168450,
          createdAt: '2024-01-15',
          avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArMg7NE44Mo6rm5u1KT_kWLsiO8wZAcnKiUQqw6xGDiPqh0tNK7Sn08-WmX2av-dCS47k790m1I15-d8fDlMdF8-BMb5CB8ty49wJgV5GFSnjApGo9DblGS6EgqoBHCdQNY-Jv5jV7rZCrQ7xphFEEfiokyVpad6dBQ5SdFFHX9VRZ4_TAHuEP_dMmSUrKQAeXcLJKE5Tle4jL9MVMxeEeCTU3HNsqiERLAZC9tEbcLzXzGnkeqrh1',
          referralCode: 'GF-SAM882',
          referralEarnings: 3000,
          referralCount: 3,
        };
        onAuthSuccess(loggedInUser);
      }
    }, 600);
  };

  const handleSelectDemo = (type: 'samuel' | 'new_investor') => {
    if (type === 'samuel') {
      setFullName('Samuel E. Nguema');
      setEmail('samuel.nguema@investor.cm');
      setPhone('+237 678 920 145');
      setCountry('Cameroon');
      setMode('login');
    } else {
      setFullName('Amina Ndong Nguesso');
      setEmail('amina.ndong@investor.ga');
      setPhone('+241 077 891 204');
      setCountry('Gabon');
      setMode('register');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#c0c9be]/50 overflow-hidden flex flex-col relative"
      >
        {/* Top Gold Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#002c13] via-[#fed65b] to-[#002c13]"></div>

        {/* Modal Header */}
        <div className="p-6 border-b border-[#e1e3e4] flex justify-between items-center bg-[#f8f9fa]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#002c13] text-[#fed65b] flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[24px]">
                {mode === 'login' ? 'lock' : 'person_add'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#002c13]">
                {mode === 'login' ? 'Investor Access' : 'Create Investor Account'}
              </h3>
              <div className="flex items-center gap-2 text-xs text-[#717970] mt-0.5">
                <span className="inline-flex items-center gap-1 font-semibold text-[#002c13]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#306a43]"></span> COSUMAF Regulated
                </span>
                <span>•</span>
                <span>256-Bit SSL</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#717970] hover:text-[#191c1d] hover:bg-[#e7e8e9] rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="p-2 bg-[#f3f4f5] mx-6 mt-5 rounded-xl flex gap-1 border border-[#c0c9be]/40">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all relative ${
              mode === 'login'
                ? 'bg-white text-[#002c13] shadow-xs'
                : 'text-[#717970] hover:text-[#191c1d]'
            }`}
          >
            Sign In to Portfolio
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all relative ${
              mode === 'register'
                ? 'bg-white text-[#002c13] shadow-xs'
                : 'text-[#717970] hover:text-[#191c1d]'
            }`}
          >
            New Account (Register)
          </button>
        </div>

        {/* Fast Demo Switcher */}
        <div className="px-6 pt-3 flex items-center justify-between text-[11px] text-[#717970]">
          <span>Quick Autofill:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleSelectDemo('samuel')}
              className="text-[#002c13] hover:underline font-semibold bg-[#002c13]/5 px-2 py-0.5 rounded border border-[#002c13]/10"
            >
              Samuel (Verified 2.45M)
            </button>
            <button
              type="button"
              onClick={() => handleSelectDemo('new_investor')}
              className="text-[#735c00] hover:underline font-semibold bg-[#fed65b]/20 px-2 py-0.5 rounded border border-[#fed65b]/40"
            >
              New Profile (Gabon)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-4">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-[#ffdad6]/60 border border-[#ba1a1a]/30 text-[#ba1a1a] rounded-xl text-xs flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">error</span>
              <span>{errorMsg}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div
                key="register-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1">
                    Full Legal Name (as on Government ID)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[18px] text-[#717970]">
                      badge
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Samuel E. Nguema"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c0c9be] text-xs font-semibold focus:border-[#002c13] focus:ring-1 focus:ring-[#002c13] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1">
                    Country of Residence (CEMAC / Diaspora)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[18px] text-[#717970]">
                      public
                    </span>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c0c9be] text-xs font-semibold focus:border-[#002c13] focus:ring-1 focus:ring-[#002c13] transition-all bg-white"
                    >
                      <option value="Cameroon">🇨🇲 Cameroon (XAF)</option>
                      <option value="Gabon">🇬🇦 Gabon (XAF)</option>
                      <option value="Congo">🇨🇬 Republic of the Congo (XAF)</option>
                      <option value="Chad">🇹🇩 Chad (XAF)</option>
                      <option value="Central African Republic">🇨🇫 Central African Republic (XAF)</option>
                      <option value="Equatorial Guinea">🇬🇶 Equatorial Guinea (XAF)</option>
                      <option value="Diaspora (International)">🌐 Diaspora / International Investor</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1">
              Mobile Number (Funding &amp; 2FA)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[18px] text-[#717970]">
                smartphone
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+237 6XX XXX XXX"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c0c9be] text-xs font-mono font-bold focus:border-[#002c13] focus:ring-1 focus:ring-[#002c13] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[18px] text-[#717970]">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investor@growthfund.africa"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c0c9be] text-xs font-semibold focus:border-[#002c13] focus:ring-1 focus:ring-[#002c13] transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d]">
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to ' + email)}
                  className="text-[11px] text-[#002c13] hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[18px] text-[#717970]">
                key
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#c0c9be] text-xs font-semibold focus:border-[#002c13] focus:ring-1 focus:ring-[#002c13] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#717970] hover:text-[#191c1d]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <label className="flex items-start gap-2 text-xs text-[#404941] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 rounded text-[#002c13] focus:ring-[#002c13]"
              />
              <span>
                I agree to the COSUMAF regulated Terms of Service, anti-money laundering (AML/CFT) policy, and investor disclosure agreement.
              </span>
            </label>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#002c13] text-white rounded-xl text-xs font-bold hover:bg-[#014421] transition-all shadow-md flex items-center justify-center gap-2 relative overflow-hidden"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Authenticating Securely...</span>
              </span>
            ) : (
              <>
                <span>
                  {mode === 'login' ? 'Enter Secure Portfolio' : 'Open Regulated Account'}
                </span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </>
            )}
          </motion.button>

          {/* Security badge footer */}
          <div className="pt-2 border-t border-[#e1e3e4] flex items-center justify-between text-[11px] text-[#717970]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#306a43]">verified_user</span>
              Bank Custody via BEAC / Commercial Banks
            </span>
            <span className="font-semibold text-[#002c13]">CEMAC Official</span>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

