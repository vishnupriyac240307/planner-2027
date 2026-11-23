import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Target,
  Trophy,
  Sparkles,
  Wallet,
  TrendingUp,
  Plus,
  Trash2,
  Save,
  Check,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import {
  MONTH_NAMES,
  getDaysInMonth,
  getMonthProgress,
  getMonthCalendarGrid,
  formatDateKey,
  WEEKDAYS,
} from '../utils/calendarUtils';

export const MonthlyPlannerView: React.FC = () => {
  const {
    selectedMonth,
    setSelectedMonth,
    selectedDate,
    setSelectedDate,
    getMonthlyPlan,
    updateMonthlyPlan,
    habits,
    transactions,
    importantDates,
    setActiveView,
  } = usePlanner();

  const monthlyPlan = getMonthlyPlan(selectedMonth);

  // Month navigation
  const handlePrev = () => {
    if (selectedMonth > 1) setSelectedMonth(selectedMonth - 1);
  };
  const handleNext = () => {
    if (selectedMonth < 12) setSelectedMonth(selectedMonth + 1);
  };

  const totalDays = getDaysInMonth(2027, selectedMonth);
  const monthProgress = getMonthProgress(
    selectedDate.startsWith(`2027-${selectedMonth < 10 ? '0' + selectedMonth : selectedMonth}`)
      ? selectedDate
      : formatDateKey(2027, selectedMonth, 1)
  );

  // State for editable monthly plan fields
  const [focusTheme, setFocusTheme] = useState(monthlyPlan.focusTheme || '');
  const [monthlyGoals, setMonthlyGoals] = useState<string[]>(monthlyPlan.goals || []);
  const [newGoalInput, setNewGoalInput] = useState('');

  const [monthlyTasks, setMonthlyTasks] = useState(monthlyPlan.monthlyTasks || []);
  const [newTaskInput, setNewTaskInput] = useState('');

  const [achievements, setAchievements] = useState<string[]>(monthlyPlan.achievements || []);
  const [newAchievementInput, setNewAchievementInput] = useState('');

  const [monthlyReflection, setMonthlyReflection] = useState(monthlyPlan.monthlyReflection || '');
  const [endOfMonthReview, setEndOfMonthReview] = useState(monthlyPlan.endOfMonthReview || '');

  React.useEffect(() => {
    const plan = getMonthlyPlan(selectedMonth);
    setFocusTheme(plan.focusTheme || '');
    setMonthlyGoals(plan.goals || []);
    setMonthlyTasks(plan.monthlyTasks || []);
    setAchievements(plan.achievements || []);
    setMonthlyReflection(plan.monthlyReflection || '');
    setEndOfMonthReview(plan.endOfMonthReview || '');
  }, [selectedMonth, monthlyPlan]);

  const handleSave = () => {
    updateMonthlyPlan(selectedMonth, {
      focusTheme,
      goals: monthlyGoals,
      monthlyTasks,
      achievements,
      monthlyReflection,
      endOfMonthReview,
    });
  };

  // Add goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;
    const updated = [...monthlyGoals, newGoalInput.trim()];
    setMonthlyGoals(updated);
    updateMonthlyPlan(selectedMonth, { goals: updated });
    setNewGoalInput('');
  };

  const handleRemoveGoal = (index: number) => {
    const updated = monthlyGoals.filter((_, i) => i !== index);
    setMonthlyGoals(updated);
    updateMonthlyPlan(selectedMonth, { goals: updated });
  };

  // Add monthly task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const updated = [
      ...monthlyTasks,
      { id: `mt-${Date.now()}`, text: newTaskInput.trim(), completed: false },
    ];
    setMonthlyTasks(updated);
    updateMonthlyPlan(selectedMonth, { monthlyTasks: updated });
    setNewTaskInput('');
  };

  const toggleTask = (id: string) => {
    const updated = monthlyTasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setMonthlyTasks(updated);
    updateMonthlyPlan(selectedMonth, { monthlyTasks: updated });
  };

  const handleRemoveTask = (id: string) => {
    const updated = monthlyTasks.filter((t) => t.id !== id);
    setMonthlyTasks(updated);
    updateMonthlyPlan(selectedMonth, { monthlyTasks: updated });
  };

  // Add achievement
  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchievementInput.trim()) return;
    const updated = [...achievements, newAchievementInput.trim()];
    setAchievements(updated);
    updateMonthlyPlan(selectedMonth, { achievements: updated });
    setNewAchievementInput('');
  };

  const handleRemoveAchievement = (index: number) => {
    const updated = achievements.filter((_, i) => i !== index);
    setAchievements(updated);
    updateMonthlyPlan(selectedMonth, { achievements: updated });
  };

  // Important dates in this month
  const monthImportantDates = importantDates.filter((d) => {
    const m = parseInt(d.date.split('-')[1], 10);
    return m === selectedMonth;
  });

  // Monthly finance summary
  const monthTx = transactions.filter((t) => {
    const m = parseInt(t.date.split('-')[1], 10);
    return m === selectedMonth;
  });
  const totalIncome = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalSavings = monthTx.filter((t) => t.type === 'savings').reduce((s, t) => s + t.amount, 0);

  // Month grid
  const monthCells = getMonthCalendarGrid(2027, selectedMonth, selectedDate);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Month Navigator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              type="button"
              onClick={handlePrev}
              disabled={selectedMonth <= 1}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-navy-900 disabled:opacity-40 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={selectedMonth >= 12}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-navy-900 disabled:opacity-40 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
              {MONTH_NAMES[selectedMonth - 1]} 2027 Planner
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              30-Day Master Overview, Habits, Budget & Reflection
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105"
        >
          <Save className="w-4 h-4" /> Save Monthly Plan
        </button>
      </div>

      {/* Progress Bar & Monthly Focus Theme */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 to-navy-900 text-white shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-200">
              Monthly Theme & Anchor Focus
            </span>
            <input
              type="text"
              value={focusTheme}
              onChange={(e) => setFocusTheme(e.target.value)}
              placeholder="e.g. Energy Optimization, Deep Work, Foundations..."
              className="mt-1 w-full sm:w-[500px] text-lg font-bold bg-transparent border-b border-white/20 focus:border-white focus:outline-none placeholder:text-white/40"
            />
          </div>
          <div className="text-right">
            <span className="text-2xl font-mono font-bold">{monthProgress.percentage}%</span>
            <p className="text-xs text-brand-100">Month Complete</p>
          </div>
        </div>

        <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-300 to-white h-full rounded-full transition-all duration-700"
            style={{ width: `${monthProgress.percentage}%` }}
          />
        </div>
      </div>

      {/* Two Column Grid: Mini Calendar & Important Dates vs Goals & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Mini Month Calendar & Important Dates & Budget */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mini Month Calendar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {MONTH_NAMES[selectedMonth - 1]} 2027 Calendar
              </h4>
              <button
                type="button"
                onClick={() => setActiveView('calendar')}
                className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
              >
                Expand View
              </button>
            </div>

            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 py-2">
              {WEEKDAYS.map((d) => (
                <span key={d}>{d[0]}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {monthCells.map((c) => {
                const isSelected = selectedDate === c.dateStr;
                return (
                  <button
                    key={c.dateStr}
                    type="button"
                    onClick={() => {
                      setSelectedDate(c.dateStr);
                      setActiveView('daily');
                    }}
                    className={`p-1.5 rounded-xl transition-all ${
                      c.isCurrentMonth
                        ? isSelected
                          ? 'bg-brand-500 text-white font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  >
                    {c.day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Important Dates in This Month */}
          <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-500" />
              Important Dates & Festivals
            </h4>

            <div className="space-y-2">
              {monthImportantDates.length === 0 ? (
                <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                  No public holidays or custom dates in this month.
                </p>
              ) : (
                monthImportantDates.map((d) => (
                  <div
                    key={d.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {d.title}
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">{d.notes}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 shrink-0">
                      {d.date.slice(5)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Monthly Budget Quick Overview */}
          <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-500" />
                Monthly Financial Snapshot
              </h4>
              <button
                type="button"
                onClick={() => setActiveView('finance')}
                className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
              >
                Full Finance
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  Income
                </span>
                <p className="font-mono font-bold text-xs text-emerald-900 dark:text-emerald-200">
                  ₹{totalIncome.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30">
                <span className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold">
                  Expenses
                </span>
                <p className="font-mono font-bold text-xs text-rose-900 dark:text-rose-200">
                  ₹{totalExpense.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/30">
                <span className="text-[10px] text-brand-700 dark:text-brand-400 font-semibold">
                  Savings
                </span>
                <p className="font-mono font-bold text-xs text-brand-900 dark:text-brand-200">
                  ₹{totalSavings.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Goals, Checklist, Achievements, Reviews */}
        <div className="lg:col-span-7 space-y-6">
          {/* Monthly Goals */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Monthly Goals & Targets
                </h3>
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {monthlyGoals.length} key goals
              </span>
            </div>

            <form onSubmit={handleAddGoal} className="flex gap-2">
              <input
                type="text"
                value={newGoalInput}
                onChange={(e) => setNewGoalInput(e.target.value)}
                placeholder="Add high-impact goal for this month..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Add
              </button>
            </form>

            <div className="space-y-2">
              {monthlyGoals.map((g, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {g}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveGoal(idx)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Task Checklist */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Monthly Task Checklist
                </h3>
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {monthlyTasks.filter((t) => t.completed).length} / {monthlyTasks.length} done
              </span>
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Add monthly action item..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Add
              </button>
            </form>

            <div className="space-y-2">
              {monthlyTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleTask(t.id)}
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                        t.completed
                          ? 'bg-brand-500 border-brand-500 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-navy-900'
                      }`}
                    >
                      {t.completed && <Check className="w-3 h-3" />}
                    </button>
                    <span
                      className={`text-xs font-medium truncate ${
                        t.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {t.text}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(t.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Achievements & Wins */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Monthly Achievements & Proud Wins
              </h3>
            </div>

            <form onSubmit={handleAddAchievement} className="flex gap-2">
              <input
                type="text"
                value={newAchievementInput}
                onChange={(e) => setNewAchievementInput(e.target.value)}
                placeholder="Log a significant milestone, victory, or win..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Add Win
              </button>
            </form>

            <div className="space-y-2">
              {achievements.map((ach, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 flex items-center justify-between gap-3 group"
                >
                  <span className="text-xs font-medium text-amber-950 dark:text-amber-200">
                    🏆 {ach}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAchievement(idx)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Reflection & End-of-Month Review */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Monthly Reflection & End-of-Month Review
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Reflection (Habit consistency, energy, growth)
                </label>
                <textarea
                  rows={2}
                  value={monthlyReflection}
                  onChange={(e) => setMonthlyReflection(e.target.value)}
                  placeholder="How did this month feel? What were your greatest moments of clarity?"
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  End-of-Month Review & Next Month Adjustments
                </label>
                <textarea
                  rows={2}
                  value={endOfMonthReview}
                  onChange={(e) => setEndOfMonthReview(e.target.value)}
                  placeholder="What systems need tweaking for next month? Strategic pivots..."
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
