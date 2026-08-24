import React, { useState, useRef, useEffect } from 'react';
import { GrowthFundLogo } from './GrowthFundLogo';
import { UserProfile, AppNotification } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  user: UserProfile | null;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  notifications?: AppNotification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  onClearNotifications?: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenKyc: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenSupport: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isAdmin,
  onToggleAdmin,
  user,
  theme = 'light',
  onToggleTheme,
  notifications = [],
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onClearNotifications,
  onOpenAuth,
  onOpenKyc,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenSupport,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'updates'>('all');

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'updates') return n.type === 'maturity' || n.type === 'deposit' || n.type === 'dividend';
    return true;
  });

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'maturity':
        return { icon: 'hourglass_bottom', bg: 'bg-[#fed65b]/20 text-[#735c00] border-[#fed65b]/40' };
      case 'deposit':
        return { icon: 'arrow_downward', bg: 'bg-[#b2f1bf]/30 text-[#002c13] border-[#306a43]/30' };
      case 'withdrawal':
        return { icon: 'arrow_upward', bg: 'bg-[#ffdad6]/40 text-[#ba1a1a] border-[#ba1a1a]/30' };
      case 'dividend':
        return { icon: 'payments', bg: 'bg-[#fed65b]/25 text-[#544300] border-[#fed65b]/50' };
      case 'referral':
        return { icon: 'card_giftcard', bg: 'bg-[#002c13]/10 text-[#002c13] border-[#002c13]/20' };
      case 'investment':
        return { icon: 'trending_up', bg: 'bg-[#d0e4ff]/40 text-[#004a77] border-[#004a77]/30' };
      case 'security':
        return { icon: 'shield_lock', bg: 'bg-[#f3f4f5] text-[#404941] border-[#c0c9be]/50' };
      case 'kyc':
        return { icon: 'verified_user', bg: 'bg-[#b2f1bf]/30 text-[#14512d] border-[#306a43]/30' };
      default:
        return { icon: 'notifications', bg: 'bg-[#f3f4f5] text-[#191c1d] border-[#c0c9be]/40' };
    }
  };


  return (
    <header className="w-full top-0 sticky bg-[#f8f9fa] border-b border-[#c0c9be]/30 shadow-xs z-50 transition-colors">
      <div className="flex justify-between items-center px-4 md:px-12 h-16 w-full max-w-[1200px] mx-auto">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center cursor-pointer active:opacity-80 transition-opacity"
          >
            <GrowthFundLogo size="md" showTagline />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => onNavigate('plans')}
              className={`text-sm font-semibold transition-colors ${
                currentView === 'plans' ? 'text-[#002c13] font-bold underline decoration-[#fed65b] decoration-2 underline-offset-8' : 'text-[#404941] hover:text-[#002c13]'
              }`}
            >
              Invest Plans
            </button>
            <button
              onClick={() => onNavigate('calculator')}
              className={`text-sm font-semibold transition-colors ${
                currentView === 'calculator' ? 'text-[#002c13] font-bold underline decoration-[#fed65b] decoration-2 underline-offset-8' : 'text-[#404941] hover:text-[#002c13]'
              }`}
            >
              Return Simulator
            </button>
            <button
              onClick={() => onNavigate('security')}
              className={`text-sm font-semibold transition-colors ${
                currentView === 'security' ? 'text-[#002c13] font-bold underline decoration-[#fed65b] decoration-2 underline-offset-8' : 'text-[#404941] hover:text-[#002c13]'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => onNavigate('legal')}
              className={`text-sm font-semibold transition-colors ${
                currentView === 'legal' ? 'text-[#002c13] font-bold underline decoration-[#fed65b] decoration-2 underline-offset-8' : 'text-[#404941] hover:text-[#002c13]'
              }`}
            >
              COSUMAF Compliance
            </button>
          </nav>
        </div>

        {/* Right: Actions & User Menu */}
        <div className="flex items-center gap-3">
          {/* Admin / Investor View Switcher Pill */}
          <button
            onClick={onToggleAdmin}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isAdmin
                ? 'bg-[#002c13] text-[#fed65b] border-[#014421] shadow-xs ring-2 ring-[#fed65b]/20'
                : 'bg-white text-[#404941] border-[#c0c9be]/50 hover:bg-[#f3f4f5]'
            }`}
            title="Switch between Investor Portal and Manager / Admin Dashboard"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isAdmin ? 'admin_panel_settings' : 'swap_horiz'}
            </span>
            <span>{isAdmin ? 'Manager Portal' : 'Investor View'}</span>
          </button>

          {/* COSUMAF badge */}
          <div className="hidden xl:flex items-center gap-1.5 text-[#735c00] px-2.5 py-1 rounded-full bg-[#fed65b]/20 text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>COSUMAF Regulated</span>
          </div>

          {/* Theme Mode Toggle Button (Light / High-Contrast Dark) */}
          <button
            id="theme-toggle-header-btn"
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-[#404941] hover:text-[#002c13] hover:bg-[#e7e8e9] transition-all flex items-center justify-center relative group border border-transparent hover:border-[#c0c9be]/40"
            title={theme === 'dark' ? 'Switch to Standard Light Mode' : 'Switch to High-Contrast Dark Mode (Low Light)'}
            aria-label="Toggle High-Contrast Dark Mode"
          >
            {theme === 'dark' ? (
              <span className="material-symbols-outlined text-[20px] text-[#fed65b] transition-transform duration-300 group-hover:rotate-45">
                light_mode
              </span>
            ) : (
              <span className="material-symbols-outlined text-[20px] text-[#191c1d] transition-transform duration-300 group-hover:-rotate-12">
                dark_mode
              </span>
            )}
          </button>

          {/* Bell Icon Notification Button & Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              id="notifications-bell-btn"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setUserDropdownOpen(false);
              }}
              className={`p-2 rounded-xl transition-all flex items-center justify-center relative group border ${
                notificationsOpen
                  ? 'bg-[#002c13]/10 text-[#002c13] border-[#002c13]/30'
                  : 'text-[#404941] hover:text-[#002c13] hover:bg-[#e7e8e9] border-transparent hover:border-[#c0c9be]/40'
              }`}
              title={unreadCount > 0 ? `${unreadCount} unread updates and alerts` : 'Recent Notifications & Updates'}
              aria-label="View recent notifications"
            >
              <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:scale-110">
                {unreadCount > 0 ? 'notifications_active' : 'notifications'}
              </span>

              {/* Unread Counter Badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#ba1a1a] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-[#f8f9fa] shadow-2xs animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {notificationsOpen && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#c0c9be]/40 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 flex flex-col max-h-[85vh]"
                style={{ filter: 'drop-shadow(0 10px 25px rgba(0, 44, 19, 0.12))' }}
              >
                {/* Header */}
                <div className="px-4 py-3 bg-[#f8f9fa] border-b border-[#e1e3e4] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#002c13] text-[#fed65b] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">notifications</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#191c1d]">Recent Updates</h3>
                      <p className="text-[11px] text-[#717970]">
                        {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && onMarkAllNotificationsAsRead && (
                      <button
                        onClick={() => onMarkAllNotificationsAsRead()}
                        className="px-2 py-1 text-[11px] font-semibold text-[#002c13] hover:bg-[#e7e8e9] rounded-lg transition-colors flex items-center gap-1"
                        title="Mark all notifications as read"
                      >
                        <span className="material-symbols-outlined text-[14px]">done_all</span>
                        <span className="hidden sm:inline">Mark read</span>
                      </button>
                    )}
                    {notifications.length > 0 && onClearNotifications && (
                      <button
                        onClick={() => onClearNotifications()}
                        className="p-1 text-[#717970] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/30 rounded-lg transition-colors"
                        title="Clear all notifications"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Tab Filters */}
                <div className="flex items-center gap-1 px-3 py-2 bg-white border-b border-[#f0f2f3] text-xs">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      activeTab === 'all'
                        ? 'bg-[#002c13] text-white shadow-2xs'
                        : 'text-[#404941] hover:bg-[#f3f4f5]'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('unread')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                      activeTab === 'unread'
                        ? 'bg-[#002c13] text-white shadow-2xs'
                        : 'text-[#404941] hover:bg-[#f3f4f5]'
                    }`}
                  >
                    Unread
                    {unreadCount > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        activeTab === 'unread' ? 'bg-[#fed65b] text-[#002c13]' : 'bg-[#ba1a1a] text-white'
                      }`}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('updates')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      activeTab === 'updates'
                        ? 'bg-[#002c13] text-white shadow-2xs'
                        : 'text-[#404941] hover:bg-[#f3f4f5]'
                    }`}
                  >
                    Maturity & Deposits
                  </button>
                </div>

                {/* Notification Scrollable List */}
                <div className="overflow-y-auto divide-y divide-[#f0f2f3] max-h-[360px] overscroll-contain">
                  {filteredNotifications.length === 0 ? (
                    <div className="py-8 px-4 text-center">
                      <div className="w-12 h-12 mx-auto rounded-full bg-[#f3f4f5] text-[#717970] flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-2xl">notifications_off</span>
                      </div>
                      <p className="text-xs font-bold text-[#191c1d]">No notifications</p>
                      <p className="text-[11px] text-[#717970] mt-0.5">
                        {activeTab === 'unread'
                          ? 'You have read all pending notifications.'
                          : 'New deposits, maturity notices, and returns will appear here.'}
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((notif) => {
                      const iconMeta = getNotificationIcon(notif.type);
                      return (
                        <div
                          key={notif.id}
                          onClick={() => {
                            if (onMarkNotificationAsRead) onMarkNotificationAsRead(notif.id);
                            if (notif.targetView) {
                              onNavigate(notif.targetView);
                              setNotificationsOpen(false);
                            }
                          }}
                          className={`p-3.5 transition-colors cursor-pointer flex gap-3 group relative ${
                            notif.read ? 'bg-white hover:bg-[#f9fafb]' : 'bg-[#f0f7f3] hover:bg-[#e6f3eb]'
                          }`}
                        >
                          {/* Icon */}
                          <div
                            className={`w-9 h-9 shrink-0 rounded-xl border flex items-center justify-center ${iconMeta.bg}`}
                          >
                            <span className="material-symbols-outlined text-[20px]">{iconMeta.icon}</span>
                          </div>

                          {/* Body Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1.5">
                              <p className={`text-xs ${notif.read ? 'font-semibold text-[#191c1d]' : 'font-bold text-[#002c13]'}`}>
                                {notif.title}
                              </p>
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full bg-[#306a43] shrink-0 mt-1" title="Unread"></span>
                              )}
                            </div>

                            <p className="text-[11px] text-[#404941] mt-0.5 leading-relaxed">
                              {notif.message}
                            </p>

                            {/* Metadata chips */}
                            <div className="flex items-center gap-2 mt-2 text-[10px]">
                              <span className="text-[#717970] flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[12px]">schedule</span>
                                {notif.timeAgo}
                              </span>
                              {notif.amount && (
                                <span className="font-bold text-[#002c13] bg-[#002c13]/5 px-1.5 py-0.5 rounded border border-[#002c13]/10">
                                  {notif.amount.toLocaleString()} XAF
                                </span>
                              )}
                              {notif.reference && (
                                <span className="font-mono text-[#717970] bg-[#f3f4f5] px-1.5 py-0.5 rounded">
                                  {notif.reference}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 bg-[#f8f9fa] border-t border-[#e1e3e4] flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      onNavigate('history');
                      setNotificationsOpen(false);
                    }}
                    className="text-[11px] font-bold text-[#002c13] hover:underline flex items-center gap-1"
                  >
                    <span>View All Transactions</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                  <span className="text-[10px] text-[#717970] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-[#735c00]">lock</span>
                    Encrypted & Audited
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Support Chat Trigger */}
          <button
            onClick={onOpenSupport}
            className="p-2 text-[#404941] hover:text-[#002c13] hover:bg-[#e7e8e9] rounded-lg transition-colors"
            title="Institutional Support & Helpdesk"
          >
            <span className="material-symbols-outlined text-[20px]">support_agent</span>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 bg-white border border-[#c0c9be]/40 rounded-xl hover:border-[#002c13] transition-all shadow-2xs"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover border border-[#002c13]/20"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-[#191c1d] leading-none">{user.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-[#735c00] font-semibold flex items-center gap-0.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#306a43]"></span>
                    {user.availableBalance.toLocaleString()} XAF
                  </p>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#717970]">
                  expand_more
                </span>
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#c0c9be]/30 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#e1e3e4]">
                    <p className="text-xs text-[#717970]">Signed in as</p>
                    <p className="text-sm font-bold text-[#002c13] truncate">{user.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#b2f1bf] text-[#14512d]">
                        Tier {user.kycTier} Verified
                      </span>
                      <span className="text-[11px] text-[#717970] font-mono">{user.phone}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#191c1d] hover:bg-[#f3f4f5] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#002c13]">dashboard</span>
                      Investor Dashboard
                    </button>
                    <button
                      onClick={() => onNavigate('history')}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#191c1d] hover:bg-[#f3f4f5] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#002c13]">receipt_long</span>
                      Transaction History
                    </button>
                    <button
                      onClick={onOpenDeposit}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#002c13] hover:bg-[#f3f4f5] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#306a43]">add_circle</span>
                      Deposit Funds (XAF)
                    </button>
                    <button
                      onClick={onOpenWithdraw}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#735c00] hover:bg-[#f3f4f5] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#735c00]">outbox</span>
                      Withdraw Funds
                    </button>
                    <button
                      onClick={onOpenKyc}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#191c1d] hover:bg-[#f3f4f5] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#002c13]">verified_user</span>
                      KYC Verification
                    </button>
                    <button
                      onClick={() => onNavigate('security')}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#191c1d] hover:bg-[#f3f4f5] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#002c13]">lock</span>
                      Security & 2FA
                    </button>
                    <button
                      onClick={onToggleTheme}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#191c1d] hover:bg-[#f3f4f5] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#002c13]">
                          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                        </span>
                        <span>{theme === 'dark' ? 'Light Theme' : 'Dark Mode (Low Light)'}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#002c13]/10 text-[#002c13]">
                        {theme === 'dark' ? 'Active' : 'Off'}
                      </span>
                    </button>
                  </div>

                  <div className="border-t border-[#e1e3e4] pt-1">
                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="font-semibold text-xs text-[#404941] hover:text-[#002c13] px-3 py-2 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="bg-[#002c13] text-white font-semibold text-xs px-4 py-2 rounded-lg hover:bg-[#014421] transition-all shadow-xs"
              >
                Join GrowthFund
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#002c13] hover:bg-[#e7e8e9] rounded-lg"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#c0c9be]/30 px-6 py-4 space-y-3 shadow-md">
          <div className="flex justify-between items-center pb-2 border-b border-[#e1e3e4]">
            <button
              onClick={() => {
                onToggleAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-bold text-[#002c13] bg-[#fed65b]/20 px-3 py-1.5 rounded-full"
            >
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
              <span>{isAdmin ? 'Switch to Investor View' : 'Open Manager Portal'}</span>
            </button>
            <span className="text-[11px] text-[#735c00] font-semibold">COSUMAF Regulated</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-semibold rounded-lg bg-[#f3f4f5] text-[#002c13]"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('plans');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-semibold rounded-lg bg-[#f3f4f5] text-[#002c13]"
            >
              Investment Plans
            </button>
            <button
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-semibold rounded-lg bg-[#f3f4f5] text-[#002c13]"
            >
              My Portfolio
            </button>
            <button
              onClick={() => {
                onNavigate('history');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-semibold rounded-lg bg-[#f3f4f5] text-[#002c13]"
            >
              Transactions
            </button>
            <button
              onClick={() => {
                onNavigate('calculator');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-semibold rounded-lg bg-[#f3f4f5] text-[#002c13]"
            >
              Calculator
            </button>
            <button
              onClick={() => {
                onNavigate('security');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-semibold rounded-lg bg-[#f3f4f5] text-[#002c13]"
            >
              Security & 2FA
            </button>
          </div>

          {/* Mobile Notifications Row */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f0f7f3] border border-[#306a43]/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#002c13]">
                {unreadCount > 0 ? 'notifications_active' : 'notifications'}
              </span>
              <div>
                <p className="text-xs font-bold text-[#002c13]">
                  {unreadCount > 0 ? `${unreadCount} New Investment Alert${unreadCount > 1 ? 's' : ''}` : 'Investment Updates'}
                </p>
                <p className="text-[10px] text-[#717970]">Deposits, maturity & yields</p>
              </div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setNotificationsOpen(true);
              }}
              className="px-3 py-1.5 bg-[#002c13] text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1"
            >
              <span>View Alerts</span>
            </button>
          </div>

          {/* Mobile Theme Toggle Row */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f3f4f5] border border-[#c0c9be]/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#002c13]">
                {theme === 'dark' ? 'dark_mode' : 'light_mode'}
              </span>
              <div>
                <p className="text-xs font-bold text-[#191c1d]">
                  {theme === 'dark' ? 'Dark Mode (Low Light)' : 'Standard Light Mode'}
                </p>
                <p className="text-[10px] text-[#717970]">High-contrast visual theme</p>
              </div>
            </div>
            <button
              onClick={onToggleTheme}
              className="px-3 py-1.5 bg-white text-xs font-bold rounded-lg border border-[#c0c9be] text-[#002c13] shadow-2xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              <span>{theme === 'dark' ? 'Use Light' : 'Use Dark'}</span>
            </button>
          </div>

          <div className="flex gap-2 pt-2 border-t border-[#e1e3e4]">
            <button
              onClick={() => {
                onOpenDeposit();
                setMobileMenuOpen(false);
              }}
              className="flex-1 bg-[#002c13] text-white py-2.5 rounded-lg text-xs font-bold text-center"
            >
              Deposit (XAF)
            </button>
            <button
              onClick={() => {
                onOpenWithdraw();
                setMobileMenuOpen(false);
              }}
              className="flex-1 bg-white border border-[#717970] text-[#191c1d] py-2.5 rounded-lg text-xs font-bold text-center"
            >
              Withdraw
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
