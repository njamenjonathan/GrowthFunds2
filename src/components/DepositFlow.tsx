import { useEffect, useRef, useState } from 'react';
import { PaymentMethodType, UserProfile } from '../types';
import { MIN_INVESTMENT_XAF } from '../lib/constants';
import { Modal, ModalHeader } from './Modal';

interface DepositFlowProps {
  user: UserProfile;
  onClose: () => void;
  onDepositSuccess: (
    amount: number,
    method: PaymentMethodType,
    phoneNumber: string,
    reference: string
  ) => void;
}

const MIN_DEPOSIT = MIN_INVESTMENT_XAF;
const MAX_DEPOSIT = 10000000;
/** Seconds the simulated mobile-money authorisation takes to clear. */
const AUTHORISATION_SECONDS = 8;

const METHODS: {
  name: PaymentMethodType;
  desc: string;
  badge: string;
  icon: string;
  chip: string;
}[] = [
  {
    name: 'MTN MoMo',
    desc: 'Cameroon, Congo and Gabon',
    badge: 'Instant',
    icon: 'phone_android',
    chip: 'text-gold-ink bg-gold/20',
  },
  {
    name: 'Orange Money',
    desc: 'Instant USSD authorisation',
    badge: 'Instant',
    icon: 'phone_iphone',
    chip: 'text-neg bg-neg-bg',
  },
  {
    name: 'Express Union Mobile',
    desc: 'CEMAC regional wallet network',
    badge: 'Instant',
    icon: 'account_balance_wallet',
    chip: 'text-on-pos-bg bg-pos-bg',
  },
  {
    name: 'Bank Transfer',
    desc: 'Afriland, BGFIBank, Ecobank, UBA, SG',
    badge: '1–2 hrs',
    icon: 'account_balance',
    chip: 'text-info bg-info-bg',
  },
];

