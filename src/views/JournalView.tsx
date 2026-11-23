import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  Plus,
  Trash2,
  Star,
  Search,
  Calendar,
  Smile,
  Heart,
  Tag,
  X,
  FileText,
  Filter,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { JournalEntry, MoodType } from '../types';
import { formatReadableDate } from '../utils/calendarUtils';

const MOODS: { type: MoodType; emoji: string; label: string }[] = [
  { type: 'ecstatic', emoji: '🤩', label: 'Ecstatic' },
  { type: 'happy', emoji: '😊', label: 'Happy & Peaceful' },
  { type: 'neutral', emoji: '😐', label: 'Neutral' },
  { type: 'tired', emoji: '😴', label: 'Tired / Drained' },
  { type: 'stressed', emoji: '🤯', label: 'Stressed / Overwhelmed' },
  { type: 'sad', emoji: '😔', label: 'Down / Reflective' },
];

export const JournalView: React.FC = () => {
  const {
    journalEntries,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    toggleFavoriteJournal,
    selectedDate,
  } = usePlanner();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [filterMood, setFilterMood] = useState<string>('all');

  // Entry Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('happy');
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [brainDump, setBrainDump] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const openNewEntry = () => {
    setEditingEntry(null);
    setTitle('');
    setDate(selectedDate);
    setContent('');
    setMood('happy');
    setGratitude1('');
    setGratitude2('');
    setGratitude3('');
    setBrainDump('');
    setTagsInput('');
    setIsModalOpen(true);
  };

  const openEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setDate(entry.date);
    setContent(entry.content);
    setMood(entry.mood);
    setGratitude1(entry.gratitude[0] || '');
    setGratitude2(entry.gratitude[1] || '');
    setGratitude3(entry.gratitude[2] || '');
    setBrainDump(entry.brainDump || '');
    setTagsInput(entry.tags ? entry.tags.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const gratitudeList = [gratitude1.trim(), gratitude2.trim(), gratitude3.trim()].filter(
      Boolean
    );
    const tagsList = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (editingEntry) {
      updateJournalEntry(editingEntry.id, {
        title: title.trim(),
        date,
        content: content.trim(),
        mood,
        gratitude: gratitudeList,
        brainDump: brainDump.trim() || undefined,
        tags: tagsList,
      });
    } else {
      addJournalEntry({
        title: title.trim(),
        date,
        content: content.trim(),
        mood,
        gratitude: gratitudeList,
        brainDump: brainDump.trim() || undefined,
        tags: tagsList,
        isFavorite: false,
      });
    }

    setIsModalOpen(false);
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return journalEntries.filter((item) => {
      const matchFav = filterFavorites ? item.isFavorite : true;
      const matchMood = filterMood === 'all' ? true : item.mood === filterMood;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.date.includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        item.gratitude.some((g) => g.toLowerCase().includes(q));

      return matchFav && matchMood && matchQuery;
    });
  }, [journalEntries, filterFavorites, filterMood, searchQuery]);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-lavender dark:bg-lavender-950/40 text-lavender-700 dark:text-lavender-300 text-xs font-bold mb-1">
            <BookOpen className="w-3.5 h-3.5 text-lavender-500" />
            <span>Digital Sanctuary 2027</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
            Journal & Notes
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Daily logs, gratitude reflections, mental clarity dumps, and favorite 2027 memories.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewEntry}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> New Journal Entry
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries, keywords, tags, dates..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Mood filter */}
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Moods</option>
            {MOODS.map((m) => (
              <option key={m.type} value={m.type}>
                {m.emoji} {m.label}
              </option>
            ))}
          </select>

          {/* Favorite filter toggle */}
          <button
            type="button"
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl border font-semibold transition-all ${
              filterFavorites
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filterFavorites ? 'fill-current' : ''}`} />
            Favorites Only
          </button>
        </div>
      </div>

      {/* Journal Entries List */}
      <div className="space-y-6">
        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <p className="font-semibold text-sm">No journal entries found matching your query.</p>
            <button
              type="button"
              onClick={openNewEntry}
              className="mt-3 text-brand-600 dark:text-brand-400 font-bold hover:underline"
            >
              + Write an entry today
            </button>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const moodObj = MOODS.find((m) => m.type === entry.mood) || MOODS[1];

            return (
              <div
                key={entry.id}
                className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all space-y-4 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base" title={moodObj.label}>
                        {moodObj.emoji}
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-500">
                        {formatReadableDate(entry.date)}
                      </span>
                      {entry.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                      {entry.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleFavoriteJournal(entry.id)}
                      className={`p-1.5 rounded-xl transition-all ${
                        entry.isFavorite
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={entry.isFavorite ? 'Remove from favorites' : 'Mark as favorite memory'}
                    >
                      <Star className={`w-4 h-4 ${entry.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditEntry(entry)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteJournalEntry(entry.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {entry.content}
                </p>

                {/* Gratitude & Brain Dump Grid */}
                {(entry.gratitude.length > 0 || entry.brainDump) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {entry.gratitude.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-pastel-mint/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                          3 Things I&apos;m Grateful For
                        </span>
                        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                          {entry.gratitude.map((g, idx) => (
                            <li key={idx}>{g}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {entry.brainDump && (
                      <div className="p-3.5 rounded-2xl bg-pastel-ice/60 dark:bg-navy-850 border border-brand-100 dark:border-slate-800 space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                          Mental Clarity / Brain Dump
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {entry.brainDump}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ENTRY WRITE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingEntry ? 'Edit Journal Entry' : 'New Journal Reflection'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Entry Title *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Dawn of clarity, milestones..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
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
              </div>

              {/* Mood Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Today&apos;s Mood
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.type}
                      type="button"
                      onClick={() => setMood(m.type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                        mood === m.type
                          ? 'bg-brand-500 border-brand-500 text-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Journal Body */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Journal Reflections & Thoughts *
                </label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Capture how today felt, insights gained, breakthroughs..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 resize-none leading-relaxed"
                />
              </div>

              {/* Gratitude 3 Prompts */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-pastel-mint/30 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <label className="block text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                  3 Things I&apos;m Grateful For Today
                </label>
                <input
                  type="text"
                  value={gratitude1}
                  onChange={(e) => setGratitude1(e.target.value)}
                  placeholder="1. First blessing..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900"
                />
                <input
                  type="text"
                  value={gratitude2}
                  onChange={(e) => setGratitude2(e.target.value)}
                  placeholder="2. Second blessing..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900"
                />
                <input
                  type="text"
                  value={gratitude3}
                  onChange={(e) => setGratitude3(e.target.value)}
                  placeholder="3. Third blessing..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900"
                />
              </div>

              {/* Brain Dump & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Brain Dump (Unprocessed thoughts)
                  </label>
                  <textarea
                    rows={2}
                    value={brainDump}
                    onChange={(e) => setBrainDump(e.target.value)}
                    placeholder="Mental offloading..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="reflection, family, deep-work"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
