import { useState, useRef, useEffect } from 'react';
import { GrowthFundLogo } from './GrowthFundLogo';
import { UserProfile, AppNotification, View } from '../types';
import { ThemeMode, THEME_OPTIONS } from '../lib/theme';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  user: UserProfile | null;
  theme: 'light' | 'dark';
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  onSetThemeMode: (mode: ThemeMode) => void;
  notifications: AppNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onClearNotifications: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onLogout: () => void;
}

interface NavLink {
  view: View;
  label: string;
  icon: string;
}

/**
 * The pages an investor goes to, shown in the header on desktop and in the
 * drawer on mobile — never in both at once, and never repeated in the avatar
 * menu.
 *
 * Only whole pages belong here. Check-in and Invite & earn are sections of My
 * money, so they are reached by their tab there and are deliberately absent
 * from this list: a feature that sits in the tab strip must not also sit in
 * the header, or the same thing is on screen twice with two different homes.
 */
const NAV_LINKS: NavLink[] = [
  { view: 'plans', label: 'Invest', icon: 'trending_up' },
  { view: 'dashboard', label: 'My money', icon: 'account_balance_wallet' },
  { view: 'history', label: 'Transactions', icon: 'receipt_long' },
  { view: 'about', label: 'About us', icon: 'info' },
  { view: 'faq', label: 'FAQ', icon: 'help' },
];

/**
 * Account settings, which live in the avatar menu and nowhere else.
 *
 * Keeping these out of `NAV_LINKS` is what stops the avatar menu from being a
 * second copy of the header: the header carries the places you go, the menu
 * carries the account you are signed in to.
 */
const ACCOUNT_LINKS: NavLink[] = [{ view: 'security', label: 'Security & 2FA', icon: 'shield' }];

