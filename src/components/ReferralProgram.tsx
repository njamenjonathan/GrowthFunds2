import { useState } from 'react';
import { UserProfile, ReferralRecord } from '../types';
import { REFERRAL_REWARD_XAF } from '../lib/constants';

/** The reward as it is written on screen, e.g. "800". */
const REWARD_LABEL = REFERRAL_REWARD_XAF.toLocaleString();

interface ReferralProgramProps {
  user: UserProfile;
  onReferralSuccess: (referral: ReferralRecord) => void;
  /**
   * Show the branded gift banner. The dashboard needs it to introduce the
   * programme in context; the dedicated page already has a page heading.
   */
  showBanner?: boolean;
  /**
   * Show the demo control that credits a reward without a real friend signing
   * up. There is no backend behind this app, so it is the only way to exercise
   * the reward path end to end.
   */
  showDemoControls?: boolean;
}

/**
 * The invite-and-earn programme.
 *
 * Extracted so the dashboard and the dedicated "Invite & earn" page render the
 * exact same component rather than keeping two copies in sync.
 */
export const ReferralProgram: React.FC<ReferralProgramProps> = ({
  user,
  onReferralSuccess,
  showBanner = false,
  showDemoControls = false,
}) => {
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
  const totalGiftEarned = referralEarningsFor(user);
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
      giftAmount: REFERRAL_REWARD_XAF,
    });

    showToast(`Invite sent to ${inviteName.trim()}. You'll be credited ${REWARD_LABEL} XAF once they verify.`);
    setInviteName('');
    setInviteContact('');
  };

  /** Sample contacts used only by the demo control below. */
  const DEMO_FRIENDS = [
    ['Cedric Tchakounte', '+237 698 112 345'],
    ['Amina Nguesso', 'amina.ng@gmail.com'],
    ['Patrick Ondzighi', '+241 077 452 901'],
    ['Valerie Kamga', '+237 671 223 889'],
    ['Eric Mbia', 'eric.mbia@yahoo.fr'],
    ['Therese Bekono', '+242 066 991 204'],
  ] as const;

  const handleSimulateSignup = () => {
    const [name, contact] = DEMO_FRIENDS[Math.floor(Math.random() * DEMO_FRIENDS.length)];
    onReferralSuccess({
      id: `ref_${Date.now()}`,
      name,
      phoneOrEmail: contact,
      joinedDate: 'Today, just now',
      status: 'rewarded',
      giftAmount: REFERRAL_REWARD_XAF,
    });
    showToast(`${name} signed up with your code. ${REWARD_LABEL} XAF credited to your balance.`);
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `Join me on GrowthFund to save and invest in Central Africa. Use my referral code ${referralCode}: ${referralUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {toast && (
        <div
          role="status"
          className="fixed bottom-20 right-5 z-50 bg-emerald-base text-on-emerald px-4 py-3 rounded-xl shadow-2xl border border-on-emerald/20 flex items-center gap-3 max-w-sm animate-in slide-in-from-bottom-2"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-gold-on-emerald text-[20px]">redeem</span>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      <section className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden">
        {showBanner && (
          <div className="bg-emerald text-on-emerald p-6 sm:p-8 relative overflow-hidden">
            <span
              aria-hidden="true"
              className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-[160px] text-on-emerald opacity-10 pointer-events-none"
            >
              redeem
            </span>

            <div className="relative z-10 max-w-2xl space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-on-emerald text-gold-2 text-xs font-bold">
                <span aria-hidden="true" className="material-symbols-outlined text-[15px]">card_giftcard</span>
                {REWARD_LABEL} XAF gift programme
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Invite friends, earn {REWARD_LABEL} XAF per sign-up
              </h2>
              <p className="text-xs sm:text-sm text-on-emerald/80 leading-relaxed">
                Help your network build wealth across the CEMAC region. When a friend joins GrowthFund with your
                code and completes verification, you receive an instant{' '}
                <strong className="text-gold-on-emerald">{REWARD_LABEL} XAF cash gift</strong> in your available balance.
              </p>
            </div>
          </div>
        )}

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

            {showDemoControls && (
              <div className="col-span-2 bg-accent-bg p-3 rounded-xl border border-dashed border-accent/40 flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-xs text-accent font-medium">
                  <span aria-hidden="true" className="material-symbols-outlined text-base">auto_awesome</span>
                  Demo: preview the reward flow
                </span>
                <button
                  onClick={handleSimulateSignup}
                  className="bg-emerald text-on-emerald hover:bg-emerald-2 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-xs">add</span>
                  Simulate a sign-up (+{REWARD_LABEL} XAF)
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-line-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h3 className="text-sm font-bold text-ink">Tracked referrals &amp; sign-ups</h3>
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
    </>
  );
};

/**
 * Gift money credited for referrals.
 *
 * Exported so the leaderboard reports the same figure this card does — it used
 * to multiply the invite count by the reward itself, which disagreed with this the
 * moment a referral was pending rather than rewarded.
 */
export const referralEarningsFor = (user: UserProfile): number =>
  user.referralEarnings ??
  (user.referralList ?? [])
    .filter((r) => r.status === 'rewarded')
    .reduce((sum, r) => sum + r.giftAmount, 0);

/** Shared helper so callers can offer "copy my invite link" without duplicating it. */
export const referralLinkFor = (user: UserProfile): string => {
  const code = user.referralCode ?? `GF-${user.name.split(' ')[0].toUpperCase()}${user.id.slice(-3)}`;
  return `https://growthfund.africa/join?ref=${code}`;
};
