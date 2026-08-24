import { SubInvestment } from '../types';

/**
 * A commitment band. Larger commitments lock up for longer and, in exchange
 * for that longer lock-up, earn a higher annual return than the opportunity's
 * headline rate — so more money means more time, and more time means more
 * profit.
 */
export interface CommitmentTier {
  id: string;
  label: string;
  /** Smallest commitment that reaches this band, in XAF. */
  minAmount: number;
  /** Months added to the opportunity's base lock-up. */
  extraMonths: number;
  /** Percentage points added to the annual target return. */
  bonusReturn: number;
  blurb: string;
}

/** Ordered smallest first; `tierFor` walks it backwards to find the match. */
export const COMMITMENT_TIERS: CommitmentTier[] = [
  {
    id: 'starter',
    label: 'Starter',
    minAmount: 5000,
    extraMonths: 0,
    bonusReturn: 0,
    blurb: 'The opportunity’s own term and rate, with no lock-up extension.',
  },
  {
    id: 'builder',
    label: 'Builder',
    minAmount: 50000,
    extraMonths: 3,
    bonusReturn: 1,
    blurb: 'Three more months locked in, one extra point of annual return.',
  },
  {
    id: 'growth',
    label: 'Growth',
    minAmount: 250000,
    extraMonths: 6,
    bonusReturn: 2,
    blurb: 'Six more months locked in, two extra points of annual return.',
  },
  {
    id: 'premier',
    label: 'Premier',
    minAmount: 1000000,
    extraMonths: 12,
    bonusReturn: 3.5,
    blurb: 'A full extra year locked in, three and a half extra points of return.',
  },
];

/** The band a commitment falls into. Anything below the floor uses Starter. */
export const tierFor = (amount: number): CommitmentTier => {
  for (let index = COMMITMENT_TIERS.length - 1; index >= 0; index -= 1) {
    if (amount >= COMMITMENT_TIERS[index].minAmount) return COMMITMENT_TIERS[index];
  }
  return COMMITMENT_TIERS[0];
};

/** Total months the capital stays locked for this commitment. */
export const lockMonthsFor = (sub: SubInvestment, amount: number): number =>
  sub.termMonths + tierFor(amount).extraMonths;

/** Annual target return for this commitment, tier bonus included. */
export const annualReturnFor = (sub: SubInvestment, amount: number): number =>
  Number((sub.projectedReturn + tierFor(amount).bonusReturn).toFixed(2));

/** Profit earned across the whole lock-up. */
export const projectedProfitFor = (sub: SubInvestment, amount: number): number =>
  Math.round(amount * (annualReturnFor(sub, amount) / 100) * (lockMonthsFor(sub, amount) / 12));

/** What the holding pays out the day its lock-up ends. */
export const maturityValueFor = (sub: SubInvestment, amount: number): number =>
  amount + projectedProfitFor(sub, amount);

/** The date `months` from `from`, as the `YYYY-MM-DD` the ledger stores. */
export const maturityDateFrom = (from: Date, months: number): string => {
  const date = new Date(from);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
};

const DAY_MS = 1000 * 60 * 60 * 24;

export interface LockState {
  /** True while the capital cannot be redeemed. */
  locked: boolean;
  daysRemaining: number;
  daysElapsed: number;
  totalDays: number;
  /** How far through the lock-up the holding is, 0-100. */
  progressPercent: number;
}

/**
 * Where a holding sits in its lock-up.
 *
 * The single place the "can this be redeemed yet?" question is answered, so the
 * table badge, the redeem button and the redemption guard in `App` cannot drift
 * apart on the boundary day.
 */
export const lockStateFor = (
  holding: { startDate: string; maturityDate: string },
  now: Date = new Date()
): LockState => {
  const start = new Date(holding.startDate).getTime();
  const end = new Date(holding.maturityDate).getTime();
  const today = now.getTime();

  const totalDays = Math.max(1, Math.round((end - start) / DAY_MS));
  const daysRemaining = Math.max(0, Math.ceil((end - today) / DAY_MS));
  const daysElapsed = Math.max(0, totalDays - daysRemaining);

  return {
    locked: today < end,
    daysRemaining,
    daysElapsed,
    totalDays,
    progressPercent: Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100)),
  };
};

/** "3 days" / "1 month, 12 days" — how long is left, in words. */
export const formatRemaining = (days: number): string => {
  if (days <= 0) return 'unlocked';
  if (days < 31) return `${days} ${days === 1 ? 'day' : 'days'}`;
  const months = Math.floor(days / 30);
  const rest = days % 30;
  const monthPart = `${months} ${months === 1 ? 'month' : 'months'}`;
  return rest === 0 ? monthPart : `${monthPart}, ${rest} ${rest === 1 ? 'day' : 'days'}`;
};
