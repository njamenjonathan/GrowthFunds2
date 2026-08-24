import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';

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

  const filtered = transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        tx.reference.toLowerCase().includes(q) ||
        tx.method.toLowerCase().includes(q) ||
        tx.type.toLowerCase().includes(q) ||
        (tx.planName && tx.planName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex-1 p-4 md:p-12 bg-[#f8f9fa] min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none pattern-bg"></div>

      <div className="max-w-[1200px] mx-auto w-full relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191c1d] tracking-tight">
              Transaction History
            </h2>
            <p className="text-xs sm:text-sm text-[#717970] mt-0.5">
              Complete audited financial ledger of all deposits, withdrawals, and yield credits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDeposit}
              className="bg-[#002c13] text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#014421] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add</span> Deposit XAF
            </button>
            <button
              onClick={onOpenWithdraw}
              className="bg-white border border-[#717970] text-[#191c1d] text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#f3f4f5] transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">outbox</span> Withdraw
            </button>
          </div>
        </div>

        {/* Filter Bar & Search (Matching Image 20) */}
        <div className="bg-white p-4 rounded-2xl border border-[#c0c9be]/40 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
            {[
              { id: 'all', label: 'All Activity' },
              { id: 'deposit', label: 'Deposits' },
              { id: 'withdrawal', label: 'Withdrawals' },
              { id: 'investment', label: 'Investments' },
              { id: 'dividend', label: 'Dividends' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  filterType === tab.id
                    ? 'bg-[#002c13] text-white shadow-xs'
                    : 'bg-[#f8f9fa] text-[#717970] hover:bg-[#f3f4f5] hover:text-[#191c1d]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#717970]">
              search
            </span>
            <input
              type="text"
              placeholder="Search reference or method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#c0c9be] focus:border-[#002c13]"
            />
          </div>
        </div>

        {/* List of Transactions */}
        <div className="bg-white rounded-2xl border border-[#c0c9be]/40 shadow-xs overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-[#717970]">
              <span className="material-symbols-outlined text-4xl mb-2">history</span>
              <p className="text-sm font-bold">No transactions found for this filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#e1e3e4]">
              {filtered.map((tx) => {
                const isCredit = tx.type === 'deposit' || tx.type === 'dividend' || tx.type === 'referral_gift';

                return (
                  <div
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#f8f9fa] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          tx.type === 'deposit'
                            ? 'bg-[#b2f1bf]/40 text-[#14512d]'
                            : tx.type === 'withdrawal'
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : tx.type === 'dividend'
                            ? 'bg-[#fed65b]/40 text-[#735c00]'
                            : tx.type === 'referral_gift'
                            ? 'bg-[#fed65b]/50 text-[#002c13]'
                            : 'bg-[#e1e3e4] text-[#002c13]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">
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
                          <p className="text-sm font-bold text-[#191c1d]">
                            {tx.type === 'referral_gift' ? 'Referral Gift Bonus' : `${tx.method} ${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}`}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              tx.status === 'completed'
                                ? 'bg-[#b2f1bf] text-[#14512d]'
                                : tx.status === 'processing' || tx.status === 'pending'
                                ? 'bg-[#fed65b] text-[#745c00]'
                                : 'bg-[#ffdad6] text-[#ba1a1a]'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-xs text-[#717970]">
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
                          isCredit ? 'text-[#002c13]' : 'text-[#191c1d]'
                        }`}
                      >
                        {isCredit ? '+' : '-'}
                        {tx.amount.toLocaleString()} XAF
                      </p>
                      <p className="text-[11px] text-[#717970] flex items-center justify-end gap-0.5">
                        <span>Receipt</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
