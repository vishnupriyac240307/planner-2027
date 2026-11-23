import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Search, X, Calendar, CheckSquare, Target, GraduationCap, BookOpen, CalendarHeart, ArrowRight } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { ActiveView } from '../types';

interface SearchResultItem {
  id: string;
  type: 'Task' | 'Event' | 'Goal' | 'Subject' | 'Journal' | 'Important Date';
  title: string;
  subtitle: string;
  view: ActiveView;
  date?: string;
}

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    tasks,
    events,
    goals,
    subjects,
    journalEntries,
    importantDates,
    setActiveView,
    setSelectedDate,
  } = usePlanner();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');

  // Handle open / close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isSearchOpen) {
      if (!dialog.open) {
        dialog.showModal();
        setQuery('');
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isSearchOpen]);

  // Global keyboard shortcuts (Cmd+K to open, N to open quick add)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      setIsSearchOpen(false);
    }
  };

  // Search indexing
  const results = useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const items: SearchResultItem[] = [];

    // Search tasks
    tasks.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.tags?.some(tag => tag.toLowerCase().includes(q))) {
        items.push({
          id: t.id,
          type: 'Task',
          title: t.title,
          subtitle: `${t.date} • ${t.category} • ${t.completed ? 'Completed' : 'Pending'}`,
          view: 'daily',
          date: t.date,
        });
      }
    });

    // Search events
    events.forEach((e) => {
      if (e.title.toLowerCase().includes(q) || e.notes?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q)) {
        items.push({
          id: e.id,
          type: 'Event',
          title: e.title,
          subtitle: `${e.date} • ${e.startTime || ''} - ${e.endTime || ''}`,
          view: 'calendar',
          date: e.date,
        });
      }
    });

    // Search goals
    goals.forEach((g) => {
      if (g.title.toLowerCase().includes(q) || g.target.toLowerCase().includes(q) || g.notes?.toLowerCase().includes(q)) {
        items.push({
          id: g.id,
          type: 'Goal',
          title: g.title,
          subtitle: `Target: ${g.deadline} • Progress: ${g.progress}%`,
          view: 'goals',
        });
      }
    });

    // Search subjects
    subjects.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)) {
        items.push({
          id: s.id,
          type: 'Subject',
          title: `${s.name} (${s.code})`,
          subtitle: `Progress: ${s.syllabusProgress}% • Instructor: ${s.instructor || 'N/A'}`,
          view: 'study',
        });
      }
    });

    // Search journal
    journalEntries.forEach((j) => {
      if (j.title.toLowerCase().includes(q) || j.content.toLowerCase().includes(q) || j.gratitude.some(g => g.toLowerCase().includes(q))) {
        items.push({
          id: j.id,
          type: 'Journal',
          title: j.title,
          subtitle: `${j.date} • Mood: ${j.mood}`,
          view: 'journal',
          date: j.date,
        });
      }
    });

    // Search important dates
    importantDates.forEach((d) => {
      if (d.title.toLowerCase().includes(q) || d.notes?.toLowerCase().includes(q)) {
        items.push({
          id: d.id,
          type: 'Important Date',
          title: d.title,
          subtitle: `${d.date} • ${d.type}`,
          view: 'important-dates',
          date: d.date,
        });
      }
    });

    return items.slice(0, 15);
  }, [query, tasks, events, goals, subjects, journalEntries, importantDates]);

  const handleSelectResult = (item: SearchResultItem) => {
    if (item.date) {
      setSelectedDate(item.date);
    }
    setActiveView(item.view);
    setIsSearchOpen(false);
  };

  const getIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'Task': return <CheckSquare className="w-4 h-4 text-brand-500" />;
      case 'Event': return <Calendar className="w-4 h-4 text-lavender-500" />;
      case 'Goal': return <Target className="w-4 h-4 text-emerald-500" />;
      case 'Subject': return <GraduationCap className="w-4 h-4 text-amber-500" />;
      case 'Journal': return <BookOpen className="w-4 h-4 text-indigo-500" />;
      case 'Important Date': return <CalendarHeart className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={() => setIsSearchOpen(false)}
      aria-labelledby="global-search-label"
      className="backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm bg-transparent p-0 m-auto max-w-2xl w-full rounded-2xl shadow-2xl focus:outline-none"
    >
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-slate-800 dark:text-slate-100 animate-slide-up">
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-5 h-5 text-slate-400" />
          <input
            type="search"
            autoFocus
            id="global-search-label"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, events, goals, journal, subjects in 2027..."
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="mt-4 max-h-96 overflow-y-auto space-y-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-slate-600 dark:text-slate-400">
              <p className="font-medium">Type any keyword to search across your 2027 digital planner.</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px]">Tasks</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px]">Calendar</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px]">Study</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px]">Goals</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px]">Journal</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-600 dark:text-slate-400">
              No results found for &ldquo;<span className="font-semibold text-slate-700 dark:text-slate-300">{query}</span>&rdquo;.
            </div>
          ) : (
            results.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                type="button"
                onClick={() => handleSelectResult(item)}
                className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-navy-850 hover:bg-brand-50/70 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 group transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-700">
                    {getIcon(item.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      <span className="font-medium text-slate-700 dark:text-slate-300">[{item.type}]</span> {item.subtitle}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </button>
            ))
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-600 dark:text-slate-400">
          <span>{results.length} result(s) found</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </dialog>
  );
};
