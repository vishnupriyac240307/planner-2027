import React, { useState, useMemo } from 'react';
import {
  Target,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Flag,
  CheckCircle,
  TrendingUp,
  Image,
  X,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { Goal, GoalCategory, Priority, VisionBoardItem } from '../types';

const CATEGORIES: { id: GoalCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All 2027 Goals' },
  { id: 'academic', label: 'Academic' },
  { id: 'career', label: 'Career' },
  { id: 'financial', label: 'Financial' },
  { id: 'health', label: 'Health & Fitness' },
  { id: 'skills', label: 'Skills to Learn' },
  { id: 'books', label: 'Books to Read' },
  { id: 'projects', label: 'Projects' },
  { id: 'places', label: 'Places to Visit' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'personal', label: 'Personal' },
];

export const YearlyGoalsView: React.FC = () => {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    visionItems,
    addVisionItem,
    deleteVisionItem,
  } = usePlanner();

  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | 'all'>('all');

  // Goal Modal State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GoalCategory>('academic');
  const [deadline, setDeadline] = useState('2027-12-31');
  const [priority, setPriority] = useState<Priority>('high');
  const [progress, setProgress] = useState(0);
  const [target, setTarget] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Goal['status']>('in-progress');

  // Vision Item Modal State
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [visionTitle, setVisionTitle] = useState('');
  const [visionCategory, setVisionCategory] = useState('Lifestyle');
  const [visionImageUrl, setVisionImageUrl] = useState('');
  const [visionCaption, setVisionCaption] = useState('');
  const [visionQuote, setVisionQuote] = useState('');

  const filteredGoals = useMemo(() => {
    if (selectedCategory === 'all') return goals;
    return goals.filter((g) => g.category === selectedCategory);
  }, [goals, selectedCategory]);

  const openAddGoal = () => {
    setEditingGoal(null);
    setTitle('');
    setCategory(selectedCategory === 'all' ? 'academic' : selectedCategory);
    setDeadline('2027-12-31');
    setPriority('high');
    setProgress(0);
    setTarget('');
    setNotes('');
    setStatus('in-progress');
    setIsGoalModalOpen(true);
  };

  const openEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setCategory(goal.category);
    setDeadline(goal.deadline);
    setPriority(goal.priority);
    setProgress(goal.progress);
    setTarget(goal.target);
    setNotes(goal.notes || '');
    setStatus(goal.status);
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        title: title.trim(),
        category,
        deadline,
        priority,
        progress: Number(progress),
        target: target.trim(),
        notes: notes.trim() || undefined,
        status: Number(progress) >= 100 ? 'completed' : status,
      });
    } else {
      addGoal({
        title: title.trim(),
        category,
        deadline,
        priority,
        progress: Number(progress),
        target: target.trim(),
        notes: notes.trim() || undefined,
        status: Number(progress) >= 100 ? 'completed' : status,
      });
    }

    setIsGoalModalOpen(false);
  };

  const handleSaveVision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visionTitle.trim() || !visionImageUrl.trim()) return;

    addVisionItem({
      title: visionTitle.trim(),
      category: visionCategory.trim() || 'Inspiration',
      imageUrl: visionImageUrl.trim(),
      caption: visionCaption.trim(),
      quote: visionQuote.trim() || undefined,
    });

    setIsVisionModalOpen(false);
    setVisionTitle('');
    setVisionImageUrl('');
    setVisionCaption('');
    setVisionQuote('');
  };

  // Overall goal completion rate
  const completedGoalsCount = goals.filter((g) => g.progress >= 100 || g.status === 'completed').length;
  const overallAvgProgress =
    goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* 2027 Vision Board Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-lavender dark:bg-lavender-950/40 text-lavender-700 dark:text-lavender-300 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-lavender-500" />
              <span>Manifesting 2027</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
              2027 Vision Board
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Visualizing the life, achievements, health, and mindset of your dream year.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsVisionModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lavender-600 hover:bg-lavender-700 text-white text-xs font-semibold shadow-sm self-start sm:self-auto transition-all"
          >
            <Plus className="w-4 h-4" /> Add Vision Tile
          </button>
        </div>

        {/* Vision Board Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visionItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="h-44 w-full overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white/90 text-slate-900 dark:bg-navy-900/90 dark:text-white px-2.5 py-0.5 rounded-full backdrop-blur-md">
                  {item.category}
                </span>

                <button
                  type="button"
                  onClick={() => deleteVisionItem(item.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove vision card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="absolute bottom-3 left-4 right-4">
                  <h4 className="font-bold text-white text-base leading-snug drop-shadow-sm">
                    {item.title}
                  </h4>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.caption}
                </p>
                {item.quote && (
                  <p className="font-serif italic text-[11px] text-brand-600 dark:text-brand-400 border-l-2 border-brand-400 pl-2">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2027 Goals Section Header & Overall Stats */}
      <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-brand-500" />
              2027 Goals & Milestones
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Clear targets with deadlines, priorities, and actionable progress percentages.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddGoal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Goal
          </button>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Total Active Goals</p>
              <h3 className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {goals.length}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-500">
              <Target className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Completed Goals</p>
              <h3 className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {completedGoalsCount}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Average Velocity</p>
              <h3 className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {overallAvgProgress}%
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-brand-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Goal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-900/40">
                        {goal.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          goal.priority === 'high'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                            : goal.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {goal.priority}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {goal.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => openEditGoal(goal)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit Goal"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Target:</span>{' '}
                  {goal.target}
                </p>

                {goal.notes && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                    Notes: {goal.notes}
                  </p>
                )}
              </div>

              {/* Progress Slider & Status */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" /> Due {goal.deadline}
                  </span>
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400">
                    {goal.progress}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) =>
                      updateGoal(goal.id, {
                        progress: Number(e.target.value),
                        status: Number(e.target.value) >= 100 ? 'completed' : 'in-progress',
                      })
                    }
                    className="w-full accent-brand-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD / EDIT GOAL MODAL */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingGoal ? 'Edit 2027 Goal' : 'Add 2027 Goal'}
              </h3>
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Distributed Systems, Run Marathon..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GoalCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  >
                    <option value="high">High Priority 🔥</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Progress: {progress}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full accent-brand-500 mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Measurable Target Definition *
                </label>
                <input
                  type="text"
                  required
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. Read 2 books per month, Save ₹3,00,000..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Action Steps & Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Strategy, daily blocks, resources..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD VISION TILE MODAL */}
      {isVisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Add Vision Board Tile
              </h3>
              <button
                type="button"
                onClick={() => setIsVisionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVision} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Vision Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={visionTitle}
                  onChange={(e) => setVisionTitle(e.target.value)}
                  placeholder="e.g. Peak Vitality, Tokyo Roadtrip, Dream Office..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={visionImageUrl}
                  onChange={(e) => setVisionImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={visionCategory}
                    onChange={(e) => setVisionCategory(e.target.value)}
                    placeholder="e.g. Travel, Career, Health..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={visionCaption}
                    onChange={(e) => setVisionCaption(e.target.value)}
                    placeholder="Brief description..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Motto / Inspiring Quote (Optional)
                </label>
                <input
                  type="text"
                  value={visionQuote}
                  onChange={(e) => setVisionQuote(e.target.value)}
                  placeholder="e.g. The journey of a thousand miles..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVisionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-lavender-600 hover:bg-lavender-700 text-white text-xs font-semibold shadow-sm"
                >
                  Save Vision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
