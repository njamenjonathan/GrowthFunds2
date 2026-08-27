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
 * The share of the stake each rung pays back as profit, in percent.
 *
 * Written out a rung at a time rather than derived from a step, because the
 * two largest packages are priced deliberately rather than by the pattern
 * below them: the ladder climbs three points a rung to 36%, then opens up to
 * 50% for the 50,000 and 100,000 packages.
 *
 * The one rule this list must keep is that the money paid never falls as the
 * stake grows — the share may hold flat between two rungs, as it does at the
 * top, but a bigger stake locked up for longer can never come back with less.
 */
export const PROFIT_RATE_LADDER = [24, 27, 30, 33, 36, 50, 50];

/** Clamp a rung index onto the ladder, so an out-of-range rung reads as its nearest end. */
const safeRungIndex = (index: number): number =>
  Math.min(Math.max(index, 0), STAKE_LADDER.length - 1);

/**
 * Profit for the rung at `index`, as a whole number of XAF.
 *
 * Both the money earned and the share it represents rise as an investor moves
 * up the ladder, from 24% of the stake at the bottom rung to 50% at the top.
 * The result is baked into the catalogue as a plain XAF figure — investors see
 * "+1,200 XAF", never a rate to work out.
 */
export const profitForRung = (index: number, stake: number): number =>
  Math.round((stake * PROFIT_RATE_LADDER[safeRungIndex(index)]) / 100);

/** The stake, run time and profit of one rung, ready to drop into a package. */
export const rung = (index: number): { amount: number; durationDays: number; profit: number } => {
  const safeIndex = safeRungIndex(index);
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
