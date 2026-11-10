'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import {
  LayoutDashboard,
  Building,
  Briefcase,
  Search,
  FileText,
  Calendar,
  Clock,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  CalendarClock,
  Sparkles,
} from 'lucide-react';

export default function DashboardLayout({ children, role = 'startup', title = 'Dashboard' }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const authRes = await fetch('/api/auth/me');
        if (authRes.ok) {
          const authData = await authRes.json();
          setUser(authData.user);

          // If logged in as wrong role, redirect to appropriate dashboard
          if (authData.user && authData.user.role !== role) {
            router.push(`/dashboard/${authData.user.role}`);
            return;
          }
        } else {
          router.push('/login');
          return;
        }

        // Fetch notifications
        const notifRes = await fetch('/api/notifications');
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          setNotifications(notifData.notifications || []);
          setUnreadCount(
            (notifData.notifications || []).filter((n) => !n.read).length
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [role, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PUT' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const startupNavItems = [
    { label: 'Overview', href: '/dashboard/startup', icon: LayoutDashboard },
    { label: 'My Startup Profile', href: '/dashboard/startup/profile', icon: Building },
    { label: 'Explore Investors', href: '/investors', icon: Search },
    { label: 'Pitch Deck', href: '/dashboard/startup/pitch-deck', icon: FileText },
    { label: 'Book a Meeting', href: '/dashboard/startup/book', icon: CalendarClock },
    { label: 'My Meetings', href: '/dashboard/startup/meetings', icon: Calendar },
    { label: 'Notifications', href: '/dashboard/startup/notifications', icon: Bell, badge: unreadCount },
    { label: 'Settings', href: '/dashboard/startup/settings', icon: Settings },
  ];

  const investorNavItems = [
    { label: 'Overview', href: '/dashboard/investor', icon: LayoutDashboard },
    { label: 'My Investor Profile', href: '/dashboard/investor/profile', icon: Briefcase },
    { label: 'Explore Startups', href: '/startups', icon: Search },
    { label: 'Pitch Requests', href: '/dashboard/investor/requests', icon: Clock },
    { label: 'Meeting Calendar', href: '/dashboard/investor/calendar', icon: Calendar },
    { label: 'My Meetings', href: '/dashboard/investor/meetings', icon: CalendarClock },
    { label: 'Availability Settings', href: '/dashboard/investor/availability', icon: Settings },
    { label: 'Notifications', href: '/dashboard/investor/notifications', icon: Bell, badge: unreadCount },
  ];

  const navItems = role === 'startup' ? startupNavItems : investorNavItems;

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Logo />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:text-primary relative rounded-lg"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-600 hover:text-primary rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <Logo />
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User badge */}
          <div className="px-5 py-4 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Loading...'}</p>
              <span
                className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize mt-0.5 ${
                  role === 'startup'
                    ? 'bg-accent/10 text-accent'
                    : 'bg-violetAccent/10 text-violetAccent'
                }`}
              >
                {role === 'startup' ? 'Founder Portal' : 'Investor Portal'}
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? role === 'startup'
                            ? 'text-accent'
                            : 'text-violetAccent'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Public Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex bg-white/80 backdrop-blur-sm border-b border-slate-200/80 px-8 py-4 items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-extrabold text-primary tracking-tight">{title}</h1>
            <p className="text-xs text-slate-500">
              INVEXA Platform • {role === 'startup' ? 'Startup Workspace' : 'Investor Workspace'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] font-semibold text-accent hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n._id}
                          className={`p-2.5 rounded-xl text-xs transition-colors ${
                            n.read ? 'bg-slate-50 text-slate-600' : 'bg-accent/5 text-slate-800 font-medium border border-accent/15'
                          }`}
                        >
                          <p className="font-bold text-slate-900">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick action button */}
            {role === 'startup' ? (
              <Link
                href="/investors"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-accent hover:bg-accent-hover rounded-xl shadow-sm transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Find Investors</span>
              </Link>
            ) : (
              <Link
                href="/startups"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-violetAccent hover:bg-violetAccent-hover rounded-xl shadow-sm transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Explore Startups</span>
              </Link>
            )}
          </div>
        </header>

        {/* Child Pages Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

