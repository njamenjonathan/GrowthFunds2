import { InvestmentPlan, Transaction, UserProfile, ActiveInvestment, AuditLog, AppNotification, SubInvestment } from '../types';
import { avatarFor } from '../lib/avatar';
import { REFERRAL_REWARD_XAF, DAILY_CHECKIN_XAF } from '../lib/constants';
import { rung } from '../lib/commitment';

/** ISO date `days` from today; keeps demo investments consistently in-term. */
const daysFromNow = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

/**
 * Build one package on rung `index` of the shared ladder.
 *
 * The stake, the run time and the profit all come from `rung`, so every plan
 * offers the same rising sequence — 5,000 XAF for 5 days at the bottom, more
 * money for longer and more profit on every step up — and no plan can quietly
 * drift out of that order.
 */
const pkg = (
  index: number,
  id: string,
  name: string,
  description: string,
  iconName: string
): SubInvestment => ({ id, name, description, iconName, ...rung(index) });

export const INITIAL_PLANS: InvestmentPlan[] = [
  {
    id: 'agri-growth',
    name: 'Agriculture',
    category: 'Agriculture',
    description: 'Farms, livestock and food processing across the region.',
    longDescription:
      'Your money funds cocoa cooperatives, poultry batches, cassava milling and grain storage in Cameroon and Gabon. Each package runs for a fixed number of days, then pays back your money plus its profit.',
    subInvestments: [
      pkg(0, 'agri-poultry-units', 'Poultry Batch', 'Feed and raise one batch of chickens with a local farmer.', 'pets'),
      pkg(1, 'agri-cassava-jobs', 'Cassava Milling', 'Fund a milling and packaging run at the Nanga-Eboko plant.', 'precision_manufacturing'),
      pkg(2, 'agri-cocoa-shares', 'Cocoa Harvest Share', 'Take a share of a cocoa harvest from a certified cooperative near Douala.', 'forest'),
      pkg(3, 'agri-grain-storage', 'Grain Storage', 'Buy maize at harvest price and hold it in an insured silo.', 'warehouse'),
      pkg(4, 'agri-coffee-highland', 'Highland Coffee', 'Back new arabica hectares in Bafoussam through to their first crop.', 'local_cafe'),
    ],
    iconName: 'eco',
    accentColor: '#2f6b4d',
  },
  {
    id: 'real-estate-fund',
    name: 'Real Estate',
    category: 'Real Estate',
    description: 'Houses, rentals, shops and land in the fastest-growing cities.',
    longDescription:
      'Your money goes into building sites, rental blocks, shop units and serviced plots in Douala, Yaounde and Libreville. Pick the package that matches what you can put in and how long you can wait.',
    subInvestments: [
      pkg(0, 're-construction-jobs', 'Building Site Work', 'Pay the masonry and finishing crews on an active site.', 'engineering'),
      pkg(1, 're-rental-apartments', 'Rental Apartment', 'Furnish an apartment let to a corporate tenant.', 'apartment'),
      pkg(2, 're-residential-houses', 'Residential House', 'Help build a family home for sale in the Douala suburbs.', 'house'),
      pkg(3, 're-commercial-shops', 'Shop Unit', 'Fit out a retail unit in Bonanjo leased to an established business.', 'storefront'),
      pkg(4, 're-serviced-land', 'Serviced Land Plot', 'Buy, survey and service a titled plot before resale.', 'landscape'),
      pkg(5, 're-office-floor', 'Office Floor', 'Take a share of an office floor leased on a multi-year term.', 'domain'),
      pkg(6, 're-logistics-hub', 'Logistics Warehouse', 'Back a warehouse serving the Douala port corridor.', 'local_shipping'),
    ],
    iconName: 'domain',
    accentColor: '#b08a2e',
    isPopular: true,
  },
  {
    id: 'tech-venture',
    name: 'Technology',
    category: 'Technology',
    description: 'Payments, solar power and digital work across CEMAC.',
    longDescription:
      'Your money backs payment startups, off-grid solar installations, fibre links and young developers taking on client contracts. Short, fixed runs with the profit set before you commit.',
    subInvestments: [
      pkg(0, 'tech-digital-jobs', 'Digital Work Contract', 'Equip a young developer or designer taking on a client contract.', 'laptop_mac'),
      pkg(1, 'tech-solar-home', 'Home Solar Kit', 'Install one household solar kit, repaid from metered use.', 'solar_power'),
      pkg(2, 'tech-fintech-startups', 'Payments Startup', 'Lend to a payments startup already earning revenue.', 'payments'),
      pkg(3, 'tech-solar-minigrids', 'Solar Mini-Grid', 'Fund part of a village mini-grid and its metering.', 'bolt'),
      pkg(4, 'tech-fiber-link', 'Fibre Link', 'Back a stretch of fibre connecting two regional towns.', 'router'),
      pkg(5, 'tech-datacentre', 'Data Centre Rack', 'Take a share of regional colocation capacity.', 'dns'),
    ],
    iconName: 'rocket_launch',
    accentColor: '#41637d',
  },
  {
    id: 'cemac-sovereign-bond',
    name: 'Government Bonds',
    category: 'Bonds',
    description: 'The steadiest option — treasury bills and city notes.',
    longDescription:
      'Your money buys short-dated government bills, city infrastructure notes and central bank paper across the CEMAC states. The safest corner of the catalogue, with the shortest runs.',
    subInvestments: [
      pkg(0, 'bond-beac-liquidity', 'Central Bank Note', 'The quickest package on the platform: five days in central bank paper.', 'savings'),
      pkg(1, 'bond-treasury-bill', 'Treasury Bill', 'Short-dated Cameroon government bills held to maturity.', 'receipt_long'),
      pkg(2, 'bond-municipal-notes', 'City Infrastructure Note', 'City notes funding roads, drainage and public markets.', 'location_city'),
      pkg(3, 'bond-government-note', 'Government Bond', 'Gabon and Congo sovereign paper paying a fixed coupon.', 'account_balance'),
    ],
    iconName: 'account_balance',
    accentColor: '#33586b',
  },
];

