import { Transaction } from '../types';
import { Modal, ModalHeader } from './Modal';

interface TransactionDetailModalProps {
  transaction: Transaction;
  onClose: () => void;
  onOpenSupport: () => void;
}

const STATUS_STYLES: Record<Transaction['status'], string> = {
  completed: 'bg-pos-bg text-on-pos-bg',
  processing: 'bg-gold text-on-gold',
  pending: 'bg-gold text-on-gold',
  failed: 'bg-neg-bg text-on-neg-bg',
  rejected: 'bg-neg-bg text-on-neg-bg',
};

const TYPE_LABELS: Record<Transaction['type'], string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  investment: 'Investment',
  dividend: 'Dividend',
  liquidation: 'Liquidation',
  referral_gift: 'Referral gift',
};

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  onOpenSupport,
}) => {
  const isCredit =
    transaction.type === 'deposit' ||
    transaction.type === 'dividend' ||
    transaction.type === 'referral_gift';

  return (
    <Modal onClose={onClose} size="max-w-md" label="Transaction receipt">
      <ModalHeader icon="receipt_long" title="Receipt" subtitle={transaction.reference} onClose={onClose} />

      {/* `print-receipt` is what the print stylesheet isolates, so printing
          produces the receipt alone rather than the whole application shell. */}
      <div className="p-6 space-y-5 overflow-y-auto print-receipt">
        <div className="text-center">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 ${
              STATUS_STYLES[transaction.status]
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {transaction.status}
          </span>
          <p className={`text-3xl font-extrabold font-mono ${isCredit ? 'text-pos' : 'text-ink'}`}>
            {isCredit ? '+' : '−'}
            {transaction.amount.toLocaleString()} XAF
          </p>
          <p className="text-xs text-ink-3 mt-1 font-mono">{transaction.reference}</p>
        </div>

        <dl className="bg-surface-2 rounded-xl p-4 border border-line-2 space-y-3 text-xs">
          <div className="flex justify-between gap-3">
            <dt className="text-ink-3">Type</dt>
            <dd className="font-bold text-ink">{TYPE_LABELS[transaction.type]}</dd>
          </div>

          <div className="flex justify-between gap-3">
            <dt className="text-ink-3">Method</dt>
            <dd className="font-bold text-ink text-right">{transaction.method}</dd>
          </div>

          {transaction.destinationOrSource && (
            <div className="flex justify-between gap-3">
              <dt className="text-ink-3">Account</dt>
              <dd className="font-mono font-semibold text-ink text-right break-all">
                {transaction.destinationOrSource}
              </dd>
            </div>
          )}

          {transaction.planName && (
            <div className="flex justify-between gap-3">
              <dt className="text-ink-3">Portfolio</dt>
              <dd className="font-bold text-accent text-right">{transaction.planName}</dd>
            </div>
          )}

          <div className="flex justify-between gap-3">
            <dt className="text-ink-3">Fee</dt>
            <dd className="font-mono text-ink-2">{transaction.fee.toLocaleString()} XAF</dd>
          </div>

          <div className="flex justify-between gap-3 font-bold text-accent pt-2 border-t border-line-2">
            <dt>Net settled</dt>
            <dd className="font-mono text-sm">{transaction.netAmount.toLocaleString()} XAF</dd>
          </div>

          <div className="flex justify-between gap-3 pt-1 text-[11px] text-ink-3">
            <dt>Date</dt>
            <dd>{transaction.date}</dd>
          </div>
        </dl>

        {transaction.notes && (
          <div className="p-3 bg-surface border border-line rounded-lg text-xs text-ink-2">
            <p className="font-bold text-ink mb-0.5">Notes</p>
            <p className="leading-relaxed">{transaction.notes}</p>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-line-2 flex gap-2 shrink-0 print-hide">
        <button
          onClick={() => window.print()}
          className="flex-1 py-3 bg-emerald text-on-emerald rounded-xl text-xs font-bold hover:bg-emerald-2 transition-colors flex items-center justify-center gap-1.5"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">print</span>
          Print receipt
        </button>
        <button
          onClick={() => {
            onClose();
            onOpenSupport();
          }}
          className="py-3 px-4 border border-line text-ink-2 rounded-xl text-xs font-bold hover:bg-surface-2 transition-colors flex items-center gap-1.5"
          title="Report a problem with this transaction"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">flag</span>
          <span className="hidden sm:inline">Dispute</span>
        </button>
      </div>
    </Modal>
  );
};
