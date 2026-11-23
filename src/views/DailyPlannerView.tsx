import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  BookOpen,
  Briefcase,
  Heart,
  FileText,
  Smile,
  Droplets,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  RotateCcw,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import {
  formatReadableDate,
  getPrevDate,
  getNextDate,
  HOURS_LIST,
  formatTime12h,
} from '../utils/calendarUtils';
import { Task, Priority, TaskCategory } from '../types';

export const DailyPlannerView: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getDailyPlan,
    updateDailyPlan,
    showToast,
  } = usePlanner();

  const dailyPlan = getDailyPlan(selectedDate);

  // Local state for Top 3 Priorities
  const [priority1, setPriority1] = useState(dailyPlan.topPriorities[0] || '');
  const [priority2, setPriority2] = useState(dailyPlan.topPriorities[1] || '');
  const [priority3, setPriority3] = useState(dailyPlan.topPriorities[2] || '');

  // Local state for Hourly Schedule
  const [hourlySchedule, setHourlySchedule] = useState<Record<string, string>>(
    dailyPlan.hourlySchedule || {}
  );

  // Sub-plans
  const [studyPlan, setStudyPlan] = useState(dailyPlan.studyPlan || '');
  const [workPlan, setWorkPlan] = useState(dailyPlan.workPlan || '');
  const [personalPlan, setPersonalPlan] = useState(dailyPlan.personalPlan || '');
  const [notes, setNotes] = useState(dailyPlan.notes || '');

  // Reflection
  const [wentWell, setWentWell] = useState(dailyPlan.reflection.wentWell || '');
  const [improveTomorrow, setImproveTomorrow] = useState(dailyPlan.reflection.improveTomorrow || '');
  const [mood, setMood] = useState(dailyPlan.reflection.mood || 5);
  const [waterGlasses, setWaterGlasses] = useState(dailyPlan.reflection.waterGlasses || 4);

  // Sync state when date changes
  React.useEffect(() => {
    const plan = getDailyPlan(selectedDate);
    setPriority1(plan.topPriorities[0] || '');
    setPriority2(plan.topPriorities[1] || '');
    setPriority3(plan.topPriorities[2] || '');
    setHourlySchedule(plan.hourlySchedule || {});
    setStudyPlan(plan.studyPlan || '');
    setWorkPlan(plan.workPlan || '');
    setPersonalPlan(plan.personalPlan || '');
    setNotes(plan.notes || '');
    setWentWell(plan.reflection.wentWell || '');
    setImproveTomorrow(plan.reflection.improveTomorrow || '');
    setMood(plan.reflection.mood || 5);
    setWaterGlasses(plan.reflection.waterGlasses || 4);
  }, [selectedDate, dailyPlan]);

  // Save changes to context
  const handleSavePlan = () => {
    updateDailyPlan(selectedDate, {
      topPriorities: [priority1, priority2, priority3],
      hourlySchedule,
      studyPlan,
      workPlan,
      personalPlan,
      notes,
      reflection: {
        wentWell,
        improveTomorrow,
        mood,
        waterGlasses,
      },
    });
  };

  const handleHourChange = (hour: string, text: string) => {
    setHourlySchedule((prev) => ({ ...prev, [hour]: text }));
  };

  // Day tasks
  const dayTasks = tasks.filter((t) => t.date === selectedDate);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('study');
  const [newTaskTime, setNewTaskTime] = useState('09:00');

  // Task inline editing
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      date: selectedDate,
      time: newTaskTime || undefined,
      priority: newTaskPriority,
      category: newTaskCategory,
      completed: false,
    });
    setNewTaskTitle('');
  };

  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  const saveEditTask = (id: string) => {
    if (editingTaskTitle.trim()) {
      updateTask(id, { title: editingTaskTitle.trim() });
    }
    setEditingTaskId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Date Header & Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setSelectedDate(getPrevDate(selectedDate))}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-navy-900 transition-all"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(getNextDate(selectedDate))}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-navy-900 transition-all"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
              {formatReadableDate(selectedDate)}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Daily Master Planner & Hourly Schedule (5:00 AM – 11:00 PM)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-xs font-medium text-slate-700 dark:text-slate-200"
          />
          <button
            type="button"
            onClick={handleSavePlan}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            Save Day Plan
          </button>
        </div>
      </div>

      {/* TOP 3 PRIORITIES CARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-brand-50/70 via-pastel-ice to-lavender-50/50 dark:from-navy-850 dark:via-navy-900 dark:to-navy-900 border border-brand-100/90 dark:border-slate-800 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Today&apos;s Top 3 Priorities
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              The non-negotiable needle-movers for {selectedDate}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-navy-900 border border-brand-200/60 dark:border-slate-800 shadow-sm flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              1
            </span>
            <input
              type="text"
              value={priority1}
              onChange={(e) => setPriority1(e.target.value)}
              placeholder="Priority #1..."
              className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-navy-900 border border-brand-200/60 dark:border-slate-800 shadow-sm flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              2
            </span>
            <input
              type="text"
              value={priority2}
              onChange={(e) => setPriority2(e.target.value)}
              placeholder="Priority #2..."
              className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-navy-900 border border-brand-200/60 dark:border-slate-800 shadow-sm flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              3
            </span>
            <input
              type="text"
              value={priority3}
              onChange={(e) => setPriority3(e.target.value)}
              placeholder="Priority #3..."
              className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Hourly Schedule vs Tasks & Planners */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Hourly Schedule (5:00 AM to 11:00 PM) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Hourly Time Blocking
              </h3>
            </div>
            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">5 AM - 11 PM</span>
          </div>

          <div className="space-y-1.5 max-h-[720px] overflow-y-auto pr-1 scrollbar-thin">
            {HOURS_LIST.map((h) => (
              <div
                key={h}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-navy-850 transition-colors group"
              >
                <span className="w-14 shrink-0 font-mono text-[11px] font-bold text-brand-700 dark:text-brand-300">
                  {formatTime12h(h)}
                </span>
                <input
                  type="text"
                  value={hourlySchedule[h] || ''}
                  onChange={(e) => handleHourChange(h, e.target.value)}
                  placeholder="Schedule activity, lecture, or deep work..."
                  className="w-full px-2.5 py-1 text-xs rounded-lg border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 bg-transparent focus:bg-slate-50 dark:focus:bg-navy-850 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (7 Cols): To-Do List + Section Planners + Reflection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Day To-Do List with Checkboxes */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Today&apos;s To-Do Checklist
                </h3>
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {dayTasks.filter((t) => t.completed).length} of {dayTasks.length} done
              </span>
            </div>

            {/* Quick Add Inline Form */}
            <form onSubmit={handleCreateTask} className="flex flex-wrap gap-2">
              <input
                type="text"
                required
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add a new to-do task..."
                className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="time"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="w-24 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-xs focus:outline-none"
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                className="px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-xs focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Med</option>
                <option value="high">High</option>
              </select>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 shadow-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>

            {/* Task Items */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {dayTasks.length === 0 ? (
                <p className="text-xs text-slate-600 dark:text-slate-400 py-3 text-center italic">
                  No to-dos scheduled for this date. Add one above!
                </p>
              ) : (
                dayTasks.map((t) => (
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

                      {editingTaskId === t.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingTaskTitle}
                            onChange={(e) => setEditingTaskTitle(e.target.value)}
                            className="flex-1 px-2 py-1 text-xs rounded border border-brand-400 bg-white dark:bg-navy-900"
                          />
                          <button
                            type="button"
                            onClick={() => saveEditTask(t.id)}
                            className="text-xs text-brand-600 font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`text-xs font-medium truncate ${
                            t.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {t.title}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {t.time && (
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                          {t.time}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => startEditTask(t)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600"
                        title="Edit task"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTask(t.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600"
                        title="Delete task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Three Focused Tabs: Study Planner, Work Planner, Personal Activities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Study Planner Box */}
            <div className="p-4 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                <BookOpen className="w-4 h-4" />
                <h4 className="font-bold text-xs">Study / Academics</h4>
              </div>
              <textarea
                rows={3}
                value={studyPlan}
                onChange={(e) => setStudyPlan(e.target.value)}
                placeholder="Topics to study, papers to read..."
                className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
              />
            </div>

            {/* Work & Project Planner Box */}
            <div className="p-4 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-lavender-600 dark:text-lavender-400">
                <Briefcase className="w-4 h-4" />
                <h4 className="font-bold text-xs">Work & Projects</h4>
              </div>
              <textarea
                rows={3}
                value={workPlan}
                onChange={(e) => setWorkPlan(e.target.value)}
                placeholder="Features to build, bugs, commits..."
                className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
              />
            </div>

            {/* Personal Activities Box */}
            <div className="p-4 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-rose-500">
                <Heart className="w-4 h-4" />
                <h4 className="font-bold text-xs">Personal Activities</h4>
              </div>
              <textarea
                rows={3}
                value={personalPlan}
                onChange={(e) => setPersonalPlan(e.target.value)}
                placeholder="Workout, errands, family time..."
                className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
              />
            </div>
          </div>

          {/* Daily Reflection & Mindfulness */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Smile className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Daily Reflection & Mindset
                </h3>
              </div>

              {/* Water glasses tracker (8 glasses) */}
              <div className="flex items-center gap-1.5 bg-sky-50 dark:bg-sky-950/40 px-3 py-1 rounded-full border border-sky-100 dark:border-sky-900/40">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                  {waterGlasses} / 8 Glasses
                </span>
                <div className="flex gap-1 ml-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setWaterGlasses(g === waterGlasses ? g - 1 : g)}
                      className={`w-3.5 h-3.5 rounded-full text-[8px] flex items-center justify-center transition-all ${
                        g <= waterGlasses
                          ? 'bg-sky-500 text-white font-bold'
                          : 'bg-slate-200 dark:bg-slate-700 text-transparent'
                      }`}
                    >
                      •
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                  ✨ What went well today?
                </label>
                <textarea
                  rows={2}
                  value={wentWell}
                  onChange={(e) => setWentWell(e.target.value)}
                  placeholder="Wins, breakthroughs, pleasant moments..."
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                  🌱 What can I improve tomorrow?
                </label>
                <textarea
                  rows={2}
                  value={improveTomorrow}
                  onChange={(e) => setImproveTomorrow(e.target.value)}
                  placeholder="Lessons, friction points, better habits..."
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>
            </div>

            {/* General Notes & Scratchpad */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-500" />
                Daily Notes & Scratchpad
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any quick observations, links, ideas, or reminders..."
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
