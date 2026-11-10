'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { formatDate, STATUS_COLORS } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  FileText,
  User,
} from 'lucide-react';

export default function MeetingCalendarPage() {
  const [meetings, setMeetings] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'list'

  useEffect(() => {
    async function fetchMeetings() {
      try {
        const res = await fetch('/api/meetings');
        if (res.ok) {
          const data = await res.json();
          setMeetings(data.meetings || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchMeetings();
  }, []);

  // Generate days in current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <DashboardLayout role="investor" title="Meeting Calendar">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Calendar Header Controls */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-violetAccent/10 text-violetAccent">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">Pitch Meeting Calendar</h2>
              <p className="text-xs text-slate-500">
                Synchronized schedule with visual status indicators.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs font-semibold">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'month' ? 'bg-white text-primary shadow-sm' : 'text-slate-600'
                }`}
              >
                Month View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-600'
                }`}
              >
                Agenda List
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-slate-800 min-w-[130px] text-center">
                {monthNames[month]} {year}
              </span>
              <button
                onClick={nextMonth}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold px-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Accepted Pitch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600">Pending Request</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600">Declined</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-600">Completed</span>
          </div>
        </div>

        {viewMode === 'month' ? (
          /* MONTH GRID */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-bold text-slate-500 py-3 uppercase tracking-wider">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Grid Days */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 min-h-[500px]">
              {/* Empty leading days */}
              {[...Array(firstDayIndex)].map((_, i) => (
                <div key={`empty-${i}`} className="bg-slate-50/50 p-2 min-h-[90px]" />
              ))}

              {/* Month days */}
              {[...Array(daysInMonth)].map((_, i) => {
                const dayNumber = i + 1;
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                const dayMeetings = meetings.filter((m) => m.date === dateKey);

                return (
                  <div
                    key={`day-${dayNumber}`}
                    className="p-2 min-h-[90px] hover:bg-slate-50 transition-colors flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-slate-700">{dayNumber}</span>
                    <div className="space-y-1 mt-1">
                      {dayMeetings.map((m) => {
                        const style = STATUS_COLORS[m.status] || STATUS_COLORS.Pending;
                        return (
                          <button
                            key={m._id}
                            onClick={() => setSelectedMeeting(m)}
                            className={`w-full text-left p-1 rounded text-[10px] font-semibold truncate border ${style.bg} block`}
                          >
                            <span className="font-bold">{m.timeSlot.split('-')[0]}</span> {m.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* AGENDA LIST VIEW */
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
              All Scheduled Meetings
            </h3>
            {meetings.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No meetings scheduled.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {meetings.map((m) => {
                  const style = STATUS_COLORS[m.status] || STATUS_COLORS.Pending;
                  return (
                    <div
                      key={m._id}
                      className="py-3 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{m.title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.bg}`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-0.5">
                          With {m.startupId?.name} • {formatDate(m.date)} at {m.timeSlot}
                        </p>
                      </div>

                      {m.status === 'Accepted' && (
                        <a
                          href={m.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Call Link</span>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Meeting Detail Modal */}
        {selectedMeeting && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    STATUS_COLORS[selectedMeeting.status]?.bg || ''
                  }`}
                >
                  {selectedMeeting.status}
                </span>
                <button
                  onClick={() => setSelectedMeeting(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-primary">{selectedMeeting.title}</h3>
                <p className="text-xs text-slate-600 mt-1">
                  {selectedMeeting.description || 'No pitch description provided.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <p className="text-slate-700">
                  <span className="font-bold">Founder / Startup:</span> {selectedMeeting.startupId?.name}
                </p>
                <p className="text-slate-700">
                  <span className="font-bold">Scheduled Time:</span> {formatDate(selectedMeeting.date)} • {selectedMeeting.timeSlot}
                </p>
                {selectedMeeting.meetingLink && (
                  <p className="text-slate-700">
                    <span className="font-bold">Google Meet Link:</span>{' '}
                    <a
                      href={selectedMeeting.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent font-bold hover:underline"
                    >
                      {selectedMeeting.meetingLink}
                    </a>
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedMeeting(null)}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