export const INITIAL_USER: UserProfile = {
  id: 'usr_882931',
  name: 'Samuel E. Nguema',
  email: 'samuel.nguema@investor.cm',
  phone: '+237 678 920 145',
  country: 'Cameroon',
  kycStatus: 'verified',
  idDocumentType: 'National ID',
  idNumber: 'CM-10928374-2024',
  expiryDate: '2029-11-15',
  twoFactorEnabled: true,
  twoFactorMethod: 'sms',
  availableBalance: 82500,
  investedBalance: 45000,
  lifetimeEarnings: 12400,
  createdAt: '2024-01-15',
  avatarUrl: avatarFor('Samuel E. Nguema'),
  referralCode: 'GF-SAM882',
  referralCount: 4,
  referralEarnings: REFERRAL_REWARD_XAF * 3,
  // No check-in recorded yet, so today's 100 XAF is there to collect.
  checkInStreak: 0,
  checkInEarnings: DAILY_CHECKIN_XAF * 6,
  referralList: [
    {
      id: 'ref_01',
      name: 'Marcelle Ondoa',
      phoneOrEmail: '+237 69X XXX 312',
      joinedDate: 'Aug 21, 2026',
      status: 'rewarded',
      giftAmount: REFERRAL_REWARD_XAF,
    },
    {
      id: 'ref_02',
      name: 'Christian Kaptue',
      phoneOrEmail: 'christian.k@gmail.com',
      joinedDate: 'Aug 18, 2026',
      status: 'rewarded',
      giftAmount: REFERRAL_REWARD_XAF,
    },
    {
      id: 'ref_03',
      name: 'Diane Ngozi',
      phoneOrEmail: '+237 65X XXX 804',
      joinedDate: 'Aug 10, 2026',
      status: 'rewarded',
      giftAmount: REFERRAL_REWARD_XAF,
    },
    {
      id: 'ref_04',
      name: 'Aristide Mba',
      phoneOrEmail: 'aristide.mba@yahoo.fr',
      joinedDate: 'Aug 04, 2026',
      status: 'signed_up',
      giftAmount: REFERRAL_REWARD_XAF,
    },
  ],
};

