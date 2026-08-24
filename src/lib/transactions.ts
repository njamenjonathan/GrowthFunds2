import { Transaction, TransactionStatus, TransactionType } from '../types';

/** Money in — shown with a `+` and the positive colour wherever it appears. */
export const isCredit = (type: TransactionType): boolean =>
  type === 'deposit' || type === 'payout' || type === 'referral_gift' || type === 'daily_checkin';

export const TRANSACTION_ICON: Record<TransactionType, string> = {
  deposit: 'arrow_downward',
  withdrawal: 'arrow_upward',
  investment: 'trending_up',
  payout: 'savings',
  referral_gift: 'redeem',
  daily_checkin: 'calendar_month',
};

/** Badge colours per type, used by the round icon on a transaction row. */
export const TRANSACTION_TONE: Record<TransactionType, string> = {
  deposit: 'bg-pos-bg text-on-pos-bg',
  withdrawal: 'bg-neg-bg text-neg',
  investment: 'bg-surface-3 text-accent',
  payout: 'bg-accent-bg text-accent',
  referral_gift: 'bg-gold/50 text-accent',
  daily_checkin: 'bg-gold/30 text-gold-ink',
};

export const STATUS_CHIP: Record<TransactionStatus, string> = {
  completed: 'bg-pos-bg text-on-pos-bg',
  processing: 'bg-gold text-on-gold',
  pending: 'bg-gold text-on-gold',
  failed: 'bg-neg-bg text-neg',
  rejected: 'bg-neg-bg text-neg',
};

/** Human title for a ledger entry, e.g. "MTN MoMo deposit". */
export const transactionLabel = (tx: Transaction): string => {
  if (tx.type === 'referral_gift') return 'Referral gift';
  if (tx.type === 'daily_checkin') return 'Daily check-in';
  if (tx.type === 'payout') return `${tx.subInvestmentName ?? tx.planName ?? 'Investment'} paid out`;
  if (tx.type === 'investment') return `Invested in ${tx.subInvestmentName ?? tx.planName ?? 'a package'}`;
  return `${tx.method} ${tx.type}`;
};

export const currency = (value: number): string => `${value.toLocaleString()} XAF`;

/** Signed amount as displayed, e.g. "+50,000 XAF" or "−10,000 XAF". */
export const signedAmount = (tx: Transaction): string =>
  `${isCredit(tx.type) ? '+' : '−'}${tx.amount.toLocaleString()} XAF`;
