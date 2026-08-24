/**
 * The numbers the whole product is built on, in XAF.
 *
 * They live here rather than inside components so a rule the user cares about
 * — "the smallest investment is 5,000", "a check-in is worth 100" — is stated
 * once and read everywhere.
 */

/** Smallest stake in the catalogue, and the smallest deposit. */
export const MIN_INVESTMENT_XAF = 5000;

/** Credited when a friend signs up with your invite code. */
export const REFERRAL_REWARD_XAF = 800;

/** Collectable once every day from the Check-in tab. */
export const DAILY_CHECKIN_XAF = 100;

/** Withdrawals start here and step in multiples of `WITHDRAWAL_STEP_XAF`. */
export const MIN_WITHDRAWAL_XAF = 5000;
export const WITHDRAWAL_STEP_XAF = 5000;

/** The one-tap withdrawal amounts offered in the payout form. */
export const WITHDRAWAL_PRESETS = [5000, 10000, 15000, 20000, 25000];

/** Flat payout charge, deducted from the amount withdrawn. */
export const WITHDRAWAL_FEE_XAF = 250;
