import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { UserProfile, ActiveInvestment, Transaction, ReferralRecord } from '../types';
import { TopReferrersLeaderboard } from './TopReferrersLeaderboard';

interface DashboardViewProps {
  user: UserProfile;
  activeInvestments: ActiveInvestment[];
  transactions: Transaction[];
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onExplorePlans: () => void;
  onOpenKyc: () => void;
  onSelectTransaction: (tx: Transaction) => void;
  onReferralSuccess?: (referral: ReferralRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  activeInvestments,
  transactions,
  onOpenDeposit,
  onOpenWithdraw,
  onExplorePlans,
  onOpenKyc: _onOpenKyc,
  onSelectTransaction,
  onReferralSuccess,
}) => {
  const totalNetWorth = user.availableBalance + user.investedBalance;

  // Referral State
  const referralCode = user.referralCode || `GF-${user.name.split(' ')[0].toUpperCase()}${user.id.slice(-3)}`;
  const referralUrl = `https://growthfund.africa/join?ref=${referralCode}`;

  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Invite Input State
  const [inviteName, setInviteName] = useState<string>('');
  const [inviteContact, setInviteContact] = useState<string>('');
  const [referralFilter, setReferralFilter] = useState<'all' | 'rewarded' | 'signed_up'>('all');

  const referralList = user.referralList || [];
  const successfulSignups = referralList.filter((r) => r.status === 'rewarded' || r.status === 'signed_up').length;
  const totalGiftEarned = user.referralEarnings || referralList.filter((r) => r.status === 'rewarded').reduce((acc, curr) => acc + curr.giftAmount, 0);

  const filteredReferrals = referralList.filter((ref) => {
    if (referralFilter === 'all') return true;
    return ref.status === referralFilter;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    showToast(`Referral code ${referralCode} copied to clipboard!`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    showToast('Referral invite link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Join me on GrowthFund to save and invest in Central Africa! Use my referral code ${referralCode} and start growing your wealth: ${referralUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleSimulateSignup = (customName?: string, customContact?: string) => {
    const demoNames = [
      'Cedric Tchakounte',
      'Amina Nguesso',
      'Patrick Ondzighi',
      'Valerie Kamga',
      'Eric Mbia',
      'Therese Bekono',
    ];
    const demoContacts = [
      '+237 698 112 345',
      'amina.ng@gmail.com',
      '+241 077 452 901',
      '+237 671 223 889',
      'eric.mbia@yahoo.fr',
      '+242 066 991 204',
    ];

    const randomIndex = Math.floor(Math.random() * demoNames.length);
    const friendName = customName && customName.trim() ? customName.trim() : demoNames[randomIndex];
    const friendContact = customContact && customContact.trim() ? customContact.trim() : demoContacts[randomIndex];

    const newRecord: ReferralRecord = {
      id: `ref_${Date.now()}`,
      name: friendName,
      phoneOrEmail: friendContact,
      joinedDate: 'Today, Just now',
      status: 'rewarded',
      giftAmount: 1000,
    };

    if (onReferralSuccess) {
      onReferralSuccess(newRecord);
    }
    showToast(`🎉 Success! ${friendName} signed up using your code. 1,000 XAF gift credited to your balance!`);
    setInviteName('');
    setInviteContact('');
  };

  return (
    <div className="flex-1 p-4 md:p-12 bg-[#f8f9fa] min-h-screen relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none pattern-bg"></div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#002c13] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-[#fed65b]/40 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <span className="material-symbols-outlined text-[#fed65b]">redeem</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white ml-2">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto w-full relative z-10 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#c0c9be]/40 shadow-xs">
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-[#002c13]/20 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#191c1d]">{user.name}</h2>
                <span className="bg-[#b2f1bf] text-[#14512d] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  Tier {user.kycTier} Verified
                </span>
              </div>
              <p className="text-xs text-[#717970] mt-0.5 flex items-center gap-2">
                <span>Account: {user.phone}</span>
                <span>•</span>
                <span>CEMAC Region: {user.country}</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenDeposit}
              className="flex-1 sm:flex-initial bg-[#002c13] text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#014421] transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              Deposit XAF
            </button>
            <button
              onClick={onOpenWithdraw}
              className="flex-1 sm:flex-initial bg-white border border-[#717970] text-[#191c1d] text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#f3f4f5] transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">outbox</span>
              Withdraw
            </button>
            <button
              onClick={onExplorePlans}
              className="hidden lg:flex bg-[#fed65b] text-[#241a00] text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#ffe088] transition-all items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              New Plan
            </button>
          </div>
        </div>

        {/* Portfolio Stats Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Net Worth */}
          <div className="bg-white p-6 rounded-xl border-t-4 border-[#002c13] border-[#c0c9be]/30 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#717970]">
                Total Portfolio Value
              </span>
              <div className="p-2 bg-[#002c13]/10 rounded-lg text-[#002c13]">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#002c13] font-mono">
                {totalNetWorth.toLocaleString()} XAF
              </p>
              <p className="text-xs text-[#306a43] font-semibold flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-sm">trending_up</span> +14.8% YTD Performance
              </p>
            </div>
          </div>

          {/* Available Cash */}
          <div className="bg-white p-6 rounded-xl border border-[#c0c9be]/30 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#717970]">
                Available Liquidity
              </span>
              <div className="p-2 bg-[#f3f4f5] rounded-lg text-[#404941]">
                <span className="material-symbols-outlined text-[18px]">payments</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#191c1d] font-mono">
                {user.availableBalance.toLocaleString()} XAF
              </p>
              <p className="text-xs text-[#717970] mt-1">Ready for instant withdrawal or plan allocation</p>
            </div>
          </div>

          {/* Active Capital Invested */}
          <div className="bg-white p-6 rounded-xl border border-[#c0c9be]/30 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#717970]">
                Capital Invested
              </span>
              <div className="p-2 bg-[#fed65b]/30 rounded-lg text-[#735c00]">
                <span className="material-symbols-outlined text-[18px]">domain</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#735c00] font-mono">
                {user.investedBalance.toLocaleString()} XAF
              </p>
              <p className="text-xs text-[#717970] mt-1">{activeInvestments.length} Active Vetted Contracts</p>
            </div>
          </div>

          {/* Lifetime Dividends & Referral Yield */}
          <div className="bg-white p-6 rounded-xl border border-[#c0c9be]/30 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#717970]">
                Lifetime Net Yield
              </span>
              <div className="p-2 bg-[#b2f1bf]/40 rounded-lg text-[#14512d]">
                <span className="material-symbols-outlined text-[18px]">savings</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#002c13] font-mono">
                +{user.lifetimeEarnings.toLocaleString()} XAF
              </p>
              <p className="text-xs text-[#306a43] mt-1 font-semibold">Realized dividends credited</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INVITE FRIENDS & REFERRAL SECTION (1,000 XAF GIFT PER SIGN-UP) */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-[#c0c9be]/40 shadow-xs overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#002c13] text-white p-6 sm:p-8 relative overflow-hidden">
            {/* Background geometric accents */}
            <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 pointer-events-none flex items-center justify-end pr-6">
              <span className="material-symbols-outlined text-[160px] text-[#fed65b]">redeem</span>
            </div>

            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fed65b] text-[#241a00] text-xs font-bold shadow-xs">
                <span className="material-symbols-outlined text-[15px]">card_giftcard</span>
                <span>1,000 XAF Gift Program</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Invite Friends, Earn 1,000 XAF Gift per Sign-Up
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Empower your network to save and build wealth across the CEMAC region. When a friend joins GrowthFund with your unique code and completes registration, you receive an instant <strong className="text-[#fed65b]">1,000 XAF cash gift</strong> credited directly to your available balance.
              </p>
            </div>
          </div>

          {/* Referral Code & Stats Bar */}
          <div className="p-6 sm:p-8 border-b border-[#e1e3e4] bg-[#fdfdfd] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Unique Code & Copy Link */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#717970] mb-2">
                  Your Unique Referral Code
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-[#f8f9fa] border-2 border-dashed border-[#002c13]/30 px-4 py-3 rounded-xl flex items-center justify-between">
                    <span className="font-mono font-extrabold text-lg sm:text-xl text-[#002c13] tracking-widest select-all">
                      {referralCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                        copiedCode
                          ? 'bg-[#b2f1bf] text-[#14512d]'
                          : 'bg-[#002c13] text-white hover:bg-[#014421]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {copiedCode ? 'check' : 'content_copy'}
                      </span>
                      {copiedCode ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="p-3 bg-white border border-[#c0c9be] hover:bg-[#f3f4f5] text-[#191c1d] rounded-xl flex items-center justify-center transition-colors shadow-2xs"
                    title="Copy direct invite link"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {copiedLink ? 'check' : 'link'}
                    </span>
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="p-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl flex items-center justify-center transition-colors shadow-xs"
                    title="Share via WhatsApp"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                  </button>
                </div>
              </div>

              {/* Direct Invite Form */}
              <div className="pt-2">
                <span className="text-xs font-bold text-[#191c1d] block mb-2">
                  Quick Invite a Friend
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Friend's Full Name (e.g. Jean Paul)"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-[#c0c9be] focus:outline-none focus:border-[#002c13] bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Phone or Email"
                    value={inviteContact}
                    onChange={(e) => setInviteContact(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-[#c0c9be] focus:outline-none focus:border-[#002c13] bg-white"
                  />
                  <button
                    onClick={() => handleSimulateSignup(inviteName, inviteContact)}
                    className="bg-[#002c13] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#014421] transition-all flex items-center justify-center gap-1 whitespace-nowrap shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">send</span>
                    Send Invite
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Referral KPI Bento Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e1e3e4] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#717970]">
                    Friends Signed Up
                  </span>
                  <span className="material-symbols-outlined text-[#002c13] text-lg">group</span>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#191c1d] font-mono">
                    {successfulSignups}
                  </p>
                  <p className="text-[10px] text-[#717970] mt-0.5">Successful registrations</p>
                </div>
              </div>

              <div className="bg-[#fed65b]/20 p-4 rounded-xl border border-[#fed65b]/40 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#735c00]">
                    Total Gifts Earned
                  </span>
                  <span className="material-symbols-outlined text-[#735c00] text-lg">redeem</span>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#735c00] font-mono">
                    +{totalGiftEarned.toLocaleString()} XAF
                  </p>
                  <p className="text-[10px] text-[#735c00] font-semibold mt-0.5">1,000 XAF / friend credited</p>
                </div>
              </div>

              {/* Simulation Helper Pill for Testing */}
              <div className="col-span-2 bg-[#f0fbf3] p-3 rounded-xl border border-[#b2f1bf] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#306a43] text-base">auto_awesome</span>
                  <span className="text-xs text-[#14512d] font-medium">Test Instant Reward:</span>
                </div>
                <button
                  onClick={() => handleSimulateSignup()}
                  className="bg-[#306a43] text-white hover:bg-[#14512d] text-[11px] font-bold px-3 py-1 rounded-lg transition-all flex items-center gap-1 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-xs">add</span>
                  Simulate Friend Sign-Up (+1,000 XAF)
                </button>
              </div>
            </div>
          </div>

          {/* Referral History / Sign-ups Tracker Table */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#002c13]">Tracked Referrals &amp; Sign-Ups</h4>
                <p className="text-xs text-[#717970]">
                  Real-time status of your invited contacts and gift payments
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#f3f4f5] p-1 rounded-lg text-xs font-bold">
                <button
                  onClick={() => setReferralFilter('all')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    referralFilter === 'all'
                      ? 'bg-white text-[#002c13] shadow-2xs'
                      : 'text-[#717970] hover:text-[#191c1d]'
                  }`}
                >
                  All ({referralList.length})
                </button>
                <button
                  onClick={() => setReferralFilter('rewarded')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    referralFilter === 'rewarded'
                      ? 'bg-white text-[#002c13] shadow-2xs'
                      : 'text-[#717970] hover:text-[#191c1d]'
                  }`}
                >
                  Rewarded ({referralList.filter((r) => r.status === 'rewarded').length})
                </button>
                <button
                  onClick={() => setReferralFilter('signed_up')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    referralFilter === 'signed_up'
                      ? 'bg-white text-[#002c13] shadow-2xs'
                      : 'text-[#717970] hover:text-[#191c1d]'
                  }`}
                >
                  Pending ({referralList.filter((r) => r.status !== 'rewarded').length})
                </button>
              </div>
            </div>

            {filteredReferrals.length === 0 ? (
              <div className="p-8 text-center bg-[#f8f9fa] rounded-xl border border-[#e1e3e4] text-[#717970]">
                <span className="material-symbols-outlined text-3xl mb-1 text-[#717970]">person_add</span>
                <p className="text-xs font-bold text-[#191c1d]">No referrals in this category yet</p>
                <p className="text-[11px] mt-0.5">
                  Share your code <strong className="font-mono text-[#002c13]">{referralCode}</strong> to start earning 1,000 XAF per sign-up!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8f9fa] border-b border-[#e1e3e4] text-[11px] font-bold uppercase tracking-wider text-[#717970]">
                      <th className="p-3.5">Referred Friend</th>
                      <th className="p-3.5">Contact / Identifier</th>
                      <th className="p-3.5">Joined Date</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Gift Reward</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e1e3e4] text-xs">
                    {filteredReferrals.map((item) => (
                      <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors">
                        <td className="p-3.5 font-bold text-[#191c1d] flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#002c13]/10 text-[#002c13] font-bold flex items-center justify-center text-xs">
                            {item.name.charAt(0)}
                          </div>
                          <span>{item.name}</span>
                        </td>
                        <td className="p-3.5 font-mono text-[#717970] text-[11px]">
                          {item.phoneOrEmail}
                        </td>
                        <td className="p-3.5 text-[#717970]">{item.joinedDate}</td>
                        <td className="p-3.5">
                          {item.status === 'rewarded' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#b2f1bf] text-[#14512d]">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span>
                              1,000 XAF Gift Credited
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fed65b] text-[#745c00]">
                              <span className="material-symbols-outlined text-[13px]">schedule</span>
                              Signed Up (Verification in Progress)
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-[#306a43]">
                          +{item.giftAmount.toLocaleString()} XAF
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TOP REFERRERS LEADERBOARD (GAMIFICATION & REGIONAL RANKING) */}
        {/* ========================================================================= */}
        <TopReferrersLeaderboard
          currentUser={user}
          onInviteFriend={handleCopyLink}
          onSimulateSignup={() => handleSimulateSignup()}
        />

        {/* Portfolio Growth Chart & Asset Allocation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Growth Chart (Recharts) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-2xl border border-[#c0c9be]/40 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#e1e3e4]">
              <div>
                <h3 className="text-base font-extrabold text-[#002c13] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#002c13]"></span>
                  Invested Capital Growth Trajectory (Last 6 Months)
                </h3>
                <p className="text-xs text-[#717970]">Compounded asset valuation, active investedBalance &amp; yield distribution</p>
              </div>
              <div className="flex items-center gap-1 bg-[#f3f4f5] p-1 rounded-xl text-[11px] font-bold">
                <button
                  onClick={() => setReferralFilter('all')}
                  className="px-2.5 py-1 rounded-lg bg-[#002c13] text-[#fed65b] shadow-2xs"
                >
                  6M
                </button>
                <button
                  className="px-2.5 py-1 rounded-lg text-[#717970] hover:text-[#191c1d]"
                >
                  1Y
                </button>
                <button
                  className="px-2.5 py-1 rounded-lg text-[#717970] hover:text-[#191c1d]"
                >
                  ALL
                </button>
              </div>
            </div>

            {/* Recharts Area / Line Chart */}
            <div className="h-64 w-full bg-[#fafbfc] rounded-xl p-3 border border-[#e1e3e4]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { month: 'Mar 2026', investedBalance: Math.round(user.investedBalance * 0.45), yield: 18000 },
                    { month: 'Apr 2026', investedBalance: Math.round(user.investedBalance * 0.60), yield: 41000 },
                    { month: 'May 2026', investedBalance: Math.round(user.investedBalance * 0.72), yield: 73000 },
                    { month: 'Jun 2026', investedBalance: Math.round(user.investedBalance * 0.85), yield: 110000 },
                    { month: 'Jul 2026', investedBalance: Math.round(user.investedBalance * 0.94), yield: 142000 },
                    { month: 'Aug 2026 (Now)', investedBalance: user.investedBalance, yield: user.lifetimeEarnings || 168450 },
                  ]}
                  margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="rechartsGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#002c13" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#002c13" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="rechartsYieldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fed65b" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#fed65b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#717970"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e1e3e4' }}
                  />
                  <YAxis
                    stroke="#717970"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#002c13] text-white p-3 rounded-xl border border-[#fed65b]/40 shadow-xl text-xs font-mono">
                            <p className="text-[#fed65b] font-bold mb-1">{label}</p>
                            <p>
                              Invested: <span className="font-bold">{payload[0]?.value?.toLocaleString()} XAF</span>
                            </p>
                            {payload[1] && (
                              <p className="text-[#97d5a5]">
                                Accrued Yield: <span className="font-bold">+{payload[1]?.value?.toLocaleString()} XAF</span>
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="investedBalance"
                    name="Invested Balance"
                    stroke="#002c13"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#rechartsGrowthGrad)"
                    activeDot={{ r: 6, fill: '#fed65b', stroke: '#002c13', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="yield"
                    name="Accrued Gains"
                    stroke="#735c00"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#rechartsYieldGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-[#717970]">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#002c13]"></span>
                  <span className="font-bold text-[#191c1d]">Invested Capital: {user.investedBalance.toLocaleString()} XAF</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#fed65b] border border-[#735c00]"></span>
                  <span className="font-medium text-[#735c00]">Accrued Yield: +{user.lifetimeEarnings.toLocaleString()} XAF</span>
                </div>
              </div>
              <span className="font-mono font-bold text-[#306a43]">+14.8% YTD Performance</span>
            </div>
          </div>

          {/* Allocation Breakdown */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#c0c9be]/40 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-[#002c13] mb-1">Asset Allocation</h3>
              <p className="text-xs text-[#717970] mb-4">Diversification by sector</p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#735c00]"></span> Real Estate Fund
                    </span>
                    <span className="font-mono">80.0%</span>
                  </div>
                  <div className="w-full h-2 bg-[#e1e3e4] rounded-full overflow-hidden">
                    <div className="h-full bg-[#735c00] rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#002c13]"></span> Agri-Growth
                    </span>
                    <span className="font-mono">20.0%</span>
                  </div>
                  <div className="w-full h-2 bg-[#e1e3e4] rounded-full overflow-hidden">
                    <div className="h-full bg-[#002c13] rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#e1e3e4] bg-[#f8f9fa] p-3.5 rounded-xl border border-[#c0c9be]/30">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#191c1d]">Daily Liquidity Cap</span>
                <span className="font-mono font-bold text-[#002c13]">10,000,000 XAF</span>
              </div>
              <p className="text-[11px] text-[#717970] mt-1">Tier 2 verified account limit under COSUMAF guidelines.</p>
            </div>
          </div>
        </div>

        {/* Active Investments Holdings */}
        <div className="bg-white rounded-2xl border border-[#c0c9be]/40 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#e1e3e4] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-lg font-bold text-[#002c13]">Active Investment Portfolios</h3>
              <p className="text-xs text-[#717970]">Currently compounded and monitored instruments</p>
            </div>
            <button
              onClick={onExplorePlans}
              className="text-xs font-bold text-[#002c13] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span> Add Investment
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#e1e3e4] text-[11px] font-bold uppercase tracking-wider text-[#717970]">
                  <th className="p-4">Fund Name</th>
                  <th className="p-4">Invested Capital</th>
                  <th className="p-4">Projected Yield</th>
                  <th className="p-4">Accrued Gains</th>
                  <th className="p-4">Current Valuation</th>
                  <th className="p-4">Maturity Date</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e3e4] text-xs">
                {activeInvestments.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="p-4 font-bold text-[#191c1d] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#306a43]"></span>
                      {inv.planName}
                    </td>
                    <td className="p-4 font-mono font-semibold text-[#191c1d]">
                      {inv.amountInvested.toLocaleString()} XAF
                    </td>
                    <td className="p-4 font-bold text-[#002c13]">+{inv.projectedReturn}% / yr</td>
                    <td className="p-4 font-mono font-bold text-[#306a43]">
                      +{inv.accruedEarnings.toLocaleString()} XAF
                    </td>
                    <td className="p-4 font-mono font-bold text-[#002c13]">
                      {inv.currentValuation.toLocaleString()} XAF
                    </td>
                    <td className="p-4 text-[#717970]">{inv.maturityDate}</td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#b2f1bf] text-[#14512d] uppercase">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions List (matching design in Image 20) */}
        <div className="bg-white rounded-2xl border border-[#c0c9be]/40 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#e1e3e4] flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-[#002c13]">Recent Activity</h3>
              <p className="text-xs text-[#717970]">Click on any transaction to view audited receipt</p>
            </div>
            <button
              onClick={() => onSelectTransaction(transactions[0])}
              className="text-xs font-bold text-[#002c13] hover:underline"
            >
              Latest Receipt
            </button>
          </div>

          <div className="divide-y divide-[#e1e3e4]">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#f8f9fa] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
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
                    <span className="material-symbols-outlined text-[20px]">
                      {tx.type === 'deposit'
                        ? 'arrow_downward'
                        : tx.type === 'withdrawal'
                        ? 'arrow_upward'
                        : tx.type === 'dividend'
                        ? 'payments'
                        : tx.type === 'referral_gift'
                        ? 'redeem'
                        : 'show_chart'}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#191c1d]">
                      {tx.type === 'referral_gift'
                        ? 'Referral Gift Bonus'
                        : `${tx.method} ${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}`}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#717970]">
                      <span
                        className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                          tx.status === 'completed'
                            ? 'bg-[#b2f1bf] text-[#14512d]'
                            : tx.status === 'processing' || tx.status === 'pending'
                            ? 'bg-[#fed65b] text-[#745c00]'
                            : 'bg-[#ffdad6] text-[#ba1a1a]'
                        }`}
                      >
                        {tx.status}
                      </span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm font-bold font-mono block ${
                      tx.type === 'deposit' || tx.type === 'dividend' || tx.type === 'referral_gift'
                        ? 'text-[#002c13]'
                        : 'text-[#191c1d]'
                    }`}
                  >
                    {tx.type === 'deposit' || tx.type === 'dividend' || tx.type === 'referral_gift' ? '+' : '-'}
                    {tx.amount.toLocaleString()} XAF
                  </span>
                  <span className="text-[10px] text-[#717970] font-mono">{tx.reference}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
