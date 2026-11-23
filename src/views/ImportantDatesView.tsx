import React, { useState, useMemo } from 'react';
import {
  CalendarHeart,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  AlertCircle,
  X,
  Cake,
  Heart,
  Award,
  Clock,
  Flag,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { ImportantDate, ImportantDateType } from '../types';
import {
  formatReadableDate,
  getDaysDifference,
} from '../utils/calendarUtils';

const DATE_TYPES: { id: ImportantDateType | 'all'; label: string; icon: any }[] = [
  { id: 'all', label: 'All Dates', icon: Calendar },
  { id: 'festival', label: 'Festivals', icon: Sparkles },
  { id: 'holiday', label: 'Public Holidays', icon: Flag },
  { id: 'birthday', label: 'Birthdays', icon: Cake },
  { id: 'anniversary', label: 'Anniversaries', icon: Heart },
  { id: 'exam', label: 'Exams', icon: Award },
  { id: 'deadline', label: 'Deadlines', icon: Clock },
  { id: 'personal', label: 'Personal Milestones', icon: CalendarHeart },
];

export const ImportantDatesView: React.FC = () => {
  const {
    importantDates,
    addImportantDate,
    updateImportantDate,
    deleteImportantDate,
    selectedDate,
    setSelectedDate,
    setActiveView,
  } = usePlanner();

  const [selectedType, setSelectedType] = useState<ImportantDateType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDate, setEditingDate] = useState<ImportantDate | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2027-01-01');
  const [type, setType] = useState<ImportantDateType>('festival');
  const [notes, setNotes] = useState('');
  const [isRegionalVar, setIsRegionalVar] = useState(false);

  const openAdd = () => {
    setEditingDate(null);
    setTitle('');
    setDate('2027-01-01');
    setType('festival');
    setNotes('');
    setIsRegionalVar(false);
    setIsModalOpen(true);
  };

  const openEdit = (d: ImportantDate) => {
    setEditingDate(d);
    setTitle(d.title);
    setDate(d.date);
    setType(d.type);
    setNotes(d.notes || '');
    setIsRegionalVar(!!d.isRegionalVar);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingDate) {
      updateImportantDate(editingDate.id, {
        title: title.trim(),
        date,
        type,
        notes: notes.trim() || undefined,
        isRegionalVar,
      });
    } else {
      addImportantDate({
        title: title.trim(),
        date,
        type,
        notes: notes.trim() || undefined,
        isRegionalVar,
      });
    }

    setIsModalOpen(false);
  };

  // Filtered and sorted dates
  const filteredDates = useMemo(() => {
    return importantDates
      .filter((d) => {
        const matchType = selectedType === 'all' ? true : d.type === selectedType;
        const q = searchQuery.toLowerCase().trim();
        const matchQuery =
          !q ||
          d.title.toLowerCase().includes(q) ||
          d.date.includes(q) ||
          d.notes?.toLowerCase().includes(q);
        return matchType && matchQuery;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [importantDates, selectedType, searchQuery]);

  const getTypeBadge = (t: ImportantDateType) => {
    switch (t) {
      case 'festival':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'holiday':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'birthday':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'anniversary':
        return 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 border-pink-200 dark:border-pink-800';
      case 'exam':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'deadline':
        return 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-lavender dark:bg-lavender-950/40 text-lavender-700 dark:text-lavender-300 text-xs font-bold mb-1">
            <CalendarHeart className="w-3.5 h-3.5 text-lavender-500" />
            <span>2027 Occasions & Calendar</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
            Important Dates & Indian Holidays
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Comprehensive gazetted public holidays, festivals, birthdays, exams, and milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Important Date
        </button>
      </div>

      {/* Indian Lunar & Regional Calendar Clarification Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">Indian Festivals & Lunar Dates Note:</span> 2027 dates for
          festivals such as Eid-ul-Fitr, Eid al-Adha, and Muharram depend on local crescent moon
          sightings. Hindu festivals (such as Maha Shivratri, Holi, Janmashtami, Diwali) follow the
          traditional lunisolar Panchang, where regional thithi calculations or state government
          notifications may vary by 1 day.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full md:w-auto scrollbar-thin">
          {DATE_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedType === t.id
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-navy-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search occasion or date..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDates.map((item) => {
          const daysDiff = getDaysDifference(selectedDate, item.date);

          return (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getTypeBadge(
                      item.type
                    )}`}
                  >
                    {item.type}
                  </span>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="p-1 text-slate-400 hover:text-brand-600"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteImportantDate(item.id)}
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h4>

                {item.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.notes}
                  </p>
                )}

                {item.isRegionalVar && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium italic">
                    * Regional date variation possible based on lunar sighting.
                  </p>
                )}
              </div>

              {/* Bottom Row: Date & Countdown */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {item.date}
                </span>

                <span
                  className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    daysDiff === 0
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold'
                      : daysDiff > 0 && daysDiff <= 14
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {daysDiff === 0
                    ? 'Today!'
                    : daysDiff > 0
                    ? `In ${daysDiff} days`
                    : `${Math.abs(daysDiff)}d ago`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingDate ? 'Edit Occasion' : 'Add Important Date'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Occasion Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Diwali, Sister's Wedding, Final Exam..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ImportantDateType)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  >
                    <option value="festival">Festival</option>
                    <option value="holiday">Public Holiday</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="exam">Exam</option>
                    <option value="deadline">Deadline</option>
                    <option value="personal">Personal Event</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Celebration Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Family plans, rituals, gifts, venue..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="regVar"
                  checked={isRegionalVar}
                  onChange={(e) => setIsRegionalVar(e.target.checked)}
                  className="rounded border-slate-300 text-brand-500 focus:ring-brand-400"
                />
                <label htmlFor="regVar" className="text-xs text-slate-600 dark:text-slate-300">
                  Regional or lunar calendar variation warning
                </label>
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
                  Save Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
