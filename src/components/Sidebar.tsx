import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  CalendarRange,
  Target,
  GraduationCap,
  CheckCircle2,
  Wallet,
  BookOpen,
  CalendarHeart,
  Settings as SettingsIcon,
  Sparkles,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { ActiveView } from '../types';
import { get2027YearProgress } from '../utils/calendarUtils';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: '2027 Calendar', icon: CalendarDays },
  { id: 'daily', label: 'Daily Planner', icon: Clock },
  { id: 'monthly', label: 'Monthly Planner', icon: CalendarRange },
  { id: 'goals', label: 'Goals & Vision', icon: Target },
  { id: 'study', label: 'Study Planner', icon: GraduationCap },
  { id: 'habits', label: 'Habit Tracker', icon: CheckCircle2 },
  { id: 'finance', label: 'Finance Planner', icon: Wallet },
  { id: 'journal', label: 'Journal & Notes', icon: BookOpen },
  { id: 'important-dates', label: 'Important Dates', icon: CalendarHeart },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export const Sidebar: React.FC<{
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}> = ({ isOpenMobile, setIsOpenMobile }) => {
  const { activeView, setActiveView, settings, updateSettings, selectedDate } = usePlanner();
  const yearProgress = get2027YearProgress(selectedDate);

  const handleNavClick = (id: ActiveView) => {
    setActiveView(id);
    setIsOpenMobile(false);
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpenMobile(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-navy-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-lavender-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                2027 Planner
                <span className="text-[10px] font-sans font-semibold tracking-wide bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 px-1.5 py-0.5 rounded-full">
                  PRO
                </span>
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">Personal Dashboard</p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>

        {/* Year 2027 Mini Progress Banner */}
        <div className="mx-4 my-3 p-3 rounded-xl bg-gradient-to-br from-brand-50 to-pastel-ice dark:from-navy-850 dark:to-navy-800 border border-brand-100/80 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-brand-800 dark:text-brand-300 flex items-center gap-1">
              Year 2027 Progress
            </span>
            <span className="font-mono text-brand-700 dark:text-brand-300 font-bold">
              {yearProgress.percentage}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 to-lavender-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${yearProgress.percentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Day {yearProgress.dayNumber} of {yearProgress.totalDays} • Focused & Consistent
          </p>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 dark:bg-brand-600'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-brand-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-navy-950/40">
          <div
            onClick={() => setActiveView('settings')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800/80 cursor-pointer transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-lavender-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {settings.userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                {settings.userName}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                {settings.userQuote}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
