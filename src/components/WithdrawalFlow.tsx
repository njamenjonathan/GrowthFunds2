import React, { useState } from 'react';
import { PaymentMethodType, UserProfile } from '../types';

interface WithdrawalFlowProps {
  user: UserProfile;
  onClose: () => void;
  onWithdrawSuccess: (amount: number, fee: number, method: PaymentMethodType, account: string) => void;
  onOpenKyc: () => void;
}

export const WithdrawalFlow: React.FC<WithdrawalFlowProps> = ({
  user,
  onClose,
  onWithdrawSuccess,
  onOpenKyc,
}) => {
  const [step, setStep] = useState<'amount' | 'security_otp' | 'success'>('amount');
  const [amount, setAmount] = useState<number>(25000);
  const [method, setMethod] = useState<PaymentMethodType>('MTN MoMo');
  const [destinationAccount, setDestinationAccount] = useState<string>(user.phone);
  const [otpCode, setOtpCode] = useState<string>('829104');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const flatFee = 250; // Standard 250 XAF withdrawal processing fee
  const netReceived = Math.max(0, amount - flatFee);

  const handleNextToOtp = () => {
    if (user.kycStatus !== 'verified') {
      setErrorMsg('Identity verification is required before initiating withdrawals.');
      return;
    }
    if (amount < 2500) {
      setErrorMsg('Minimum withdrawal is 2,500 XAF.');
      return;
    }
    if (amount > user.availableBalance) {
      setErrorMsg(`Withdrawal amount exceeds your available balance (${user.availableBalance.toLocaleString()} XAF).`);
      return;
    }
    setErrorMsg(null);
    setStep('security_otp');
  };

  const handleConfirmWithdrawal = () => {
    if (otpCode.length < 4) {
      setErrorMsg('Please enter the 6-digit SMS security code.');
      return;
    }
    setErrorMsg(null);
    onWithdrawSuccess(amount, flatFee, method, destinationAccount);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#c0c9be]/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header (Matching Image 16) */}
        <div className="p-6 border-b border-[#e1e3e4] flex justify-between items-center bg-[#f8f9fa]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#735c00] text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">outbox</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#002c13]">Request Withdrawal</h3>
              <p className="text-xs text-[#717970]">
                Available Liquidity: <strong className="text-[#002c13] font-mono">{user.availableBalance.toLocaleString()} XAF</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#717970] hover:text-[#191c1d] rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Step 1: Amount & Destination */}
        {step === 'amount' && (
          <div className="p-6 overflow-y-auto space-y-6">
            {user.kycStatus !== 'verified' && (
              <div className="p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#ba1a1a]">warning</span>
                <div className="text-xs">
                  <p className="font-bold text-[#ba1a1a]">KYC Verification Incomplete</p>
                  <p className="text-[#93000a] mt-0.5">COSUMAF regulations require Tier 1 identity verification before withdrawal dispatch.</p>
                  <button
                    onClick={onOpenKyc}
                    className="mt-2 bg-[#ba1a1a] text-white px-3 py-1 rounded font-bold text-[11px]"
                  >
                    Complete Identity Check Now
                  </button>
                </div>
              </div>
            )}

            {/* Amount input */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#191c1d] mb-1">
                Amount to Withdraw (XAF)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm text-[#717970]">
                  FCFA
                </span>
                <input
                  type="number"
                  step={5000}
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-18 pr-4 py-3 rounded-xl border border-[#c0c9be] text-2xl font-bold font-mono text-[#002c13] focus:border-[#002c13]"
                  placeholder="25,000"
                />
              </div>

              {/* Quick Percentage Chips */}
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setAmount(Math.round(user.availableBalance * pct))}
                    className="py-1.5 rounded-lg text-xs font-bold border border-[#e1e3e4] bg-[#f8f9fa] hover:border-[#002c13] text-[#191c1d]"
                  >
                    {pct * 100}% Max
                  </button>
                ))}
              </div>
            </div>

            {/* Destination Selector */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#191c1d] mb-2">
                Withdrawal Destination
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['MTN MoMo', 'Orange Money', 'Express Union Mobile', 'Bank Transfer'] as PaymentMethodType[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      method === m
                        ? 'border-[#002c13] bg-[#002c13]/5 font-bold text-[#002c13] ring-1 ring-[#002c13]'
                        : 'border-[#c0c9be]/50 bg-white text-[#191c1d] hover:bg-[#f8f9fa]'
                    }`}
                  >
                    <p className="font-bold">{m}</p>
                    <p className="text-[10px] text-[#717970] mt-0.5">
                      {m.includes('Bank') ? '1-2 hrs' : 'Instant 5 mins'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Destination Account Number */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#191c1d] mb-1">
                {method === 'Bank Transfer' ? 'Bank Account IBAN / Account #' : 'Mobile Money Phone Number'}
              </label>
              <input
                type="text"
                value={destinationAccount}
                onChange={(e) => setDestinationAccount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#c0c9be] text-sm font-mono font-bold text-[#002c13]"
              />
              <p className="text-[11px] text-[#717970] mt-1">
                Name on account must strictly match verified legal name: <strong className="text-[#002c13]">{user.name}</strong>.
              </p>
            </div>

            {/* Net Breakdown (Matching Image 18) */}
            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e1e3e4] space-y-2 text-xs">
              <div className="flex justify-between text-[#717970]">
                <span>Gross Withdrawal</span>
                <span className="font-mono">{amount.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between text-[#717970]">
                <span>Interbank Processing Fee</span>
                <span className="font-mono text-[#ba1a1a]">-{flatFee.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#002c13] pt-2 border-t border-[#e1e3e4]">
                <span>Net Credited to Your Wallet</span>
                <span className="font-mono">{netReceived.toLocaleString()} XAF</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-[#ffdad6] text-[#ba1a1a] text-xs font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleNextToOtp}
              disabled={user.kycStatus !== 'verified'}
              className="w-full py-3.5 bg-[#002c13] text-white rounded-xl text-xs font-bold hover:bg-[#014421] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <span>Verify with Two-Factor Authentication (2FA)</span>
              <span className="material-symbols-outlined text-[16px]">lock</span>
            </button>
          </div>
        )}

        {/* Step 2: 2FA OTP Confirmation */}
        {step === 'security_otp' && (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-[#fed65b]/20 text-[#735c00] rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-2xl">phonelink_lock</span>
              </div>
              <h4 className="text-base font-bold text-[#002c13]">Security Verification (2FA)</h4>
              <p className="text-xs text-[#404941]">
                A 6-digit authorization code has been dispatched via SMS to <strong className="font-mono text-[#002c13]">{user.phone}</strong>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#191c1d] mb-1 text-center">
                Enter 6-Digit SMS Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full py-3 text-center tracking-[0.5em] text-2xl font-mono font-bold border border-[#c0c9be] rounded-xl text-[#002c13]"
              />
            </div>

            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e1e3e4] text-xs space-y-1.5">
              <div className="flex justify-between text-[#717970]">
                <span>Target:</span>
                <span className="font-bold text-[#191c1d]">{method} ({destinationAccount})</span>
              </div>
              <div className="flex justify-between text-[#717970]">
                <span>Net Transfer:</span>
                <span className="font-mono font-bold text-[#002c13]">{netReceived.toLocaleString()} XAF</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-[#ffdad6] text-[#ba1a1a] text-xs font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep('amount')}
                className="flex-1 py-3 border border-[#c0c9be] text-[#191c1d] rounded-xl text-xs font-bold hover:bg-[#f3f4f5]"
              >
                Back
              </button>
              <button
                onClick={handleConfirmWithdrawal}
                className="flex-1 py-3 bg-[#002c13] text-white rounded-xl text-xs font-bold hover:bg-[#014421] flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Authorize Payout</span>
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Screen */}
        {step === 'success' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#b2f1bf] text-[#002c13] rounded-full flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-3xl">task_alt</span>
            </div>

            <h3 className="text-xl font-bold text-[#002c13]">Withdrawal Submitted!</h3>
            <p className="text-xs text-[#404941] max-w-sm mx-auto">
              Your withdrawal of <strong className="font-mono text-[#002c13]">{amount.toLocaleString()} XAF</strong> has been initiated to your {method} account ({destinationAccount}).
            </p>

            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e1e3e4] text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#717970]">Transaction Reference</span>
                <span className="font-mono font-bold text-[#191c1d]">GF-WD-9928374</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717970]">Status</span>
                <span className="font-bold text-[#306a43]">Processing / Cleared</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-[#002c13] text-white rounded-xl text-xs font-bold hover:bg-[#014421]"
            >
              Back to Portfolio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