export const DepositFlow: React.FC<DepositFlowProps> = ({ user, onClose, onDepositSuccess }) => {
  const [step, setStep] = useState<'amount' | 'details' | 'authorising' | 'success'>('amount');
  const [amount, setAmount] = useState(50000);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('MTN MoMo');
  const [phoneOrAccount, setPhoneOrAccount] = useState(user.phone);
  const [bankName, setBankName] = useState('Afriland First Bank CEMAC');
  const [countdown, setCountdown] = useState(AUTHORISATION_SECONDS);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /**
   * The ledger reference is minted once, when the deposit is initiated, and
   * reused for the receipt. It used to be regenerated inline on every render,
   * so the number on screen changed constantly and never matched the entry
   * written to the transaction history.
   */
  const referenceRef = useRef<string | null>(null);
  /** Guards against crediting the same deposit twice (timer + manual confirm). */
  const settledRef = useRef(false);

  // Deposits are free: what is charged to the wallet is exactly what lands in
  // the balance, so there is no fee line to reconcile.
  const totalCharge = amount;

  const settle = () => {
    if (settledRef.current) return;
    settledRef.current = true;
    const reference = referenceRef.current ?? '—';
    setStep('success');
    onDepositSuccess(amount, selectedMethod, phoneOrAccount, reference);
  };

  // Tick the authorisation countdown, then settle once it reaches zero.
  useEffect(() => {
    if (step !== 'authorising') return;
    if (countdown <= 0) {
      settle();
      return;
    }
    const timer = window.setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => window.clearTimeout(timer);
    // `settle` closes over the current amount/method, which are frozen by this point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, countdown]);

  const handleNextToDetails = () => {
    if (!Number.isFinite(amount) || amount < MIN_DEPOSIT) {
      setErrorMsg(`The minimum deposit is ${MIN_DEPOSIT.toLocaleString()} XAF.`);
      return;
    }
    if (amount > MAX_DEPOSIT) {
      setErrorMsg(`The maximum per transaction is ${MAX_DEPOSIT.toLocaleString()} XAF under Tier 2 limits.`);
      return;
    }
    setErrorMsg(null);
    setStep('details');
  };

  const handleInitiateDeposit = () => {
    if (!phoneOrAccount.trim()) {
      setErrorMsg('Enter the phone number or account the funds will come from.');
      return;
    }
    setErrorMsg(null);
    referenceRef.current = `GF-DP-${Math.floor(1000000 + Math.random() * 9000000)}`;
    setCountdown(AUTHORISATION_SECONDS);
    setStep('authorising');
  };

  const stepLabel = {
    amount: 'Step 1 of 3 · Amount and provider',
    details: 'Step 2 of 3 · Account details',
    authorising: 'Step 3 of 3 · Authorise on your phone',
    success: 'Deposit cleared',
  }[step];

  return (
    <Modal onClose={onClose} label="Deposit funds">
      <ModalHeader icon="add_card" title="Deposit funds" subtitle={stepLabel} onClose={onClose} />

      {step === 'amount' && (
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <label htmlFor="deposit-amount" className="block text-xs font-bold uppercase text-ink mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm text-ink-3 pointer-events-none">
                FCFA
              </span>
              <input
                id="deposit-amount"
                type="number"
                inputMode="numeric"
                step={5000}
                min={MIN_DEPOSIT}
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-16 pr-4 py-3.5 rounded-xl border border-line text-2xl font-extrabold font-mono text-accent focus:border-accent outline-none"
                placeholder="50000"
              />
            </div>

            <div className="grid grid-cols-4 gap-2 mt-3">
              {[10000, 50000, 100000, 500000].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value)}
                  className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                    amount === value
                      ? 'bg-emerald text-on-emerald border-emerald'
                      : 'bg-surface-2 text-ink border-line hover:border-accent'
                  }`}
                >
                  {value / 1000}k
                </button>
              ))}
            </div>
          </div>

          <fieldset>
            <legend className="block text-xs font-bold uppercase text-ink mb-2">Payment provider</legend>
            <div className="space-y-2">
              {METHODS.map((method) => (
                <label
                  key={method.name}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    selectedMethod === method.name
                      ? 'border-accent bg-accent-bg'
                      : 'border-line hover:bg-surface-2'
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <input
                      type="radio"
                      name="deposit-method"
                      value={method.name}
                      checked={selectedMethod === method.name}
                      onChange={() => setSelectedMethod(method.name)}
                      className="sr-only"
                    />
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${method.chip}`}>
                      <span aria-hidden="true" className="material-symbols-outlined text-[20px]">{method.icon}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold text-ink">{method.name}</span>
                      <span className="block text-[11px] text-ink-3 truncate">{method.desc}</span>
                    </span>
                  </span>
                  <span className="text-[10px] font-semibold text-ink-3 font-mono bg-surface px-2 py-0.5 rounded border border-line-2 shrink-0">
                    {method.badge}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <dl className="bg-surface-2 p-4 rounded-xl border border-line-2 space-y-2 text-xs">
            <div className="flex justify-between text-ink-3">
              <dt>Charged to {selectedMethod}</dt>
              <dd className="font-mono">{totalCharge.toLocaleString()} XAF</dd>
            </div>
            <div className="flex justify-between font-bold text-sm text-accent pt-2 border-t border-line-2">
              <dt>Added to your balance</dt>
              <dd className="font-mono">{amount.toLocaleString()} XAF</dd>
            </div>
          </dl>

          {errorMsg && (
            <p role="alert" className="p-3 rounded-lg bg-neg-bg text-on-neg-bg text-xs font-medium flex items-center gap-2">
              <span aria-hidden="true" className="material-symbols-outlined text-sm">error</span>
              {errorMsg}
            </p>
          )}

          <button
            onClick={handleNextToDetails}
            className="w-full py-3.5 bg-emerald text-on-emerald rounded-xl text-xs font-bold hover:bg-emerald-2 transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      )}

      {step === 'details' && (
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="bg-accent-bg p-4 rounded-xl border border-accent/20 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-ink-3">Paying with</p>
              <p className="text-sm font-bold text-accent">{selectedMethod}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-ink-3">Total</p>
              <p className="text-base font-extrabold text-accent font-mono">{totalCharge.toLocaleString()} XAF</p>
            </div>
          </div>

          {selectedMethod !== 'Bank Transfer' ? (
            <div>
              <label htmlFor="momo-number" className="block text-xs font-bold uppercase text-ink mb-1">
                Mobile money number
              </label>
              <p className="text-[11px] text-ink-3 mb-2">A USSD prompt will be sent to this phone.</p>
              <input
                id="momo-number"
                type="tel"
                value={phoneOrAccount}
                onChange={(e) => setPhoneOrAccount(e.target.value)}
                placeholder="+237 6XX XXX XXX"
                className="w-full px-4 py-3 rounded-xl border border-line text-base font-bold font-mono text-accent focus:border-accent outline-none"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label htmlFor="bank-name" className="block text-xs font-bold uppercase text-ink mb-1">
                  Originating bank
                </label>
                <select
                  id="bank-name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-line text-xs font-semibold focus:border-accent outline-none"
                >
                  <option>Afriland First Bank CEMAC</option>
                  <option>BGFIBank Gabon / Cameroon</option>
                  <option>Ecobank Central Africa</option>
                  <option>UBA Cameroon / Chad</option>
                  <option>Société Générale Cameroun</option>
                </select>
              </div>
              <div className="p-3.5 bg-surface-2 rounded-lg border border-line-2 text-xs text-ink-2">
                <p className="font-bold text-accent mb-1">GrowthFund custody IBAN</p>
                <p className="font-mono text-[11px] select-all">CM21 1000 5000 0012 3456 7890 123</p>
                <p className="text-[10px] text-ink-3 mt-1">
                  Payment reference: <strong className="font-mono text-accent">GF-{user.id.toUpperCase()}</strong>
                </p>
              </div>
            </div>
          )}

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
              onClick={handleInitiateDeposit}
              className="flex-1 py-3 bg-emerald text-on-emerald rounded-xl text-xs font-bold hover:bg-emerald-2 transition-colors flex items-center justify-center gap-2"
            >
              Authorise {amount.toLocaleString()} XAF
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">lock</span>
            </button>
          </div>
        </div>
      )}

      {step === 'authorising' && (
        <div className="p-8 text-center space-y-5" role="status" aria-live="polite">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-gold border-t-emerald animate-spin"></div>
            <span aria-hidden="true" className="material-symbols-outlined text-3xl text-accent">phone_iphone</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-accent">Check your phone</h3>
            <p className="text-xs text-ink-2 max-w-sm mx-auto mt-1 leading-relaxed">
              A payment request was sent to{' '}
              <strong className="font-mono text-accent">{phoneOrAccount}</strong>. Enter your mobile money PIN to
              approve it.
            </p>
          </div>

          <dl className="bg-surface-2 p-4 rounded-xl border border-line-2 max-w-xs mx-auto text-xs space-y-1 text-left">
            <div className="flex justify-between">
              <dt className="text-ink-3">Provider</dt>
              <dd className="font-bold text-ink">{selectedMethod}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-3">Total</dt>
              <dd className="font-mono font-bold text-accent">{totalCharge.toLocaleString()} XAF</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-3">Waiting</dt>
              <dd className="text-gold-ink font-bold">{countdown}s</dd>
            </div>
          </dl>

          <button onClick={settle} className="text-xs text-accent underline font-bold hover:opacity-80">
            I've approved it on my phone
          </button>
        </div>
      )}

      {step === 'success' && (
        <div className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-pos-bg text-on-pos-bg rounded-full flex items-center justify-center mx-auto">
            <span aria-hidden="true" className="material-symbols-outlined text-3xl">check_circle</span>
          </div>

          <h3 className="text-xl font-bold text-accent">Deposit cleared</h3>
          <p className="text-xs text-ink-2 max-w-sm mx-auto">
            <strong className="font-mono text-accent">{amount.toLocaleString()} XAF</strong> has been credited to your
            available balance via {selectedMethod}.
          </p>

          <dl className="bg-surface-2 p-4 rounded-xl border border-line-2 text-left text-xs space-y-1.5">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-3">Reference</dt>
              <dd className="font-mono font-bold text-ink">{referenceRef.current}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-3">Credited</dt>
              <dd className="font-mono font-bold text-pos">+{amount.toLocaleString()} XAF</dd>
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
