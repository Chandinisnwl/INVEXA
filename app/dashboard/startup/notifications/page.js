'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { formatDate } from '@/lib/utils';
import { Bell, CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';

export default function StartupNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PUT' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout role="startup" title="Notifications">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent/10 text-accent">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">All Notifications</h2>
              <p className="text-xs text-slate-500">
                Track updates regarding your pitch requests, reviews, and bookings.
              </p>
            </div>
          </div>
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllRead}
              className="text-xs font-semibold text-accent hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center text-slate-400 text-xs border border-slate-200">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  n.read
                    ? 'bg-white border-slate-200'
                    : 'bg-accent/5 border-accent/20 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

