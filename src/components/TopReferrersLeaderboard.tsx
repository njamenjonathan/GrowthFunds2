import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

export interface LeaderboardMember {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  location: string;
  flag: string;
  invitesCount: number;
  totalGiftsXAF: number;
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Rising';
  badgeColor: string;
  isCurrentUser?: boolean;
}

interface TopReferrersLeaderboardProps {
  currentUser: UserProfile;
  onInviteFriend?: () => void;
  onSimulateSignup?: () => void;
  className?: string;
}

export const TopReferrersLeaderboard: React.FC<TopReferrersLeaderboardProps> = ({
  currentUser,
  onInviteFriend,
  onSimulateSignup,
  className = '',
}) => {
  const [activePeriod, setActivePeriod] = useState<'month' | 'alltime' | 'perks'>('month');
  const [showPrizeInfo, setShowPrizeInfo] = useState<boolean>(false);

  // User's actual referral count from props
  const userInvites = currentUser.referralCount || (currentUser.referralList ? currentUser.referralList.length : 3);
  const userEarnings = userInvites * 1000;

  // Base monthly leaderboard data
  const monthlyLeaders: LeaderboardMember[] = [
    {
      id: 'usr_top_1',
      rank: 1,
      name: 'Boris Manga',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      location: 'Douala, Cameroon',
      flag: '🇨🇲',
      invitesCount: 52,
      totalGiftsXAF: 52000,
      tier: 'Diamond',
      badgeColor: '#fed65b',
    },
    {
      id: 'usr_top_2',
      rank: 2,
      name: 'Vanessa Ndongo',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&auto=format&fit=crop&q=80',
      location: 'Yaoundé, Cameroon',
      flag: '🇨🇲',
      invitesCount: 41,
      totalGiftsXAF: 41000,
      tier: 'Platinum',
      badgeColor: '#e1e3e4',
    },
    {
      id: 'usr_top_3',
      rank: 3,
      name: 'Cedric Ondo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      location: 'Libreville, Gabon',
      flag: '🇬🇦',
      invitesCount: 34,
      totalGiftsXAF: 34000,
      tier: 'Gold',
      badgeColor: '#cd7f32',
    },
    {
      id: 'usr_top_4',
      rank: 4,
      name: 'Sylvie Bitemo',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      location: 'Brazzaville, Congo',
      flag: '🇨🇬',
      invitesCount: 26,
      totalGiftsXAF: 26000,
      tier: 'Silver',
      badgeColor: '#97d5a5',
    },
    {
      id: 'usr_top_5',
      rank: 5,
      name: 'Marc Eposi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      location: 'Bafoussam, Cameroon',
      flag: '🇨🇲',
      invitesCount: 19,
      totalGiftsXAF: 19000,
      tier: 'Silver',
      badgeColor: '#97d5a5',
    },
    {
      id: 'usr_top_6',
      rank: 6,
      name: 'Fatimatou Ahmat',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      location: "N'Djamena, Chad",
      flag: '🇹🇩',
      invitesCount: 15,
      totalGiftsXAF: 15000,
      tier: 'Rising',
      badgeColor: '#48c774',
    },
  ];

  // All-time champions
  const allTimeLeaders: LeaderboardMember[] = [
    {
      id: 'usr_at_1',
      rank: 1,
      name: 'Vanessa Ndongo',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&auto=format&fit=crop&q=80',
      location: 'Yaoundé, Cameroon',
      flag: '🇨🇲',
      invitesCount: 184,
      totalGiftsXAF: 184000,
      tier: 'Diamond',
      badgeColor: '#fed65b',
    },
    {
      id: 'usr_at_2',
      rank: 2,
      name: 'Boris Manga',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      location: 'Douala, Cameroon',
      flag: '🇨🇲',
      invitesCount: 168,
      totalGiftsXAF: 168000,
      tier: 'Diamond',
      badgeColor: '#fed65b',
    },
    {
      id: 'usr_at_3',
      rank: 3,
      name: 'Patrice Nguema',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
      location: 'Port-Gentil, Gabon',
      flag: '🇬🇦',
      invitesCount: 122,
      totalGiftsXAF: 122000,
      tier: 'Platinum',
      badgeColor: '#e1e3e4',
    },
    {
      id: 'usr_at_4',
      rank: 4,
      name: 'Cedric Ondo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      location: 'Libreville, Gabon',
      flag: '🇬🇦',
      invitesCount: 97,
      totalGiftsXAF: 97000,
      tier: 'Gold',
      badgeColor: '#cd7f32',
    },
    {
      id: 'usr_at_5',
      rank: 5,
      name: 'Jeanne Makosso',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&auto=format&fit=crop&q=80',
      location: 'Pointe-Noire, Congo',
      flag: '🇨🇬',
      invitesCount: 81,
      totalGiftsXAF: 81000,
      tier: 'Silver',
      badgeColor: '#97d5a5',
    },
  ];

  // Calculate dynamic rank for current user
  const calculateUserRank = () => {
    if (userInvites >= 55) return { rank: 1, nextInvites: 0, nextRank: 1 };
    if (userInvites >= 45) return { rank: 2, nextInvites: 53 - userInvites, nextRank: 1 };
    if (userInvites >= 35) return { rank: 3, nextInvites: 42 - userInvites, nextRank: 2 };
    if (userInvites >= 27) return { rank: 4, nextInvites: 35 - userInvites, nextRank: 3 };
    if (userInvites >= 20) return { rank: 5, nextInvites: 27 - userInvites, nextRank: 4 };
    if (userInvites >= 15) return { rank: 6, nextInvites: 20 - userInvites, nextRank: 5 };
    if (userInvites >= 10) return { rank: 8, nextInvites: 16 - userInvites, nextRank: 6 };
    if (userInvites >= 5) return { rank: 11, nextInvites: 10 - userInvites, nextRank: 8 };
    return { rank: 14, nextInvites: 5 - userInvites, nextRank: 10 };
  };

  const userRankInfo = calculateUserRank();
  const currentList = activePeriod === 'month' ? monthlyLeaders : allTimeLeaders;

  // Reward tiers configuration
  const rewardTiers = [
    {
      tier: 'Diamond Pioneer',
      minInvites: '50+ Invites',
      badge: '🏆',
      reward: '50,000 XAF Seasonal Grand Bonus',
      perk: 'VIP Dedicated Wealth Advisor + 0% Withdrawal Fees',
      color: 'border-[#fed65b] bg-[#fed65b]/15',
    },
    {
      tier: 'Platinum Ambassador',
      minInvites: '30 - 49 Invites',
      badge: '🥇',
      reward: '25,000 XAF Seasonal Bonus',
      perk: 'Priority Processing on all CEMAC payouts',
      color: 'border-[#97d5a5] bg-[#97d5a5]/15',
    },
    {
      tier: 'Gold Advocate',
      minInvites: '15 - 29 Invites',
      badge: '🥈',
      reward: '10,000 XAF Milestone Bonus',
      perk: 'Quarterly Investment Roundtable Invitation',
      color: 'border-[#cd7f32]/60 bg-[#cd7f32]/10',
    },
    {
      tier: 'Community Champion',
      minInvites: '5 - 14 Invites',
      badge: '🌟',
      reward: '1,000 XAF Instant Gift per invitee',
      perk: 'Official GrowthFund Verified Investor Badge',
      color: 'border-[#002c13]/30 bg-[#f0fbf3]',
    },
  ];

  return (
    <div
      id="top-referrers-leaderboard"
      className={`bg-white rounded-2xl border border-[#c0c9be]/40 shadow-xs overflow-hidden ${className}`}
    >
      {/* Leaderboard Header */}
      <div className="p-5 sm:p-6 bg-linear-to-r from-[#002c13] via-[#013819] to-[#002c13] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fed65b] animate-pulse"></span>
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#fed65b]">
              CEMAC Community League
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/15">
              Season 8
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Top Referrers Leaderboard</span>
            <span className="text-base">🏆</span>
          </h3>
          <p className="text-xs text-white/80 mt-0.5">
            Compete with top regional investors. Win up to <strong className="text-[#fed65b]">50,000 XAF</strong> in seasonal bonus pools!
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1 bg-[#061e10] p-1 rounded-xl border border-[#fed65b]/30 self-stretch sm:self-auto justify-between sm:justify-start">
          <button
            id="tab-month-leaderboard"
            onClick={() => setActivePeriod('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activePeriod === 'month'
                ? 'bg-[#fed65b] text-[#002c13] shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            This Month
          </button>
          <button
            id="tab-alltime-leaderboard"
            onClick={() => setActivePeriod('alltime')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activePeriod === 'alltime'
                ? 'bg-[#fed65b] text-[#002c13] shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            All-Time
          </button>
          <button
            id="tab-perks-leaderboard"
            onClick={() => setActivePeriod('perks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activePeriod === 'perks'
                ? 'bg-[#fed65b] text-[#002c13] shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            Prizes &amp; Perks
          </button>
        </div>
      </div>

      {/* Season Prize Pool Announcement Ribbon */}
      <div className="px-5 py-2.5 bg-[#f0fbf3] border-b border-[#b2f1bf] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#14512d] font-semibold">
          <span className="material-symbols-outlined text-[#306a43] text-base">military_tech</span>
          <span>
            Current Prize Pool: <strong className="text-[#002c13] font-bold">100,000 XAF</strong> • Top 3 receive cash bonuses on Month End!
          </span>
        </div>
        <button
          onClick={() => setShowPrizeInfo(!showPrizeInfo)}
          className="text-[11px] font-bold text-[#306a43] hover:text-[#002c13] underline flex items-center gap-1"
        >
          <span>{showPrizeInfo ? 'Hide Details' : 'How It Works'}</span>
          <span className="material-symbols-outlined text-[13px]">
            {showPrizeInfo ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>

      {/* Collapsible Info Card */}
      <AnimatePresence>
        {showPrizeInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-[#fafbfc] border-b border-[#e1e3e4] px-5 py-3.5 text-xs text-[#717970] space-y-1.5"
          >
            <p className="font-bold text-[#002c13]">Gamified Referral Rules &amp; Ranking:</p>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>Every successful friend referral instantly grants you <strong>1,000 XAF</strong> in cash gift.</li>
              <li>Each referral earns you <strong>+1 Rank Point</strong> on the monthly leaderboards.</li>
              <li>At midnight on the last day of every month, top 3 ranking investors are awarded extra bonus funds directly to their available balance.</li>
              <li>Rank 1: <strong>+50,000 XAF</strong> • Rank 2: <strong>+25,000 XAF</strong> • Rank 3: <strong>+10,000 XAF</strong>.</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6">
        {activePeriod === 'perks' ? (
          /* Perks & Tiers Tab */
          <div className="space-y-4">
            <div className="text-center max-w-md mx-auto mb-4">
              <h4 className="text-base font-extrabold text-[#002c13]">
                Ambassador Tiers &amp; Milestones
              </h4>
              <p className="text-xs text-[#717970] mt-1">
                Unlock higher rewards and exclusive institutional privileges as your referral network grows across CEMAC.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {rewardTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${tier.color} flex flex-col justify-between space-y-2 transition-all hover:shadow-xs`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{tier.badge}</span>
                      <span className="font-bold text-sm text-[#002c13]">{tier.tier}</span>
                    </div>
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-[#002c13] border border-[#c0c9be]/50">
                      {tier.minInvites}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#14512d]">{tier.reward}</p>
                    <p className="text-[11px] text-[#717970] mt-0.5">{tier.perk}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Leaderboard Tab (Monthly / All-Time) */
          <div className="space-y-6">
            {/* Podium for Top 3 */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 pb-2 items-end max-w-xl mx-auto">
              {/* 2nd Place (Left) */}
              <div className="flex flex-col items-center text-center order-1">
                <div className="relative mb-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#e1e3e4] overflow-hidden shadow-xs bg-[#f3f4f5]">
                    <img
                      src={currentList[1]?.avatar}
                      alt={currentList[1]?.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#e1e3e4] text-[#191c1d] border border-white font-extrabold text-[11px] flex items-center justify-center shadow-xs">
                    2
                  </div>
                </div>
                <div className="w-full bg-[#f8f9fa] rounded-t-xl border-t border-x border-[#e1e3e4] pt-2 pb-3 px-1">
                  <p className="text-xs font-bold text-[#191c1d] truncate">
                    {currentList[1]?.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-[#717970] flex items-center justify-center gap-1">
                    <span>{currentList[1]?.flag}</span>
                    <span className="font-mono font-bold text-[#002c13]">
                      {currentList[1]?.invitesCount}
                    </span>{' '}
                    invites
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white text-[#717970] border border-[#e1e3e4]">
                    🥈 25k Bonus
                  </span>
                </div>
              </div>

              {/* 1st Place (Center - Elevated) */}
              <div className="flex flex-col items-center text-center order-2">
                <div className="relative mb-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-[#fed65b] overflow-hidden shadow-md ring-4 ring-[#fed65b]/20 bg-[#fed65b]/10">
                    <img
                      src={currentList[0]?.avatar}
                      alt={currentList[0]?.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg animate-bounce">
                    👑
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#fed65b] text-[#002c13] border-2 border-white font-black text-xs flex items-center justify-center shadow-xs">
                    1
                  </div>
                </div>
                <div className="w-full bg-linear-to-b from-[#fed65b]/25 to-[#fed65b]/10 rounded-t-xl border-t-2 border-x border-[#fed65b] pt-3 pb-4 px-1 shadow-2xs">
                  <p className="text-xs font-extrabold text-[#002c13] truncate">
                    {currentList[0]?.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-[#735c00] flex items-center justify-center gap-1 font-semibold">
                    <span>{currentList[0]?.flag}</span>
                    <span className="font-mono font-black text-[#002c13]">
                      {currentList[0]?.invitesCount}
                    </span>{' '}
                    invites
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#002c13] text-[#fed65b]">
                    🥇 50k Grand
                  </span>
                </div>
              </div>

              {/* 3rd Place (Right) */}
              <div className="flex flex-col items-center text-center order-3">
                <div className="relative mb-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#cd7f32] overflow-hidden shadow-xs bg-[#f3f4f5]">
                    <img
                      src={currentList[2]?.avatar}
                      alt={currentList[2]?.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#cd7f32] text-white border border-white font-extrabold text-[11px] flex items-center justify-center shadow-xs">
                    3
                  </div>
                </div>
                <div className="w-full bg-[#f8f9fa] rounded-t-xl border-t border-x border-[#e1e3e4] pt-2 pb-3 px-1">
                  <p className="text-xs font-bold text-[#191c1d] truncate">
                    {currentList[2]?.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-[#717970] flex items-center justify-center gap-1">
                    <span>{currentList[2]?.flag}</span>
                    <span className="font-mono font-bold text-[#002c13]">
                      {currentList[2]?.invitesCount}
                    </span>{' '}
                    invites
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white text-[#735c00] border border-[#cd7f32]/40">
                    🥉 10k Bonus
                  </span>
                </div>
              </div>
            </div>

            {/* Complete Rankings List Table */}
            <div className="border border-[#e1e3e4] rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-[#f8f9fa] px-4 py-2.5 border-b border-[#e1e3e4] flex items-center justify-between text-[11px] font-bold text-[#717970] uppercase tracking-wider">
                <div className="flex items-center gap-4">
                  <span className="w-6 text-center">#</span>
                  <span>Investor</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-right">Invites</span>
                  <span className="w-20 text-right">Gifts Earned</span>
                </div>
              </div>

              <div className="divide-y divide-[#e1e3e4]">
                {currentList.map((leader) => (
                  <div
                    key={leader.id}
                    className={`px-4 py-3 flex items-center justify-between text-xs transition-colors ${
                      leader.rank === 1
                        ? 'bg-[#fed65b]/10 hover:bg-[#fed65b]/15'
                        : 'bg-white hover:bg-[#f8f9fa]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-[11px] ${
                          leader.rank === 1
                            ? 'bg-[#fed65b] text-[#002c13] font-black'
                            : leader.rank === 2
                            ? 'bg-[#e1e3e4] text-[#191c1d]'
                            : leader.rank === 3
                            ? 'bg-[#cd7f32]/30 text-[#735c00]'
                            : 'bg-[#f3f4f5] text-[#717970]'
                        }`}
                      >
                        {leader.rank}
                      </span>
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[#c0c9be]/50 bg-[#f3f4f5] shrink-0">
                        <img
                          src={leader.avatar}
                          alt={leader.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-[#191c1d] flex items-center gap-1.5">
                          <span>{leader.name}</span>
                          <span className="text-xs">{leader.flag}</span>
                        </p>
                        <p className="text-[10px] text-[#717970]">{leader.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#002c13] text-sm">
                          {leader.invitesCount}
                        </span>
                        <span className="text-[10px] text-[#717970] block">invites</span>
                      </div>
                      <div className="w-20 text-right font-mono font-extrabold text-[#306a43]">
                        +{leader.totalGiftsXAF.toLocaleString()} XAF
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current User Standings Card */}
            <div className="p-4 rounded-xl bg-linear-to-r from-[#002c13] to-[#014421] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#fed65b] text-[#002c13] font-black text-base flex items-center justify-center shadow-xs ring-2 ring-white/20">
                  #{userRankInfo.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#fed65b]">Your Current Standings</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-white/20 text-white">
                      {currentUser.name}
                    </span>
                  </div>
                  <p className="text-xs text-white/90 mt-0.5">
                    You have <strong className="text-[#fed65b] font-mono">{userInvites} invites</strong>{' '}
                    (+{userEarnings.toLocaleString()} XAF earned).
                    {userRankInfo.nextInvites > 0 && (
                      <span className="text-white/75 block sm:inline sm:ml-1">
                        Invite <strong className="text-[#fed65b]">{userRankInfo.nextInvites} more</strong> to reach #{userRankInfo.nextRank}!
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {onSimulateSignup && (
                  <button
                    onClick={onSimulateSignup}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center justify-center gap-1"
                    title="Simulate adding 1 friend invite to test rank advancement"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    <span>+1 Invite</span>
                  </button>
                )}
                {onInviteFriend && (
                  <button
                    onClick={onInviteFriend}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#fed65b] text-[#002c13] hover:bg-[#ffe088] text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">person_add</span>
                    <span>Invite Friends</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
