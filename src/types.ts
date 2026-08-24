/** Every route the app can render. Typing this stops navigation targets
 *  (including notification deep links) from pointing at views that don't exist. */
export type View = 'home' | 'plans' | 'dashboard' | 'referrals' | 'history' | 'security';

export type RiskLevel = 'Very Low' | 'Low' | 'Medium' | 'High';

export interface InvestmentPlan {
  id: string;
  name: string;
  category: 'Agriculture' | 'Real Estate' | 'Technology' | 'Bonds' | 'SME Growth';
  riskLevel: RiskLevel;
  projectedReturn: number; // e.g. 8 for 8%
  minInvestment: number; // in XAF
  termMonths: number;
  description: string;
  longDescription: string;
  managementFeePercent: number;
  underlyingAssets: string[];
  historicalPerformance: { year: string; returnPct: number }[];
  regulatoryNotice: string;
  iconName: string;
  accentColor: string;
  isPopular?: boolean;
}

export interface ActiveInvestment {
  id: string;
  planId: string;
  planName: string;
  amountInvested: number;
  startDate: string;
  maturityDate: string;
  projectedReturn: number;
  accruedEarnings: number;
  currentValuation: number;
  status: 'active' | 'matured' | 'liquidating' | 'liquidated';
}

export type TransactionType = 'deposit' | 'withdrawal' | 'investment' | 'dividend' | 'liquidation' | 'referral_gift';
export type TransactionStatus = 'completed' | 'processing' | 'pending' | 'failed' | 'rejected';
export type PaymentMethodType = 'MTN MoMo' | 'Orange Money' | 'Express Union Mobile' | 'Bank Transfer' | 'GrowthFund Wallet';

export interface ReferralRecord {
  id: string;
  name: string;
  phoneOrEmail: string;
  joinedDate: string;
  status: 'rewarded' | 'signed_up' | 'pending_verification';
  giftAmount: number; // 1000 XAF
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
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string; // CEMAC country (Cameroon, Gabon, Congo, Chad, CAR, Equatorial Guinea)
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  kycTier: 1 | 2 | 3;
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
}

export interface AdminStats {
  totalAum: number;
  monthlyGrowthRate: number;
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
  type: 'deposit' | 'withdrawal' | 'investment' | 'maturity' | 'dividend' | 'referral' | 'security' | 'kyc';
  read: boolean;
  amount?: number;
  reference?: string;
  targetView?: View;
}

