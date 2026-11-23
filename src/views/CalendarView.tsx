import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  X,
  Trash2,
  Edit,
  Tag,
  Check,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import {
  MONTH_NAMES,
  WEEKDAYS,
  WEEKDAYS_FULL,
  getMonthCalendarGrid,
  formatReadableDate,
  padZero,
  formatDateKey,
  HOURS_LIST,
  getDaysInMonth,
} from '../utils/calendarUtils';
import { CalendarEvent } from '../types';

type CalendarSubView = 'month' | 'year' | 'week' | 'day';

export const CalendarView: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    tasks,
    importantDates,
    setActiveView,
  } = usePlanner();

  const [subView, setSubView] = useState<CalendarSubView>('month');
  const [currentYear] = useState<number>(2027);

  // Modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(selectedDate);
  const [eventStartTime, setEventStartTime] = useState('10:00');
  const [eventEndTime, setEventEndTime] = useState('11:30');
  const [eventCategory, setEventCategory] = useState<CalendarEvent['category']>('work');
  const [eventColor, setEventColor] = useState('#0284C7');
  const [eventLocation, setEventLocation] = useState('');
  const [eventNotes, setEventNotes] = useState('');

  // Selected date parts
  const [selYear, selMonth, selDay] = selectedDate.split('-').map(Number);

  // Month navigation
  const handlePrevMonth = () => {
    if (selectedMonth > 1) {
      const newMonth = selectedMonth - 1;
      setSelectedMonth(newMonth);
      setSelectedDate(formatDateKey(2027, newMonth, 1));
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth < 12) {
      const newMonth = selectedMonth + 1;
      setSelectedMonth(newMonth);
      setSelectedDate(formatDateKey(2027, newMonth, 1));
    }
  };

  const openAddEventForDate = (dateStr: string) => {
    setEditingEvent(null);
    setEventDate(dateStr);
    setEventTitle('');
    setEventStartTime('09:00');
    setEventEndTime('10:00');
    setEventCategory('work');
    setEventColor('#0284C7');
    setEventLocation('');
    setEventNotes('');
    setIsEventModalOpen(true);
  };

  const openEditEvent = (evt: CalendarEvent) => {
    setEditingEvent(evt);
    setEventDate(evt.date);
    setEventTitle(evt.title);
    setEventStartTime(evt.startTime);
    setEventEndTime(evt.endTime);
    setEventCategory(evt.category);
    setEventColor(evt.color || '#0284C7');
    setEventLocation(evt.location || '');
    setEventNotes(evt.notes || '');
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        title: eventTitle.trim(),
        date: eventDate,
        startTime: eventStartTime,
        endTime: eventEndTime,
        category: eventCategory,
        color: eventColor,
        location: eventLocation.trim() || undefined,
        notes: eventNotes.trim() || undefined,
      });
    } else {
      addEvent({
        title: eventTitle.trim(),
        date: eventDate,
        startTime: eventStartTime,
        endTime: eventEndTime,
        category: eventCategory,
        color: eventColor,
        location: eventLocation.trim() || undefined,
        notes: eventNotes.trim() || undefined,
      });
    }

    setIsEventModalOpen(false);
  };

  // Monthly calendar grid cells
  const monthCells = useMemo(() => {
    return getMonthCalendarGrid(2027, selectedMonth, selectedDate);
  }, [selectedMonth, selectedDate]);

  // Index events and important dates by date
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((evt) => {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    });
    return map;
  }, [events]);

  const tasksByDate = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((t) => {
      map[t.date] = (map[t.date] || 0) + 1;
    });
    return map;
  }, [tasks]);

  const holidaysByDate = useMemo(() => {
    const map: Record<string, string> = {};
    importantDates.forEach((d) => {
      map[d.date] = d.title;
    });
    return map;
  }, [importantDates]);

  // Weekly calendar days (based on current selectedDate)
  const weekDays = useMemo(() => {
    const dateObj = new Date(selYear, selMonth - 1, selDay);
    const dayOfWeek = dateObj.getDay(); // 0 is Sun
    const startOfWeek = new Date(selYear, selMonth - 1, selDay - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const dayNum = d.getDate();
      days.push({
        dateStr: formatDateKey(y, m, dayNum),
        dayNum,
        dayName: WEEKDAYS[i],
        dayFullName: WEEKDAYS_FULL[i],
        isWeekend: i === 0 || i === 6,
        isCurrentYear: y === 2027,
      });
    }
    return days;
  }, [selYear, selMonth, selDay]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Calendar Top Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Left: Month title and prev/next */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={selectedMonth <= 1}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-navy-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              disabled={selectedMonth >= 12}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-navy-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
              {MONTH_NAMES[selectedMonth - 1]} 2027
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {getDaysInMonth(2027, selectedMonth)} Days • Selected: {formatReadableDate(selectedDate)}
            </p>
          </div>
        </div>

        {/* Center/Right: View Switcher (Month, Year, Week, Day) + Add Event */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-semibold">
            {(['month', 'year', 'week', 'day'] as CalendarSubView[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSubView(v)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                  subView === v
                    ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => openAddEventForDate(selectedDate)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: MONTHLY CALENDAR VIEW */}
      {subView === 'month' && (
        <div className="rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-navy-950/40 text-center py-3">
            {WEEKDAYS.map((day, idx) => (
              <div
                key={day}
                className={`text-xs font-bold uppercase tracking-wider ${
                  idx === 0 || idx === 6
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800">
            {monthCells.map((cell) => {
              const dayEvents = eventsByDate[cell.dateStr] || [];
              const taskCount = tasksByDate[cell.dateStr] || 0;
              const holidayTitle = holidaysByDate[cell.dateStr];
              const isSelected = selectedDate === cell.dateStr;

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => setSelectedDate(cell.dateStr)}
                  className={`min-h-[105px] sm:min-h-[120px] p-2 flex flex-col justify-between transition-colors cursor-pointer group relative ${
                    cell.isCurrentMonth
                      ? 'bg-white dark:bg-navy-900 hover:bg-slate-50 dark:hover:bg-navy-850'
                      : 'bg-slate-50/40 dark:bg-navy-950/30 text-slate-400 dark:text-slate-600 opacity-60'
                  } ${
                    cell.isWeekend
                      ? 'bg-pastel-ice/30 dark:bg-navy-850/20'
                      : ''
                  } ${
                    isSelected
                      ? 'ring-2 ring-inset ring-brand-500 bg-brand-50/30 dark:bg-brand-950/20'
                      : ''
                  }`}
                >
                  {/* Top row: day number & badges */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-brand-500 text-white shadow-sm'
                          : cell.isCurrentMonth
                          ? 'text-slate-800 dark:text-slate-200 group-hover:bg-slate-200 dark:group-hover:bg-slate-800'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {cell.day}
                    </span>

                    {taskCount > 0 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {taskCount} task{taskCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Middle: Holiday / Festival indicator */}
                  {holidayTitle && (
                    <div
                      className="mt-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded truncate border border-amber-200/60 dark:border-amber-900/40"
                      title={holidayTitle}
                    >
                      🎉 {holidayTitle}
                    </div>
                  )}

                  {/* Events list */}
                  <div className="mt-1 space-y-1 flex-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditEvent(evt);
                        }}
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded truncate text-white shadow-xs hover:opacity-90"
                        style={{ backgroundColor: evt.color || '#0284C7' }}
                        title={`${evt.title} (${evt.startTime} - ${evt.endTime})`}
                      >
                        {evt.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-slate-500 font-medium pl-1">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Hover Quick Add Event */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddEventForDate(cell.dateStr);
                    }}
                    className="opacity-0 group-hover:opacity-100 self-end p-1 rounded-md text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-slate-800 transition-opacity"
                    title="Add event to date"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: YEARLY CALENDAR VIEW (All 12 Months of 2027) */}
      {subView === 'year' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MONTH_NAMES.map((mName, mIdx) => {
            const mNum = mIdx + 1;
            const cells = getMonthCalendarGrid(2027, mNum, selectedDate);
            const isCurrentSelectedMonth = selectedMonth === mNum;

            return (
              <div
                key={mName}
                onClick={() => {
                  setSelectedMonth(mNum);
                  setSubView('month');
                }}
                className={`p-4 rounded-3xl bg-white dark:bg-navy-900 border transition-all cursor-pointer hover:shadow-card hover:border-brand-300 dark:hover:border-brand-700 ${
                  isCurrentSelectedMonth
                    ? 'border-brand-500 dark:border-brand-500 shadow-sm'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {mName}
                  </h4>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                    {getDaysInMonth(2027, mNum)}d
                  </span>
                </div>

                {/* Mini weekday header */}
                <div className="grid grid-cols-7 text-center text-[9px] font-bold text-slate-400 mb-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <span key={i}>{d}</span>
                  ))}
                </div>

                {/* Mini grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                  {cells.map((c) => {
                    const isToday = selectedDate === c.dateStr;
                    return (
                      <div
                        key={c.dateStr}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDate(c.dateStr);
                          setSelectedMonth(mNum);
                        }}
                        className={`py-0.5 rounded ${
                          c.isCurrentMonth
                            ? isToday
                              ? 'bg-brand-500 text-white font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      >
                        {c.day}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: WEEKLY CALENDAR VIEW */}
      {subView === 'week' && (
        <div className="rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 divide-x divide-slate-100 dark:divide-slate-800">
            {weekDays.map((w) => {
              const isSelected = selectedDate === w.dateStr;
              const holidayTitle = holidaysByDate[w.dateStr];

              return (
                <div
                  key={w.dateStr}
                  onClick={() => setSelectedDate(w.dateStr)}
                  className={`p-3 text-center cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-950/40'
                      : 'hover:bg-slate-50 dark:hover:bg-navy-850'
                  }`}
                >
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">
                    {w.dayName}
                  </span>
                  <div className="my-1">
                    <span
                      className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'bg-brand-500 text-white shadow-sm'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {w.dayNum}
                    </span>
                  </div>
                  {holidayTitle && (
                    <span className="block text-[9px] text-amber-600 dark:text-amber-400 font-bold truncate">
                      {holidayTitle}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Weekday details */}
          <div className="grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 min-h-[380px] p-2">
            {weekDays.map((w) => {
              const dayEvents = eventsByDate[w.dateStr] || [];
              const dayTasks = tasks.filter((t) => t.date === w.dateStr);

              return (
                <div key={w.dateStr} className="p-2 space-y-2">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">
                      {dayTasks.length} tasks
                    </span>
                    <button
                      type="button"
                      onClick={() => openAddEventForDate(w.dateStr)}
                      className="text-brand-600 dark:text-brand-400 hover:text-brand-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => openEditEvent(evt)}
                        className="p-1.5 rounded-lg text-white text-xs cursor-pointer shadow-xs hover:opacity-90"
                        style={{ backgroundColor: evt.color || '#0284C7' }}
                      >
                        <p className="font-bold truncate text-[11px]">{evt.title}</p>
                        <p className="text-[9px] opacity-90">
                          {evt.startTime} - {evt.endTime}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 4: DAILY CALENDAR VIEW */}
      {subView === 'day' && (
        <div className="rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {formatReadableDate(selectedDate)}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Hourly Timeline & Appointments
              </p>
            </div>
            <button
              type="button"
              onClick={() => openAddEventForDate(selectedDate)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </div>

          {/* Hourly Timeline from 5:00 AM to 11:00 PM */}
          <div className="space-y-3">
            {HOURS_LIST.map((hour) => {
              const matchedEvents = (eventsByDate[selectedDate] || []).filter(
                (e) => e.startTime.startsWith(hour.slice(0, 2))
              );

              return (
                <div
                  key={hour}
                  className="flex items-start gap-4 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-navy-850 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                >
                  <span className="w-16 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400 pt-1">
                    {hour}
                  </span>
                  <div className="flex-1 min-h-[36px] flex flex-wrap gap-2 items-center">
                    {matchedEvents.length === 0 ? (
                      <span className="text-xs text-slate-600 dark:text-slate-400 italic">
                        No appointments scheduled
                      </span>
                    ) : (
                      matchedEvents.map((e) => (
                        <div
                          key={e.id}
                          onClick={() => openEditEvent(e)}
                          className="px-3 py-1.5 rounded-xl text-white text-xs font-semibold shadow-sm cursor-pointer flex items-center gap-2 hover:opacity-90"
                          style={{ backgroundColor: e.color || '#0284C7' }}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{e.title}</span>
                          <span className="text-[10px] opacity-80">
                            ({e.startTime} - {e.endTime})
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EVENT ADD / EDIT MODAL */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingEvent ? 'Edit Calendar Event' : 'Add Calendar Event'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEventModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems Exam, Team Sync..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="work">Work</option>
                    <option value="study">Study</option>
                    <option value="personal">Personal</option>
                    <option value="exam">Exam</option>
                    <option value="festival">Festival</option>
                    <option value="holiday">Holiday</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Color Accent
                  </label>
                  <input
                    type="color"
                    value={eventColor}
                    onChange={(e) => setEventColor(e.target.value)}
                    className="w-full h-9 p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g. Lab 2, Google Meet, Home..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                {editingEvent && (
                  <button
                    type="button"
                    onClick={() => {
                      deleteEvent(editingEvent.id);
                      setIsEventModalOpen(false);
                    }}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsEventModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm"
                  >
                    Save Event
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
