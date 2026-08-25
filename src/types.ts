/** Every route the app can render. Typing this stops navigation targets
 *  (including notification deep links) from pointing at views that don't exist. */
export type View =
  | 'home'
  | 'plans'
  | 'plan'
  | 'dashboard'
  /** Deep-link targets that open `dashboard` on a particular section. */
  | 'referrals'
  | 'checkin'
  | 'history'
  | 'about'
  | 'security';

/** Sections within the investor profile, shown one at a time. */
export type DashboardTab =
  | 'overview'
  | 'holdings'
  | 'checkin'
  | 'deposits'
  | 'withdrawals'
  | 'invite';

/**
 * One concrete package inside a plan — the thing money actually goes into.
 *
 * A package is fixed on all three sides: you stake `amount`, wait
 * `durationDays`, and collect `amount + profit`. Packages inside a plan are
 * ordered smallest first, and the bigger the stake the longer it runs and the
 * more it pays.
 */
export interface SubInvestment {
  id: string;
  name: string;
  description: string;
  /** The exact stake, in XAF. */
  amount: number;
  /** Profit paid on top of the stake when the package finishes, in XAF. */
  profit: number;
  /** How many days the money stays in, never more than 30. */
  durationDays: number;
  iconName: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  category: 'Agriculture' | 'Real Estate' | 'Technology' | 'Bonds' | 'SME Growth';
  description: string;
  longDescription: string;
  /** The packages an investor picks between, ordered smallest stake first. */
  subInvestments: SubInvestment[];
  iconName: string;
  accentColor: string;
  isPopular?: boolean;
}

export interface ActiveInvestment {
  id: string;
  planId: string;
  planName: string;
  /** Which package inside the plan the money went into. */
  subInvestmentId?: string;
  subInvestmentName?: string;
  amountInvested: number;
  startDate: string;
  /** The day the money can be collected; nothing can be taken out before it. */
  maturityDate: string;
  /** How many days the package runs for in total. */
  durationDays: number;
  /** Profit paid on top of the stake, in XAF. */
  profit: number;
  /** What the investment pays out on its finish date: stake plus profit. */
  maturityValue: number;
  status: 'active' | 'matured' | 'liquidating' | 'liquidated';
}

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'investment'
  | 'payout'
  | 'referral_gift'
  | 'daily_checkin';
export type TransactionStatus = 'completed' | 'processing' | 'pending' | 'failed' | 'rejected';
export type PaymentMethodType = 'MTN MoMo' | 'Orange Money' | 'Express Union Mobile' | 'Bank Transfer' | 'GrowthFund Wallet';

export interface ReferralRecord {
  id: string;
  name: string;
  phoneOrEmail: string;
  joinedDate: string;
  status: 'rewarded' | 'signed_up' | 'pending_verification';
  /** `REFERRAL_REWARD_XAF` for every invite. */
  giftAmount: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  fee: number;
  netAmount: number;
  status: TransactionStatus;
  method: PaymentMethodType;
  reference: string;
  date: string;
  timestamp: number;
  destinationOrSource?: string;
  notes?: string;
  planName?: string;
  subInvestmentName?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string; // CEMAC country (Cameroon, Gabon, Congo, Chad, CAR, Equatorial Guinea)
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  idDocumentType?: 'National ID' | 'Passport' | 'Driver License' | 'Resident Permit';
  idNumber?: string;
  expiryDate?: string;
  documentFileUrl?: string;
  selfieUrl?: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'sms' | 'authenticator';
  availableBalance: number;
  investedBalance: number;
  lifetimeEarnings: number;
  createdAt: string;
  avatarUrl: string;
  referralCode?: string;
  referralCount?: number;
  referralEarnings?: number;
  referralList?: ReferralRecord[];
  /** `YYYY-MM-DD` of the last collected daily check-in, if any. */
  lastCheckInDate?: string;
  /** Consecutive days collected, ending on `lastCheckInDate`. */
  checkInStreak?: number;
  /** Everything the daily check-in has paid out so far, in XAF. */
  checkInEarnings?: number;
}

export interface AdminStats {
  totalAum: number;
  totalUsers: number;
  activeInvestors: number;
  pendingKycCount: number;
  pendingWithdrawalsCount: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARN' | 'BLOCKED';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  timeAgo: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'maturity' | 'referral' | 'checkin' | 'security' | 'kyc';
  read: boolean;
  amount?: number;
  reference?: string;
  targetView?: View;
}
