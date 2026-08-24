import { Transaction } from '../types';
import {
  STATUS_CHIP,
  TRANSACTION_ICON,
  TRANSACTION_TONE,
  isCredit,
  signedAmount,
  transactionLabel,
} from '../lib/transactions';

interface TransactionRowProps {
  transaction: Transaction;
  onSelect: (tx: Transaction) => void;
  /**
   * `compact` for the dashboard's recent-activity list; `detailed` adds the
   * reference, counterparty and a receipt affordance for the full ledger.
   */
  variant?: 'compact' | 'detailed';
}

/**
 * One ledger entry as a selectable row.
 *
 * The dashboard and the transaction history used to render this markup
 * separately, and the two copies had already drifted — different icons for an
 * investment, different colours on the amount, different titles for the same
 * entry. Both now render this.
 */
export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction: tx,
  onSelect,
  variant = 'compact',
}) => {
  const credit = isCredit(tx.type);
  const detailed = variant === 'detailed';

  return (
    <button
      onClick={() => onSelect(tx)}
      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-surface-2 transition-colors"
    >
      <span className="flex items-center gap-3.5 min-w-0">
        <span
          className={`rounded-full flex items-center justify-center shrink-0 ${
            detailed ? 'w-11 h-11 rounded-xl' : 'w-10 h-10'
          } ${TRANSACTION_TONE[tx.type]}`}
        >
          <span aria-hidden="true" className={`material-symbols-outlined ${detailed ? 'text-[22px]' : 'text-[20px]'}`}>
            {TRANSACTION_ICON[tx.type]}
          </span>
        </span>

        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="block text-sm font-bold text-ink truncate first-letter:uppercase">
              {transactionLabel(tx)}
            </span>
            {detailed && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${STATUS_CHIP[tx.status]}`}>
                {tx.status}
              </span>
            )}
          </span>

          <span className="flex items-center gap-2 mt-0.5 text-[11px] text-ink-3">
            {detailed ? (
              <>
                <span className="font-mono">{tx.reference}</span>
                <span aria-hidden="true">•</span>
                <span>{tx.date}</span>
                {tx.destinationOrSource && (
                  <>
                    <span aria-hidden="true">•</span>
                    <span className="hidden sm:inline font-mono truncate">{tx.destinationOrSource}</span>
                  </>
                )}
              </>
            ) : (
              <>
                <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${STATUS_CHIP[tx.status]}`}>
                  {tx.status}
                </span>
                <span className="truncate">{tx.date}</span>
              </>
            )}
          </span>
        </span>
      </span>

      <span className="text-right shrink-0">
        <span
          className={`font-bold font-mono block ${detailed ? 'text-base' : 'text-sm'} ${
            credit ? 'text-pos' : 'text-ink'
          }`}
        >
          {signedAmount(tx)}
        </span>
        {detailed ? (
          <span className="text-[11px] text-ink-3 flex items-center justify-end gap-0.5">
            Receipt
            <span aria-hidden="true" className="material-symbols-outlined text-[14px]">chevron_right</span>
          </span>
        ) : (
          <span className="text-[10px] text-ink-3 font-mono">{tx.reference}</span>
        )}
      </span>
    </button>
  );
};
