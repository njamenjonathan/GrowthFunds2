import { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { DAILY_CHECKIN_XAF } from '../lib/constants';
import { canCheckIn, formatCountdown, msUntilTomorrow, todayKey, yesterdayKey } from '../lib/checkin';
import { currency } from '../lib/transactions';

interface CheckInPanelProps {
  user: UserProfile;
  /** Credits today's reward. No-op once today has already been collected. */
  onCheckIn: () => void;
}

/** Labels for the seven days of the streak strip, ending on today. */
const STREAK_LENGTH = 7;

/**
 * The daily check-in.
 *
 * One tap, once a day, for a fixed 100 XAF. The button is the only control on
 * the panel and it disables itself the moment today's reward is taken, so the
 * "once per day" rule is visible rather than only enforced.
 */
export const CheckInPanel: React.FC<CheckInPanelProps> = ({ user, onCheckIn }) => {
  const available = canCheckIn(user.lastCheckInDate);
  const [remainingMs, setRemainingMs] = useState(() => msUntilTomorrow());

  // Tick the countdown every minute while the reward is on cooldown, so the
  // panel says something true if the tab is left open past midnight.
  useEffect(() => {
    if (available) return;
    const timer = window.setInterval(() => setRemainingMs(msUntilTomorrow()), 30000);
    setRemainingMs(msUntilTomorrow());
    return () => window.clearInterval(timer);
  }, [available]);

  const streak = user.checkInStreak ?? 0;
  const collectedToday = user.lastCheckInDate === todayKey();
  const streakIsLive = collectedToday || user.lastCheckInDate === yesterdayKey();
  const liveStreak = streakIsLive ? streak : 0;

  return (
    <div className="space-y-5">
      <section className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="bg-emerald text-on-emerald p-6 sm:p-8 relative overflow-hidden">
          <span
            aria-hidden="true"
            className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-[160px] text-gold opacity-10 pointer-events-none"
          >
            calendar_month
          </span>

          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-on-gold text-xs font-bold">
              <span aria-hidden="true" className="material-symbols-outlined text-[15px]">redeem</span>
              {DAILY_CHECKIN_XAF} XAF a day
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {available ? "Today's reward is waiting" : 'Collected for today'}
            </h2>
            <p className="text-xs sm:text-sm text-on-emerald/80 leading-relaxed">
              Open this tab once a day and collect{' '}
              <strong className="text-gold">{currency(DAILY_CHECKIN_XAF)}</strong> straight into your wallet. One
              collection per day — come back tomorrow for the next one.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <button
              onClick={onCheckIn}
              disabled={!available}
              className={`w-full py-5 rounded-2xl text-sm font-extrabold transition-colors flex items-center justify-center gap-2.5 ${
                available
                  ? 'bg-emerald text-on-emerald hover:bg-emerald-2 shadow-md'
                  : 'bg-surface-2 text-ink-3 border border-line cursor-not-allowed'
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
                {available ? 'redeem' : 'check_circle'}
              </span>
              {available
                ? `Collect ${currency(DAILY_CHECKIN_XAF)}`
                : `Next reward in ${formatCountdown(remainingMs)}`}
            </button>

            <p className="text-[11px] text-ink-3 mt-2.5 text-center">
              {available
                ? 'Goes straight into your available balance — no waiting, no fee.'
                : `Collected today. Your ${DAILY_CHECKIN_XAF} XAF is already in your balance.`}
            </p>

            {/* Seven-day strip: which of the last days were collected. */}
            <ol className="mt-5 grid grid-cols-7 gap-1.5" aria-label="Check-in streak">
              {Array.from({ length: STREAK_LENGTH }, (_, index) => {
                const dayNumber = index + 1;
                const done = dayNumber <= Math.min(liveStreak, STREAK_LENGTH);
                return (
                  <li
                    key={dayNumber}
                    className={`rounded-xl border py-2.5 text-center ${
                      done ? 'bg-pos-bg border-pos/30 text-on-pos-bg' : 'bg-surface-2 border-line-2 text-ink-3'
                    }`}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[16px] block">
                      {done ? 'check' : 'radio_button_unchecked'}
                    </span>
                    <span className="text-[10px] font-bold">D{dayNumber}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          <dl className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="bg-surface-2 p-4 rounded-xl border border-line-2">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-ink-3">Day streak</dt>
              <dd className="text-2xl font-extrabold text-ink font-mono mt-1">{liveStreak}</dd>
              <dd className="text-[10px] text-ink-3 mt-0.5">
                {liveStreak > 0 ? 'Keep it going tomorrow' : 'Collect today to start one'}
              </dd>
            </div>

            <div className="bg-gold/15 p-4 rounded-xl border border-gold/40">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-gold-ink">Collected so far</dt>
              <dd className="text-2xl font-extrabold text-gold-ink font-mono mt-1">
                +{(user.checkInEarnings ?? 0).toLocaleString()}
              </dd>
              <dd className="text-[10px] text-gold-ink font-semibold mt-0.5">XAF from check-ins</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
};
