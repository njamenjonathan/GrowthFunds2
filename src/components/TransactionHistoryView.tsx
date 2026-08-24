import { useMemo, useState } from 'react';
import { Transaction } from '../types';

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
      <div className="absolute inset-0 opacity-40 pointer-events-none pattern-bg" aria-hidden="true"></div>

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
              { id: 'dividend', label: 'Dividends' },
              { id: 'referral_gift', label: 'Referral gifts' },
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
              {filtered.map((tx) => {
                const isCredit = tx.type === 'deposit' || tx.type === 'dividend' || tx.type === 'referral_gift';

                return (
                  <button
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-surface-2 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          tx.type === 'deposit'
                            ? 'bg-pos-bg/40 text-on-pos-bg'
                            : tx.type === 'withdrawal'
                            ? 'bg-neg-bg text-neg'
                            : tx.type === 'dividend'
                            ? 'bg-gold/40 text-gold-ink'
                            : tx.type === 'referral_gift'
                            ? 'bg-gold/50 text-accent'
                            : 'bg-surface-3 text-accent'
                        }`}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
                          {tx.type === 'deposit'
                            ? 'arrow_downward'
                            : tx.type === 'withdrawal'
                            ? 'arrow_upward'
                            : tx.type === 'dividend'
                            ? 'payments'
                            : tx.type === 'referral_gift'
                            ? 'redeem'
                            : 'trending_up'}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-ink">
                            {tx.type === 'referral_gift' ? 'Referral Gift Bonus' : `${tx.method} ${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}`}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              tx.status === 'completed'
                                ? 'bg-pos-bg text-on-pos-bg'
                                : tx.status === 'processing' || tx.status === 'pending'
                                ? 'bg-gold text-on-gold'
                                : 'bg-neg-bg text-neg'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-xs text-ink-3">
                          <span className="font-mono">{tx.reference}</span>
                          <span>•</span>
                          <span>{tx.date}</span>
                          {tx.destinationOrSource && (
                            <>
                              <span>•</span>
                              <span className="hidden sm:inline font-mono">{tx.destinationOrSource}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-base font-extrabold font-mono ${
                          isCredit ? 'text-accent' : 'text-ink'
                        }`}
                      >
                        {isCredit ? '+' : '−'}
                        {tx.amount.toLocaleString()} XAF
                      </p>
                      <p className="text-[11px] text-ink-3 flex items-center justify-end gap-0.5">
                        <span>Receipt</span>
                        <span aria-hidden="true" className="material-symbols-outlined text-[14px]">chevron_right</span>
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
