import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { avatarFor } from '../lib/avatar';
import { REFERRAL_REWARD_XAF } from '../lib/constants';
import { referralEarningsFor } from './ReferralProgram';

export interface LeaderboardMember {
  id: string;
  rank: number;
  name: string;
  location: string;
  flag: string;
  invitesCount: number;
  totalGiftsXAF: number;
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Rising';
  isCurrentUser?: boolean;
}

interface TopReferrersLeaderboardProps {
  currentUser: UserProfile;
  /** Sends the reader to the referral card, which owns every invite action. */
  onInviteFriend?: () => void;
  className?: string;
}

export const TopReferrersLeaderboard: React.FC<TopReferrersLeaderboardProps> = ({
  currentUser,
  onInviteFriend,
  className = '',
}) => {
  const [activePeriod, setActivePeriod] = useState<'month' | 'alltime' | 'perks'>('month');
  const [showPrizeInfo, setShowPrizeInfo] = useState<boolean>(false);

  // User's actual referral count from props
  const userInvites = currentUser.referralCount || (currentUser.referralList ? currentUser.referralList.length : 3);
  // Read from the referral programme rather than re-deriving it here, so the
  // two cards in this tab never quote different totals.
  const userEarnings = referralEarningsFor(currentUser);

  // Base monthly leaderboard data
  const monthlyLeaders: LeaderboardMember[] = [
    {
      id: 'usr_top_1',
      rank: 1,
      name: 'Boris Manga',
      location: 'Douala, Cameroon',
      flag: '🇨🇲',
      invitesCount: 52,
      totalGiftsXAF: 52 * REFERRAL_REWARD_XAF,
      tier: 'Diamond',
    },
    {
      id: 'usr_top_2',
      rank: 2,
      name: 'Vanessa Ndongo',
      location: 'Yaoundé, Cameroon',
      flag: '🇨🇲',
      invitesCount: 41,
      totalGiftsXAF: 41 * REFERRAL_REWARD_XAF,
      tier: 'Platinum',
    },
    {
      id: 'usr_top_3',
      rank: 3,
      name: 'Cedric Ondo',
      location: 'Libreville, Gabon',
      flag: '🇬🇦',
      invitesCount: 34,
      totalGiftsXAF: 34 * REFERRAL_REWARD_XAF,
      tier: 'Gold',
    },
    {
      id: 'usr_top_4',
      rank: 4,
      name: 'Sylvie Bitemo',
      location: 'Brazzaville, Congo',
      flag: '🇨🇬',
      invitesCount: 26,
      totalGiftsXAF: 26 * REFERRAL_REWARD_XAF,
      tier: 'Silver',
    },
    {
      id: 'usr_top_5',
      rank: 5,
      name: 'Marc Eposi',
      location: 'Bafoussam, Cameroon',
      flag: '🇨🇲',
      invitesCount: 19,
      totalGiftsXAF: 19 * REFERRAL_REWARD_XAF,
      tier: 'Silver',
    },
    {
      id: 'usr_top_6',
      rank: 6,
      name: 'Fatimatou Ahmat',
      location: "N'Djamena, Chad",
      flag: '🇹🇩',
      invitesCount: 15,
      totalGiftsXAF: 15 * REFERRAL_REWARD_XAF,
      tier: 'Rising',
    },
  ];

  // All-time champions
  const allTimeLeaders: LeaderboardMember[] = [
    {
      id: 'usr_at_1',
      rank: 1,
      name: 'Vanessa Ndongo',
      location: 'Yaoundé, Cameroon',
      flag: '🇨🇲',
      invitesCount: 184,
      totalGiftsXAF: 184 * REFERRAL_REWARD_XAF,
      tier: 'Diamond',
    },
    {
      id: 'usr_at_2',
      rank: 2,
      name: 'Boris Manga',
      location: 'Douala, Cameroon',
      flag: '🇨🇲',
      invitesCount: 168,
      totalGiftsXAF: 168 * REFERRAL_REWARD_XAF,
      tier: 'Diamond',
    },
    {
      id: 'usr_at_3',
      rank: 3,
      name: 'Patrice Nguema',
      location: 'Port-Gentil, Gabon',
      flag: '🇬🇦',
      invitesCount: 122,
      totalGiftsXAF: 122 * REFERRAL_REWARD_XAF,
      tier: 'Platinum',
    },
    {
      id: 'usr_at_4',
      rank: 4,
      name: 'Cedric Ondo',
      location: 'Libreville, Gabon',
      flag: '🇬🇦',
      invitesCount: 97,
      totalGiftsXAF: 97 * REFERRAL_REWARD_XAF,
      tier: 'Gold',
    },
    {
      id: 'usr_at_5',
      rank: 5,
      name: 'Jeanne Makosso',
      location: 'Pointe-Noire, Congo',
      flag: '🇨🇬',
      invitesCount: 81,
      totalGiftsXAF: 81 * REFERRAL_REWARD_XAF,
      tier: 'Silver',
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
      perk: 'A dedicated advisor and free withdrawals',
      color: 'border-gold bg-gold/15',
    },
    {
      tier: 'Platinum Ambassador',
      minInvites: '30 - 49 Invites',
      badge: '🥇',
      reward: '25,000 XAF Seasonal Bonus',
      perk: 'Priority Processing on all CEMAC payouts',
      color: 'border-emerald-tint bg-emerald-tint/15',
    },
    {
      tier: 'Gold Advocate',
      minInvites: '15 - 29 Invites',
      badge: '🥈',
      reward: '10,000 XAF Milestone Bonus',
      perk: 'Quarterly Investment Roundtable Invitation',
      color: 'border-bronze/60 bg-bronze/10',
    },
    {
      tier: 'Community Champion',
      minInvites: '5 - 14 Invites',
      badge: '🌟',
      reward: `${REFERRAL_REWARD_XAF.toLocaleString()} XAF Instant Gift per invitee`,
      perk: 'Official GrowthFund Verified Investor Badge',
      color: 'border-accent/30 bg-accent-bg',
    },
  ];

  return (
    <div
      id="top-referrers-leaderboard"
      className={`bg-surface rounded-2xl border border-line/40 shadow-xs overflow-hidden ${className}`}
    >
      {/* Leaderboard Header */}
      <div className="gf-glass-panel p-5 sm:p-6 bg-linear-to-r from-emerald via-emerald-2 to-emerald text-on-emerald flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-on-emerald animate-pulse"></span>
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-gold-on-emerald">
              CEMAC Community League
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-on-emerald/10 text-on-emerald border border-on-emerald/15">
              Season 8
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-on-emerald flex items-center gap-2">
            <span>Top Referrers Leaderboard</span>
            <span className="text-base">🏆</span>
          </h3>
          <p className="text-xs text-on-emerald/80 mt-0.5">
            Compete with top regional investors. Win up to <strong className="text-gold-on-emerald">50,000 XAF</strong> in seasonal bonus pools!
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1 bg-emerald-3 p-1 rounded-xl border border-on-emerald/15 self-stretch sm:self-auto justify-between sm:justify-start">
          <button
            id="tab-month-leaderboard"
            onClick={() => setActivePeriod('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activePeriod === 'month'
                ? 'bg-gold-on-emerald text-gold-2 shadow-xs'
                : 'text-on-emerald/80 hover:text-on-emerald hover:bg-on-emerald/5'
            }`}
          >
            This Month
          </button>
          <button
            id="tab-alltime-leaderboard"
            onClick={() => setActivePeriod('alltime')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activePeriod === 'alltime'
                ? 'bg-gold-on-emerald text-gold-2 shadow-xs'
                : 'text-on-emerald/80 hover:text-on-emerald hover:bg-on-emerald/5'
            }`}
          >
            All-Time
          </button>
          <button
            id="tab-perks-leaderboard"
            onClick={() => setActivePeriod('perks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activePeriod === 'perks'
                ? 'bg-gold-on-emerald text-gold-2 shadow-xs'
                : 'text-on-emerald/80 hover:text-on-emerald hover:bg-on-emerald/5'
            }`}
          >
            Prizes &amp; Perks
          </button>
        </div>
      </div>

      {/* Season Prize Pool Announcement Ribbon */}
      <div className="px-5 py-2.5 bg-accent-bg border-b border-pos-bg flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-on-pos-bg font-semibold">
          <span aria-hidden="true" className="material-symbols-outlined text-pos text-base">military_tech</span>
          <span>
            Current Prize Pool: <strong className="text-accent font-bold">100,000 XAF</strong> • Top 3 receive cash bonuses on Month End!
          </span>
        </div>
        <button
          onClick={() => setShowPrizeInfo(!showPrizeInfo)}
          className="text-[11px] font-bold text-pos hover:text-accent underline flex items-center gap-1"
        >
          <span>{showPrizeInfo ? 'Hide Details' : 'How It Works'}</span>
          <span aria-hidden="true" className="material-symbols-outlined text-[13px]">
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
            className="overflow-hidden bg-surface-2 border-b border-line-2 px-5 py-3.5 text-xs text-ink-3 space-y-1.5"
          >
            <p className="font-bold text-accent">Gamified Referral Rules &amp; Ranking:</p>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>Every successful friend referral instantly grants you <strong>{REFERRAL_REWARD_XAF.toLocaleString()} XAF</strong> in cash gift.</li>
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
              <h4 className="text-base font-extrabold text-accent">
                Ambassador Tiers &amp; Milestones
              </h4>
              <p className="text-xs text-ink-3 mt-1">
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
                      <span className="font-bold text-sm text-accent">{tier.tier}</span>
                    </div>
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-surface text-accent border border-line/50">
                      {tier.minInvites}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-pos-bg">{tier.reward}</p>
                    <p className="text-[11px] text-ink-3 mt-0.5">{tier.perk}</p>
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
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-line-2 overflow-hidden shadow-xs bg-surface-2">
                    <img
                      src={avatarFor(currentList[1]?.name ?? '')}
                      alt={currentList[1]?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-surface-3 text-ink border border-white font-extrabold text-[11px] flex items-center justify-center shadow-xs">
                    2
                  </div>
                </div>
                <div className="w-full bg-surface-2 rounded-t-xl border-t border-x border-line-2 pt-2 pb-3 px-1">
                  <p className="text-xs font-bold text-ink truncate">
                    {currentList[1]?.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-ink-3 flex items-center justify-center gap-1">
                    <span>{currentList[1]?.flag}</span>
                    <span className="font-mono font-bold text-accent">
                      {currentList[1]?.invitesCount}
                    </span>{' '}
                    invites
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-surface text-ink-3 border border-line-2">
                    🥈 25k Bonus
                  </span>
                </div>
              </div>

              {/* 1st Place (Center - Elevated) */}
              <div className="flex flex-col items-center text-center order-2">
                <div className="relative mb-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-gold overflow-hidden shadow-md ring-4 ring-gold/20 bg-gold/10">
                    <img
                      src={avatarFor(currentList[0]?.name ?? '')}
                      alt={currentList[0]?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg animate-bounce">
                    👑
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gold text-on-gold border-2 border-white font-black text-xs flex items-center justify-center shadow-xs">
                    1
                  </div>
                </div>
                <div className="w-full bg-linear-to-b from-gold/25 to-gold/10 rounded-t-xl border-t-2 border-x border-gold pt-3 pb-4 px-1 shadow-2xs">
                  <p className="text-xs font-extrabold text-accent truncate">
                    {currentList[0]?.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-gold-ink flex items-center justify-center gap-1 font-semibold">
                    <span>{currentList[0]?.flag}</span>
                    <span className="font-mono font-black text-accent">
                      {currentList[0]?.invitesCount}
                    </span>{' '}
                    invites
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald text-gold-on-emerald">
                    🥇 50k Grand
                  </span>
                </div>
              </div>

              {/* 3rd Place (Right) */}
              <div className="flex flex-col items-center text-center order-3">
                <div className="relative mb-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-bronze overflow-hidden shadow-xs bg-surface-2">
                    <img
                      src={avatarFor(currentList[2]?.name ?? '')}
                      alt={currentList[2]?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-bronze text-white border border-white font-extrabold text-[11px] flex items-center justify-center shadow-xs">
                    3
                  </div>
                </div>
                <div className="w-full bg-surface-2 rounded-t-xl border-t border-x border-line-2 pt-2 pb-3 px-1">
                  <p className="text-xs font-bold text-ink truncate">
                    {currentList[2]?.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-ink-3 flex items-center justify-center gap-1">
                    <span>{currentList[2]?.flag}</span>
                    <span className="font-mono font-bold text-accent">
                      {currentList[2]?.invitesCount}
                    </span>{' '}
                    invites
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-surface text-gold-ink border border-bronze/40">
                    🥉 10k Bonus
                  </span>
                </div>
              </div>
            </div>

            {/* Complete Rankings List Table */}
            <div className="border border-line-2 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-surface-2 px-4 py-2.5 border-b border-line-2 flex items-center justify-between text-[11px] font-bold text-ink-3 uppercase tracking-wider">
                <div className="flex items-center gap-4">
                  <span className="w-6 text-center">#</span>
                  <span>Investor</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-right">Invites</span>
                  <span className="w-20 text-right">Gifts Earned</span>
                </div>
              </div>

              <div className="divide-y divide-line-2">
                {currentList.map((leader) => (
                  <div
                    key={leader.id}
                    className={`px-4 py-3 flex items-center justify-between text-xs transition-colors ${
                      leader.rank === 1
                        ? 'bg-gold/10 hover:bg-gold/15'
                        : 'bg-surface hover:bg-surface-2'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-[11px] ${
                          leader.rank === 1
                            ? 'bg-gold text-on-gold font-black'
                            : leader.rank === 2
                            ? 'bg-surface-3 text-ink'
                            : leader.rank === 3
                            ? 'bg-bronze/30 text-gold-ink'
                            : 'bg-surface-2 text-ink-3'
                        }`}
                      >
                        {leader.rank}
                      </span>
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-line/50 bg-surface-2 shrink-0">
                        <img
                          src={avatarFor(leader.name)}
                          alt={leader.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-ink flex items-center gap-1.5">
                          <span>{leader.name}</span>
                          <span className="text-xs">{leader.flag}</span>
                        </p>
                        <p className="text-[10px] text-ink-3">{leader.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="font-mono font-bold text-accent text-sm">
                          {leader.invitesCount}
                        </span>
                        <span className="text-[10px] text-ink-3 block">invites</span>
                      </div>
                      <div className="w-20 text-right font-mono font-extrabold text-pos">
                        +{leader.totalGiftsXAF.toLocaleString()} XAF
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current User Standings Card */}
            <div className="gf-glass-panel p-4 rounded-xl bg-linear-to-r from-emerald to-emerald-2 text-on-emerald flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-gold-on-emerald text-gold-2 font-black text-base flex items-center justify-center shadow-xs ring-2 ring-on-emerald/20">
                  #{userRankInfo.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gold-on-emerald">Your Current Standings</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-on-emerald/15 text-on-emerald">
                      {currentUser.name}
                    </span>
                  </div>
                  <p className="text-xs text-on-emerald/90 mt-0.5">
                    You have <strong className="text-gold-on-emerald font-mono">{userInvites} invites</strong>{' '}
                    (+{userEarnings.toLocaleString()} XAF earned).
                    {userRankInfo.nextInvites > 0 && (
                      <span className="text-on-emerald/80 block sm:inline sm:ml-1">
                        Invite <strong className="text-gold-on-emerald">{userRankInfo.nextInvites} more</strong> to reach #{userRankInfo.nextRank}!
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {onInviteFriend && (
                  <button
                    onClick={onInviteFriend}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-gold-on-emerald text-gold-2 hover:brightness-125 text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[15px]">person_add</span>
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
