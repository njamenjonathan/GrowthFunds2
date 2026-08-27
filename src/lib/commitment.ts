import { SubInvestment } from '../types';

/**
 * How long capital stays locked, and what it earns.
 *
 * Every opportunity in the catalogue is a fixed package: one stake, one run
 * time in days, one profit in XAF. The rule the ladder encodes is the one an
 * investor is told on the plan page — the smallest stake runs for the shortest
 * time and pays the least, and each step up stakes more, runs longer and pays
 * more. Nothing runs longer than `MAX_TERM_DAYS`.
 */

/** No package may run longer than this. */
export const MAX_TERM_DAYS = 30;

/**
 * The run times, shortest first: 5 days for the entry package, then 8, then a
 * four-day step for every rung above it, stopping short of 30 days.
 */
export const TERM_DAYS_LADDER = [5, 8, 12, 16, 20, 24, 28];

/** The stakes each rung of the ladder opens at, smallest first. */
export const STAKE_LADDER = [5000, 10000, 15000, 20000, 25000, 50000, 100000];

/**
 * Profit for the rung at `index`, as a whole number of XAF.
 *
 * The profit share widens as the stake grows (12% of the stake at the bottom
 * rung, three more points on every rung above), so both the money earned and
 * the share it represents rise together as an investor moves up the ladder.
 * The result is baked into the catalogue as a plain XAF figure — investors see
 * "+600 XAF", never a rate to work out.
 */
export const profitForRung = (index: number, stake: number): number =>
  Math.round((stake * (12 + index * 3)) / 100);

/** The stake, run time and profit of one rung, ready to drop into a package. */
export const rung = (index: number): { amount: number; durationDays: number; profit: number } => {
  const safeIndex = Math.min(Math.max(index, 0), STAKE_LADDER.length - 1);
  const amount = STAKE_LADDER[safeIndex];
  return {
    amount,
    durationDays: TERM_DAYS_LADDER[safeIndex],
    profit: profitForRung(safeIndex, amount),
  };
};

/** Total paid back when a package finishes: the stake plus its profit. */
export const payoutFor = (sub: SubInvestment): number => sub.amount + sub.profit;

/** The `YYYY-MM-DD` a package bought today would finish on. */
export const maturityDateInDays = (days: number, from: Date = new Date()): string => {
  const date = new Date(from);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

/** "in 5 days" / "tomorrow" — how far off a date is, in words. */
export const formatDays = (days: number): string => {
  if (days <= 0) return 'today';
  if (days === 1) return '1 day';
  return `${days} days`;
};

/** Kept for callers that speak in remaining time rather than a date. */
export const formatRemaining = formatDays;

const DAY_MS = 1000 * 60 * 60 * 24;

export interface LockState {
  /** True while the money cannot be collected yet. */
  locked: boolean;
  daysRemaining: number;
  daysElapsed: number;
  totalDays: number;
  /** How far through its run the investment is, 0-100. */
  progressPercent: number;
}

/**
 * Where an investment sits in its run.
 *
 * The single place the "can this be collected yet?" question is answered, so
 * the table badge, the collect button and the guard in `App` cannot drift
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
