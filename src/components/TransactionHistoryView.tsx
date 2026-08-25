import { useMemo, useState } from 'react';
import { Transaction } from '../types';
import { TransactionRow } from './TransactionRow';
import { PageBackdrop } from './PageBackdrop';

interface TransactionHistoryViewProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export const TransactionHistoryView: React.FC<TransactionHistoryViewProps> = ({
  transactions,
  onSelectTransaction,
  onOpenDeposit,
  onOpenWithdraw,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return transactions.filter((tx) => {
      if (filterType !== 'all' && tx.type !== filterType) return false;
      if (!query) return true;
      return [tx.reference, tx.method, tx.type, tx.planName, tx.subInvestmentName, tx.destinationOrSource]
        .filter((field): field is string => Boolean(field))
        .some((field) => field.toLowerCase().includes(query));
    });
  }, [transactions, filterType, searchQuery]);

  return (
    <div className="flex-1 p-4 md:p-10 bg-canvas relative">
      <PageBackdrop pair="fan" />

      <div className="max-w-[1200px] mx-auto w-full relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Transaction History
            </h2>
            <p className="text-xs sm:text-sm text-ink-3 mt-0.5">
              Complete audited financial ledger of all deposits, withdrawals, and yield credits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDeposit}
              className="bg-emerald text-on-emerald text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-emerald-2 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">add</span> Deposit XAF
            </button>
            <button
              onClick={onOpenWithdraw}
              className="bg-surface border border-ink-3 text-ink text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-surface-2 transition-all flex items-center gap-1.5"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">outbox</span> Withdraw
            </button>
          </div>
        </div>

        {/* Filter Bar & Search (Matching Image 20) */}
        <div className="bg-surface p-4 rounded-2xl border border-line/40 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
            {[
              { id: 'all', label: 'All Activity' },
              { id: 'deposit', label: 'Deposits' },
              { id: 'withdrawal', label: 'Withdrawals' },
              { id: 'investment', label: 'Investments' },
              { id: 'payout', label: 'Payouts' },
              { id: 'referral_gift', label: 'Referral gifts' },
              { id: 'daily_checkin', label: 'Check-ins' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  filterType === tab.id
                    ? 'bg-emerald text-on-emerald shadow-xs'
                    : 'bg-surface-2 text-ink-3 hover:bg-surface-2 hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <span aria-hidden="true" className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-ink-3">
              search
            </span>
            <input
              type="text"
              placeholder="Search reference or method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-line focus:border-accent"
            />
          </div>
        </div>

        {/* List of Transactions */}
        <div className="bg-surface rounded-2xl border border-line/40 shadow-xs overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-ink-3">
              <span aria-hidden="true" className="material-symbols-outlined text-4xl mb-2">history</span>
              <p className="text-sm font-bold">No transactions found for this filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-line-2">
              {filtered.map((tx) => (
                <TransactionRow key={tx.id} transaction={tx} onSelect={onSelectTransaction} variant="detailed" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
