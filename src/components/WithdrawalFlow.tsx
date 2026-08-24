import { useRef, useState } from 'react';
import { PaymentMethodType, UserProfile } from '../types';
import { Modal, ModalHeader } from './Modal';

interface WithdrawalFlowProps {
  user: UserProfile;
  onClose: () => void;
  onWithdrawSuccess: (
    amount: number,
    fee: number,
    method: PaymentMethodType,
    account: string,
    reference: string
  ) => void;
  onOpenKyc: () => void;
}

const MIN_WITHDRAWAL = 2500;
const FLAT_FEE = 250;
const OTP_LENGTH = 6;

const DESTINATIONS: PaymentMethodType[] = [
  'MTN MoMo',
  'Orange Money',
  'Express Union Mobile',
  'Bank Transfer',
];

export const WithdrawalFlow: React.FC<WithdrawalFlowProps> = ({
  user,
  onClose,
  onWithdrawSuccess,
  onOpenKyc,
}) => {
  const [step, setStep] = useState<'amount' | 'verify' | 'success'>('amount');
  const [amount, setAmount] = useState(25000);
  const [method, setMethod] = useState<PaymentMethodType>('MTN MoMo');
  const [destinationAccount, setDestinationAccount] = useState(user.phone);
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /** Minted once at authorisation so the receipt matches the ledger entry. */
  const referenceRef = useRef<string | null>(null);

  const isVerified = user.kycStatus === 'verified';
  const netReceived = Math.max(0, amount - FLAT_FEE);

  const handleNextToOtp = () => {
    if (!isVerified) {
      setErrorMsg('Identity verification is required before you can withdraw.');
      return;
    }
    if (!Number.isFinite(amount) || amount < MIN_WITHDRAWAL) {
      setErrorMsg(`The minimum withdrawal is ${MIN_WITHDRAWAL.toLocaleString()} XAF.`);
      return;
    }
    if (amount > user.availableBalance) {
      setErrorMsg(`That exceeds your available balance of ${user.availableBalance.toLocaleString()} XAF.`);
      return;
    }
    if (!destinationAccount.trim()) {
      setErrorMsg('Enter the account the funds should be sent to.');
      return;
    }
    setErrorMsg(null);
    setOtpCode('');
    setStep('verify');
  };

  const handleConfirmWithdrawal = () => {
    // The label promises six digits, so validate against exactly that.
    if (otpCode.trim().length !== OTP_LENGTH) {
      setErrorMsg(`Enter the ${OTP_LENGTH}-digit code sent to ${user.phone}.`);
      return;
    }
    setErrorMsg(null);
    const reference = `GF-WD-${Math.floor(1000000 + Math.random() * 9000000)}`;
    referenceRef.current = reference;
    onWithdrawSuccess(amount, FLAT_FEE, method, destinationAccount, reference);
    setStep('success');
  };

  return (
    <Modal onClose={onClose} label="Request a withdrawal">
      <ModalHeader
        icon="outbox"
        title="Withdraw funds"
        subtitle={`Available: ${user.availableBalance.toLocaleString()} XAF`}
        onClose={onClose}
      />

      {step === 'amount' && (
        <div className="p-6 overflow-y-auto space-y-5">
          {!isVerified && (
            <div className="p-4 rounded-xl bg-neg-bg border border-neg/30 flex items-start gap-3">
              <span aria-hidden="true" className="material-symbols-outlined text-neg shrink-0">warning</span>
              <div className="text-xs">
                <p className="font-bold text-on-neg-bg">Verification incomplete</p>
                <p className="text-on-neg-bg/90 mt-0.5">
                  COSUMAF rules require identity verification before a payout can be dispatched.
                </p>
                <button
                  onClick={onOpenKyc}
                  className="mt-2 bg-danger text-on-danger px-3 py-1.5 rounded font-bold text-[11px] hover:bg-danger-hover transition-colors"
                >
                  Verify now
                </button>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="withdraw-amount" className="block text-xs font-bold uppercase text-ink mb-1.5">
              Amount to withdraw
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm text-ink-3 pointer-events-none">
                FCFA
              </span>
              <input
                id="withdraw-amount"
                type="number"
                inputMode="numeric"
                step={5000}
                min={MIN_WITHDRAWAL}
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-16 pr-4 py-3 rounded-xl border border-line text-2xl font-bold font-mono text-accent focus:border-accent outline-none"
                placeholder="25000"
              />
            </div>

            <div className="grid grid-cols-4 gap-2 mt-2">
              {[0.25, 0.5, 0.75, 1].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setAmount(Math.round(user.availableBalance * pct))}
                  className="py-1.5 rounded-lg text-xs font-bold border border-line bg-surface-2 hover:border-accent text-ink transition-colors"
                >
                  {pct === 1 ? 'Max' : `${pct * 100}%`}
                </button>
              ))}
            </div>
          </div>

          <fieldset>
            <legend className="block text-xs font-bold uppercase text-ink mb-2">Destination</legend>
            <div className="grid grid-cols-2 gap-2">
              {DESTINATIONS.map((option) => (
                <label
                  key={option}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                    method === option
                      ? 'border-accent bg-accent-bg text-accent font-bold'
                      : 'border-line bg-surface text-ink hover:bg-surface-2'
                  }`}
                >
                  <input
                    type="radio"
                    name="withdraw-destination"
                    value={option}
                    checked={method === option}
                    onChange={() => setMethod(option)}
                    className="sr-only"
                  />
                  <span className="block font-bold">{option}</span>
                  <span className="block text-[10px] text-ink-3 mt-0.5">
                    {option === 'Bank Transfer' ? '1–2 hrs' : 'Instant'}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="withdraw-destination-account" className="block text-xs font-bold uppercase text-ink mb-1.5">
              {method === 'Bank Transfer' ? 'Bank account / IBAN' : 'Mobile money number'}
            </label>
            <input
              id="withdraw-destination-account"
              type="text"
              value={destinationAccount}
              onChange={(e) => setDestinationAccount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-line text-sm font-mono font-bold text-accent focus:border-accent outline-none"
            />
            <p className="text-[11px] text-ink-3 mt-1.5">
              The account holder must match your verified name: <strong className="text-ink">{user.name}</strong>.
            </p>
          </div>

          <dl className="bg-surface-2 p-4 rounded-xl border border-line-2 space-y-2 text-xs">
            <div className="flex justify-between text-ink-3">
              <dt>Gross withdrawal</dt>
              <dd className="font-mono">{amount.toLocaleString()} XAF</dd>
            </div>
            <div className="flex justify-between text-ink-3">
              <dt>Processing fee</dt>
              <dd className="font-mono text-neg">−{FLAT_FEE.toLocaleString()} XAF</dd>
            </div>
            <div className="flex justify-between font-bold text-sm text-accent pt-2 border-t border-line-2">
              <dt>You receive</dt>
              <dd className="font-mono">{netReceived.toLocaleString()} XAF</dd>
            </div>
          </dl>

          {errorMsg && (
            <p role="alert" className="p-3 rounded-lg bg-neg-bg text-on-neg-bg text-xs font-medium flex items-center gap-2">
              <span aria-hidden="true" className="material-symbols-outlined text-sm">error</span>
              {errorMsg}
            </p>
          )}

          <button
            onClick={handleNextToOtp}
            disabled={!isVerified}
            className="w-full py-3.5 bg-emerald text-on-emerald rounded-xl text-xs font-bold hover:bg-emerald-2 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to verification
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">lock</span>
          </button>
        </div>
      )}

      {step === 'verify' && (
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-gold/20 text-gold-ink rounded-full flex items-center justify-center mx-auto mb-2">
              <span aria-hidden="true" className="material-symbols-outlined text-2xl">phonelink_lock</span>
            </div>
            <h3 className="text-base font-bold text-accent">Two-factor verification</h3>
            <p className="text-xs text-ink-2">
              We sent a {OTP_LENGTH}-digit code by SMS to{' '}
              <strong className="font-mono text-accent">{user.phone}</strong>.
            </p>
          </div>

          <div>
            <label htmlFor="otp" className="block text-xs font-bold uppercase text-ink mb-1.5 text-center">
              Enter your code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={OTP_LENGTH}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full py-3 text-center tracking-[0.5em] text-2xl font-mono font-bold border border-line rounded-xl text-accent focus:border-accent outline-none"
            />
          </div>

          <dl className="bg-surface-2 p-4 rounded-xl border border-line-2 text-xs space-y-1.5">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-3">Destination</dt>
              <dd className="font-bold text-ink text-right truncate">
                {method} ({destinationAccount})
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-3">You receive</dt>
              <dd className="font-mono font-bold text-accent">{netReceived.toLocaleString()} XAF</dd>
            </div>
          </dl>

          {errorMsg && (
            <p role="alert" className="p-3 rounded-lg bg-neg-bg text-on-neg-bg text-xs font-medium flex items-center gap-2">
              <span aria-hidden="true" className="material-symbols-outlined text-sm">error</span>
              {errorMsg}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep('amount')}
              className="flex-1 py-3 border border-line text-ink rounded-xl text-xs font-bold hover:bg-surface-2 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConfirmWithdrawal}
              className="flex-1 py-3 bg-emerald text-on-emerald rounded-xl text-xs font-bold hover:bg-emerald-2 transition-colors flex items-center justify-center gap-2"
            >
              Authorise payout
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">check_circle</span>
            </button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-pos-bg text-on-pos-bg rounded-full flex items-center justify-center mx-auto">
            <span aria-hidden="true" className="material-symbols-outlined text-3xl">task_alt</span>
          </div>

          <h3 className="text-xl font-bold text-accent">Withdrawal submitted</h3>
          <p className="text-xs text-ink-2 max-w-sm mx-auto">
            <strong className="font-mono text-accent">{netReceived.toLocaleString()} XAF</strong> is on its way to your{' '}
            {method} account ({destinationAccount}).
          </p>

          <dl className="bg-surface-2 p-4 rounded-xl border border-line-2 text-left text-xs space-y-1.5">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-3">Reference</dt>
              <dd className="font-mono font-bold text-ink">{referenceRef.current}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-3">Status</dt>
              <dd className="font-bold text-pos">Processing</dd>
            </div>
          </dl>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-emerald text-on-emerald rounded-xl text-xs font-bold hover:bg-emerald-2 transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </Modal>
  );
};
