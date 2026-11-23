import React, { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Plus,
  Bell,
  Calendar,
  Clock as ClockIcon,
  X,
  AlertCircle,
  ExternalLink,
  Laptop,
  Download,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { formatReadableDate } from '../utils/calendarUtils';
import { PWAInstallModal } from './PWAInstallModal';

export const Header: React.FC<{
  setIsOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsOpenMobile }) => {
  const {
    activeView,
    selectedDate,
    setSelectedDate,
    setIsQuickAddOpen,
    setIsSearchOpen,
    tasks,
    events,
    importantDates,
    setActiveView,
  } = usePlanner();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [isPWAInstallOpen, setIsPWAInstallOpen] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    const standaloneCheck =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standaloneCheck);
  }, []);

  // Live Digital Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Upcoming alerts (next 3 upcoming items in 2027)
  const upcomingNotifications = React.useMemo(() => {
    const today = selectedDate;
    const taskAlerts = tasks
      .filter((t) => !t.completed && t.date >= today)
      .slice(0, 3)
      .map((t) => ({
        id: t.id,
        title: t.title,
        date: t.date,
        type: 'task',
        priority: t.priority,
      }));

    const eventAlerts = events
      .filter((e) => e.date >= today)
      .slice(0, 2)
      .map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        type: 'event',
        priority: 'medium',
      }));

    return [...taskAlerts, ...eventAlerts];
  }, [tasks, events, selectedDate]);

  const viewTitles: Record<string, string> = {
    dashboard: 'Main Dashboard',
    calendar: '2027 Calendar',
    daily: 'Daily Planner & Schedule',
    monthly: 'Monthly Planner & Review',
    goals: 'Yearly Goals & Vision Board',
    study: 'Student & Academic Planner',
    habits: 'Habit Tracker Matrix',
    finance: 'Personal Finance Planner',
    journal: 'Digital Journal & Notes',
    'important-dates': 'Important Dates & Indian Holidays',
    settings: 'Settings & Data Management',
  };

  const formattedHours = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-navy-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="px-4 lg:px-8 py-3.5 flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & View Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpenMobile(true)}
            className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {viewTitles[activeView] || '2027 Digital Planner'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>{formatReadableDate(selectedDate)}</span>
              {selectedDate !== '2027-01-01' && (
                <button
                  type="button"
                  onClick={() => setSelectedDate('2027-01-01')}
                  className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline font-medium"
                >
                  (Back to Jan 1)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Center: Live Digital Clock */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-pastel-ice dark:bg-navy-800 border border-brand-100 dark:border-slate-700 shadow-sm text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
          <ClockIcon className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 animate-spin-slow" />
          <span>{formattedHours}</span>
        </div>

        {/* Right Actions: Search, Quick Add, Notifications */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Mac App Install / Standalone Badge */}
          {isStandalone ? (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-xs font-semibold">
              <Laptop className="w-3.5 h-3.5" />
              <span>Mac App</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsPWAInstallOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pastel-ice dark:bg-navy-800 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-navy-700 text-xs font-semibold transition-all border border-brand-200/70 dark:border-slate-700 shadow-xs"
              title="Install 2027 Planner as native MacBook app"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 text-xs font-medium transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
            title="Search planner (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-block font-sans text-[10px] bg-white dark:bg-navy-900 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Quick Add Task Button */}
          <button
            type="button"
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm shadow-brand-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Quick add new task (Press N)"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              title="Notifications & reminders"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {upcomingNotifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-ping" />
              )}
              {upcomingNotifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-40 animate-slide-up">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-brand-500" />
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                        Upcoming in 2027
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                    {upcomingNotifications.length === 0 ? (
                      <p className="text-xs text-slate-600 dark:text-slate-400 py-4 text-center">
                        All caught up! No pending tasks or upcoming deadlines.
                      </p>
                    ) : (
                      upcomingNotifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2"
                        >
                          <div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {n.title}
                            </p>
                            <span className="text-[11px] text-slate-600 dark:text-slate-400">
                              Due: {n.date} • {n.type}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                              n.priority === 'high'
                                ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                                : 'bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300'
                            }`}
                          >
                            {n.priority}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotifications(false);
                        setActiveView('calendar');
                      }}
                      className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                      Open Calendar <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotifications(false);
                        setActiveView('daily');
                      }}
                      className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Daily Plan
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* PWA Install Guide Modal */}
      <PWAInstallModal
        isOpen={isPWAInstallOpen}
        onClose={() => setIsPWAInstallOpen(false)}
      />
    </header>
  );
};
