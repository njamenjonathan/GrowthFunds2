import { useState } from 'react';
import { UserProfile, ReferralRecord } from '../types';
import { TopReferrersLeaderboard } from './TopReferrersLeaderboard';

interface ReferralsViewProps {
  user: UserProfile;
  onReferralSuccess: (referral: ReferralRecord) => void;
}

/**
 * The invite programme, on its own page.
 *
 * It used to sit in the middle of the investor dashboard, pushing the actual
 * portfolio — balances, holdings, recent activity — below three screens of
 * gamification. Splitting it out keeps both pages focused.
 */
export const ReferralsView: React.FC<ReferralsViewProps> = ({ user, onReferralSuccess }) => {
  const referralCode = user.referralCode ?? `GF-${user.name.split(' ')[0].toUpperCase()}${user.id.slice(-3)}`;
  const referralUrl = `https://growthfund.africa/join?ref=${referralCode}`;

  const [copied, setCopied] = useState<'code' | 'link' | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [inviteName, setInviteName] = useState('');
  const [inviteContact, setInviteContact] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'rewarded' | 'pending'>('all');

  const referrals = user.referralList ?? [];
  const rewarded = referrals.filter((r) => r.status === 'rewarded');
  const pending = referrals.filter((r) => r.status !== 'rewarded');
  const totalGiftEarned = user.referralEarnings ?? rewarded.reduce((sum, r) => sum + r.giftAmount, 0);

  const visible = filter === 'all' ? referrals : filter === 'rewarded' ? rewarded : pending;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3500);
  };

  const copy = async (value: string, kind: 'code' | 'link', message: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      showToast(message);
      window.setTimeout(() => setCopied(null), 2500);
    } catch {
      // Clipboard access can be denied (insecure context, permission prompt).
      showToast('Copy failed — select the code and copy it manually.');
    }
  };

  const handleSendInvite = () => {
    if (!inviteName.trim()) {
      setInviteError("Enter your friend's name.");
      return;
    }
    if (!inviteContact.trim()) {
      setInviteError('Enter a phone number or email address to send the invite to.');
      return;
    }
    setInviteError(null);

    onReferralSuccess({
      id: `ref_${Date.now()}`,
      name: inviteName.trim(),
      phoneOrEmail: inviteContact.trim(),
      joinedDate: 'Today',
      status: 'signed_up',
      giftAmount: 1000,
    });

    showToast(`Invite sent to ${inviteName.trim()}. You'll be credited 1,000 XAF once they verify.`);
    setInviteName('');
    setInviteContact('');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `Join me on GrowthFund to save and invest in Central Africa. Use my referral code ${referralCode}: ${referralUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex-1 p-4 md:p-10 bg-canvas relative">
      <div className="absolute inset-0 opacity-40 pointer-events-none pattern-bg" aria-hidden="true"></div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-20 right-5 z-50 bg-emerald text-on-emerald px-4 py-3 rounded-xl shadow-2xl border border-gold/30 flex items-center gap-3 max-w-sm animate-in slide-in-from-bottom-2"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-gold text-[20px]">redeem</span>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      <div className="max-w-[1100px] mx-auto w-full relative z-10 space-y-6">
        <header>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Invite &amp; earn</h1>
          <p className="text-sm text-ink-3 mt-1">
            Earn 1,000 XAF every time a friend joins GrowthFund with your code and completes verification.
          </p>
        </header>

        {/* Code, sharing and quick invite */}
        <section className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-5">
              <div>
                <label htmlFor="referral-code" className="block text-xs font-bold uppercase tracking-wider text-ink-3 mb-2">
                  Your referral code
                </label>
                <div className="flex items-center gap-2.5">
                  <div className="flex-1 bg-surface-2 border-2 border-dashed border-accent/30 px-4 py-3 rounded-xl flex items-center justify-between gap-3">
                    <span id="referral-code" className="font-mono font-extrabold text-lg text-accent tracking-widest select-all">
                      {referralCode}
                    </span>
                    <button
                      onClick={() => copy(referralCode, 'code', `Referral code ${referralCode} copied.`)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shrink-0 ${
                        copied === 'code' ? 'bg-pos-bg text-on-pos-bg' : 'bg-emerald text-on-emerald hover:bg-emerald-2'
                      }`}
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[15px]">
                        {copied === 'code' ? 'check' : 'content_copy'}
                      </span>
                      {copied === 'code' ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <button
                    onClick={() => copy(referralUrl, 'link', 'Invite link copied to clipboard.')}
                    className="p-3 bg-surface border border-line hover:bg-surface-2 text-ink rounded-xl transition-colors"
                    title="Copy invite link"
                    aria-label="Copy invite link"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                      {copied === 'link' ? 'check' : 'link'}
                    </span>
                  </button>

                  <button
                    onClick={shareOnWhatsApp}
                    className="p-3 bg-whatsapp hover:brightness-95 text-white rounded-xl transition-all"
                    title="Share on WhatsApp"
                    aria-label="Share on WhatsApp"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">chat</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-ink-3 mb-2">
                  Invite someone directly
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    aria-label="Friend's full name"
                    placeholder="Friend's full name"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-lg border border-line focus:border-accent outline-none"
                  />
                  <input
                    type="text"
                    aria-label="Friend's phone or email"
                    placeholder="Phone or email"
                    value={inviteContact}
                    onChange={(e) => setInviteContact(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-lg border border-line focus:border-accent outline-none"
                  />
                  <button
                    onClick={handleSendInvite}
                    className="bg-emerald text-on-emerald text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-emerald-2 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[15px]">send</span>
                    Send invite
                  </button>
                </div>
                {inviteError && (
                  <p className="text-[11px] text-neg font-semibold mt-1.5 flex items-center gap-1">
                    <span aria-hidden="true" className="material-symbols-outlined text-[13px]">error</span>
                    {inviteError}
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="bg-surface-2 p-4 rounded-xl border border-line-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-3">Friends joined</span>
                  <span aria-hidden="true" className="material-symbols-outlined text-accent text-lg">group</span>
                </div>
                <p className="text-2xl font-extrabold text-ink font-mono">{referrals.length}</p>
                <p className="text-[10px] text-ink-3 mt-0.5">{rewarded.length} fully verified</p>
              </div>

              <div className="bg-gold/15 p-4 rounded-xl border border-gold/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold-ink">Gifts earned</span>
                  <span aria-hidden="true" className="material-symbols-outlined text-gold-ink text-lg">redeem</span>
                </div>
                <p className="text-2xl font-extrabold text-gold-ink font-mono">
                  +{totalGiftEarned.toLocaleString()}
                </p>
                <p className="text-[10px] text-gold-ink font-semibold mt-0.5">XAF credited</p>
              </div>
            </div>
          </div>

          {/* Tracked referrals */}
          <div className="p-6 border-t border-line-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h2 className="text-sm font-bold text-ink">Tracked referrals</h2>
              <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg text-xs font-bold">
                {(
                  [
                    ['all', 'All', referrals.length],
                    ['rewarded', 'Rewarded', rewarded.length],
                    ['pending', 'Pending', pending.length],
                  ] as const
                ).map(([id, label, count]) => (
                  <button
                    key={id}
                    onClick={() => setFilter(id)}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      filter === id ? 'bg-surface text-accent shadow-2xs' : 'text-ink-3 hover:text-ink'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
            </div>

            {visible.length === 0 ? (
              <div className="p-10 text-center bg-surface-2 rounded-xl border border-line-2">
                <span aria-hidden="true" className="material-symbols-outlined text-3xl text-ink-3">person_add</span>
                <p className="text-xs font-bold text-ink mt-1">No referrals here yet</p>
                <p className="text-[11px] text-ink-3 mt-0.5">
                  Share your code <strong className="font-mono text-accent">{referralCode}</strong> to start earning.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-2 border-b border-line-2 text-[11px] font-bold uppercase tracking-wider text-ink-3">
                      <th scope="col" className="p-3.5">Friend</th>
                      <th scope="col" className="p-3.5">Contact</th>
                      <th scope="col" className="p-3.5">Joined</th>
                      <th scope="col" className="p-3.5">Status</th>
                      <th scope="col" className="p-3.5 text-right">Reward</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-2 text-xs">
                    {visible.map((item) => (
                      <tr key={item.id} className="hover:bg-surface-2 transition-colors">
                        <td className="p-3.5 font-bold text-ink">
                          <span className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-full bg-accent-bg text-accent font-bold flex items-center justify-center text-xs shrink-0">
                              {item.name.charAt(0)}
                            </span>
                            {item.name}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-ink-3 text-[11px]">{item.phoneOrEmail}</td>
                        <td className="p-3.5 text-ink-3">{item.joinedDate}</td>
                        <td className="p-3.5">
                          {item.status === 'rewarded' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pos-bg text-on-pos-bg">
                              <span aria-hidden="true" className="material-symbols-outlined text-[13px]">check_circle</span>
                              Gift credited
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold text-on-gold">
                              <span aria-hidden="true" className="material-symbols-outlined text-[13px]">schedule</span>
                              Awaiting verification
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-pos">
                          +{item.giftAmount.toLocaleString()} XAF
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <TopReferrersLeaderboard
          currentUser={user}
          onInviteFriend={() => copy(referralUrl, 'link', 'Invite link copied to clipboard.')}
        />
      </div>
    </div>
  );
};