export const INITIAL_ACTIVE_INVESTMENTS: ActiveInvestment[] = [
  {
    id: 'inv_101',
    planId: 'real-estate-fund',
    planName: 'Real Estate',
    subInvestmentId: 're-serviced-land',
    subInvestmentName: 'Serviced Land Plot',
    amountInvested: 25000,
    startDate: daysFromNow(-6),
    maturityDate: daysFromNow(14),
    durationDays: 20,
    profit: 9000,
    maturityValue: 34000,
    status: 'active',
  },
  {
    id: 'inv_102',
    planId: 'agri-growth',
    planName: 'Agriculture',
    subInvestmentId: 'agri-cocoa-shares',
    subInvestmentName: 'Cocoa Harvest Share',
    amountInvested: 15000,
    startDate: daysFromNow(-9),
    maturityDate: daysFromNow(3),
    durationDays: 12,
    profit: 4500,
    maturityValue: 19500,
    status: 'active',
  },
  {
    id: 'inv_103',
    planId: 'cemac-sovereign-bond',
    planName: 'Government Bonds',
    subInvestmentId: 'bond-treasury-bill',
    subInvestmentName: 'Treasury Bill',
    amountInvested: 10000,
    startDate: daysFromNow(-9),
    // Finished yesterday, so the demo account always has something to collect.
    maturityDate: daysFromNow(-1),
    durationDays: 8,
    profit: 2700,
    maturityValue: 12700,
    status: 'matured',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_00_checkin',
    type: 'daily_checkin',
    amount: DAILY_CHECKIN_XAF,
    fee: 0,
    netAmount: DAILY_CHECKIN_XAF,
    status: 'completed',
    method: 'GrowthFund Wallet',
    reference: 'GF-CI-7710254',
    date: 'Yesterday, 08:05 AM',
    timestamp: Date.now() - 1000 * 60 * 60 * 30,
    destinationOrSource: 'Daily check-in',
    notes: 'Daily check-in reward credited to your wallet.',
  },
  {
    id: 'tx_00_ref',
    type: 'referral_gift',
    amount: REFERRAL_REWARD_XAF,
    fee: 0,
    netAmount: REFERRAL_REWARD_XAF,
    status: 'completed',
    method: 'GrowthFund Wallet',
    reference: 'GF-RF-8192031',
    date: 'Aug 21, 2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    destinationOrSource: 'Referral bonus: Marcelle Ondoa',
    notes: `${REFERRAL_REWARD_XAF.toLocaleString()} XAF invite gift credited for a friend sign-up.`,
  },
  {
    id: 'tx_01',
    type: 'deposit',
    amount: 50000,
    fee: 0,
    netAmount: 50000,
    status: 'completed',
    method: 'MTN MoMo',
    reference: 'GF-DP-1049281',
    date: 'Today, 10:42 AM',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    destinationOrSource: '+237 67X XXX 890',
    notes: 'Mobile money top-up confirmed.',
  },
  {
    id: 'tx_02',
    type: 'investment',
    amount: 15000,
    fee: 0,
    netAmount: 15000,
    status: 'completed',
    method: 'GrowthFund Wallet',
    reference: 'GF-IV-3829104',
    date: 'Today, 09:15 AM',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    planName: 'Agriculture',
    subInvestmentName: 'Cocoa Harvest Share',
    notes: '15,000 XAF placed for 12 days.',
  },
  {
    id: 'tx_03',
    type: 'withdrawal',
    amount: 10000,
    fee: 250,
    netAmount: 9750,
    status: 'completed',
    method: 'Bank Transfer',
    reference: 'GF-WD-9928374',
    date: 'Yesterday, 03:30 PM',
    timestamp: Date.now() - 1000 * 60 * 60 * 26,
    destinationOrSource: 'Afriland First Bank (•••• 8920)',
    notes: 'Payout sent to your verified bank account.',
  },
  {
    id: 'tx_04',
    type: 'payout',
    amount: 11800,
    fee: 0,
    netAmount: 11800,
    status: 'completed',
    method: 'GrowthFund Wallet',
    reference: 'GF-PO-4491028',
    date: 'Aug 12, 2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 12,
    planName: 'Real Estate',
    subInvestmentName: 'Building Site Work',
    notes: 'Finished its 8-day run. Money and profit returned to your balance.',
  },
  {
    id: 'tx_05',
    type: 'deposit',
    amount: 20000,
    fee: 0,
    netAmount: 20000,
    status: 'failed',
    method: 'Express Union Mobile',
    reference: 'GF-DP-0918234',
    date: 'Aug 04, 2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 20,
    notes: 'Not enough money on the mobile wallet at confirmation.',
  },
];

export const INITIAL_ADMIN_DEPOSITS: { id: string; user: string; amount: number; status: 'APPROVED' | 'PENDING' | 'REJECTED'; date: string; method: string }[] = [
  { id: 'dp_adm_1', user: 'Jean Dupont', amount: 25000, status: 'APPROVED', date: 'Oct 24, 09:30', method: 'MTN MoMo' },
  { id: 'dp_adm_2', user: 'Marie Claire', amount: 100000, status: 'PENDING', date: 'Oct 23, 14:15', method: 'Orange Money' },
  { id: 'dp_adm_3', user: 'Alioune Sow', amount: 50000, status: 'APPROVED', date: 'Oct 23, 11:00', method: 'Express Union' },
  { id: 'dp_adm_4', user: 'Clarisse Moundo', amount: 15000, status: 'PENDING', date: 'Oct 22, 16:40', method: 'Bank Transfer' },
];

