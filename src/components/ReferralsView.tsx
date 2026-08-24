import { UserProfile, ReferralRecord } from '../types';
import { ReferralProgram, referralLinkFor } from './ReferralProgram';
import { TopReferrersLeaderboard } from './TopReferrersLeaderboard';

interface ReferralsViewProps {
  user: UserProfile;
  onReferralSuccess: (referral: ReferralRecord) => void;
}

/**
 * Focused "Invite & earn" page.
 *
 * The same programme also appears on the dashboard; both render the shared
 * `ReferralProgram` component so there is only one implementation.
 */
export const ReferralsView: React.FC<ReferralsViewProps> = ({ user, onReferralSuccess }) => (
  <div className="flex-1 p-4 md:p-10 bg-canvas relative">
    <div className="absolute inset-0 opacity-40 pointer-events-none pattern-bg" aria-hidden="true"></div>

    <div className="max-w-[1100px] mx-auto w-full relative z-10 space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Invite &amp; earn</h1>
        <p className="text-sm text-ink-3 mt-1">
          Earn 1,000 XAF every time a friend joins GrowthFund with your code and completes verification.
        </p>
      </header>

      <ReferralProgram user={user} onReferralSuccess={onReferralSuccess} showDemoControls />

      <TopReferrersLeaderboard
        currentUser={user}
        onInviteFriend={() => navigator.clipboard?.writeText(referralLinkFor(user)).catch(() => {})}
        onSimulateSignup={() =>
          onReferralSuccess({
            id: `ref_${Date.now()}`,
            name: 'Demo invitee',
            phoneOrEmail: 'demo@growthfund.africa',
            joinedDate: 'Today, just now',
            status: 'rewarded',
            giftAmount: 1000,
          })
        }
      />
    </div>
  </div>
);
