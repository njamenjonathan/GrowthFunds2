/**
 * Theme preference handling.
 *
 * `ThemeMode` is what the user chose; `light` and `dark` are explicit pins and
 * `system` follows the operating system and keeps following it as it changes.
 * The resolved value ("which palette is on screen right now") is derived from
 * the mode, so a user on `system` gets a live swap at sunset rather than being
 * silently pinned to whatever the OS reported on first load.
 */
export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'growthfund_theme';

export const prefersDark = (): boolean => {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
};

export const resolveTheme = (mode: ThemeMode): ResolvedTheme =>
  mode === 'system' ? (prefersDark() ? 'dark' : 'light') : mode;

export const readStoredMode = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
  }
  return 'system';
};

export const storeMode = (mode: ThemeMode): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Persisting the preference is best-effort; the theme still applies.
  }
};

export const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'light_mode' },
  { value: 'dark', label: 'Dark', icon: 'dark_mode' },
  { value: 'system', label: 'System', icon: 'brightness_auto' },
];