const NOTIFICATION_STYLES: Record<AppNotification['type'], { icon: string; className: string }> = {
  maturity: { icon: 'hourglass_bottom', className: 'bg-gold/20 text-gold-ink border-gold/40' },
  deposit: { icon: 'arrow_downward', className: 'bg-pos-bg text-on-pos-bg border-pos/30' },
  withdrawal: { icon: 'arrow_upward', className: 'bg-neg-bg text-neg border-neg/30' },
  checkin: { icon: 'calendar_month', className: 'bg-gold/25 text-gold-ink border-gold/50' },
  referral: { icon: 'card_giftcard', className: 'bg-accent-bg text-accent border-accent/20' },
  investment: { icon: 'trending_up', className: 'bg-info-bg text-info border-info/30' },
  security: { icon: 'shield_lock', className: 'bg-surface-2 text-ink-2 border-line' },
  kyc: { icon: 'verified_user', className: 'bg-pos-bg text-on-pos-bg border-pos/30' },
};

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isAdmin,
  onToggleAdmin,
  user,
  theme,
  themeMode,
  onToggleTheme,
  onSetThemeMode,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onClearNotifications,
  onOpenAuth,
  onOpenDeposit,
  onOpenWithdraw,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotificationsOpen(false);
      if (userRef.current && !userRef.current.contains(event.target as Node)) setUserDropdownOpen(false);
    };
    // Escape closes whichever popover is open, matching the modals.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setNotificationsOpen(false);
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const visibleNotifications = activeTab === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  /** A plan's package page sits under Invest, so that link stays highlighted. */
  const isCurrent = (view: View) => currentView === view || (view === 'plans' && currentView === 'plan');

  const go = (view: View) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="w-full top-0 sticky bg-surface/90 backdrop-blur-md border-b border-line z-50 print-hide">
      <div className="flex justify-between items-center gap-3 px-4 md:px-8 h-16 w-full max-w-[1240px] mx-auto">
        <div className="flex items-center gap-8 min-w-0">
          <button
            onClick={() => go('home')}
            className="flex items-center shrink-0 active:opacity-80 transition-opacity"
            aria-label="GrowthFund home"
          >
            <GrowthFundLogo size="md" showTagline />
          </button>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {!isAdmin &&
              NAV_LINKS.map(({ view, label }) => (
                <button
                  key={view}
                  onClick={() => onNavigate(view)}
                  aria-current={isCurrent(view) ? 'page' : undefined}
                  className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                    isCurrent(view) ? 'text-accent bg-accent-bg' : 'text-ink-2 hover:text-ink hover:bg-surface-2'
                  }`}
                >
                  {label}
                </button>
              ))}
            {isAdmin && (
              <span className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-gold/20 text-gold-ink">
                Manager console
              </span>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onToggleAdmin}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              isAdmin
                ? 'bg-emerald text-gold border-emerald-2'
                : 'bg-surface text-ink-2 border-line hover:bg-surface-2'
            }`}
            title="Switch between the investor portal and the manager console"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
              {isAdmin ? 'admin_panel_settings' : 'swap_horiz'}
            </span>
            <span>{isAdmin ? 'Manager' : 'Investor'}</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors"
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            {/* A visible word, not only a glyph: the control stays findable even
                if the icon font never arrives. */}
            <span className="hidden sm:inline text-xs font-semibold">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotificationsOpen((open) => !open);
                setUserDropdownOpen(false);
              }}
              className={`p-2 rounded-xl transition-colors relative ${
                notificationsOpen ? 'bg-accent-bg text-accent' : 'text-ink-2 hover:text-ink hover:bg-surface-2'
              }`}
              aria-expanded={notificationsOpen}
              aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                {unreadCount > 0 ? 'notifications_active' : 'notifications'}
              </span>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-danger text-on-danger text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-surface">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] bg-surface rounded-2xl shadow-2xl border border-line z-50 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 bg-surface-2 border-b border-line-2 flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-ink">Notifications</h2>
                    <p className="text-[11px] text-ink-3">
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        onClick={onMarkAllNotificationsAsRead}
                        className="px-2 py-1 text-[11px] font-semibold text-accent hover:bg-surface-3 rounded-lg transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={onClearNotifications}
                        className="p-1.5 text-ink-3 hover:text-neg hover:bg-neg-bg rounded-lg transition-colors"
                        title="Clear all notifications"
                        aria-label="Clear all notifications"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">delete_sweep</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 px-3 py-2 border-b border-line-2 text-xs">
                  {(['all', 'unread'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-lg font-semibold capitalize transition-colors ${
                        activeTab === tab ? 'bg-emerald text-on-emerald' : 'text-ink-2 hover:bg-surface-2'
                      }`}
                    >
                      {tab} ({tab === 'all' ? notifications.length : unreadCount})
                    </button>
                  ))}
                </div>

                <div className="overflow-y-auto divide-y divide-line-2 overscroll-contain">
                  {visibleNotifications.length === 0 ? (
                    <div className="py-10 px-4 text-center">
                      <span aria-hidden="true" className="material-symbols-outlined text-2xl text-ink-3">notifications_off</span>
                      <p className="text-xs font-bold text-ink mt-1">Nothing here</p>
                      <p className="text-[11px] text-ink-3 mt-0.5">
                        Deposits, maturities and returns will show up here.
                      </p>
                    </div>
                  ) : (
                    visibleNotifications.map((notif) => {
                      const style = NOTIFICATION_STYLES[notif.type];
                      return (
                        <button
                          key={notif.id}
                          onClick={() => {
                            onMarkNotificationAsRead(notif.id);
                            if (notif.targetView) {
                              onNavigate(notif.targetView);
                              setNotificationsOpen(false);
                            }
                          }}
                          className={`w-full text-left p-3.5 transition-colors flex gap-3 ${
                            notif.read ? 'hover:bg-surface-2' : 'bg-accent-bg/60 hover:bg-accent-bg'
                          }`}
                        >
                          <span
                            className={`w-9 h-9 shrink-0 rounded-xl border flex items-center justify-center ${style.className}`}
                          >
                            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">{style.icon}</span>
                          </span>

                          <span className="flex-1 min-w-0">
                            <span className="flex items-start justify-between gap-2">
                              <span className={`text-xs ${notif.read ? 'font-semibold text-ink' : 'font-bold text-accent'}`}>
                                {notif.title}
                              </span>
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full bg-pos shrink-0 mt-1" aria-label="Unread" />
                              )}
                            </span>
                            <span className="block text-[11px] text-ink-2 mt-0.5 leading-relaxed">{notif.message}</span>
                            <span className="flex flex-wrap items-center gap-2 mt-2 text-[10px]">
                              <span className="text-ink-3">{notif.timeAgo}</span>
                              {notif.amount != null && (
                                <span className="font-bold text-accent bg-accent-bg px-1.5 py-0.5 rounded">
                                  {notif.amount.toLocaleString()} XAF
                                </span>
                              )}
                            </span>
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {user ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => {
                  setUserDropdownOpen((open) => !open);
                  setNotificationsOpen(false);
                }}
                aria-expanded={userDropdownOpen}
                className="flex items-center gap-2.5 p-1 sm:pr-3 bg-surface border border-line rounded-xl hover:border-accent transition-colors"
              >
                <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                <span className="text-left hidden sm:block">
                  <span className="block text-xs font-bold text-ink leading-none">{user.name.split(' ')[0]}</span>
                  <span className="block text-[10px] text-gold-ink font-semibold mt-0.5 font-mono">
                    {user.availableBalance.toLocaleString()} XAF
                  </span>
                </span>
                <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-ink-3 hidden sm:inline">expand_more</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-surface rounded-xl shadow-2xl border border-line py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-line-2">
                    <p className="text-[11px] text-ink-3">Signed in as</p>
                    <p className="text-sm font-bold text-accent truncate">{user.name}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pos-bg text-on-pos-bg">
                        Verified
                      </span>
                      <span className="text-[11px] text-ink-3 font-mono truncate">{user.phone}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    {ACCOUNT_LINKS.map(({ view, label, icon }) => (
                      <button
                        key={view}
                        onClick={() => go(view)}
                        className={`w-full px-4 py-2 text-left text-xs font-medium hover:bg-surface-2 transition-colors flex items-center gap-2 ${
                          isCurrent(view) ? 'text-accent' : 'text-ink'
                        }`}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">{icon}</span>
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-line-2 pt-2 pb-1 px-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3 mb-1.5">
                      Appearance
                    </p>
                    <div
                      role="radiogroup"
                      aria-label="Theme"
                      className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {THEME_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          role="radio"
                          aria-checked={themeMode === option.value}
                          onClick={() => onSetThemeMode(option.value)}
                          className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-bold transition-colors ${
                            themeMode === option.value
                              ? 'bg-surface text-accent shadow-2xs'
                              : 'text-ink-3 hover:text-ink'
                          }`}
                        >
                          <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                            {option.icon}
                          </span>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-line-2 pt-1 mt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-neg hover:bg-neg-bg flex items-center gap-2 transition-colors"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px]">logout</span>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="font-semibold text-xs text-ink-2 hover:text-ink px-3 py-2 rounded-lg transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="bg-emerald text-on-emerald font-semibold text-xs px-4 py-2 rounded-lg hover:bg-emerald-2 transition-colors whitespace-nowrap"
              >
                Join
              </button>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="lg:hidden p-2 text-ink hover:bg-surface-2 rounded-lg transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span aria-hidden="true" className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-t border-line-2 px-4 py-4 space-y-3 shadow-lg">
          <nav className="grid grid-cols-2 gap-2" aria-label="Mobile">
            <button
              onClick={() => go('home')}
              className={`px-3 py-2.5 text-left text-sm font-semibold rounded-lg transition-colors ${
                currentView === 'home' ? 'bg-accent-bg text-accent' : 'bg-surface-2 text-ink'
              }`}
            >
              Home
            </button>
            {NAV_LINKS.map(({ view, label, icon }) => (
              <button
                key={view}
                onClick={() => go(view)}
                className={`px-3 py-2.5 text-left text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                  isCurrent(view) ? 'bg-accent-bg text-accent' : 'bg-surface-2 text-ink'
                }`}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[17px]">{icon}</span>
                {label}
              </button>
            ))}
            {isAdmin && (
              <span className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-gold/20 text-gold-ink">
                Manager console
              </span>
            )}
          </nav>

          <button
            onClick={() => {
              onToggleAdmin();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-accent bg-accent-bg px-3 py-2.5 rounded-lg"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">swap_horiz</span>
            {isAdmin ? 'Switch to investor view' : 'Open manager console'}
          </button>

          {user && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  onOpenDeposit();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 bg-emerald text-on-emerald py-2.5 rounded-lg text-xs font-bold"
              >
                Deposit
              </button>
              <button
                onClick={() => {
                  onOpenWithdraw();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 bg-surface border border-line text-ink py-2.5 rounded-lg text-xs font-bold"
              >
                Withdraw
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
