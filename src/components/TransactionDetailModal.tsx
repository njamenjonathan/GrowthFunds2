import React from 'react';
import { Transaction } from '../types';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onOpenSupport: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  onOpenSupport,
}) => {
  if (!transaction) return null;

  const isCredit = transaction.type === 'deposit' || transaction.type === 'dividend' || transaction.type === 'referral_gift';

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#c0c9be]/50 overflow-hidden flex flex-col">
        {/* Header (Matching Image 22) */}
        <div className="p-6 border-b border-[#e1e3e4] flex justify-between items-center bg-[#f8f9fa]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#002c13]">receipt</span>
            <h3 className="text-base font-bold text-[#002c13]">Transaction Details</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#717970] hover:text-[#191c1d] rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content (Matching Image 22) */}
        <div className="p-6 space-y-6">
          <div className="text-center pb-2">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 ${
                transaction.status === 'completed'
                  ? 'bg-[#b2f1bf] text-[#14512d]'
                  : transaction.status === 'processing' || transaction.status === 'pending'
                  ? 'bg-[#fed65b] text-[#745c00]'
                  : 'bg-[#ffdad6] text-[#ba1a1a]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {transaction.status}
            </span>
            <h2 className="text-3xl font-extrabold text-[#191c1d] font-mono">
              {isCredit ? '+' : '-'}
              {transaction.amount.toLocaleString()} XAF
            </h2>
            <p className="text-xs text-[#717970] mt-1 font-mono">{transaction.reference}</p>
          </div>

          <div className="bg-[#f8f9fa] rounded-xl p-4 border border-[#e1e3e4] space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[#717970]">Transaction Type</span>
              <span className="font-bold text-[#191c1d] uppercase">{transaction.type}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#717970]">Payment Method</span>
              <span className="font-bold text-[#191c1d]">{transaction.method}</span>
            </div>

            {transaction.destinationOrSource && (
              <div className="flex justify-between">
                <span className="text-[#717970]">Account / Destination</span>
                <span className="font-mono font-semibold text-[#191c1d]">{transaction.destinationOrSource}</span>
              </div>
            )}

            {transaction.planName && (
              <div className="flex justify-between">
                <span className="text-[#717970]">Target Portfolio</span>
                <span className="font-bold text-[#002c13]">{transaction.planName}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-[#717970]">Processing Fee</span>
              <span className="font-mono text-[#717970]">{transaction.fee.toLocaleString()} XAF</span>
            </div>

            <div className="flex justify-between font-bold text-[#002c13] pt-2 border-t border-[#e1e3e4]">
              <span>Net Settled Amount</span>
              <span className="font-mono text-sm">{transaction.netAmount.toLocaleString()} XAF</span>
            </div>

            <div className="flex justify-between pt-1 text-[11px] text-[#717970]">
              <span>Timestamp</span>
              <span>{transaction.date}</span>
            </div>

            <div className="flex justify-between text-[10px] text-[#717970] font-mono">
              <span>COSUMAF Audit Clearance</span>
              <span className="text-[#306a43]">CERT-CLR-2026-XAF</span>
            </div>
          </div>

          {transaction.notes && (
            <div className="p-3 bg-white border border-[#c0c9be]/50 rounded-lg text-xs text-[#404941]">
              <p className="font-bold text-[#191c1d] mb-0.5">Notes:</p>
              <p>{transaction.notes}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handlePrintReceipt}
              className="flex-1 py-3 bg-[#002c13] text-white rounded-xl text-xs font-bold hover:bg-[#014421] flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download Receipt (PDF)</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenSupport();
              }}
              className="py-3 px-4 border border-[#c0c9be] text-[#404941] rounded-xl text-xs font-bold hover:bg-[#f3f4f5] flex items-center justify-center gap-1"
              title="Report an issue or dispute"
            >
              <span className="material-symbols-outlined text-[16px]">flag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
