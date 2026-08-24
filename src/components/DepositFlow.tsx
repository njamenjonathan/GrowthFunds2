import React, { useState, useEffect } from 'react';
import { PaymentMethodType, UserProfile } from '../types';

interface DepositFlowProps {
  user: UserProfile | null;
  onClose: () => void;
  onDepositSuccess: (amount: number, method: PaymentMethodType, phoneNumber: string) => void;
}

export const DepositFlow: React.FC<DepositFlowProps> = ({
  user,
  onClose,
  onDepositSuccess,
}) => {
  const [step, setStep] = useState<'amount' | 'details' | 'ussd_pending' | 'success'>('amount');
  const [amount, setAmount] = useState<number>(50000);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('MTN MoMo');
  const [phoneOrAccount, setPhoneOrAccount] = useState<string>(user?.phone || '+237 678 920 145');
  const [bankName, setBankName] = useState<string>('Afriland First Bank CEMAC');
  const [countdown, setCountdown] = useState<number>(15);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fee = Math.round(amount * 0.005); // 0.5%
  const totalCharge = amount + fee;

  // Countdown timer for USSD simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'ussd_pending' && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (step === 'ussd_pending' && countdown === 0) {
      setStep('success');
      onDepositSuccess(amount, selectedMethod, phoneOrAccount);
    }
    return () => clearTimeout(timer);
  }, [step, countdown, amount, selectedMethod, phoneOrAccount, onDepositSuccess]);

  const handleNextToDetails = () => {
    if (amount < 5000) {
      setErrorMsg('Minimum deposit amount is 5,000 XAF.');
      return;
    }
    if (amount > 10000000) {
      setErrorMsg('Maximum deposit per transaction is 10,000,000 XAF under Tier 2 limits.');
      return;
    }
    setErrorMsg(null);
    setStep('details');
  };

  const handleInitiateDeposit = () => {
    if (!phoneOrAccount) {
      setErrorMsg('Please enter a valid phone number or bank account.');
      return;
    }
    setErrorMsg(null);
    setCountdown(8);
    setStep('ussd_pending');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#c0c9be]/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header (Matching Image 12) */}
        <div className="p-6 border-b border-[#e1e3e4] flex justify-between items-center bg-[#f8f9fa]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#002c13] text-[#fed65b] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">add_card</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#002c13]">Deposit Funds (XAF)</h3>
              <p className="text-xs text-[#717970]">
                {step === 'amount' && 'Step 1 of 3: Select Amount & Provider'}
                {step === 'details' && 'Step 2 of 3: Confirm Account Details'}
                {step === 'ussd_pending' && 'Step 3 of 3: USSD Phone Authorization'}
                {step === 'success' && 'Deposit Verified & Cleared'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#717970] hover:text-[#191c1d] rounded-lg"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Step 1: Amount & Method Selection */}
        {step === 'amount' && (
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Amount input */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#191c1d] mb-2">
                Deposit Amount
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
                  className="w-full pl-18 pr-4 py-3.5 rounded-xl border border-[#c0c9be] text-2xl font-extrabold font-mono text-[#002c13] focus:border-[#002c13] focus:ring-1 focus:ring-[#002c13]"
                  placeholder="50,000"
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[10000, 50000, 100000, 500000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                      amount === val
                        ? 'bg-[#002c13] text-white border-[#002c13]'
                        : 'bg-[#f8f9fa] text-[#191c1d] border-[#e1e3e4] hover:border-[#002c13]'
                    }`}
                  >
                    {val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}k`} XAF
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector (Matching Image 12) */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#191c1d] mb-2">
                Payment Provider
              </label>
              <div className="space-y-2.5">
                {[
                  {
                    name: 'MTN MoMo' as PaymentMethodType,
                    desc: 'Instant deposit via Cameroon, Congo, Gabon',
                    badge: 'Instant • 0.5% fee',
                    icon: 'phone_android',
                    color: 'text-[#735c00] bg-[#fed65b]/20',
                  },
                  {
                    name: 'Orange Money' as PaymentMethodType,
                    desc: 'Instant USSD authorization',
                    badge: 'Instant • 0.5% fee',
                    icon: 'phone_iphone',
                    color: 'text-[#ba1a1a] bg-[#ffdad6]',
                  },
                  {
                    name: 'Express Union Mobile' as PaymentMethodType,
                    desc: 'CEMAC regional wallet network',
                    badge: 'Instant • 0.5% fee',
                    icon: 'account_balance_wallet',
                    color: 'text-[#002c13] bg-[#b2f1bf]',
                  },
                  {
                    name: 'Bank Transfer' as PaymentMethodType,
                    desc: 'Afriland, BGFIBank, Ecobank, UBA, SG',
                    badge: '1-2 hrs clearing',
                    icon: 'account_balance',
                    color: 'text-[#162634] bg-[#d4e4f6]',
                  },
                ].map((meth) => (
                  <div
                    key={meth.name}
                    onClick={() => setSelectedMethod(meth.name)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedMethod === meth.name
                        ? 'border-[#002c13] bg-[#002c13]/5 ring-1 ring-[#002c13]'
                        : 'border-[#c0c9be]/50 hover:bg-[#f8f9fa]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${meth.color}`}>
                        <span className="material-symbols-outlined text-[20px]">{meth.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#191c1d]">{meth.name}</p>
                        <p className="text-[11px] text-[#717970]">{meth.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-[#735c00] font-mono bg-white px-2 py-0.5 rounded border border-[#e1e3e4]">
                      {meth.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e1e3e4] space-y-2 text-xs">
              <div className="flex justify-between text-[#717970]">
                <span>Principal Deposit</span>
                <span className="font-mono">{amount.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between text-[#717970]">
                <span>Telecom / Gateway Fee (0.5%)</span>
                <span className="font-mono">+{fee.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#002c13] pt-2 border-t border-[#e1e3e4]">
                <span>Total Amount Debited</span>
                <span className="font-mono">{totalCharge.toLocaleString()} XAF</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-[#ffdad6] text-[#ba1a1a] text-xs font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleNextToDetails}
              className="w-full py-3.5 bg-[#002c13] text-white rounded-xl text-xs font-bold hover:bg-[#014421] transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Continue to Payment Details</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Step 2: Account details */}
        {step === 'details' && (
          <div className="p-6 space-y-6">
            <div className="bg-[#002c13]/5 p-4 rounded-xl border border-[#002c13]/15 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#717970]">Deposit via</p>
                <p className="text-sm font-bold text-[#002c13]">{selectedMethod}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#717970]">Total to Pay</p>
                <p className="text-base font-extrabold text-[#002c13] font-mono">{totalCharge.toLocaleString()} XAF</p>
              </div>
            </div>

            {selectedMethod !== 'Bank Transfer' ? (
              <div>
                <label className="block text-xs font-bold uppercase text-[#191c1d] mb-1">
                  Mobile Money Account Number
                </label>
                <p className="text-[11px] text-[#717970] mb-2">
                  A USSD authorization prompt will appear on this phone.
                </p>
                <input
                  type="tel"
                  value={phoneOrAccount}
                  onChange={(e) => setPhoneOrAccount(e.target.value)}
                  placeholder="+237 6XX XXX XXX"
                  className="w-full px-4 py-3 rounded-xl border border-[#c0c9be] text-base font-bold font-mono text-[#002c13]"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#191c1d] mb-1">
                    Select Originating Bank
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#c0c9be] text-xs font-semibold"
                  >
                    <option>Afriland First Bank CEMAC</option>
                    <option>BGFIBank Gabon / Cameroon</option>
                    <option>Ecobank Central Africa</option>
                    <option>UBA Cameroon / Chad</option>
                    <option>Société Générale Cameroun</option>
                  </select>
                </div>
                <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e1e3e4] text-xs text-[#404941]">
                  <p className="font-bold text-[#002c13] mb-1">GrowthFund Custody Bank IBAN:</p>
                  <p className="font-mono text-[11px] select-all">CM21 1000 5000 0012 3456 7890 123</p>
                  <p className="text-[10px] text-[#717970] mt-1">Reference: <strong className="font-mono text-[#002c13]">GF-{user?.id.toUpperCase() || 'USER'}</strong></p>
                </div>
              </div>
            )}

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
                onClick={handleInitiateDeposit}
                className="flex-1 py-3 bg-[#002c13] text-white rounded-xl text-xs font-bold hover:bg-[#014421] flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Authorize {amount.toLocaleString()} XAF</span>
                <span className="material-symbols-outlined text-[16px]">lock</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: USSD Pending Simulation (Matching Image 14) */}
        {step === 'ussd_pending' && (
          <div className="p-8 text-center space-y-5">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#fed65b] border-t-[#002c13] animate-spin"></div>
              <span className="material-symbols-outlined text-3xl text-[#002c13]">phone_iphone</span>
            </div>

            <div>
              <h4 className="text-lg font-bold text-[#002c13]">Authorizing Mobile Push...</h4>
              <p className="text-xs text-[#404941] max-w-sm mx-auto mt-1 leading-relaxed">
                A USSD popup request has been sent to <strong className="font-mono text-[#002c13]">{phoneOrAccount}</strong>. Please enter your mobile money PIN on your handset.
              </p>
            </div>

            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e1e3e4] max-w-xs mx-auto text-xs space-y-1">
              <p className="text-[#717970]">Provider: <span className="font-bold text-[#191c1d]">{selectedMethod}</span></p>
              <p className="text-[#717970]">Total: <span className="font-mono font-bold text-[#002c13]">{totalCharge.toLocaleString()} XAF</span></p>
              <p className="text-[#735c00] font-bold text-[11px] pt-1">Awaiting telecom handshake ({countdown}s)...</p>
            </div>

            <button
              onClick={() => {
                setStep('success');
                onDepositSuccess(amount, selectedMethod, phoneOrAccount);
              }}
              className="text-xs text-[#002c13] underline font-bold hover:text-[#014421]"
            >
              Simulate Instant Pin Confirmation (Demo Fast-Forward)
            </button>
          </div>
        )}

        {/* Step 4: Success Confirmed */}
        {step === 'success' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#b2f1bf] text-[#002c13] rounded-full flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>

            <h3 className="text-xl font-bold text-[#002c13]">Deposit Successfully Cleared!</h3>
            <p className="text-xs text-[#404941] max-w-sm mx-auto">
              Your account has been credited with <strong className="font-mono text-[#002c13]">{amount.toLocaleString()} XAF</strong> via {selectedMethod}.
            </p>

            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e1e3e4] text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#717970]">Reference</span>
                <span className="font-mono font-bold text-[#191c1d]">GF-DP-{Math.floor(1000000 + Math.random() * 9000000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717970]">Net Balance Updated</span>
                <span className="font-mono font-bold text-[#306a43]">+{amount.toLocaleString()} XAF</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-[#002c13] text-white rounded-xl text-xs font-bold hover:bg-[#014421]"
            >
              Done &amp; Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
