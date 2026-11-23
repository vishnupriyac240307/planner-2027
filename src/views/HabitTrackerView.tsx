import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Plus,
  Flame,
  Award,
  TrendingUp,
  Trash2,
  Edit2,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { usePlanner } from '../context/PlannerContext';
import {
  MONTH_NAMES,
  getDaysInMonth,
  formatDateKey,
  padZero,
} from '../utils/calendarUtils';
import { Habit } from '../types';

export const HabitTrackerView: React.FC = () => {
  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitDay,
    selectedMonth,
    setSelectedMonth,
  } = usePlanner();

  const [currentMonth, setCurrentMonth] = useState<number>(selectedMonth || 1);

  // Add / Edit Habit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Personal Growth');
  const [targetDays, setTargetDays] = useState(7);
  const [color, setColor] = useState('#0284C7');

  const daysInCurrentMonth = getDaysInMonth(2027, currentMonth);

  const openAddHabit = () => {
    setEditingHabit(null);
    setName('');
    setCategory('Personal Growth');
    setTargetDays(7);
    setColor('#0284C7');
    setIsModalOpen(true);
  };

  const openEditHabit = (h: Habit) => {
    setEditingHabit(h);
    setName(h.name);
    setCategory(h.category);
    setTargetDays(h.targetDaysPerWeek);
    setColor(h.color || '#0284C7');
    setIsModalOpen(true);
  };

  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingHabit) {
      updateHabit(editingHabit.id, {
        name: name.trim(),
        category: category.trim(),
        targetDaysPerWeek: Number(targetDays),
        color,
      });
    } else {
      addHabit({
        name: name.trim(),
        category: category.trim(),
        icon: 'CheckCircle2',
        color,
        targetDaysPerWeek: Number(targetDays),
      });
    }

    setIsModalOpen(false);
  };

  // Calculate streak for a habit
  const getStreak = (habit: Habit) => {
    let streak = 0;
    // Walk backward from end of month or today
    for (let day = daysInCurrentMonth; day >= 1; day--) {
      const dateStr = formatDateKey(2027, currentMonth, day);
      if (habit.daysCompleted[dateStr]) {
        streak++;
      } else {
        if (streak > 0) break;
      }
    }
    return streak;
  };

  // Completion percentage for this month
  const getMonthCompletionPct = (habit: Habit) => {
    let count = 0;
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateStr = formatDateKey(2027, currentMonth, day);
      if (habit.daysCompleted[dateStr]) count++;
    }
    return Math.round((count / daysInCurrentMonth) * 100);
  };

  // Aggregate completion stats
  const aggregateMonthPct = useMemo(() => {
    if (habits.length === 0) return 0;
    const totalPcts = habits.reduce((acc, h) => acc + getMonthCompletionPct(h), 0);
    return Math.round(totalPcts / habits.length);
  }, [habits, currentMonth]);

  // Chart data for habit performance
  const chartData = useMemo(() => {
    return habits.map((h) => ({
      name: h.name.length > 14 ? h.name.slice(0, 14) + '...' : h.name,
      completionRate: getMonthCompletionPct(h),
      color: h.color,
    }));
  }, [habits, currentMonth]);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header & Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setCurrentMonth((prev) => Math.max(1, prev - 1))}
              disabled={currentMonth <= 1}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-navy-900 disabled:opacity-40 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentMonth((prev) => Math.min(12, prev + 1))}
              disabled={currentMonth >= 12}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-navy-900 disabled:opacity-40 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
              Habit Tracker: {MONTH_NAMES[currentMonth - 1]} 2027
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              31-Day Habit Grid, Consistency Streaks & Analytics
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddHabit}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Habit
        </button>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Tracked Habits</p>
            <h3 className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {habits.length} Habits
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Month Consistency</p>
            <h3 className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {aggregateMonthPct}%
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Top Streak</p>
            <h3 className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {Math.max(...habits.map((h) => getStreak(h)), 0)} Days 🔥
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 31-DAY INTERACTIVE HABIT GRID */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Daily Habit Check-in Matrix
            </h3>
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-400">
            Click any cell to toggle completion
          </span>
        </div>

        <div className="overflow-x-auto pb-4 scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500">
                <th className="py-2.5 px-3 min-w-[180px]">Habit</th>
                <th className="py-2.5 px-2 text-center w-16">Streak</th>
                <th className="py-2.5 px-2 text-center w-16">Rate</th>
                {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((day) => (
                  <th key={day} className="py-2 px-1 text-center font-mono w-7">
                    {day}
                  </th>
                ))}
                <th className="py-2 px-2 text-center w-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {habits.map((habit) => {
                const streak = getStreak(habit);
                const pct = getMonthCompletionPct(habit);

                return (
                  <tr
                    key={habit.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-navy-850/50 transition-colors group"
                  >
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: habit.color }}
                        />
                        <span className="truncate">{habit.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-2 text-center font-mono font-bold text-amber-600 dark:text-amber-400">
                      {streak > 0 ? `${streak}🔥` : '0'}
                    </td>

                    <td className="py-3 px-2 text-center font-mono font-bold text-brand-600 dark:text-brand-400">
                      {pct}%
                    </td>

                    {/* Day Cells 1..daysInCurrentMonth */}
                    {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((day) => {
                      const dateStr = formatDateKey(2027, currentMonth, day);
                      const isCompleted = !!habit.daysCompleted[dateStr];

                      return (
                        <td key={day} className="py-2 px-1 text-center">
                          <button
                            type="button"
                            onClick={() => toggleHabitDay(habit.id, dateStr)}
                            className={`w-6 h-6 rounded-lg border transition-all flex items-center justify-center mx-auto ${
                              isCompleted
                                ? 'bg-brand-500 border-brand-500 text-white shadow-xs'
                                : 'border-slate-200 dark:border-slate-700 hover:border-brand-400 bg-white dark:bg-navy-850'
                            }`}
                            title={`${habit.name} on ${dateStr}: ${
                              isCompleted ? 'Completed' : 'Click to complete'
                            }`}
                          >
                            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                        </td>
                      );
                    })}

                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openEditHabit(habit)}
                          className="p-1 text-slate-400 hover:text-brand-600"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteHabit(habit.id)}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* HABIT PERFORMANCE CHART */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-500" />
            Monthly Habit Success Rates (%)
          </h4>
          <span className="text-xs text-slate-500 font-mono">
            {MONTH_NAMES[currentMonth - 1]} 2027
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" fontSize={11} stroke="#94A3B8" />
              <YAxis domain={[0, 100]} fontSize={11} stroke="#94A3B8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#F8FAFC',
                  fontSize: '12px',
                }}
                formatter={(val) => [`${val}%`, 'Completion Rate']}
              />
              <Bar dataKey="completionRate" fill="#0284C7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ADD / EDIT HABIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHabit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Habit Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Read 20 pages, 5km Jog..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Health, Academic..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Days/Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={targetDays}
                    onChange={(e) => setTargetDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Accent Color
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-9 p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