export const INITIAL_ADMIN_WITHDRAWALS: { id: string; user: string; amount: number; status: 'PENDING' | 'REJECTED' | 'APPROVED'; date: string; method: string; account: string }[] = [
  { id: 'wd_adm_1', user: 'Paul Biya', amount: 25000, status: 'PENDING', date: 'Oct 24, 10:10', method: 'MTN MoMo', account: '+237 67X XXX 890' },
  { id: 'wd_adm_2', user: 'Amina Lo', amount: 15000, status: 'REJECTED', date: 'Oct 23, 18:20', method: 'Orange Money', account: '+237 69X XXX 120' },
  { id: 'wd_adm_3', user: 'Ousmane Fall', amount: 20000, status: 'PENDING', date: 'Oct 23, 12:05', method: 'Bank Transfer', account: 'BGFIBank Gabon (•••• 4410)' },
];

export const INITIAL_KYC_APPLICATIONS = [
  { id: 'kyc_01', user: 'Benoit Ndongo', email: 'benoit.n@gmail.com', country: 'Cameroon', docType: 'National ID', docNumber: 'CM-29384910-2023', submittedAt: '2 hours ago', status: 'PENDING' },
  { id: 'kyc_02', user: 'Sylvie Mboumba', email: 'sylvie.mb@yahoo.fr', country: 'Gabon', docType: 'Passport', docNumber: 'GA-P9283401', submittedAt: '5 hours ago', status: 'PENDING' },
  { id: 'kyc_03', user: 'Rodrigue Tati', email: 'rodrigue.t@pro.cg', country: 'Congo', docType: 'National ID', docNumber: 'CG-88291044-B', submittedAt: '1 day ago', status: 'PENDING' },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'log_01', timestamp: '2026-08-23 18:45:10', actor: 'System', action: 'Daily payout run completed', target: 'Matured investments', ipAddress: '192.168.1.10', status: 'SUCCESS' },
  { id: 'log_02', timestamp: '2026-08-23 17:12:04', actor: 'Manager', action: 'Approved deposit #dp_adm_1 (25,000 XAF)', target: 'Jean Dupont wallet', ipAddress: '197.234.219.12', status: 'SUCCESS' },
  { id: 'log_03', timestamp: '2026-08-23 15:30:22', actor: 'Security', action: 'Two-factor code verified', target: 'User usr_882931', ipAddress: '41.202.219.88', status: 'SUCCESS' },
  { id: 'log_04', timestamp: '2026-08-23 14:02:18', actor: 'Verification worker', action: 'ID document matched', target: 'Samuel E. Nguema', ipAddress: '10.0.4.19', status: 'SUCCESS' },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    title: 'Ready to collect',
    message: 'Your Treasury Bill finished its 8-day run. Collect 12,700 XAF from your investments.',
    timestamp: Date.now() - 1000 * 60 * 25,
    timeAgo: '25m ago',
    type: 'maturity',
    read: false,
    amount: 12700,
    reference: 'GF-MT-102',
    targetView: 'dashboard',
  },
  {
    id: 'notif_02',
    title: 'Deposit credited',
    message: '50,000 XAF from MTN Mobile Money is now in your balance.',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    timeAgo: '2h ago',
    type: 'deposit',
    read: false,
    amount: 50000,
    reference: 'GF-DP-1049281',
    targetView: 'dashboard',
  },
  {
    id: 'notif_03',
    title: 'Daily check-in is waiting',
    message: `Collect today's ${DAILY_CHECKIN_XAF} XAF from the Check-in tab.`,
    timestamp: Date.now() - 1000 * 60 * 60 * 6,
    timeAgo: '6h ago',
    type: 'checkin',
    read: false,
    amount: DAILY_CHECKIN_XAF,
    targetView: 'checkin',
  },
  {
    id: 'notif_04',
    title: 'Referral gift credited',
    message: `Marcelle Ondoa signed up with your code GF-SAM882. ${REFERRAL_REWARD_XAF} XAF added to your balance.`,
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    timeAgo: '2d ago',
    type: 'referral',
    read: true,
    amount: REFERRAL_REWARD_XAF,
    reference: 'GF-RF-8192031',
    targetView: 'referrals',
  },
  {
    id: 'notif_05',
    title: 'Two-factor protection is on',
    message: 'SMS verification is active and protecting your withdrawals.',
    timestamp: Date.now() - 1000 * 60 * 60 * 96,
    timeAgo: '4d ago',
    type: 'security',
    read: true,
    targetView: 'security',
  },
];
