import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Target,
  GraduationCap,
  Wallet,
  BookOpen,
  CalendarHeart,
  Plus,
  Flame,
  Check,
  ChevronRight,
  Smile,
  Quote,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import {
  formatReadableDate,
  get2027YearProgress,
  getMonthProgress,
  MONTH_NAMES,
} from '../utils/calendarUtils';
import { Priority } from '../types';

export const DashboardView: React.FC = () => {
  const {
    settings,
    updateSettings,
    selectedDate,
    tasks,
    toggleTask,
    events,
    goals,
    habits,
    toggleHabitDay,
    setActiveView,
    setIsQuickAddOpen,
    importantDates,
  } = usePlanner();

  const [isEditingFocus, setIsEditingFocus] = useState(false);
  const [focusDraft, setFocusDraft] = useState(settings.dailyFocus);

  const yearProgress = get2027YearProgress(selectedDate);
  const monthProgress = getMonthProgress(selectedDate);

  // Today's tasks
  const todayTasks = tasks.filter((t) => t.date === selectedDate);
  const completedTodayTasks = todayTasks.filter((t) => t.completed).length;

  // Today's habits completion
  const totalHabits = habits.length;
  const completedHabitsCount = habits.filter((h) => !!h.daysCompleted[selectedDate]).length;
  const habitCompletionRate = totalHabits > 0 ? Math.round((completedHabitsCount / totalHabits) * 100) : 0;

  // Upcoming events
  const upcomingEvents = events
    .filter((e) => e.date >= selectedDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  // Next Indian festival or holiday
  const nextHoliday = importantDates
    .filter((d) => d.date >= selectedDate)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const handleSaveFocus = () => {
    updateSettings({ dailyFocus: focusDraft });
    setIsEditingFocus(false);
  };

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900/50';
      case 'medium':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50';
      case 'low':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-navy-900 text-white p-6 sm:p-8 shadow-xl shadow-brand-900/15">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 -mb-8 w-48 h-48 bg-lavender-400/15 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-brand-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Welcome to your 2027</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Good day, {settings.userName} ✨
            </h1>
            <p className="text-sm sm:text-base text-brand-100/90 font-light leading-relaxed">
              &ldquo;{settings.userQuote}&rdquo;
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsQuickAddOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-white text-brand-700 hover:bg-brand-50 text-sm font-bold shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Quick Task
            </button>
            <button
              type="button"
              onClick={() => setActiveView('daily')}
              className="px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-semibold backdrop-blur-md transition-all flex items-center gap-2"
            >
              Today&apos;s Plan
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bars Row */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/15 text-xs">
          {/* Year 2027 Progress */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-brand-100">
                <TrendingUp className="w-3.5 h-3.5 text-brand-200" />
                2027 Year Progress
              </span>
              <span className="font-mono font-bold text-white">
                {yearProgress.percentage}% (Day {yearProgress.dayNumber}/365)
              </span>
            </div>
            <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-300 via-brand-200 to-white h-full rounded-full transition-all duration-700"
                style={{ width: `${yearProgress.percentage}%` }}
              />
            </div>
          </div>

          {/* Current Month Progress */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-brand-100">
                <Calendar className="w-3.5 h-3.5 text-brand-200" />
                {MONTH_NAMES[parseInt(selectedDate.split('-')[1], 10) - 1]} Progress
              </span>
              <span className="font-mono font-bold text-white">
                {monthProgress.percentage}% (Day {monthProgress.dayNumber}/{monthProgress.totalDays})
              </span>
            </div>
            <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-lavender-300 to-white h-full rounded-full transition-all duration-700"
                style={{ width: `${monthProgress.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Focus Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 flex-1">
          <div className="p-2.5 rounded-xl bg-pastel-amber dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mt-0.5">
            <Flame className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Daily North Star Focus
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">• {selectedDate}</span>
            </div>
            {isEditingFocus ? (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={focusDraft}
                  onChange={(e) => setFocusDraft(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={handleSaveFocus}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                {settings.dailyFocus || 'Set your primary focus for today...'}
              </p>
            )}
          </div>
        </div>
        {!isEditingFocus && (
          <button
            type="button"
            onClick={() => {
              setFocusDraft(settings.dailyFocus);
              setIsEditingFocus(true);
            }}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors self-start sm:self-center"
          >
            Edit Focus
          </button>
        )}
      </div>

      {/* Main Grid: Tasks & Schedule vs Habits & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Today's Tasks & Upcoming */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Tasks Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Today&apos;s Action Tasks
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {completedTodayTasks} of {todayTasks.length} tasks completed
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickAddOpen(true)}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Task
              </button>
            </div>

            {/* Task list */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2">
              {todayTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-600 dark:text-slate-400">
                  <p>No tasks scheduled for today yet.</p>
                  <button
                    type="button"
                    onClick={() => setIsQuickAddOpen(true)}
                    className="mt-2 text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                  >
                    + Add your first task
                  </button>
                </div>
              ) : (
                todayTasks.map((t) => (
                  <div
                    key={t.id}
                    className="py-3 flex items-start justify-between gap-3 group transition-all"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleTask(t.id)}
                        className={`w-5 h-5 mt-0.5 rounded-lg border flex items-center justify-center transition-all ${
                          t.completed
                            ? 'bg-brand-500 border-brand-500 text-white shadow-sm'
                            : 'border-slate-300 dark:border-slate-600 hover:border-brand-500 bg-white dark:bg-navy-850'
                        }`}
                        aria-label={t.completed ? 'Mark pending' : 'Mark completed'}
                      >
                        {t.completed && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-medium transition-all ${
                            t.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {t.title}
                        </p>
                        {t.description && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                            {t.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {t.time && (
                            <span className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {t.time}
                            </span>
                          )}
                          <span className="text-[10px] uppercase font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {t.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${getPriorityBadge(
                        t.priority
                      )}`}
                    >
                      {t.priority}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveView('daily')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                Go to Daily Planner & Schedule <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-lavender-100 dark:bg-lavender-950/40 text-lavender-600 dark:text-lavender-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Upcoming Calendar Events
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Important appointments & dates ahead
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('calendar')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                Full Calendar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
              {upcomingEvents.map((e) => (
                <div
                  key={e.id}
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-pastel-ice dark:from-navy-850 dark:to-navy-800 border border-slate-100 dark:border-slate-700/60 space-y-1.5"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    {e.date}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                    {e.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {e.startTime} - {e.endTime}
                  </p>
                  {e.location && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                      📍 {e.location}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Habit Tracker Widget, Holiday, Quote */}
        <div className="space-y-6">
          {/* Daily Habit Tracker Quick Matrix */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Today&apos;s Habits
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {habitCompletionRate}% Completed ({completedHabitsCount}/{totalHabits})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('habits')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                12-Month Matrix
              </button>
            </div>

            {/* Habit progress bar */}
            <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-brand-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${habitCompletionRate}%` }}
              />
            </div>

            {/* Habit items */}
            <div className="mt-4 space-y-2">
              {habits.slice(0, 6).map((h) => {
                const isCompleted = !!h.daysCompleted[selectedDate];
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => toggleHabitDay(h.id, selectedDate)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${
                      isCompleted
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50'
                        : 'bg-slate-50 dark:bg-navy-850 border-slate-100 dark:border-slate-800 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-navy-900'
                        }`}
                      >
                        {isCompleted && <Check className="w-3 h-3" />}
                      </div>
                      <span
                        className={`text-xs font-medium truncate ${
                          isCompleted
                            ? 'text-emerald-900 dark:text-emerald-300'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {h.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">
                      {h.targetDaysPerWeek}d/wk
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next Indian Holiday / Festival Highlight */}
          {nextHoliday && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-pastel-lavender to-white dark:from-navy-850 dark:to-navy-900 border border-lavender-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-lavender-700 dark:text-lavender-300 flex items-center gap-1">
                  <CalendarHeart className="w-3.5 h-3.5 text-lavender-600" />
                  Upcoming Festival / Holiday
                </span>
                <span className="text-[11px] font-mono text-slate-500">{nextHoliday.date}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {nextHoliday.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {nextHoliday.notes}
              </p>
              {nextHoliday.isRegionalVar && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 italic">
                  * Lunar/regional observation may vary by state.
                </p>
              )}
            </div>
          )}

          {/* Quote of the Day Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
              <Quote className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Thought for 2027</span>
            </div>
            <p className="font-serif italic text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              &ldquo;We do not rise to the level of our goals. We fall to the level of our systems.&rdquo;
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 text-right">— James Clear</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards to All Planner Sections */}
      <div className="pt-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Quick Access Sections
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'from-blue-500 to-sky-400' },
            { id: 'daily', label: 'Daily Plan', icon: Clock, color: 'from-sky-500 to-brand-400' },
            { id: 'monthly', label: 'Monthly', icon: TrendingUp, color: 'from-indigo-500 to-purple-400' },
            { id: 'goals', label: 'Goals 2027', icon: Target, color: 'from-purple-500 to-lavender-400' },
            { id: 'study', label: 'Study Hub', icon: GraduationCap, color: 'from-emerald-500 to-teal-400' },
            { id: 'habits', label: 'Habits', icon: CheckCircle2, color: 'from-teal-500 to-emerald-400' },
            { id: 'finance', label: 'Finance (₹)', icon: Wallet, color: 'from-amber-500 to-orange-400' },
            { id: 'journal', label: 'Journal', icon: BookOpen, color: 'from-rose-500 to-pink-400' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id as any)}
                className="p-3.5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all text-center group flex flex-col items-center gap-2"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
