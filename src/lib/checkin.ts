/**
 * The daily check-in.
 *
 * One reward per calendar day, decided from the local date rather than a
 * rolling 24-hour window, so "come back tomorrow" means what a user expects it
 * to mean.
 */

/** Today as `YYYY-MM-DD` in the viewer's own timezone. */
export const todayKey = (now: Date = new Date()): string => {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** Yesterday's key, used to decide whether a streak carries over. */
export const yesterdayKey = (now: Date = new Date()): string => {
  const date = new Date(now);
  date.setDate(date.getDate() - 1);
  return todayKey(date);
};

/** True while today's reward has not been collected yet. */
export const canCheckIn = (lastCheckInDate: string | undefined, now: Date = new Date()): boolean =>
  lastCheckInDate !== todayKey(now);

/**
 * The streak after collecting today: one more day if yesterday was collected,
 * otherwise a fresh streak of one.
 */
export const nextStreak = (
  lastCheckInDate: string | undefined,
  currentStreak: number | undefined,
  now: Date = new Date()
): number => (lastCheckInDate === yesterdayKey(now) ? (currentStreak ?? 0) + 1 : 1);

/** Milliseconds until the next calendar day starts, for the countdown label. */
export const msUntilTomorrow = (now: Date = new Date()): number => {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return Math.max(0, tomorrow.getTime() - now.getTime());
};

/** "7h 12m" — how long until the next reward unlocks. */
export const formatCountdown = (ms: number): string => {
  const totalMinutes = Math.ceil(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
};
